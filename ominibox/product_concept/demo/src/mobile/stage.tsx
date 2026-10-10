import React from 'react';
import { AbsoluteFill } from 'remotion';
import { FONT } from '../fonts';
import { H, W } from '../lib';
import { Main } from '../Main';
import { PH, PW, PhoneShell } from './ui';

// 插段的舞台：深色桌面 + 笔记本（屏幕里定格原片）+ 手机。世界坐标 1920×1080，镜头 {x,y,s}
export const LAP = { x: 700, y: 470, w: 1100 }; // 笔记本屏幕中心与宽度
export const LK = LAP.w / W; // 屏幕缩放
export const LAP_H = LAP.w * (H / W);
/** 让笔记本屏幕正好铺满画面的镜头（插段首尾帧 = 原片帧） */
export const CAM_FULL = { x: LAP.x, y: LAP.y, s: 1 / LK };
export const CAM_WIDE = { x: 960, y: 560, s: 1 };

/** 笔记本屏幕内 1920×1080 坐标 → 世界坐标 */
export const screenToWorld = (sx: number, sy: number) => ({ x: LAP.x - LAP.w / 2 + sx * LK, y: LAP.y - LAP_H / 2 + sy * LK });

export const PHONE = { x: 1590, y: 560, k: 0.8 }; // 手机中心与缩放
/** 手机屏幕内坐标 → 世界坐标 */
export const phoneToWorld = (px: number, py: number, ph = PHONE) => ({ x: ph.x + (px - PW / 2) * ph.k, y: ph.y + (py - PH / 2) * ph.k });

export const Stage: React.FC<{ cam: { x: number; y: number; s: number }; children: React.ReactNode }> = ({ cam, children }) => (
  <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 40%, #232327 0%, #121214 55%, #070708 100%)', overflow: 'hidden', fontFamily: FONT }}>
    <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: '0 0', transform: `translate(${W / 2}px,${H / 2}px) scale(${cam.s}) translate(${-cam.x}px,${-cam.y}px)` }}>
      {/* 桌面反光 */}
      <div style={{ position: 'absolute', left: -1000, top: 790, width: 3920, height: 900, background: 'linear-gradient(#1b1b1e, #0c0c0d)' }} />
      {children}
    </div>
  </AbsoluteFill>
);

/** 笔记本：屏幕显示原片定格帧 at（不带草稿标注），children 叠在屏幕坐标里 */
export const Laptop: React.FC<{ at: number; children?: React.ReactNode; glow?: number; blur?: number }> = ({ at, children, glow = 0, blur = 0 }) => {
  const pad = 16;
  const left = LAP.x - LAP.w / 2, top = LAP.y - LAP_H / 2;
  return (
    <div style={{ position: 'absolute', inset: 0, filter: blur > 0.2 ? `blur(${blur}px)` : undefined }}>
      <div style={{ position: 'absolute', left: left - pad, top: top - pad, width: LAP.w + pad * 2, height: LAP_H + pad * 2 + 6, borderRadius: 22, background: '#0b0b0c', boxShadow: `0 0 0 2px #3a3a3e, 0 40px 100px rgba(0,0,0,.55)${glow ? `, 0 0 ${60 * glow}px rgba(74,142,249,${0.5 * glow})` : ''}` }} />
      <div style={{ position: 'absolute', left, top, width: LAP.w, height: LAP_H, overflow: 'hidden', background: '#000' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, transform: `scale(${LK})`, transformOrigin: '0 0' }}>
          <Main at={at} label={false} />
          {children}
        </div>
      </div>
      {/* 底座 */}
      <div style={{ position: 'absolute', left: left - 90, top: top + LAP_H + pad + 6, width: LAP.w + 180, height: 22, borderRadius: '0 0 18px 18px', background: 'linear-gradient(#9a9aa0, #5d5d63)' }} />
      <div style={{ position: 'absolute', left: LAP.x - 90, top: top + LAP_H + pad + 6, width: 180, height: 8, borderRadius: '0 0 8px 8px', background: '#4a4a50' }} />
    </div>
  );
};

/** 手机（世界坐标中心 x,y，缩放 k） */
export const Phone: React.FC<{ x: number; y: number; k: number; rot?: number; o?: number; children: React.ReactNode }> = ({ x, y, k, rot = 0, o = 1, children }) => (
  <div style={{ position: 'absolute', left: x - (PW + 24) / 2, top: y - (PH + 24) / 2, transform: `scale(${k}) rotate(${rot}deg)`, transformOrigin: '50% 50%', opacity: o }}>
    <PhoneShell>{children}</PhoneShell>
  </div>
);
