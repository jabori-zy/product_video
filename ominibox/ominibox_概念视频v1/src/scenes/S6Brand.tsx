// S6 收束 · 品牌（16–20 s）：drop 时光点从四周汇聚成小黑轮廓 → logo 睁眼 → 品牌名、口号、行动按拍出现
import React from 'react';
import { AbsoluteFill, useCurrentFrame, random, spring } from 'remotion';
import { getLength, getPointAtLength, evolvePath } from '@remotion/paths';
import { C, K, START, FPS, seg, EASE, pop, lerp } from '../timing';
import { FONT } from '../fonts';
import { XH_PATH, XiaoheiLogo, GradientField, Grain } from '../components/visual';

const LOGO = { w: 230, x: 960, top: 150 };
const S = LOGO.w / 104, LX = LOGO.x - LOGO.w / 2, LEN = getLength(XH_PATH);
const toScreen = (p: { x: number; y: number }) => ({ x: LX + (p.x + 2) * S, y: LOGO.top + (p.y + 2) * S });
const NP = 170;
const PTS = Array.from({ length: NP }, (_, i) => {
  const onEye = i >= 130, e = onEye ? (i % 2 ? { x: 67, y: 52 } : { x: 33, y: 52 }) : null;
  const a = random(`ea${i}`) * Math.PI * 2;
  const target = e ? toScreen({ x: e.x + Math.cos(a) * 13, y: e.y + Math.sin(a) * 13 }) : toScreen(getPointAtLength(XH_PATH, (i / 130) * LEN));
  const ang = random(`pa${i}`) * Math.PI * 2, R = 900 + random(`pr${i}`) * 700;
  return { target, from: { x: 960 + Math.cos(ang) * R, y: 540 + Math.sin(ang) * R * 0.7 }, delay: random(`pd${i}`) * 10, r: 2 + random(`ps${i}`) * 3, eye: onEye };
});

// 扫光文字：出现时一道高光从左扫到右
const Shine: React.FC<{ g: number; at: number; children: React.ReactNode; style?: React.CSSProperties; color?: string }> = ({ g, at, children, style, color = C.ink }) => {
  // 实色文字 + 一层蓝色副本透过移动的遮罩显出高光（逐帧改渐变的 background-clip:text 在连续渲染时会糊成色块，所以不用）
  const k = seg(g, at, at + 10, EASE), sw = seg(g, at + 2, at + 18) * 140 - 30;
  const mask = `linear-gradient(100deg, transparent ${sw - 12}%, #000 ${sw}%, transparent ${sw + 12}%)`;
  return (
    <div style={{ opacity: k, transform: `translateY(${(1 - k) * 22}px) scale(${0.96 + 0.04 * k})`, ...style }}>
      <span style={{ position: 'relative', display: 'inline-block', color }}>
        {children}
        {sw > -18 && sw < 112 && <span style={{ position: 'absolute', inset: 0, color: '#6EA8FF', WebkitMaskImage: mask, maskImage: mask, whiteSpace: 'nowrap' }}>{children}</span>}
      </span>
    </div>
  );
};

export const S6Brand: React.FC = () => {
  const g = useCurrentFrame() + START[5];
  const light = seg(g, K.drop - 2, K.drop + 6, EASE);                  // 光漏最亮时切到奶油白
  const stroke = seg(g, 486, 502, EASE), fill = seg(g, 498, 508, EASE);
  const open = spring({ frame: g - 504, fps: FPS, config: { damping: 12, stiffness: 140 } });
  const push = 1 + 0.04 * seg(g, 540, 600);
  const slogan = ['随时随地', '万物变成记忆', '记忆变成万物'];
  return (
    <AbsoluteFill style={{ fontFamily: FONT, overflow: 'hidden', background: C.void }}>
      <GradientField frame={g} base={C.cream} seed="s6" opacity={light} blobs={[{ c: 'rgba(46,124,246,.16)', x: 18, y: 25, r: 900 }, { c: 'rgba(139,92,246,.14)', x: 85, y: 80, r: 900 }, { c: 'rgba(245,197,66,.2)', x: 75, y: 12, r: 700 }]} />
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        {/* 光点汇聚 */}
        <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0 }}>
          {PTS.map((p, i) => {
            const k = spring({ frame: g - K.drop - p.delay, fps: FPS, config: { damping: 16, stiffness: 90 } });
            const fade = 1 - seg(g, 500, 512);
            if (fade <= 0) return null;
            const x = lerp(p.from.x, p.target.x, k), y = lerp(p.from.y, p.target.y, k);
            return <circle key={i} cx={x} cy={y} r={p.r * (1.6 - 0.6 * k)} fill={p.eye ? C.cream : light > 0.5 ? C.blue : '#9CC3FF'} opacity={0.9 * fade} />;
          })}
        </svg>
        {/* logo：描边 → 填充 → 睁眼 */}
        <div style={{ position: 'absolute', left: LX, top: LOGO.top }}>
          {stroke > 0 && <XiaoheiLogo w={LOGO.w} open={fill > 0 ? open : 0} fillOp={fill} strokeDash={fill < 1 ? evolvePath(stroke, XH_PATH) : undefined} look={[0, 0.2]} />}
        </div>
        <Shine g={g} at={K.logo} style={{ position: 'absolute', top: 390, width: '100%', textAlign: 'center', fontSize: 112, fontWeight: 900, letterSpacing: '0.01em' }}>小黑 <span style={{ fontWeight: 700 }}>OmniBox</span></Shine>
        <Shine g={g} at={K.tagline} color="#4A4A55" style={{ position: 'absolute', top: 540, width: '100%', textAlign: 'center', fontSize: 38, fontWeight: 500, letterSpacing: '0.12em' }}>你的 AI 知识伙伴</Shine>
        <div style={{ position: 'absolute', top: 650, width: '100%', display: 'flex', justifyContent: 'center', gap: 44 }}>
          {slogan.map((s, i) => <Shine key={s} g={g} at={K.slogan[i]} color={C.ink} style={{ fontSize: 60, fontWeight: 800, letterSpacing: '0.08em' }}>{s}</Shine>)}
        </div>
        <div style={{ position: 'absolute', top: 810, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 26, opacity: seg(g, K.cta, K.cta + 8), transform: `scale(${0.85 + 0.15 * pop(g, K.cta)})` }}>
          <span style={{ fontSize: 34, fontWeight: 800, color: C.cream, background: C.ink, borderRadius: 18, padding: '14px 40px' }}>免费开始</span>
          <span style={{ fontSize: 34, fontWeight: 600, color: '#3A3A44', letterSpacing: '0.02em' }}>omnibox.pro</span>
        </div>
      </AbsoluteFill>
      <Grain frame={g} opacity={0.05 + 0.03 * (1 - light)} />
    </AbsoluteFill>
  );
};
