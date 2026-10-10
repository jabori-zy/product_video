// 记忆星图：固定种子的节点 + 最近邻连线；S3 生长，S4 作为背景并点亮"引用"节点
import React from 'react';
import { random } from 'remotion';
import { evolvePath } from '@remotion/paths';
import { C, K, seg, EASE } from '../timing';

export const HUB = { x: 960, y: 560 };
export const PRIMARY = [{ x: 560, y: 470 }, { x: 800, y: 700 }, { x: 1150, y: 420 }, { x: 1400, y: 640 }];   // 四个解析结果坍缩后的落点
const N = 30;
export const NODES = [HUB, ...PRIMARY, ...Array.from({ length: N }, (_, i) => {
  const a = random(`na${i}`) * Math.PI * 2, r = 0.35 + 0.65 * Math.sqrt(random(`nr${i}`));
  return { x: 960 + Math.cos(a) * r * 820, y: 560 + Math.sin(a) * r * 360 };
})];
// 每个节点连到最近的两个（去重）
export const EDGES: [number, number][] = (() => {
  const E = new Set<string>();
  NODES.forEach((p, i) => NODES.map((q, j) => ({ j, d: Math.hypot(p.x - q.x, p.y - q.y) })).filter((o) => o.j !== i).sort((a, b) => a.d - b.d).slice(0, 2)
    .forEach(({ j }) => E.add(i < j ? `${i}-${j}` : `${j}-${i}`)));
  PRIMARY.forEach((_, i) => E.add(`0-${i + 1}`));
  return [...E].map((s) => s.split('-').map(Number) as [number, number]);
})();
// 节点出现帧：主节点 + 枢纽按 K.nodes 的拍点亮，其余按距离分批跟上
export const nodeAt = (i: number) => (i === 0 ? K.nodes[4] : i <= 4 ? K.nodes[i - 1] : K.nodes[Math.floor(random(`nt${i}`) * 4)] + Math.floor(random(`nd${i}`) * 6));

export const Constellation: React.FC<{ g: number; grow?: boolean; highlight?: number[]; hl?: number; opacity?: number }> = ({ g, grow = true, highlight = [], hl = 0, opacity = 1 }) => {
  const lit = (i: number) => (grow ? seg(g, nodeAt(i), nodeAt(i) + 6, EASE) : 1);
  return (
    <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0, opacity, overflow: 'visible' }}>
      <defs>
        <radialGradient id="ng"><stop offset="0" stopColor="#fff" /><stop offset=".35" stopColor={C.cyan} stopOpacity=".9" /><stop offset="1" stopColor={C.blue} stopOpacity="0" /></radialGradient>
        <linearGradient id="eg" x1="0" x2="1"><stop offset="0" stopColor={C.cyan} /><stop offset="1" stopColor={C.violet} /></linearGradient>
      </defs>
      {EDGES.map(([a, b], k) => {
        const p = NODES[a], q = NODES[b], t0 = Math.max(nodeAt(a), nodeAt(b));
        const e = grow ? seg(g, t0, t0 + 10, EASE) : 1; if (e <= 0) return null;
        const d = `M${p.x} ${p.y} L${q.x} ${q.y}`, ev = evolvePath(e, d);
        const on = highlight.includes(a) && highlight.includes(b) ? hl : 0;
        return <path key={k} d={d} stroke={on ? C.amber : 'url(#eg)'} strokeWidth={1.4 + 2.6 * on} strokeOpacity={0.45 + 0.5 * on} fill="none" strokeDasharray={ev.strokeDasharray} strokeDashoffset={ev.strokeDashoffset} />;
      })}
      {NODES.map((p, i) => {
        const l = lit(i); if (l <= 0) return null;
        const big = i === 0 ? 2.4 : i <= 4 ? 1.6 : 1;
        const on = highlight.includes(i) ? hl : 0;
        const pulse = 1 + 0.12 * Math.sin(g * 0.3 + i);
        return (
          <g key={i} transform={`translate(${p.x} ${p.y})`}>
            <circle r={26 * big * l * pulse * (1 + on)} fill="url(#ng)" opacity={0.55 + 0.45 * on} />
            <circle r={3.2 * big * l * (1 + 0.6 * on)} fill={on ? C.amber : '#fff'} />
          </g>
        );
      })}
    </svg>
  );
};
