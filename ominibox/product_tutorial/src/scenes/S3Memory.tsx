// S3 变成记忆 · 理解（6–10 s）：在小黑体内，扫描光带逐拍扫过四份内容把它们"读懂"，随后坍缩成节点、连成记忆星图
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { C, K, START, seg, EASE, lerp } from '../timing';
import { FONT } from '../fonts';
import { Glass, Tag, Lines, GradientField, Grain, Dust, Vignette } from '../components/visual';
import { Constellation, PRIMARY } from '../components/Constellation';

const W = 340, H = 250, XS = [330, 750, 1170, 1590], Y = 500;
const hlText = (s: string) => s.split(/(待办)/).map((p, i) => p === '待办' ? <mark key={i} style={{ background: 'rgba(245,197,66,.85)', color: C.ink, borderRadius: 4, padding: '0 3px' }}>{p}</mark> : p);

const SPEC = [
  { label: '文档解析', tag: ['PDF', '#F87171'],
    before: () => <Lines n={7} color="rgba(255,255,255,.18)" />,
    after: () => <div style={{ fontSize: 15, lineHeight: 1.7 }}><b style={{ fontSize: 17 }}>Q4 产品规划</b><br />一、目标：知识库月活翻倍<br />二、里程碑：11 月上线同步<br /><span style={{ color: C.cyan }}>✓ 全文可搜索</span></div> },
  { label: '图片 OCR', tag: ['照片', '#34D399'],
    before: () => <div style={{ height: 150, borderRadius: 10, background: 'linear-gradient(135deg,#E2E8F0,#94A3B8)', position: 'relative' }}>{[18, 50, 82].map((t, i) => <div key={i} style={{ position: 'absolute', left: 18, top: t + 10, width: `${70 - i * 12}%`, height: 10, borderRadius: 5, background: 'rgba(30,41,59,.45)', transform: `rotate(${-2 + i}deg)` }} />)}</div>,
    after: () => <div style={{ height: 150, borderRadius: 10, background: 'linear-gradient(135deg,#E2E8F0,#94A3B8)', position: 'relative', color: C.ink, fontWeight: 700 }}>
      {[['Q4 路线图', 18, 70], ['周二 评审首页', 50, 58], ['负责人：小林', 82, 46]].map(([s, t, w], i) => <div key={i} style={{ position: 'absolute', left: 12, top: (t as number) + 4, padding: '2px 6px', border: `2px solid ${C.cyan}`, borderRadius: 4, fontSize: 15, background: 'rgba(34,211,238,.18)' }}>{s}</div>)}</div> },
  { label: '音视频转写', tag: ['录音', C.amber],
    before: () => <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 150 }}>{Array.from({ length: 30 }, (_, i) => <i key={i} style={{ width: 5, borderRadius: 3, background: C.amber, height: 12 + Math.abs(Math.sin(i * 1.3) * 70 * (0.4 + 0.6 * Math.abs(Math.sin(i * 0.37)))) }} />)}</div>,
    after: () => <div style={{ fontSize: 15, lineHeight: 1.75 }}>{[['00:12', '首页改版进入评审'], ['03:12', '待办一：周五交 Q4 方案'], ['05:40', '待办二：整理访谈纪要']].map(([t, s]) => <div key={t}><span style={{ color: 'rgba(255,255,255,.5)', marginRight: 10 }}>{t}</span>{hlText(s)}</div>)}</div> },
  { label: 'AI 摘要', tag: ['网页', '#60A5FA'],
    before: () => <><div style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>如何搭建你的第二大脑</div><Lines n={5} color="rgba(255,255,255,.18)" /></>,
    after: () => <div style={{ fontSize: 15, lineHeight: 1.75 }}><div style={{ color: C.cyan, fontWeight: 800, marginBottom: 4 }}>✦ AI 摘要</div>{['收集：先存下来，再整理', '连接：用标签和双链关联', '输出：定期把笔记变成成果'].map((s) => <div key={s}>• {s}</div>)}</div> },
];

export const S3Memory: React.FC = () => {
  const g = useCurrentFrame() + START[2];
  // 扫描光带：在每个解析拍点正好扫到对应卡片的中心
  const beamX = interpolate(g, [180, ...K.parse, 256], [-80, ...XS, 2000], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const title = seg(g, 184, 196, EASE);
  const collapse = seg(g, 248, 268, EASE);   // 卡片坍缩成节点
  return (
    <AbsoluteFill style={{ fontFamily: FONT, overflow: 'hidden', color: '#F4F6FF' }}>
      <GradientField frame={g} base="#060A18" seed="s3" blobs={[{ c: 'rgba(34,211,238,.28)', x: 30, y: 40, r: 900 }, { c: 'rgba(46,124,246,.45)', x: 70, y: 65, r: 1000 }, { c: 'rgba(139,92,246,.35)', x: 50, y: 10, r: 800 }]} />
      <Dust frame={g} seed="s3d" n={90} color={C.cyan} opacity={0.4} drift={0.2} />
      <Constellation g={g} />
      {SPEC.map((s, i) => {
        const x0 = XS[i] - W / 2, bl = Math.max(0, Math.min(W, beamX - x0)), done = seg(g, K.parse[i], K.parse[i] + 6);
        const enter = seg(g, 176 + i * 3, 190 + i * 3, EASE);
        const P = PRIMARY[i], x = lerp(XS[i], P.x, collapse), y = lerp(Y, P.y, collapse), sc = (0.9 + 0.1 * enter) * (1 - 0.94 * collapse);
        return (
          <React.Fragment key={i}>
            <div style={{ position: 'absolute', left: x - W / 2, top: y - H / 2, transform: `scale(${sc}) translateY(${(1 - enter) * 40}px)`, opacity: enter * (1 - seg(g, 262, 270)) }}>
              <Glass w={W} h={H} glow={done > 0 && done < 1 ? `rgba(34,211,238,${0.8 * (1 - done)})` : undefined} style={{ padding: 18 }}>
                <Tag label={s.tag[0]} color={s.tag[1]} />
                <div style={{ position: 'absolute', left: 18, right: 18, top: 62, bottom: 18, clipPath: `inset(0 0 0 ${Math.max(0, bl - 18)}px)` }}>{s.before()}</div>
                <div style={{ position: 'absolute', left: 18, right: 18, top: 62, bottom: 18, clipPath: `inset(0 ${W - 18 - Math.max(0, bl - 18)}px 0 0)` }}>{s.after()}</div>
              </Glass>
            </div>
            {/* 功能词：扫到时从卡片下方弹出 */}
            <div style={{ position: 'absolute', left: XS[i] - 150, width: 300, top: Y + H / 2 + 26, textAlign: 'center', fontSize: 34, fontWeight: 800, opacity: done * (1 - collapse), transform: `translateY(${(1 - done) * 16}px)`, color: C.cream, textShadow: `0 0 24px rgba(34,211,238,${0.6 * done})` }}>{s.label}</div>
          </React.Fragment>
        );
      })}
      {/* 扫描光带 */}
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: beamX - 90, width: 180, opacity: g > 181 && g < 255 ? 1 : 0, background: 'linear-gradient(90deg, transparent, rgba(46,124,246,.25) 35%, rgba(34,211,238,.7) 49%, #fff 50%, rgba(34,211,238,.7) 51%, rgba(46,124,246,.25) 65%, transparent)', mixBlendMode: 'screen' }} />
      <div style={{ position: 'absolute', top: 96, width: '100%', textAlign: 'center', fontSize: 92, fontWeight: 900, letterSpacing: '0.08em', opacity: title, transform: `translateY(${(1 - title) * -24}px)`, background: `linear-gradient(90deg, ${C.cream}, #9DE7F5)`, WebkitBackgroundClip: 'text', color: 'transparent' }}>变成记忆</div>
      <Vignette strength={0.5} />
      <Grain frame={g} opacity={0.07} />
    </AbsoluteFill>
  );
};
