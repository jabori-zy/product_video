// 小黑：16×13 方像素。按 assets/小黑参考图.jpg 正面像展开：纯黑圆脑袋、两只尖耳、奶油色圆眼圈 + 黑瞳孔，没有嘴和身体。
// 道具与特效（火花、对勾、感叹号、爱心、尘土）用同一像素网格。
export const INK = '#141414', INK2 = '#2A2A2A', CREAM = '#FBF3E4', GOLD = '#F5C542', BLUE = '#2E7CF6', GREEN = '#22A55B';

const BODY = [
  '..#..........#..',
  '..##........##..',
  '.####......####.',
  '.##############.',
  '################',
  '################',
  '################',
  '################',
  '################',
  '################',
  '################',
  '.##############.',
  '..############..'];
// 眼睛：4×4 奶油色圆盘（去四角），2×2 瞳孔可移动；其它表情直接给奶油色像素
const DISC = [[1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [3, 1], [0, 2], [1, 2], [2, 2], [3, 2], [1, 3], [2, 3]];
const PUPIL = { n: [1, 1], l: [0, 1], r: [2, 1], u: [1, 0], d: [1, 2] };
const SHAPES = { happy: [[0, 2], [1, 1], [2, 1], [3, 2]], shut: [[0, 2], [1, 2], [2, 2], [3, 2]], blink: [[0, 2], [1, 2], [2, 2], [3, 2], [1, 1], [2, 1]] };

// 返回 [[c, r, kind]]，kind: 1 身体 2 眼白 3 高光
export function grid({ eyes = 'n' } = {}) {
  const P = new Map(), put = (c, r, v) => P.set(c + ',' + r, v);
  BODY.forEach((row, r) => [...row].forEach((ch, c) => { if (ch === '#') put(c, r, 1); }));
  for (const [c, r] of [[3, 4], [4, 4], [5, 4], [2, 5]]) put(c, r, 3);                 // 左上一点高光 = 体积
  for (const ex of [2, 10]) {
    const ey = 5;
    if (SHAPES[eyes]) { for (const [c, r] of SHAPES[eyes]) put(ex + c, ey + r, 2); continue; }
    for (const [c, r] of DISC) put(ex + c, ey + r, 2);
    if (eyes === 'wide') { put(ex + 1, ey + 1, 1); continue; }                            // 瞳孔缩成 1 像素
    const [pc, pr] = PUPIL[eyes] || PUPIL.n;
    for (const [c, r] of [[0, 0], [1, 0], [0, 1], [1, 1]]) put(ex + pc + c, ey + pr + r, 1);
  }
  return [...P].map(([k, v]) => { const [c, r] = k.split(',').map(Number); return [c, r, v]; });
}
const COL = { 1: INK, 2: CREAM, 3: INK2 };

// x,y = 底边中点（世界坐标）；px = 像素边长；sq>0 压扁 <0 拉长；rot 弧度
export function sprite({ x, y, px = 6, sq = 0, rot = 0, op = 1, shadow = 0, eyes = 'n' }) {
  let s = '';
  for (const [c, r, v] of grid({ eyes })) s += `<rect x="${c}" y="${r}" width="1.04" height="1.04" fill="${COL[v]}"/>`;
  const sy = 1 - sq, sx = 1 + sq * .7, w = 16 * px * sx, h = 13 * px * sy;
  const sh = shadow > 0 ? `<div style="position:absolute;left:${x - 6 * px}px;top:${y - px * .35}px;width:${12 * px}px;height:${px * .7}px;border-radius:50%;background:rgba(0,0,0,${.14 * shadow})"></div>` : '';
  return sh + `<svg class="px" viewBox="0 0 16 13" width="${w}" height="${h}" style="left:${x - w / 2}px;top:${y - h}px;opacity:${op};transform:rotate(${rot}rad);transform-origin:50% 70%" shape-rendering="crispEdges">${s}</svg>`;
}
// 像素中心点（世界坐标），变身与爆散用
export function pixels(o) {
  const { x, y, px = 6 } = o;
  return grid(o).map(([c, r, v]) => ({ x: x + (c - 8 + .5) * px, y: y + (r - 13 + .5) * px, v, col: COL[v] }));
}
export function pixart(rows, { x, y, px = 6, pal, op = 1 }) {
  let s = ''; rows.forEach((row, r) => [...row].forEach((ch, c) => { if (pal[ch]) s += `<rect x="${c}" y="${r}" width="1.04" height="1.04" fill="${pal[ch]}"/>`; }));
  const W = rows[0].length, H = rows.length;
  return `<svg class="px" viewBox="0 0 ${W} ${H}" width="${W * px}" height="${H * px}" style="left:${x}px;top:${y}px;opacity:${op}" shape-rendering="crispEdges">${s}</svg>`;
}
export const SPARK = (x, y, px = 5, col = GOLD, op = 1) => pixart(['..y..', '..y..', 'yy.yy', '..y..', '..y..'], { x: x - 2.5 * px, y: y - 2.5 * px, px, op, pal: { y: col } });
export const CHECK = (x, y, px = 5, op = 1) => pixart(['.....g', '....gg', 'g..gg.', 'gggg..', '.gg...'], { x, y, px, op, pal: { g: GREEN } });
export const BANG = (x, y, px = 5, op = 1) => pixart(['.kkk.', 'kwwwk', 'kwkwk', 'kwkwk', 'kwwwk', 'kwkwk', 'kwwwk', '.kkk.'], { x, y, px, op, pal: { w: CREAM, k: INK } });
export const HEART = (x, y, px = 5, op = 1) => pixart(['.rr.rr.', 'rrrrrrr', 'rrrrrrr', '.rrrrr.', '..rrr..', '...r...'], { x: x - 3.5 * px, y: y - 3 * px, px, op, pal: { r: '#F04438' } });
export const NOTE = (x, y, px = 5, op = 1) => pixart(['..kkk', '..k.k', '..k.k', 'kkk.k', 'kkkkk', 'kkk..'], { x, y, px, op, pal: { k: INK } });
// 尘土：t 0→1 向两侧散开
export function dust(x, y, t, px = 4, n = 6, seed = 1) {
  if (t <= 0 || t >= 1) return ''; let s = '';
  for (let i = 0; i < n; i++) {
    const side = i % 2 ? 1 : -1, k = (i >> 1) + 1, e = 1 - Math.pow(1 - t, 2);
    const dx = side * (14 + k * 13 + ((seed * 7 + i * 13) % 9)) * e, dy = -(6 + k * 4) * Math.sin(Math.PI * t * .9), sz = px * (1 - t * .7);
    s += `<div style="position:absolute;left:${x + dx - sz / 2}px;top:${y + dy - sz}px;width:${sz}px;height:${sz}px;background:#C9CCD3;opacity:${1 - t}"></div>`;
  }
  return s;
}
// 矢量小黑（界面里本来就有的那只，探头 / logo 用），viewBox 0 0 100 84，底边中点对齐
export const VECTOR_PATH = 'M14 6 C20 2 30 14 36 24 C44 22 56 22 64 24 C70 14 80 2 86 6 C92 12 92 26 91 34 C99 44 100 56 96 66 C90 80 70 84 50 84 C30 84 10 80 4 66 C0 56 1 44 9 34 C8 26 8 12 14 6 Z';
export function vector({ x, y, w = 90, op = 1, eyes = 'n', clip = null }) {
  const h = w * .84, pu = eyes === 'blink' ? '' : `<circle cx="33" cy="52" r="7" fill="${INK}"/><circle cx="67" cy="52" r="7" fill="${INK}"/>`;
  const eye = eyes === 'blink' ? `<rect x="21" y="50" width="24" height="5" rx="2.5" fill="${CREAM}"/><rect x="55" y="50" width="24" height="5" rx="2.5" fill="${CREAM}"/>`
    : `<circle cx="33" cy="52" r="13" fill="${CREAM}"/><circle cx="67" cy="52" r="13" fill="${CREAM}"/>`;
  return `<svg style="position:absolute;left:${x - w / 2}px;top:${y - h}px;opacity:${op};${clip ? `clip-path:${clip}` : ''}" width="${w}" height="${h}" viewBox="0 0 100 84"><path d="${VECTOR_PATH}" fill="${INK}"/>${eye}${pu}</svg>`;
}
