import React from 'react';
import { AbsoluteFill } from 'remotion';
import { FONT } from '../fonts';
import { H, Logo, W } from '../lib';
import { BrowserChrome, CHROME_H } from '../content/browser';
import { useTr } from '../i18n';
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

// 笔记本屏幕里的「整个浏览器」：macOS 桌面（菜单栏）+ Chrome 窗口，网页区按 16:9 放 OmniBox 网页（1920×1080 坐标整体缩放）
const MENU_H = 30;
// 整个窗口（标签栏 + 工具栏 + 网页）一起缩放：网页 1920×1080，顶栏按 1920 宽排版，缩放后放进菜单栏下方
const PAGE_S = (H - MENU_H - 22 - 18) / (H + CHROME_H); // 窗口缩放
const WIN_X = Math.round((W - W * PAGE_S) / 2);
const PAGE_Y1 = MENU_H + 22 + CHROME_H * PAGE_S; // 网页区最终的 y
/** 网页区在笔记本屏幕（1920×1080）里的位置；bp = 浏览器进度，0 时就是原片满屏（顶栏在屏幕上沿之外） */
const pageRect = (bp: number) => ({ x: WIN_X * bp, y: PAGE_Y1 * bp, s: 1 + (PAGE_S - 1) * bp });
/** 网页内坐标（1920×1080）→ 世界坐标，随浏览器进度 bp 变化 */
export const pageToWorld = (px: number, py: number, bp = 1) => { const r = pageRect(bp); return screenToWorld(r.x + px * r.s, r.y + py * r.s); };

/** 笔记本：屏幕显示原片定格帧 at（不带草稿标注）。
 *  browser 0→1：定格帧缩进 Chrome 窗口的网页区，桌面和浏览器框淡入（插段首尾 browser = 0，与原片逐帧衔接）。
 *  page：代替定格帧显示的网页（M1 用：同一个镜头下与定格帧逐帧一致，再拉远成完整网页）；children 叠在网页坐标里 */
export const Laptop: React.FC<{ at: number; children?: React.ReactNode; glow?: number; blur?: number; browser?: number; page?: React.ReactNode; title?: string }> = ({ at, children, glow = 0, blur = 0, browser = 0, page, title }) => {
  const pad = 16;
  const left = LAP.x - LAP.w / 2, top = LAP.y - LAP_H / 2;
  const r = pageRect(browser);
  const tr = useTr();
  return (
    <div style={{ position: 'absolute', inset: 0, filter: blur > 0.2 ? `blur(${blur}px)` : undefined }}>
      <div style={{ position: 'absolute', left: left - pad, top: top - pad, width: LAP.w + pad * 2, height: LAP_H + pad * 2 + 6, borderRadius: 22, background: '#0b0b0c', boxShadow: `0 0 0 2px #3a3a3e, 0 40px 100px rgba(0,0,0,.55)${glow ? `, 0 0 ${60 * glow}px rgba(74,142,249,${0.5 * glow})` : ''}` }} />
      <div style={{ position: 'absolute', left, top, width: LAP.w, height: LAP_H, overflow: 'hidden', background: '#000' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, transform: `scale(${LK})`, transformOrigin: '0 0' }}>
          {browser > 0 && (
            <div style={{ position: 'absolute', inset: 0, opacity: Math.min(1, browser * 2) }}>
              {/* 桌面 + 菜单栏 */}
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 20% 0%, #3B4A8C 0%, #1E2350 45%, #0E0F22 100%)' }} />
              <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: MENU_H, background: 'rgba(20,20,28,.55)', display: 'flex', alignItems: 'center', gap: 26, padding: '0 22px', color: '#eee', fontSize: 15, boxSizing: 'border-box' }}>
                <b>Chrome</b>{tr(['文件', '编辑', '显示', '历史记录', '书签', '窗口', '帮助'], ['File', 'Edit', 'View', 'History', 'Bookmarks', 'Window', 'Help']).map((m) => <span key={m}>{m}</span>)}
                <span style={{ marginLeft: 'auto' }}>{tr('10月14日 周二 21:08', 'Tue Oct 14  9:08 PM')}</span>
              </div>
            </div>
          )}
          {/* Chrome 窗口：顶栏贴在网页上沿、和网页一起缩放——拉远时顶栏从屏幕上沿外滑进来，像镜头连续后退 */}
          {browser > 0 && (
            <div style={{ position: 'absolute', left: r.x, top: r.y - CHROME_H * r.s, width: W * r.s, height: (H + CHROME_H) * r.s, borderRadius: 12 * browser, boxShadow: `0 30px 90px rgba(0,0,0,${0.6 * browser}), 0 0 0 1px rgba(255,255,255,${0.08 * browser})` }}>
              <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: CHROME_H, transform: `scale(${r.s})`, transformOrigin: '0 0', borderRadius: `${12 / r.s * browser}px ${12 / r.s * browser}px 0 0`, overflow: 'hidden' }}>
                <BrowserChrome w={W} title={title ?? tr('小黑 OmniBox', 'Xiaohei OmniBox')} url="omnibox.pro/xiaohei" fav={<Logo size={16} style={{ borderRadius: 4 }} />} />
              </div>
            </div>
          )}
          {/* 网页区：原片定格帧（及插段叠层）随 browser 缩进窗口 */}
          <div style={{ position: 'absolute', left: r.x, top: r.y, width: W, height: H, transform: `scale(${r.s})`, transformOrigin: '0 0', overflow: 'hidden', borderRadius: browser > 0 ? `0 0 ${12 * browser / r.s}px ${12 * browser / r.s}px` : undefined }}>
            {page ?? <Main at={at} label={false} />}
            {children}
          </div>
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
