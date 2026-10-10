// 全片的节拍与关键帧：画面（这里）和配乐（audio/music.py）读同一份 timing.json
import T from './timing.json';
import { interpolate, spring, Easing } from 'remotion';

export const FPS = T.fps, BEAT = T.beat, BAR = T.bar, TOTAL = T.total, K = T.k;
export const SCENES = T.scenes, TRANS = T.transitions;
const sum = (a: number[]) => a.reduce((x, y) => x + y, 0);
// 每场的全局起点：转场让相邻两场重叠，起点 = 前面各场之和 − 前面各转场之和 → [0, 53, 171, 291, 441, 476]
export const START = SCENES.map((_, i) => sum(SCENES.slice(0, i)) - sum(TRANS.slice(0, i)));

export const C = { void: '#07080B', ink: '#141414', cream: '#FBF3E4', blue: '#2E7CF6', cyan: '#22D3EE', violet: '#8B5CF6', amber: '#F5C542', night: '#0B1026' };
export const EASE = Easing.bezier(0.65, 0, 0.35, 1);
export const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
// g 在 [a, b] 之间的 0→1 进度（可选缓动）
export const seg = (g: number, a: number, b: number, e: (x: number) => number = (x) => x) => e(clamp((g - a) / (b - a)));
// 在全局帧 at 结束（≈到位）的弹簧：从 at − dur 开始
export const arrive = (g: number, at: number, dur = 12, damping = 14, stiffness = 170) =>
  spring({ frame: g - (at - dur), fps: FPS, config: { damping, stiffness, mass: 0.6 }, durationInFrames: dur });
export const pop = (g: number, at: number, damping = 11) => spring({ frame: g - at, fps: FPS, config: { damping, stiffness: 180, mass: 0.7 } });
export const fadeIn = (g: number, at: number, d = 8) => interpolate(g, [at, at + d], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
