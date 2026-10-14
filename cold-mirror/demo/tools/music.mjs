// 预览配乐：读 src/timing.json，按节拍和关键帧合成音乐 + 音效 → public/soundtrack.wav
// 120 BPM；所有音效都落在画面用的同一批关键帧上。最后用 Remotion 自带的 ffmpeg 量响度，归一到 −14 LUFS、真峰值 ≤ −2 dBTP。
// 用法：node tools/music.mjs
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const T = JSON.parse(fs.readFileSync(path.join(root, 'src/timing.json'), 'utf8'));
const K = T.k, SR = 48000, FPS = T.fps;
const sec = (f) => f / FPS;
const BEAT = sec(T.beat), BAR = sec(T.bar), DUR = sec(T.total) + 1.5;
const N = Math.ceil(DUR * SR);
const L = new Float32Array(N), R = new Float32Array(N);
const music = new Float32Array(N); // 音乐床的增益包络（静音段用），音效不受影响

// 确定性噪声
let seed = 1;
const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296 * 2 - 1; };
const hz = (m) => 440 * 2 ** ((m - 69) / 12);

function add(t0, len, fn, { gain = 1, pan = 0, bed = false } = {}) {
  const a = Math.floor(t0 * SR), n = Math.floor(len * SR);
  const gl = gain * Math.cos((pan + 1) * Math.PI / 4), gr = gain * Math.sin((pan + 1) * Math.PI / 4);
  for (let i = 0; i < n; i++) {
    const j = a + i; if (j < 0 || j >= N) continue;
    const v = fn(i / SR, i / n);
    const m = bed ? music[j] : 1;
    L[j] += v * gl * m; R[j] += v * gr * m;
  }
}
const env = (t, a, d) => (t < a ? t / a : Math.exp(-(t - a) / d));

// ── 音乐床的增益：默认 1；S12 结尾硬停一拍半，S13 半速回来 ──
music.fill(1);
for (let j = Math.floor(sec(K.silence[0]) * SR); j < Math.floor(sec(K.silence[1]) * SR); j++) music[j] = 0;

// 和弦：每 2 小节换一个（F maj7 → E m7 → D m9 → C maj7），收尾落回 F maj9
const CH = [[53, 57, 60, 64], [52, 55, 59, 62], [50, 53, 57, 64], [48, 52, 55, 59]];
const chordAt = (bar) => (bar >= 15 ? [41, 53, 57, 60, 64, 67] : CH[Math.floor(bar / 2) % 4]);

// Pad：慢起音的柔和锯齿（一阶低通），全片
for (let b = 0; b < 16; b++) {
  const chord = chordAt(b), t0 = b * BAR, len = b === 15 ? BAR + 1.5 : BAR + 0.3;
  const lvl = b < 2 ? 0.05 : b < 6 ? 0.07 : b < 12 ? 0.08 : 0.07;
  for (const m of chord) {
    const f = hz(m); let y = 0;
    add(t0, len, (t, u) => {
      const saw = ((t * f) % 1) * 2 - 1 + 0.5 * (((t * f * 1.004) % 1) * 2 - 1);
      y += 0.06 * (saw - y);
      const a = Math.min(1, t / 0.35) * Math.min(1, (len - t) / 0.3);
      return y * a;
    }, { gain: lvl, pan: (m % 5) / 5 - 0.4, bed: true });
  }
}

// Pluck：第 3–6 小节，八分音符琶音
for (let b = 2; b < 6; b++) {
  const chord = chordAt(b);
  for (let e = 0; e < 8; e++) {
    const m = chord[[0, 2, 1, 3, 2, 1, 3, 2][e]] + 12, f = hz(m);
    add(b * BAR + e * BEAT / 2, 0.45, (t) => (Math.sin(2 * Math.PI * f * t) + 0.3 * Math.sin(4 * Math.PI * f * t)) * Math.exp(-t / 0.12), { gain: 0.09, pan: e % 2 ? 0.3 : -0.3, bed: true });
  }
}

// 鼓组
const kick = (t0, g = 0.8) => add(t0, 0.4, (t) => Math.sin(2 * Math.PI * (45 * t + 90 * 0.04 * (1 - Math.exp(-t / 0.04)))) * Math.exp(-t / 0.14), { gain: g, bed: true });
const clap = (t0, g = 0.25) => { let y = 0; add(t0, 0.25, (t) => { const n = rnd(); y += 0.5 * (n - y); return (n - y) * Math.exp(-t / 0.06); }, { gain: g, bed: true }); };
const hat = (t0, g = 0.08, pan = 0.2) => { let p = 0; add(t0, 0.06, (t) => { const n = rnd(); const h = n - p; p = n; return h * Math.exp(-t / 0.015); }, { gain: g, pan, bed: true }); };
const bass = (t0, m, len, g = 0.22) => { const f = hz(m); add(t0, len, (t) => Math.tanh(2 * Math.sin(2 * Math.PI * f * t)) * Math.min(1, t / 0.005) * Math.exp(-t / 0.25), { gain: g, bed: true }); };

// 第 4–6 小节：轻踩点（每拍一个轻 kick），第 7–12 小节：完整节拍
for (let b = 3; b < 6; b++) for (let q = 0; q < 4; q++) kick(b * BAR + q * BEAT, 0.35);
for (let b = 6; b < 12; b++) {
  for (let q = 0; q < 4; q++) {
    const t = b * BAR + q * BEAT;
    kick(t);
    if (q % 2) clap(t);
    hat(t + BEAT / 2);
    bass(t, chordAt(b)[0] - 12, BEAT * 0.9);
    bass(t + BEAT / 2, chordAt(b)[0] - 12, BEAT * 0.45, 0.14);
  }
}
// 第 13 小节：半速回来（静音之后）
for (const q of [2]) { kick(12 * BAR + q * BEAT, 0.7); bass(12 * BAR + q * BEAT, chordAt(12)[0] - 12, BEAT * 1.8); }
clap(12 * BAR + 3 * BEAT + BEAT / 2, 0.18);
// 第 14–15 小节：每小节一个低 kick，空出来给字母音
for (const b of [13, 14]) kick(b * BAR, 0.45);

// ── 音效（都挂在画面的关键帧上，不受静音段影响） ──
// 玻璃「叮」：S1 光线起
add(sec(K.edgeLight[0]), 3, (t) => (Math.sin(2 * Math.PI * 2093 * t) + 0.6 * Math.sin(2 * Math.PI * 3136 * t) + 0.3 * Math.sin(2 * Math.PI * 5274 * t)) * Math.exp(-t / 0.7), { gain: 0.12 });
// 光线划过斜边：一阵细的噪声
{ let y = 0; const len = sec(K.edgeLight[1] - K.edgeLight[0]); add(sec(K.edgeLight[0]), len, (t, u) => { y += 0.08 * (rnd() - y); return y * Math.sin(Math.PI * u) ; }, { gain: 0.25 }); }
// 触摸：轻点
const tap = (f) => add(sec(f), 0.05, (t) => Math.sin(2 * Math.PI * 1800 * t) * Math.exp(-t / 0.008), { gain: 0.25 });
tap(K.tap); K.sweeps5.forEach((f) => tap(f - 1));
// 镜面扫光：玻璃质感的「刷」，带通噪声往上扫
const sweep = (f, frames, g = 0.3) => { let y1 = 0, y2 = 0; const len = sec(frames); add(sec(f), len + 0.15, (t) => {
  const u = Math.min(1, t / len), fc = 1500 + 7000 * u, k = 2 * Math.sin(Math.PI * fc / SR);
  const n = rnd(); y1 += k * (n - y1 - 0.3 * y2); y2 += k * y1;   // 简易带通
  return y1 * Math.sin(Math.PI * Math.min(1, t / (len + 0.15))) ;
}, { gain: g }); };
sweep(K.sweep4, 12, 0.35); K.sweeps5.forEach((f) => sweep(f, T.sweepDur));
sweep(K.lamp[0], K.lamp[1] - K.lamp[0], 0.25); sweep(K.doorEdge[0], K.doorEdge[1] - K.doorEdge[0], 0.25);
// 穿镜：反向混响式渐强 → 门开阳光：重击 + 长尾
{ let y = 0; const a = sec(K.push[0]), b = sec(288); add(a, b - a, (t, u) => { y += 0.05 * (rnd() - y); return y * u ** 3 * 2; }, { gain: 0.5 });
  add(a, b - a, (t, u) => Math.sin(2 * Math.PI * hz(65) * t) * u ** 2, { gain: 0.08 }); }
add(sec(288), 2.2, (t) => rnd() * Math.exp(-t / 0.5) * 0.6 + Math.sin(2 * Math.PI * 50 * t) * Math.exp(-t / 0.3), { gain: 0.35 });
// 快门：咔嚓（两个短促的瞬态）
const shutter = (f, g = 0.35) => { add(sec(f), 0.03, (t) => rnd() * Math.exp(-t / 0.004), { gain: g }); add(sec(f) + 0.045, 0.04, (t) => rnd() * Math.exp(-t / 0.006), { gain: g * 0.8 }); };
[K.shutter8, K.shutter9, ...K.montage].forEach((f) => shutter(f));
K.flicker.forEach((f) => shutter(f, 0.28));
// 公交车 / 甩镜头：左到右的呼啸
const whoosh = (f0, f1, g) => { let y = 0; const len = sec(f1 - f0); add(sec(f0), len, (t, u) => { y += (0.02 + 0.2 * Math.sin(Math.PI * u)) * (rnd() - y); return y * Math.sin(Math.PI * u); }, { gain: g, pan: 0 }); };
whoosh(K.bus[0] - 4, K.bus[1] + 4, 0.5); whoosh(K.whip[0], K.whip[1] + 2, 0.4);
// 街道环境声：静音之后淡入
{ let y = 0; const a = sec(K.silence[0] + 4), len = sec(at(14) - K.silence[0] - 4); add(a, len, (t, u) => { y += 0.01 * (rnd() - y); return y * Math.min(1, u * 4) * Math.min(1, (1 - u) * 6); }, { gain: 0.6 }); }
// 剪刀合上
add(sec(K.snip), 0.08, (t) => (Math.sin(2 * Math.PI * 4200 * t) + rnd() * 0.6) * Math.exp(-t / 0.012), { gain: 0.3 });
add(sec(K.snip) + 0.05, 0.1, (t) => (Math.sin(2 * Math.PI * 3600 * t) + rnd() * 0.5) * Math.exp(-t / 0.02), { gain: 0.25 });
// 字母归位：每个一声咔哒 + 上行五声音阶（C D E G A C）
[72, 74, 76, 79, 81, 84].forEach((m, i) => {
  const f = hz(m), t0 = sec(K.letters[i]);
  add(t0, 0.03, (t) => rnd() * Math.exp(-t / 0.005), { gain: 0.2 });
  add(t0, 1.2, (t) => (Math.sin(2 * Math.PI * f * t) + 0.25 * Math.sin(6 * Math.PI * f * t)) * Math.exp(-t / 0.35), { gain: 0.12, pan: (i - 2.5) / 4 });
});
// 收尾和弦
for (const m of [41, 53, 60, 64, 67, 72]) add(sec(K.logo), 3, (t) => Math.sin(2 * Math.PI * hz(m) * t) * Math.min(1, t / 0.02) * Math.exp(-t / 1.4), { gain: 0.06 });

function at(n) { return (n - 1) * T.bar; }

// ── 写 WAV、量响度、归一 ──
function write(file, gain) {
  const buf = Buffer.alloc(44 + N * 4);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVE', 8); buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
  for (let i = 0; i < N; i++) {
    // 软限幅：样本峰值压在 −3 dBFS 以内，真峰值才能 ≤ −2 dBTP
    const lim = (x) => 0.7 * Math.tanh((x * gain) / 0.7);
    buf.writeInt16LE(Math.round(lim(L[i]) * 32767), 44 + i * 4);
    buf.writeInt16LE(Math.round(lim(R[i]) * 32767), 46 + i * 4);
  }
  fs.writeFileSync(file, buf);
}
const file = path.join(root, 'public/soundtrack.wav');
let gain = 1;
for (let pass = 0; pass < 4; pass++) {
  write(file, gain);
  // Remotion 自带的 ffmpeg 没有 ebur128，用 loudnorm 只做测量（增益自己乘）
  const log = spawnSync('npx', ['remotion', 'ffmpeg', '-hide_banner', '-nostats', '-i', file, '-af', 'loudnorm=I=-14:TP=-2:print_format=json', '-f', 'null', '-'], { cwd: root, encoding: 'utf8' }).stderr;
  const I = Number(log.match(/"input_i" : "(-?[\d.]+)"/)?.[1]);
  const P = Number(log.match(/"input_tp" : "(-?[\d.]+)"/)?.[1]);
  console.log(`pass ${pass}: gain ${gain.toFixed(3)}  I = ${I} LUFS  true peak = ${P} dBTP`);
  if (!Number.isFinite(I) || Math.abs(I + 14) < 0.3) break;
  gain *= 10 ** ((-14 - I) / 20);
}
console.log('wrote', path.relative(root, file));
