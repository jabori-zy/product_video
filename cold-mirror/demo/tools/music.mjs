// 预览配乐：读 src/timing.json，按节拍和关键帧合成音乐 + 音效 → public/soundtrack.wav
// 风格：K-pop 舞曲 / EDM（supersaw、808、人声切片），120 BPM；所有音效都落在画面用的同一批关键帧上。最后用 Remotion 自带的 ffmpeg 量响度，归一到 −14 LUFS、真峰值 ≤ −2 dBTP。
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

// ── 音乐：K-pop 舞曲 / EDM，A 小调，每小节一个和弦 Am – F – C – G（vi–IV–I–V）──
// 段落（小节，1 起）：1–2 前奏 · 3–5 主歌 · 6 Build（军鼓滚奏 + 噪声上升 + 滤波打开，最后半拍静音）
//                   · 7–12 Drop（四踩、泵感 supersaw、808、高八度主旋律、人声切片）· 13 半速 · 14–15 收 · 16 尾和弦
const PROG = [[57, 60, 64, 69], [53, 57, 60, 65], [55, 60, 64, 67], [55, 59, 62, 67]];
const ROOT = [33, 29, 36, 31];                       // 808 根音（A1 F1 C2 G1）
const chordAt = (bar) => PROG[bar % 4];
const S16 = BEAT / 4;
const DROP = [6, 12];                                // Drop 的小节下标范围 [6, 12)
const inDrop = (bar) => bar >= DROP[0] && bar < DROP[1];

// Build 结尾、Drop 之前空半拍
for (let j = Math.floor((6 * BAR - BEAT / 2) * SR); j < Math.floor(6 * BAR * SR); j++) music[j] = 0;

// Supersaw：7 根失谐锯齿，两级一阶低通；Drop 里每拍被底鼓「压」一下（sidechain 泵感）
const DET = [-0.11, -0.065, -0.03, 0, 0.03, 0.065, 0.11]; // 半音
const cutoffAt = (bar, u) => bar < 2 ? 500 + 900 * (bar + u) / 2 : bar < 5 ? 1300 : bar === 5 ? 1300 + 5500 * u ** 2 : inDrop(bar) ? 5200 : bar === 12 ? 900 : 2200;
const sawGain = (bar) => bar < 2 ? 0.035 : bar < 5 ? 0.022 : bar === 5 ? 0.03 : inDrop(bar) ? 0.045 : bar === 12 ? 0.03 : 0.026;
for (let b = 0; b < 15; b++) {
  const t0 = b * BAR, len = BAR + 0.05;
  for (const m of chordAt(b)) {
    DET.forEach((d, v) => {
      const f = hz(m + d); let y1 = 0, y2 = 0, ph = (v * 0.137) % 1;
      add(t0, len, (t, u) => {
        ph += f / SR; ph -= Math.floor(ph);
        const a = 1 - Math.exp(-2 * Math.PI * cutoffAt(b, u) / SR);
        y1 += a * (ph * 2 - 1 - y1); y2 += a * (y1 - y2);
        const tb = (t0 + t) % BEAT;
        const duck = inDrop(b) ? 0.25 + 0.75 * Math.min(1, tb / 0.22) ** 0.7 : 1;
        return y2 * duck * Math.min(1, t / 0.01) * Math.min(1, (len - t) / 0.03);
      }, { gain: sawGain(b), pan: (v - 3) / 4.5, bed: true });
    });
  }
}

// 808：正弦，起音时音高下滑一个八度，软饱和
const sub = (t0, m, len, g = 0.42, tape = false) => {
  const f = hz(m); let ph = 0;
  add(t0, len, (t) => {
    const k = tape ? Math.max(0.15, 1 - t / len) ** 2 : 1;            // 尾音像磁带停转一样往下掉
    ph += f * k * (1 + Math.exp(-t / 0.03)) / SR;
    return Math.tanh(2.6 * Math.sin(2 * Math.PI * ph)) * Math.min(1, t / 0.003) * Math.exp(-t / (tape ? 0.9 : 0.45));
  }, { gain: g, bed: true });
};
// 鼓
const kick = (t0, g = 0.9) => { let ph = 0; add(t0, 0.35, (t) => { ph += (48 + 110 * Math.exp(-t / 0.03)) / SR; return Math.sin(2 * Math.PI * ph) * Math.exp(-t / 0.16) + (t < 0.004 ? rnd() * 0.5 : 0); }, { gain: g, bed: true }); };
const snare = (t0, g = 0.3) => { let y = 0; add(t0, 0.22, (t) => { const n = rnd(); y += 0.35 * (n - y); return (n - y) * Math.exp(-t / 0.07) + 0.6 * Math.sin(2 * Math.PI * 190 * t) * Math.exp(-t / 0.04); }, { gain: g, bed: true }); };
const clap = (t0, g = 0.22) => [0, 0.011, 0.022].forEach((d, i) => { let y = 0; add(t0 + d, i === 2 ? 0.2 : 0.02, (t) => { const n = rnd(); y += 0.6 * (n - y); return (n - y) * Math.exp(-t / (i === 2 ? 0.05 : 0.006)); }, { gain: g, pan: (i - 1) * 0.15, bed: true }); });
const hat = (t0, g = 0.06, open = false) => { let p = 0; add(t0, open ? 0.2 : 0.05, (t) => { const n = rnd(); const h = n - p; p = n; return h * Math.exp(-t / (open ? 0.07 : 0.012)); }, { gain: g, pan: open ? -0.25 : 0.25, bed: true }); };

// 主旋律钩子：A 小调五声，两小节一句（八分音符，null = 休止）
const HOOK = [76, null, 74, 72, null, 69, 72, null, 74, null, 76, 79, null, 76, 74, 72];
const pluck = (t0, m, g, bright) => {
  const f = hz(m); let y = 0, ph = 0;
  add(t0, 0.4, (t) => {
    ph += f / SR; ph -= Math.floor(ph);
    const sq = (ph < 0.5 ? 1 : -1) + (bright ? 0.6 * (ph * 2 - 1) : 0);
    const a = 1 - Math.exp(-2 * Math.PI * (600 + 5000 * Math.exp(-t / 0.05)) / SR);
    y += a * (sq - y);
    return y * Math.exp(-t / 0.16);
  }, { gain: g, pan: 0.1, bed: true });
};
const hookBar = (b, octave, g, bright) => { for (let e = 0; e < 8; e++) { const m = HOOK[(b % 2) * 8 + e]; if (m) pluck(b * BAR + e * BEAT / 2, m + octave, g, bright); } };

// 人声切片：锯齿过两个共振带通（「啊」的共振峰 800 / 1150 Hz），短促
const chop = (t0, m, g = 0.16, len = 0.13) => {
  const f = hz(m); let ph = 0; const bp = [[800, 0, 0], [1150, 0, 0]];
  add(t0, len, (t) => {
    ph += f / SR; ph -= Math.floor(ph); const x = ph * 2 - 1; let out = 0;
    for (const st of bp) { const k = 2 * Math.sin(Math.PI * st[0] / SR), q = 0.12; st[1] += k * st[2]; st[2] += k * (x - st[1] - q * st[2]); out += st[2]; }
    return out * 0.5 * Math.min(1, t / 0.005) * Math.exp(-t / (len * 0.45));
  }, { gain: g, pan: -0.15, bed: true });
};

// 前奏：反向镲片涌进第 3 小节
{ let p = 0; add(BAR, BAR, (t, u) => { const n = rnd(); const h = n - p; p = n; return h * u ** 3; }, { gain: 0.25, bed: true }); }
// 主歌（第 3–5 小节）：钩子、稀疏 808、kick 在 1、3 拍，拍手在第 4 拍，八分镲
for (let b = 2; b < 5; b++) {
  hookBar(b, 0, 0.12, false);
  kick(b * BAR, 0.7); kick(b * BAR + 2 * BEAT, 0.6);
  sub(b * BAR, ROOT[b % 4] + 12, BEAT * 1.5, 0.28);
  clap(b * BAR + 3 * BEAT, 0.18);
  for (let e = 0; e < 8; e++) hat(b * BAR + e * BEAT / 2, e % 2 ? 0.05 : 0.03);
}
// Build（第 6 小节）：军鼓八分 → 十六分 → 三十二分，越来越响；噪声上升
{
  const b = 5, t0 = b * BAR, hits = [];
  for (let i = 0; i < 4; i++) hits.push(t0 + i * BEAT / 2);
  for (let i = 0; i < 4; i++) hits.push(t0 + 2 * BEAT + i * S16);
  for (let i = 0; i < 4; i++) hits.push(t0 + 3 * BEAT + i * S16 / 2);
  hits.forEach((t, i) => snare(t, 0.12 + 0.2 * i / hits.length));
  hookBar(b, 0, 0.1, false);
  kick(t0, 0.7); kick(t0 + BEAT, 0.6); kick(t0 + 2 * BEAT, 0.6);
  let y = 0; add(t0, BAR - BEAT / 2, (t, u) => { const n = rnd(); const a = 0.02 + 0.6 * u * u; y += a * (n - y); return (n - y) * u ** 2; }, { gain: 0.35, bed: true });
}
// Drop（第 7–12 小节）
const BASS16 = [0, 3, 6, 10, 12];                    // 808 的切分位置（十六分）
const CHOP16 = [2, 7, 11, 14];
for (let b = DROP[0]; b < DROP[1]; b++) {
  const t0 = b * BAR;
  for (let q = 0; q < 4; q++) {
    kick(t0 + q * BEAT);
    if (q % 2) { clap(t0 + q * BEAT); snare(t0 + q * BEAT, 0.18); }
    hat(t0 + q * BEAT + BEAT / 2, 0.07, true);
  }
  for (let i = 0; i < 16; i++) hat(t0 + i * S16, i % 4 === 2 ? 0.05 : 0.03);
  BASS16.forEach((i, k) => sub(t0 + i * S16, ROOT[b % 4] + (k === 3 ? 12 : 0), S16 * 2.6));
  hookBar(b, 12, 0.11, true);
  CHOP16.forEach((i) => chop(t0 + i * S16, chordAt(b)[3]));
  if (b === DROP[1] - 1) for (let i = 12; i < 16; i++) snare(t0 + i * S16, 0.12 + 0.03 * (i - 12));   // 结尾过门
}
// 第 13 小节：半速，第 3 拍一个 kick，人声切片带回声
{ const t0 = 12 * BAR; kick(t0 + 2 * BEAT, 0.8); sub(t0 + 2 * BEAT, ROOT[0], BEAT * 2); clap(t0 + 3 * BEAT + BEAT / 2, 0.15);
  [0, 1, 2, 3].forEach((k) => chop(t0 + 2 * BEAT + k * 3 * S16, 69, 0.14 * 0.55 ** k, 0.16)); }
// 第 14–15 小节：每小节下拍一个 kick，八分镲轻轻走，给字母音让位
for (const b of [13, 14]) { kick(b * BAR, 0.55); sub(b * BAR, ROOT[b % 4], BEAT * 2, 0.25); for (let e = 1; e < 8; e += 2) hat(b * BAR + e * BEAT / 2, 0.03); }
// 第 16 小节：尾和弦（supersaw 长音）+ 808 磁带停转
for (const m of [57, 60, 64, 71]) DET.forEach((d, v) => { const f = hz(m + d); let y = 0, ph = v * 0.21; add(15 * BAR, BAR + 1.4, (t) => { ph += f / SR; ph -= Math.floor(ph); y += 0.08 * (ph * 2 - 1 - y); return y * Math.min(1, t / 0.02) * Math.exp(-t / 1.3); }, { gain: 0.03, pan: (v - 3) / 4.5, bed: true }); });
kick(15 * BAR, 0.8); sub(15 * BAR, ROOT[0], BAR, 0.4, true);

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
// 影棚顶灯：每盏灯「咔嗒」一声打开，带一点低频的电流嗡声
K.lights.forEach((f, i) => { add(sec(f), 0.05, (t) => rnd() * Math.exp(-t / 0.006), { gain: 0.35, pan: [-0.5, 0.5, 0][i] });
  add(sec(f), 0.5, (t) => Math.sin(2 * Math.PI * 100 * t) * Math.exp(-t / 0.15), { gain: 0.12 }); });
// 剪刀合上
add(sec(K.snip), 0.08, (t) => (Math.sin(2 * Math.PI * 4200 * t) + rnd() * 0.6) * Math.exp(-t / 0.012), { gain: 0.3 });
add(sec(K.snip) + 0.05, 0.1, (t) => (Math.sin(2 * Math.PI * 3600 * t) + rnd() * 0.5) * Math.exp(-t / 0.02), { gain: 0.25 });
// 字母归位：每个一声咔哒 + 上行五声音阶（C D E G A C）
[72, 74, 76, 79, 81, 84].forEach((m, i) => {
  const f = hz(m), t0 = sec(K.letters[i]);
  add(t0, 0.03, (t) => rnd() * Math.exp(-t / 0.005), { gain: 0.2 });
  add(t0, 1.2, (t) => (Math.sin(2 * Math.PI * f * t) + 0.25 * Math.sin(6 * Math.PI * f * t)) * Math.exp(-t / 0.35), { gain: 0.12, pan: (i - 2.5) / 4 });
});

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
