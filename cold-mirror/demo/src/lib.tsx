// 共用画面：产品（镜子 + 底座）、扫光换发、App 里真实存在的名称标签、场景背景、预览标注
import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { C, FONT, clamp, lerp } from './timing';

const src = (p: string) => staticFile(p);

// 「她」的图。her/*.jpg 与 model.JPG 同构图（1180×1752，双眼中心约在 50%, 34.5%）；lib/*.jpg 是发型库原图（768×1024）
// focus = 画面里要对准的点（图内百分比），默认对准脸
export const Photo: React.FC<{ img: string; style?: React.CSSProperties; focus?: [number, number] }> = ({ img, style, focus }) => {
  const f = focus ?? (img.startsWith('lib/') ? [50, 36] : [50, 36]);
  return <Img src={src(img)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${f[0]}% ${f[1]}%`, display: 'block', ...style }} />;
};

// 产品的签名动作：一条竖直的光线从左扫到右，线左边是新发型（来自 App「换发色成功」页的对比线）
export const LightLine: React.FC<{ x: number | string; opacity?: number; height?: string }> = ({ x, opacity = 1, height = '100%' }) => (
  <div style={{ position: 'absolute', top: 0, left: x, height, width: 0, opacity, pointerEvents: 'none' }}>
    <div style={{ position: 'absolute', left: -60, width: 120, top: 0, bottom: 0, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent)' }} />
    <div style={{ position: 'absolute', left: -3, width: 6, top: 0, bottom: 0, background: '#fff', boxShadow: '0 0 18px 6px rgba(255,255,255,.9), 0 0 60px 18px rgba(200,225,255,.45)' }} />
  </div>
);

export const Sweep: React.FC<{ from: string; to: string; p: number; focus?: [number, number] }> = ({ from, to, p, focus }) => {
  const q = clamp(p);
  return (
    <AbsoluteFill>
      <AbsoluteFill><Photo img={from} focus={focus} /></AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `inset(0 ${100 - q * 100}% 0 0)` }}><Photo img={to} focus={focus} /></AbsoluteFill>
      {q > 0 && q < 1 && <LightLine x={`${q * 100}%`} />}
    </AbsoluteFill>
  );
};

// App 里照片左上角的名称标签（换发色成功 / 换发型成功页）
export const Chip: React.FC<{ text: string; scale?: number; opacity?: number; style?: React.CSSProperties }> = ({ text, scale = 1, opacity = 1, style }) => (
  <div style={{ position: 'absolute', left: 44, top: 78, padding: `${8 * scale}px ${20 * scale}px`, borderRadius: 999, background: 'rgba(40,40,40,.55)', color: '#fff',
    fontFamily: FONT, fontSize: 30 * scale, letterSpacing: 1, opacity, backdropFilter: 'blur(6px)', ...style }}>{text}</div>
);

// 镜子本体：竖版 9:16 玻璃 + 金属边框 + 底座。w = 玻璃宽度（px），位置由外层决定
export const Mirror: React.FC<{ w: number; children?: React.ReactNode; base?: boolean; glow?: number }> = ({ w, children, base = true, glow = 0 }) => {
  const h = w * 16 / 9, b = Math.max(6, w * 0.028), r = w * 0.06;
  return (
    <div style={{ position: 'relative', width: w + 2 * b, height: h + 2 * b + (base ? w * 0.42 : 0) }}>
      {base && (<>
        <div style={{ position: 'absolute', left: '50%', top: h + 2 * b - 4, width: w * 0.12, height: w * 0.3, marginLeft: -w * 0.06, background: C.metal }} />
        <div style={{ position: 'absolute', left: '50%', top: h + 2 * b + w * 0.26, width: w * 0.9, height: w * 0.14, marginLeft: -w * 0.45, borderRadius: '50%',
          background: 'radial-gradient(ellipse at 50% 30%,#c9ced4,#5b6066 60%,#26282b)', boxShadow: '0 18px 40px rgba(0,0,0,.45)' }} />
      </>)}
      <div style={{ position: 'absolute', left: 0, top: 0, width: w + 2 * b, height: h + 2 * b, borderRadius: r + b, background: C.metal,
        boxShadow: `0 30px 80px rgba(0,0,0,.5), 0 0 ${120 * glow}px ${30 * glow}px rgba(190,220,255,${0.35 * glow})` }}>
        <div style={{ position: 'absolute', left: b, top: b, width: w, height: h, borderRadius: r, overflow: 'hidden', background: '#1b1c1f' }}>
          {children}
          {/* 玻璃反光 */}
          <AbsoluteFill style={{ background: 'linear-gradient(125deg,rgba(255,255,255,.16) 0%,rgba(255,255,255,0) 32%,rgba(255,255,255,0) 70%,rgba(255,255,255,.08) 100%)', pointerEvents: 'none' }} />
        </div>
      </div>
    </div>
  );
};

// 暖色虚焦灯珠
export const Bokeh: React.FC<{ g: number; n?: number; color?: string; seed?: number; size?: [number, number]; drift?: number; area?: [number, number, number, number]; opacity?: number }> =
  ({ g, n = 10, color = C.amber, seed = 1, size = [60, 180], drift = 0.3, area = [0, 0, 1920, 1080], opacity = 0.55 }) => (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {Array.from({ length: n }, (_, i) => {
        const r = (k: number) => { const x = Math.sin((i + 1) * 12.9898 * (k + seed) + seed * 78.233) * 43758.5453; return x - Math.floor(x); };
        const s = lerp(size[0], size[1], r(1));
        const x = area[0] + r(2) * (area[2] - area[0]) + Math.sin(g * 0.02 * drift * (1 + r(4)) + i) * 30;
        const y = area[1] + r(3) * (area[3] - area[1]) + Math.cos(g * 0.015 * drift + i) * 20;
        return <div key={i} style={{ position: 'absolute', left: x - s / 2, top: y - s / 2, width: s, height: s, borderRadius: '50%',
          background: `radial-gradient(circle, ${color} 0%, ${color}88 35%, transparent 70%)`, opacity: opacity * (0.5 + 0.5 * r(5)), mixBlendMode: 'screen' }} />;
      })}
    </AbsoluteFill>
  );

// 理发店：暖钨丝灯、深影
export const ShopBg: React.FC<{ g: number; door?: boolean }> = ({ g, door = true }) => (
  <AbsoluteFill style={{ background: 'linear-gradient(180deg,#1d130c 0%,#3a2516 55%,#1a110a 56%,#0d0906 100%)' }}>
    {/* 墙上一排灯泡 */}
    {Array.from({ length: 7 }, (_, i) => (
      <div key={i} style={{ position: 'absolute', left: 150 + i * 270, top: 90, width: 26, height: 26, borderRadius: '50%', background: '#fff3d6',
        boxShadow: '0 0 30px 12px rgba(255,190,110,.65), 0 0 120px 50px rgba(255,160,80,.25)' }} />
    ))}
    {/* 两侧理发椅剪影 */}
    {[220, 1560].map((x, i) => (
      <svg key={i} viewBox="0 0 200 260" style={{ position: 'absolute', left: x, top: 470, width: 230, height: 300, opacity: 0.85 }}>
        <rect x="40" y="0" width="120" height="120" rx="20" fill="#120b07" />
        <rect x="25" y="110" width="150" height="40" rx="14" fill="#120b07" />
        <rect x="92" y="150" width="16" height="70" fill="#120b07" />
        <ellipse cx="100" cy="235" rx="70" ry="14" fill="#120b07" />
      </svg>
    ))}
    {door && (
      <div style={{ position: 'absolute', left: 1330, top: 250, width: 190, height: 340, border: '10px solid #140c07', background: 'linear-gradient(180deg,#e9c895,#b08050)', opacity: 0.55 }}>
        <div style={{ position: 'absolute', top: -58, left: -10, width: 210, height: 40, background: '#140c07', color: '#e9d2a8', fontFamily: 'Didot,Georgia,serif', fontSize: 26, letterSpacing: 6, textAlign: 'center', lineHeight: '40px' }}>BARBER</div>
      </div>
    )}
    <Bokeh g={g} n={8} seed={3} area={[0, 60, 1920, 600]} opacity={0.35} />
  </AbsoluteFill>
);

// 街道：黄金时刻。画出来的天、虚化的树和路面（不用照片，人物由火柴人表现）
export const StreetBg: React.FC<{ g: number; tint?: [string, string] }> = ({ g, tint = ['#ffcf8a', '#ff8f5a'] }) => (
  <AbsoluteFill style={{ overflow: 'hidden', background: `linear-gradient(180deg,${tint[0]} 0%,${tint[1]} 48%,#8a7a70 62%,#5d5652 63%,#3e3a38 100%)` }}>
    {/* 虚化的行道树 */}
    {[[-60, 120, 520], [380, 60, 420], [1260, 90, 480], [1700, 40, 560]].map(([x, y, s], i) => (
      <div key={i} style={{ position: 'absolute', left: x, top: y, width: s, height: s * 0.9, borderRadius: '50%', background: 'radial-gradient(circle at 45% 40%,#6f7a3a,#3a4220 70%)', filter: 'blur(38px)', opacity: 0.75 }} />
    ))}
    {/* 人行道边线 */}
    <div style={{ position: 'absolute', left: 0, right: 0, top: 672, height: 10, background: '#cfc7bd', opacity: 0.7, filter: 'blur(2px)' }} />
    <Bokeh g={g} n={12} color={C.gold} seed={7} area={[0, 0, 1920, 520]} size={[50, 160]} opacity={0.6} drift={1} />
  </AbsoluteFill>
);

// 手机自拍预览（普通相机，不是产品 UI）
export const Phone: React.FC<{ img: string; w: number; flash?: number; children?: React.ReactNode }> = ({ img, w, flash = 0, children }) => {
  const h = w * 19.5 / 9, r = w * 0.13;
  return (
    <div style={{ position: 'relative', width: w, height: h, borderRadius: r, background: '#0a0a0a', padding: w * 0.03, boxShadow: '0 30px 70px rgba(0,0,0,.45)' }}>
      <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: r * 0.8, overflow: 'hidden' }}>
        <Photo img={img} />
        {children}
        <div style={{ position: 'absolute', left: '50%', bottom: h * 0.05, width: w * 0.2, height: w * 0.2, marginLeft: -w * 0.1, borderRadius: '50%', border: `${w * 0.012}px solid #fff`, background: 'rgba(255,255,255,.35)' }} />
        <AbsoluteFill style={{ background: '#fff', opacity: flash }} />
      </div>
    </div>
  );
};

// ── 预览标注（正片里没有） ──
// 发型库原图是别的模特：标出来，正片由 Higgsfield 换成同一个她
export const StandIn: React.FC<{ text: string; style?: React.CSSProperties }> = ({ text, style }) => (
  <div style={{ position: 'absolute', right: 36, top: 92, padding: '6px 14px', border: '2px dashed #FFE14D', color: '#FFE14D', background: 'rgba(0,0,0,.55)',
    fontFamily: FONT, fontSize: 22, borderRadius: 6, ...style }}>STAND-IN · {text}</div>
);
// 静图表现不了的动作，用一行字说明
export const Note: React.FC<{ text: string; opacity?: number }> = ({ text, opacity = 1 }) => (
  <div style={{ position: 'absolute', left: 0, right: 0, bottom: 64, textAlign: 'center', opacity }}>
    <span style={{ padding: '8px 18px', background: 'rgba(0,0,0,.55)', color: '#FFE14D', fontFamily: FONT, fontSize: 26, borderRadius: 6 }}>{text}</span>
  </div>
);
