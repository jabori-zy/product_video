import React from 'react';
import type { Content } from '../data/content';
import { FONT } from '../fonts';
import { XiaoheiAvatar } from './avatar';
import { C, Cat, Logo } from '../lib';

// C 段手机：微信聊天 → OmniBox App（360×720，含机身边框，与线框一致）
export const Phone: React.FC<{ bg: string; dark?: boolean; children: React.ReactNode }> = ({ bg, dark, children }) => (
  <div style={{ width: 360, height: 720, borderRadius: 48, background: '#111', border: '8px solid #333', boxSizing: 'border-box', overflow: 'hidden', position: 'relative', fontFamily: FONT }}>
    <div style={{ position: 'absolute', inset: 0, background: bg, borderRadius: 40, overflow: 'hidden' }}>
      <div style={{ height: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 26px', fontSize: 14, fontWeight: 700, color: dark ? '#fff' : '#111' }}>
        <span>9:41</span><span style={{ fontSize: 12 }}>●●● ▮</span>
      </div>
      <div style={{ position: 'absolute', left: 122, top: 10, width: 100, height: 26, borderRadius: 13, background: '#000' }} />
      {children}
    </div>
  </div>
);

const Tick = () => <span style={{ color: '#1a7f37', fontSize: 13, marginRight: 6, alignSelf: 'flex-end' }}>✓</span>;

export const WeChat: React.FC<{ c: Content }> = ({ c: { wechat: w } }) => {
  const me = (node: React.ReactNode) => (
    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', gap: 8, marginTop: 14 }}>
      <Tick />{node}
      <XiaoheiAvatar size={34} radius={5} />
    </div>
  );
  return (
    <Phone bg="#EDEDED">
      <div style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 600, color: '#111', borderBottom: '1px solid #DADADA', position: 'relative' }}>
        <span style={{ position: 'absolute', left: 16, fontSize: 20 }}>‹</span>{w.contact}<span style={{ position: 'absolute', right: 16 }}>···</span>
      </div>
      <div style={{ padding: '0 12px' }}>
        <div style={{ textAlign: 'center', fontSize: 11, color: '#999', marginTop: 12 }}>21:06</div>
        {me(
          <div style={{ width: 196, background: '#fff', borderRadius: 6, padding: '10px 12px', display: 'flex', gap: 10, boxSizing: 'border-box' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, color: '#111', lineHeight: 1.3, wordBreak: 'break-all' }}>{w.pdf}</div>
              <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>{w.pdfSize}</div>
            </div>
            <div style={{ width: 34, height: 40, borderRadius: 3, background: '#E5484D', color: '#fff', fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>PDF</div>
          </div>,
        )}
        {me(<div style={{ width: 110, background: '#95EC69', borderRadius: 6, padding: '9px 12px', fontSize: 14, color: '#111', textAlign: 'right', boxSizing: 'border-box' }}>{w.voice} ))) </div>)}
        {me(
          <div style={{ width: 132, height: 100, borderRadius: 6, overflow: 'hidden', background: 'radial-gradient(ellipse at 30% 20%,#fff,#E6E2D6)', border: '3px solid #B8BCC4', boxSizing: 'border-box', padding: '10px 10px', fontWeight: 800 }}>
            <div style={{ fontSize: 13, color: '#1D4ED8', transform: 'rotate(-3deg)' }}>{w.boardLines[0]}</div>
            <div style={{ fontSize: 16, color: '#B91C1C', marginTop: 8, transform: 'rotate(2deg)' }}>{w.boardLines[1]}</div>
            <div style={{ width: 30, height: 26, background: '#FDE047', marginLeft: 80, marginTop: -6, transform: 'rotate(8deg)' }} />
          </div>,
        )}
        {me(<div style={{ maxWidth: 200, background: '#95EC69', borderRadius: 6, padding: '9px 12px', fontSize: 14, color: '#111', lineHeight: 1.4 }}>{w.note}</div>)}
      </div>
      <div style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: 74, background: '#F7F7F7', borderTop: '1px solid #DADADA', display: 'flex', alignItems: 'flex-start', padding: '12px 12px 0', gap: 10, boxSizing: 'border-box', color: '#333', fontSize: 22 }}>
        <span>🔊</span>
        <div style={{ flex: 1, height: 34, borderRadius: 5, background: '#fff', fontSize: 13, color: '#bbb', lineHeight: '34px', paddingLeft: 10 }}>{w.input}</div>
        <span>☺</span><span>⊕</span>
      </div>
    </Phone>
  );
};

export const App: React.FC<{ c: Content }> = ({ c: { app: a } }) => (
  <Phone bg="#1c1c1e" dark>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 20px' }}>
      <Logo size={30} />
      <div style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>{a.space} ⌄</div>
      <span style={{ marginLeft: 'auto', color: C.muted, fontSize: 18 }}>🔔</span>
    </div>
    <div style={{ margin: '10px 20px 0', height: 36, borderRadius: 999, background: '#2a2a2a', display: 'flex', padding: 3, boxSizing: 'border-box' }}>
      {a.tabs.map((s, i) => <div key={s} style={{ flex: 1, borderRadius: 999, background: i === 1 ? '#454545' : undefined, color: '#fff', fontSize: 14, fontWeight: i === 1 ? 700 : 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s}</div>)}
    </div>
    <div style={{ textAlign: 'center', color: '#fff', fontSize: 17, fontWeight: 600, marginTop: 34, padding: '0 24px', lineHeight: 1.4 }}>{a.greet}</div>
    <div style={{ position: 'relative', margin: '52px 20px 0', height: 84 }}>
      <div style={{ position: 'absolute', left: 116, top: -46 }}><Cat w={74} fill="#1c1c1e" look={0.3} lookY={0.5} /></div>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 18, background: '#2a2a2a', border: '1px solid #3a3a3a', padding: 14, boxSizing: 'border-box' }}>
        <div style={{ color: C.muted, fontSize: 14 }}>{a.ask}</div>
        <div style={{ position: 'absolute', right: 10, bottom: 10, width: 30, height: 30, borderRadius: '50%', background: '#555', color: '#bbb', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>↑</div>
        <div style={{ position: 'absolute', left: 14, bottom: 10, color: C.muted, fontSize: 18 }}>＋</div>
      </div>
    </div>
    <div style={{ margin: '28px 20px 0', color: C.muted, fontSize: 13 }}>{a.recent}</div>
    {a.items.map(([ic, s]) => (
      <div key={s} style={{ margin: '8px 20px 0', height: 40, borderRadius: 10, background: '#262626', display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px', color: C.text, fontSize: 14 }}>
        <span>{ic}</span><span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s}</span>
      </div>
    ))}
    <div style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: 78, background: '#151517', borderTop: '1px solid #2a2a2a', display: 'flex', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 10, boxSizing: 'border-box' }}>
      {a.bottom.map((s, i) => (
        <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: i === 1 ? '#8AB4FF' : '#ddd', fontSize: 12, fontWeight: i === 1 ? 700 : 400 }}>
          <div style={{ width: i === 1 ? 44 : 26, height: i === 1 ? 44 : 26, borderRadius: '50%', background: i === 1 ? C.blue : undefined, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: i === 1 ? 20 : 18 }}>{['☰', '🎙', '✎'][i]}</div>
          {s}
        </div>
      ))}
    </div>
  </Phone>
);
