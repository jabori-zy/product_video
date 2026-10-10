// 声音方案（采用方案二）：事件表 cues.ts → 音色、音乐与分轨
import { Bus, sum } from './dsp';
import * as V from './voices';
import { BAND_IN, Cue, END, H0, LOGO, SECTIONS } from './cues';

export type Plan = { id: string; name: string; stems: Record<string, Bus> };

const C_RANGE = [SECTIONS.Cp, SECTIONS.D], E_RANGE = [SECTIONS.Ep, SECTIONS.Ep + 16];
const inPhone = (t: number) => (t >= C_RANGE[0] && t < C_RANGE[1]) || (t >= E_RANGE[0] && t < E_RANGE[1]);
/** 插段里手机在画面右侧：手机声音偏右 */
const panOf = (c: Cue) => (c.phone && inPhone(c.t) ? 0.35 : 0);
const stems = (...names: string[]) => Object.fromEntries(names.map((n) => [n, new Bus(END)])) as Record<string, Bus>;
const each = (t0: number, t1: number, step: number, fn: (t: number, k: number) => void) => { for (let k = 0, t = t0; t < t1 - 1e-6; k++, t = t0 + k * step) fn(t, k); };

// 和弦（MIDI）
const CH: Record<string, number[]> = {
  Cmaj7: [48, 55, 59, 64], Am9: [45, 52, 55, 59, 60], Fmaj7: [41, 48, 52, 57], G6: [43, 50, 55, 59], Dm9: [50, 53, 57, 60, 64],
  Am: [45, 52, 57, 60], F: [41, 48, 53, 57], C: [48, 55, 60, 64], G: [43, 50, 55, 59], Em7: [52, 55, 59, 62], Cadd9: [48, 55, 62, 64, 67],
};

/** 口号词的和弦音（word 事件 i 0–11：D 收尾、E 收尾、结尾第一行、结尾第二行） */
const WORD_NOTES = [72, 76, 79, 79, 76, 72, 72, 76, 79, 74, 77, 81]; // 最后三个：结尾第二行

// ======================================================================
// 方案二 · 音乐主导、卡在拍子上（120 BPM，参考片的节奏感）
// ======================================================================
export const plan2 = (CUES: Cue[]): Plan => {
  const S = stems('drums', 'bass_synth', 'melody', 'transitions', 'ui_keys', 'xiaohei');
  const BEAT = 0.5, BAR = 2;
  for (const c of CUES) {
    const p = panOf(c), v = c.v ?? 1;
    switch (c.k) {
      case 'key': S.ui_keys.add(V.keyMech(false, 1), c.t, 1, p); break;
      case 'keyHeavy': S.ui_keys.add(V.keyMech(true, 1), c.t, 1, p); break;
      case 'keyBang': S.ui_keys.add(V.keyMech(true, 1.5), c.t); S.drums.add(V.snare(0.5), c.t); break;
      case 'enter': S.ui_keys.add(V.keyMech(true, 1.5), c.t); break;
      case 'click': S.ui_keys.add(V.mouseClick(0.8), c.t); break;
      case 'tap': S.ui_keys.add(V.tap(1), c.t, 1, p); break;
      case 'pop': S.ui_keys.add(V.pop(0.55 * v), c.t, 1, p); break;
      case 'ding': S.ui_keys.add(V.ding(0.6 * v), c.t, 1, p); break;
      case 'tick': S.ui_keys.add(V.tick(0.6 * v), c.t, 1, p); break;
      case 'swish': case 'sheetUp': S.ui_keys.add(V.swish(c.dur ?? 0.3, 0.45 * v, true), c.t, 1, p); break;
      case 'sheetDown': S.ui_keys.add(V.swish(0.25, 0.4, false), c.t, 1, p); break;
      case 'shutter': S.ui_keys.add(V.shutter(0.8), c.t, 1, p); break;
      case 'recStart': S.ui_keys.add(V.recBlip(true, 0.8), c.t, 1, p); break;
      case 'recStop': S.ui_keys.add(V.recBlip(false, 0.8), c.t, 1, p); break;
      case 'murmur': S.ui_keys.add(V.murmur(c.dur!, 0.4 * v, 1.8), c.t, 1, p); break;
      case 'stream': S.ui_keys.add(V.stream(c.dur!, 0.6 * v), c.t, 1, p); break;
      case 'dotUp': S.transitions.add(V.riser(0.6, 0.35), c.t, 1, 0.3); break;
      case 'dotLand': S.transitions.add(V.sparkle(0.55), c.t, 1, -0.3); break;
      case 'whoosh': S.transitions.add(V.whoosh(c.dur ?? 0.45, 0.8 * v), c.t); break;
      case 'arc': S.transitions.add(V.whoosh(c.dur!, 0.8, 250, 5000), c.t); S.drums.add(V.crash(0.8), c.t + c.dur! / 2); break;
      case 'riser': S.transitions.add(V.riser(c.dur!, 0.7), c.t); break;
      case 'impact': S.transitions.add(V.impact(0.8 * v), c.t); S.drums.add(V.crash(0.5), c.t); break;
      // 小黑：甩出式滑动 + 清楚的「喵」（升 3 个半音更可爱），弹簧「嘣」+ 底鼓落地
      case 'slide': S.xiaohei.add(V.whoosh(0.35, 0.7, 500, 4000), c.t, 1, -0.4); break;
      case 'meow': S.xiaohei.add(V.meow(0, 1.0, 3, 1.25), c.t, 1, -0.3); break;
      case 'retract': S.xiaohei.add(V.swish(0.2, 0.4, false), c.t, 1, -0.4); break;
      case 'boing': S.xiaohei.add(V.boing(0.8, 200, 0.6), c.t); break;
      case 'land': S.xiaohei.add(V.land(0.8, 90), c.t); S.drums.add(V.kick(0.5), c.t); break;
      case 'trampoline': S.xiaohei.add(V.boing(0.4, 300, 0.4), c.t); break;
      case 'blink': S.xiaohei.add(V.glock(96, 0.25 * v), c.t); break;
      case 'word': S.melody.add(sum(V.piano(WORD_NOTES[c.i!], 2, 0.6), V.pad([WORD_NOTES[c.i!] - 12], 1.5, 0.4)), c.t); break;
      case 'swap': S.transitions.add(V.whoosh(c.dur!, 0.6), c.t, 1, -0.6); S.transitions.add(V.whoosh(c.dur!, 0.6), c.t + 0.05, 1, 0.6); S.transitions.add(V.riser(c.dur!, 0.4), c.t); break;
      case 'fall': S.transitions.add(V.whoosh(0.5, 0.5, 2500, 300), c.t); break;
      case 'swell': S.transitions.add(V.riser(c.dur! + 0.4, 0.5), c.t); break;
      case 'logo':
        S.melody.add(sum(...CH.Cadd9.map((m) => V.piano(m + 12, 5, 0.8))), c.t);
        S.bass_synth.add(V.pad(CH.Cadd9, END - c.t, 0.8, 2200), c.t); S.bass_synth.add(V.bass(36, 3, 1), c.t);
        S.drums.add(V.crash(1), c.t); S.drums.add(V.impact(0.6), c.t); break;
      case 'line': S.melody.add(V.glock([84, 88, 91][c.i!], 0.5), c.t); break;
    }
  }
  // 前奏（无鼓）：垫音渐入 + 升起，「！」正好落在拍上，BAND_IN 是第一小节重拍
  S.bass_synth.add(V.pad(CH.Am.map((m) => m + 12), BAND_IN - 0.4, 0.6, 900), 0.4);
  S.transitions.add(V.riser(1.5, 0.5), BAND_IN - 1.5);
  // 主体（final 编曲）：段落都从小节线开始，每段换一种和弦 / 鼓型 / 密度，避免一个循环放到底
  //   A 尾：只有底鼓 1、3 拍 + 贝斯，蓄力；B 全乐队；C 加十六分踩镲；D「理解」半拍感 + 换和弦色彩；
  //   E 主歌高潮：全乐队 + 主旋律动机；F 米白画布：大调、轻；G 全片最高点：动机 + 开镲；插段（手机）：降成垫音 + 轻底鼓
  type Sec = { prog: string[]; kick: number[]; snare: number[]; hat16?: boolean; open?: boolean; bass: boolean; arpV: number; arpUp?: number; motif?: boolean; phone?: boolean };
  const FULL = { kick: [0, 2], snare: [1, 3], bass: true, arpV: 0.5 };
  const PHONE: Sec = { prog: ['Fmaj7', 'G6', 'Em7', 'Am9'], kick: [0], snare: [], bass: false, arpV: 0.35, phone: true };
  const ARR: [number, Sec][] = [
    [BAND_IN, { prog: ['Am', 'F', 'C', 'G'], kick: [0, 2], snare: [], bass: true, arpV: 0.4 }],
    [SECTIONS.B, { prog: ['Am', 'F', 'C', 'G'], ...FULL }],
    [SECTIONS.C, { prog: ['Am', 'F', 'C', 'G'], ...FULL, hat16: true }],
    [SECTIONS.Cp, PHONE],
    [SECTIONS.D, { prog: ['Dm9', 'G6', 'Cmaj7', 'Am9'], kick: [0], snare: [2], bass: true, arpV: 0.42 }],
    [SECTIONS.E, { prog: ['Am', 'F', 'C', 'G'], ...FULL, motif: true }],
    [SECTIONS.Ep, PHONE],
    [SECTIONS.Ep + 16, { prog: ['Am', 'F', 'C', 'G'], ...FULL, hat16: true, motif: true }],
    [SECTIONS.F, { prog: ['C', 'G', 'Am', 'F'], kick: [0, 2], snare: [1, 3], bass: true, arpV: 0.42, arpUp: 12 }],
    [SECTIONS.G, { prog: ['F', 'G', 'Am', 'C'], ...FULL, hat16: true, open: true, motif: true }],
  ];
  const secOf = (t: number) => { let k = 0; for (let i = 0; i < ARR.length; i++) if (t >= ARR[i][0] - 1e-6) k = i; return k; };
  // 主旋律动机（每小节两三个和弦内音，钢琴 + 钟琴叠一层），跟着当前和弦走
  const MOTIF: Record<string, [number, number][]> = {
    Am: [[76, 0], [72, 1.5], [74, 3]], F: [[77, 0], [72, 1.5], [69, 3]], C: [[79, 0], [76, 1.5], [72, 3]], G: [[74, 0], [71, 1.5], [79, 3]],
  };
  const trans = [SECTIONS.B, SECTIONS.C, SECTIONS.Cp, SECTIONS.D, SECTIONS.E, SECTIONS.Ep, SECTIONS.Ep + 16, SECTIONS.F, SECTIONS.G, H0].filter((t) => t > BAND_IN);
  each(BAND_IN, H0 + 0.3, BAR, (t) => {
    const k = secOf(t + 0.01), [t0, A] = ARR[k];
    const bar = Math.round((t - t0) / BAR), name = A.prog[bar % A.prog.length], ch = CH[name];
    if (k > 0 && bar === 0 || t === BAND_IN || (A === ARR[ARR.length - 1][1] && bar % 2 === 0)) S.drums.add(V.crash(A.phone ? 0.4 : 0.7), t); // 每段第一拍；G 每两小节
    for (let b = 0; b < 4; b++) {
      const tb = t + b * BEAT;
      if (tb >= H0 + 0.3) break;
      if (A.kick.includes(b)) S.drums.add(V.kick(A.phone ? 0.6 : 1), tb);
      if (A.snare.includes(b)) S.drums.add(V.snare(0.8), tb);
      S.drums.add(V.hat(0.6), tb);
      S.drums.add(V.hat(A.open ? 0.55 : b === 3 && !A.phone ? 0.7 : 0.4, A.open || (b === 3 && !A.phone)), tb + BEAT / 2, 1, 0.2);
      if (A.hat16) for (const q of [1, 3]) S.drums.add(V.hat(0.22), tb + q * BEAT / 4, 1, -0.2);
      if (A.bass) { S.bass_synth.add(V.bass(ch[0] - 12, BEAT * 0.45, 0.9), tb); S.bass_synth.add(V.bass(ch[0], BEAT * 0.4, 0.6), tb + BEAT / 2); }
      for (let q = 0; q < 4; q++) S.melody.add(V.arp(ch[(b * 4 + q) % ch.length] + 24 + (A.arpUp ?? 0), 0.11, A.arpV, A.phone ? 1400 : 2600), tb + q * BEAT / 4, 1, q % 2 ? 0.3 : -0.3);
    }
    if (A.phone) S.bass_synth.add(V.pad(ch, BAR + 0.2, 0.5, 1200), t);
    if (A.motif && MOTIF[name]) for (const [m, beat] of MOTIF[name]) {
      const tm = t + beat * BEAT; if (tm >= H0) continue;
      S.melody.add(sum(V.piano(m, 1.2, 0.5), V.glock(m + 12, 0.12)), tm, 1, 0.1);
    }
  });
  // 转场前一拍：军鼓十六分过门
  for (const x of trans) for (let s = 0; s < 4; s++) S.drums.add(V.snare(0.35 + s * 0.12), x - BEAT + s * BEAT / 4);
  // 口号段：无鼓，垫音托着
  S.bass_synth.add(V.pad(CH.F.map((m) => m + 12), LOGO - H0, 0.5, 1500), H0);
  return { id: 'music2', name: '方案二 · 音乐主导、卡拍子', stems: S };
};

export const PLANS = [plan2];
