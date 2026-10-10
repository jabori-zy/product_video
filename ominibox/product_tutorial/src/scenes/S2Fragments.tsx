// S2 万物 · 记录（2–6 s）：信息碎片按鼓点从四面飞来（前四个每拍，后五个每半拍），镜头缓慢前推
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { noise2D } from '@remotion/noise';
import { C, K, START, seg, arrive, EASE, lerp } from '../timing';
import { FONT } from '../fonts';
import { Glass, Tag, Lines, GradientField, Grain, Dust, Vignette } from '../components/visual';

const Wave: React.FC<{ n?: number; color?: string; h?: number; frame?: number }> = ({ n = 26, color = C.amber, h = 40, frame = 0 }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: h }}>
    {Array.from({ length: n }, (_, i) => <i key={i} style={{ width: 5, borderRadius: 3, background: color, height: 6 + Math.abs(Math.sin(i * 1.3 + frame * 0.2) * (h - 8) * (0.4 + 0.6 * Math.abs(Math.sin(i * 0.37))) ) }} />)}
  </div>
);
const Thumb: React.FC<{ a: string; b: string; h?: number; children?: React.ReactNode }> = ({ a, b, h = 120, children }) => (
  <div style={{ height: h, borderRadius: 12, background: `linear-gradient(135deg, ${a}, ${b})`, position: 'relative', overflow: 'hidden' }}>{children}</div>
);
const Play = () => <div style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, transform: 'translate(-40%,-50%)', borderLeft: '26px solid rgba(255,255,255,.92)', borderTop: '16px solid transparent', borderBottom: '16px solid transparent' }} />;
const T = (p: React.CSSProperties = {}) => ({ fontSize: 19, fontWeight: 700, lineHeight: 1.35, margin: '12px 0 10px', ...p });

// 碎片：id、标签（只用平台名）、落点、景深、到达帧
type Frag = { id: string; label?: string; x: number; y: number; z: number; at: number; w?: number; body: (f: number) => React.ReactNode };
export const FRAGS: Frag[] = [
  { id: 'wx', label: '微信', x: 560, y: 250, z: 0.95, at: K.items[0], body: () => <>
    <Tag label="微信" color="#22C55E" /><div style={{ marginTop: 14, alignSelf: 'flex-end', background: '#22C55E', color: '#06220F', borderRadius: 14, padding: '10px 14px', fontSize: 18, fontWeight: 600, display: 'inline-block' }}>会议纪要发你了</div>
    <div style={{ marginTop: 10, display: 'flex', gap: 10, alignItems: 'center', background: 'rgba(255,255,255,.12)', borderRadius: 12, padding: '8px 12px', fontSize: 15 }}><b style={{ background: '#2E7CF6', borderRadius: 6, padding: '2px 6px', fontSize: 12 }}>DOC</b>周会纪要.docx</div></> },
  { id: 'web', label: '网页', x: 1380, y: 300, z: 1, at: K.items[1], body: () => <>
    <Tag label="网页" color="#60A5FA" /><div style={T()}>如何搭建你的第二大脑</div><Lines n={3} /></> },
  { id: 'memo', label: '随手记', x: 930, y: 520, z: 1, at: K.items[2], body: (f) => <>
    <Tag label="随手记" color={C.amber} /><div style={{ marginTop: 14 }}><Wave frame={f} /></div><div style={{ marginTop: 8, fontSize: 15, opacity: 0.8 }}>录音 · 00:42</div></> },
  { id: 'rss', label: 'RSS', x: 1650, y: 870, z: 0.72, at: K.items[3], body: () => <>
    <Tag label="RSS" color="#FB923C" /><div style={T()}>产品周报 · 3 篇新文章</div><Lines n={2} /></> },
  { id: 'x', label: 'X', x: 300, y: 500, z: 0.8, at: K.items[4], body: () => <>
    <Tag label="X" color="#E5E7EB" /><div style={{ ...T({ fontSize: 16 }), opacity: 0.75 }}>@someone · 刚刚</div><Lines n={3} w={[100, 94, 58]} /></> },
  { id: 'yt', label: 'YouTube', x: 1160, y: 800, z: 0.88, at: K.items[5], w: 340, body: () => <>
    <Tag label="YouTube" color="#FF5A5A" /><div style={{ marginTop: 12 }}><Thumb a="#3B1D5E" b="#E0413A"><Play /><div style={{ position: 'absolute', left: 0, bottom: 0, height: 5, width: '62%', background: '#FF5A5A' }} /></Thumb></div></> },
  { id: 'zh', label: '知乎', x: 1690, y: 200, z: 0.66, at: K.items[6], body: () => <>
    <Tag label="知乎" color="#3B8BFF" /><div style={T()}>如何高效管理个人知识？</div><div style={{ fontSize: 14, opacity: 0.75 }}>▲ 赞同 2.4k</div></> },
  { id: 'bili', label: 'bilibili', x: 990, y: 190, z: 0.82, at: K.items[7], w: 330, body: (f) => <>
    <Tag label="bilibili" color="#FB7299" /><div style={{ marginTop: 12 }}><Thumb a="#1E3A8A" b="#FB7299" h={110}>
      {['前方高能', '学到了', '收藏了'].map((s, i) => <span key={i} style={{ position: 'absolute', top: 12 + i * 30, left: `${((110 - ((f * (1.4 + i * 0.3) + i * 40) % 140)))}%`, fontSize: 15, fontWeight: 700, whiteSpace: 'nowrap', textShadow: '0 1px 3px rgba(0,0,0,.6)' }}>{s}</span>)}<Play /></Thumb></div></> },
  { id: 'rd', label: 'Reddit', x: 1440, y: 560, z: 0.9, at: K.items[8], body: () => <>
    <Tag label="Reddit" color="#FF6A2B" /><div style={{ ...T({ fontSize: 15 }), opacity: 0.75, margin: '12px 0 4px' }}>r/productivity</div><div style={T({ margin: '0 0 8px' })}>What's your PKM setup?</div><div style={{ fontSize: 14, opacity: 0.8 }}>▲ 1.2k · 💬 348</div></> },
];
// 不带标签的背景碎片（远景，开场就在）
const EXTRA: Frag[] = [
  { id: 'pdf', x: 230, y: 190, z: 0.5, at: 40, body: () => <><Tag label="PDF" color="#F87171" /><div style={{ marginTop: 12 }}><Lines n={5} /></div></> },
  { id: 'img', x: 1800, y: 470, z: 0.48, at: 40, body: () => <Thumb a="#0EA5E9" b="#F59E0B" h={130}><div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'linear-gradient(160deg, transparent 40%, rgba(10,20,40,.7) 41%)' }} /></Thumb> },
];
export const LABELS = FRAGS.map((f) => f.label!);

export const S2Fragments: React.FC = () => {
  const g = useCurrentFrame() + START[1];
  const dolly = 1 + 0.1 * seg(g, START[1], 189, EASE);
  const title = seg(g, 62, 74, EASE);
  const card = (f: Frag, i: number, extra = false) => {
    const k = extra ? seg(g, 30, 70, EASE) : arrive(g, f.at, 12);
    const s = 0.62 + 0.4 * f.z, w = (f.w || 320);
    const dx = f.x - 960, dy = f.y - 540, L = Math.hypot(dx, dy) || 1;
    const sx = f.x + (dx / L) * 1500, sy = f.y + (dy / L) * 1100;
    const drift = [noise2D(f.id, g * 0.012, 0) * 16, noise2D(f.id + 'y', 0, g * 0.012) * 12];
    const pos = (kk: number) => [lerp(sx, f.x, kk) + drift[0], lerp(sy, f.y, kk) + drift[1]];
    const rot = (1 - k) * (i % 2 ? 18 : -18) + noise2D(f.id + 'r', g * 0.01, 1) * 3;
    const blur = (1 - f.z) * 6;
    const landed = g >= f.at && g < f.at + 6 ? 1 - (g - f.at) / 6 : 0;   // 落位时的一下高光
    const el = (kk: number, op: number, key: string) => {
      const [x, y] = pos(kk);
      return (
        <div key={key} style={{ position: 'absolute', left: x - (w * s) / 2, top: y - 80 * s, transform: `scale(${s}) rotate(${rot}deg)`, transformOrigin: '0 0', opacity: op, filter: blur > 0.5 ? `blur(${blur}px)` : undefined, zIndex: Math.round(f.z * 10) }}>
          <Glass w={w} style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column' }} glow={landed ? `rgba(120,180,255,${0.6 * landed})` : undefined}>{f.body(g)}</Glass>
        </div>
      );
    };
    if (!extra && g < f.at - 12) return null;
    const out = [el(k, extra ? 0.55 * k : 1, f.id)];
    if (!extra && k < 0.97) { out.unshift(el(Math.max(0, k - 0.12), 0.22, f.id + 'g1')); out.unshift(el(Math.max(0, k - 0.24), 0.1, f.id + 'g2')); }   // 运动残影
    return out;
  };
  return (
    <AbsoluteFill style={{ fontFamily: FONT, overflow: 'hidden' }}>
      <GradientField frame={g} base={C.night} seed="s2" blobs={[{ c: 'rgba(46,59,255,.55)', x: 25, y: 30, r: 900 }, { c: 'rgba(139,92,246,.5)', x: 78, y: 70, r: 1000 }, { c: 'rgba(34,211,238,.28)', x: 60, y: 20, r: 700 }, { c: 'rgba(46,124,246,.35)', x: 15, y: 85, r: 700 }]} />
      <Dust frame={g} seed="s2d" n={110} opacity={0.5} drift={0.4} />
      <AbsoluteFill style={{ transform: `scale(${dolly})` }}>
        {EXTRA.map((f, i) => card(f, i, true))}
        {FRAGS.map((f, i) => card(f, i))}
      </AbsoluteFill>
      {/* 大字「万物」+ 九个来源标签（按到达帧点亮） */}
      <div style={{ position: 'absolute', left: 120, top: 690, color: '#fff', opacity: title, transform: `translateY(${(1 - title) * 30}px)` }}>
        <div style={{ fontSize: 168, fontWeight: 900, lineHeight: 1, letterSpacing: '0.02em', background: `linear-gradient(100deg, ${C.cream} 30%, #9CC3FF 70%)`, WebkitBackgroundClip: 'text', color: 'transparent' }}>万物</div>
        {[FRAGS.slice(0, 4), FRAGS.slice(4)].map((row, r) => (
          <div key={r} style={{ display: 'flex', gap: 10, marginTop: r ? 10 : 22 }}>
            {row.map((f) => { const on = seg(g, f.at, f.at + 4); return (
              <span key={f.id} style={{ fontSize: 24, fontWeight: 700, padding: '6px 16px', borderRadius: 999, color: on > 0.5 ? C.ink : 'rgba(255,255,255,.45)', background: `rgba(251,243,228,${0.08 + 0.92 * on})`, border: '1px solid rgba(255,255,255,.2)', transform: `scale(${1 + 0.15 * Math.sin(on * Math.PI)})` }}>{f.label}</span>); })}
          </div>
        ))}
      </div>
      <Vignette strength={0.45} />
      <Grain frame={g} opacity={0.07} />
    </AbsoluteFill>
  );
};
