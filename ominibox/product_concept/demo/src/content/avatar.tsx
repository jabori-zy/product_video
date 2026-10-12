import React from 'react';
import { CatShapes } from '../lib';

// 小黑头像：与 result/xiaohei.svg 相同（白底、原图坐标 544 48 448 448 取景），矢量绘制
export const XiaoheiAvatar: React.FC<{ size: number; radius?: number | string; style?: React.CSSProperties }> = ({ size, radius = '50%', style }) => (
  <div style={{ width: size, height: size, borderRadius: radius, overflow: 'hidden', background: '#fff', flexShrink: 0, ...style }}>
    <svg width={size} height={size} viewBox="544 48 448 448" style={{ display: 'block' }}>
      <CatShapes />
    </svg>
  </div>
);
