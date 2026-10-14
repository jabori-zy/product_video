// 第一幕：理发店里的镜子（S1–S6，0:00–0:12）
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, K, LOOKS, SWEEP, GRID, FONT, at, seg, fade, pop, lerp, clamp, EASE, OUT, IN, lastIndex } from '../timing';
import { Mirror, Photo, Sweep, Chip, Bokeh, ShopBg, LightLine, Note } from '../lib';
import { Img, staticFile } from 'remotion';

type P = { g: number };

// S1 镜面边缘微距：一道光沿斜边划下，落到底座
export const S1: React.FC<P> = ({ g }) => {
  const slide = lerp(0, -140, seg(g, 0, 48, EASE));
  const y = lerp(-320, 760, seg(g, K.edgeLight[0], K.edgeLight[1], EASE));
  const baseHit = fade(g, 36, 40, 44, 48);
  return (
    <AbsoluteFill style={{ background: '#050505', opacity: fade(g, 0, 4) }}>
      <div style={{ position: 'absolute', inset: 0, transform: `translateX(${slide}px)` }}>
        {/* 玻璃：映出虚焦的理发店灯 */}
        <div style={{ position: 'absolute', left: -200, top: 0, width: 1360, height: 960, background: 'linear-gradient(90deg,#0c0a09,#1b1612 70%,#262019)', overflow: 'hidden' }}>
          <Bokeh g={g} n={9} seed={11} area={[200, 80, 1300, 860]} size={[90, 260]} opacity={0.45} />
        </div>
        {/* 斜边 */}
        <div style={{ position: 'absolute', left: 1160, top: 0, width: 150, height: 960, background: C.metal, boxShadow: 'inset 6px 0 10px rgba(0,0,0,.6)', filter: 'brightness(.7)' }}>
        </div>
        <div style={{ position: 'absolute', left: 1310, top: 0, width: 900, height: 960, background: 'linear-gradient(90deg,#0b0908,#050505)' }} />
        <div style={{ position: 'absolute', left: 1195, width: 60, top: y, height: 340, borderRadius: 30, background: 'linear-gradient(180deg,transparent,#fff 50%,transparent)', boxShadow: '0 0 60px 24px rgba(255,255,255,.8), 0 0 160px 60px rgba(200,225,255,.35)' }} />
        {/* 底座 */}
        <div style={{ position: 'absolute', left: 700, top: 930, width: 1300, height: 220, borderRadius: '50%', background: 'radial-gradient(ellipse at 50% 20%,#d5dae0,#5b6066 55%,#1d1f22)' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(ellipse at 40% 15%,rgba(255,255,255,.95),transparent 45%)', opacity: baseHit }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 她的背影剪影（棕色长卷发、白色吊带），全景里用
const Back: React.FC<{ hair?: string; h: number }> = ({ hair = '#5a3626', h }) => (
  <svg viewBox="0 0 200 520" style={{ width: h * 200 / 520, height: h, display: 'block' }}>
    <path d="M30 520 L40 300 Q100 270 160 300 L170 520 Z" fill="#e9e4dc" />
    <path d="M58 300 Q100 285 142 300 L146 330 Q100 320 54 330 Z" fill="#d9c6b8" />
    <path d="M100 40 C40 40 30 110 40 170 C46 220 30 280 22 360 C60 380 140 380 178 360 C170 280 154 220 160 170 C170 110 160 40 100 40 Z" fill={hair} />
    <path d="M70 70 C80 140 74 250 60 350 M130 70 C122 150 128 250 140 350 M100 50 C102 150 96 260 100 370" stroke="rgba(255,255,255,.12)" strokeWidth="5" fill="none" />
  </svg>
);

// S2 理发店全景：她从左边走进来，停在镜子前
export const S2: React.FC<P> = ({ g }) => {
  const p = seg(g, K.walkIn[0], K.walkIn[1], OUT);
  const x = lerp(-420, 640, p), bob = Math.abs(Math.sin(g * 0.55)) * 10 * (1 - p);
  const refl = seg(g, K.walkIn[0] + 14, K.walkIn[1] + 2);
  return (
    <AbsoluteFill>
      <ShopBg g={g} />
      <div style={{ position: 'absolute', left: 1050 - 165, top: 170 }}>
        <Mirror w={330}>
          <AbsoluteFill style={{ background: 'linear-gradient(180deg,#3a2718,#1a110a)' }} />
          <AbsoluteFill style={{ opacity: refl, transform: `translateX(${lerp(-120, 0, refl)}px)` }}><Photo img="her/原色.jpg" /></AbsoluteFill>
        </Mirror>
      </div>
      <div style={{ position: 'absolute', left: x, top: 420 - bob, filter: 'brightness(.75)' }}><Back h={660} /></div>
      <Note text="她撩了一下耳边的头发，有点犹豫" opacity={fade(g, 82, 86)} />
    </AbsoluteFill>
  );
};

// 发色库卡片（App 里「发色库」页的卡片：背影图 + 白底名称）
const Card: React.FC<{ name: string; w: number; on?: number }> = ({ name, w, on = 0 }) => (
  <div style={{ width: w, borderRadius: w * 0.05, overflow: 'hidden', background: '#fff', boxShadow: on ? `0 0 0 ${4 * on}px ${C.red}, 0 0 30px rgba(200,16,46,${0.6 * on})` : '0 4px 14px rgba(0,0,0,.25)' }}>
    <Img src={staticFile(`swatch/${name}.jpg`)} style={{ width: w, height: w * 1.2, objectFit: 'cover', display: 'block' }} />
    <div style={{ height: w * 0.2, lineHeight: `${w * 0.2}px`, textAlign: 'center', fontFamily: FONT, fontSize: w * 0.12, color: '#222' }}>{name}</div>
  </div>
);

// S3 过肩：镜面亮起发色库，她点中「奶茶粉紫」
export const S3: React.FC<P> = ({ g }) => {
  const s = at(3), ui = seg(g, K.grid[0], K.grid[1], OUT), push = lerp(1, 1.05, seg(g, s, s + 48));
  const finger = seg(g, K.tap - 14, K.tap, OUT), press = pop(g, K.tap);
  const ripple = seg(g, K.tap, K.tap + 12);
  const gw = 560;   // 玻璃宽
  const cw = 104;   // 卡片宽
  return (
    <AbsoluteFill style={{ background: '#140d08', transform: `scale(${push})` }}>
      <ShopBg g={g} door={false} />
      <div style={{ position: 'absolute', left: 640, top: 40 }}>
        <Mirror w={gw} base={false} glow={ui}>
          <AbsoluteFill style={{ filter: `brightness(${lerp(1, 0.8, ui)})` }}><Photo img="her/原色.jpg" focus={[56, 30]} /></AbsoluteFill>
          {/* 发色库从玻璃后面亮起来：标题、分类、卡片网格（都是 App 里真有的） */}
          <AbsoluteFill style={{ opacity: ui, transform: `translateY(${lerp(30, 0, ui)}px)` }}>
            <div style={{ position: 'absolute', right: 24, top: 30, width: cw * 2 + 14, color: '#fff', fontFamily: FONT }}>
              <div style={{ fontSize: 34, fontWeight: 600, textShadow: '0 2px 10px rgba(0,0,0,.6)' }}>发色库</div>
              <div style={{ fontSize: 15, opacity: 0.85, margin: '6px 0 12px', whiteSpace: 'nowrap' }}><span style={{ color: '#ff5a6e', borderBottom: '2px solid #ff5a6e' }}>全部</span>　中性灰阶系　流光金系</div>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(2, ${cw}px)`, gap: 14 }}>
                {GRID.slice(0, 8).map((n) => <Card key={n} name={n} w={cw} on={n === '奶茶粉紫' ? press : 0} />)}
              </div>
            </div>
          </AbsoluteFill>
        </Mirror>
      </div>
      {/* 指尖（前景虚焦）与触摸涟漪：「奶茶粉紫」是第一张卡 */}
      <div style={{ position: 'absolute', left: lerp(1180, 1054, finger), top: lerp(700, 178, finger), width: 90, height: 120, borderRadius: '45% 45% 40% 40%',
        background: 'radial-gradient(circle at 40% 30%,#f2c7ae,#c98e72)', filter: 'blur(5px)', opacity: finger * (1 - seg(g, K.tap + 8, K.tap + 16)) }} />
      <div style={{ position: 'absolute', left: 1078 - 60 * ripple, top: 230 - 60 * ripple, width: 120 * ripple, height: 120 * ripple, borderRadius: '50%', border: '3px solid #fff', opacity: 1 - ripple }} />
      {/* 她的后脑勺：前景、虚焦 */}
      <div style={{ position: 'absolute', left: 1240, top: 250, width: 820, height: 1000, borderRadius: '48% 48% 20% 20%', background: 'radial-gradient(ellipse at 45% 35%,#6b4330,#2a170e 70%)', filter: 'blur(26px)' }} />
    </AbsoluteFill>
  );
};

// 镜中特写的构图：脸占满画面（玻璃边刚好出画）
const CU: React.FC<{ children: React.ReactNode; zoom?: number; rot?: number }> = ({ children, zoom = 1, rot = 0 }) => (
  <AbsoluteFill style={{ overflow: 'hidden', background: '#000' }}>
    <div style={{ position: 'absolute', left: 0, top: -760, width: 1920, height: 2851, transform: `scale(${zoom}) rotate(${rot}deg)`, transformOrigin: '50% 34%' }}>{children}</div>
    {/* 玻璃质感：一层冷色反光 + 暗角 */}
    <AbsoluteFill style={{ background: 'linear-gradient(115deg,rgba(255,255,255,.07),transparent 40%)', pointerEvents: 'none' }} />
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 45%,transparent 55%,rgba(0,0,0,.55))', pointerEvents: 'none' }} />
  </AbsoluteFill>
);

// S4 镜中特写：光线扫过，镜中的她变成奶茶粉紫；真实的她还是棕发
export const S4: React.FC<P> = ({ g }) => {
  const p = seg(g, K.sweep4, K.sweep4 + 12, EASE);
  return (
    <AbsoluteFill>
      <CU zoom={lerp(1, 1.04, seg(g, at(4), at(5)))}><Sweep from="her/原色.jpg" to="her/奶茶粉紫.jpg" p={p} /></CU>
      <Chip text="奶茶粉紫" opacity={fade(g, K.sweep4 + 10, K.sweep4 + 14)} />
      <Note text="她低头看自己真实的头发——还是棕色；再抬头，笑了" opacity={fade(g, K.glance[0], K.glance[0] + 4)} />
    </AbsoluteFill>
  );
};

// S5 同一个特写：每拍一换，最后一拍换发型
export const S5: React.FC<P> = ({ g }) => {
  const L = LOOKS.s5, T = K.sweeps5;
  const i = lastIndex(g, T);
  const prev = i <= 0 ? 'her/奶茶粉紫.jpg' : L[i - 1].img;
  const cur = i < 0 ? 'her/奶茶粉紫.jpg' : L[i].img;
  const p = i < 0 ? 1 : seg(g, T[i], T[i] + SWEEP, EASE);
  const tilt = seg(g, K.tilt[0], K.tilt[1], EASE);
  const chip = i < 0 ? '奶茶粉紫' : p > 0.8 ? L[i].name : (i === 0 ? '奶茶粉紫' : L[i - 1].name);
  return (
    <AbsoluteFill>
      <CU zoom={1.04 + 0.03 * tilt} rot={2.5 * tilt}><Sweep from={prev} to={cur} p={p} /></CU>
      <Chip text={chip} />
      {/* 最后一拍从「发色」切到「发型」 */}
      <div style={{ position: 'absolute', left: 48, top: 140, fontFamily: FONT, fontSize: 22, color: '#fff', opacity: 0.85 }}>
        <span style={{ opacity: i === 3 ? 0.5 : 1 }}>换发色</span>　<span style={{ opacity: i === 3 ? 1 : 0.5, borderBottom: i === 3 ? `2px solid ${C.red}` : 'none' }}>换发型</span>
      </div>
      <Note text="她笑着歪头，镜中的她也跟着歪头" opacity={fade(g, K.tilt[0], K.tilt[0] + 4)} />
    </AbsoluteFill>
  );
};

// S6 ★ 穿镜而出：推进镜面 → 镜中的门（招牌是反字）→ 穿过玻璃（涟漪）→ 招牌翻正 → 门开，阳光涌进
export const S6: React.FC<P> = ({ g }) => {
  const push = seg(g, K.push[0], K.push[1], IN);
  const zoom = lerp(1, 7, push);
  const door = seg(g, K.intoDoor[0], K.intoDoor[1], EASE);
  const rip = fade(g, K.ripple[0], (K.ripple[0] + K.ripple[1]) / 2, (K.ripple[0] + K.ripple[1]) / 2, K.ripple[1]);
  const flipped = g >= K.flip;
  const open = seg(g, K.doorOpen[0], K.doorOpen[1], EASE);
  const walk = seg(g, K.intoDoor[0], K.doorOpen[1]);
  // 镜子里看到的：她的脸 → 她转身走向门口（门里的景象在推进到最后时充满画面）
  const inside = (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - door }}><Photo img="her/初恋蓬松短发.jpg" focus={[50, 32]} /></AbsoluteFill>
      <AbsoluteFill style={{ opacity: door, background: 'linear-gradient(180deg,#24170e,#3a2516 70%,#120b07)' }}>
        <div style={{ position: 'absolute', left: '50%', top: '22%', width: '56%', height: '70%', marginLeft: '-28%', background: '#fff6e0', perspective: 800 }}>
          {/* 门外：阳光下的街 */}
          <AbsoluteFill style={{ background: 'linear-gradient(180deg,#fff2d0,#ffd08a 60%,#c99a62)' }} />
          <AbsoluteFill style={{ background: 'linear-gradient(180deg,#8a5a35,#5a3a22)', border: '0.6vw solid #140c07', transformOrigin: '0% 50%', transform: `rotateY(${-82 * open}deg)` }}>
            <div style={{ position: 'absolute', left: '12%', right: '12%', top: '8%', height: '45%', background: 'linear-gradient(180deg,#e9c895,#b08050)', opacity: 0.7 }} />
          </AbsoluteFill>
        </div>
        <div style={{ position: 'absolute', left: '50%', top: '13%', width: '64%', marginLeft: '-32%', height: '7%', background: '#140c07', color: '#e9d2a8', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Didot,Georgia,serif', fontSize: 24, letterSpacing: 5, transform: `scaleX(${flipped ? 1 : -1})` }}>BARBER</div>
        {/* 她走向门口（背影越来越小） */}
        <div style={{ position: 'absolute', left: '50%', bottom: lerp(-10, 14, walk) + '%', transform: `translateX(-50%) scale(${lerp(1.3, 0.55, walk)})`, transformOrigin: '50% 100%' }}>
          <svg viewBox="0 0 200 300" style={{ width: 150, height: 225, display: 'block' }}>
            <path d="M30 300 L40 200 Q100 180 160 200 L170 300 Z" fill="#e9e4dc" />
            <path d="M100 20 C45 20 35 90 45 140 C50 180 40 210 35 240 C70 252 130 252 165 240 C160 210 150 180 155 140 C165 90 155 20 100 20 Z" fill="#d8c6a6" />
          </svg>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
  const gw = 560;
  return (
    <AbsoluteFill style={{ background: '#140d08', overflow: 'hidden' }}>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <filter id="ripple"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.03" numOctaves="2" seed={g} /><feDisplacementMap in="SourceGraphic" scale={rip * 90} /></filter>
      </svg>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: `${640 + 16 + gw / 2}px ${40 + 16 + gw * 8 / 9}px`, filter: rip > 0.01 ? 'url(#ripple)' : undefined }}>
        <ShopBg g={g} door={false} />
        <div style={{ position: 'absolute', left: 640, top: 40 }}><Mirror w={gw} base={false}>{inside}</Mirror></div>
      </AbsoluteFill>
      <Note text="镜中的她转身走向门口；穿过玻璃，招牌由反字翻正，门开" opacity={fade(g, at(6) + 4, at(6) + 8, K.ripple[0], K.ripple[0] + 2)} />
    </AbsoluteFill>
  );
};
