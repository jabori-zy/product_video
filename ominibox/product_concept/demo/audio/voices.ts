// 音色：按键、点击、触屏、过渡、小黑（喵 / 弹簧 / 落地），以及乐器（钢琴、钟琴、垫音、鼓、贝斯、琶音合成器）
import path from 'path';
import { SR, Sig, ar, biquad, decay, delay, gain, len, mtof, noise, readWav, resample, rng, saw, shape, sine, sum } from './dsp';

let seedN = 1;
const seed = () => seedN++;

// ---------- 键盘 ----------
/** 机械键盘：清脆的触点 + 键帽「咔嗒」+ 低频「咚」；heavy=空格/回车 */
export const keyMech = (heavy = false, v = 1): Sig => {
  const r = rng(seed()), j = 0.85 + r() * 0.3;
  const click = decay(biquad(noise(0.02, seed()), 'hp', 3500), 0.0025);
  const body = decay(biquad(noise(0.06, seed()), 'bp', (heavy ? 900 : 1500) * j, 2.5), heavy ? 0.022 : 0.014);
  const thock = decay(sine((heavy ? 120 : 210) * j, 0.08), heavy ? 0.035 : 0.018);
  const rattle = heavy ? decay(delay(biquad(noise(0.05, seed()), 'bp', 2400, 4), 0.012), 0.01) : new Float32Array(1);
  return gain(sum(gain(click, 0.55), gain(body, 0.9), gain(thock, heavy ? 0.7 : 0.35), gain(rattle, 0.4)), 0.55 * v * (0.9 + r() * 0.2));
};
/** 鼠标 / 触控板点击：按下 + 抬起 */
export const mouseClick = (v = 1): Sig => {
  const one = () => decay(biquad(noise(0.015, seed()), 'bp', 3200, 3), 0.0018);
  return gain(sum(one(), gain(delay(one(), 0.055), 0.6)), 0.5 * v);
};
/** 触屏点按：轻「嗒」 */
export const tap = (v = 1): Sig => gain(sum(decay(biquad(noise(0.02, seed()), 'bp', 2600, 2), 0.003), gain(decay(sine(1600, 0.03), 0.006), 0.25)), 0.35 * v);
// ---------- 界面 ----------
export const pop = (v = 1, f = 520): Sig => gain(decay(sine((t) => f + 900 * Math.exp(-t * 60), 0.12), 0.035, 0.002), 0.4 * v);
/** 铃声（保存成功）：钟形分音 */
export const bell = (m: number, v = 1, tau = 0.6): Sig => {
  const f = mtof(m);
  return gain(sum(...[[1, 1, tau], [2.76, 0.45, tau * 0.45], [5.4, 0.22, tau * 0.25], [8.93, 0.1, tau * 0.15]].map(([k, a, d]) => gain(decay(sine(f * k, d * 5), d, 0.002), a))), 0.28 * v);
};
export const ding = (v = 1) => sum(bell(84, v), gain(delay(bell(91, v * 0.7), 0.07), 1));
export const tick = (v = 1, f = 2200): Sig => gain(decay(sine(f, 0.03), 0.006, 0.0005), 0.22 * v);
/** 小幅界面移动 / 抽屉：柔和气声 */
export const swish = (dur = 0.25, v = 1, up = true): Sig =>
  gain(shape(biquad(noise(dur, seed()), 'bp', (t) => (up ? 600 + 3000 * (t / dur) : 3200 - 2600 * (t / dur)), 1.2), (t) => Math.sin(Math.PI * Math.min(1, t / dur)) ** 1.5), 0.35 * v);
export const shutter = (v = 1): Sig => {
  const k = () => decay(biquad(noise(0.04, seed()), 'bp', 1800, 1.5), 0.008);
  return gain(sum(k(), gain(delay(k(), 0.065), 0.8), gain(decay(sine(90, 0.05), 0.015), 0.4)), 0.6 * v);
};
export const recBlip = (startUp = true, v = 1): Sig => gain(sum(ar(sine(startUp ? 880 : 1320, 0.07), 0.003, 0.02), delay(ar(sine(startUp ? 1320 : 880, 0.09), 0.003, 0.04), 0.075)), 0.22 * v);
/** 会议人声嘈杂（快放感）：带通噪声 + 音节般的起伏 */
export const murmur = (dur: number, v = 1, fast = 1): Sig => {
  const r = rng(seed());
  const ph = Array.from({ length: 5 }, () => r() * 6.28);
  const s = biquad(noise(dur, seed()), 'bp', (t) => 500 + 300 * Math.sin(t * 7 * fast + ph[0]), 1.4);
  return gain(shape(s, (t) => (0.35 + 0.65 * Math.abs(Math.sin(t * 9 * fast + ph[1]) * Math.sin(t * 3.7 * fast + ph[2]))) * Math.min(1, t / 0.2, (dur - t) / 0.3)), 0.35 * v);
};
/** 流式输出的「沙沙」细碎声 */
export const stream = (dur: number, v = 1): Sig => {
  const s = new Float32Array(len(dur)); const r = rng(seed());
  for (let t = 0; t < dur; t += 0.03 + r() * 0.03) { const c = tick(0.5 + r() * 0.5, 3500 + r() * 2500); const o = len(t); for (let i = 0; i < c.length && o + i < s.length; i++) s[o + i] += c[i]; }
  return gain(s, 0.5 * v);
};

// ---------- 过渡 ----------
/** 甩镜 / 转场「嗖」：带通噪声扫频 */
export const whoosh = (dur = 0.45, v = 1, lo = 300, hi = 4000): Sig =>
  gain(shape(biquad(noise(dur, seed()), 'bp', (t) => lo * (hi / lo) ** Math.sin((Math.PI / 2) * Math.min(1, t / dur)), 0.9), (t) => Math.sin(Math.PI * t / dur) ** 2), 0.7 * v);
export const riser = (dur: number, v = 1): Sig =>
  gain(shape(sum(biquad(noise(dur, seed()), 'bp', (t) => 400 + 6000 * (t / dur) ** 2, 1.5), gain(biquad(saw(110, dur), 'lp', (t) => 300 + 4000 * (t / dur) ** 2), 0.4)), (t) => (t / dur) ** 2), 0.5 * v);
export const impact = (v = 1): Sig => gain(sum(decay(sine((t) => 40 + 80 * Math.exp(-t * 18), 1.2), 0.35, 0.002), gain(decay(biquad(noise(0.6, seed()), 'lp', 2500), 0.12), 0.5)), 0.8 * v);
export const sparkle = (v = 1): Sig => sum(...[96, 100, 103].map((m, i) => gain(delay(bell(m, 0.6, 0.25), i * 0.045), v)));

// ---------- 小黑 ----------
/** 弹簧「嘣～」：频率快速颤动并下滑的三角波 */
export const boing = (v = 1, f0 = 220, dur = 0.55): Sig => {
  const s = sine((t) => f0 * (1 + 0.9 * Math.exp(-t * 5)) * (1 + 0.18 * Math.exp(-t * 4) * Math.sin(2 * Math.PI * 28 * t)), dur);
  const s2 = sine((t) => 2.01 * f0 * (1 + 0.9 * Math.exp(-t * 5)), dur);
  return gain(decay(sum(s, gain(s2, 0.25)), dur * 0.35, 0.004), 0.45 * v);
};
/** 落地「噗」 */
export const land = (v = 1, f = 95): Sig => gain(sum(decay(sine((t) => f + 60 * Math.exp(-t * 40), 0.15), 0.05, 0.001), gain(decay(biquad(noise(0.06, seed()), 'lp', 900), 0.015), 0.6)), 0.6 * v);

const MEOW = readWav(path.resolve('audio/samples/meow_young.wav')); // 在 demo/ 目录下运行
/** 喵：用 CC0 录音（Maullido de gata hembra joven, Wikimedia Commons）截取、变调、加淡入淡出 */
export const meow = (from = 0, to = 1.17, semis = 0, v = 1): Sig => {
  const seg = MEOW.slice(Math.round(from * SR), Math.round(to * SR));
  const s = resample(seg, 2 ** (semis / 12));
  return gain(ar(biquad(s, 'hp', 250), 0.03, Math.min(0.2, s.length / SR / 3)), 0.7 * v);
};

// ---------- 乐器 ----------
/** 钢琴：带轻微非谐性的加法合成 + 击弦噪声 */
export const piano = (m: number, dur = 2.5, v = 1): Sig => {
  const f = mtof(m), parts: Sig[] = [];
  for (let k = 1; k <= 7; k++) { const fk = f * k * Math.sqrt(1 + 0.0004 * k * k); if (fk > 12000) break; parts.push(gain(decay(sine(fk, dur), dur * (0.5 / k + 0.08) * (m < 60 ? 1.5 : 1), 0.003), 0.6 / k ** 1.3)); }
  const hammer = gain(decay(biquad(noise(0.03, seed()), 'bp', f * 4, 1), 0.006), 0.15);
  return gain(sum(...parts, hammer), 0.5 * v);
};
export const glock = (m: number, v = 1): Sig => bell(m, v * 1.3, 0.9);
/** 垫音和弦：每个音 3 支失谐锯齿，低通、慢起慢收 */
export const pad = (notes: number[], dur: number, v = 1, cutoff = 1400): Sig => {
  const vs: Sig[] = [];
  for (const m of notes) for (const d of [-9, 0, 8]) vs.push(saw(mtof(m), dur, d, Math.random()));
  return gain(ar(biquad(sum(...vs), 'lp', cutoff, 0.8), Math.min(0.8, dur / 3), Math.min(1.2, dur / 3)), (0.22 / Math.sqrt(notes.length * 3)) * v * 3);
};
export const kick = (v = 1): Sig => gain(sum(decay(sine((t) => 48 + 110 * Math.exp(-t * 30), 0.4), 0.13, 0.001), gain(decay(biquad(noise(0.01, seed()), 'hp', 2000), 0.002), 0.3)), 0.9 * v);
export const snare = (v = 1): Sig => gain(sum(decay(sine(190, 0.15), 0.04, 0.001), gain(decay(biquad(noise(0.25, seed()), 'bp', 2500, 0.8), 0.07), 0.9)), 0.55 * v);
export const hat = (v = 1, open = false): Sig => gain(decay(biquad(noise(open ? 0.3 : 0.06, seed()), 'hp', 7500), open ? 0.09 : 0.018, 0.0005), 0.3 * v);
export const crash = (v = 1): Sig => gain(decay(biquad(noise(2.5, seed()), 'hp', 4000), 0.7, 0.002), 0.35 * v);
export const bass = (m: number, dur: number, v = 1): Sig => gain(ar(sum(biquad(saw(mtof(m), dur), 'lp', 380, 1.2), gain(sine(mtof(m), dur), 0.7)), 0.005, 0.05), 0.5 * v);
export const arp = (m: number, dur = 0.12, v = 1, cutoff = 2400): Sig => gain(ar(biquad(saw(mtof(m), dur), 'lp', cutoff, 2), 0.003, dur * 0.7), 0.3 * v);
