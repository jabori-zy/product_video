import React from 'react';
import type { Content } from '../data/content';
import { FONT } from '../fonts';
import { XiaoheiAvatar } from './avatar';

// 知乎专栏文章页（浏览器内容区，1500×788）：B 段收藏、E 段引用跳转
const BLUE = '#1772F6';

export const Zhihu: React.FC<{ c: Content; hl?: boolean }> = ({ c: { zhihu: z }, hl }) => (
  <div style={{ width: 1500, height: 788, background: '#F6F6F6', fontFamily: FONT, color: '#121212', position: 'relative', overflow: 'hidden' }}>
    {/* 顶栏 */}
    <div style={{ height: 56, background: '#fff', boxShadow: '0 1px 3px rgba(18,18,18,.1)', display: 'flex', alignItems: 'center', padding: '0 200px', gap: 34 }}>
      <div style={{ color: BLUE, fontSize: 30, fontWeight: 900, letterSpacing: 1 }}>{z.site}</div>
      {z.nav.map((n, i) => <div key={n} style={{ fontSize: 16, color: i === 0 ? '#121212' : '#646464', fontWeight: i === 0 ? 600 : 400 }}>{n}</div>)}
      <div style={{ marginLeft: 20, width: 320, height: 34, borderRadius: 999, background: '#F6F6F6', border: '1px solid #EBEBEB', color: '#8590A6', fontSize: 14, lineHeight: '34px', paddingLeft: 18 }}>{z.search}</div>
      <XiaoheiAvatar size={30} radius={6} style={{ marginLeft: 'auto', border: '1px solid #EBEBEB' }} />
    </div>
    {/* 正文卡片：与线框位置一致（标题区 300,20 → 900 宽） */}
    <div style={{ position: 'absolute', left: 300, top: 76, width: 900, height: 760, background: '#fff', borderRadius: 4, padding: '36px 48px', boxSizing: 'border-box' }}>
      <div style={{ fontSize: 14, color: BLUE }}>{z.column}</div>
      <div style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.4, marginTop: 10 }}>{z.title}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20 }}>
        <XiaoheiAvatar size={40} radius={6} style={{ border: '1px solid #EBEBEB' }} />
        <div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>{z.author}</div>
          <div style={{ fontSize: 13, color: '#8590A6', marginTop: 2 }}>{z.bio}</div>
        </div>
        <div style={{ marginLeft: 'auto', padding: '6px 16px', borderRadius: 4, background: BLUE, color: '#fff', fontSize: 14, fontWeight: 600 }}>{z.follow}</div>
      </div>
      <div style={{ fontSize: 13, color: '#8590A6', marginTop: 14 }}>{z.date}</div>
      <div style={{ fontSize: 16, lineHeight: 1.75, marginTop: 18, color: '#121212' }}>
        <p style={{ margin: 0 }}>{z.paras[0]}</p>
        <p style={{ margin: '14px 0', padding: '4px 0 4px 16px', borderLeft: '3px solid #D3D3D3', color: '#535353', fontWeight: 600 }}>
          <span style={{ background: hl ? '#FDE68A' : undefined }}>{z.quote}</span>
        </p>
        <p style={{ margin: 0 }}>{z.paras[1]}</p>
        <p style={{ margin: '14px 0 0' }}>{z.paras[2]}</p>
      </div>
    </div>
    {/* 底部操作栏 */}
    <div style={{ position: 'absolute', left: 300, bottom: 0, width: 900, height: 56, background: '#fff', borderTop: '1px solid #EBEBEB', display: 'flex', alignItems: 'center', gap: 16, padding: '0 48px', boxSizing: 'border-box', boxShadow: '0 -1px 6px rgba(0,0,0,.05)' }}>
      <div style={{ padding: '7px 14px', borderRadius: 4, background: '#E8F0FE', color: BLUE, fontSize: 14, fontWeight: 600 }}>▲ {z.upvote}</div>
      <div style={{ padding: '7px 10px', borderRadius: 4, background: '#E8F0FE', color: BLUE, fontSize: 14 }}>▼</div>
      <div style={{ color: '#8590A6', fontSize: 14 }}>💬 {z.comments}</div>
      <div style={{ color: '#8590A6', fontSize: 14 }}>↗ {z.share}</div>
      <div style={{ color: '#8590A6', fontSize: 14 }}>★ {z.save}</div>
    </div>
    {/* 右侧作者卡 */}
    <div style={{ position: 'absolute', left: 1220, top: 76, width: 260, padding: 20, background: '#fff', borderRadius: 4, boxSizing: 'border-box' }}>
      <div style={{ fontSize: 15, fontWeight: 600 }}>{z.author}</div>
      <div style={{ fontSize: 13, color: '#8590A6', marginTop: 6, lineHeight: 1.5 }}>{z.bio}</div>
      <div style={{ marginTop: 14, padding: '6px 0', borderRadius: 4, background: BLUE, color: '#fff', fontSize: 14, fontWeight: 600, textAlign: 'center' }}>{z.follow}</div>
    </div>
  </div>
);

// ---------- 视频里用的两段（填 B / E 浏览器页面里的两个线框，标题与引文由场景自己画） ----------
/** 页头：知乎顶栏 + 专栏题图 + 作者行（B：900×260；E 引用跳转：1080×300） */
export const ZhihuHeader: React.FC<{ c: Content; w?: number; h?: number }> = ({ c: { zhihu: z }, w = 900, h = 260 }) => (
  <div style={{ width: w, height: h, background: '#fff', fontFamily: FONT, color: '#121212', position: 'relative', overflow: 'hidden', borderRadius: 4 }}>
    <div style={{ height: 50, display: 'flex', alignItems: 'center', gap: 26, padding: '0 24px', borderBottom: '1px solid #f0f0f0' }}>
      <div style={{ color: BLUE, fontSize: 26, fontWeight: 900 }}>{z.site}</div>
      {z.nav.map((n, i) => <div key={n} style={{ fontSize: 15, color: i === 0 ? '#121212' : '#646464', fontWeight: i === 0 ? 600 : 400 }}>{n}</div>)}
      <div style={{ marginLeft: 'auto', width: 220, height: 30, borderRadius: 999, background: '#F6F6F6', color: '#8590A6', fontSize: 13, lineHeight: '30px', paddingLeft: 14 }}>{z.search}</div>
    </div>
    {/* 专栏题图 */}
    <div style={{ position: 'absolute', left: 24, right: 24, top: 64, height: h - 64 - 70, borderRadius: 8, overflow: 'hidden', background: 'linear-gradient(120deg,#1E3A8A 0%,#2563EB 45%,#60A5FA 100%)' }}>
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.35 }}>
        {Array.from({ length: 18 }).map((_, i) => <circle key={i} cx={`${(i * 37) % 100}%`} cy={`${(i * 53) % 100}%`} r={2 + (i % 3)} fill="#fff" />)}
        {Array.from({ length: 10 }).map((_, i) => <line key={i} x1={`${(i * 37) % 100}%`} y1={`${(i * 53) % 100}%`} x2={`${((i + 3) * 37) % 100}%`} y2={`${((i + 3) * 53) % 100}%`} stroke="#fff" strokeWidth={1} />)}
      </svg>
      <div style={{ position: 'absolute', left: 24, bottom: 16, color: '#fff', fontSize: 15, fontWeight: 600, opacity: 0.9 }}>{z.column}</div>
    </div>
    <div style={{ position: 'absolute', left: 24, right: 24, bottom: 12, height: 44, display: 'flex', alignItems: 'center', gap: 12 }}>
      <XiaoheiAvatar size={38} radius={6} style={{ border: '1px solid #EBEBEB' }} />
      <div>
        <div style={{ fontSize: 15, fontWeight: 600 }}>{z.author}</div>
        <div style={{ fontSize: 12, color: '#8590A6' }}>{z.bio} · {z.date}</div>
      </div>
      <div style={{ marginLeft: 'auto', padding: '6px 16px', borderRadius: 4, background: BLUE, color: '#fff', fontSize: 14, fontWeight: 600 }}>{z.follow}</div>
    </div>
  </div>
);

/** 正文：引文之后的两段 + 底部赞同栏（B：900×320；E：1080×280） */
export const ZhihuBody: React.FC<{ c: Content; w?: number; h?: number }> = ({ c: { zhihu: z }, w = 900, h = 320 }) => (
  <div style={{ width: w, height: h, background: '#fff', fontFamily: FONT, color: '#121212', position: 'relative', overflow: 'hidden', padding: '4px 50px 0', boxSizing: 'border-box' }}>
    {[z.paras[1], z.paras[2]].map((p) => <p key={p} style={{ margin: '0 0 14px', fontSize: 17, lineHeight: 1.75 }}>{p}</p>)}
    <div style={{ position: 'absolute', left: 50, right: 50, bottom: 10, height: 44, borderTop: '1px solid #EBEBEB', display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ padding: '6px 14px', borderRadius: 4, background: '#E8F0FE', color: BLUE, fontSize: 14, fontWeight: 600 }}>▲ {z.upvote}</div>
      <div style={{ color: '#8590A6', fontSize: 14 }}>💬 {z.comments}</div>
      <div style={{ color: '#8590A6', fontSize: 14 }}>↗ {z.share}</div>
      <div style={{ color: '#8590A6', fontSize: 14 }}>★ {z.save}</div>
    </div>
  </div>
);
