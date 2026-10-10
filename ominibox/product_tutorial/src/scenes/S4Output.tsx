// S4 记忆变成万物 · 应用（10–15 s）：一行提问 → 星图里三个节点亮起并连成光线（引用）→ 长出成果卡片 → Agent 动手整理
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, K, START, seg, EASE, pop, lerp } from '../timing';
import { FONT } from '../fonts';
import { Glass, GradientField, Grain, Dust, Vignette } from '../components/visual';
import { Constellation, NODES } from '../components/Constellation';

const Q = '上周会议定了哪些待办？';
const CITE = [2, 3, 7];                        // 被引用的节点
const BAR = { x: 960, y: 170, w: 900 };
const CARD_X = [390, 770, 1150, 1530], CARD_Y = 520;

const Check: React.FC<{ on: number }> = ({ on }) => (
  <span style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${on > 0 ? C.cyan : 'rgba(255,255,255,.4)'}`, background: on > 0 ? C.cyan : 'transparent', display: 'inline-grid', placeItems: 'center', flex: 'none', transform: `scale(${1 + 0.3 * Math.sin(on * Math.PI)})` }}>
    <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2.5 7.5 5.6 10.4 11.5 3.8" stroke={C.ink} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="16" strokeDashoffset={16 * (1 - on)} /></svg>
  </span>
);
const CARDS: { title: string; tag: string; body: (g: number) => React.ReactNode }[] = [
  { title: '待办清单', tag: '待办', body: (g) => <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 18 }}>
    {['周五前提交 Q4 方案', '整理用户访谈纪要', '下周二评审新版首页'].map((s, i) => <div key={s} style={{ display: 'flex', gap: 10, alignItems: 'center' }}><Check on={seg(g, K.checks[i], K.checks[i] + 5, EASE)} />{s}</div>)}</div> },
  { title: '会议摘要', tag: '摘要', body: () => <div style={{ fontSize: 16, lineHeight: 1.8, opacity: 0.9 }}>首页改版进入评审；<br />Q4 方案本周五截止；<br />访谈纪要由小林整理。</div> },
  { title: '本周周报', tag: '报告', body: () => <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 96 }}>{[40, 62, 50, 84, 72].map((h, i) => <i key={i} style={{ flex: 1, height: `${h}%`, borderRadius: 6, background: `linear-gradient(180deg, ${C.cyan}, ${C.blue})`, opacity: 0.55 + i * 0.1 }} />)}</div> },
  { title: '首页改版方案', tag: '方案', body: () => <div style={{ fontSize: 16, lineHeight: 1.8, opacity: 0.9 }}>1. 背景与目标<br />2. 信息架构调整<br />3. 上线节奏</div> },
];

export const S4Output: React.FC = () => {
  const g = useCurrentFrame() + START[3];
  const n = Math.max(0, Math.min(Q.length, Math.floor((g - K.type0) / K.typeStep) + 1));
  const sent = g >= K.enter, flash = seg(g, K.enter, K.enter + 8);
  const hl = seg(g, K.cite - 4, K.cite + 6, EASE);
  const warm = seg(g, 360, 450);                 // 光场从蓝紫流向琥珀
  const title = seg(g, 306, 318, EASE);
  return (
    <AbsoluteFill style={{ fontFamily: FONT, overflow: 'hidden', color: '#F4F6FF' }}>
      <GradientField frame={g} base="#0A0B1E" seed="s4" blobs={[{ c: 'rgba(46,124,246,.45)', x: 20, y: 30, r: 1000 }, { c: 'rgba(139,92,246,.5)', x: 80, y: 60, r: 1000 }, { c: 'rgba(34,211,238,.22)', x: 55, y: 15, r: 700 }]} />
      <GradientField frame={g} base="transparent" seed="s4w" opacity={warm} blobs={[{ c: 'rgba(245,197,66,.45)', x: 75, y: 70, r: 1100 }, { c: 'rgba(251,113,133,.35)', x: 25, y: 80, r: 900 }]} />
      <Dust frame={g} seed="s4d" n={90} opacity={0.45} drift={0.3} />
      <div style={{ position: 'absolute', inset: 0, transform: 'scale(1.12)', opacity: 0.55 }}><Constellation g={g} grow={false} highlight={[0, ...CITE]} hl={hl} /></div>
      {/* 引用光线：被引用节点 → 输入条 */}
      <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0 }}>
        {CITE.map((i) => { const p = NODES[i], x = 960 + (p.x - 960) * 1.12, y = 540 + (p.y - 540) * 1.12, e = seg(g, K.cite - 4, K.cite + 8, EASE), fade = 1 - seg(g, 372, 392);
          return <line key={i} x1={x} y1={y} x2={lerp(x, BAR.x, e)} y2={lerp(y, BAR.y + 44, e)} stroke={C.amber} strokeWidth={3} strokeOpacity={0.85 * fade} style={{ filter: 'drop-shadow(0 0 8px rgba(245,197,66,.9))' }} />; })}
      </svg>
      {/* 输入条 */}
      <div style={{ position: 'absolute', left: BAR.x - BAR.w / 2, top: BAR.y - 44, opacity: seg(g, 296, 306), transform: `translateY(${(1 - seg(g, 296, 308, EASE)) * -30}px)` }}>
        <Glass w={BAR.w} h={88} radius={44} glow={flash > 0 && flash < 1 ? `rgba(46,124,246,${1 - flash})` : undefined} style={{ display: 'flex', alignItems: 'center', padding: '0 14px 0 34px', fontSize: 30, fontWeight: 600 }}>
          <span>{Q.slice(0, n)}</span>{!sent && g % 16 < 9 && <i style={{ width: 3, height: 34, background: C.cream, marginLeft: 3 }} />}
          <span style={{ marginLeft: 'auto', width: 60, height: 60, borderRadius: 30, background: n > 0 ? C.cream : 'rgba(255,255,255,.2)', display: 'grid', placeItems: 'center', transform: `scale(${g >= K.enter && g < K.enter + 4 ? 0.82 : 1})` }}>
            <svg width="26" height="26" viewBox="0 0 16 16"><path d="M8 13V3M4 7l4-4 4 4" stroke={C.ink} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
        </Glass>
      </div>
      {/* 引用角标 */}
      <div style={{ position: 'absolute', top: BAR.y + 64, width: '100%', textAlign: 'center', opacity: seg(g, K.cite, K.cite + 6), transform: `scale(${0.8 + 0.2 * pop(g, K.cite)})` }}>
        <span style={{ display: 'inline-flex', gap: 10, alignItems: 'center', fontSize: 22, fontWeight: 600, padding: '8px 18px', borderRadius: 999, background: 'rgba(245,197,66,.16)', border: '1px solid rgba(245,197,66,.6)', color: '#FFE7A6' }}>
          <b style={{ background: C.amber, color: C.ink, borderRadius: 6, padding: '0 7px', fontSize: 16 }}>1</b>周会录音.m4a · 03:12 · 05:40</span>
      </div>
      {/* 成果卡片：逐拍弹出，流动的渐变描边 */}
      {CARDS.map((c, i) => {
        const at = K.cards[i], k = pop(g, at, 12); if (g < at) return null;
        const rot = (i - 1.5) * 3.5, ang = (g * 4 + i * 90) % 360;
        return (
          <div key={i} style={{ position: 'absolute', left: CARD_X[i] - 170, top: CARD_Y - 110, transform: `translateY(${(1 - k) * 80}px) scale(${0.6 + 0.4 * k}) rotate(${rot * k}deg)`, opacity: Math.min(1, k * 1.6), borderRadius: 26, padding: 2, background: `conic-gradient(from ${ang}deg, ${C.cyan}, ${C.violet}, ${C.amber}, ${C.cyan})` }}>
            <Glass w={340} h={250} radius={24} tint="rgba(10,12,30,0.55)" style={{ padding: '20px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}><span style={{ fontSize: 24, fontWeight: 800 }}>{c.title}</span>
                <span style={{ marginLeft: 'auto', fontSize: 14, fontWeight: 700, color: C.ink, background: C.cream, borderRadius: 6, padding: '2px 8px' }}>{c.tag}</span></div>
              {c.body(g)}
            </Glass>
          </div>
        );
      })}
      {/* Agent 动作胶囊 */}
      <div style={{ position: 'absolute', top: 700, width: '100%', display: 'flex', justifyContent: 'center', gap: 20 }}>
        {[['新建文件夹', '会议待办'], ['打标签', '科技']].map(([a, b], i) => { const k = pop(g, K.agents[i], 12); return g < K.agents[i] ? null : (
          <span key={a} style={{ display: 'inline-flex', alignItems: 'center', gap: 12, fontSize: 24, fontWeight: 600, padding: '10px 22px 10px 12px', borderRadius: 999, background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.3)', backdropFilter: 'blur(14px)', transform: `scale(${0.7 + 0.3 * k})`, opacity: Math.min(1, k * 1.5) }}>
            <b style={{ fontSize: 14, background: C.blue, borderRadius: 999, padding: '4px 10px' }}>Agent</b>✓ {a} · <span style={{ color: C.cream }}>{b}</span></span>); })}
      </div>
      <div style={{ position: 'absolute', top: 810, width: '100%', textAlign: 'center', fontSize: 104, fontWeight: 900, letterSpacing: '0.06em', opacity: title, transform: `translateY(${(1 - title) * 30}px)`, background: `linear-gradient(90deg, ${C.cream}, #FFD98A)`, WebkitBackgroundClip: 'text', color: 'transparent' }}>记忆变成万物</div>
      <Vignette strength={0.45} />
      <Grain frame={g} opacity={0.07} />
    </AbsoluteFill>
  );
};
