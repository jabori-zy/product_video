import React from 'react';
import type { Content } from '../data/content';
import { FONT } from '../fonts';
import { XiaoheiAvatar } from './avatar';
import { RagFrame } from './understand';
import { PersonAvatar } from './icons';
import { Fit, SitePage } from './site';

// C 段走廊里的三张来源卡片（high_fidelity_v4）：B 站、小红书、X 的真实搜索结果页快照（public/sites/，tools/sites/ 导出），
// 视口与卡片一致；结果条目的文字、封面、头像换成片子自己的内容（data/locales），样式全是网站自己的。
// 封面、配图仍是绘制的（不用别人的图片）。

const RED = '#FF2442';
const XL = '#2F3336';

/** 标题里的搜索词：按网站自己的高亮写法包起来 */
const hl = (text: string, kws: string[], wrap: (s: string, i: number) => React.ReactNode) => {
  const re = new RegExp(`(${kws.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  return text.split(re).map((s, i) => (i % 2 ? wrap(s, i) : <React.Fragment key={i}>{s}</React.Fragment>));
};

// ---------------------------------------------------------------- B 站
/** B 站视频封面 216×122：第 0 张用 RAG 讲解画面，其余是绘制的大字封面 */
const BiliCover: React.FC<{ c: Content; i: number; lines: string[] }> = ({ c, i, lines }) => {
  const [a = '', b = ''] = lines;
  const big = (s: string, size: number, color: string, extra: React.CSSProperties = {}) => (
    <div style={{ fontSize: size, fontWeight: 900, color, lineHeight: 1.1, whiteSpace: 'nowrap', textShadow: '0 2px 0 rgba(0,0,0,.35)', ...extra }}>{s}</div>
  );
  const box = (bg: string, children: React.ReactNode, style: React.CSSProperties = {}) => (
    <div style={{ position: 'absolute', inset: 0, background: bg, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 4, overflow: 'hidden', ...style }}>{children}</div>
  );
  switch (i) {
    case 0:
      return (
        <div style={{ position: 'absolute', inset: 0, background: '#0F172A', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: (216 - 330 * 0.66) / 2, top: 0, transform: 'scale(0.66)', transformOrigin: '0 0' }}><RagFrame c={c} play={false} /></div>
        </div>
      );
    case 1:
      return box('#111', <>{big(a, 38, '#E8322F')}{big(b, 21, '#fff')}</>);
    case 2:
      return box('linear-gradient(135deg,#F4ECDC,#E3D4B6)', <>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,0,0,.06) 1px, transparent 1px)', backgroundSize: '100% 14px' }} />
        {big(a, 34, '#E8742A', { fontStyle: 'italic', textShadow: 'none' })}{big(b, 22, '#C2410C', { fontStyle: 'italic', textShadow: 'none' })}
      </>);
    case 3:
      return box('linear-gradient(135deg,#0B1F3A,#1E3A6B)', <>{big(a, 23, '#fff')}{big(b, 16, '#BFDBFE')}<div style={{ width: 150, height: 2, background: '#60A5FA', marginTop: 4 }} /></>, { alignItems: 'flex-start', paddingLeft: 14 });
    case 4:
      return box('#15171C', <>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><svg width={22} height={22} viewBox="0 0 24 24" style={{ display: 'block' }}><circle cx="12" cy="12" r="11" fill="#fff" /><path d="M8 18.5c0-2 .8-3 2-3.6-2.8-.4-4.5-1.7-4.5-4.6 0-1.1.4-2 1-2.7-.2-.6-.2-1.5.2-2.4 1.1 0 2 .6 2.6 1.1a8.5 8.5 0 0 1 5.4 0c.6-.5 1.5-1.1 2.6-1.1.4.9.4 1.8.2 2.4.6.7 1 1.6 1 2.7 0 2.9-1.7 4.2-4.5 4.6 1.2.6 2 1.6 2 3.6" fill="#15171C" /></svg>{big(a, 20, '#fff')}</div>
        {big(b, 19, '#5B9BFF')}
      </>);
    case 5:
      return box('linear-gradient(135deg,#1747C9,#3BA2F7)', <>
        <div style={{ position: 'absolute', right: -14, top: 18, width: 96, height: 96, borderRadius: '50%', background: 'radial-gradient(circle,#A5F3FC,#38BDF8 45%,transparent 70%)', opacity: 0.9 }} />
        <div style={{ position: 'relative' }}>{big(a, 26, '#fff')}{big(b, 34, '#fff')}</div>
      </>, { alignItems: 'flex-start', paddingLeft: 16 });
    case 6:
      return box('linear-gradient(135deg,#F7C948,#F08A24)', <>
        <div style={{ position: 'absolute', right: 10, bottom: 0, width: 56, height: 80, borderRadius: '28px 28px 0 0', background: '#7C2D12', opacity: 0.85 }} />
        <div style={{ position: 'relative' }}>{big(a, 22, '#B91C1C', { textShadow: 'none' })}{big(b, 20, '#7C2D12', { textShadow: 'none' })}</div>
      </>, { alignItems: 'flex-start', paddingLeft: 12 });
    default:
      return box('linear-gradient(135deg,#0B1B3F,#123A7A)', <>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(96,165,250,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(96,165,250,.18) 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
        <div style={{ position: 'relative', textAlign: 'center' }}>{big(a, 19, '#FFE14D')}{big(b, 15, '#fff')}</div>
      </>);
  }
};


/** B 站搜索结果页 720×450（视口 960×600 CSS 像素） */
export const BiliSearch: React.FC<{ c: Content }> = ({ c }) => {
  const s = c.biliSearch;
  const slots: Record<string, any> = { 'me-avatar': ({ w }: { w: number }) => <XiaoheiAvatar size={w || 36} /> };
  // 快照里第 3 张（序号 2）是 B 站的课程卡片（「课堂」标 +「· 共 N 课时」），放片子里那条课程（序号 3）
  const ORDER = [0, 1, 3, 2, 4, 5, 6, 7];
  ORDER.map((k) => [k, s.videos[k]] as const).forEach(([k, v], i) => {
    slots[`cover-${i}`] = ({ w, h }: { w: number; h: number }) => <Fit w={w} h={h} nw={216} nh={122}><BiliCover c={c} i={k} lines={v.cover} /></Fit>;
    slots[`stat-${i}-0`] = v.views;
    slots[`stat-${i}-1`] = v.dm;
    slots[`dur-${i}`] = v.dur;
    slots[`title-${i}`] = hl(v.title, s.kw, (k, j) => <em key={j} className="keyword">{k}</em>);
    slots[`up-${i}`] = v.up;
    slots[`date-${i}`] = ` · ${v.date}`;
  });
  return <SitePage site="bili" w={720} h={450} zoom={0.75} radius={18} bg="#fff" slots={slots} attrs={{ '.search-input-el': { value: s.kw.join(' ') } }} />;
};

// ---------------------------------------------------------------- 小红书
/** 小红书封面：按序号画不同风格（第 0 张是收藏的那篇，与 xhs 笔记页封面一致） */
const XhsCover: React.FC<{ c: Content; i: number; w: number; h: number; lines: string[] }> = ({ c, i, w, h, lines }) => {
  const base: React.CSSProperties = { width: w, height: h, borderRadius: 12, overflow: 'hidden', position: 'relative' };
  const x = c.xhs;
  const TILE = ['#FDE68A', '#BBF7D0', '#BFDBFE', '#FBCFE8'];
  if (i === 0) return (
    <div style={{ ...base, background: '#FFF8EA' }}>
      <div style={{ position: 'absolute', left: 16, top: 22, color: '#1a1a1a', fontWeight: 900, lineHeight: 1.12 }}>
        <div style={{ fontSize: 30 }}>{x.cover[0]}</div>
        <div style={{ fontSize: 30, position: 'relative', display: 'inline-block' }}>
          <span style={{ position: 'absolute', left: -2, right: -2, bottom: 2, height: 12, background: '#7CF29A', opacity: 0.85 }} />
          <span style={{ position: 'relative' }}>{x.cover[1]}</span>
        </div>
        <div style={{ fontSize: 18, color: RED, marginTop: 6 }}>{x.cover[2]}</div>
      </div>
      <div style={{ position: 'absolute', left: 14, right: 14, bottom: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
        {x.tiles.slice(0, 4).map((s, k) => (
          <div key={s} style={{ height: 36, borderRadius: 7, background: TILE[k], color: '#333', fontSize: 11, fontWeight: 700, padding: '5px 7px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ width: '70%', height: 3, borderRadius: 2, background: 'rgba(0,0,0,.18)' }} />{s}
          </div>
        ))}
      </div>
    </div>
  );
  if (i === 1) return (
    <div style={{ ...base, background: '#202227' }}>
      <div style={{ position: 'absolute', left: 10, right: 10, top: 10, height: h * 0.34, borderRadius: 6, overflow: 'hidden', background: 'linear-gradient(180deg,#0F1E4A,#2B4C9B 70%,#E8B64C)' }}>
        {[[18, 12], [46, 22], [80, 10], [120, 26], [150, 14], [170, 30]].map(([x, y]) => <div key={x} style={{ position: 'absolute', left: x, top: y, width: 6, height: 6, borderRadius: 3, background: '#FDE68A', boxShadow: '0 0 8px #FDE68A' }} />)}
        <div style={{ position: 'absolute', left: -10, right: -10, bottom: -20, height: 34, borderRadius: '50%', background: '#0B1530' }} />
      </div>
      {[0.9, 0.75, 0.85, 0.6, 0.8, 0.7, 0.5].map((k, j) => <div key={j} style={{ position: 'absolute', left: 12, top: h * 0.42 + j * 14, width: (w - 24) * k, height: 5, borderRadius: 3, background: j === 0 ? '#E5E7EB' : '#4B5563' }} />)}
    </div>
  );
  if (i === 2) return (
    <div style={{ ...base, display: 'flex' }}>
      {[['#2B2540', '#fff', lines[0]], ['#F4F4F5', '#111', lines[1]]].map(([bg, fg, s], k) => (
        <div key={k} style={{ flex: 1, background: bg, position: 'relative' }}>
          <div style={{ textAlign: 'center', marginTop: 12, fontSize: 15, fontWeight: 600, color: fg }}>{s}</div>
          <div style={{ position: 'absolute', left: 10, right: k ? -12 : 10, top: 44, bottom: 22, borderRadius: 8, background: k ? '#fff' : '#17142A', border: `2px solid ${k ? '#D4D4D8' : '#3F3A5A'}`, overflow: 'hidden' }}>
            {[0.8, 0.6, 0.7, 0.5, 0.75, 0.55].map((q, j) => <div key={j} style={{ margin: '8px 8px 0', width: `${q * 100}%`, height: 4, borderRadius: 2, background: k ? '#D4D4D8' : '#6D28D9' }} />)}
          </div>
        </div>
      ))}
    </div>
  );
  if (i === 3) return (
    <div style={{ ...base, background: 'linear-gradient(160deg,#F2F7FC,#E4EEF8)', padding: '30px 18px 0', boxSizing: 'border-box' }}>
      <div style={{ position: 'absolute', left: 14, top: 12, width: 34, height: 12, borderTop: '4px solid #3B82F6', borderRadius: '50%' }} />
      {lines.map((s, j) => (
        <div key={s} style={{ fontSize: 21, fontWeight: 800, color: '#1F2937', lineHeight: 1.6, letterSpacing: 1, whiteSpace: 'nowrap' }}>
          {j === 1 ? <span style={{ color: '#1D4ED8', textDecoration: 'underline', textDecorationColor: '#93C5FD', textDecorationThickness: 5 }}>{s}</span> : s}
        </div>
      ))}
    </div>
  );
  return (
    <div style={{ ...base, background: 'linear-gradient(180deg,#4F7CF7,#8FB6FF)' }}>
      <div style={{ textAlign: 'center', marginTop: 10, fontSize: 18, fontWeight: 900, color: '#FFE14D', fontStyle: 'italic' }}>{lines[0]}</div>
      <div style={{ position: 'absolute', left: 12, right: 12, top: 44, bottom: 12, borderRadius: 6, background: '#fff', padding: 8, boxSizing: 'border-box' }}>
        {[0.6, 0.9, 0.7, 0.8, 0.5].map((q, j) => <div key={j} style={{ width: `${q * 100}%`, height: 4, borderRadius: 2, background: '#D1D5DB', marginTop: j ? 7 : 0 }} />)}
        <div style={{ marginTop: 10, height: 40, borderRadius: 4, background: 'linear-gradient(135deg,#86EFAC,#15803D)' }} />
      </div>
    </div>
  );
};


/** 小红书搜索结果页 500×400（视口 1000×800 CSS 像素，深色；桌面版布局） */
export const XhsSearch: React.FC<{ c: Content }> = ({ c }) => {
  const s = c.xhsSearch;
  const AV = ['#E9A6B5', '#C4B5FD', '#FCD34D', '#93C5FD', '#86EFAC', '#FDBA74'];
  const slots: Record<string, any> = { 'me-avatar': ({ w }: { w: number }) => <XiaoheiAvatar size={w || 24} /> };
  // 导出页里的笔记比片子的多：按顺序循环填（视口里能看到的是前 6–7 条）
  for (let i = 0; i < 20; i++) {
    const k = i % s.notes.length, n = s.notes[k];
    // 封面链接的 ::before 是加载占位（背景模糊，z-index 1），真实图片压在它上面，这里同样抬到 2
    slots[`cover-${i}`] = ({ w, h }: { w: number; h: number }) => <div style={{ position: 'relative', zIndex: 2 }}><XhsCover c={c} i={k} w={w} h={h} lines={n.cover} /></div>;
    slots[`title-${i}`] = n.title;
    slots[`avatar-${i}`] = ({ w }: { w: number }) => <PersonAvatar size={w || 20} bg={AV[k]} />;
    slots[`author-${i}`] = n.author;
    slots[`date-${i}`] = n.date;
    slots[`likes-${i}`] = n.likes;
  }
  s.hotItems.forEach((t, i) => { slots[`hot-${i}`] = t; });
  return <SitePage site="xhs" w={500} h={400} zoom={0.5} radius={18} bg="#171717" slots={slots} attrs={{ 'input#search-input, input.search-input': { value: s.query } }} />;
};

// ---------------------------------------------------------------- X
/** 帖子配图：报告首页（白底论文版式，记忆分层图） */
const Paper: React.FC<{ p: Content['xSearch']['paper']; w: number; h: number }> = ({ p, w, h }) => (
  <div style={{ width: w, height: h, borderRadius: 16, border: `1px solid ${XL}`, background: '#fff', overflow: 'hidden', color: '#111', padding: '14px 22px', boxSizing: 'border-box', fontFamily: 'Georgia, "Times New Roman", serif', position: 'relative' }}>
    <div style={{ textAlign: 'center', fontSize: 7, color: '#777', fontStyle: 'italic' }}>{p.kicker}</div>
    <div style={{ textAlign: 'center', fontSize: 15, fontWeight: 700, marginTop: 6 }}>{p.title}</div>
    <div style={{ textAlign: 'center', fontSize: 8.5, fontWeight: 700, marginTop: 2 }}>{p.sub}</div>
    {/* 分层示意 */}
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 16 }}>
      {p.layers.map((s, i) => (
        <React.Fragment key={s}>
          {i > 0 && <span style={{ fontSize: 8, color: '#888' }}>→</span>}
          <div style={{ padding: '5px 6px', borderRadius: i === 4 ? 4 : 10, border: `1px solid ${i === 4 ? '#16A34A' : '#555'}`, background: i === 4 ? '#DCFCE7' : '#fff', fontSize: 7, fontFamily: FONT, whiteSpace: 'nowrap' }}>{s}</div>
        </React.Fragment>
      ))}
    </div>
    <div style={{ fontSize: 6, color: '#666', textAlign: 'center', marginTop: 8 }}>Fig. 1. Agent memory flow</div>
    {/* 正文两栏 */}
    <div style={{ display: 'flex', gap: 14, marginTop: 10 }}>
      <div style={{ flex: 1, fontSize: 6.5, lineHeight: 1.45, textAlign: 'justify' }}>{p.abstract} {p.abstract}</div>
      <div style={{ flex: 1 }}>{Array.from({ length: 12 }).map((_, j) => <div key={j} style={{ height: 3, marginTop: j ? 5.4 : 2, borderRadius: 1, background: '#C9C9C9', width: j % 5 === 4 ? '60%' : '100%' }} />)}</div>
    </div>
    <div style={{ position: 'absolute', right: 18, bottom: 10, fontSize: 8, fontWeight: 700, fontFamily: FONT }}>{p.footer}</div>
  </div>
);


/** X 搜索结果页 500×400（视口 750×600 CSS 像素，深色） */
export const XSearch: React.FC<{ c: Content }> = ({ c }) => {
  const s = c.xSearch;
  const slots: Record<string, any> = {
    'me-avatar': ({ w }: { w: number }) => <div style={{ width: w || 40, height: w || 40, borderRadius: '50%', overflow: 'hidden' }}><XiaoheiAvatar size={w || 40} /></div>,
    avatar: ({ w }: { w: number }) => <div style={{ width: w || 40, height: w || 40, borderRadius: '50%', background: 'linear-gradient(135deg,#1D9BF0,#7C3AED)', color: '#fff', fontSize: (w || 40) * 0.38, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT }}>AI</div>,
    name: s.name, handle: s.handle, date: s.date,
    text: s.lines.map((l, i) => <React.Fragment key={i}>{i > 0 && '\n'}{l}</React.Fragment>),
    // 配图位按真实帖子的图片比例（竖图）：报告按宽铺满，纸面往下延伸
    media: ({ w, h }: { w: number; h: number }) => <Fit w={w} h={h} nw={380} nh={(380 * h) / w} radius={16}><Paper p={s.paper} w={380} h={(380 * h) / w} /></Fit>,
    'count-reply': s.counts[0], 'count-retweet': s.counts[1], 'count-like': s.counts[2], 'count-views': s.counts[3],
  };
  return <SitePage site="x" w={500} h={400} zoom={2 / 3} radius={18} bg="#000" slots={slots} attrs={{ 'input[data-testid="SearchBox_Search_Input"]': { value: s.query } }} />;
};
