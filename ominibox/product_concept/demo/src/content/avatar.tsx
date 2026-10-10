import React from 'react';
import { Img, staticFile } from 'remotion';

// 小黑头像：从六视图 assets/xiaohei-character.jpg（1536×1024）裁出 FRONT 正面
const SHEET = { w: 1536, h: 1024 };
const CROP = { x: 537, y: 40, size: 460 };
const LABEL_Y = 455; // 头像下方的 FRONT 文字：用白底盖住

export const XiaoheiAvatar: React.FC<{ size: number; radius?: number | string; style?: React.CSSProperties }> = ({ size, radius = '50%', style }) => {
  const k = size / CROP.size;
  return (
    <div style={{ width: size, height: size, borderRadius: radius, overflow: 'hidden', position: 'relative', background: '#fff', flexShrink: 0, ...style }}>
      <Img src={staticFile('xiaohei-character.jpg')} style={{ position: 'absolute', left: -CROP.x * k, top: -CROP.y * k, width: SHEET.w * k, height: SHEET.h * k, maxWidth: 'none' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: (LABEL_Y - CROP.y) * k, bottom: 0, background: '#fff' }} />
    </div>
  );
};
