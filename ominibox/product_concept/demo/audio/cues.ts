// 全片声音事件表（成片秒数）。时间取自各场景代码里的关键帧，经 appTimeline 换算到 demo_modify_slogon 的时间线，
// 所以声音与画面同源：改了画面节奏，重跑 npm run audio 即可重新对齐
import { INSERTS, TOTAL_APP, insertScale, insertStart, toOutApp } from '../src/appTimeline';
import { ARC_DE } from '../src/pace';
import { E_CLICKS, E_Q1_AT } from '../src/scenes/E.times';
import { TYPED, openKeys, stepOf, txt, type Lang, type TypedCopy } from '../src/copy';

export type Kind =
  | 'key' | 'keyHeavy' | 'keyBang' | 'enter' | 'click' | 'tap'
  | 'pop' | 'ding' | 'tick' | 'swish' | 'sheetUp' | 'sheetDown' | 'shutter' | 'recStart' | 'recStop' | 'murmur' | 'stream'
  | 'whoosh' | 'riser' | 'impact' | 'arc' | 'dotUp' | 'dotLand'
  | 'slide' | 'meow' | 'retract' | 'boing' | 'land' | 'trampoline' | 'blink'
  | 'word' | 'swap' | 'fall' | 'swell' | 'logo' | 'line';
export type Cue = { t: number; k: Kind; dur?: number; v?: number; i?: number; phone?: boolean };

const o = toOutApp; // 原片脚本秒 → 成片秒
const C0 = insertStart('C+'), E0 = insertStart('E+');
export const H0 = toOutApp(39); // H2 结尾起点；H2 内部用成片秒 u（见 src/scenes/H2.tsx）
export const SECTIONS = { A: 0, B: o(5), C: o(9), Cp: C0, D: C0 + INSERTS[0].dur, E: o(ARC_DE), Ep: E0, F: o(30), G: o(35), H: H0 };
export const BAND_IN = o(4.0); // 文字落进输入框，全乐队进
/** H2 里互换之后插入的主标题卡时长（见 src/scenes/H2.tsx 的 HOLD0 / HOLD） */
const H_HOLD0 = 3.3, H_HOLD = 3.5;
export const LOGO = H0 + 5.8 + H_HOLD; // 小黑钻进方块、logo 成形

/** 全片声音事件（按语言：打字的字数与按键表不同，其余时间相同） */
export const buildCues = (lang: Lang): Cue[] => {
  const cues: Cue[] = [];
  const c = (t: number, k: Kind, extra: Partial<Cue> = {}) => cues.push({ t, k, ...extra });
  const typing = (start: number, copy: TypedCopy, map = o, phone = false) => {
    const step = stepOf(copy, lang);
    Array.from(txt(copy, lang)).forEach((ch, i) => c(map(start + i * step), /[，。？！ ,.?!]/.test(ch) ? 'keyHeavy' : 'key', { phone }));
  };

  // ---------- A 开场：打字（与 A.tsx 同一张按键表：中文拼音输入法 / 英文逐字母）----------
  for (const [t, com, py] of openKeys(lang)) {
    const last = py ? 'k' : com.slice(-1); // 拼音按键是普通键；上屏 / 标点看最后一个字
    c(o(t), /[！!]/.test(last) ? 'keyBang' : /[\u4e00-\u9fff，, ]/.test(last) ? 'keyHeavy' : 'key');
  }
  // 小黑：探头（滑动 + 喵）→ 缩回 → 弹出 → 跳上文字 → 眨眼
  c(o(1.8), 'slide'); c(o(1.95), 'meow'); c(o(2.05), 'retract');
  c(o(2.4) - 0.04, 'boing', { i: 0 }); c(o(2.65), 'land', { i: 0 });
  c(o(2.88) - 0.03, 'boing', { i: 1 }); c(o(3.15), 'land', { i: 1 }); c(o(3.15) + 0.02, 'trampoline');
  c(o(3.4), 'blink');
  c(o(3.6), 'swish', { dur: 0.5 }); c(o(4.0), 'pop'); c(o(4.15), 'blink', { v: 0.5 });
  c(o(4.25), 'enter'); c(o(4.3), 'swish', { dur: 0.3 }); c(o(4.5), 'stream', { dur: o(4.9) - o(4.5) }); c(o(4.92), 'ding', { v: 0.7 });

  // ---------- 转场 ----------
  for (const tb of [5, 9, 35]) c(o(tb) - 0.25, 'whoosh', { dur: 0.5 });
  c(o(11.45), 'riser', { dur: o(12.05) - o(11.45) });
  for (const tb of [ARC_DE, 39]) c(o(tb - 0.25) - 0.05, 'arc', { dur: o(tb + 0.25) - o(tb - 0.25) + 0.1 });
  c(o(29.8), 'whoosh', { dur: 0.5, v: 0.7 }); // 分享按钮展开成米白画布

  // ---------- B 一键收藏 ----------
  for (const k of [6.1, 6.8, 8.6]) c(o(k), 'click');
  c(o(6.2), 'pop'); for (let i = 0; i < 3; i++) c(o(7.0 + i * 0.15), 'tick', { v: 0.5 }); c(o(7.45), 'ding'); c(o(7.65), 'pop', { v: 0.6 });
  c(o(8.0), 'swish', { dur: 0.3, v: 0.6 }); c(o(8.35), 'pop', { v: 0.6 });

  // ---------- C 万物入口 ----------
  for (const k of [9.2, 9.7, 10.15, 10.25]) c(o(k), 'pop');
  for (const k of [9.35, 9.85, 10.35]) c(o(k), 'whoosh', { dur: 0.3, v: 0.5 });
  c(o(10.4), 'swish', { dur: 0.35, phone: true });
  for (let i = 0; i < 4; i++) c(o(10.55 + i * 0.125), 'swish', { dur: 0.18, v: 0.6, phone: true });
  c(o(11.0), 'tap', { phone: true }); c(o(11.15), 'recStart', { phone: true });
  for (let i = 0; i < 3; i++) c(o(11.1 + i * 0.1), 'tick', { v: 0.7 });

  // ---------- C+ 手机随手记（插段，成片秒 = C0 + 局部秒）----------
  const m1 = (u: number) => C0 + u / insertScale('C+');
  c(m1(0), 'whoosh', { dur: 1.3, v: 0.5 }); c(m1(0.75), 'pop', { phone: true }); c(m1(1.5), 'whoosh', { dur: 0.8, v: 0.3 });
  c(m1(2.0), 'blink', { v: 0.5 });
  c(m1(2.6), 'tap', { phone: true }); c(m1(2.75), 'sheetUp', { phone: true }); c(m1(3.0), 'recStart', { phone: true });
  c(m1(3.0), 'murmur', { dur: 2.9, phone: true });
  c(m1(5.9), 'tap', { phone: true }); c(m1(6.05), 'pop', { phone: true, v: 0.7 }); c(m1(6.9), 'tap', { phone: true }); c(m1(6.92), 'recStop', { phone: true });
  c(m1(7.0), 'sheetDown', { phone: true }); c(m1(7.15), 'ding', { phone: true }); c(m1(7.3), 'swish', { dur: 0.2, v: 0.4, phone: true });
  c(m1(8.0), 'blink', { v: 0.5 });
  c(m1(8.3), 'tap', { phone: true }); c(m1(8.45), 'sheetUp', { phone: true }); c(m1(9.05), 'tap', { phone: true });
  c(m1(9.3), 'swish', { dur: 0.3, phone: true }); c(m1(10.1), 'shutter', { phone: true }); c(m1(10.25), 'swish', { dur: 0.3, v: 0.5, phone: true, }); c(m1(10.6), 'sheetDown', { phone: true });
  c(m1(10.9), 'ding', { phone: true }); c(m1(10.95), 'swish', { dur: 0.2, v: 0.4, phone: true });
  c(m1(11.2), 'whoosh', { dur: 1.0, v: 0.4 });
  c(m1(11.9), 'dotUp', { i: 0 }); c(m1(12.15), 'dotUp', { i: 1 }); c(m1(13.4), 'dotLand', { i: 0 }); c(m1(13.65), 'dotLand', { i: 1 }); // 光点飘 1.5 s
  c(m1(13.6), 'whoosh', { dur: 1.65, v: 0.6 });

  // ---------- D 理解 ----------
  for (let i = 0; i < 5; i++) c(o(12.34 + i * 0.2), 'tick', { v: 0.8 });
  for (const st of [13, 13.75, 14.5, 15.25]) c(o(st), 'swish', { dur: 0.35, v: 0.6 });
  c(o(14.0), 'murmur', { dur: o(14.35) - o(14.0), v: 0.4 }); // 白板扫描「滋」
  c(o(14.7), 'stream', { dur: 0.5 }); for (let j = 0; j < 3; j++) c(o(14.95 + j * 0.1), 'ding', { v: 0.35 });
  for (let j = 0; j < 4; j++) c(o(16.0 + j * 0.08), 'pop', { v: 0.5 });
  c(o(16.55), 'pop'); typing(16.65, TYPED.search);
  for (let i = 0; i < 3; i++) c(o(17.15 + i * 0.07), 'tick');
  for (let i = 0; i < 3; i++) c(o(17.55 + i * 0.15), 'word', { i });

  // ---------- E 应用 ----------
  for (const k of E_CLICKS) c(o(18 + k), 'click');
  typing(18 + E_Q1_AT, TYPED.q1);
  c(o(20.95), 'swish', { dur: 0.3 }); c(o(21.7), 'stream', { dur: o(22.55) - o(21.7) });
  c(o(22.65), 'pop', { v: 0.6 }); c(o(22.9), 'whoosh', { dur: 0.35, v: 0.6 }); c(o(23.45), 'whoosh', { dur: 0.35, v: 0.6 });
  typing(23.7, TYPED.q2); c(o(24.45), 'swish', { dur: 0.3 });
  c(o(24.5), 'stream', { dur: o(25.8) - o(24.5) }); c(o(25.95), 'swish', { dur: 0.35 }); c(o(26.3), 'pop');

  // ---------- E+ 跨端接力（插段）----------
  const m2 = (u: number) => E0 + u / insertScale('E+');
  c(m2(0), 'whoosh', { dur: 1.3, v: 0.5 }); c(m2(0.75), 'pop', { phone: true }); c(m2(1.5), 'tick');
  c(m2(1.6), 'whoosh', { dur: 0.4, v: 0.5 }); c(m2(1.95), 'swish', { dur: 0.8, v: 0.8 }); c(m2(2.8), 'pop', { phone: true });
  c(m2(3.0), 'whoosh', { dur: 0.6, v: 0.25 }); c(m2(3.6), 'stream', { dur: 1.4, v: 0.5, phone: true });
  c(m2(5.3), 'tap', { phone: true }); c(m2(5.35), 'swish', { dur: 0.2, v: 0.5, phone: true }); c(m2(5.85), 'tap', { phone: true }); c(m2(5.9), 'swish', { dur: 0.2, v: 0.4, phone: true });
  c(m2(6.65), 'tap', { phone: true }); c(m2(6.8), 'swish', { dur: 0.3, phone: true });
  typing(7.3, TYPED.m2q, m2, true);
  c(m2(8.45), 'tap', { phone: true }); c(m2(8.55), 'swish', { dur: 0.25, phone: true }); c(m2(9.2), 'stream', { dur: 1.2, phone: true });
  c(m2(10.75), 'tap', { phone: true }); c(m2(10.9), 'sheetUp', { phone: true }); c(m2(12.1), 'tap', { phone: true }); c(m2(12.2), 'sheetDown', { phone: true });
  c(m2(12.3), 'whoosh', { dur: 0.8, v: 0.3 }); c(m2(12.7), 'dotUp', { i: 0 }); c(m2(13.45), 'dotLand', { i: 0 });
  c(m2(13.5), 'whoosh', { dur: 1.7, v: 0.6 });

  // E 续：Agent 归档
  typing(26.5, TYPED.q3); c(o(27.15), 'swish', { dur: 0.25 });
  c(o(27.25), 'tick'); c(o(27.35), 'tick'); c(o(27.5), 'ding', { v: 0.6 }); c(o(27.8), 'pop'); c(o(28.1), 'tick'); c(o(28.4), 'tick');
  for (let i = 0; i < 3; i++) c(o(29.1 + i * 0.15), 'word', { i: i + 3 });

  // ---------- F 分享协作 ----------
  for (const k of [0.3, 0.75, 1.0, 1.25, 1.5, 1.9]) c(o(30 + k), 'click');
  for (const k of [0.75, 1.0, 1.25, 1.5]) c(o(30 + k) + 0.05, 'tick', { v: 0.8 });
  for (const k of [0.5, 2.0, 2.5, 3.4]) c(o(30 + k), 'swish', { dur: 0.35, v: 0.7 });
  c(o(32.0), 'ding', { v: 0.7 });
  for (let i = 0; i < 4; i++) c(o(32.7 + i * 0.2), 'pop', { v: 0.7, i });

  // ---------- G 开放 ----------
  for (let i = 0; i < 6; i++) c(o(35.1 + i * 0.15), 'pop', { v: 0.6, i });
  for (const k of [37, 37.65, 38.3]) c(o(k), 'impact', { v: 0.7 });

  // ---------- H2 结尾（成片秒 = H0 + u）----------
  const h = (u: number) => H0 + (u < H_HOLD0 ? u : u + H_HOLD); // 互换之后的事件顺延 H_HOLD 秒
  const hRaw = (u: number) => H0 + u;
  for (let i = 0; i < 3; i++) c(h(0.3 + i * 0.45), 'word', { i: i + 6 });
  c(h(2.1), 'swap', { dur: 1.0 });
  for (let i = 0; i < 3; i++) c(hRaw(3.6 + i * 0.2), 'word', { i: i + 9 }); // 第一行「万物 变成 记忆」
  c(hRaw(4.2), 'line', { i: 0, v: 0.7 }); c(hRaw(4.5), 'line', { i: 1, v: 0.6 }); // 随时随地、副标题
  c(h(3.3), 'slide'); c(h(3.5), 'meow', { i: 1 }); c(h(3.65), 'retract');
  c(h(3.95) - 0.04, 'boing', { i: 2 }); c(h(4.3), 'land', { i: 2 }); c(h(4.32), 'trampoline'); c(h(4.45), 'blink');
  c(h(4.65), 'fall'); c(h(4.8), 'swell', { dur: 0.6 });
  c(h(5.35) - 0.03, 'boing', { i: 3, v: 0.7 }); c(LOGO, 'logo');
  for (let i = 0; i < 2; i++) c(h(6.55 + i * 0.35), 'line', { i });
  c(h(7.25), 'pop'); c(h(7.3), 'line', { i: 2 }); // 行动按钮弹出
  c(h(8.2), 'blink'); c(END - 1.6, 'blink', { v: 0.6 });
  return cues.sort((a, b) => a.t - b.t);
};

export const END = TOTAL_APP; // 成片总长
