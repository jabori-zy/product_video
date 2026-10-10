// 《小黑 OmniBox》时间线：120 BPM 节拍网格、VO、镜头、小黑表演、光标、界面状态、音效事件
import { clamp, lerp, seg, ss, eio, eo, ei, back, hash } from '/core/lib.js';
import { WIN, SIDE, BAR, IN, ft } from './ui.js';
import * as XH from './xiaohei.js';

export const BPM = 120, B = 60 / BPM;                // 0.5 s 一拍，2 s 一小节；所有转场、落地、弹出都在拍上
export const DUR = 20.4;
export const VO = { v1: .30, v2: 4.35, v3: 8.15, v4: 12.15, v5a: 16.40, v5b: 17.45 };
let WORDS = {};
export const W = (id, word, n = 0) => { let k = 0; for (const [w, a] of WORDS[id] || []) if (w === word && k++ === n) return VO[id] + a; throw new Error(`word ${word} not in ${id}`); };

// ───────── 事件（音效 / 配乐 cue）
export const EV = [];
const ev = (t, type, o = {}) => EV.push({ t: +t.toFixed(3), type, ...o });

// ───────── 镜头：一镜到底的录屏镜头；move 可重叠，后者从前者当前值出发
const EASE = { eio, ss, eo, whip: x => { x = clamp(x); return x < .5 ? 16 * x ** 5 : 1 - (-2 * x + 2) ** 5 / 2; } };
const CAM0 = [1010, 525, 2.0], MOVES = [];
const cam = (t0, d, to, e = 'eio') => MOVES.push({ t0, d, to, e });
export function camAt(t) {
  let v = CAM0.slice(); v[2] = Math.log(v[2]);
  for (const m of MOVES) { if (t <= m.t0) break; const p = EASE[m.e]((t - m.t0) / m.d);
    v = [lerp(v[0], m.to[0], p), lerp(v[1], m.to[1], p), lerp(v[2], Math.log(m.to[2]), p)]; }
  return [v[0] + Math.sin(t * .7) * 1.2, v[1] + Math.sin(t * .53 + 1) * .9, Math.exp(v[2])];   // 触控板式微漂移
}

// ───────── 演员：小黑（只会跳，没有手脚）
class Actor {
  constructor(px = 6) { this.px = px; this.segs = []; this.jumps = []; }
  add(s) { this.segs.push(s); return this; }
  stand(t0, t1, at, o = {}) { return this.add({ k: 'stand', t0, t1, at, ...o }); }
  jump(t0, t1, from, to, h = 60, o = {}) { this.jumps.push({ t0, t1, big: o.big }); ev(t0 - .02, 'jump', { d: t1 - t0 }); ev(t1, 'land', { v: o.big ? 1 : .6 }); return this.add({ k: 'jump', t0, t1, from, to, h, ...o }); }
  hide(t0, t1) { return this.add({ k: 'hide', t0, t1 }); }
  seg(t) { let s = null; for (const x of this.segs) { if (x.t0 <= t && t < x.t1) return x; if (x.t0 <= t) s = x; } return s; }
  eval(t, A) {
    const s = this.seg(t); if (!s || s.k === 'hide') return null;
    const px = s.px || this.px, P = f => typeof f === 'function' ? f(A, t) : f;
    let pos, sq = 0, rot = 0, eyes = 'n';
    if (s.k === 'stand') pos = P(s.at);
    if (s.k === 'jump') { const a = P(s.from), b = P(s.to); if (!a || !b) return null; const p = seg(t, s.t0, s.t1);
      const ap = Math.min(a.y, b.y) - s.h, cy = 2 * ap - (a.y + b.y) / 2;
      pos = { x: lerp(a.x, b.x, p), y: (1 - p) ** 2 * a.y + 2 * (1 - p) * p * cy + p * p * b.y };
      sq = p < .5 ? -.22 * (1 - p * 2) : -.1 * (p * 2 - 1); eyes = s.eyes || (b.x < a.x - 4 ? 'l' : b.x > a.x + 4 ? 'r' : 'u');
      if (s.spin) rot = p * Math.PI * 2 * (b.x < a.x ? -1 : 1); }
    if (!pos) return null;
    for (const j of this.jumps) {                                             // 起跳前蓄力、落地压扁回弹
      if (t >= j.t0 - .12 && t < j.t0) sq = Math.max(sq, .28 * ss(seg(t, j.t0 - .12, j.t0)));
      if (t >= j.t1 && t < j.t1 + .22) { const k = seg(t, j.t1, j.t1 + .22); sq = (j.big ? .42 : .32) * (1 - k) * Math.cos(k * 7); }
    }
    if (s.k === 'stand' && !s.still) { const bp = ((t % B) + B) % B; if (bp < .12) sq += .08 * Math.sin(bp / .12 * Math.PI); }   // 随拍呼吸
    if (s.k === 'stand') {
      const bl = Math.floor(t / 2.3), bt = t - bl * 2.3 - hash(bl * 3.7) * 1.6;
      if (s.eyes) eyes = typeof s.eyes === 'function' ? s.eyes(t) : s.eyes;
      if (bt > 0 && bt < .1 && ['n', 'l', 'r', 'd', 'u'].includes(eyes)) eyes = 'blink';
      if (s.sq) sq += s.sq(t);
    }
    return { x: Math.round(pos.x / (px / 2)) * (px / 2), y: pos.y, px, sq, rot, eyes, op: s.op ? s.op(t) : 1, shadow: s.k === 'jump' ? 0 : 1 };
  }
}

// ───────── 光标（用户）
class Cursor {
  constructor() { this.moves = []; this.clicks = []; this.vis = []; }
  show(t0, t1) { this.vis.push([t0, t1]); return this; }
  move(t0, t1, to, arc = 40) { this.moves.push({ t0, t1, to, arc }); return this; }
  click(t) { this.clicks.push(t); ev(t, 'click'); return this; }
  eval(t, A) {
    let op = 0; for (const [a, b] of this.vis) op = Math.max(op, Math.min(seg(t, a, a + .15), 1 - seg(t, b - .2, b)));
    if (op <= 0) return null;
    let p = null, prev = null;
    for (const m of this.moves) { const to = m.to(A, t); if (!to) continue;
      if (t < m.t0) break;
      if (!prev) { p = to; prev = to; continue; }
      const k = seg(t, m.t0, m.t1), e = eio(k), from = prev, dx = to.x - from.x, dy = to.y - from.y, L = Math.hypot(dx, dy) || 1;
      p = { x: lerp(from.x, to.x, e) - dy / L * m.arc * Math.sin(Math.PI * e), y: lerp(from.y, to.y, e) + dx / L * m.arc * Math.sin(Math.PI * e), sp: Math.abs(Math.sin(Math.PI * k)) * L / (m.t1 - m.t0) };
      prev = k >= 1 ? to : from; if (k < 1) break; }
    if (!p) return null;
    let sc = 1, ring = 0; for (const c of this.clicks) { if (t >= c && t < c + .1) sc = .82; if (t >= c && t < c + .45) ring = seg(t, c, c + .45); }
    return { ...p, op, sc, ring };
  }
}

// ───────── 锚点：元素暂时不在时沿用上一次位置
const at = (key, fx = .5, fy = 0, dx = 0, dy = 0) => { let last = null; return A => { const p = A(key, fx, fy); if (p) last = { x: p.x + dx, y: p.y + dy }; return last; }; };
const pt = (x, y) => () => ({ x, y });
const MX = WIN.x + SIDE, MY = WIN.y + BAR;            // 主区原点（世界坐标）

// ───────── 打字（十六分音符，带一点人手抖动）
function typing(t0, text, step, seed = 1) {
  const T = []; for (let i = 0; i < text.length; i++) { const t = t0 + i * step + (hash(seed * 31 + i * 7.3) - .5) * .02; T.push(t); ev(t, 'key', { v: .6 + hash(i * 3.1) * .4 }); }
  return T;
}
const typed = (T, text, t) => { let n = 0; while (n < T.length && T[n] <= t) n++; return [...text].slice(0, n).join(''); };

// ───────── 素材：四条进入知识库的内容（新的在最上面）
export const ITEMS = [
  { id: 'img', icon: 'img', name: '白板照片.jpg', src: '微信', tag: 'OCR' },
  { id: 'web', icon: 'web', name: '如何搭建你的第二大脑', src: '网页', tag: '可编辑' },
  { id: 'aud', icon: 'aud', name: '周会录音.m4a', src: '随手记', tag: '已转写' },
  { id: 'pdf', icon: 'pdf', name: 'Docker技术入门与实战（第4版）.pdf', src: '本地上传', tag: '全文可搜' }];
const Q = '上周会议定了哪些待办？';

export const SUBS = [], T = {};
let C, CUR, TY = {};
export function build(words) {
  WORDS = words; EV.length = 0; MOVES.length = 0; SUBS.length = 0;
  C = new Actor(6); CUR = new Cursor();
  const dur = words.__dur;
  const cap = { v2: '{微信}、{网页}、{随手记}，随时交给小黑。', v3: '文档、图片、音视频，都变成{可搜索的记忆}。', v4: '一句话提问，答案{带引用}，还能帮你{动手整理}。' };
  for (const [id, t] of Object.entries(VO)) { ev(t, 'vo', { id }); if (cap[id]) SUBS.push({ id, t0: t - .05, t1: Math.max(t + dur[id] + .25, t + 1.8), text: cap[id] }); }
  for (const t of [4, 8, 12, 16]) ev(t, 'wipe');

  // ═════ A. 探头变身 → 落在片名上（0–4）
  const peekX = MX + IN.x + 100, peekY = MY + IN.y0 + 24, pbTop = MY + IN.y0;
  T.blink = .95; ev(T.blink, 'blink');
  T.bubbleOut = 1.45; ev(T.bubbleOut, 'pop');
  T.morph0 = 1.25; T.morph1 = 1.56; ev(T.morph0, 'morph');
  T.title = [1.72, 1.86]; T.om = 2.0; T.sub = 2.4;
  T.land1 = 2.0; ev(T.land1, 'hit');
  cam(0, 2.0, [1030, 515, 2.15], 'ss');
  cam(2.0, 1.5, [1095, 520, 1.34], 'eio');
  const onTitle = at('title', .245, 0, 0, 9);
  C.hide(0, T.morph1)
   .stand(T.morph1, 1.62, pt(peekX, pbTop), { eyes: 'wide', still: true })
   .jump(1.62, T.land1, pt(peekX, pbTop), onTitle, 120, { big: true })
   .stand(T.land1, 4.06, onTitle, { eyes: t => t < 2.9 ? 'happy' : t < 3.5 ? 'n' : 'l' });

  // ═════ B. 01 记录 · 随时随地（4–8）：四条内容逐拍飞进「我的资源」，小黑每拍原地一跳接住
  cam(3.8, .42, [450, 480, 1.85], 'whip'); ev(3.72, 'whoosh', { d: -1 });
  T.land = [4.5, 5.0, 5.5, 6.0]; T.land.forEach((x, i) => { ev(x - .36, 'fly', { i }); ev(x, 'pop', { i }); });
  const rowsTop = at('rows', .8, 0);
  C.jump(4.08, T.land[0], onTitle, rowsTop, 170, { big: true, px: 4, spin: true });
  for (let i = 1; i < 4; i++) { C.stand(T.land[i - 1], T.land[i] - .3, rowsTop, { px: 4, eyes: t => t < T.land[i - 1] + .2 ? 'happy' : 'l' }); C.jump(T.land[i] - .3, T.land[i], rowsTop, rowsTop, 34, { px: 4, eyes: 'l' }); }
  C.stand(T.land[3], 8.2, rowsTop, { px: 4, eyes: t => t < 6.6 ? 'happy' : t < 7.4 ? 'd' : 'r' });
  cam(6.0, 1.7, [470, 500, 1.72], 'ss');

  // ═════ C. 02 理解 · 万物变成记忆（8–12）：小黑逐拍踩行，状态翻转；10.0 打开录音文档
  cam(7.75, .5, [420, 520, 2.0], 'eio'); ev(7.72, 'whoosh', { d: 1 });
  T.flip = { pdf: 8.5, img: 9.0, aud: 9.5, web: 9.75 };
  C.jump(8.2, 8.5, rowsTop, at('r-pdf', .8, 0), 44, { px: 4, big: true, eyes: 'd' })
   .stand(8.5, 8.62, at('r-pdf', .8, 0), { px: 4, eyes: 'happy', still: true })
   .jump(8.62, 9.0, at('r-pdf', .8, 0), at('r-img', .8, 0), 40, { px: 4, big: true, eyes: 'd' })
   .stand(9.0, 9.12, at('r-img', .8, 0), { px: 4, eyes: 'happy', still: true })
   .jump(9.12, 9.5, at('r-img', .8, 0), at('r-aud', .8, 0), 46, { px: 4, big: true, eyes: 'd' })
   .stand(9.5, 10.05, at('r-aud', .8, 0), { px: 4, eyes: t => t < 9.75 ? 'happy' : 'l' });
  for (const [k, x] of Object.entries(T.flip)) { ev(x, k === 'web' ? 'flip2' : 'stomp'); ev(x + .02, 'flip'); }
  T.open = 9.95;
  CUR.show(9.45, 10.35).move(9.45, 9.45, pt(700, 760)).move(9.5, T.open - .04, at('r-aud', .3, .5), 30).click(T.open);
  cam(9.8, .42, [1120, 560, 1.3], 'whip'); ev(9.74, 'whoosh', { d: 1 });
  T.sum = [10.25, 10.5, 10.75]; T.sum.forEach(x => ev(x, 'pop'));
  T.hl = 11.0; ev(T.hl, 'ding');
  C.jump(10.05, 10.5, at('r-aud', .8, 0), at('sum', .86, 0), 150, { px: 5, big: true })
   .stand(10.5, 11.72, at('sum', .86, 0), { px: 5, eyes: t => t < 10.8 ? 'd' : t < 11.0 ? 'n' : t < 11.3 ? 'wide' : 'happy' });
  cam(10.85, .7, [1110, 640, 1.5], 'eio');

  // ═════ D. 03 应用 · 记忆变成万物（12–16）：一句话提问 → 带引用的回答 → Agent 动手整理
  cam(11.8, .42, [1095, 610, 1.72], 'whip'); ev(11.74, 'whoosh', { d: -1 });
  const pbPt = pt(MX + IN.x + IN.w * .86, pbTop), onPb = at('pb', .86, 0);
  C.jump(11.7, 12.0, at('sum', .86, 0), pbPt, 90, { px: 5 })
   .stand(12.0, 13.6, onPb, { px: 5, eyes: t => t < 13.4 ? 'l' : 'wide' });
  T.focus = 12.0;
  CUR.show(11.85, 12.45).move(11.85, 11.85, pt(1300, 800)).move(11.86, T.focus - .04, at('pb', .3, .35), 20).click(T.focus);
  TY.q = typing(12.125, Q, B / 4, 5);
  T.send = 13.5; ev(T.send, 'enter'); ev(T.send + .02, 'send');
  T.ans = 13.75; ev(T.ans, 'tool');
  T.cite = 14.0; ev(T.cite, 'pop');
  T.li = [14.25, 14.5, 14.75]; T.li.forEach(x => ev(x, 'tick'));
  T.tools = [[15.0, 15.25], [15.5, 15.75]]; T.tools.forEach(([a, b]) => { ev(a, 'tick'); ev(b, 'tool'); });
  cam(13.45, .6, [1095, 405, 1.5], 'eio');
  cam(14.7, 1.2, [1060, 460, 1.62], 'ss');
  C.jump(13.6, 14.0, onPb, at('cite', .9, 0), 130, { px: 4.5, big: true })
   .stand(14.0, 14.62, at('cite', .9, 0), { px: 4.5, eyes: t => t < 14.2 ? 'happy' : 'd' })
   .jump(14.62, 15.0, at('cite', .9, 0), at('cite', .9, 0), 36, { px: 4.5, eyes: 'd' })
   .stand(15.0, 15.88, at('cite', .9, 0), { px: 4.5, eyes: t => t < 15.3 ? 'd' : t < 15.7 ? 'happy' : 'u', sq: t => t > 15.72 ? .22 * ss(seg(t, 15.72, 15.88)) : 0, still: true });

  // ═════ E. 片尾：窗口收起，小黑逐词跳过口号（16–20.4）
  T.out = 16.0; ev(T.out, 'whoosh', { d: 0 });
  cam(15.95, .9, [960, 540, 1.0], 'eio');
  T.w = [16.5, 17.0, 17.5, 18.0]; T.w.forEach((x, i) => ev(x, 'word', { i }));
  C.jump(15.88, T.w[0], at('cite', .9, 0), at('e-w0', .5, 0, 0, 6), 230, { px: 6, big: true, spin: true });
  T.w.forEach((x, i) => { const to = at('e-w' + i, .5, 0, 0, 6);
    if (i) C.jump(T.w[i - 1] + .12, x, at('e-w' + (i - 1), .5, 0, 0, 6), to, i === 3 ? 62 : 40, { px: 6, big: i === 3 });
    C.stand(x, i < 3 ? x + .12 : 99, to, { px: 6, eyes: i === 3 ? (t => t < x + .5 ? 'wide' : t > T.pet && t < T.pet + .5 ? 'shut' : 'happy') : 'd',
      sq: i === 3 ? (t => t > T.pet && t < T.pet + .3 ? .3 * (1 - seg(t, T.pet, T.pet + .3)) : 0) : undefined }); });
  T.final = 18.0; ev(T.final, 'final');
  T.cta = 18.5;
  T.pet = 19.0; ev(T.pet + .05, 'boing');
  CUR.show(18.45, 19.6).move(18.45, 18.45, pt(1500, 900)).move(18.5, T.pet - .03, A => { const c = C.eval(T.pet - .05, A); return c && { x: c.x + 6, y: c.y - c.px * 13 - 2 }; }, 24).click(T.pet);
  cam(18.0, 2.4, [960, 520, 1.07], 'ss');
  T.fade = DUR - .5;
  return { C, CUR };
}

// ───────── 每帧：界面状态
const CH = [[4.0, '01', '记录', '随时随地'], [8.0, '02', '理解', '万物变成记忆'], [12.0, '03', '应用', '记忆变成万物']];
export function frame(t) {
  const F = { t, hud: {}, fx: [], actor: C, cursor: CUR };
  F.cam = camAt(t);
  if (t < T.out + .7) F.app = app(t);
  if (t >= T.out) F.extra = endCard(t);
  // 变身：矢量小黑 → 方像素（在精灵层画像素碎片）
  if (t >= T.morph0 && t < T.morph1 + .02) {
    const p = seg(t, T.morph0, T.morph1), x0 = MX + IN.x + 100, y0 = MY + IN.y0 + 24, y1 = MY + IN.y0;
    const src = XH.pixels({ x: x0, y: y0, px: 6 }), dst = XH.pixels({ x: x0, y: y1, px: 6, eyes: 'wide' }); let h = '';
    src.forEach((s, i) => { const d = dst[i] || s, k = eio(clamp((p - hash(i * 1.7) * .4) / .6)), ax = Math.sin(k * Math.PI) * (hash(i * 3.1) - .5) * 34, ay = -Math.sin(k * Math.PI) * 22 * hash(i * 5.3);
      const w = lerp(3, 6, k), x = lerp(s.x, d.x, k) + ax - w / 2, y = lerp(s.y, d.y, k) + ay - w / 2;
      h += `<div style="position:absolute;left:${x}px;top:${y}px;width:${w + .4}px;height:${w + .4}px;background:${k > .5 ? d.col : s.col};opacity:${Math.min(1, p * 6)}"></div>`; });
    F.fx.push(() => h);
  }
  // 内容从窗口外飞进「我的资源」（落点 = 列表顶端，正好在拍上）
  ITEMS.forEach((it, i) => { const L = T.land[i]; if (t < L - .42 || t >= L) return;
    F.fx.push(A => { const r = A('rows', 0, 0); if (!r) return ''; const k = eio(seg(t, L - .42, L)), y0 = r.y + [-150, 130, -40, 210][i];
      const x = lerp(-300, r.x, k), y = lerp(y0, r.y, k) - Math.sin(k * Math.PI) * 50;
      return `<div class="fly" style="left:${x}px;top:${y}px;transform:scale(${1.18 - .18 * k}) rotate(${(1 - k) * (i % 2 ? 4 : -4)}deg);transform-origin:0 0">${ft(it.icon)}${it.name.length > 12 ? it.name.slice(0, 11) + '…' : it.name}<small>${it.src}</small></div>`; }); });
  // HUD
  const H = F.hud;
  for (const [t0, no, nm, sub] of CH) if (t >= t0 && t < t0 + 3.8) H.chap = { no, nm, sub, op: Math.min(seg(t, t0, t0 + .12), 1 - seg(t, t0 + 3.55, t0 + 3.8)), sc: .85 + .15 * back(seg(t, t0, t0 + .25)) };
  for (const s of SUBS) if (t >= s.t0 && t < s.t1) H.cap = { text: s.text, op: Math.min(seg(t, s.t0, s.t0 + .15), 1 - seg(t, s.t1 - .15, s.t1)), y: (1 - eo(seg(t, s.t0, s.t0 + .25))) * 14 };
  if (t > T.send - .12 && t < T.send + .55) H.keys = { keys: ['⏎'], label: '发送', dn: t >= T.send && t < T.send + .12, op: Math.min(seg(t, T.send - .12, T.send - .02), 1 - seg(t, T.send + .4, T.send + .55)) };
  if (t > T.hl && t < T.hl + .9) H.flash = 0;
  if (t > T.final && t < T.final + .18) H.flash = .35 * (1 - seg(t, T.final, T.final + .18));
  if (t > T.fade) H.fade = seg(t, T.fade, DUR);
  if (t < .35) H.fade = 1 - eo(t / .35);
  return F;
}

function app(t) {
  const A = { side: { tab: t < 12.0 ? '资源' : '对话', badge: 6, rows: [] }, main: {} };
  // 侧栏：内容逐拍入库（新的在最上面），入库时这一行从 0 高长到 38 把旧行挤下去
  const idx = ITEMS.map((it, i) => ({ it, i })).filter(({ i }) => t >= T.land[i] - .18).reverse();
  for (const { it, i } of idx) {
    const L = T.land[i], g = seg(t, L - .18, L), f = T.flip[it.id];
    const r = { id: it.id, icon: it.icon, name: it.name, h: 38 * eo(g), op: t >= L ? 1 : 0, hl: t >= L && t < L + .32, st: t < f ? 'parse' : 'done', tag: it.tag, spin: t * 540 };
    if (t >= f) r.pop = .7 + .3 * back(seg(t, f, f + .22));
    if ((t >= f && t < f + .3) || (it.id === 'aud' && t > T.open && t < T.open + .5)) r.hl = true;   // 被踩的那一行亮一下
    A.side.rows.push(r);
  }
  const M = A.main;
  // 主区：首页（0–10） / 文档（10–12） / 首页→对话（12–16）
  if (t < 9.96 || t >= 12.0) {
    const inChat = t >= T.send;
    M.home = { bubble: t < T.bubbleOut + .15 ? 1 - seg(t, T.bubbleOut, T.bubbleOut + .15) : 0,
      title: t >= T.title[0] && t < 4.2 ? { p: T.title.map(x => eo(seg(t, x, x + .16))), om: eo(seg(t, T.om, T.om + .3)), sub: eo(seg(t, T.sub, T.sub + .3)) } : null,
      peek: { op: t < T.morph0 + .06 ? 1 : 0, eyes: t > T.blink && t < T.blink + .12 ? 'blink' : 'n', outline: seg(t, T.morph1, T.morph1 + .3) * (inChat ? 1 - seg(t, T.send, T.send + .25) : 1) },
      cards: inChat ? 1 - seg(t, T.send, T.send + .25) : 1 };
    if (inChat && t > T.send + .3) { M.home.cards = 0; M.home.peek = null; }
    const typedQ = t >= 12.0 ? typed(TY.q, Q, t) : '';
    M.input = { text: inChat ? '' : typedQ, focus: t >= T.focus, caret: t >= T.focus && (Math.floor(t * 2.4) % 2 === 0 || (t > TY.q[0] && t < T.send)), press: t >= T.send && t < T.send + .12,
      y: inChat ? lerp(IN.y0, IN.y1, eio(seg(t, T.send, T.send + .4))) : IN.y0 };
    if (inChat) M.chat = { msgs: chatMsgs(t) };
  } else {
    const k = seg(t, 9.96, 10.2);
    M.doc = { op: eo(k), play: .05 + .3 * seg(t, 10, 12), sum: T.sum.map(x => eo(seg(t, x, x + .2))), lines: [0, 1, 2, 3].map(i => eo(seg(t, 10.08 + i * .06, 10.3 + i * .06))), hl: eo(seg(t, T.hl, T.hl + .18)) };
  }
  if (t >= T.out) { const k = eio(seg(t, T.out, T.out + .6)); A.winSt = { op: 1 - k, tf: `scale(${1 - .14 * k})` }; }
  return A;
}

function chatMsgs(t) {
  const m = [], k = seg(t, T.send, T.send + .4), e = back(k, 1.1);
  m.push({ k: 'u', text: Q, op: Math.min(1, k * 4), tf: `translateY(${(1 - e) * 360}px)` });
  if (t >= T.ans) {
    const li = ['周五前提交 Q4 方案', '整理用户访谈纪要', '下周二评审新版首页'];
    m.push({ k: 'a', id: 'ans', op: eo(seg(t, T.ans, T.ans + .2)), tf: `translateY(${(1 - eo(seg(t, T.ans, T.ans + .25))) * 12}px)`,
      html: `根据《周会录音》，共有 3 项待办<sup>1</sup>：<ol>${li.map((s, i) => `<li style="opacity:${eo(seg(t, T.li[i], T.li[i] + .15))};transform:translateX(${(1 - eo(seg(t, T.li[i], T.li[i] + .2))) * -14}px)"><span class="n">${i + 1}</span>${s}</li>`).join('')}</ol>` });
  }
  if (t >= T.cite) m.push({ k: 'cite', op: eo(seg(t, T.cite, T.cite + .12)), sc: .8 + .2 * back(seg(t, T.cite, T.cite + .25)) });
  const tx = ['新建文件夹 <b>会议待办</b>', '保存 <b>待办清单</b> 到 会议待办'];
  T.tools.forEach(([a, b], i) => { if (t >= a) m.push({ k: 'tool', id: 'tool' + (i + 1), text: tx[i], op: eo(seg(t, a, a + .12)), done: t >= b, spin: t * 540 }); });
  return m;
}

// 片尾卡：小黑 logo + 口号（四个名词是小黑的落脚点）
function endCard(t) {
  const k = eo(seg(t, T.out + .15, T.out + .6)), s = eo(seg(t, T.out + .3, T.out + .7)), c = eo(seg(t, T.cta, T.cta + .35));
  const on = i => t >= T.w[i], lit = t >= T.final;
  const w = (txt, i) => `<span class="w ${on(i) || lit ? 'on' : ''}" data-a="e-w${i}" style="transform:scale(${on(i) ? 1 + .12 * (1 - seg(t, T.w[i], T.w[i] + .25)) : 1})">${txt}</span>`;
  const g = (txt, i) => `<span class="w ${(on(i) && t >= T.w[i] + .25) || lit ? 'on' : ''}">${txt}</span>`;   // "变成"跟在落点之后亮
  return `<div class="end" style="top:300px;opacity:${k};transform:translateY(${(1 - k) * 20}px)"><span class="brand">${XH.vector({ x: 55, y: 92, w: 110 }).replace('position:absolute', 'position:relative;display:inline-block;vertical-align:middle').replace(/left:[^;]+;top:[^;]+;/, '')}<span>小黑 <span class="om">OmniBox</span></span></span></div>
    <div class="end" style="top:520px;opacity:${s}"><span class="slogan">${w('万物', 0)}${g('变成', 0)}${w('记忆', 1)}<span class="dot">·</span>${w('记忆', 2)}${g('变成', 2)}${w('万物', 3)}</span></div>
    <div class="end" style="top:680px;opacity:${c};transform:translateY(${(1 - c) * 14}px)"><span class="cta"><b>免费开始</b>omnibox.pro</span></div>`;
}
