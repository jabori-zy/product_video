import React from 'react';
import type { Content } from '../data/content';
import { FONT } from '../fonts';
import { XiaoheiAvatar } from './avatar';
import { C } from '../lib';
import { RagFrame } from './understand';
import {
  IBack, IBell, IBookmark, IBubble, IChat, ICoin, IDanmaku, IForward, IGear, IHeart, IHistory, IHome, IMore, IPlay, IPlayFill, IPlus,
  IReply, IRepost, ISearch, IShare, IStar, IThumb, IUpload, IVerified, IVideo, IViews, PersonAvatar, XLogo,
} from './icons';

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

/** B 站视频页 720×450：按真实网页还原（顶栏、标题、播放器、弹幕发送条、三连工具栏） */
export const Bili: React.FC<{ c: Content }> = ({ c }) => {
  const b = c.bili;
  const BLUE = '#00AEEC', ICON = '#61666D', SUB = '#9499A0';
  return (
    <div style={page(720, 450, '#fff', { color: '#18191C' })}>
      {/* 顶栏 */}
      <div style={{ height: 50, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 14, boxShadow: '0 1px 2px rgba(0,0,0,.06)' }}>
        <div style={{ color: BLUE, fontSize: 23, fontWeight: 900, fontStyle: 'italic', letterSpacing: -0.5, marginRight: 4 }}>{b.site}</div>
        {b.nav.map((n) => <div key={n} style={{ fontSize: 13, whiteSpace: 'nowrap' }}>{n}</div>)}
        <div style={{ flex: 1, minWidth: 110, height: 32, borderRadius: 8, background: '#F1F2F3', border: '1px solid #E3E5E7', boxSizing: 'border-box', display: 'flex', alignItems: 'center', padding: '0 10px', fontSize: 13, color: ICON, gap: 6 }}>
          <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.search}</span><ISearch size={15} color={ICON} />
        </div>
        <XiaoheiAvatar size={32} style={{ border: '1px solid #E3E5E7' }} />
        {[IBell, IStar, IHistory].map((I, i) => <I key={i} size={19} color={ICON} />)}
        <div style={{ height: 32, padding: '0 12px', borderRadius: 8, background: '#FF6699', color: '#fff', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}><IUpload size={15} color="#fff" />{b.upload}</div>
      </div>
      {/* 标题与数据 */}
      <div style={{ position: 'absolute', left: 16, right: 16, top: 60, fontSize: 18, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.title}</div>
      <div style={{ position: 'absolute', left: 16, top: 88, display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: SUB, whiteSpace: 'nowrap' }}>
        <IPlay size={15} color={SUB} />{b.views}<span style={{ width: 8 }} /><IDanmaku size={15} color={SUB} />{b.danmaku}<span style={{ width: 8 }} />{b.date}<span style={{ width: 8 }} />{b.copyright}
      </div>
      {/* 播放器 */}
      <div style={{ position: 'absolute', left: 16, top: 112, width: 688, height: 246, overflow: 'hidden', background: '#000' }}>
        <div style={{ transform: 'scale(1.2)', transformOrigin: '0 0', width: 330, height: 190, position: 'absolute', left: (688 - 396) / 2, top: 4 }}><RagFrame c={c} play={false} /></div>
        <div style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: 56, background: 'linear-gradient(transparent, rgba(0,0,0,.7))' }} />
        {/* 进度条：章节分段 */}
        <div style={{ position: 'absolute', left: 12, right: 12, bottom: 30, height: 3, display: 'flex', gap: 2 }}>
          {b.chapters.map((s, i) => (
            <div key={s} style={{ flex: 1, background: 'rgba(255,255,255,.2)', overflow: 'hidden' }}>
              <div style={{ width: i === 0 ? '100%' : i === 1 ? '45%' : 0, height: '100%', background: BLUE }} />
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', left: 12 + 676 * 0.36 - 5, bottom: 26.5, width: 10, height: 10, borderRadius: 5, background: '#fff', boxShadow: '0 0 0 2px rgba(0,174,236,.5)' }} />
        <div style={{ position: 'absolute', left: 12, bottom: 7, display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,.85)', fontSize: 12 }}>
          <IPlayFill size={15} color="#fff" />{b.time}<span style={{ opacity: 0.8 }}>· {b.chapters[1]} ›</span>
        </div>
        <div style={{ position: 'absolute', right: 12, bottom: 7, display: 'flex', alignItems: 'center', gap: 14 }}>
          <IGear size={16} color="rgba(255,255,255,.85)" />
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.85)" strokeWidth={2} strokeLinecap="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>
        </div>
      </div>
      {/* 弹幕发送条 */}
      <div style={{ position: 'absolute', left: 16, top: 358, width: 688, height: 38, display: 'flex', alignItems: 'center', gap: 10, padding: '0 10px', boxSizing: 'border-box', boxShadow: '0 1px 3px rgba(0,0,0,.08)' }}>
        <span style={{ fontSize: 12, color: ICON, whiteSpace: 'nowrap' }}><b>{b.online.split(' ')[0]}</b> {b.online.split(' ').slice(1).join(' ')}</span>
        <div style={{ flex: 1, height: 26, borderRadius: 8, background: '#F1F2F3', display: 'flex', alignItems: 'center', paddingLeft: 10, fontSize: 12, color: SUB, overflow: 'hidden', whiteSpace: 'nowrap' }}>{b.dmHint}</div>
        <div style={{ height: 26, padding: '0 14px', borderRadius: 8, background: BLUE, color: '#fff', fontSize: 12, display: 'flex', alignItems: 'center' }}>{b.send}</div>
      </div>
      {/* 点赞 投币 收藏 转发 */}
      <div style={{ position: 'absolute', left: 16, top: 410, display: 'flex', gap: 30, fontSize: 13, fontWeight: 500, color: ICON }}>
        {([IThumb, ICoin, IStar, IForward] as const).map((I, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, color: i === 0 ? BLUE : ICON }}>
            {I === IStar ? <IStar size={24} color={ICON} fill /> : <I size={24} color={i === 0 ? BLUE : ICON} />}{b.actions[i]}
          </span>
        ))}
      </div>
    </div>
  );
};

/** 小红书笔记页 500×400（深色）：左侧栏 + 笔记详情（封面 | 作者、正文、标签、互动栏） */
export const Xhs: React.FC<{ c: Content }> = ({ c: { xhs: x } }) => {
  const RED = '#FF2442';
  const TILE = ['#FDE68A', '#BBF7D0', '#BFDBFE', '#FBCFE8'];
  return (
    <div style={page(500, 400, '#121212', { color: '#fff' })}>
      {/* 左侧栏 */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: 56, height: 400, background: '#181818' }}>
        <div style={{ position: 'absolute', left: 8, top: 14, width: 40, height: 20, borderRadius: 10, background: RED, color: '#fff', fontSize: 10, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', letterSpacing: -0.5 }}>{x.site.length > 4 ? 'RED' : x.site}</div>
        {[IHome, IChat, IVideo, IPlus, IBell].map((I, i) => <I key={i} size={18} color={i === 0 ? '#fff' : 'rgba(255,255,255,.7)'} style={{ position: 'absolute', left: 19, top: 64 + i * 44 }} />)}
      </div>
      {/* 笔记详情 */}
      <div style={{ position: 'absolute', left: 64, top: 10, width: 428, height: 380, borderRadius: 14, overflow: 'hidden', background: '#1F1F1F' }}>
        {/* 封面（绘制的图文封面：大字 + 荧光笔 + 小卡片） */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: 196, height: 380, background: '#000' }}>
          <div style={{ position: 'absolute', left: 0, top: 36, width: 196, height: 262, background: '#FFF8EA', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: 16, top: 22, color: '#1a1a1a', fontWeight: 900, lineHeight: 1.15 }}>
              <div style={{ fontSize: 30 }}>{x.cover[0]}</div>
              <div style={{ fontSize: 30, position: 'relative', display: 'inline-block' }}>
                <span style={{ position: 'absolute', left: -2, right: -2, bottom: 2, height: 12, background: '#7CF29A', opacity: 0.85 }} />
                <span style={{ position: 'relative' }}>{x.cover[1]}</span>
              </div>
              <div style={{ fontSize: 18, color: RED, marginTop: 6 }}>{x.cover[2]}</div>
            </div>
            <div style={{ position: 'absolute', left: 14, right: 14, bottom: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
              {x.tiles.slice(0, 4).map((s, i) => (
                <div key={s} style={{ height: 36, borderRadius: 7, background: TILE[i], color: '#333', fontSize: 11, fontWeight: 700, padding: '5px 7px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ width: '70%', height: 3, borderRadius: 2, background: 'rgba(0,0,0,.18)' }} />
                  {s}
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 52, display: 'flex', justifyContent: 'center', gap: 5 }}>
            {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ width: 5, height: 5, borderRadius: 3, background: i === 0 ? '#fff' : 'rgba(255,255,255,.35)' }} />)}
          </div>
        </div>
        {/* 右侧内容 */}
        <div style={{ position: 'absolute', left: 196, top: 0, width: 232, height: 380, padding: '14px 14px 0', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <PersonAvatar size={28} bg="#E9A6B5" />
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,.85)', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{x.author}</span>
            <span style={{ height: 26, padding: '0 14px', borderRadius: 13, background: RED, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center' }}>{x.follow}</span>
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.4, marginTop: 16, ...clamp(2) }}>{x.title}</div>
          <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,.82)', lineHeight: 1.6, marginTop: 8, ...clamp(4) }}>{x.body}</div>
          <div style={{ fontSize: 12.5, color: '#8EB7FF', marginTop: 6, lineHeight: 1.5 }}>{x.tags}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.45)', marginTop: 8 }}>{x.date}</div>
          <div style={{ height: 1, background: 'rgba(255,255,255,.1)', margin: '12px 0 10px' }} />
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.55)' }}>{x.commentsTotal}</div>
        </div>
        {/* 互动栏 */}
        <div style={{ position: 'absolute', left: 196, bottom: 0, width: 232, height: 52, borderTop: '1px solid rgba(255,255,255,.1)', display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', boxSizing: 'border-box', fontSize: 11.5, color: 'rgba(255,255,255,.85)' }}>
          <div style={{ flex: 1, height: 30, borderRadius: 15, background: 'rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', paddingLeft: 10, fontSize: 11.5, color: 'rgba(255,255,255,.45)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>{x.input}</div>
          <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}><IHeart size={17} color={RED} fill />{x.likes}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}><IStar size={17} color="#FFC233" fill />{x.saves}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}><IBubble size={16} color="rgba(255,255,255,.85)" />{x.comments}</span>
        </div>
      </div>
    </div>
  );
};

/** X 帖子 500×400（深色）：左侧导航 + 帖子详情（头像、认证、正文、配图、互动栏） */
export const XPost: React.FC<{ c: Content }> = ({ c: { x } }) => {
  const T = '#E7E9EA', M = '#71767B', LINE = '#2F3336';
  const LAYER = ['#1D9BF0', '#3B82F6', '#6366F1', '#22C55E'];
  return (
    <div style={page(500, 400, '#000', { color: T })}>
      {/* 左侧导航（窄屏折叠为图标） */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: 60, height: 400, borderRight: `1px solid ${LINE}` }}>
        <div style={{ position: 'absolute', left: 17, top: 14 }}><XLogo size={26} color={T} /></div>
        {[IHome, ISearch, IBell, IChat].map((I, i) => <I key={i} size={22} color={T} fill={i === 0} style={{ position: 'absolute', left: 19, top: 66 + i * 50 }} />)}
      </div>
      {/* 帖子 */}
      <div style={{ position: 'absolute', left: 61, top: 0, width: 439, height: 400 }}>
        <div style={{ height: 48, display: 'flex', alignItems: 'center', gap: 24, padding: '0 14px', fontSize: 18, fontWeight: 700 }}>
          <IBack size={18} color={T} />{x.header}
        </div>
        <div style={{ position: 'absolute', left: 14, top: 58 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#1D9BF0,#7C3AED)', color: '#fff', fontSize: 15, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>AI</div>
        </div>
        <div style={{ position: 'absolute', left: 66, right: 14, top: 58 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 15, whiteSpace: 'nowrap' }}>
            <b>{x.name}</b><IVerified size={17} /><span style={{ color: M }}>{x.handle} · {x.date}</span>
            <IMore size={18} color={M} style={{ marginLeft: 'auto' }} />
          </div>
          <div style={{ fontSize: 15, lineHeight: '20px', marginTop: 4 }}>{x.text}</div>
          {x.translate && <div style={{ fontSize: 13, color: '#1D9BF0', marginTop: 4 }}>{x.translate}</div>}
          {/* 配图：记忆分层示意 */}
          <div style={{ marginTop: 10, height: x.translate ? 214 : 232, borderRadius: 16, border: `1px solid ${LINE}`, background: 'linear-gradient(160deg,#0B1220,#111827)', overflow: 'hidden', padding: '14px 18px', boxSizing: 'border-box' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: 0.3 }}>{x.media.title}</div>
            {x.media.layers.map((s, i) => (
              <div key={s} style={{ marginTop: i ? 8 : 14, marginLeft: i * 12, height: 30, borderRadius: 6, background: `${LAYER[i]}${i === 3 ? '' : '33'}`, border: `1px solid ${LAYER[i]}`, color: i === 3 ? '#04130A' : '#E5E7EB', fontSize: 11.5, fontWeight: i === 3 ? 700 : 500, display: 'flex', alignItems: 'center', paddingLeft: 10 }}>{s}</div>
            ))}
          </div>
          {/* 互动栏 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 13, color: M }}>
            {([IReply, IRepost, IHeart, IViews] as const).map((I, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}><I size={18} color={M} />{x.counts[i]}</span>
            ))}
            <span style={{ display: 'flex', gap: 12 }}><IBookmark size={18} color={M} /><IShare size={18} color={M} /></span>
          </div>
        </div>
      </div>
    </div>
  );
};

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
