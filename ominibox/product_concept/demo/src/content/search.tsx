import React from 'react';
import type { Content } from '../data/content';
import { FONT } from '../fonts';
import { XiaoheiAvatar } from './avatar';
import { RagFrame } from './understand';
import {
  IBell, IBookmark, IBubble, IChat, IHeart, IHome, IMore, IPlay, IReply, IRepost, ISearch, IShare, IVerified, IVideo, IViews, PersonAvatar, XLogo,
} from './icons';

// C 段走廊里的三张来源卡片：按真实搜索结果页还原（assets/screenshot/bilibili.png、xiaohongshu.png、x.png）
// 页面按 CSS 像素排版（与真实网页同一套尺寸），再整体缩放进卡片，相当于浏览器缩小显示

/** 卡片外壳：w×h 卡片里放一个 (w/z)×(h/z) 的网页视口 */
const Viewport: React.FC<{ w: number; h: number; z: number; bg: string; color: string; children: React.ReactNode }> = ({ w, h, z, bg, color, children }) => (
  <div style={{ width: w, height: h, borderRadius: 18, overflow: 'hidden', position: 'relative', background: bg }}>
    <div style={{ position: 'absolute', left: 0, top: 0, width: w / z, height: h / z, transform: `scale(${z})`, transformOrigin: '0 0', fontFamily: FONT, color, overflow: 'hidden' }}>{children}</div>
  </div>
);

const clamp = (n: number): React.CSSProperties => ({ display: '-webkit-box', WebkitLineClamp: n, WebkitBoxOrient: 'vertical', overflow: 'hidden' });

/** 标题里的搜索词标红（不区分大小写） */
const hl = (text: string, kws: string[], color: string) => {
  const re = new RegExp(`(${kws.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  return text.split(re).map((s, i) => (i % 2 ? <span key={i} style={{ color }}>{s}</span> : <React.Fragment key={i}>{s}</React.Fragment>));
};

// ---------------------------------------------------------------- B 站搜索页
const BLUE = '#00AEEC', PINK = '#FF6699', INK = '#18191C', ICON = '#61666D', SUB = '#9499A0', LINE = '#E3E5E7', KW = '#F25D59';

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
  const s = c.biliSearch, b = c.bili;
  const cw = 216, ch = 122;
  const stat = (I: React.FC<any>, v: string) => <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><I size={13} color="#fff" />{v}</span>;
  return (
    <Viewport w={720} h={450} z={0.75} bg="#fff" color={INK}>
      {/* 顶栏 */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: 960, height: 64, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 16, boxSizing: 'border-box', boxShadow: `inset 0 -1px 0 ${LINE}` }}>
        <div style={{ color: BLUE, fontSize: 26, fontWeight: 900, fontStyle: 'italic', letterSpacing: -0.5 }}>{b.site}</div>
        <div style={{ display: 'flex', gap: 15, fontSize: 14, overflow: 'hidden', flex: 1, whiteSpace: 'nowrap' }}>{s.nav.map((n, i) => <span key={n}>{n}{i === 0 ? ' ⌄' : ''}</span>)}</div>
        <XiaoheiAvatar size={34} style={{ border: `1px solid ${LINE}` }} />
        {[IBubble, IStarOutline, IBookmark, IClock].map((I, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, fontSize: 11, color: INK, position: 'relative', width: 40 }}>
            <I size={19} color={INK} />{s.icons[i]}
            {i === 0 && <span style={{ position: 'absolute', left: 22, top: -6, background: '#FA5A57', color: '#fff', fontSize: 9, borderRadius: 7, padding: '0 4px', lineHeight: '13px' }}>70</span>}
          </div>
        ))}
        <div style={{ height: 34, padding: '0 14px', borderRadius: 8, background: PINK, color: '#fff', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>⇪ {b.upload}</div>
      </div>
      {/* 搜索框 */}
      <div style={{ position: 'absolute', left: 220, top: 80, width: 520, height: 44, borderRadius: 8, border: `1px solid ${LINE}`, background: '#fff', boxSizing: 'border-box', display: 'flex', alignItems: 'center', paddingLeft: 14, gap: 8, boxShadow: '0 2px 8px rgba(0,0,0,.05)' }}>
        <ISearch size={16} color={BLUE} /><span style={{ fontSize: 16, flex: 1 }}>{b.search}</span>
        <div style={{ width: 88, height: 34, marginRight: 4, borderRadius: 6, background: BLUE, color: '#fff', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.btn}</div>
      </div>
      {/* 分类 tab */}
      <div style={{ position: 'absolute', left: 24, top: 140, right: 24, height: 44, display: 'flex', gap: 34, alignItems: 'center', boxShadow: `inset 0 -1px 0 ${LINE}` }}>
        {s.tabs.map(([n, k], i) => (
          <div key={n} style={{ position: 'relative', fontSize: 15, color: i === 0 ? BLUE : INK, fontWeight: i === 0 ? 600 : 400, whiteSpace: 'nowrap', height: 44, lineHeight: '44px' }}>
            {n}{k && <span style={{ fontSize: 11, color: SUB, marginLeft: 4 }}>{k}</span>}
            {i === 0 && <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 3, borderRadius: 2, background: BLUE }} />}
          </div>
        ))}
      </div>
      {/* 排序 */}
      <div style={{ position: 'absolute', left: 24, top: 200, right: 24, height: 30, display: 'flex', gap: 10, alignItems: 'center' }}>
        {s.sorts.map((n, i) => (
          <div key={n} style={{ height: 30, padding: '0 14px', borderRadius: 6, background: i === 0 ? '#DFF6FD' : undefined, color: i === 0 ? BLUE : ICON, fontSize: 13, lineHeight: '30px', whiteSpace: 'nowrap' }}>{n}</div>
        ))}
        <div style={{ marginLeft: 'auto', height: 28, padding: '0 10px', borderRadius: 6, border: `1px solid ${LINE}`, fontSize: 13, lineHeight: '28px', color: INK, whiteSpace: 'nowrap' }}>{s.more} ⌄</div>
      </div>
      {/* 视频网格 */}
      {s.videos.map((v, i) => {
        const col = i % 4, row = Math.floor(i / 4);
        return (
          <div key={v.title} style={{ position: 'absolute', left: 24 + col * (cw + 16), top: 248 + row * 214, width: cw }}>
            <div style={{ position: 'relative', width: cw, height: ch, borderRadius: 6, overflow: 'hidden' }}>
              <BiliCover c={c} i={i} lines={v.cover} />
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 30, background: 'linear-gradient(transparent, rgba(0,0,0,.65))' }} />
              <div style={{ position: 'absolute', left: 8, right: 8, bottom: 5, display: 'flex', gap: 10, alignItems: 'center', color: '#fff', fontSize: 11 }}>
                {stat(IPlay, v.views)}{stat(IDanmakuS, v.dm)}<span style={{ marginLeft: 'auto' }}>{v.dur}</span>
              </div>
            </div>
            <div style={{ fontSize: 13.5, lineHeight: '20px', marginTop: 8, height: 40, ...clamp(2) }}>{hl(v.title, s.kw, KW)}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: SUB, marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden' }}>
              <span style={{ border: `1px solid ${SUB}`, borderRadius: 3, fontSize: 8, lineHeight: '10px', padding: '0 2px' }}>UP</span>{v.up} · {v.date}
            </div>
          </div>
        );
      })}
    </Viewport>
  );
};

// B 站顶栏补充图标
type P = { size?: number; color?: string };
const IStarOutline: React.FC<P> = ({ size = 16, color = '#000' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinejoin="round" style={{ display: 'block' }}><circle cx="12" cy="12" r="9" /><path d="M8 13l2.5-2.5 2 2L16 9" strokeLinecap="round" /></svg>
);
const IClock: React.FC<P> = ({ size = 16, color = '#000' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" style={{ display: 'block' }}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
const IDanmakuS: React.FC<P> = ({ size = 16, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" style={{ display: 'block' }}><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M7 10h6M7 14h10" /></svg>
);

// ---------------------------------------------------------------- 小红书搜索页（深色）
const RED = '#FF2442';

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

/** 小红书搜索结果页 500×400（视口 750×600 CSS 像素，深色） */
export const XhsSearch: React.FC<{ c: Content }> = ({ c }) => {
  const s = c.xhsSearch;
  const cw = 200, x0 = 94, gap = 14;
  const AV = ['#E9A6B5', '#C4B5FD', '#FCD34D', '#93C5FD', '#86EFAC', '#FDBA74'];
  const note = (i: number, h: number) => {
    const n = s.notes[i];
    return (
      <div key={i} style={{ marginBottom: 18 }}>
        <XhsCover c={c} i={i} w={cw} h={h} lines={n.cover} />
        <div style={{ fontSize: 13, lineHeight: '18px', fontWeight: 500, marginTop: 9, padding: '0 4px', ...clamp(2) }}>{n.title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 7, padding: '0 4px' }}>
          <PersonAvatar size={20} bg={AV[i]} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,.75)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.author}</div>
            <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,.4)' }}>{n.date}</div>
          </div>
          <IHeart size={14} color="rgba(255,255,255,.75)" /><span style={{ fontSize: 11.5, color: 'rgba(255,255,255,.75)' }}>{n.likes}</span>
        </div>
      </div>
    );
  };
  const hot = (
    <div key="hot" style={{ width: cw, borderRadius: 12, background: '#F3ECE4', padding: '14px 14px 6px', boxSizing: 'border-box', marginBottom: 18, color: '#3a3a3a' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 700 }}>
        <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#E7DED3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ISearch size={13} color="#555" /></div>{s.hot}
      </div>
      {s.hotItems.map((h) => <div key={h} style={{ fontSize: 12.5, marginTop: 13, marginBottom: 6, color: '#555', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{h}</div>)}
    </div>
  );
  const cols = [[note(0, 266), note(1, 210)], [hot, note(2, 250)], [note(3, 266), note(4, 200)]];
  const RAIL = [IHome, IChat, IVideo, IPlayBox, IPlusBox, IBell, IBubble];
  return (
    <Viewport w={500} h={400} z={2 / 3} bg="#171717" color="#fff">
      {/* 左侧栏 */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: 72, height: 600 }}>
        <div style={{ position: 'absolute', left: 13, top: 18, width: 46, height: 24, borderRadius: 12, background: RED, color: '#fff', fontSize: 11.5, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', letterSpacing: -0.5 }}>{c.xhs.site.length > 4 ? 'RED' : c.xhs.site}</div>
        {RAIL.map((I, i) => <div key={i} style={{ position: 'absolute', left: 25, top: 92 + i * 47 }}><I size={21} color="#E5E5E5" /></div>)}
        <div style={{ position: 'absolute', left: 25, top: 92 + 7 * 47, width: 22, height: 22, borderRadius: '50%', background: '#F5F5F4', overflow: 'hidden' }}><XiaoheiAvatar size={22} /></div>
      </div>
      {/* 搜索框 */}
      <div style={{ position: 'absolute', left: 150, top: 14, width: 470, height: 42, borderRadius: 21, background: '#1E1E1E', border: '1px solid #3A3A3A', boxSizing: 'border-box', display: 'flex', alignItems: 'center', paddingLeft: 18, fontSize: 15, color: '#EDEDED' }}>
        <span style={{ flex: 1 }}>{s.query}</span>
        <div style={{ width: 30, height: 30, marginRight: 5, borderRadius: '50%', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ISearch size={14} color="#fff" /></div>
      </div>
      {/* tab */}
      <div style={{ position: 'absolute', left: x0 + 4, top: 74, right: 20, display: 'flex', gap: 26, alignItems: 'center', fontSize: 15 }}>
        {s.tabs.map((n, i) => (
          <div key={n} style={{ position: 'relative', fontWeight: i === 0 ? 700 : 400, color: i === 0 ? '#fff' : 'rgba(255,255,255,.6)', paddingBottom: 6 }}>
            {n}{i === 2 && <span style={{ marginLeft: 3, fontSize: 9, padding: '0 3px', borderRadius: 4, background: '#2DD4BF', color: '#063', verticalAlign: 'top' }}>ai</span>}
            {i === 0 && <div style={{ position: 'absolute', left: 4, right: 4, bottom: 0, height: 2, borderRadius: 1, background: '#fff' }} />}
          </div>
        ))}
        <div style={{ marginLeft: 'auto', fontSize: 13.5, color: 'rgba(255,255,255,.75)' }}>{s.filter} ≡</div>
      </div>
      {/* 筛选标签 */}
      <div style={{ position: 'absolute', left: x0, top: 110, right: 0, display: 'flex', gap: 9, whiteSpace: 'nowrap', overflow: 'hidden' }}>
        {s.chips.map((n, i) => <div key={n} style={{ height: 30, padding: '0 14px', borderRadius: 8, background: i === 0 ? '#2C2C2C' : '#1F1F1F', color: i === 0 ? '#fff' : 'rgba(255,255,255,.55)', fontWeight: i === 0 ? 700 : 400, fontSize: 13, lineHeight: '30px' }}>{n}</div>)}
      </div>
      {/* 瀑布流 */}
      {cols.map((col, k) => <div key={k} style={{ position: 'absolute', left: x0 + k * (cw + gap), top: 156, width: cw }}>{col}</div>)}
    </Viewport>
  );
};

const IPlayBox: React.FC<P> = ({ size = 16, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinejoin="round" style={{ display: 'block' }}><rect x="3" y="5" width="18" height="14" rx="4" /><path d="M10 9.5v5l4-2.5z" /><circle cx="17.5" cy="8" r="1" fill={color} /></svg>
);
const IPlusBox: React.FC<P> = ({ size = 16, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" style={{ display: 'block' }}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><path d="M12 8v8M8 12h8" /></svg>
);

// ---------------------------------------------------------------- X 搜索页（深色）
const XT = '#E7E9EA', XM = '#71767B', XL = '#2F3336', XB = '#1D9BF0';

const IUsers: React.FC<P> = ({ size = 16, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" style={{ display: 'block' }}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.8-4 3.4-6 6.5-6s5.7 2 6.5 6" /><path d="M17 4.5v6M14 7.5h6" /></svg>
);
const IGrok: React.FC<P> = ({ size = 16, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" style={{ display: 'block' }}><path d="M18.5 7.5A8 8 0 1 0 19 16" /><path d="M6 19L20 4" /></svg>
);
const IFeather: React.FC<P> = ({ size = 16, color = '#000' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}><path d="M20 4C11 4 6 9 5 19" /><path d="M5 19c5-1 10-4 12-10" /><path d="M9 13h6" /></svg>
);

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
  const RAIL = [IHome, ISearch, IBell, IUsers, IChat, IGrok, IBookmark];
  return (
    <Viewport w={500} h={400} z={2 / 3} bg="#000" color={XT}>
      {/* 左侧导航（窄屏折叠为图标） */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: 76, height: 600 }}>
        <div style={{ position: 'absolute', left: 24, top: 14 }}><XLogo size={28} color={XT} /></div>
        {RAIL.map((I, i) => <div key={i} style={{ position: 'absolute', left: 24, top: 72 + i * 52 }}><I size={26} color={XT} /></div>)}
        <div style={{ position: 'absolute', left: 14, top: 72 + 7 * 52 + 6, width: 48, height: 48, borderRadius: '50%', background: XT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IFeather size={22} color="#000" /></div>
        <div style={{ position: 'absolute', left: 18, bottom: 16, width: 40, height: 40, borderRadius: '50%', overflow: 'hidden' }}><XiaoheiAvatar size={40} /></div>
      </div>
      {/* 主栏 */}
      <div style={{ position: 'absolute', left: 88, top: 0, width: 600, height: 600, borderLeft: `1px solid ${XL}`, borderRight: `1px solid ${XL}` }}>
        <div style={{ height: 54, display: 'flex', alignItems: 'center', gap: 18, padding: '0 16px' }}>
          <span style={{ fontSize: 20 }}>←</span>
          <div style={{ flex: 1, height: 40, borderRadius: 20, border: `1px solid ${XL}`, display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 14, fontSize: 15 }}><ISearch size={16} color={XM} />{s.query}</div>
          <IMore size={20} color={XT} />
        </div>
        <div style={{ height: 50, display: 'flex', borderBottom: `1px solid ${XL}` }}>
          {s.tabs.map((n, i) => (
            <div key={n} style={{ flex: 1, position: 'relative', textAlign: 'center', lineHeight: '50px', fontSize: 15, fontWeight: i === 0 ? 700 : 500, color: i === 0 ? XT : XM }}>
              {n}{i === 0 && <div style={{ position: 'absolute', left: '50%', bottom: 0, width: 52, marginLeft: -26, height: 4, borderRadius: 2, background: XB }} />}
            </div>
          ))}
        </div>
        {/* 帖子 */}
        <div style={{ position: 'relative', padding: '12px 16px 0 68px' }}>
          <div style={{ position: 'absolute', left: 16, top: 12, width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#1D9BF0,#7C3AED)', color: '#fff', fontSize: 15, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>AI</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 15, whiteSpace: 'nowrap' }}>
            <b>{s.name}</b><IVerified size={17} /><span style={{ color: XM }}>{s.handle} · {s.date}</span>
            <span style={{ marginLeft: 'auto', display: 'flex', gap: 14 }}><IGrok size={18} color={XM} /><IMore size={18} color={XM} /></span>
          </div>
          {s.translated && <div style={{ fontSize: 13, color: XM, marginTop: 3 }}>⟳ {s.translated} <span style={{ color: XB }}>{s.showOriginal}</span></div>}
          <div style={{ fontSize: 15, lineHeight: '20px', marginTop: 4 }}>{s.lines.map((l, i) => <div key={i} style={{ minHeight: 12 }}>{l}</div>)}</div>
          <div style={{ fontSize: 15, color: XB, marginTop: 2 }}>{s.more}</div>
          <div style={{ marginTop: 12 }}><Paper p={s.paper} w={380} h={262} /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 13, color: XM, width: 500 }}>
            {([IReply, IRepost, IHeart, IViews] as const).map((I, i) => <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}><I size={18} color={XM} />{s.counts[i]}</span>)}
            <span style={{ display: 'flex', gap: 12 }}><IBookmark size={18} color={XM} /><IShare size={18} color={XM} /></span>
          </div>
        </div>
      </div>
    </Viewport>
  );
};

