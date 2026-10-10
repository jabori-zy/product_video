// S1 睁眼（0–2 s）：黑暗里睁开两只奶油色眼圈，眨一下，打出「随时随地」
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring } from 'remotion';
import { C, K, START, FPS, seg, EASE } from '../timing';
import { FONT } from '../fonts';
import { Grain, Dust } from '../components/visual';

export const EYE_R = 74, EYE_Y = 470, EYE_X = [850, 1070];   // 右眼 (1070, 470) 是眼圈光圈转场的圆心
export const S1Eyes: React.FC = () => {
  const g = useCurrentFrame() + START[0];
  const open = spring({ frame: g - K.eyeOpen, fps: FPS, config: { damping: 12, stiffness: 120 } });
  const blink = g >= K.blink && g < K.blink + 6 ? 1 - Math.sin(((g - K.blink) / 6) * Math.PI) * 0.92 : 1;
  const sy = Math.max(0.04, open * blink);
  const look = interpolate(g, [K.eyeOpen, K.blink, K.blink + 8, 60], [0, -0.5, 0, 0.35], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const glow = 0.35 + 0.15 * Math.sin(g * 0.25);
  const txt = seg(g, K.anytime, K.anytime + 10, EASE);
  return (
    <AbsoluteFill style={{ background: C.void, fontFamily: FONT }}>
      <AbsoluteFill style={{ background: `radial-gradient(520px 320px at 50% ${EYE_Y / 10.8}%, rgba(46,124,246,${0.18 * open}) 0%, transparent 70%)` }} />
      <Dust frame={g} seed="s1" n={70} opacity={0.35 * open} drift={0.1} />
      {EYE_X.map((x, i) => (
        <div key={i} style={{ position: 'absolute', left: x - EYE_R, top: EYE_Y - EYE_R, width: EYE_R * 2, height: EYE_R * 2, transform: `scaleY(${sy})` }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: C.cream, boxShadow: `0 0 ${60 * glow}px rgba(251,243,228,${glow}), 0 0 140px rgba(251,243,228,${glow * 0.35})` }} />
          <div style={{ position: 'absolute', left: EYE_R * 0.47 + look * 22, top: EYE_R * 0.47, width: EYE_R * 1.06, height: EYE_R * 1.06, borderRadius: '50%', background: C.ink }} />
        </div>
      ))}
      <div style={{ position: 'absolute', top: 700, width: '100%', textAlign: 'center', color: C.cream, fontSize: 72, fontWeight: 800, letterSpacing: `${0.6 - 0.48 * txt}em`, opacity: txt, filter: `blur(${(1 - txt) * 10}px)` }}>
        随时随地
      </div>
      <Grain frame={g} opacity={0.08} />
    </AbsoluteFill>
  );
};
