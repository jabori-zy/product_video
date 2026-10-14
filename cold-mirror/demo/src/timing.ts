// 全片的节拍与关键帧：画面（这里）和配乐（tools/music.mjs）读同一份 timing.json
import T from './timing.json';
import { spring, Easing } from 'remotion';

export const FPS = T.fps, BEAT = T.beat, BAR = T.bar, TOTAL = T.total, K = T.k, LOOKS = T.looks, SWEEP = T.sweepDur;
export const SHOTS = T.shots, GRID = T.grid;
// 第 n 镜（1 起）的全局起点：每镜 1 小节
export const at = (n: number) => (n - 1) * BAR;

export const EASE = Easing.bezier(0.65, 0, 0.35, 1);
export const OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const IN = Easing.bezier(0.7, 0, 0.84, 0);
export const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
// g 在 [a, b] 之间的 0→1 进度（可选缓动）
export const seg = (g: number, a: number, b: number, e: (x: number) => number = (x) => x) => e(clamp((g - a) / (b - a)));
export const pop = (g: number, at: number, damping = 12) => spring({ frame: g - at, fps: FPS, config: { damping, stiffness: 190, mass: 0.6 } });
// 淡入 [a, b]，可选淡出 [c, d]；允许 b === c（瞬间到顶就回落的闪白）
export const fade = (g: number, a: number, b: number, c?: number, d?: number) => {
  const up = b > a ? clamp((g - a) / (b - a)) : (g >= a ? 1 : 0);
  if (c === undefined) return up;
  const down = d > c ? 1 - clamp((g - c) / (d - c)) : (g < c ? 1 : 0);
  return Math.min(up, down);
};
// 手持晃动：几个不同频率的正弦叠加，确定性
export const shake = (g: number, amp = 6) => ({
  x: amp * (Math.sin(g * 0.21) * 0.6 + Math.sin(g * 0.53 + 1.3) * 0.3 + Math.sin(g * 1.7) * 0.1),
  y: amp * (Math.sin(g * 0.17 + 2) * 0.6 + Math.sin(g * 0.61) * 0.3 + Math.sin(g * 1.3 + 0.5) * 0.1),
  r: amp * 0.05 * Math.sin(g * 0.13 + 0.7),
});
// 最近一次已发生的事件下标（列表按时间排序），还没开始返回 −1
export const lastIndex = (g: number, times: number[]) => times.reduce((k, t, i) => (g >= t ? i : k), -1);

export const C = {
  ink: '#0B0B0C', paper: '#F4F3F0', red: '#C8102E', amber: '#FFB45A', warm: '#2A1A10', gold: '#FFD7A0',
  metal: 'linear-gradient(90deg,#3a3d42 0%,#9aa0a8 22%,#e9edf2 45%,#7d838b 70%,#2c2f33 100%)',
};
export const FONT = '"PingFang SC","Hiragino Sans GB","Helvetica Neue",sans-serif';
