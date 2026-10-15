import React from 'react';
import type { Content } from '../data/content';
import { XiaoheiAvatar } from './avatar';
import { PersonAvatar } from './icons';
import { SitePage } from './site';

// 知乎专栏文章页（high_fidelity_v4）：zhuanlan.zhihu.com 文章页的真实快照（public/sites/zhihu/，tools/sites/ 导出，
// 登录态顶栏），标题、作者、正文、右栏、热搜换成片子自己的内容。页面按 1200 宽的 CSS 视口排版，放大 ZOOM 倍显示（浏览器缩放 125%）
// B 段收藏、E 段引用跳转、Content Screenshots 01 都用同一个 ZhihuPage

export const ZOOM = 1.25;

/**
 * 引文在页面容器里的屏幕坐标（未滚动时，容器宽 1500 = CSS 1200 × 1.25），供 B 段放光标、划词菜单。
 * 按快照实际排版量出来（omni/Probe 的 zhihu 状态：blockquote 里引文 span 的各行矩形），换文案或快照后要重量。
 */
// 2026-10-15 量：中文引文 1 行（CSS 138.4, 302.2，宽 408）；英文 2 行（首行宽 574.2，末行 75.1）；blockquote 行高 25.6。均 × ZOOM
const QUOTE_1500 = {
  zh: { x: 138.4 * ZOOM, y: 302.2 * ZOOM, w: 408 * ZOOM, lastW: 408 * ZOOM, lines: 1, lineH: 25.6 * ZOOM },
  en: { x: 138.4 * ZOOM, y: 328.3 * ZOOM, w: 574.2 * ZOOM, lastW: 75.1 * ZOOM, lines: 2, lineH: 25.6 * ZOOM },
};
export const zhihuQuote = (z: Content['zhihu'], _w = 1500) => (/[一-鿿]/.test(z.quote) ? QUOTE_1500.zh : QUOTE_1500.en);

export const ZhihuPage: React.FC<{
  c: Content; w: number; h: number; zoom?: number;
  /** 页面下滚（屏幕像素） */ scroll?: number;
  /** 引文选区进度 0–1 */ sel?: number; selColor?: string; selOutline?: string;
}> = ({ c: { zhihu: z }, w, h, zoom = ZOOM, scroll = 0, sel = 0, selColor = 'rgba(23,114,246,.25)', selOutline }) => {
  const p = Math.max(0, Math.min(1, sel)) * 100;
  const me = ({ w: s }: { w: number }) => <XiaoheiAvatar size={s || 30} />;
  const slots: Record<string, any> = {
    'me-avatar': me, 'me-avatar-2': me,
    title: z.title, author: z.author, bio: z.bio, collect: z.collect, voters: z.voters, date: z.date,
    'author-avatar': ({ w: s }: { w: number }) => <PersonAvatar size={s || 38} bg="#F2B36B" />,
    'side-avatar': ({ w: s }: { w: number }) => <PersonAvatar size={s || 60} bg="#F2B36B" radius={4} />,
    'side-name': z.author, 'side-bio': z.bio,
    body: (
      <>
        {/* 引文（知乎正文的 blockquote），选区画在文字底下 */}
        <blockquote>
          <span data-quote="" style={{ backgroundImage: `linear-gradient(to right, ${selColor} ${p}%, transparent ${p}%)`, outline: selOutline ? `2px solid ${selOutline}` : undefined, borderRadius: 2 }}>{z.quote}</span>
        </blockquote>
        {z.paras.map((t) => <p key={t}>{t}</p>)}
      </>
    ),
    upvote: ` ${z.upvote}`,
  };
  z.stats.forEach(([, v], i) => { slots[`stat-${i}`] = v; });
  z.hotItems.forEach(([k, v], i) => { slots[`hot-${i}`] = k; slots[`heat-${i}`] = v; });
  return <SitePage site="zhihu" w={w} h={h} zoom={zoom} slots={slots} scroll={scroll / zoom} bg="#F6F6F6" attrs={{ '.AppHeader input': { placeholder: z.search, value: '' } }} />;
};

/** Content Screenshots 01：整页 1500×788 */
export const Zhihu: React.FC<{ c: Content }> = ({ c }) => <ZhihuPage c={c} w={1500} h={788} />;
