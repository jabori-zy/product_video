import React from 'react';
import type { Content } from '../data/content';
import { FONT } from '../fonts';
import { Logo } from '../lib';

// G「开源」：GitHub 仓库卡片里的 README 区（1000×290）
const MONO = 'Menlo, Monaco, Consolas, monospace';

export const Readme: React.FC<{ c: Content }> = ({ c: { readme: r } }) => (
  <div style={{ width: 1000, height: 290, background: '#0d1117', border: '1px solid #30363d', borderRadius: 12, fontFamily: FONT, color: '#e6edf3', overflow: 'hidden', boxSizing: 'border-box', position: 'relative' }}>
    <div style={{ height: 38, borderBottom: '1px solid #30363d', display: 'flex', alignItems: 'center', gap: 22, padding: '0 18px', fontSize: 14, color: '#8b949e' }}>
      <span style={{ color: '#e6edf3', fontWeight: 600, borderBottom: '2px solid #F78166', paddingBottom: 8, marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 6 }}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2zM22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z" /></svg>README</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18M7 21h10M3 7h18M6 7l-3 7a3 3 0 0 0 6 0zM18 7l-3 7a3 3 0 0 0 6 0z" /></svg>Apache-2.0</span>
    </div>
    <div style={{ display: 'flex', gap: 30, padding: '16px 24px' }}>
      <div style={{ flex: 1.15, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Logo size={40} />
          <div style={{ fontSize: 28, fontWeight: 700 }}>OmniBox</div>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
          {r.badges.map((b, i) => {
            const [k, v] = b.split(' · ');
            return (
              <span key={b} style={{ display: 'inline-flex', fontSize: 11, borderRadius: 3, overflow: 'hidden', fontFamily: MONO }}>
                <span style={{ background: '#555', padding: '2px 6px' }}>{k}</span>
                <span style={{ background: ['#2EA043', '#1F6FEB', '#8957E5'][i], padding: '2px 6px' }}>{v}</span>
              </span>
            );
          })}
        </div>
        <div style={{ fontSize: 15, lineHeight: 1.6, color: '#c9d1d9', marginTop: 12 }}>{r.desc}</div>
        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {r.feats.map((f) => <div key={f} style={{ fontSize: 13, color: '#8b949e' }}>{f}</div>)}
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 18, fontWeight: 700, paddingBottom: 6, borderBottom: '1px solid #30363d' }}>{r.quick}</div>
        <div style={{ marginTop: 12, background: '#161b22', border: '1px solid #30363d', borderRadius: 6, padding: '12px 14px', fontFamily: MONO, fontSize: 11.5, lineHeight: 1.9 }}>
          {r.cmds.map((s) => <div key={s} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}><span style={{ color: '#8b949e' }}>$ </span>{s}</div>)}
          <div style={{ color: '#3fb950' }}>✓ omnibox-web · omnibox-backend · ollama</div>
        </div>
        <div style={{ marginTop: 10, fontSize: 13, color: '#8b949e' }}>→ <span style={{ color: '#58a6ff' }}>http://localhost:8080</span></div>
      </div>
    </div>
  </div>
);
