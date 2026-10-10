import React from 'react';
import type { Content } from '../data/content';
import { FONT } from '../fonts';
import { XiaoheiAvatar } from './avatar';
import { C } from '../lib';
import { RagFrame } from './understand';

// C 段走廊里的来源卡片（尺寸与线框一致）
const page = (w: number, h: number, bg: string, extra?: React.CSSProperties): React.CSSProperties => ({
  width: w, height: h, background: bg, fontFamily: FONT, position: 'relative', overflow: 'hidden', borderRadius: 18, boxSizing: 'border-box', ...extra,
});
const clamp = (n: number): React.CSSProperties => ({ display: '-webkit-box', WebkitLineClamp: n, WebkitBoxOrient: 'vertical', overflow: 'hidden' });

/** 新闻站 720×450 */
export const News: React.FC<{ c: Content }> = ({ c: { news: n } }) => (
  <div style={page(720, 450, '#fff', { color: '#111' })}>
    <div style={{ height: 52, background: '#0F172A', display: 'flex', alignItems: 'center', padding: '0 28px', gap: 22 }}>
      <div style={{ color: '#fff', fontSize: 20, fontWeight: 900 }}>{n.site}</div>
      {n.nav.map((s, i) => <div key={s} style={{ color: i === 1 ? '#38BDF8' : '#CBD5E1', fontSize: 14, fontWeight: i === 1 ? 700 : 400 }}>{s}</div>)}
    </div>
    <div style={{ display: 'flex', gap: 22, padding: '22px 28px' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{ background: '#DC2626', color: '#fff', fontSize: 12, fontWeight: 700, padding: '3px 8px', borderRadius: 3 }}>{n.tag}</span>
        <div style={{ fontSize: 27, fontWeight: 800, lineHeight: 1.3, marginTop: 12 }}>{n.headline}</div>
        <div style={{ fontSize: 14, color: '#475569', lineHeight: 1.6, marginTop: 10, ...clamp(3) }}>{n.dek}</div>
        <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 10 }}>{n.byline}</div>
      </div>
      {/* 配图：成本下降折线 */}
      <svg width={230} height={170} viewBox="0 0 230 170" style={{ flexShrink: 0, borderRadius: 8, background: 'linear-gradient(160deg,#E0F2FE,#F8FAFC)' }}>
        {[40, 80, 120].map((y) => <line key={y} x1={16} x2={214} y1={y} y2={y} stroke="#CBD5E1" strokeDasharray="3 4" />)}
        <polyline points="20,28 60,44 100,70 140,104 180,128 210,140" fill="none" stroke="#0EA5E9" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
        {[[20, 28], [210, 140]].map(([x, y]) => <circle key={x} cx={x} cy={y} r={6} fill="#0EA5E9" />)}
        <text x={214} y={32} fontSize={24} fontWeight={800} fill="#DC2626" textAnchor="end" fontFamily={FONT}>−90%</text>
      </svg>
    </div>
    <div style={{ margin: '0 28px', borderTop: '2px solid #0F172A', paddingTop: 10 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{n.more}</div>
      {n.stories.map((s) => <div key={s} style={{ fontSize: 15, marginTop: 8, color: '#1E293B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>· {s}</div>)}
    </div>
  </div>
);

/** B 站视频页 720×450 */
export const Bili: React.FC<{ c: Content }> = ({ c }) => {
  const b = c.bili;
  const COLS = ['#4A8EF9', '#22C55E', '#F59E0B', '#EC4899'];
  return (
    <div style={page(720, 450, '#fff', { color: '#18191C' })}>
      <div style={{ height: 46, display: 'flex', alignItems: 'center', padding: '0 22px', gap: 14, borderBottom: '1px solid #E3E5E7' }}>
        <div style={{ color: '#00AEEC', fontSize: 22, fontWeight: 900, fontStyle: 'italic' }}>{b.site}</div>
        <XiaoheiAvatar size={30} style={{ marginLeft: 'auto', border: '2px solid #FB7299' }} />
      </div>
      <div style={{ padding: '12px 22px 0' }}>
        <div style={{ fontSize: 19, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.title}</div>
        <div style={{ fontSize: 12, color: '#9499A0', marginTop: 4 }}>{b.views} · {b.danmaku} · {b.date} · UP {b.up}</div>
      </div>
      {/* 播放器 */}
      <div style={{ position: 'absolute', left: 22, top: 112, width: 676, height: 262, borderRadius: 8, overflow: 'hidden', background: '#0F172A' }}>
        {/* 画面按 330×190 原比例放大 1.2×，居中；底部 34 px 留给进度条 */}
        <div style={{ transform: 'scale(1.2)', transformOrigin: '0 0', width: 330, height: 190, position: 'absolute', left: (676 - 396) / 2, top: 0 }}><RagFrame c={c} play={false} /></div>
        <div style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: 40, background: 'linear-gradient(transparent, rgba(0,0,0,.75))' }} />
        <div style={{ position: 'absolute', left: 14, right: 14, bottom: 26, height: 4, display: 'flex', gap: 3 }}>
          {b.chapters.map((s, i) => (
            <div key={s} style={{ flex: 1, background: 'rgba(255,255,255,.3)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ width: i === 0 ? '100%' : i === 1 ? '45%' : 0, height: '100%', background: '#00AEEC' }} />
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', left: 14, bottom: 6, color: '#fff', fontSize: 12 }}>▶ {b.time}</div>
        <div style={{ position: 'absolute', right: 14, bottom: 6, color: '#fff', fontSize: 12, display: 'flex', gap: 10 }}>
          {b.chapters.map((s, i) => <span key={s} style={{ color: COLS[i] }}>● {s}</span>)}
        </div>
      </div>
      <div style={{ position: 'absolute', left: 22, top: 388, display: 'flex', gap: 26, fontSize: 15, color: '#61666D' }}>
        {b.actions.map((s) => <span key={s}>{s}</span>)}
      </div>
    </div>
  );
};

/** 小红书笔记 500×400 */
export const Xhs: React.FC<{ c: Content }> = ({ c: { xhs: x } }) => {
  const G = ['linear-gradient(135deg,#FDE68A,#F59E0B)', 'linear-gradient(135deg,#BBF7D0,#22C55E)', 'linear-gradient(135deg,#BFDBFE,#3B82F6)', 'linear-gradient(135deg,#FBCFE8,#EC4899)', 'linear-gradient(135deg,#DDD6FE,#8B5CF6)'];
  const tile = (i: number, st: React.CSSProperties) => (
    <div style={{ position: 'absolute', borderRadius: 10, background: G[i], display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 10, boxSizing: 'border-box', color: '#fff', fontWeight: 800, fontSize: i === 0 ? 24 : 16, textShadow: '0 1px 4px rgba(0,0,0,.25)', ...st }}>
      {/* 小清单图示 */}
      <div style={{ position: 'absolute', left: 12, top: 12, right: 12, display: 'flex', flexDirection: 'column', gap: 5 }}>
        {[0.9, 0.7, 0.8].map((w, j) => <div key={j} style={{ width: `${w * 100}%`, height: i === 0 ? 8 : 5, borderRadius: 3, background: 'rgba(255,255,255,.65)' }} />)}
      </div>
      {x.tiles[i]}
    </div>
  );
  return (
    <div style={page(500, 400, '#fff', { color: '#333' })}>
      {tile(0, { left: 16, top: 16, width: 230, height: 230 })}
      {tile(1, { left: 254, top: 16, width: 112, height: 112 })}
      {tile(2, { left: 374, top: 16, width: 110, height: 112 })}
      {tile(3, { left: 254, top: 134, width: 112, height: 112 })}
      {tile(4, { left: 374, top: 134, width: 110, height: 112 })}
      <div style={{ position: 'absolute', left: 16, top: 258, right: 16 }}>
        <div style={{ fontSize: 19, fontWeight: 700, lineHeight: 1.35, ...clamp(2) }}>{x.title}</div>
        <div style={{ fontSize: 13, color: '#13386C', marginTop: 6 }}>{x.tags}</div>
      </div>
      <div style={{ position: 'absolute', left: 16, right: 16, bottom: 14, display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#666' }}>
        <XiaoheiAvatar size={26} style={{ border: '1px solid #eee' }} />
        {x.author}
        <span style={{ marginLeft: 'auto', color: '#FF2442' }}>♥ {x.likes}</span>
        <span>★ {x.saves}</span>
      </div>
    </div>
  );
};

/** X 帖子 500×400 */
export const XPost: React.FC<{ c: Content }> = ({ c: { x } }) => (
  <div style={page(500, 400, '#000', { color: '#E7E9EA', padding: 24 })}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <XiaoheiAvatar size={48} />
      <div>
        <div style={{ fontSize: 17, fontWeight: 700 }}>{x.name} <span style={{ color: '#1D9BF0' }}>✔</span></div>
        <div style={{ fontSize: 15, color: '#71767B' }}>{x.handle}</div>
      </div>
      <div style={{ marginLeft: 'auto', fontSize: 24, fontWeight: 900 }}>𝕏</div>
    </div>
    <div style={{ fontSize: 26, lineHeight: 1.35, marginTop: 20, fontWeight: 500 }}>{x.text}</div>
    {x.translate && <div style={{ fontSize: 14, color: '#1D9BF0', marginTop: 10 }}>{x.translate}</div>}
    <div style={{ fontSize: 14, color: '#71767B', marginTop: 16 }}>{x.time}</div>
    <div style={{ borderTop: '1px solid #2F3336', borderBottom: '1px solid #2F3336', marginTop: 14, padding: '12px 0', display: 'flex', flexWrap: 'wrap', gap: '6px 18px', fontSize: 14, color: '#71767B' }}>
      {x.stats.map((s) => { const [num, ...rest] = s.split(' '); return <span key={s}><b style={{ color: '#E7E9EA' }}>{num}</b> {rest.join(' ')}</span>; })}
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 12, fontSize: 18, color: '#71767B' }}>
      <span>💬</span><span>🔁</span><span>♡</span><span>🔖</span><span>↗</span>
    </div>
  </div>
);

/** RSS 订阅文件夹 460×380（深色，与 OmniBox 一致） */
/** reveal：每篇新文章的出现进度（视频里逐篇滑入）；badge：是否显示 +3 */
export const Rss: React.FC<{ c: Content; reveal?: number[]; badge?: boolean }> = ({ c: { rss: r }, reveal = [1, 1, 1], badge = true }) => (
  <div style={page(460, 380, '#2a2a2e', { color: C.text, padding: 26 })}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: '#F97316', color: '#fff', fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📡</div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 700 }}>{r.folder}</div>
        <div style={{ fontSize: 13, color: C.muted }}>{r.feeds}</div>
      </div>
      <div style={{ marginLeft: 'auto', background: '#E5484D', color: '#fff', borderRadius: 999, padding: '4px 12px', fontSize: 18, fontWeight: 700, opacity: badge ? 1 : 0 }}>{r.badge}</div>
    </div>
    {r.articles.map(([feed, title, ago], i) => (
      <div key={title} style={{ marginTop: i ? 10 : 22, padding: '12px 14px', borderRadius: 10, background: '#3a3a40', opacity: reveal[i], transform: `translateX(${(1 - reveal[i]) * 60}px)` }}>
        <div style={{ display: 'flex', fontSize: 12, color: C.muted }}><span style={{ color: '#FDBA74' }}>● {feed}</span><span style={{ marginLeft: 'auto' }}>{ago}</span></div>
        <div style={{ fontSize: 16, marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
      </div>
    ))}
  </div>
);
