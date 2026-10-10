import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { FPS } from './lib';
import { FONT } from './fonts';
import { Main, SCENES } from './Main';
import { INSERTS, resolve } from './appTimeline';
import { M1 } from './scenes/M1';
import { M2 } from './scenes/M2';

// demo-add_more_app：原片（按 pace.ts 放慢）+ 两段手机插段，见 appTimeline.ts
const VIEW = { 'C+': M1, 'E+': M2 } as const;

export const MainApp: React.FC = () => {
  const sec = useCurrentFrame() / FPS;
  const r = resolve(sec);
  let body: React.ReactNode, tag: string;
  if (r.kind === 'orig') {
    body = <Main at={r.t} label={false} />;
    const cur = [...SCENES].reverse().find((s) => r.t >= s.s)!;
    tag = `${cur.id} ${cur.name} · ${r.t.toFixed(2)}s`;
  } else {
    const V = VIEW[r.id];
    body = <V t={r.t} />;
    tag = `${r.id} ${INSERTS.find((i) => i.id === r.id)!.name} · +${r.t.toFixed(2)}s`;
  }
  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: FONT }}>
      {body}
      <div style={{ position: 'absolute', right: 16, bottom: 12, padding: '4px 10px', borderRadius: 6, background: 'rgba(0,0,0,.55)', color: '#ffd84a', fontSize: 18, fontFamily: 'monospace' }}>
        DRAFT {tag} → {sec.toFixed(1)}s
      </div>
    </AbsoluteFill>
  );
};
