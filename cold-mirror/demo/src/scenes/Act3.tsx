// 第三幕：片尾（S14–S16，0:26–0:32），竖版
// S14–S15：暗色影棚，产品镜居中，顶灯一盏盏打亮、镜框四周的灯泡依次亮起，CHANGE 在镜子上方空白处归位（不压在任何画面上）
// S16：白色收尾卡（CHANGE + Logo + Cold Mirror + 标语 + AI 提示），内容不变
import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { K, FONT, W, H, seg, fade, pop, lerp, EASE } from '../timing';
import { Mirror, Photo, Bokeh } from '../lib';

type P = { g: number };
const PAPER = 'radial-gradient(ellipse at 50% 40%,#ffffff 0%,#f3f3f3 60%,#e6e6e6 100%)';
const WORD = 'CHANGE';

// 字母：矢量粗体（不再用首页截图裁出来的图，避免带出背景）。dark = 白底上的亮黑字，否则是暗底上的银白字
const Letter: React.FC<{ ch: string; x: number; y: number; size: number; rot?: number; o?: number; dark?: boolean }> = ({ ch, x, y, size, rot = 0, o = 1, dark }) => (
  <div style={{ position: 'absolute', left: x - size * 0.4, top: y - size * 0.55, width: size * 0.8, textAlign: 'center', fontFamily: '"Arial Black","Helvetica Neue",Arial,sans-serif', fontWeight: 900,
    fontSize: size, lineHeight: 1.1, opacity: o, transform: `rotate(${rot}deg)`,
    color: dark ? '#0d0d0d' : '#f4f6f8',
    textShadow: dark ? '0 3px 0 #3a3a3a, 0 10px 18px rgba(0,0,0,.28)' : '0 0 24px rgba(200,225,255,.55), 0 4px 0 #9aa3ad, 0 12px 26px rgba(0,0,0,.6)' }}>{ch}</div>
);
const ROW = (i: number) => W / 2 + (i - 2.5) * 152;

// 影棚里的产品镜：玻璃宽 440，水平居中
const MW = 440, MB = Math.max(6, MW * 0.028), MLEFT = (W - (MW + 2 * MB)) / 2, MTOP = 600;
const GLASS_H = MW * 16 / 9, FLOOR = MTOP + GLASS_H + 2 * MB + MW * 0.33;

// 顶灯光束：从画面顶上斜打下来的梯形光柱。外层模糊让边缘发虚（clip-path 本身是硬边），往下渐隐到地面
const Beam: React.FC<{ x: number; tx: number; on: number; w0?: number; w1?: number }> = ({ x, tx, on, w0 = 50, w1 = 380 }) => (
  <div style={{ position: 'absolute', inset: 0, opacity: on, mixBlendMode: 'screen', filter: 'blur(14px)' }}>
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(255,250,240,.6) 0%,rgba(255,250,240,.18) 70%,rgba(255,250,240,0) 100%)',
      clipPath: `polygon(${x - w0 / 2}px -20px, ${x + w0 / 2}px -20px, ${tx + w1 / 2}px ${FLOOR + 60}px, ${tx - w1 / 2}px ${FLOOR + 60}px)` }} />
  </div>
);
// 灯打开：先闪两下再稳住
const lampOn = (g: number, t: number) => (g < t ? 0 : g < t + 1 ? 1 : g < t + 2 ? 0.25 : g < t + 3 ? 0.9 : 1);

const Studio: React.FC<{ g: number; letters: boolean }> = ({ g, letters }) => {
  const [l1, l2, l3] = K.lights.map((t) => lampOn(g, t));
  const lit = Math.max(l1, l2, l3) * 0.4 + (l1 + l2 + l3) * 0.2;
  const o = seg(g, K.orbit[0], K.orbit[1]);
  const ry = lerp(-12, 10, o), push = lerp(1, 1.06, o);
  const refl = 1 - seg(g, K.fadeRefl[0], K.fadeRefl[1], EASE);
  const cy = (MTOP + GLASS_H / 2) / H * 100;
  // 镜框四周 16 个灯泡（绕一圈），依次亮起
  const bulbs = Array.from({ length: 16 }, (_, i) => {
    const pad = 46, x0 = MLEFT - pad, y0 = MTOP - pad, bw = MW + 2 * MB + 2 * pad, bh = GLASS_H + 2 * MB + 2 * pad;
    const d = (i / 16) * 2 * (bw + bh);
    const [x, y] = d < bw ? [x0 + d, y0] : d < bw + bh ? [x0 + bw, y0 + d - bw] : d < 2 * bw + bh ? [x0 + bw - (d - bw - bh), y0 + bh] : [x0, y0 + bh - (d - 2 * bw - bh)];
    const step = (K.bulbs[1] - K.bulbs[0]) / 16;
    return { x, y, on: g >= K.bulbs[0] + i * step };
  });
  const sweep = (((g - K.lights[2]) / 34) % 1 + 1) % 1;
  return (
    <AbsoluteFill style={{ background: '#050506', overflow: 'hidden' }}>
      {/* 深灰无缝背景，灯亮后显出一圈光晕 */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 40% at 50% ${cy}%, rgba(120,130,150,${0.5 * lit}), transparent 70%)` }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: FLOOR, bottom: 0, background: 'linear-gradient(180deg,#141418,#08080a)' }} />
      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: `50% ${cy}%` }}>
        <Beam x={160} tx={W / 2 - 150} on={l1} />
        <Beam x={W - 160} tx={W / 2 + 150} on={l2} />
        <Beam x={W / 2} tx={W / 2} on={l3} w0={70} w1={560} />
        {/* 地面光池 */}
        <div style={{ position: 'absolute', left: W / 2 - 360, top: FLOOR - 50, width: 720, height: 150, borderRadius: '50%', background: 'radial-gradient(ellipse,rgba(255,248,235,.35),transparent 70%)', opacity: lit }} />
        {/* 地面倒影 */}
        <div style={{ position: 'absolute', left: MLEFT, top: FLOOR + 6, transform: 'scaleY(-1)', transformOrigin: '50% 0', opacity: 0.18 * lit,
          WebkitMaskImage: 'linear-gradient(0deg,#000,transparent 40%)', maskImage: 'linear-gradient(0deg,#000,transparent 40%)' }}>
          <Mirror w={MW} base={false}><AbsoluteFill style={{ background: 'linear-gradient(160deg,#fafafa,#cfd2d6 55%,#eef0f2)' }} /></Mirror>
        </div>
        {/* 灯泡 */}
        {bulbs.map((b, i) => (
          <div key={i} style={{ position: 'absolute', left: b.x - 13, top: b.y - 13, width: 26, height: 26, borderRadius: '50%',
            background: b.on ? '#fffaf0' : '#2e2e33', boxShadow: b.on ? '0 0 22px 8px rgba(255,236,200,.75), 0 0 70px 24px rgba(255,220,170,.25)' : 'none' }} />
        ))}
        {/* 产品镜，缓慢环绕 */}
        <div style={{ position: 'absolute', left: MLEFT, top: MTOP, perspective: 1800 }}>
          <div style={{ transform: `rotateY(${ry}deg)` }}>
            <Mirror w={MW} glow={0.6 * lit}>
              <AbsoluteFill style={{ background: 'linear-gradient(160deg,#5b5f66,#25272b 55%,#3d4046)' }} />
              <AbsoluteFill style={{ background: 'linear-gradient(160deg,#fafafa,#cfd2d6 55%,#eef0f2)', opacity: lit }} />
              <AbsoluteFill style={{ opacity: refl }}><Photo img="lib/韩式_优雅公主切.jpg" /></AbsoluteFill>
              {g >= K.lights[2] && <AbsoluteFill style={{ background: `linear-gradient(115deg,transparent ${sweep * 140 - 30}%,rgba(255,255,255,.8) ${sweep * 140 - 20}%,transparent ${sweep * 140 - 10}%)` }} />}
            </Mirror>
          </div>
        </div>
        <Bokeh g={g} n={14} color="#ffffff" seed={41} size={[6, 16]} drift={2} area={[60, 200, W - 60, FLOOR]} opacity={0.5 * lit} />
      </AbsoluteFill>
      {/* CHANGE：每半拍落下一个字母，排在镜子上方的空白处 */}
      {letters && WORD.split('').map((ch, i) => {
        const p = pop(g, K.letters[i], 13);
        return <Letter key={i} ch={ch} x={ROW(i)} y={lerp(-160, 300, p)} size={150} rot={lerp(i % 2 ? 18 : -18, 0, p)} o={g >= K.letters[i] ? 1 : 0} />;
      })}
    </AbsoluteFill>
  );
};

// S14 灯光亮起：三盏顶灯在拍点上依次打亮，镜框灯泡一圈亮起；镜面先映着她，然后回到普通镜面
export const S14: React.FC<P> = ({ g }) => <Studio g={g} letters={false} />;

// S15 产品展示：灯全亮，镜子缓慢环绕、扫光；CHANGE 字母依次落位
export const S15: React.FC<P> = ({ g }) => <Studio g={g} letters />;

// S16 收尾：白卡上的 CHANGE + Logo + 产品名 + 标语，底部是 App 自己的 AI 提示
export const S16: React.FC<P> = ({ g }) => {
  const logo = fade(g, K.logo, K.logo + 10), slogan = fade(g, K.slogan, K.slogan + 10), disc = fade(g, K.disclaimer, K.disclaimer + 8);
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      {WORD.split('').map((ch, i) => <Letter key={i} ch={ch} x={ROW(i)} y={720} size={150} dark />)}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22, opacity: logo, transform: `translateY(${lerp(16, 0, logo)}px)` }}>
        <Img src={staticFile('icon.png')} style={{ width: 84, height: 84 }} />
        <div style={{ fontFamily: '"Helvetica Neue",Helvetica,sans-serif', fontSize: 64, fontWeight: 600, letterSpacing: 2, color: '#111' }}>Cold Mirror</div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1040, textAlign: 'center', opacity: slogan, transform: `translateY(${lerp(14, 0, slogan)}px)` }}>
        <div style={{ fontFamily: FONT, fontSize: 52, color: '#111', letterSpacing: 10 }}>先看见，再改变</div>
        <div style={{ fontFamily: '"Helvetica Neue",Helvetica,sans-serif', fontSize: 26, color: '#666', letterSpacing: 3, marginTop: 10 }}>See it first. Then change.</div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 120, textAlign: 'center', fontFamily: FONT, fontSize: 20, color: '#8a8a8a', opacity: disc }}>
        <span style={{ color: '#C8102E' }}>*</span> 呈现为AI效果，实际请与发型师沟通
      </div>
    </AbsoluteFill>
  );
};
