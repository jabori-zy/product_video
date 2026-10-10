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
