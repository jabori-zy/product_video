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

// ---------- 视频里用的片段（替换 E 段的灰色文字条与待办行） ----------
/** 两行文字按阅读顺序揭开：先第一行从左到右，再第二行（行高 26） */
const clip2 = (r: number): React.CSSProperties => {
  const k = Math.max(0, Math.min(1, r)), w1 = Math.min(1, k * 2) * 100, w2 = Math.max(0, k * 2 - 1) * 100;
  return { clipPath: `polygon(0 0, ${w1}% 0, ${w1}% 26px, ${w2}% 26px, ${w2}% 52px, 0 52px)` };
};

/** 回答第 j 条的正文：两行，宽 900（E：灰条 n=2 gap 26），reveal 0→1 像流式输出一样从左往右出现 */
export const AnswerBody: React.FC<{ c: Content; j: number; reveal?: number; w?: number }> = ({ c: { answer: a }, j, reveal = 1, w = 900 }) => (
  <div style={{ width: w, fontFamily: FONT, fontSize: 18, lineHeight: '26px', color: '#d4d4d4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', ...clip2(reveal * 1.05) }}>
    {a.bodies[j]}
    <Badge n={j + 1} s={18} />
  </div>
);

/** 周报一节的 5 行列表（E：灰条 n=5 gap 34，宽 860），reveal 0→1 逐行出现 */
export const ReportLines: React.FC<{ items: string[]; reveal?: number; w?: number; gap?: number }> = ({ items, reveal = 1, w = 860, gap = 34 }) => (
  <div style={{ position: 'relative', width: w, height: gap * items.length, fontFamily: FONT }}>
    {items.map((s, i) => {
      const o = Math.max(0, Math.min(1, reveal * items.length - i));
      return (
        <div key={s} style={{ position: 'absolute', left: 0, top: i * gap - 6, width: w, display: 'flex', gap: 10, fontSize: 18, lineHeight: '30px', color: '#d4d4d4', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', opacity: o }}>
          <span style={{ color: C.blue, fontWeight: 700 }}>{i + 1}.</span><span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{s}</span>
        </div>
      );
    })}
  </div>
);

/** 待办表的一行（E：860×46 的行线框）；header 为表头 */
export const ReportRow: React.FC<{ cells: string[]; i: number; header?: boolean; w?: number; h?: number }> = ({ cells, i, header, w = 860, h = 46 }) => (
  <div style={{ width: w, height: h, display: 'flex', alignItems: 'center', borderRadius: 6, background: header ? '#3a3a3a' : i % 2 ? '#2e2e2e' : '#333', border: '1px solid #444', boxSizing: 'border-box', fontFamily: FONT, fontSize: 17, fontWeight: header ? 700 : 400 }}>
    {cells.map((cell, j) => (
      <div key={j} style={{ flex: j === 0 ? 2.2 : 1, padding: '0 16px', color: !header && j === 2 ? ['#FBBF24', '#A1A1A1', '#4ADE80'][i % 3] : '#ddd', whiteSpace: 'nowrap' }}>{!header && j === 2 ? '● ' : ''}{cell}</div>
    ))}
  </div>
);
