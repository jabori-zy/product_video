import React from 'react';
import type { Content } from '../data/content';
import { FONT } from '../fonts';
import { C } from '../lib';

// E 段：回答正文与周报正文（替换灰色文字条）
const Badge: React.FC<{ n: number; s?: number }> = ({ n, s = 22 }) => (
  <span style={{ display: 'inline-flex', width: s, height: s, borderRadius: '50%', background: C.blue, color: '#fff', fontSize: s * 0.6, alignItems: 'center', justifyContent: 'center', marginLeft: 6, verticalAlign: 'middle', fontWeight: 700 }}>{n}</span>
);

/** AI 回答 960×470（深色主区） */
export const Answer: React.FC<{ c: Content }> = ({ c: { answer: a } }) => (
  <div style={{ width: 960, height: 470, background: C.main, fontFamily: FONT, color: C.text, padding: '10px 0', boxSizing: 'border-box' }}>
    {a.heads.map((h, i) => (
      <div key={h} style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 24, fontWeight: 700 }}>{h}<Badge n={i + 1} s={24} /></div>
        <div style={{ fontSize: 17, lineHeight: 1.65, color: '#d4d4d4', marginTop: 8 }}>{a.bodies[i]}<Badge n={i + 1} s={18} /></div>
      </div>
    ))}
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', fontSize: 14, color: C.muted }}>
      {a.note}:
      {a.sources.map((s, i) => (
        <span key={s} style={{ padding: '4px 10px', borderRadius: 8, background: '#333', color: '#ddd', display: 'inline-flex', alignItems: 'center' }}><Badge n={i + 1} s={16} /><span style={{ marginLeft: 6 }}>{s}</span></span>
      ))}
    </div>
  </div>
);

/** AI 动态周报 960×940（文档卡片，完整展开） */
export const Report: React.FC<{ c: Content }> = ({ c: { report: r } }) => {
  const H: React.FC<{ children: React.ReactNode }> = ({ children }) => <div style={{ fontSize: 24, fontWeight: 700, marginTop: 30 }}>{children}</div>;
  const li = (s: string, i: number) => (
    <div key={s} style={{ display: 'flex', gap: 10, fontSize: 17, lineHeight: 1.6, color: '#d4d4d4', marginTop: 8 }}>
      <span style={{ color: C.blue, fontWeight: 700 }}>{i + 1}.</span><span>{s}</span>
    </div>
  );
  const ST: Record<number, string> = { 0: '#FBBF24', 1: '#A1A1A1', 2: '#4ADE80' };
  return (
    <div style={{ width: 960, height: 940, background: '#2e2e2e', border: '1px solid #444', borderRadius: 16, fontFamily: FONT, color: C.text, padding: '30px 36px', boxSizing: 'border-box' }}>
      <div style={{ fontSize: 32, fontWeight: 700 }}>{r.title}</div>
      <div style={{ fontSize: 18, color: C.muted, marginTop: 10 }}>{r.toc}</div>
      <H>{r.heads[0]}</H>
      {r.highlights.map(li)}
      <H>{r.heads[1]}</H>
      {r.sources.map(li)}
      <H>{r.heads[2]}</H>
      <div style={{ marginTop: 14, borderRadius: 8, overflow: 'hidden', border: '1px solid #444' }}>
        {[r.cols, ...r.todos].map((row, i) => (
          <div key={i} style={{ display: 'flex', background: i === 0 ? '#3a3a3a' : i % 2 ? '#2e2e2e' : '#333', fontSize: 17, fontWeight: i === 0 ? 700 : 400, borderTop: i ? '1px solid #444' : undefined }}>
            {row.map((cell, j) => (
              <div key={j} style={{ flex: j === 0 ? 2.2 : 1, padding: '12px 16px', color: i > 0 && j === 2 ? ST[i - 1] : '#ddd' }}>{i > 0 && j === 2 ? '● ' : ''}{cell}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
