import React from 'react';

// 第三方页面用的线性图标（24 网格，描边随 color），替代 emoji，渲染结果不受系统字体影响
type P = { size?: number; color?: string; fill?: boolean; style?: React.CSSProperties };

const Ico: React.FC<P & { children: React.ReactNode; vb?: string; sw?: number }> = ({ size = 16, color = 'currentColor', style, children, vb = '0 0 24 24', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox={vb} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flexShrink: 0, ...style }}>
    {children}
  </svg>
);

export const ISearch: React.FC<P> = (p) => <Ico {...p} sw={2.2}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></Ico>;
export const IPlus: React.FC<P> = (p) => <Ico {...p} sw={2.4}><path d="M12 5v14M5 12h14" /></Ico>;
export const IBell: React.FC<P> = (p) => <Ico {...p}><path d="M6 17V11a6 6 0 0 1 12 0v6l1.5 2h-15z" fill={p.fill ? p.color : 'none'} /><path d="M10 21h4" /></Ico>;
export const IChat: React.FC<P> = (p) => <Ico {...p}><path d="M4 5h16v11H9l-5 4z" fill={p.fill ? p.color : 'none'} /></Ico>;
export const IBubble: React.FC<P> = (p) => <Ico {...p}><path d="M21 11.5a8.5 8 0 0 1-12.6 7L3 20l1.6-4.6A8.5 8 0 1 1 21 11.5z" fill={p.fill ? p.color : 'none'} /></Ico>;
export const IShare: React.FC<P> = (p) => <Ico {...p}><path d="M21 3L10 14" /><path d="M21 3l-7 18-4-7-7-4z" /></Ico>;
export const IStar: React.FC<P> = (p) => <Ico {...p}><path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z" fill={p.fill ? p.color : 'none'} /></Ico>;
export const IHeart: React.FC<P> = (p) => <Ico {...p}><path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z" fill={p.fill ? p.color : 'none'} /></Ico>;
export const ITriUp: React.FC<P> = ({ size = 10, color = 'currentColor', style }) => <svg width={size} height={size} viewBox="0 0 10 10" style={{ display: 'block', ...style }}><path d="M5 1.5l4 6.5H1z" fill={color} /></svg>;
export const ITriDown: React.FC<P> = ({ size = 10, color = 'currentColor', style }) => <svg width={size} height={size} viewBox="0 0 10 10" style={{ display: 'block', ...style }}><path d="M5 8.5L1 2h8z" fill={color} /></svg>;
export const IFire: React.FC<P> = ({ size = 18, color = '#FF4D4F', style }) => <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block', ...style }}><path d="M12 2c1 4 5 5.5 5 11a5 5 0 0 1-10 0c0-2.5 1.2-3.8 2.2-5 .3 2 1.3 2.8 2.3 3C11 8.5 11 5 12 2z" fill={color} /></svg>;
export const IRefresh: React.FC<P> = (p) => <Ico {...p}><path d="M20 12a8 8 0 1 1-2.4-5.7" /><path d="M20 4v5h-5" /></Ico>;
export const IPlay: React.FC<P> = (p) => <Ico {...p}><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M10 9.5v5l4-2.5z" fill={p.color} /></Ico>;
export const IDanmaku: React.FC<P> = (p) => <Ico {...p}><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M7 10h6M7 14h10" /></Ico>;
export const IPlayFill: React.FC<P> = ({ size = 16, color = '#fff', style }) => <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block', ...style }}><path d="M7 4.5v15l12-7.5z" fill={color} /></svg>;
export const IThumb: React.FC<P> = (p) => <Ico {...p}><path d="M7 10v10H4V10z" fill={p.color} /><path d="M7 10l4-7c1.6 0 2.5 1 2.2 2.6L12.6 9H19a2 2 0 0 1 2 2.3l-1.2 6.8A2.2 2.2 0 0 1 17.6 20H7" fill={p.color} /></Ico>;
export const ICoin: React.FC<P> = ({ size = 16, color = 'currentColor', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block', ...style }}>
    <circle cx="12" cy="12" r="9.5" fill={color} />
    <text x="12" y="16.5" textAnchor="middle" fontSize="13" fontWeight={800} fill="#fff" fontFamily="Arial">币</text>
  </svg>
);
export const IForward: React.FC<P> = (p) => <Ico {...p}><path d="M13 4l8 7-8 7v-4C8 14 5 15.5 3 19c0-6 3.5-10 10-10.5z" fill={p.color} /></Ico>;
export const IReply: React.FC<P> = (p) => <Ico {...p} sw={1.6}><path d="M8.5 5h7a6 6 0 0 1 0 12H13l-4.5 3.5V17A6 6 0 0 1 8.5 5z" /></Ico>;
export const IRepost: React.FC<P> = (p) => <Ico {...p} sw={1.6}><path d="M5 9V7.5A2.5 2.5 0 0 1 7.5 5H17" /><path d="M14 2l3 3-3 3" /><path d="M19 15v1.5a2.5 2.5 0 0 1-2.5 2.5H7" /><path d="M10 22l-3-3 3-3" /></Ico>;
export const IViews: React.FC<P> = (p) => <Ico {...p} sw={1.6}><path d="M5 20V12M10 20V5M15 20v-6M20 20V9" /></Ico>;
export const IBookmark: React.FC<P> = (p) => <Ico {...p} sw={1.6}><path d="M6 3.5h12v17l-6-4.2-6 4.2z" /></Ico>;
export const IUpload: React.FC<P> = (p) => <Ico {...p} sw={1.6}><path d="M12 15V4M7.5 8.5L12 4l4.5 4.5" /><path d="M4 15v4.5h16V15" /></Ico>;
export const IMore: React.FC<P> = ({ size = 18, color = 'currentColor', style }) => <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block', ...style }}>{[5, 12, 19].map((x) => <circle key={x} cx={x} cy={12} r={1.8} fill={color} />)}</svg>;
export const IHome: React.FC<P> = (p) => <Ico {...p}><path d="M3.5 10.5L12 4l8.5 6.5V20H15v-6H9v6H3.5z" fill={p.fill ? p.color : 'none'} /></Ico>;
export const IClose: React.FC<P> = (p) => <Ico {...p} sw={2}><path d="M6 6l12 12M18 6L6 18" /></Ico>;
export const IBack: React.FC<P> = (p) => <Ico {...p} sw={2}><path d="M20 12H5M11 5l-7 7 7 7" /></Ico>;
export const IVideo: React.FC<P> = (p) => <Ico {...p}><circle cx="12" cy="12" r="9" /><path d="M10 8.5v7l5.5-3.5z" /></Ico>;
export const IHistory: React.FC<P> = (p) => <Ico {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Ico>;
export const IGear: React.FC<P> = (p) => <Ico {...p}><circle cx="12" cy="12" r="3" /><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" /></Ico>;

/** X 的蓝色认证徽章 */
export const IVerified: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block', flexShrink: 0 }}>
    <path d="M12 1.8l2.5 1.9 3.1-.3 1 3 2.6 1.7-.9 3 .9 3-2.6 1.7-1 3-3.1-.3L12 22.2l-2.5-1.9-3.1.3-1-3-2.6-1.7.9-3-.9-3 2.6-1.7 1-3 3.1.3z" fill="#1D9BF0" />
    <path d="M7.8 12.2l2.8 2.8 5.6-5.8" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** X 标志（几何重绘） */
export const XLogo: React.FC<{ size?: number; color?: string }> = ({ size = 28, color = '#E7E9EA' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
    <path d="M3 3h5.2l12.8 18h-5.2z" fill={color} />
    <path d="M19.5 3h1.8l-7.4 8.4-1-1.3zM4.5 21H2.7l7.6-8.6 1 1.3z" fill={color} />
  </svg>
);

/** 知乎直答的 D 形标志 */
export const IZhida: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#5A4DF8' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
    <path d="M4 4h8.5a8 8 0 0 1 0 16H4l2.5-4H12a4 4 0 0 0 0-8H6.5z" fill={color} />
  </svg>
);

/** 人物头像（第三方作者）：纯色底 + 简笔人像，避免用真人照片 */
export const PersonAvatar: React.FC<{ size: number; bg: string; fg?: string; radius?: number | string; style?: React.CSSProperties }> = ({ size, bg, fg = '#fff', radius = '50%', style }) => (
  <div style={{ width: size, height: size, borderRadius: radius, overflow: 'hidden', background: bg, flexShrink: 0, ...style }}>
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ display: 'block' }}>
      <circle cx="20" cy="16" r="7.5" fill={fg} opacity={0.92} />
      <path d="M6 40c1.5-9 7-13.5 14-13.5S32.5 31 34 40z" fill={fg} opacity={0.92} />
    </svg>
  </div>
);
