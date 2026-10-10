// 三套声音方案：同一张事件表（cues.ts），各自的音色、音乐与分轨
import { Bus, sum } from './dsp';
import * as V from './voices';
import { BAND_IN, CUES, Cue, END, H0, LOGO, SECTIONS } from './cues';

export type Plan = { id: string; name: string; stems: Record<string, Bus> };

const C_RANGE = [SECTIONS.Cp, SECTIONS.D], E_RANGE = [SECTIONS.Ep, SECTIONS.Ep + 15.2];
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

/** 结尾三个口号词与 E 段收尾「记忆变成万物」的和弦音（word 事件 i 0–8） */
const WORD_NOTES = [72, 76, 79, 79, 76, 72, 72, 76, 79];

// ======================================================================
// 方案一 · 干净的界面音，轻音乐（安静、精确）
// ======================================================================
export const plan1 = (): Plan => {
  const S = stems('music', 'keys', 'ui', 'xiaohei', 'transitions');
  for (const c of CUES) {
    const p = panOf(c), v = c.v ?? 1;
    switch (c.k) {
      case 'key': S.keys.add(V.keySoft(false, 0.9), c.t, 1, p); break;
      case 'keyHeavy': S.keys.add(V.keySoft(true, 1), c.t, 1, p); break;
      case 'keyBang': S.keys.add(V.keySoft(true, 1.4), c.t); S.keys.add(V.tick(0.6, 3000), c.t + 0.01); break;
      case 'enter': S.keys.add(V.keySoft(true, 1.4), c.t); break;
      case 'click': S.keys.add(V.mouseClick(0.6), c.t); break;
      case 'tap': S.keys.add(V.tap(0.9), c.t, 1, p); break;
      case 'pop': S.ui.add(V.pop(0.45 * v), c.t, 1, p); break;
      case 'ding': S.ui.add(V.ding(0.5 * v), c.t, 1, p); break;
      case 'tick': S.ui.add(V.tick(0.5 * v), c.t, 1, p); break;
      case 'swish': S.ui.add(V.swish(c.dur ?? 0.25, 0.35 * v), c.t, 1, p); break;
      case 'sheetUp': S.ui.add(V.swish(0.3, 0.35, true), c.t, 1, p); break;
      case 'sheetDown': S.ui.add(V.swish(0.25, 0.3, false), c.t, 1, p); break;
      case 'shutter': S.ui.add(V.shutter(0.6), c.t, 1, p); break;
      case 'recStart': S.ui.add(V.recBlip(true, 0.7), c.t, 1, p); break;
      case 'recStop': S.ui.add(V.recBlip(false, 0.7), c.t, 1, p); break;
      case 'murmur': S.ui.add(V.murmur(c.dur!, 0.45 * v, 1.8), c.t, 1, p); break;
      case 'stream': S.ui.add(V.stream(c.dur!, 0.6 * v), c.t, 1, p); break;
      case 'dotUp': S.ui.add(V.swish(0.5, 0.3, true), c.t, 1, 0.3); break;
      case 'dotLand': S.ui.add(V.sparkle(0.35), c.t, 1, -0.3); break;
      case 'whoosh': S.transitions.add(V.whoosh(c.dur ?? 0.45, 0.45 * v, 400, 2500), c.t); break;
      case 'arc': S.transitions.add(V.whoosh(c.dur!, 0.4, 300, 3000), c.t); break;
      case 'riser': S.transitions.add(V.riser(c.dur!, 0.35), c.t); break;
      case 'impact': S.transitions.add(V.impact(0.35 * v), c.t); break;
      // 小黑：轻气声滑出 + 短促「咪」，弹出用轻弹簧
      case 'slide': S.xiaohei.add(V.slide(0.85), c.t, 1, -0.4); break;
      case 'meow': S.xiaohei.add(V.meow(0, 0.35, 4, 0.9), c.t, 1, -0.3); break;
      case 'retract': S.xiaohei.add(V.swish(0.18, 0.25, false), c.t, 1, -0.4); break;
      case 'boing': S.xiaohei.add(V.boing(0.45, 280, 0.45), c.t); break;
      case 'land': S.xiaohei.add(V.land(0.45, 130), c.t); break;
      case 'trampoline': S.xiaohei.add(V.boing(0.2, 360, 0.35), c.t); break;
      case 'blink': S.xiaohei.add(V.bell(98, 0.18 * v, 0.3), c.t); break;
      case 'word': S.ui.add(V.piano(WORD_NOTES[c.i!], 2, 0.5), c.t); break;
      case 'swap': S.transitions.add(V.whoosh(c.dur!, 0.3, 500, 2500), c.t, 1, -0.5); S.transitions.add(V.whoosh(c.dur!, 0.3, 500, 2500), c.t + 0.05, 1, 0.5); break;
      case 'fall': S.ui.add(V.swish(0.4, 0.4, false), c.t); break;
      case 'swell': S.music.add(V.pad(CH.Fmaj7.map((m) => m + 12), 1.2, 0.5, 2000), c.t); break;
      case 'logo': S.music.add(sum(...CH.Cadd9.map((m) => V.piano(m + 12, 5, 0.6))), c.t); S.ui.add(V.bell(96, 0.5, 1.2), c.t); break;
      case 'line': S.ui.add(V.glock([84, 88, 91][c.i!], 0.35), c.t); break;
    }
  }
  // 音乐：钢琴分解和弦 + 垫音，每 4 秒换和弦，自由节奏；logo 后停在 Cmaj9
  const prog = ['Cmaj7', 'Am9', 'Fmaj7', 'G6'];
  each(0.6, LOGO, 4, (t, k) => {
    const ch = CH[prog[k % 4]], d = Math.min(4.3, LOGO - t + 0.4);
    S.music.add(V.pad(ch.map((m) => m + 12), d + 0.6, 0.45, 1600), t);
    [0, 2, 1, 3, 2, 1].forEach((n, j) => { if (t + j * 0.66 < LOGO) S.music.add(V.piano(ch[n % ch.length] + 24, 2.2, 0.28), t + j * 0.66, 1, j % 2 ? 0.25 : -0.25); });
  });
  S.music.add(V.pad([48, 55, 62, 64, 71], END - LOGO, 0.5, 1800), LOGO);
  return { id: 'music1', name: '方案一 · 干净界面音 + 轻音乐', stems: S };
};

// ======================================================================
// 方案二 · 音乐主导、卡在拍子上（120 BPM，参考片的节奏感）
// ======================================================================
export const plan2 = (): Plan => {
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
  // 主体：Am F C G，每小节一个和弦；插段里降成半拍感（只留底鼓 1 拍 + 踩镲），结尾口号处停鼓
  const prog = ['Am', 'F', 'C', 'G'];
  const trans = [SECTIONS.B, SECTIONS.C, SECTIONS.D, SECTIONS.E, SECTIONS.F, SECTIONS.G, H0].filter((t) => t > BAND_IN);
  each(BAND_IN, H0 + 0.3, BAR, (t, bar) => {
    const ch = CH[prog[bar % 4]], phone = inPhone(t + 0.1);
    if (bar === 0 || trans.some((x) => x <= t && t - x < BAR)) S.drums.add(V.crash(0.7), t); // 每段第一小节重拍
    for (let b = 0; b < 4; b++) {
      const tb = t + b * BEAT;
      if (tb >= H0 + 0.3) break;
      if (b === 0 || (!phone && b === 2)) S.drums.add(V.kick(phone ? 0.6 : 1), tb);
      if (!phone && (b === 1 || b === 3)) S.drums.add(V.snare(0.8), tb);
      S.drums.add(V.hat(0.6), tb); S.drums.add(V.hat(b === 3 && !phone ? 0.7 : 0.4, b === 3 && !phone), tb + BEAT / 2, 1, 0.2);
      if (!phone) { S.bass_synth.add(V.bass(ch[0] - 12, BEAT * 0.45, 0.9), tb); S.bass_synth.add(V.bass(ch[0], BEAT * 0.4, 0.6), tb + BEAT / 2); }
      for (let s = 0; s < 4; s++) S.melody.add(V.arp(ch[(b * 4 + s) % ch.length] + 24, 0.11, phone ? 0.35 : 0.5, phone ? 1400 : 2600), tb + s * BEAT / 4, 1, s % 2 ? 0.3 : -0.3);
    }
    if (phone) S.bass_synth.add(V.pad(ch, BAR + 0.2, 0.5, 1200), t);
  });
  // 转场前一拍：军鼓十六分过门
  for (const x of trans) for (let s = 0; s < 4; s++) S.drums.add(V.snare(0.35 + s * 0.12), x - BEAT + s * BEAT / 4);
  // 口号段：无鼓，垫音托着
  S.bass_synth.add(V.pad(CH.F.map((m) => m + 12), LOGO - H0, 0.5, 1500), H0);
  return { id: 'music2', name: '方案二 · 音乐主导、卡拍子', stems: S };
};

// ======================================================================
// 方案三 · 电脑 / 手机两种声音世界 + 小黑主题动机
// ======================================================================
export const plan3 = (): Plan => {
  const S = stems('music', 'motif', 'pc', 'phone', 'transitions', 'xiaohei');
  const MOTIF = [88, 91, 96]; // E6 G6 C7
  const dev = (c: Cue) => (c.phone ? S.phone : S.pc);
  const motif = (t: number, notes: number[], v = 0.5, gap = 0.12) => notes.forEach((m, j) => S.motif.add(V.glock(m, v), t + j * gap));
  for (const c of CUES) {
    const p = panOf(c), v = c.v ?? 1, B = dev(c), ph = !!c.phone;
    switch (c.k) {
      case 'key': B.add(ph ? V.keySoft(false, 0.7) : V.keyMech(false, 0.9), c.t, 1, p); break;
      case 'keyHeavy': B.add(ph ? V.keySoft(true, 0.8) : V.keyMech(true, 1), c.t, 1, p); break;
      case 'keyBang': case 'enter': B.add(V.keyMech(true, 1.4), c.t); break;
      case 'click': B.add(V.mouseClick(0.8), c.t); break;
      case 'tap': S.phone.add(V.haptic(0.9), c.t, 1, p); break;
      case 'pop': B.add(ph ? V.marimba(84, 0.5 * v) : V.pop(0.5 * v), c.t, 1, p); break;
      case 'ding': B.add(ph ? sum(V.marimba(88, 0.5), V.marimba(95, 0.4)) : V.ding(0.55 * v), c.t, 1, p); break;
      case 'tick': B.add(V.tick(0.55 * v), c.t, 1, p); break;
      case 'swish': B.add(V.swish(c.dur ?? 0.25, (ph ? 0.3 : 0.4) * v), c.t, 1, p); break;
      case 'sheetUp': S.phone.add(V.swish(0.3, 0.35, true), c.t, 1, p); break;
      case 'sheetDown': S.phone.add(V.swish(0.25, 0.3, false), c.t, 1, p); break;
      case 'shutter': S.phone.add(V.shutter(0.8), c.t, 1, p); break;
      case 'recStart': S.phone.add(V.recBlip(true, 0.8), c.t, 1, p); break;
      case 'recStop': S.phone.add(V.recBlip(false, 0.8), c.t, 1, p); break;
      case 'murmur': B.add(V.murmur(c.dur!, 0.45 * v, 1.8), c.t, 1, p); break;
      case 'stream': B.add(V.stream(c.dur!, 0.55 * v), c.t, 1, p); break;
      case 'dotUp': S.transitions.add(V.swish(0.6, 0.4, true), c.t, 1, 0.3); break;
      case 'dotLand': motif(c.t, c.i === 1 ? [MOTIF[2]] : MOTIF, 0.5); break; // 光点落进电脑：主题动机
      case 'whoosh': S.transitions.add(V.whoosh(c.dur ?? 0.45, 0.6 * v, 350, 3500), c.t); break;
      case 'arc': S.transitions.add(V.whoosh(c.dur!, 0.6, 300, 4000), c.t); break;
      case 'riser': S.transitions.add(V.riser(c.dur!, 0.5), c.t); break;
      case 'impact': S.transitions.add(V.impact(0.6 * v), c.t); break;
      // 小黑：滑动 + 真实、略害羞的一声喵（淡入长一点）+ 动机第一音；弹出是弹簧，落地依次接动机第二、三音
      case 'slide': S.xiaohei.add(V.slide(1), c.t, 1, -0.4); break;
      case 'meow': S.xiaohei.add(V.meow(0.05, 1.1, 1, 1.15), c.t, 1, -0.3); motif(c.t, [MOTIF[0]], 0.4); break;
      case 'retract': S.xiaohei.add(V.swish(0.2, 0.3, false), c.t, 1, -0.4); break;
      case 'boing': S.xiaohei.add(V.boing(0.65, 230, 0.55), c.t); break;
      case 'land': S.xiaohei.add(V.land(0.6, 110), c.t); if (c.i! < 3) motif(c.t, [MOTIF[Math.min(2, (c.i! % 2) + 1)]], 0.45); break;
      case 'trampoline': S.xiaohei.add(V.boing(0.3, 330, 0.4), c.t); break;
      case 'blink': motif(c.t, [MOTIF[1]], 0.22 * v); break;
      case 'word': S.music.add(V.rhodes(WORD_NOTES[c.i!], 2.2, 0.8), c.t); break;
      case 'swap': S.transitions.add(V.whoosh(c.dur!, 0.45, 400, 3000), c.t, 1, -0.6); S.transitions.add(V.whoosh(c.dur!, 0.45, 400, 3000), c.t + 0.05, 1, 0.6); break;
      case 'fall': S.transitions.add(V.whoosh(0.5, 0.4, 2500, 300), c.t); break;
      case 'swell': S.music.add(V.pad(CH.G6.map((m) => m + 12), 1.2, 0.5, 1800), c.t); break;
      case 'logo': // 主题动机在这里完整落地，并解决到大和弦
        motif(c.t, [84, ...MOTIF], 0.6, 0.09);
        S.music.add(sum(...CH.Cadd9.map((m) => V.rhodes(m + 12, 5, 0.9))), c.t); S.music.add(V.pad(CH.Cadd9, END - c.t, 0.7, 2000), c.t); break;
      case 'line': motif(c.t, [MOTIF[c.i!]], 0.35); break;
    }
  }
  // 设备阵列：每台设备亮起各响一个动机音
  for (const c of CUES) if (c.k === 'pop' && c.i !== undefined && c.t > SECTIONS.G && c.t < SECTIONS.H) motif(c.t, [MOTIF[c.i % 3] + (c.i >= 3 ? 12 : 0)], 0.3);

  // 音乐：电脑段 = 电钢和弦 + 轻脉冲；手机段 = 马林巴八分音型；两者在插段边界交叉淡化，听得出「换了设备」
  const BEAT = 60 / 110, prog = ['Cmaj7', 'Em7', 'Fmaj7', 'G6'];
  S.music.add(V.pad(CH.Cmaj7.map((m) => m + 12), BAND_IN, 0.4, 900), 0.6);
  const pc = new Bus(END), mob = new Bus(END);
  each(BAND_IN, H0 + 0.3, BEAT * 8, (t, k) => {
    const ch = CH[prog[k % 4]];
    for (const off of [0, BEAT * 4]) {
      pc.add(sum(...ch.map((m) => V.rhodes(m + 12, BEAT * 4.2, 0.5))), t + off);
      pc.add(V.kick(0.35), t + off); pc.add(V.kick(0.25), t + off + BEAT * 2);
    }
    for (let b = 0; b < 16; b++) pc.add(V.shaker(0.8), t + b * BEAT / 2, 1, 0.3);
    mob.add(V.pad(ch.map((m) => m + 12), BEAT * 8 + 0.3, 0.45, 1500), t);
    for (let b = 0; b < 16; b++) mob.add(V.marimba(ch[[0, 2, 1, 3][b % 4] % ch.length] + 24, 0.4), t + b * BEAT / 2, 1, b % 2 ? 0.3 : -0.3);
  });
  const xf = (t: number) => { // 0 = 电脑，1 = 手机，边界 1 秒交叉淡化
    const r = (a: number, b: number) => Math.min(1, Math.max(0, (t - a + 0.5) / 1), Math.max(0, (b + 0.5 - t) / 1));
    return Math.max(r(C_RANGE[0], C_RANGE[1]), r(E_RANGE[0], E_RANGE[1]));
  };
  pc.automate((t) => Math.cos((xf(t) * Math.PI) / 2)); mob.automate((t) => Math.sin((xf(t) * Math.PI) / 2));
  S.music.mix(pc); S.music.mix(mob);
  S.music.add(V.pad(CH.Fmaj7.map((m) => m + 12), LOGO - H0, 0.45, 1400), H0);
  return { id: 'music3', name: '方案三 · 电脑 / 手机两种声音 + 小黑主题动机', stems: S };
};

export const PLANS = [plan1, plan2, plan3];
