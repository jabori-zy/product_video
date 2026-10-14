import React from 'react';
import type { Content } from '../data/content';
import { FONT } from '../fonts';
import { textW } from '../i18n';
import { XiaoheiAvatar } from './avatar';
import { IBell, IBubble, IChat, IFire, IHeart, IPlus, IRefresh, ISearch, IShare, IStar, ITriDown, ITriUp, IZhida, PersonAvatar } from './icons';

// 知乎专栏文章页，按真实网页还原（ego-browser 抓取的 zhuanlan.zhihu.com 计算样式 + assets/screenshot/zhihu.png 的登录态顶栏）
// 页面按 CSS 像素排版（同真实网页），整体放大 ZOOM 倍显示，相当于浏览器缩放 125%
// B 段收藏、E 段引用跳转、Content Screenshots 01 都用同一个 ZhihuPage

export const ZOOM = 1.25;
const BLUE = '#1772F6';
const INK = '#191B1F';
const GREY = '#8491A5';
const BG = '#F4F6F9';
const COL = 694; // 正文卡片宽
const TEXT = 654; // 正文栏宽（卡片左右各 20）
const SIDE = 296; // 右栏宽

type Z = Content['zhihu'];

/** 正文各块的纵向位置（CSS 像素，页面坐标）；标题、引文按实际字宽算行数 */
const layout = (z: Z, cssW: number) => {
  const L = Math.max(16, (cssW - (COL + 10 + SIDE)) / 2);
  const titleY = 72 + 180 + 20;
  const titleLines = Math.max(1, Math.ceil(textW(z.title, 24, 500) / TEXT));
  const authorY = titleY + titleLines * 29.3 + 20;
  const votersY = authorY + 50;
  const quoteY = votersY + 48;
  const quoteTextW = textW(z.quote, 16, 400);
  const quoteLines = Math.max(1, Math.ceil(quoteTextW / (TEXT - 16)));
  return { L, titleY, titleLines, authorY, votersY, quoteY, quoteTextW, quoteLines, parasY: quoteY + quoteLines * 25.6 + 24 };
};

/** 引文在页面容器里的屏幕坐标（未滚动时），供场景放光标、划词菜单 */
export const zhihuQuote = (z: Z, w: number, zoom = ZOOM) => {
  const { L, quoteY, quoteTextW, quoteLines } = layout(z, w / zoom);
  const lineW = Math.min(quoteTextW, TEXT - 16);
  const lastW = quoteLines > 1 ? quoteTextW - lineW * (quoteLines - 1) * 0.97 : quoteTextW;
  return { x: (L + 36) * zoom, y: quoteY * zoom, w: lineW * zoom, lastW: lastW * zoom, lines: quoteLines, lineH: 25.6 * zoom };
};

const Badge: React.FC<{ n: string }> = ({ n }) => (
  <div style={{ position: 'absolute', left: 12, top: -6, padding: '0 4px', minWidth: 10, height: 14, borderRadius: 7, background: '#F1403C', color: '#fff', fontSize: 10, lineHeight: '14px', textAlign: 'center', fontWeight: 500, border: '1px solid #fff' }}>{n}</div>
);

/** 顶栏（登录态）：知乎 · 导航 · 搜索 · 直答 · ＋ · 消息 · 私信 · 头像 */
const AppHeader: React.FC<{ z: Z; cssW: number }> = ({ z, cssW }) => {
  const inner = Math.min(1156, cssW - 40);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: cssW, height: 62, background: '#fff', boxShadow: '0 1px 3px rgba(18,18,18,.1)', zIndex: 3 }}>
      <div style={{ position: 'absolute', left: (cssW - inner) / 2, width: inner, height: 62, display: 'flex', alignItems: 'center' }}>
        <div style={{ color: BLUE, fontSize: 31, fontWeight: 700, letterSpacing: 2, lineHeight: 1, marginRight: 28 }}>{z.site}</div>
        {z.nav.map((n) => <div key={n} style={{ fontSize: 16, color: '#373A40', marginRight: z.nav.join('').length > 20 ? 18 : 24, whiteSpace: 'nowrap' }}>{n}</div>)}
        <div style={{ width: 1, height: 16, background: '#C4C7CE', margin: '0 22px 0 4px' }} />
        <div style={{ fontSize: 16, color: '#373A40', position: 'relative', marginRight: 24, whiteSpace: 'nowrap' }}>
          {z.works}
          <span style={{ position: 'absolute', right: -14, top: -9, background: '#191B1F', color: '#fff', fontSize: 9, fontWeight: 700, padding: '0 4px', borderRadius: 6, lineHeight: '13px' }}>Beta</span>
        </div>
        <div style={{ fontSize: 16, color: '#373A40', marginRight: 28, whiteSpace: 'nowrap' }}>{z.story}</div>
        {/* 搜索框 */}
        <div style={{ flex: '1 1 0', maxWidth: 320, minWidth: 140, height: 38, borderRadius: 9999, border: '1px solid #C4C7CE', boxSizing: 'border-box', display: 'flex', alignItems: 'center', padding: '0 14px 0 16px', fontSize: 14, color: GREY }}>
          <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginRight: 6 }}>{z.search}</span>
          <ISearch size={18} color={BLUE} />
        </div>
        {/* 直答 */}
        <div style={{ marginLeft: 16, flexShrink: 0, height: 38, padding: '0 14px', borderRadius: 9999, background: 'rgba(90,77,248,.1)', display: 'flex', alignItems: 'center', gap: 5, color: '#5A4DF8', fontSize: 14, fontWeight: 600 }}>
          <IZhida size={15} />{z.zhida}
        </div>
        <div style={{ flex: 1, minWidth: 16 }} />
        <div style={{ flexShrink: 0, width: 34, height: 34, borderRadius: '50%', background: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IPlus size={18} color="#fff" /></div>
        {([[IBell, z.msg, '80'], [IChat, z.dm, '99+']] as const).map(([I, label, n]) => (
          <div key={label} style={{ marginLeft: 20, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            <I size={20} color="#8590A6" fill />
            <Badge n={n} />
            <div style={{ fontSize: 11, color: '#8590A6', marginTop: 1, whiteSpace: 'nowrap' }}>{label}</div>
          </div>
        ))}
        <XiaoheiAvatar size={32} style={{ marginLeft: 20, border: '1px solid #EBEBEB' }} />
      </div>
    </div>
  );
};

/** 专栏题图（绘制，不用真实图片） */
const TitleImage: React.FC = () => (
  <div style={{ height: 180, position: 'relative', overflow: 'hidden', background: 'linear-gradient(115deg,#0B1B3F 0%,#1D3F8F 45%,#3B82F6 80%,#93C5FD 100%)' }}>
    <svg width={COL} height={180} style={{ position: 'absolute', inset: 0 }}>
      {Array.from({ length: 26 }).map((_, i) => {
        const x = 40 + ((i * 97) % 620), y = 18 + ((i * 53) % 150);
        const j = (i * 7 + 3) % 26, x2 = 40 + ((j * 97) % 620), y2 = 18 + ((j * 53) % 150);
        return <g key={i}><line x1={x} y1={y} x2={x2} y2={y2} stroke="#BFDBFE" strokeOpacity={0.25} /><circle cx={x} cy={y} r={2 + (i % 3)} fill="#E0F2FE" opacity={0.8} /></g>;
      })}
      <circle cx={520} cy={90} r={58} fill="none" stroke="#E0F2FE" strokeOpacity={0.35} strokeWidth={2} />
      <circle cx={520} cy={90} r={34} fill="#E0F2FE" opacity={0.18} />
    </svg>
  </div>
);

export const ZhihuPage: React.FC<{
  c: Content; w: number; h: number; zoom?: number;
  /** 页面下滚（屏幕像素） */ scroll?: number;
  /** 引文选区进度 0–1 */ sel?: number; selColor?: string; selOutline?: string;
}> = ({ c: { zhihu: z }, w, h, zoom = ZOOM, scroll = 0, sel = 0, selColor = 'rgba(23,114,246,.25)', selOutline }) => {
  const cssW = w / zoom, cssH = h / zoom;
  const g = layout(z, cssW);
  const { L } = g;
  const p = Math.max(0, Math.min(1, sel)) * 100;
  return (
    <div style={{ width: w, height: h, overflow: 'hidden', position: 'relative', background: BG }}>
      <div style={{ width: cssW, height: cssH, transform: `scale(${zoom})`, transformOrigin: '0 0', position: 'relative', fontFamily: FONT, color: INK }}>
        <div style={{ position: 'absolute', left: 0, top: -scroll / zoom, width: cssW, height: 2000 }}>
          {/* 正文卡片 */}
          <div style={{ position: 'absolute', left: L, top: 72, width: COL, height: 1900, background: '#fff' }}>
            <TitleImage />
          </div>
          <div style={{ position: 'absolute', left: L + 20, top: g.titleY, width: TEXT, fontSize: 24, fontWeight: 500, lineHeight: '29.3px' }}>{z.title}</div>
          <div style={{ position: 'absolute', left: L + 20, top: g.authorY, display: 'flex', alignItems: 'center', gap: 14 }}>
            <PersonAvatar size={38} bg="#F2B36B" />
            <div>
              <div style={{ fontSize: 15, fontWeight: 500, color: '#373A40', lineHeight: '18px' }}>{z.author}</div>
              <div style={{ fontSize: 13, color: GREY, lineHeight: '18px', marginTop: 2 }}>{z.bio}</div>
            </div>
          </div>
          <div style={{ position: 'absolute', left: L + 20, top: g.votersY, fontSize: 14, color: GREY, lineHeight: '20px' }}>{z.voters} ›</div>
          {/* 引文（blockquote 样式），选区画在文字底下 */}
          <div style={{ position: 'absolute', left: L + 20, top: g.quoteY, width: TEXT - 16, borderLeft: '3px solid #C4C7CE', paddingLeft: 13, fontSize: 16, lineHeight: '25.6px', color: '#535861' }}>
            <span style={{ backgroundImage: `linear-gradient(to right, ${selColor} ${p}%, transparent ${p}%)`, outline: selOutline ? `2px solid ${selOutline}` : undefined, borderRadius: 2 }}>{z.quote}</span>
          </div>
          <div style={{ position: 'absolute', left: L + 20, top: g.parasY, width: TEXT, fontSize: 16, lineHeight: '25.6px' }}>
            {z.paras.map((t) => <p key={t} style={{ margin: '0 0 22px' }}>{t}</p>)}
            <div style={{ fontSize: 14, color: GREY }}>{z.date}</div>
          </div>
          {/* 右栏：关于作者 */}
          <div style={{ position: 'absolute', left: L + COL + 10, top: 72, width: SIDE, height: 268, background: '#fff', borderRadius: 2 }}>
            <div style={{ height: 50, borderBottom: '1px solid #F0F2F7', padding: '0 20px', display: 'flex', alignItems: 'center', fontSize: 16, fontWeight: 500 }}>{z.about}</div>
            <div style={{ position: 'absolute', left: 20, top: 66, display: 'flex', gap: 12, alignItems: 'center' }}>
              <PersonAvatar size={60} bg="#F2B36B" radius={4} />
              <div>
                <div style={{ fontSize: 20, fontWeight: 500 }}>{z.author}</div>
                <div style={{ fontSize: 13, color: GREY, marginTop: 4, width: 190, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{z.bio}</div>
              </div>
            </div>
            <div style={{ position: 'absolute', left: 20, right: 20, top: 150, display: 'flex' }}>
              {z.stats.map(([k, v]) => (
                <div key={k} style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: GREY }}>{k}</div>
                  <div style={{ fontSize: 18, fontWeight: 600, marginTop: 2 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ position: 'absolute', left: 20, top: 218, display: 'flex', gap: 16 }}>
              <div style={{ width: 120, height: 34, borderRadius: 3, background: BLUE, color: '#fff', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}><IPlus size={14} color="#fff" />{z.follow}</div>
              <div style={{ width: 118, height: 32, borderRadius: 3, border: `1px solid ${GREY}`, color: GREY, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}><IBubble size={14} color={GREY} />{z.message}</div>
            </div>
          </div>
          {/* 右栏：大家都在搜 */}
          <div style={{ position: 'absolute', left: L + COL + 10, top: 350, width: SIDE, background: '#fff', borderRadius: 4, padding: '16px 16px 8px', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, fontWeight: 500 }}>
              <IFire size={18} />{z.hot}
              <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 400, color: '#9196A1' }}><IRefresh size={13} color="#9196A1" />{z.refresh}</span>
            </div>
            {z.hotItems.map(([k, v], i) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', height: 33, fontSize: 14, marginTop: i ? 0 : 10 }}>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: ['#FF501A', '#F77932', '#FA9D14'][i] ?? '#9196A1', marginRight: 8 }} />
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 190 }}>{k}</span>
                <span style={{ fontSize: 12, color: '#81858F', marginLeft: 6, whiteSpace: 'nowrap' }}>{v}</span>
                {i < 2 && <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 500, color: '#D95350', border: '1px solid #D95350', background: 'rgba(217,83,80,.1)', borderRadius: 3, padding: '0 2px', lineHeight: '14px' }}>{z.hotTag}</span>}
              </div>
            ))}
          </div>
        </div>
        <AppHeader z={z} cssW={cssW} />
        {/* 底部悬浮操作栏（随正文卡片宽） */}
        <div style={{ position: 'absolute', left: L, bottom: 0, width: COL, height: 54, background: '#fff', boxShadow: '0 -1px 3px rgba(18,18,18,.1)', display: 'flex', alignItems: 'center', padding: '0 20px', boxSizing: 'border-box', gap: 24, fontSize: 14, color: GREY, zIndex: 2 }}>
          <div style={{ display: 'flex', gap: 4, marginRight: -4 }}>
            <div style={{ height: 34, padding: '0 12px', borderRadius: 3, background: 'rgba(23,114,246,.1)', color: BLUE, display: 'flex', alignItems: 'center', gap: 6 }}><ITriUp size={10} color={BLUE} />{z.upvote}</div>
            <div style={{ width: 32, height: 34, borderRadius: 3, background: 'rgba(23,114,246,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ITriDown size={10} color={BLUE} /></div>
          </div>
          {([[IBubble, z.comments], [IHeart, z.like], [IStar, z.save], [IShare, z.share]] as const).map(([I, s]) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}><I size={16} color={GREY} fill />{s}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

/** Content Screenshots 01：整页 1500×788 */
export const Zhihu: React.FC<{ c: Content }> = ({ c }) => <ZhihuPage c={c} w={1500} h={788} />;
