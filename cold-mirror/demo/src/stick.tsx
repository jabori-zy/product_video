// 火柴人：人物的一切动作都用它表现（照片只用在「看发型」的镜头里）。
// 头发按当前造型画颜色和形状，所以变成火柴人也认得出是哪个发型。
//
// 坐标：人物自己的单位，宽 200、高 400，脚底在 y = 400，髋在 (100, 230)。
// 角度：0° = 竖直向下，正值转向 +x（侧面图里就是「向前」），180° = 竖直向上。肘、膝的角度是相对上一节的。
import React from 'react';
import { seg, lerp, EASE } from './timing';

export type Pose = { lean: number; head: number; lSh: number; lEl: number; rSh: number; rEl: number; lHip: number; lKn: number; rHip: number; rKn: number; dy: number };
export type View = 'front' | 'back' | 'side';
export type HairShape = 'long' | 'short' | 'ponytail' | 'twin' | 'bun' | 'wolf';
export type Hair = { color: string; shape: HairShape; streak?: string };
export type Prop = 'phone' | 'cup' | 'scissors' | 'comb' | null;

export const STAND: Pose = { lean: 0, head: 0, lSh: -10, lEl: 0, rSh: 10, rEl: 0, lHip: -5, lKn: 0, rHip: 5, rKn: 0, dy: 0 };
export const pose = (o: Partial<Pose>): Pose => ({ ...STAND, ...o });
// 坐姿（侧面）：大腿水平向前，小腿垂下，髋下降一个大腿长
export const SEATED: Pose = pose({ lHip: 85, lKn: -85, rHip: 80, rKn: -80, dy: 85, lSh: 15, lEl: 30, rSh: 20, rEl: 30 });

export const mix = (a: Pose, b: Pose, t: number): Pose =>
  Object.fromEntries(Object.keys(a).map((k) => [k, lerp(a[k as keyof Pose], b[k as keyof Pose], t)])) as Pose;
// 关键帧姿势：[[帧, 姿势], …]，相邻两帧之间缓动插值
export const poseAt = (g: number, keys: [number, Pose][]): Pose => {
  if (g <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (g < keys[i][0]) return mix(keys[i - 1][1], keys[i][1], seg(g, keys[i - 1][0], keys[i][0], EASE));
  return keys[keys.length - 1][1];
};
// 侧面走路：腿前后摆、手臂反向摆、后腿屈膝、身体上下起伏
export const walk = (phase: number, stride = 28): Pose => {
  const s = Math.sin(phase), c = Math.cos(phase);
  return pose({
    lHip: stride * s, rHip: -stride * s,
    lKn: -28 * Math.max(0, -c), rKn: -28 * Math.max(0, c),
    lSh: -0.8 * stride * s, rSh: 0.8 * stride * s, lEl: 18, rEl: 18,
    lean: 4, dy: -5 * Math.abs(c),
  });
};
// 正面 / 背面走路（朝镜头或背离镜头）：腿左右交替抬起、手臂小幅摆动
export const walkFront = (phase: number): Pose => {
  const s = Math.sin(phase);
  return pose({ lHip: -5 + 3 * s, rHip: 5 + 3 * s, lKn: 12 * Math.max(0, s), rKn: -12 * Math.max(0, -s), lSh: -10 - 6 * s, rSh: 10 - 6 * s, lEl: -6, rEl: 6, dy: -6 * Math.abs(s) });
};

type Pt = [number, number];
const D = Math.PI / 180;
const limb = (p: Pt, a: number, len: number): Pt => [p[0] + len * Math.sin(a * D), p[1] + len * Math.cos(a * D)];

// 关节位置（人物单位）。镜头里要让别的东西对准手的时候用（比如推进到手机）
export const joints = (p: Pose, view: View) => {
  const hip: Pt = [100, 230 + p.dy];
  const neck: Pt = [hip[0] + 120 * Math.sin(p.lean * D), hip[1] - 120 * Math.cos(p.lean * D)];
  const head: Pt = [neck[0] + 40 * Math.sin((p.lean + p.head) * D), neck[1] - 40 * Math.cos((p.lean + p.head) * D)];
  const wide = view !== 'side';
  const sh = (side: number): Pt => [neck[0] + (wide ? 22 * side : 0), neck[1] + 6];
  const hp = (side: number): Pt => [hip[0] + (wide ? 13 * side : 0), hip[1]];
  const arm = (side: number, a: number, e: number) => { const s = sh(side), el = limb(s, a, 68); return { s, el, hand: limb(el, a + e, 62) }; };
  const leg = (side: number, a: number, k: number) => { const h = hp(side), kn = limb(h, a, 85); return { h, kn, foot: limb(kn, a + k, 85) }; };
  return { hip, neck, head, L: arm(-1, p.lSh, p.lEl), R: arm(1, p.rSh, p.rEl), LL: leg(-1, p.lHip, p.lKn), RL: leg(1, p.rHip, p.rKn) };
};
// 人物单位 → 画面像素（x, y 是脚底中点，h 是身高）
export const toScreen = (pt: Pt, x: number, y: number, h: number, flip = false): Pt => {
  const k = h / 400;
  return [x + (flip ? -1 : 1) * (pt[0] - 100) * k, y - h + pt[1] * k];
};

const R = 30; // 头的半径
const SKIN = '#f3d9c8';

// 头发：后面那片（披下来的部分）
const backHair = (c: Pt, hair: Hair, view: View, swing: number) => {
  const [cx, cy] = c, side = view === 'side' ? -10 : 0;
  const len = { long: 150, short: 62, wolf: 120, ponytail: 0, twin: 0, bun: 0 }[hair.shape];
  const out: React.ReactNode[] = [];
  if (len) {
    const w = hair.shape === 'short' ? 92 : 84, x0 = cx + side;
    // 底边：狼尾是参差的锯齿，其余是圆弧
    const bottom = hair.shape === 'wolf'
      ? `L ${x0 + w / 2 - 4} ${cy + len} l -12 -22 l -10 26 l -12 -24 l -10 26 l -12 -24 l -10 26 l -12 -26 L ${x0 - w / 2 + 6} ${cy + len}`
      : `Q ${x0} ${cy + len + 14} ${x0 - w / 2 + 6} ${cy + len}`;
    const d = `M ${x0 - w / 2} ${cy - 6} A ${w / 2} ${w / 2} 0 0 1 ${x0 + w / 2} ${cy - 6} Q ${x0 + w / 2 + 6} ${cy + len * 0.6} ${x0 + w / 2 - 6} ${cy + len} ${bottom} Q ${x0 - w / 2 - 6} ${cy + len * 0.6} ${x0 - w / 2} ${cy - 6} Z`;
    out.push(<path key="b" d={d} fill={hair.color} transform={`rotate(${swing} ${cx} ${cy - R})`} />);
    if (hair.streak) [-24, -6, 14, 28].forEach((dx, i) => out.push(<path key={`s${i}`} d={`M ${x0 + dx} ${cy + 4} Q ${x0 + dx * 1.2} ${cy + len * 0.5} ${x0 + dx * 1.1} ${cy + len - 8}`} stroke={hair.streak} strokeWidth={6} fill="none" strokeLinecap="round" transform={`rotate(${swing} ${cx} ${cy - R})`} />));
  }
  const tail = (bx: number, by: number, a: number, l: number, k: string) => (
    <path key={k} d={`M ${bx - 12} ${by} Q ${bx - 18} ${by + l * 0.55} ${bx} ${by + l} Q ${bx + 18} ${by + l * 0.55} ${bx + 12} ${by} Z`} fill={hair.color} transform={`rotate(${a} ${bx} ${by})`} />
  );
  if (hair.shape === 'ponytail') out.push(view === 'side' ? tail(cx - R * 0.8, cy - R * 0.7, -30 + swing, 115, 't') : tail(cx + R * 0.5, cy - R * 0.9, 20 + swing * 0.4, 100, 't'));
  if (hair.shape === 'twin') { out.push(tail(cx - R * 0.95, cy - 4, -12 + swing * 0.5, 105, 't1')); out.push(tail(cx + R * 0.95, cy - 4, 12 + swing * 0.5, 105, 't2')); }
  return out;
};
// 头发：头顶那片（正面是刘海，背面盖住整个头，侧面盖住后脑）
const capHair = (c: Pt, hair: Hair, view: View) => {
  const [cx, cy] = c, r = R + 4;
  const bun = hair.shape === 'bun' ? <circle cx={view === 'side' ? cx - 14 : cx} cy={cy - r - 8} r={17} fill={hair.color} /> : null;
  if (view === 'back') return <>{bun}<circle cx={cx} cy={cy} r={r} fill={hair.color} /></>;
  if (view === 'side') return <>{bun}<path d={`M ${cx + r * 0.55} ${cy - r * 0.85} A ${r} ${r} 0 1 0 ${cx - r * 0.2} ${cy + r * 0.98} L ${cx - 4} ${cy} Z`} fill={hair.color} /></>;
  return <>{bun}<path d={`M ${cx - r} ${cy + 8} L ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy} L ${cx + r} ${cy + 8} Q ${cx + r * 0.5} ${cy - r * 0.15} ${cx} ${cy - r * 0.05} Q ${cx - r * 0.5} ${cy - r * 0.15} ${cx - r} ${cy + 8} Z`} fill={hair.color} /></>;
};

const PropAt: React.FC<{ kind: Prop; at: Pt; open?: number }> = ({ kind, at, open = 0 }) => {
  const [x, y] = at;
  if (kind === 'phone') return <g><rect x={x - 11} y={y - 30} width={22} height={40} rx={4} fill="#111" stroke="#fff" strokeWidth={2} /><rect x={x - 7} y={y - 26} width={14} height={30} rx={2} fill="#7fb8ff" opacity={0.85} /></g>;
  if (kind === 'cup') return <g><path d={`M ${x - 10} ${y - 18} H ${x + 10} L ${x + 8} ${y + 4} H ${x - 8} Z`} fill="#f4efe6" stroke="#b57a4a" strokeWidth={2} /><path d={`M ${x + 10} ${y - 12} q 8 2 6 10 q -2 5 -7 4`} stroke="#f4efe6" strokeWidth={3} fill="none" /></g>;
  if (kind === 'comb') return <g><rect x={x - 4} y={y - 34} width={8} height={36} rx={3} fill="#222" />{[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={x + 4} y1={y - 30 + i * 5} x2={x + 12} y2={y - 30 + i * 5} stroke="#222" strokeWidth={2} />)}</g>;
  if (kind === 'scissors') {
    const a = 6 + 22 * open;
    return <g stroke="#dfe3e8" strokeWidth={4} strokeLinecap="round" fill="none">
      <line x1={x} y1={y} x2={x - 40 * Math.sin(a * D)} y2={y - 40 * Math.cos(a * D)} /><line x1={x} y1={y} x2={x + 40 * Math.sin(a * D)} y2={y - 40 * Math.cos(a * D)} />
      <circle cx={x - 7} cy={y + 9} r={6} /><circle cx={x + 7} cy={y + 9} r={6} /></g>;
  }
  return null;
};

export const Stick: React.FC<{
  x: number; y: number; h: number; pose: Pose; view?: View; flip?: boolean; hair?: Hair; swing?: number;
  prop?: Prop; propL?: Prop; open?: number; opacity?: number; blur?: number; color?: string; hideLegs?: boolean;
}> = ({ x, y, h, pose: p, view = 'front', flip = false, hair, swing = 0, prop = null, propL = null, open = 0, opacity = 1, blur = 0, color = '#fff', hideLegs = false }) => {
  const j = joints(p, view);
  const seg2 = (a: Pt, b: Pt, c: Pt, k: string, dim = false) => (
    <g key={k} opacity={dim ? 0.6 : 1}>
      <polyline points={`${a} ${b} ${c}`} stroke="rgba(0,0,0,.4)" strokeWidth={17} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={`${a} ${b} ${c}`} stroke={color} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
  const side = view === 'side';
  // 侧面图：远侧（左）手脚先画、稍暗，营造前后
  const legs = hideLegs ? [] : [seg2(j.LL.h, j.LL.kn, j.LL.foot, 'll', side), seg2(j.RL.h, j.RL.kn, j.RL.foot, 'rl')];
  const armL = seg2(j.L.s, j.L.el, j.L.hand, 'la', side), armR = seg2(j.R.s, j.R.el, j.R.hand, 'ra');
  const torso = seg2(j.hip, j.neck, j.neck, 't');
  const neckTop: Pt = [j.neck[0] + (j.head[0] - j.neck[0]) * 0.3, j.neck[1] + (j.head[1] - j.neck[1]) * 0.3];
  const neck = seg2(j.neck, neckTop, neckTop, 'n');
  const head = (
    <g key="h">
      <circle cx={j.head[0]} cy={j.head[1]} r={R + 3} fill="rgba(0,0,0,.4)" />
      <circle cx={j.head[0]} cy={j.head[1]} r={R} fill={SKIN} stroke={color} strokeWidth={5} />
      {view === 'front' && <><circle cx={j.head[0] - 10} cy={j.head[1] + 4} r={3} fill="#333" /><circle cx={j.head[0] + 10} cy={j.head[1] + 4} r={3} fill="#333" /></>}
      {side && <circle cx={j.head[0] + 16} cy={j.head[1] + 3} r={3} fill="#333" />}
    </g>
  );
  const back = hair ? backHair(j.head, hair, view, swing) : null;
  const cap = hair ? capHair(j.head, hair, view) : null;
  const props = <><PropAt kind={prop} at={j.R.hand} open={open} /><PropAt kind={propL} at={j.L.hand} open={open} /></>;
  const body = view === 'back'
    ? <>{legs}{armL}{armR}{torso}{neck}{back}{head}{cap}{props}</>
    : <>{back}{legs}{side ? armL : null}{torso}{neck}{head}{cap}{side ? null : armL}{armR}{props}</>;
  return (
    <svg viewBox="0 0 200 400" style={{ position: 'absolute', left: x - h / 4, top: y - h, width: h / 2, height: h, overflow: 'visible', opacity,
      transform: flip ? 'scaleX(-1)' : undefined, filter: blur ? `blur(${blur}px)` : undefined }}>
      {body}
    </svg>
  );
};
