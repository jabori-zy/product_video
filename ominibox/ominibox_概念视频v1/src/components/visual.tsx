// 共用视觉组件：小黑（形状 / 眼睛 / logo）、流体渐变光场、颗粒、玻璃卡片、粒子
import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import { noise2D } from '@remotion/noise';
import { C } from '../timing';
import { FONT } from '../fonts';

// 小黑正面轮廓（按 assets/小黑参考图.jpg 描出），viewBox 0 0 100 84；所有形态共用这一条 path
export const XH_PATH = 'M14 6 C20 2 30 14 36 24 C44 22 56 22 64 24 C70 14 80 2 86 6 C92 12 92 26 91 34 C99 44 100 56 96 66 C90 80 70 84 50 84 C30 84 10 80 4 66 C0 56 1 44 9 34 C8 26 8 12 14 6 Z';
export const EYES = [{ x: 33, y: 52 }, { x: 67, y: 52 }];

// logo：实心黑头 + 奶油眼圈；open 控制睁眼（0 闭 → 1 睁），look 让瞳孔偏移
export const XiaoheiLogo: React.FC<{ w: number; open?: number; look?: [number, number]; fill?: string; style?: React.CSSProperties; strokeDash?: { strokeDasharray: string; strokeDashoffset: number }; fillOp?: number }> =
  ({ w, open = 1, look = [0, 0], fill = C.ink, style, strokeDash, fillOp = 1 }) => (
    <svg width={w} height={w * 0.84} viewBox="-2 -2 104 88" style={{ overflow: 'visible', ...style }}>
      <path d={XH_PATH} fill={fill} fillOpacity={fillOp} stroke={strokeDash ? C.cream : 'none'} strokeWidth={strokeDash ? 1.6 : 0} {...(strokeDash || {})} />
      {EYES.map((e, i) => (
        <g key={i} transform={`translate(${e.x} ${e.y}) scale(1 ${Math.max(0.06, open)})`} opacity={fillOp}>
          <circle r={13} fill={C.cream} />
          <circle r={7} cx={look[0] * 4} cy={look[1] * 3} fill={C.ink} />
        </g>
      ))}
    </svg>
  );

// 流体渐变光场：几个大径向渐变斑块，位置由 noise2D 驱动缓慢流动
export const GradientField: React.FC<{ frame: number; base: string; blobs: { c: string; x: number; y: number; r: number }[]; speed?: number; seed?: string; opacity?: number }> =
  ({ frame, base, blobs, speed = 0.006, seed = 'f', opacity = 1 }) => {
    const g = blobs.map((b, i) => {
      const x = b.x + noise2D(seed + i, frame * speed, 0) * 18, y = b.y + noise2D(seed + i, 0, frame * speed) * 14;
      return `radial-gradient(${b.r}px ${b.r * 0.75}px at ${x}% ${y}%, ${b.c} 0%, transparent 70%)`;
    });
    return <AbsoluteFill style={{ background: [...g, base].join(','), opacity }} />;
  };

// 细颗粒：SVG 噪声，每帧换种子（确定性）
export const Grain: React.FC<{ frame: number; opacity?: number }> = ({ frame, opacity = 0.06 }) => (
  <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'overlay', opacity }}>
    <svg width="1920" height="1080">
      <filter id={`gr${frame % 8}`}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={frame % 8} /><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 1.4 0" /></filter>
      <rect width="1920" height="1080" filter={`url(#gr${frame % 8})`} />
    </svg>
  </AbsoluteFill>
);

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.55 }) => (
  <AbsoluteFill style={{ pointerEvents: 'none', background: `radial-gradient(ellipse 75% 70% at 50% 50%, transparent 55%, rgba(0,0,0,${strength}) 100%)` }} />
);

// 玻璃拟态卡片
export const Glass: React.FC<{ w: number; h?: number; children?: React.ReactNode; style?: React.CSSProperties; tint?: string; radius?: number; glow?: string }> =
  ({ w, h, children, style, tint = 'rgba(255,255,255,0.08)', radius = 22, glow }) => (
    <div style={{
      width: w, height: h, borderRadius: radius, background: `linear-gradient(145deg, rgba(255,255,255,0.16), ${tint})`, backdropFilter: 'blur(22px)',
      border: '1.5px solid rgba(255,255,255,0.22)', boxShadow: `0 24px 60px rgba(0,0,0,0.35)${glow ? `, 0 0 40px ${glow}` : ''}, inset 0 1px 0 rgba(255,255,255,0.35)`,
      color: '#F4F6FF', fontFamily: FONT, overflow: 'hidden', position: 'relative', ...style,
    }}>{children}</div>
  );

// 平台名胶囊（只用文字，不用第三方 logo）
export const Tag: React.FC<{ label: string; color: string; size?: number }> = ({ label, color, size = 15 }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: size, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: `${color}26`, color, border: `1px solid ${color}55`, letterSpacing: '0.02em' }}>
    <i style={{ width: 7, height: 7, borderRadius: 7, background: color, display: 'inline-block' }} />{label}
  </span>
);

// 文字行占位（玻璃卡片里的"内容"）
export const Lines: React.FC<{ n: number; w?: number[]; color?: string; h?: number; gap?: number }> = ({ n, w = [100, 86, 92, 64], color = 'rgba(255,255,255,0.28)', h = 9, gap = 9 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap }}>{Array.from({ length: n }, (_, i) => <div key={i} style={{ height: h, width: `${w[i % w.length]}%`, borderRadius: h, background: color }} />)}</div>
);

// 粒子：固定种子，确定性
export const particles = (n: number, seed: string) => Array.from({ length: n }, (_, i) => ({
  x: random(`${seed}x${i}`) * 1920, y: random(`${seed}y${i}`) * 1080, r: 1 + random(`${seed}r${i}`) * 2.6, ph: random(`${seed}p${i}`) * Math.PI * 2, z: random(`${seed}z${i}`),
}));
export const Dust: React.FC<{ frame: number; seed?: string; n?: number; color?: string; drift?: number; opacity?: number }> = ({ frame, seed = 'd', n = 120, color = C.cream, drift = 0.25, opacity = 0.7 }) => {
  const P = React.useMemo(() => particles(n, seed), [n, seed]);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <svg width="1920" height="1080">
        {P.map((p, i) => {
          const x = (p.x + noise2D(seed + i, frame * 0.01, 0) * 30 + frame * drift * (0.3 + p.z)) % 1960 - 20, y = p.y + noise2D(seed + 'y' + i, 0, frame * 0.01) * 24;
          return <circle key={i} cx={x} cy={y} r={p.r * (0.5 + p.z)} fill={color} opacity={opacity * (0.25 + 0.6 * p.z) * (0.6 + 0.4 * Math.sin(frame * 0.12 + p.ph))} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};
