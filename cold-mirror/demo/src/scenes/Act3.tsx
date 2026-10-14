// 第三幕：片尾（S14–S16，0:26–0:32）。白色影棚，沿用首页的视觉：亮黑字母 N C G H A E + 理发工具，字母归位拼成 CHANGE
import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { K, FONT, at, seg, fade, pop, lerp, EASE } from '../timing';
import { Mirror, Photo } from '../lib';

type P = { g: number };
const PAPER = 'radial-gradient(ellipse at 50% 40%,#ffffff 0%,#f3f3f3 60%,#e6e6e6 100%)';

// 首页截图里裁出的元素（tools/assets.py 已把白底转成透明）。w = 显示宽度，r = 额外旋转（抵消截图里字母本身的倾斜）
const Piece: React.FC<{ name: string; x: number; y: number; w: number; r?: number; o?: number }> = ({ name, x, y, w, r = 0, o = 1 }) => (
  <Img src={staticFile(`home/${name}.png`)} style={{ position: 'absolute', left: x - w / 2, top: y, width: w, transform: `translateY(-50%) rotate(${r}deg)`, opacity: o }} />
);

// 字母：截图里的散落位置（映射到 16:9）→ 排成一行。fix = 摆正时额外转的角度
const LET = [
  { n: 'C', from: [700, 330], w: 150, fix: 0 },
  { n: 'H', from: [1250, 640], w: 200, fix: 38 },
  { n: 'A', from: [520, 760], w: 190, fix: 6 },
  { n: 'N', from: [430, 250], w: 220, fix: -26 },
  { n: 'G', from: [1500, 300], w: 210, fix: -10 },
  { n: 'E', from: [1420, 900], w: 230, fix: -14 },
];
const ROW_Y = 470, ROW_W = 190; // 一行里每个字母的间距

// S14 影棚环绕：镜面先映着她，然后回到普通的镜面
export const S14: React.FC<P> = ({ g }) => {
  const s = at(14), o = seg(g, K.orbit[0], K.orbit[1]);
  const ry = lerp(-16, 12, o);
  const refl = 1 - seg(g, K.fadeRefl[0], K.fadeRefl[1], EASE);
  return (
    <AbsoluteFill style={{ background: PAPER, opacity: fade(g, s, s + 4) }}>
      <div style={{ position: 'absolute', left: 960 - 210, top: 900, width: 420, height: 60, borderRadius: '50%', background: 'radial-gradient(ellipse,rgba(0,0,0,.25),transparent 70%)' }} />
      <div style={{ position: 'absolute', left: 960 - 152, top: 70, perspective: 1600 }}>
        <div style={{ transform: `rotateY(${ry}deg)`, transformStyle: 'preserve-3d' }}>
          <Mirror w={290}>
            <AbsoluteFill style={{ background: 'linear-gradient(160deg,#fafafa,#cfd2d6 55%,#eef0f2)' }} />
            <AbsoluteFill style={{ opacity: refl }}><Photo img="lib/韩式_优雅公主切.jpg" /></AbsoluteFill>
            <AbsoluteFill style={{ background: `linear-gradient(105deg,transparent ${o * 80}%,rgba(255,255,255,.7) ${o * 80 + 8}%,transparent ${o * 80 + 16}%)` }} />
          </Mirror>
        </div>
      </div>
      <Piece name="scissors" x={lerp(470, 430, o)} y={300} w={300} />
      <Piece name="dryer" x={lerp(1450, 1490, o)} y={560} w={130} />
      <Piece name="comb" x={lerp(560, 530, o)} y={720} w={140} />
      <Piece name="clipper" x={lerp(1360, 1400, o)} y={880} w={260} />
      {LET.map((l, i) => <Piece key={l.n} name={l.n} x={l.from[0] + (l.from[0] < 960 ? -1 : 1) * lerp(80, 120, o)} y={l.from[1]} w={l.w * 0.8} o={0.95} />)}
    </AbsoluteFill>
  );
};

// S15 俯拍：字母每半拍归位一个，拼成 CHANGE
const Letters: React.FC<{ g: number; lift?: number }> = ({ g, lift = 0 }) => (
  <>
    {LET.map((l, i) => {
      const p = pop(g, K.letters[i], 14);
      const tx = 960 + (i - 2.5) * ROW_W, ty = ROW_Y - lift;
      const sc = lerp(1, 0.8, lift / 120);
      return <Piece key={l.n} name={l.n} x={lerp(l.from[0], tx, p)} y={lerp(l.from[1], ty, p)} w={lerp(l.w, 170 * sc, p)} r={lerp(0, l.fix, p)} />;
    })}
  </>
);
export const S15: React.FC<P> = ({ g }) => (
  <AbsoluteFill style={{ background: PAPER }}>
    <Piece name="scissors" x={360} y={180} w={300} o={1 - seg(g, K.letters[5], K.letters[5] + 12)} />
    <Piece name="dryer" x={1700} y={560} w={130} o={1 - seg(g, K.letters[5], K.letters[5] + 12)} />
    <Piece name="comb" x={1040} y={820} w={140} o={1 - seg(g, K.letters[5], K.letters[5] + 12)} />
    <Piece name="clipper" x={820} y={960} w={260} o={1 - seg(g, K.letters[5], K.letters[5] + 12)} />
    <Letters g={g} />
  </AbsoluteFill>
);

// S16 收尾：字母上移，Logo + 产品名 + 标语，底部是 App 自己的 AI 提示
export const S16: React.FC<P> = ({ g }) => {
  const s = at(16), lift = lerp(0, 120, seg(g, s, s + 12, EASE));
  const logo = fade(g, K.logo, K.logo + 10), slogan = fade(g, K.slogan, K.slogan + 10), disc = fade(g, K.disclaimer, K.disclaimer + 8);
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <Letters g={g} lift={lift} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22, opacity: logo, transform: `translateY(${lerp(16, 0, logo)}px)` }}>
        <Img src={staticFile('icon.png')} style={{ width: 84, height: 84 }} />
        <div style={{ fontFamily: '"Helvetica Neue",Helvetica,sans-serif', fontSize: 64, fontWeight: 600, letterSpacing: 2, color: '#111' }}>Cold Mirror</div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 690, textAlign: 'center', opacity: slogan, transform: `translateY(${lerp(14, 0, slogan)}px)` }}>
        <div style={{ fontFamily: FONT, fontSize: 52, color: '#111', letterSpacing: 10 }}>先看见，再改变</div>
        <div style={{ fontFamily: '"Helvetica Neue",Helvetica,sans-serif', fontSize: 26, color: '#666', letterSpacing: 3, marginTop: 10 }}>See it first. Then change.</div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 44, textAlign: 'center', fontFamily: FONT, fontSize: 20, color: '#8a8a8a', opacity: disc }}>
        <span style={{ color: '#C8102E' }}>*</span> 呈现为AI效果，实际请与发型师沟通
      </div>
    </AbsoluteFill>
  );
};
