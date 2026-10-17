// 用 AI 生成的素材合成成片声音（Higgsfield：Sonilo Music 配乐 + Seed Audio 1.0 音效）：npm run audio:ai [-- en]
// 素材在 ../audio/raw（原始下载，见 ../audio/generate.mjs 与 sfx.json）；这里先把每条处理成 ../audio/samples/<name>.wav
// （转 44.1 kHz 单声道、切掉开头和结尾的静音、峰值归一），再按 cues.ts 的事件表逐个放到时间线上，配乐垫底，
// 输出 ../audio/out[_en]/{music,sfx,mix}.wav（母带约 −14 LUFS，同 build.ts）。事件时间与画面同源，改了画面节奏重跑即可
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { Bus, SR, Sig, db, limit, loudness, readWav, resample, rng, writeWav } from './dsp';
import { END, buildCues, type Cue, type Kind } from './cues';
import type { Lang } from '../src/copy';

const lang: Lang = process.argv[2] === 'en' ? 'en' : 'zh';
const ROOT = path.resolve('../audio');
const RAW = path.join(ROOT, 'raw'), SAMPLES = path.join(ROOT, 'samples'), OUT = path.join(ROOT, lang === 'en' ? 'out_en' : 'out');
fs.mkdirSync(SAMPLES, { recursive: true }); fs.mkdirSync(OUT, { recursive: true });
const FF = path.resolve('node_modules/@remotion/compositor-darwin-arm64');
const ffmpeg = (args: string[]) => execFileSync(path.join(FF, 'ffmpeg'), ['-v', 'error', '-y', ...args], { env: { ...process.env, DYLD_LIBRARY_PATH: FF } });

// ---------- 素材处理 ----------
/** 原始素材 → 44.1 kHz 16 bit；音效单声道，配乐立体声 */
const convert = (src: string, dst: string, ch: 1 | 2) => ffmpeg(['-i', src, '-ac', String(ch), '-ar', String(SR), '-sample_fmt', 's16', dst]);
/** 切掉开头 / 结尾低于峰值 −40 dB 的静音（开头留 5 ms），末尾 20 ms 淡出，峰值归一到 −1 dBFS */
const tidy = (s: Sig): Sig => {
  let pk = 0; for (const v of s) pk = Math.max(pk, Math.abs(v));
  if (!pk) return s;
  const th = pk * db(-40);
  let a = 0; while (a < s.length && Math.abs(s[a]) < th) a++;
  let b = s.length - 1; while (b > a && Math.abs(s[b]) < th) b--;
  a = Math.max(0, a - Math.round(0.005 * SR));
  const o = s.slice(a, b + 1), g = db(-1) / pk, fo = Math.min(o.length, Math.round(0.02 * SR));
  for (let i = 0; i < o.length; i++) o[i] *= g * Math.min(1, (o.length - i) / fo);
  return o;
};
const sfxNames = JSON.parse(fs.readFileSync(path.join(ROOT, 'sfx.json'), 'utf8')).items as { name: string; kind: Kind; cuts?: [number, number][] }[];
const S: Record<string, Sig> = {};
for (const { name } of sfxNames) {
  const raw = path.join(RAW, `${name}.wav`), out = path.join(SAMPLES, `${name}.wav`);
  if (!fs.existsSync(raw)) { console.warn(`缺素材：${name}（先跑 ../audio/generate.mjs）`); continue; }
  if (!fs.existsSync(out) || fs.statSync(out).mtimeMs < fs.statSync(raw).mtimeMs) {
    const tmp = path.join(SAMPLES, `.${name}.tmp.wav`);
    convert(raw, tmp, 1);
    const b = new Bus(0); const sig = tidy(readWav(tmp)); fs.unlinkSync(tmp);
    b.L = sig; b.R = sig; writeWav(out, b);
  }
  S[name] = readWav(out);
}
/** 立体声 WAV（readWav 只读第一声道） */
const readStereo = (p: string) => {
  const b = fs.readFileSync(p); let o = 12;
  while (b.toString('ascii', o, o + 4) !== 'data') o += 8 + b.readUInt32LE(o + 4);
  const n = b.readUInt32LE(o + 4) / 4, d = o + 8, L = new Float32Array(n), R = new Float32Array(n);
  for (let i = 0; i < n; i++) { L[i] = b.readInt16LE(d + 4 * i) / 32768; R[i] = b.readInt16LE(d + 4 * i + 2) / 32768; }
  return { L, R };
};
const BGM_RAW = fs.readdirSync(RAW).find((f) => /^bgm_1\.(m4a|mp3|wav)$/.test(f));
const BGM = path.join(SAMPLES, 'bgm.wav');
if (BGM_RAW && (!fs.existsSync(BGM) || fs.statSync(BGM).mtimeMs < fs.statSync(path.join(RAW, BGM_RAW)).mtimeMs)) convert(path.join(RAW, BGM_RAW), BGM, 2);

// ---------- 事件 → 素材 ----------
/** 截一段（3 ms 淡入、20 ms 淡出） */
const cut = (s: Sig, a: number, l: number): Sig => {
  const o = s.slice(Math.round(a * SR), Math.round((a + l) * SR)), fi = Math.round(0.003 * SR), fo = Math.min(o.length, Math.round(0.02 * SR));
  for (let i = 0; i < o.length; i++) o[i] *= Math.min(1, i / fi, (o.length - i) / fo);
  return o;
};
// 每条素材按 cuts 截成一个或多个变体（没有 cuts 就整条用）
const byKind: Partial<Record<Kind, string[]>> = {};
for (const { name, kind, cuts } of sfxNames) {
  if (!S[name]) continue;
  const vs = cuts?.length ? cuts.map(([a, l], i) => { const k = `${name}#${i}`; S[k] = cut(S[name], a, l); return k; }) : [name];
  (byKind[kind] ??= []).push(...vs);
}
/** 每类声音的电平（dB，素材都归一到 −1 dBFS 之后再乘） */
const LEVEL: Partial<Record<Kind, number>> = {
  key: -14, keyHeavy: -12, keyBang: -9, enter: -10, click: -12, tap: -14, pop: -13, ding: -14, tick: -16,
  swish: -15, sheetUp: -15, sheetDown: -16, shutter: -10, recStart: -13, recStop: -13, murmur: -22, stream: -24,
  whoosh: -11, riser: -14, impact: -8, arc: -12, dotUp: -15, dotLand: -14,
  slide: -14, meow: -8, retract: -15, boing: -12, land: -12, trampoline: -14, blink: -18,
  word: -12, swap: -13, fall: -14, swell: -14, logo: -8, line: -16,
};
const ALIAS: Partial<Record<Kind, Kind>> = { keyBang: 'keyHeavy' }; // 没有单独素材的类型借用相近的
const C_PHONE = (c: Cue) => (c.phone ? 0.35 : 0); // 插段里手机在画面右侧
/** 截到 dur 秒（末尾 60 ms 淡出）；比素材长就首尾交叉循环 */
const fit = (s: Sig, dur?: number): Sig => {
  if (!dur) return s;
  const n = Math.round(dur * SR), x = Math.round(0.08 * SR), o = new Float32Array(n);
  for (let i = 0, p = 0; i < n; i++, p++) {
    if (p >= s.length - x && s.length > 2 * x) { p = x; }
    o[i] = s[p] ?? 0;
  }
  const fo = Math.min(n, Math.round(0.06 * SR));
  for (let i = 0; i < n; i++) o[i] *= Math.min(1, (n - i) / fo, i / Math.min(n, Math.round(0.01 * SR)) + (i ? 0 : 1));
  return o;
};
const rand = rng(7);
const turn: Record<string, number> = {};
const music = new Bus(END), sfx = new Bus(END);
for (const c of buildCues(lang)) {
  const kind = byKind[c.k] ? c.k : ALIAS[c.k];
  const names = kind && byKind[kind];
  if (!names) continue;
  const name = names[(turn[kind!] = ((turn[kind!] ?? -1) + 1)) % names.length]; // 同类多个变体轮流用
  let s = fit(S[name], c.dur);
  if (c.k === 'key' || c.k === 'keyHeavy' || c.k === 'tap') s = resample(s, 0.94 + rand() * 0.12); // 打字：每下音高、响度略有不同，不机械
  const g = db((LEVEL[c.k] ?? -14) + (c.k === 'key' ? (rand() - 0.5) * 3 : 0)) * (c.v ?? 1);
  sfx.add(s, c.t, g, C_PHONE(c));
}
if (fs.existsSync(BGM)) {
  const { L, R } = readStereo(BGM);
  const n = Math.min(L.length, music.L.length);
  music.L.set(L.subarray(0, n)); music.R.set(R.subarray(0, n));
  // 配乐比音效低一截：配乐响度对齐到 −20，音效叠在上面；结尾 1.5 秒淡出
  music.scale(db(-20 - loudness(music)));
  music.automate((t) => Math.min(1, (END - t) / 1.5));
}

// ---------- 母带 ----------
const mix = new Bus(END); mix.mix(music); mix.mix(sfx);
const L0 = loudness(mix), g = db(-14 - L0);
mix.scale(g); limit(mix, db(-3)); // 与 build.ts 相同：留余量，成片里 render-final 的 loudnorm 精确校到 −14 LUFS
music.scale(g); sfx.scale(g);
writeWav(path.join(OUT, 'music.wav'), music); writeWav(path.join(OUT, 'sfx.wav'), sfx); writeWav(path.join(OUT, 'mix.wav'), mix);
console.log(`AI 素材版：音效 ${sfxNames.filter((x) => S[x.name]).length} 条素材（${Object.values(byKind).flat().length} 个变体）、配乐 ${fs.existsSync(BGM) ? '有' : '无'} · 原始响度 ${L0.toFixed(1)} dB → −14 · ${OUT}/mix.wav`);
