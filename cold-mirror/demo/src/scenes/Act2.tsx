// 第二幕：街头，每拍一张自拍，每张一个新发型（S7–S13，0:12–0:26）
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, K, LOOKS, FONT, W, H, at, seg, fade, pop, lerp, shake, EASE, OUT, IN, lastIndex } from '../timing';
import { Mirror, Photo, Phone, StreetBg, ShopBg, Bokeh, LightLine, Chip, StandIn, Note } from '../lib';
import { Stick, STAND, SEATED, pose, mix, poseAt, walk, walkFront, walkToward, joints, toScreen, Hair } from '../stick';

type P = { g: number };
const isLib = (img: string) => img.startsWith('lib/');
const libName = (img: string) => img.replace(/^lib\/[^_]+_/, '').replace('.jpg', '');

// 横向运动模糊（SVG 滤镜，只沿 x 方向）
const HBlur: React.FC<{ id: string; amount: number }> = ({ id, amount }) => (
  <svg width="0" height="0" style={{ position: 'absolute' }}><filter id={id} x="-20%" width="140%"><feGaussianBlur stdDeviation={`${amount} 0`} /></filter></svg>
);

// S7 街道手持：她（火柴人，初恋蓬松短发）朝镜头走来，举起手机 → 镜头推进到她手里的手机屏
const BLONDE: Hair = { color: '#d8c6a6', shape: 'short' };
const PHONE_UP = pose({ rSh: 150, rEl: -35, lSh: -12 });
export const S7: React.FC<P> = ({ g }) => {
  const s = at(7), sh = shake(g, 7);
  const raise = seg(g, K.raisePhone[0], K.raisePhone[1], OUT);
  const into = seg(g, K.intoPhone[0], K.intoPhone[1], IN);
  const h = lerp(1000, 1100, seg(g, s, K.intoPhone[0])), fx = 540, fy = 1760;
  const body = mix(walkFront((g - s) * 0.5), PHONE_UP, raise);
  // 手机在画面里的位置 = 她右手的位置；推进时大手机从那里放大到充满画面
  const [hx, hy] = toScreen(joints(body, 'front').R.hand, fx, fy, h);
  const pw = 300, ph = pw * 19.5 / 9;
  const s0 = (22 * h / 400) / pw, s1 = H / (ph * 0.94);
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `translate(${sh.x}px,${sh.y}px) rotate(${sh.r}deg) scale(${lerp(1, 1.5, into)})`, transformOrigin: `${hx}px ${hy}px` }}>
        <StreetBg g={g} />
        <Stick x={fx} y={fy} h={h} pose={body} view="front" hair={BLONDE} prop={into > 0 ? null : 'phone'} />
      </AbsoluteFill>
      {into > 0 && (
        <div style={{ position: 'absolute', left: lerp(hx, W / 2, into) - pw / 2, top: lerp(hy - 20, H / 2, into) - ph / 2, transform: `scale(${lerp(s0, s1, into)})` }}>
          <Phone img="her/初恋蓬松短发.jpg" w={pw} />
        </div>
      )}
      <Chip text="初恋蓬松短发" opacity={fade(g, s + 2, s + 6, K.intoPhone[0], K.intoPhone[0] + 4)} />
    </AbsoluteFill>
  );
};

// S8 手机屏 POV：快门 → 照片里变成狼尾发 → 拉出，真实的她也是狼尾发 → 公交车从前景扫过
export const S8: React.FC<P> = ({ g }) => {
  const shot = g >= K.shutter8;
  const img = shot ? 'lib/甜酷风_狼尾发.jpg' : 'her/初恋蓬松短发.jpg';
  const out = seg(g, K.pullOut[0], K.pullOut[1], EASE);
  const pw = H / (19.5 / 9) / 0.94;
  const bus = seg(g, K.bus[0], K.bus[1], (x) => x);
  const BUS = 1500, lead = lerp(0, W + BUS, bus), trail = lead - BUS;
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {/* 公交车后面露出下一镜：本镜只保留车尾右边的部分 */}
      <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${Math.max(0, trail)}px)` }}>
        <StreetBg g={g} tint={['#ffd59a', '#ff9466']} />
        {/* 拉出：真实的她（火柴人）也是狼尾发，正举着手机 */}
        <Stick x={lerp(540, 330, out)} y={1760} h={1050} pose={PHONE_UP} view="front" hair={{ color: '#151515', shape: 'wolf', streak: '#c8243a' }} prop="phone" opacity={out} />
        <div style={{ position: 'absolute', left: lerp(W / 2, 800, out) - pw / 2, top: lerp(H / 2, 760, out) - pw * 19.5 / 9 / 2, transform: `scale(${lerp(1, 0.36, out)}) rotate(${lerp(0, -6, out)}deg)` }}>
          <Phone img={img} w={pw} flash={0} />
        </div>
        {shot && <StandIn text="手机屏：库图「狼尾发」，正片为同一模特" />}
        <Note text="屏幕里是什么，现实里就是什么" opacity={fade(g, K.pullOut[1] - 4, K.pullOut[1])} />
      </AbsoluteFill>
      {/* 公交车：一条竖直的车头边缘扫过画面 */}
      {bus > 0 && bus < 1 && (
        <div style={{ position: 'absolute', left: trail, top: 520, width: BUS, height: 1400, background: 'linear-gradient(180deg,#e8e2d4 0%,#e8e2d4 52%,#c8243a 52%,#a81c30 100%)', borderRadius: '30px 60px 0 0', filter: 'url(#busblur)' }}>
          <HBlur id="busblur" amount={10} />
          {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ position: 'absolute', left: 60 + i * 235, top: 90, width: 200, height: 460, background: 'linear-gradient(160deg,#5b6b78,#1d2833)', borderRadius: 10 }} />)}
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 8, background: '#fff', boxShadow: '0 0 30px 8px rgba(255,255,255,.7)' }} />
        </div>
      )}
    </AbsoluteFill>
  );
};

// S9 斑马线侧面跟拍：火柴人（元气高马尾 · 落日橘）边走边甩马尾，跳下路沿，举手机自拍 → 快门一响，甩镜头
export const S9: React.FC<P> = ({ g }) => {
  const s = at(9), whip = seg(g, K.whip[0], K.whip[1], IN);
  const phase = (g - s) * 0.45;
  const hopT = seg(g, K.hop[0], K.hop[1]);
  const air = Math.sin(hopT * Math.PI);                     // 0 → 1 → 0
  const crouch = hopT > 0 && hopT < 1 ? Math.max(0, 1 - Math.abs(hopT - 0.5) * 4) : 0;
  const hopPose = pose({ lHip: 30, lKn: -60, rHip: -10, rKn: -40, lSh: 120, rSh: 130, lEl: 20, rEl: 20, dy: -45 * air, lean: 6 });
  let body = hopT > 0 && hopT < 1 ? mix(walk(phase), hopPose, Math.min(1, air * 1.6)) : walk(phase);
  body = { ...body, dy: hopT > 0 && hopT < 1 ? -45 * air : body.dy };
  // 自拍：右手举着手机伸到前上方
  const selfie = pose({ ...walk(phase), rSh: 140, rEl: 12, head: -6 });
  body = mix(body, selfie, seg(g, K.shutter9 - 8, K.shutter9, OUT));
  const swing = -Math.sin(phase) * 14 - air * 25 + crouch * 10;
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <HBlur id="whip9" amount={whip * 60} />
      <AbsoluteFill style={{ transform: `translateX(${-whip * 1400}px)`, filter: whip > 0.01 ? 'url(#whip9)' : undefined }}>
        <AbsoluteFill style={{ background: 'linear-gradient(180deg,#ffcf8f 0%,#f7a76c 38%,#6d6460 39%,#3f3b3a 100%)' }} />
        <Bokeh g={g} n={10} color={C.gold} seed={21} area={[0, 0, W, 700]} opacity={0.6} />
        {/* 路沿：跳下之前在脚下，跟拍时向左流走 */}
        <div style={{ position: 'absolute', left: 540 - (g - K.hop[0]) * 26 - 1400, top: 1250, width: 1400, height: 70, background: '#8d867f', borderTop: '6px solid #c9c2b8' }} />
        {/* 斑马线：跟拍时向左流动 */}
        {Array.from({ length: 14 }, (_, i) => {
          const x = ((i * 220 - (g - s) * 26) % 3080 + 3080) % 3080 - 600;
          return <div key={i} style={{ position: 'absolute', left: x, top: 1340, width: 120, height: 580, background: '#e9e6df', transform: 'skewX(-28deg)', opacity: 0.9 }} />;
        })}
        <Stick x={540} y={lerp(1270, 1720, seg(g, K.hop[0], K.hop[1], EASE))} h={860} pose={body} view="side" hair={{ color: '#e46a2e', shape: 'ponytail' }} swing={swing} prop="phone" />
      </AbsoluteFill>
      <Chip text="元气高马尾 · 落日橘" />
    </AbsoluteFill>
  );
};

// S10 咖啡馆橱窗：火柴人（法式温柔卷 · 蜂蜜茶色）坐在窗边，端起拿铁，再举手机自拍 → 玻璃门的门边扫过
const REST = pose({ ...SEATED, rSh: 75, rEl: 15 });
const DRINK = pose({ ...SEATED, rSh: 100, rEl: 90, head: -4 });
const SELFIE = pose({ ...SEATED, rSh: 150, rEl: -20, head: -6 });
// 坐姿火柴人 h = 900（脚在 FLOOR）：髋高 = FLOOR − 900 + 315 × 2.25 ≈ 1369；椅面略低于髋，桌面在手肘高度
const FLOOR = 1560, SEAT = 1340, TABLE = 1300;
export const S10: React.FC<P> = ({ g }) => {
  const s = at(10), land = seg(g, s, s + 8, OUT);
  // 端起拿铁喝一口 → 放回桌上 → 举起手机自拍
  const mid = (K.cup[0] + K.cup[1]) / 2;
  const body = poseAt(g, [[K.cup[0], REST], [mid, DRINK], [K.cup[1] - 2, DRINK], [K.selfie10[0], REST], [K.selfie10[1], SELFIE]]);
  const inHand = g >= K.selfie10[0] ? 'phone' : g >= K.cup[0] + 2 && g < K.selfie10[0] - 2 ? 'cup' : null;
  const edge = seg(g, K.doorEdge[0], K.doorEdge[1], EASE), ex = lerp(-80, W + 80, edge);
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <HBlur id="whip10" amount={(1 - land) * 50} />
      <AbsoluteFill style={{ clipPath: edge > 0 ? `inset(0 0 0 ${Math.max(0, ex)}px)` : undefined }}>
        <AbsoluteFill style={{ transform: `translateX(${(1 - land) * 600}px)`, filter: land < 0.99 ? 'url(#whip10)' : undefined }}>
          <AbsoluteFill style={{ background: 'linear-gradient(180deg,#3b2a1e,#7a5234 60%,#c98b55)' }} />
          <Bokeh g={g} n={9} seed={31} area={[0, 0, W, 900]} opacity={0.5} />
          {/* 椅子、桌子 */}
          <div style={{ position: 'absolute', left: 150, top: SEAT, width: 250, height: 16, background: '#2a1c12' }} />
          <div style={{ position: 'absolute', left: 158, top: SEAT, width: 14, height: FLOOR - SEAT, background: '#2a1c12' }} />
          <div style={{ position: 'absolute', left: 380, top: SEAT, width: 14, height: FLOOR - SEAT, background: '#2a1c12' }} />
          <Stick x={360} y={FLOOR} h={900} pose={body} view="side" hair={{ color: '#b07a3e', shape: 'long' }} prop={inHand} />
          <div style={{ position: 'absolute', left: 450, top: TABLE, width: 560, height: 18, background: '#3a271a', borderRadius: 4 }} />
          <div style={{ position: 'absolute', left: 760, top: TABLE + 18, width: 18, height: FLOOR - TABLE, background: '#3a271a' }} />
          {/* 杯子不在手里时就放在桌上 */}
          {inHand !== 'cup' && (
            <svg viewBox="0 0 100 90" style={{ position: 'absolute', left: 540, top: TABLE - 80, width: 88, height: 80 }}>
              <path d="M10 10 H80 L74 80 Q45 88 16 80 Z" fill="#f4efe6" /><path d="M80 25 Q98 28 92 48 Q88 60 76 58" stroke="#f4efe6" strokeWidth="7" fill="none" />
              <ellipse cx="45" cy="12" rx="35" ry="7" fill="#b57a4a" />
            </svg>
          )}
          {/* 窗框与滑过的反光 */}
          <div style={{ position: 'absolute', inset: 0, border: '50px solid #1b120c', boxShadow: 'inset 0 0 0 6px #3d2b1e' }} />
          <AbsoluteFill style={{ background: `linear-gradient(105deg,transparent ${20 + (g - s) * 0.8}%,rgba(255,255,255,.18) ${26 + (g - s) * 0.8}%,transparent ${34 + (g - s) * 0.8}%)` }} />
        </AbsoluteFill>
        <Chip text="法式温柔卷 · 蜂蜜茶色" />
      </AbsoluteFill>
      {edge > 0 && edge < 1 && (
        <div style={{ position: 'absolute', left: ex - 70, top: 0, width: 70, height: H, background: 'linear-gradient(90deg,#15100c,#4a3a2e 70%,#d9d2c8 92%,#fff)', boxShadow: '0 0 40px 10px rgba(255,255,255,.35)' }} />
      )}
    </AbsoluteFill>
  );
};

// 自拍定格构图（S11、S12）：竖版里手机屏 900×1600 居中；手机屏占满高度，脸始终在同一个位置；四周是所在地点的颜色
const SW = 900, ST = 150;
const Selfie: React.FC<{ img: string; bg: [string, string]; place?: string; bump: number; flash: number }> = ({ img, bg, place, bump, flash }) => {
  const w = SW;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(135deg,${bg[0]},${bg[1]})` }} />
      <AbsoluteFill style={{ opacity: 0.55, filter: 'blur(50px)', transform: 'scale(1.3)' }}><Photo img={img} /></AbsoluteFill>
      <div style={{ position: 'absolute', left: (W - w) / 2, top: ST, width: w, height: w * 16 / 9, overflow: 'hidden', transform: `scale(${1 + 0.02 * bump})`, boxShadow: '0 0 0 10px #0a0a0a, 0 30px 80px rgba(0,0,0,.5)' }}>
        <Photo img={img} focus={isLib(img) ? [50, 30] : [50, 30]} />
        <div style={{ position: 'absolute', left: '50%', bottom: 70, width: 120, height: 120, marginLeft: -60, borderRadius: '50%', border: '6px solid #fff', background: 'rgba(255,255,255,.35)' }} />
        <AbsoluteFill style={{ background: '#fff', opacity: flash }} />
      </div>
      {place && <div style={{ position: 'absolute', left: (W - SW) / 2, top: ST + SW * 16 / 9 + 30, color: '#fff', fontFamily: FONT, fontSize: 30, opacity: 0.9, textShadow: '0 2px 10px rgba(0,0,0,.4)' }}>· {place}</div>}
    </AbsoluteFill>
  );
};

// S11 ★ 自拍蒙太奇：每拍一个造型，快门就是踩镲
export const S11: React.FC<P> = ({ g }) => {
  const L = LOOKS.s11, i = Math.max(0, lastIndex(g, K.montage)), t = K.montage[i];
  const look = L[i];
  return (
    <AbsoluteFill>
      <Selfie img={look.img} bg={look.bg as [string, string]} place={look.place} bump={1 - pop(g, t)} flash={fade(g, t - 1, t, t, t + 3) * 0.85} />
      <Chip text={look.name} style={{ left: (W - SW) / 2 + 24, top: ST + 24 }} />
      {isLib(look.img) ? <StandIn text={`库图「${libName(look.img)}」`} /> : <StandIn text="原发型 + 烟铂灰（正片：海边大波浪）" />}
    </AbsoluteFill>
  );
};

// S12 ★ 从自拍切到街头，镜头在她正前方：她朝镜头走、直视镜头，每两步（一个步态周期、双脚落地的那一刻）换一个发型，绝不在迈步中途换；
// 四个发型之后，镜头慢慢拉远、再上摇、再绕到她左侧环绕，她一直在走。最后停在侧面朝左，接 S13 她从右往左走过橱窗
const VP: [number, number] = [540, 1000];                // 街道的灭点
const FEET: [number, number] = [540, 1660];              // 她脚底在画面里的位置（镜头倒退跟拍，她的位置不变）
const Avenue: React.FC<{ g: number; yaw: number }> = ({ g, yaw }) => {
  const s = at(12), t = g - s;
  const far = -260 * Math.sin(yaw), near = (z: number) => -900 * Math.sin(yaw) / z;   // 环绕时的视差：越近移得越多
  const [vx, vy] = VP;
  // 镜头往后退：路边的东西离镜头越来越远，往灭点缩
  const depth = (z0: number, span = 5.5) => 1 + ((z0 + t * 0.045) % span);
  return (
    <AbsoluteFill style={{ overflow: 'visible' }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <defs>
          <linearGradient id="sky12" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6c8fc7" /><stop offset="0.55" stopColor="#ffcf8a" /><stop offset="1" stopColor="#ff9e6e" /></linearGradient>
          <linearGradient id="wallL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#4a3424" /><stop offset="1" stopColor="#a8754e" /></linearGradient>
          <linearGradient id="wallR" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stopColor="#3e2c20" /><stop offset="1" stopColor="#9a6c48" /></linearGradient>
          <linearGradient id="road12" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7a6e66" /><stop offset="1" stopColor="#3a3634" /></linearGradient>
        </defs>
        {/* 天空：往上留得很高，上摇时露出来 */}
        <rect x={-1600 + far} y={-1600} width={4300} height={2700} fill="url(#sky12)" />
        <g transform={`translate(${far} 0)`}>
          {/* 两侧楼面，往灭点收 */}
          <polygon points={`-1600,-1500 ${vx - 170},${vy - 330} ${vx - 170},${vy} -1600,3200`} fill="url(#wallL)" />
          <polygon points={`2700,-1500 ${vx + 170},${vy - 330} ${vx + 170},${vy} 2700,3200`} fill="url(#wallR)" />
          {/* 楼面上一排排窗（透视线） */}
          {[0.15, 0.3, 0.45, 0.6, 0.75].map((k, i) => <g key={i} stroke="rgba(255,230,190,.25)" strokeWidth={6}>
            <line x1={-1600} y1={-1500 + 4700 * k} x2={vx - 170} y2={vy - 330 + 330 * k} /><line x1={2700} y1={-1500 + 4700 * k} x2={vx + 170} y2={vy - 330 + 330 * k} /></g>)}
          {/* 路面和人行道 */}
          <polygon points={`${vx - 170},${vy} ${vx + 170},${vy} 2700,3200 -1600,3200`} fill="url(#road12)" />
          <line x1={vx - 90} y1={vy} x2={-300} y2={3200} stroke="#cfc7bd" strokeWidth={10} opacity={0.6} />
          <line x1={vx + 90} y1={vy} x2={1380} y2={3200} stroke="#cfc7bd" strokeWidth={10} opacity={0.6} />
        </g>
        {/* 地砖横缝：随镜头后退往灭点流 */}
        {Array.from({ length: 7 }, (_, i) => { const z = depth(i * 0.8); const y = vy + 1000 / z; const hw = 170 + 1500 / z;
          return <line key={`p${i}`} x1={vx - hw + near(z)} y1={y} x2={vx + hw + near(z)} y2={y} stroke="rgba(255,255,255,.18)" strokeWidth={Math.max(1, 8 / z)} />; })}
        {/* 两侧路灯杆：从画面边缘出现，往灭点缩小 */}
        {Array.from({ length: 6 }, (_, i) => { const z = depth(i * 0.92), side = i % 2 ? 1 : -1; const bx = vx + side * 820 / z + near(z), by = vy + 1000 / z, hh = 1700 / z;
          return <g key={`l${i}`}><rect x={bx - 14 / z} y={by - hh} width={28 / z} height={hh} fill="#2a2420" />
            <circle cx={bx - side * 40 / z} cy={by - hh} r={36 / z} fill="#fff3d6" opacity={0.9} /></g>; })}
      </svg>
      <Bokeh g={g} n={10} color={C.gold} seed={51} area={[-200, -600, W + 200, 900]} opacity={0.5} drift={1} />
    </AbsoluteFill>
  );
};
export const S12: React.FC<P> = ({ g }) => {
  const s = at(12), L = LOOKS.s12;
  const i = Math.max(0, lastIndex(g, K.walkLooks)), t0 = K.walkLooks[i];
  const phase = 2 * Math.PI * (g - s) / 24;               // 一个周期 = 两步（每拍一步）
  const back = seg(g, K.camBack[0], K.camBack[1], EASE), tilt = seg(g, K.camTilt[0], K.camTilt[1], EASE);
  const yaw = seg(g, K.camOrbit[0], K.camOrbit[1], EASE) * 80 * Math.PI / 180;
  const sideOn = yaw > 55 * Math.PI / 180;
  const cam = lerp(1, 0.62, back);
  const enter = seg(g, s, s + 5, OUT);                     // 从自拍切过来：开头几帧带一点横向运动模糊
  const pulse = fade(g, t0, t0, t0 + 1, t0 + 3) * (i > 0 ? 1 : 0);   // 换发型那一刻（双脚落地）一道光
  const hair = L[i].hair as Hair;
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: '#6c8fc7' }}>
      <HBlur id="enter12" amount={(1 - enter) * 50} />
      <AbsoluteFill style={{ transform: `translate(${(1 - enter) * -500}px, ${420 * tilt}px) scale(${cam})`, transformOrigin: `${FEET[0]}px ${FEET[1]}px`,
        filter: enter < 0.99 ? 'url(#enter12)' : undefined }}>
        <Avenue g={g} yaw={yaw} />
        {/* 她：正面朝镜头走、直视镜头；环绕到 55° 之后换成侧面（朝左） */}
        <div style={{ position: 'absolute', inset: 0, transform: sideOn ? undefined : `scaleX(${Math.cos(yaw)})`, transformOrigin: `${FEET[0]}px 0` }}>
          <Stick x={FEET[0]} y={FEET[1]} h={1000} pose={sideOn ? walk(phase, 30) : walkToward(phase)} view={sideOn ? 'side' : 'front'} flip={sideOn} hair={hair}
            swing={sideOn ? -Math.sin(phase) * 12 : 0} />
        </div>
        {pulse > 0 && <LightLine x={FEET[0]} opacity={pulse} />}
      </AbsoluteFill>
      <Chip text={L[i].name} />
    </AbsoluteFill>
  );
};

const PRINCESS: Hair = { color: '#dccaa6', shape: 'long' };
// S13 ★ 橱窗倒影 → 回到镜前：她路过精品店橱窗，倒影对焦；灯柱的影子扫过，橱窗变成 Cold Mirror；拉开，她坐在理发椅上，剪刀合上
export const S13: React.FC<P> = ({ g }) => {
  const s = at(13);
  const pan = seg(g, K.window[0], K.window[1], OUT);
  const rack = seg(g, K.rack[0], K.rack[1], EASE);
  const lamp = seg(g, K.lamp[0], K.lamp[1], EASE), lx = lerp(-120, W + 120, lamp);
  const back = seg(g, K.pullBack[0], K.pullBack[1], EASE);
  const zoom = lerp(1.9, 1, back);
  const snip = seg(g, K.snip - 5, K.snip, IN);
  const sit = seg(g, K.sit[0], K.sit[1], EASE);
  const gw = 560, ox = (W - 591) / 2, oy = 260;
  const refl = (
    <AbsoluteFill style={{ filter: `blur(${lerp(10, 0, rack)}px)`, opacity: lerp(0.65, 1, rack) }}><Photo img="lib/韩式_优雅公主切.jpg" /></AbsoluteFill>
  );
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: '#000' }}>
      {/* 灯柱影子左边：已经是理发店里的镜子；右边：还是街上的橱窗 */}
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: `${W / 2}px ${oy + 500}px`, clipPath: `inset(0 ${Math.max(0, W - lx)}px 0 0)` }}>
        <ShopBg g={g} />
        <div style={{ position: 'absolute', left: ox, top: oy }}><Mirror w={gw}>{refl}</Mirror></div>
        {/* 她坐进理发椅（背影火柴人），理发师（火柴人）一手梳子一手剪刀，剪刀在拍点上合上 */}
        <Stick x={420} y={1760} h={700} pose={pose({ dy: 85 * sit, lSh: -20, rSh: 20, lEl: 20, rEl: -20 })} view="back" hair={PRINCESS} hideLegs={sit > 0.5} opacity={back} />
        <div style={{ position: 'absolute', left: 420 - 130, top: 1600, width: 260, height: 200, borderRadius: '24px 24px 0 0', background: '#120b07', opacity: back * sit }} />
        <Stick x={720} y={1800} h={800} pose={pose({ lSh: -70, lEl: -30, rSh: 45, rEl: 40, head: -10 })} view="front" hair={{ color: '#1e1e1e', shape: 'short' }} propL="scissors" prop="comb" open={1 - snip} opacity={back} />
      </AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${Math.max(0, lx)}px)` }}>
        <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: `${W / 2}px ${oy + 500}px` }}>
          <StreetBg g={g} tint={['#ffd59a', '#ff9e6e']} />
          {/* 橱窗玻璃：从右边摇进来，停在镜子将出现的位置 */}
          <div style={{ position: 'absolute', left: lerp(ox + 900, ox, pan) - 30, top: oy - 30, width: gw + 82, height: gw * 16 / 9 + 82, background: '#2a2622', padding: 30, boxSizing: 'border-box' }}>
            <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#c9c2b8' }}>{refl}
              <AbsoluteFill style={{ background: 'linear-gradient(120deg,rgba(255,255,255,.35),transparent 40%,rgba(255,255,255,.12))' }} />
            </div>
          </div>
        </AbsoluteFill>
        {/* 前景：真实的她（火柴人，虚焦）放下手机，从右往左走出画 */}
        <Stick x={lerp(1250, -350, seg(g, s, K.rack[1]))} y={2150} h={1500} pose={mix(pose({ ...walk((g - s) * 0.5), rSh: 140, rEl: -20 }), walk((g - s) * 0.5), seg(g, s, s + 8))} view="side" flip hair={PRINCESS} prop="phone" blur={3} />
      </AbsoluteFill>
      {lamp > 0 && lamp < 1 && <div style={{ position: 'absolute', left: lx - 50, top: 0, width: 100, height: H, background: 'linear-gradient(90deg,transparent,rgba(0,0,0,.85) 30%,rgba(0,0,0,.85) 70%,transparent)' }} />}
      <StandIn text="倒影：库图「优雅公主切」" />
    </AbsoluteFill>
  );
};
