import React from 'react';
import { FONT } from '../fonts';
import { Logo } from '../lib';

// Chrome 浏览器窗口顶部（深色主题，对照 assets/omnibox-browser-extension-demo.mp4 的真实录屏）
// 高 92：标签栏 44 + 工具栏 48；小黑插件图标固定在 (w − 60, 56)，28×28（B 段自己画会动的那个时传 logo={false}）
export const CHROME_H = 92;

const G = '#C4C7C5';
const Ic: React.FC<{ d: React.ReactNode; size?: number; color?: string }> = ({ d, size = 18, color = G }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flexShrink: 0 }}>{d}</svg>
);

/** 知乎 favicon */
const ZhihuFav: React.FC = () => (
  <div style={{ width: 16, height: 16, borderRadius: 4, background: '#1772F6', color: '#fff', fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>知</div>
);

export const BrowserChrome: React.FC<{ w: number; title: string; url: string; logo?: boolean; fav?: React.ReactNode }> = ({ w, title, url, logo = true, fav }) => {
  const EXT = ['#4285F4', '#F4B400', '#E94235'];
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: w, height: CHROME_H, fontFamily: FONT, zIndex: 2 }}>
      {/* 标签栏 */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: w, height: 44, background: '#1F1F1F' }}>
        {['#FF5F57', '#FEBC2E', '#28C840'].map((col, i) => <div key={i} style={{ position: 'absolute', left: 18 + i * 22, top: 16, width: 13, height: 13, borderRadius: '50%', background: col }} />)}
        <div style={{ position: 'absolute', left: 92, top: 8, width: 280, height: 36, borderRadius: '10px 10px 0 0', background: '#353535', display: 'flex', alignItems: 'center', gap: 9, padding: '0 12px', boxSizing: 'border-box' }}>
          {fav ?? <ZhihuFav />}
          <span style={{ flex: 1, color: '#E3E3E3', fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</span>
          <Ic size={14} d={<path d="M18 6 6 18M6 6l12 12" />} />
        </div>
        <div style={{ position: 'absolute', left: 384, top: 13 }}><Ic size={18} d={<path d="M12 5v14M5 12h14" />} /></div>
      </div>
      {/* 工具栏 */}
      <div style={{ position: 'absolute', left: 0, top: 44, width: w, height: 48, background: '#353535', borderBottom: '1px solid #1F1F1F', boxSizing: 'border-box' }}>
        <div style={{ position: 'absolute', left: 16, top: 14, display: 'flex', gap: 16 }}>
          <Ic d={<path d="M19 12H5M12 19l-7-7 7-7" />} />
          <Ic d={<path d="M5 12h14M12 5l7 7-7 7" />} color="#7A7A7A" />
          <Ic d={<><path d="M21 12a9 9 0 1 1-2.6-6.4L21 8" /><path d="M21 3v5h-5" /></>} />
        </div>
        <div style={{ position: 'absolute', left: 116, top: 8, width: w - 116 - 200, height: 32, borderRadius: 16, background: '#282828', display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', boxSizing: 'border-box' }}>
          <Ic size={16} d={<><path d="M4 8h10M18 8h2M4 16h2M10 16h10" /><circle cx="16" cy="8" r="2" /><circle cx="8" cy="16" r="2" /></>} />
          <span style={{ flex: 1, color: '#E3E3E3', fontSize: 14.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{url}</span>
          <Ic size={17} d={<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z" />} color="#8AB4F8" />
        </div>
        {/* 其他插件图标 + 小黑 + 菜单 */}
        <div style={{ position: 'absolute', left: w - 172, top: 15, display: 'flex', gap: 14 }}>
          {EXT.map((c) => <div key={c} style={{ width: 18, height: 18, borderRadius: 5, background: c, opacity: 0.9 }} />)}
        </div>
        {logo && <div style={{ position: 'absolute', left: w - 60, top: 12 }}><Logo size={28} /></div>}
        <div style={{ position: 'absolute', left: w - 26, top: 15 }}><Ic d={<><circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" /></>} /></div>
      </div>
    </div>
  );
};
