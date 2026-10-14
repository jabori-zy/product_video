// 第三幕：片尾（S14–S16，0:30–0:36），竖版
// S14–S15：暗色影棚，产品镜居中，顶灯一盏盏打亮、镜框四周的灯泡依次亮起；S15 第 3 拍，镜子上方的空白处落下标语「先改变，再看见」
// S16：白色收尾卡（全片结束于此）：Logo + Cold Mirror，标语里的「改变」移到后面 →「先看见，再改变」，再加英文和 AI 提示
import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { K, FONT, W, H, seg, fade, pop, lerp, EASE } from '../timing';
import { Mirror, Photo, Bokeh } from '../lib';

type P = { g: number };
const PAPER = 'radial-gradient(ellipse at 50% 40%,#ffffff 0%,#f3f3f3 60%,#e6e6e6 100%)';
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

const Studio: React.FC<{ g: number; slogan: boolean }> = ({ g, slogan }) => {
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
      {/* 标语：「先改变，」「再看见」各一拍落下，排在镜子上方的空白处 */}
      {slogan && ['先改变，', '再看见'].map((t, i) => {
        const p = pop(g, K.slogan1[i], 13);
        return <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: 230 + i * 130, textAlign: 'center', opacity: g >= K.slogan1[i] ? 1 : 0,
          transform: `translateY(${lerp(-120, 0, p)}px) scale(${lerp(1.3, 1, p)})`, fontFamily: FONT, fontWeight: 600, fontSize: 104, letterSpacing: 16, color: '#f4f6f8',
          textShadow: '0 0 24px rgba(200,225,255,.55), 0 10px 26px rgba(0,0,0,.6)' }}>{t}</div>;
      })}
    </AbsoluteFill>
  );
};

// S14 灯光亮起：三盏顶灯在拍点上依次打亮，镜框灯泡一圈亮起；镜面先映着她，然后回到普通镜面
export const S14: React.FC<P> = ({ g }) => <Studio g={g} slogan={false} />;

// S15 产品展示：灯全亮，镜子缓慢环绕、扫光；标语「先改变，再看见」两个半句依次落下
export const S15: React.FC<P> = ({ g }) => <Studio g={g} slogan />;

// S16 收尾：白卡。先是上一镜的「先改变，再看见」，「改变」和「看见」交叉换位（一个从上面绕、一个从下面绕）→「先看见，再改变」
// 然后英文副标、底部 App 自己的 AI 提示。上方只有 Logo + Cold Mirror（不再有 CHANGE 字母）
const CH = 62;                                         // 标语每个字的宽度（字号 52 + 字距）
const LINE_X = W / 2 - (CH * 7) / 2;                   // 先 · 词(2) · ， · 再 · 词(2) 共 7 格
const slot = (k: number) => LINE_X + k * CH;            // 第 k 格的左边
const Chars: React.FC<{ text: string; x: number; y: number }> = ({ text, x, y }) => (
  <div style={{ position: 'absolute', left: x, top: y, display: 'flex' }}>
    {text.split('').map((c, i) => <div key={i} style={{ width: CH, textAlign: 'center', fontFamily: FONT, fontSize: 52, color: '#111' }}>{c}</div>)}
  </div>
);
export const S16: React.FC<P> = ({ g }) => {
  const logo = fade(g, K.logo, K.logo + 10), sub = fade(g, K.slogan, K.slogan + 10), disc = fade(g, K.disclaimer, K.disclaimer + 8);
  const sw = seg(g, K.swap[0], K.swap[1], EASE), arc = Math.sin(sw * Math.PI) * 70, y = 940;
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 780, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22, opacity: logo, transform: `translateY(${lerp(16, 0, logo)}px)` }}>
        <Img src={staticFile('icon.png')} style={{ width: 84, height: 84 }} />
        <div style={{ fontFamily: '"Helvetica Neue",Helvetica,sans-serif', fontSize: 64, fontWeight: 600, letterSpacing: 2, color: '#111' }}>Cold Mirror</div>
      </div>
      {/* 标语：固定的「先」「，」「再」，两个词换位 */}
      <Chars text="先" x={slot(0)} y={y} />
      <Chars text="，" x={slot(3)} y={y} />
      <Chars text="再" x={slot(4)} y={y} />
      <Chars text="改变" x={lerp(slot(1), slot(5), sw)} y={y - arc} />
      <Chars text="看见" x={lerp(slot(5), slot(1), sw)} y={y + arc} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: y + 84, textAlign: 'center', opacity: sub, transform: `translateY(${lerp(14, 0, sub)}px)`,
        fontFamily: '"Helvetica Neue",Helvetica,sans-serif', fontSize: 26, color: '#666', letterSpacing: 3 }}>See it first. Then change.</div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 120, textAlign: 'center', fontFamily: FONT, fontSize: 20, color: '#8a8a8a', opacity: disc }}>
        <span style={{ color: '#C8102E' }}>*</span> 呈现为AI效果，实际请与发型师沟通
      </div>
    </AbsoluteFill>
  );
};
