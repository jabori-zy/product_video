// 五种自定义转场（@remotion/transitions presentation）：眼圈光圈 / 剪影吞噬 / 星图拉镜 / 液体融合 / 光漏闪白
import React from 'react';
import { AbsoluteFill } from 'remotion';
import type { TransitionPresentation, TransitionPresentationComponentProps } from '@remotion/transitions';
import { C, clamp, EASE } from '../timing';
import { XH_PATH } from '../components/visual';

type P = Record<string, never>;
const make = (component: React.FC<TransitionPresentationComponentProps<P>>): TransitionPresentation<P> => ({ component, props: {} as P });
const ss = (x: number) => { x = clamp(x); return x * x * (3 - 2 * x); };

// ① 眼圈光圈：右眼瞳孔放大成圆形遮罩，边缘一圈奶油色光环
export const eyeIris = (cx = 1070, cy = 470) => make(({ children, presentationDirection: dir, presentationProgress: p }) => {
  const e = EASE(p), r = 20 + e * 2300;
  if (dir === 'exiting') return <AbsoluteFill style={{ transform: `scale(${1 + 0.25 * e})`, transformOrigin: `${cx}px ${cy}px` }}>{children}</AbsoluteFill>;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `circle(${r}px at ${cx}px ${cy}px)` }}>{children}</AbsoluteFill>
      <div style={{ position: 'absolute', left: cx - r, top: cy - r, width: r * 2, height: r * 2, borderRadius: '50%', border: `${10 * (1 - e) + 2}px solid ${C.cream}`, boxShadow: `0 0 60px rgba(251,243,228,${0.9 * (1 - e)})`, opacity: 1 - e }} />
    </AbsoluteFill>
  );
});

// ② 剪影吞噬：碎片被吸向中心，小黑的黑色剪影从中心长大，剪影内部显出下一场
const maskURL = `url("data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 84'><path d='${XH_PATH}' fill='black'/></svg>`)}")`;
export const silhouetteSwallow = () => make(({ children, presentationDirection: dir, presentationProgress: p }) => {
  if (dir === 'exiting') {
    const k = EASE(clamp(p / 0.75));
    return <AbsoluteFill style={{ transform: `scale(${1 - 0.8 * k}) rotate(${k * 12}deg)`, opacity: 1 - ss((p - 0.35) / 0.4), filter: `blur(${k * 6}px) brightness(${1 - 0.5 * k})` }}>{children}</AbsoluteFill>;
  }
  const w = 40 + Math.pow(p, 2.2) * 5200, h = w * 0.84;   // 5200 宽时剪影内部完全盖住画面
  const black = 1 - ss((p - 0.3) / 0.45);
  return (
    <AbsoluteFill style={{ WebkitMaskImage: maskURL, WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: `${960 - w / 2}px ${560 - h * 0.62}px`, WebkitMaskSize: `${w}px ${h}px` }}>
      {children}
      <AbsoluteFill style={{ background: C.ink, opacity: black }} />
    </AbsoluteFill>
  );
});

// ③ 星图拉镜：推进最亮的节点，节点光晕铺满画面后露出下一场
export const dollyZoom = (cx = 960, cy = 560) => make(({ children, presentationDirection: dir, presentationProgress: p }) => {
  const e = EASE(p);
  if (dir === 'exiting') return <AbsoluteFill style={{ transform: `scale(${1 + 5 * e * e})`, transformOrigin: `${cx}px ${cy}px`, filter: `blur(${e * 16}px)`, opacity: 1 - ss((p - 0.45) / 0.45) }}>{children}</AbsoluteFill>;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${0.7 + 0.3 * e})`, opacity: ss((p - 0.35) / 0.5), filter: `blur(${(1 - e) * 10}px)` }}>{children}</AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${cx}px ${cy}px, rgba(255,255,255,${0.9 * Math.sin(Math.PI * p)}) 0%, rgba(34,211,238,${0.5 * Math.sin(Math.PI * p)}) 30%, transparent 70%)`, mixBlendMode: 'screen' }} />
    </AbsoluteFill>
  );
});

// ④ 液体融合：前一场被湍流位移拉成光带，后一场从中渗出
export const liquidBlend = () => make(({ children, presentationDirection: dir, presentationProgress: p }) => {
  const s = Math.sin(Math.PI * p), id = `liq${Math.round(p * 1000)}`;
  if (dir === 'exiting') return (
    <AbsoluteFill>
      <svg width="0" height="0" style={{ position: 'absolute' }}><filter id={id} x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency={`${0.004 + 0.01 * p} 0.03`} numOctaves={2} seed={3} /><feDisplacementMap in="SourceGraphic" scale={260 * s} xChannelSelector="R" yChannelSelector="G" /></filter></svg>
      <AbsoluteFill style={{ filter: `url(#${id}) saturate(${1 + p})`, opacity: 1 - ss((p - 0.4) / 0.5) }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
  return <AbsoluteFill style={{ opacity: ss((p - 0.3) / 0.6) }}>{children}</AbsoluteFill>;
});

// ⑤ 光漏闪白：一道奶油到琥珀的光从右上划过，drop 就落在光最亮的那一帧
export const lightLeak = () => make(({ children, presentationDirection: dir, presentationProgress: p }) => {
  if (dir === 'exiting') return <AbsoluteFill>{children}</AbsoluteFill>;
  const s = Math.sin(Math.PI * p), x = 110 - p * 70, y = -10 + p * 60;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: ss((p - 0.4) / 0.4) }}>{children}</AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(1400px 900px at ${x}% ${y}%, rgba(255,250,238,${0.97 * s * s}) 0%, rgba(245,197,66,${0.55 * s * s}) 40%, transparent 75%)`, mixBlendMode: 'screen' }} />
      <AbsoluteFill style={{ background: '#FFFBF2', opacity: Math.pow(s, 3) }} />
    </AbsoluteFill>
  );
});
