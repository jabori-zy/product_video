// S5 蓄力 · 快闪（15–16 s）：十六分音符闪过平台与开放能力，最后四帧全黑静默
import React from 'react';
import { AbsoluteFill, useCurrentFrame, random } from 'remotion';
import { C, K, START } from '../timing';
import { FONT } from '../fonts';
import { Grain } from '../components/visual';

const WORDS = ['浏览器插件', 'iOS', 'Android', 'Claude Code', 'Codex', '开源', '私有部署'];
const COLS = [C.cream, C.cyan, '#fff', C.amber, C.violet, C.cyan, C.cream];

export const S5Flash: React.FC = () => {
  const g = useCurrentFrame() + START[4];
  let i = -1; K.flash.forEach((f, j) => { if (g >= f) i = j; });
  const on = i >= 0 && g < K.silence;
  const local = on ? g - K.flash[i] : 0;
  const jx = (random(`jx${g}`) - 0.5) * 18, jy = (random(`jy${g}`) - 0.5) * 10;
  const w = on ? WORDS[i] : '';
  const size = w.length > 6 ? 190 : 240;
  const layer = (color: string, dx: number, op: number) => (
    <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: size, fontWeight: local === 0 ? 900 : 300 + 200 * (3 - local), letterSpacing: '-0.01em', color, opacity: op, transform: `translate(${jx + dx}px, ${jy}px) scale(${1.06 - local * 0.02})`, mixBlendMode: 'screen', whiteSpace: 'nowrap' }}>{w}</div>
  );
  return (
    <AbsoluteFill style={{ background: C.void, fontFamily: FONT, overflow: 'hidden' }}>
      {on && <>
        <AbsoluteFill style={{ background: `radial-gradient(900px 500px at 50% 50%, ${COLS[i]}33, transparent 70%)` }} />
        {layer('#FF2D55', -10, 0.8)}{layer('#22D3EE', 10, 0.8)}{layer(COLS[i], 0, 1)}
        <div style={{ position: 'absolute', left: 0, right: 0, top: 540 + (random(`sl${g}`) - 0.5) * 300, height: 6 + random(`sh${g}`) * 18, background: 'rgba(255,255,255,.25)', mixBlendMode: 'overlay' }} />
      </>}
      <Grain frame={g} opacity={0.1} />
    </AbsoluteFill>
  );
};
