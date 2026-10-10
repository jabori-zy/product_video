import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { FPS } from './lib';
import { FONT } from './fonts';
import { Main } from './Main';
import { resolve } from './appTimeline';
import { M1 } from './scenes/M1';
import { M2 } from './scenes/M2';

// demo-add_more_app：原片（按 pace.ts 放慢）+ 两段手机插段，见 appTimeline.ts
const VIEW = { 'C+': M1, 'E+': M2 } as const;

// timecode=false：成片不显示右下角时间码
export const MainApp: React.FC<{ ending?: React.FC<{ t: number }>; timecode?: boolean }> = ({ ending, timecode = true }) => {
  const sec = useCurrentFrame() / FPS;
  const r = resolve(sec);
  const body = r.kind === 'orig' ? <Main at={r.t} label={false} ending={ending} /> : React.createElement(VIEW[r.id], { t: r.t });
  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: FONT }}>
      {body}
      {/* 右下角只显示本片时间码 */}
      {timecode && <div style={{ position: 'absolute', right: 20, bottom: 14, color: '#ffd84a', fontSize: 18, fontFamily: 'monospace', textShadow: '0 1px 3px rgba(0,0,0,.8)' }}>{sec.toFixed(2)}s</div>}
    </AbsoluteFill>
  );
};
