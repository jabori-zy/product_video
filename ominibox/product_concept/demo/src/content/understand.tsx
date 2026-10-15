import React from 'react';
import type { Content } from '../data/content';
import { FONT } from '../fonts';
import { C } from '../lib';

// D 段四宫格里的资料：PDF 页、白板照片、视频画面、章节关键帧
const CH = ['#4A8EF9', '#22C55E', '#F59E0B', '#EC4899'];

/** PDF 第一页（240×330，D 面板 ① 的页面线框） */
export const PdfPage: React.FC<{ c: Content }> = ({ c: { pdf: p } }) => (
  <div style={{ position: 'relative', width: 240, height: 330, background: '#fff', borderRadius: 6, padding: '18px 16px', boxSizing: 'border-box', color: '#1F2937', boxShadow: '0 4px 14px rgba(0,0,0,.35)', fontFamily: FONT, overflow: 'hidden' }}>
    <div style={{ height: 4, width: 40, background: '#2563EB', borderRadius: 2 }} />
    <div style={{ fontSize: 17, fontWeight: 800, marginTop: 8 }}>{p.title}</div>
    <div style={{ fontSize: 9, color: '#6B7280', marginTop: 2 }}>{p.date}</div>
    <div style={{ fontSize: 10, fontWeight: 700, marginTop: 10 }}>{p.sections[0]}</div>
    <div style={{ display: 'flex', gap: 5, marginTop: 6 }}>
      {p.kpis.map(([k, v]) => (
        <div key={k} style={{ flex: 1, background: '#EFF6FF', borderRadius: 4, padding: '5px 4px' }}>
          <div style={{ fontSize: 7.5, color: '#6B7280', whiteSpace: 'nowrap', overflow: 'hidden' }}>{k}</div>
          <div style={{ fontSize: 9, fontWeight: 800, color: '#1D4ED8', whiteSpace: 'nowrap' }}>{v}</div>
        </div>
      ))}
    </div>
    {/* 柱状图 */}
    <svg width={208} height={62} style={{ marginTop: 8 }}>
      {[22, 30, 26, 38, 44, 52].map((h, i) => <rect key={i} x={6 + i * 34} y={60 - h} width={22} height={h} rx={3} fill={i > 3 ? '#2563EB' : '#93C5FD'} />)}
    </svg>
    {p.sections.slice(1).map((s) => (
      <div key={s} style={{ marginTop: 8 }}>
        <div style={{ fontSize: 10, fontWeight: 700 }}>{s}</div>
        {[1, 0.92, 0.7].map((w, i) => <div key={i} style={{ height: 4, width: `${w * 100}%`, background: '#E5E7EB', borderRadius: 2, marginTop: 4 }} />)}
      </div>
    ))}
    <div style={{ position: 'absolute', right: 12, bottom: 8, fontSize: 8, color: '#9CA3AF' }}>1 / 12</div>
  </div>
);

/** 从 PDF 提取出的文字：9 行（D 面板 ① 的文字条线框），reveal 0→1 逐行出现 */
export const PdfLines: React.FC<{ c: Content; reveal?: number; gap?: number; size?: number; w?: number; ink?: [string, string] }> = ({ c: { pdf: p }, reveal = 1, gap = 34, size = 16, w = 440, ink = ['#fff', '#d6d6d6'] }) => (
  <div style={{ position: 'relative', width: w, height: gap * p.extract.length, fontFamily: FONT }}>
    {p.extract.map((s, i) => {
      const o = Math.max(0, Math.min(1, reveal * p.extract.length - i));
      return <div key={i} style={{ position: 'absolute', left: 0, top: i * gap, width: w, fontSize: size, color: ink[i === 0 ? 0 : 1], fontWeight: i === 0 ? 700 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', opacity: o, transform: `translateX(${(1 - o) * -12}px)` }}>{s}</div>;
    })}
  </div>
);

/** PDF 页面 + 提取出的文字（760×360，截图用） */
export const Pdf: React.FC<{ c: Content }> = ({ c }) => (
  <div style={{ width: 760, height: 360, background: '#2e2e2e', fontFamily: FONT, position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', left: 30, top: 15 }}><PdfPage c={c} /></div>
    <div style={{ position: 'absolute', left: 300, top: 10, fontSize: 13, color: '#AFCBFF', fontWeight: 700 }}>{c.pdf.label}</div>
    <div style={{ position: 'absolute', left: 300, top: 32 }}><PdfLines c={c} /></div>
  </div>
);

/** 白板照片 330×330：手写字落在 OCR 框的位置（照片内 x 30–270，y 40 / 130 / 220） */
export const Board: React.FC<{ c: Content }> = ({ c: { board: b } }) => {
  const ink = ['#1D4ED8', '#111827', '#B91C1C'];
  return (
    <div style={{ width: 330, height: 330, fontFamily: FONT, position: 'relative', overflow: 'hidden', background: 'radial-gradient(ellipse at 30% 20%, #FFFFFF 0%, #F1EFE8 55%, #DCD8CC 100%)' }}>
      {/* 残留擦痕 */}
      <div style={{ position: 'absolute', left: 150, top: 290, width: 140, height: 22, borderRadius: 12, background: 'rgba(120,130,150,.12)', transform: 'rotate(-4deg)' }} />
      {b.lines.map((s, j) => (
        <div key={s} style={{ position: 'absolute', left: 34, top: 48 + j * 90, width: 236, fontSize: s.length > 14 ? 19 : 23, fontWeight: 700, color: ink[j], transform: `rotate(${[-2.5, 1.5, -1][j]}deg)`, letterSpacing: 0.5, opacity: 0.88, textShadow: '0 0 1px currentColor', whiteSpace: 'nowrap' }}>{s}</div>
      ))}
      <svg width={330} height={330} style={{ position: 'absolute', left: 0, top: 0 }}>
        <path d="M40 92 Q150 104 250 88" stroke="#1D4ED8" strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.7} />
        <path d="M150 112 L150 124 M144 118 L150 126 L156 118" stroke="#111827" strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.6} />
        <ellipse cx={92} cy={238} rx={66} ry={24} stroke="#B91C1C" strokeWidth={2.5} fill="none" opacity={0.55} transform="rotate(-3 92 238)" />
      </svg>
      {b.sticky.map((s, i) => (
        <div key={s} style={{ position: 'absolute', left: 262 + i * 6, top: 150 + i * 70, width: 60, height: 54, background: ['#FDE047', '#F9A8D4'][i], transform: `rotate(${[6, -5][i]}deg)`, boxShadow: '0 3px 6px rgba(0,0,0,.18)', fontSize: s.length > 6 ? 10 : 14, fontWeight: 800, color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>{s}</div>
      ))}
      {/* 白板边框与反光 */}
      <div style={{ position: 'absolute', inset: 0, border: '7px solid #B8BCC4', boxSizing: 'border-box' }} />
      <div style={{ position: 'absolute', left: -60, top: -40, width: 200, height: 420, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent)', transform: 'rotate(18deg)' }} />
    </div>
  );
};

/** 视频画面 330×190：RAG 流程示意 */
export const RagFrame: React.FC<{ c: Content; play?: boolean }> = ({ c: { bili: b }, play = true }) => {
  const f = b.frame;
  const nodes: [string, string, number, number][] = [
    ['📄', f.docs, 30, 66], ['🗂', f.store, 108, 66], ['🔍', f.retrieve, 186, 66], ['🧠', f.llm, 264, 66],
  ];
  return (
    <div style={{ width: 330, height: 190, fontFamily: FONT, position: 'relative', overflow: 'hidden', background: 'linear-gradient(160deg,#1E293B,#0F172A)', color: '#E2E8F0' }}>
      <div style={{ position: 'absolute', left: 14, top: 10, fontSize: 18, fontWeight: 900, letterSpacing: 1 }}>RAG<span style={{ fontSize: 10, fontWeight: 400, color: '#94A3B8', marginLeft: 6 }}>Retrieval-Augmented Generation</span></div>
      {nodes.map(([ic, s, x, y], i) => (
        <React.Fragment key={s}>
          <div style={{ position: 'absolute', left: x - 26, top: y - 22, width: 52, height: 44, borderRadius: 8, background: '#334155', border: `1.5px solid ${CH[i]}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{ic}</div>
          <div style={{ position: 'absolute', left: x - 38, top: y + 26, width: 76, textAlign: 'center', fontSize: 9.5, color: '#CBD5E1', lineHeight: 1.2 }}>{s}</div>
          {i < 3 && <div style={{ position: 'absolute', left: x + 28, top: y - 2, width: 22, height: 2, background: '#64748B' }}><div style={{ position: 'absolute', right: -2, top: -3, width: 0, height: 0, borderLeft: '6px solid #64748B', borderTop: '4px solid transparent', borderBottom: '4px solid transparent' }} /></div>}
        </React.Fragment>
      ))}
      <div style={{ position: 'absolute', left: 60, top: 130, width: 210, height: 34, borderRadius: 8, background: '#4A8EF922', border: `1.5px solid ${C.blue}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 11, color: '#BFDBFE' }}>
        💬 {f.answer} <span style={{ background: C.blue, color: '#fff', borderRadius: '50%', width: 14, height: 14, fontSize: 9, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
      </div>
      {play && (
        <div style={{ position: 'absolute', right: 12, bottom: 12, width: 30, height: 30, borderRadius: '50%', background: 'rgba(0,0,0,.45)', border: '2px solid rgba(255,255,255,.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, paddingLeft: 2, boxSizing: 'border-box' }}>▶</div>
      )}
    </div>
  );
};

/** 单张章节关键帧（165×92，D 面板 ④ 的缩略图线框） */
export const KeyframeThumb: React.FC<{ c: Content; j: number }> = ({ c, j }) => {
  const art = [
    <div style={{ fontSize: 30, fontWeight: 900, color: '#fff', letterSpacing: 2 }}>RAG</div>,
    <svg width={90} height={50}>{[0, 1, 2].map((i) => <rect key={i} x={6 + i * 18} y={6 + i * 4} width={30} height={38} rx={3} fill="#E2E8F0" opacity={0.5 + i * 0.25} />)}<circle cx={68} cy={22} r={11} stroke="#22C55E" strokeWidth={4} fill="none" /><line x1={76} y1={30} x2={86} y2={42} stroke="#22C55E" strokeWidth={4} strokeLinecap="round" /></svg>,
    <svg width={90} height={50}><rect x={4} y={10} width={28} height={30} rx={6} fill="#F59E0B" /><text x={18} y={30} fontSize={11} textAnchor="middle" fill="#111" fontWeight={800}>LLM</text>{[0, 1, 2].map((i) => <rect key={i} x={40} y={12 + i * 11} width={[46, 38, 28][i]} height={6} rx={3} fill="#E2E8F0" />)}</svg>,
    <svg width={90} height={50}>{[18, 30, 24, 40].map((h, i) => <rect key={i} x={6 + i * 16} y={46 - h} width={11} height={h} rx={2} fill="#EC4899" opacity={0.6 + i * 0.1} />)}<path d="M70 26 L77 34 L88 16" stroke="#22C55E" strokeWidth={4} fill="none" strokeLinecap="round" /></svg>,
  ];
  return (
    <div style={{ width: 165, height: 92, borderRadius: 6, position: 'relative', overflow: 'hidden', background: 'linear-gradient(160deg,#1E293B,#0F172A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT }}>
      {art[j]}
      <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: 3, background: CH[j] }} />
      <div style={{ position: 'absolute', left: 6, bottom: 4, fontSize: 11, color: '#fff', fontWeight: 700, background: 'rgba(0,0,0,.45)', padding: '1px 6px', borderRadius: 3 }}>{String(j + 1).padStart(2, '0')} {c.keyframes[j]}</div>
      <div style={{ position: 'absolute', right: 6, bottom: 4, fontSize: 10, color: '#cbd5e1' }}>{['00:00', '02:15', '05:30', '08:10'][j]}</div>
    </div>
  );
};

/** 章节关键帧 690×92：四张 165×92 缩略图，间距 10（截图用） */
export const Keyframes: React.FC<{ c: Content }> = ({ c }) => (
  <div style={{ width: 690, height: 92, display: 'flex', gap: 10, background: '#2e2e2e' }}>
    {c.keyframes.map((s, j) => <KeyframeThumb key={s} c={c} j={j} />)}
  </div>
);
