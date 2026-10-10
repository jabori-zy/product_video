import React from 'react';
import { C, Cat, Fill, Logo, blinkAt, lin, sp } from '../lib';

// H 品牌 · 口号（39.0–45.0 s），局部时间 t = 全局 − 39

const WORDS = ['万物', '变成', '记忆', '记忆', '变成', '万物'];
const WT = [0, 0.4, 0.8, 1.5, 1.85, 2.2];

// logo 260px 居中时，猫眼的屏幕位置（与 Logo/Cat 的几何一致）
const LS = 260;
const L0 = { x: 960 - LS / 2, y: 540 - LS / 2 };
const CW = LS * 0.76;
const K = CW / 200;
const EYES = [72, 128].map((ex) => ({ x: L0.x + LS * 0.12 + ex * K, y: L0.y + LS * 0.36 + 104 * K }));

export const Hh: React.FC<{ t: number }> = ({ t }) => {
  // 逐词
  const wi = WT.findIndex((a, i) => t >= a && t < (WT[i + 1] ?? 2.5));
  const wp = wi >= 0 ? lin(t, WT[wi], WT[wi] + 0.2, 0, 1) : 0;

  // 光带：绕文字的弧 → 收缩 → 分成两个眼圈
  const arcO = lin(t, 0, 0.3, 0, 0.9);
  const shrink = lin(t, 2.5, 2.9, 0, 1);
  const ringO = lin(t, 2.75, 2.9, 0, 1) * (1 - lin(t, 3.25, 3.35, 0, 1));
  const lineCat = lin(t, 2.9, 3.15, 0, 1);
  const lineCatO = 1 - lin(t, 3.3, 3.45, 0, 1);
  const logoP = sp(t, 3.15, { damping: 12 });
  const shift = lin(t, 4.0, 4.35, 0, -330);
  const push = lin(t, 5.2, 6.0, 1, 1.03);
  const fade = lin(t, 5.7, 6.0, 0, 1);
  const blink = blinkAt(t, [5.2]);
  const line = (a: number) => lin(t, a, a + 0.3, 0, 1);

  return (
    <Fill bg={C.black}>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${push})`, transformOrigin: '960px 540px', opacity: 1 - fade }}>
        {t < 2.5 && wi >= 0 && (
          <div style={{ position: 'absolute', top: 540 - 110, width: 1920, textAlign: 'center', fontSize: 160, fontWeight: 800, color: WORDS[wi] === '记忆' ? '#7FB0FF' : '#fff', opacity: wp, filter: `blur(${(1 - wp) * 12}px)`, transform: `translateZ(0) scale(${1.15 - 0.15 * wp})` }}>
            {WORDS[wi]}
          </div>
        )}
        {/* 品牌光带弧 */}
        {t < 2.9 && (
          <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, opacity: arcO * (1 - lin(t, 2.75, 2.9, 0, 1)) }}>
            <defs>
              <linearGradient id="h-arc" x1="0" x2="1">
                <stop offset="0" stopColor={C.blue} />
                <stop offset="1" stopColor={C.blue2} />
              </linearGradient>
            </defs>
            <circle cx={960} cy={540} r={330 - 270 * shrink} fill="none" stroke="url(#h-arc)" strokeWidth={10} strokeLinecap="round" strokeDasharray={`${700 - 500 * shrink} 3000`} transform={`rotate(${t * 220} 960 540)`} style={{ filter: `drop-shadow(0 0 16px ${C.blue})` }} />
          </svg>
        )}
        {/* 两个奶油色眼圈（呼应开场） */}
        {ringO > 0 && EYES.map((e, i) => {
          const sx = 960 + (i ? 55 : -55);
          const p = lin(t, 2.9, 3.15, 0, 1);
          const x = sx + (e.x - sx) * p;
          const y = 540 + (e.y - 540) * p;
          const r = 34 + (19 * K - 34) * p;
          return <div key={i} style={{ position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', border: `${8 - 3 * p}px solid ${C.cream}`, boxSizing: 'border-box', opacity: ringO }} />;
        })}

        <div style={{ position: 'absolute', inset: 0, transform: `translateX(${shift}px)` }}>
          {/* logo 方块 */}
          <div style={{ position: 'absolute', left: L0.x, top: L0.y, transform: `scale(${logoP})` }}>
            <Logo size={LS} blink={blink} />
          </div>
          {/* 线稿猫头从眼圈周围长出，交接给 logo 里的实心猫 */}
          {t >= 2.9 && lineCatO > 0 && (
            <div style={{ position: 'absolute', left: L0.x + LS * 0.12, top: L0.y + LS * 0.36, opacity: lineCatO, clipPath: `circle(${lineCat * 160}px at ${100 * K}px ${104 * K}px)` }}>
              <Cat w={CW} fill={C.black} />
            </div>
          )}
        </div>
        {/* 品牌文字 */}
        {t >= 4.0 && (
          <div style={{ position: 'absolute', left: 840, top: 395 }}>
            {[
              { a: 4.05, s: 96, w: 800, c: '#fff', text: '小黑 OmniBox' },
              { a: 4.35, s: 46, w: 500, c: '#ddd', text: '你的 AI 知识伙伴' },
              { a: 4.65, s: 30, w: 400, c: '#9a9a9a', text: '免费开始 · omnibox.pro' },
            ].map((l) => (
              <div key={l.text} style={{ fontSize: l.s, fontWeight: l.w, color: l.c, marginBottom: 16, opacity: line(l.a), filter: `blur(${(1 - line(l.a)) * 10}px)`, whiteSpace: 'nowrap' }}>{l.text}</div>
            ))}
          </div>
        )}
      </div>
    </Fill>
  );
};
