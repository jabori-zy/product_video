import React from 'react';
import { random } from 'remotion';
import { Box, C, Camera, Caption, Fill, MBlur, Pill, camBlur, kf, lin, sp } from '../lib';

// C 万物入口 · 随时随地（9.0–12.0 s），局部时间 t = 全局 − 9
// 世界坐标里排一条 3D 卡片走廊，镜头每半拍甩到下一张

const CARDS = [
  { id: 'news', x: 0, w: 720, h: 450, ry: 18, label: '新闻站页面', sub: '科技前沿日报 ·《国产大模型推理成本一年下降 90%》', save: 0.2 },
  { id: 'bili', x: 900, w: 720, h: 450, ry: -18, label: 'B 站视频页', sub: '《10 分钟看懂 RAG》', save: 0.7 },
  { id: 'xhs', x: 1640, w: 500, h: 400, ry: 14, label: '小红书页面', sub: '《我的 Notion 替代方案｜效率清单》', save: 1.15 },
  { id: 'x', x: 2200, w: 500, h: 400, ry: -14, label: 'X 帖子', sub: '"Agents that remember are the next platform shift."', save: 1.25 },
  { id: 'phone', x: 3000, w: 360, h: 720, ry: 0, label: '', sub: '', save: -1 },
  { id: 'rss', x: 3480, w: 460, h: 380, ry: -10, label: 'RSS 订阅文件夹', sub: '', save: 2.35 },
];

const CAM = [
  { t: -0.2, x: 0, y: 540, s: 1 },
  { t: 0.35, x: 0, y: 540, s: 1 },
  { t: 0.5, x: 900, y: 540, s: 1 },
  { t: 0.85, x: 900, y: 540, s: 1 },
  { t: 1.0, x: 1920, y: 540, s: 0.85 },
  { t: 1.35, x: 1920, y: 540, s: 0.85 },
  { t: 1.5, x: 3000, y: 540, s: 0.9 },
  { t: 1.95, x: 3000, y: 540, s: 0.9 },
  { t: 2.1, x: 3240, y: 540, s: 0.9 },
  { t: 2.5, x: 1675, y: 540, s: 0.42 },
];

const WECHAT = ['📄 Q3 产品复盘.pdf', '🎤 0:12', '🖼 白板照片', '周会结论 #会议'];
const TARGET = { x: 170, y: 520 };

export const Cc: React.FC<{ t: number }> = ({ t }) => {
  const c = kf(t, CAM);
  const [bx, by] = camBlur(t, CAM);
  const shrink = 1 - lin(t, 2.45, 2.6, 0, 1);
  const dim = lin(t, 2.0, 2.2, 0, 0.35);

  const card = (k: any, inner: React.ReactNode, extra: any = {}) => (
    <div key={k.id} style={{ position: 'absolute', left: k.x - k.w / 2 + (extra.dx || 0), top: 540 - k.h / 2 + (extra.dy || 0), width: k.w, height: k.h, transform: `perspective(1600px) rotateY(${extra.ry ?? k.ry}deg) scale(${shrink})`, opacity: (extra.o ?? 1) * (shrink > 0 ? 1 : 0) }}>
      {inner}
      {k.save >= 0 && t >= k.save && <Pill x={k.w / 2} y={-30} text="✓ 已保存" s={sp(t, k.save)} />}
    </div>
  );

  const labelBox = (k: any, w = k.w, h = k.h) => (
    <Box x={0} y={0} w={w} h={h} r={18} bg="#2a2a2e" lc="#cfcfd4" fs={40} label={<div style={{ textAlign: 'center' }}>{k.label}<div style={{ fontSize: 22, fontWeight: 400, marginTop: 14, color: '#9a9aa0', padding: '0 30px' }}>{k.sub}</div></div>} />
  );

  // 手机：微信 → OmniBox App
  const ph = CARDS[4];
  const phIn = sp(t, 1.4);
  const app = lin(t, 2.0, 2.15, 0, 1);
  const phone = (
    <div style={{ position: 'absolute', inset: 0, borderRadius: 48, background: '#111', border: '8px solid #333', overflow: 'hidden', boxSizing: 'border-box' }}>
      <div style={{ opacity: 1 - app }}>
        <div style={{ height: 70, background: '#1e1e1e', color: '#fff', fontSize: 24, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 10, boxSizing: 'border-box' }}>微信 · 小黑</div>
        {WECHAT.map((m, i) => {
          const a = 1.55 + i * 0.125;
          const p = sp(t, a);
          return (
            <div key={m} style={{ position: 'absolute', right: 22, top: 100 + i * 80, padding: '12px 16px', borderRadius: 10, background: '#95EC69', color: '#111', fontSize: 20, opacity: p, transform: `scale(${0.7 + 0.3 * p})`, transformOrigin: 'right center' }}>
              {m} {t > a + 0.1 && <span style={{ color: '#1a7f37' }}>✓</span>}
            </div>
          );
        })}
      </div>
      <div style={{ position: 'absolute', inset: 0, opacity: app }}>
        <Box x={20} y={50} w={304} h={44} r={10} bg="#2a2a2a" lc="#888" fs={16} label="OmniBox App · Ask anything" />
        <Box x={60} y={110} w={224} h={36} r={18} bg="#2a2a2a" lc="#ccc" fs={15} label="Resources | Chats" />
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} style={{ position: 'absolute', left: 40 + i * 17, top: 360 - 4, width: 9, height: t > 2.2 ? 12 + 60 * Math.abs(Math.sin(t * 9 + i)) : 6, transform: 'translateY(-50%)', borderRadius: 5, background: C.blue }} />
        ))}
        <div style={{ position: 'absolute', left: 0, bottom: 20, width: '100%', display: 'flex', justifyContent: 'space-around', color: '#ddd', fontSize: 18 }}>
          <span>＋ More</span>
          <span style={{ color: t > 2.15 ? '#8AB4FF' : '#ddd', fontWeight: 700 }}>🎙 Record</span>
          <span>📝 Text</span>
        </div>
      </div>
    </div>
  );

  // 光点：每张卡 6 个，从 2.5 s 时卡片的屏幕位置飞向 D 的侧栏
  const c25 = kf(2.5, CAM);
  const dots: React.ReactNode[] = [];
  if (t >= 2.45) {
    CARDS.forEach((k, ci) => {
      for (let j = 0; j < 6; j++) {
        const sx0 = (k.x - c25.x) * c25.s + 960 + (random(`dx${ci}${j}`) - 0.5) * k.w * c25.s;
        const sy0 = 540 + (random(`dy${ci}${j}`) - 0.5) * k.h * c25.s;
        const st = 2.5 + (ci * 6 + j) * 0.006;
        for (let g = 0; g < 4; g++) {
          const p = lin(t - g * 0.025, st, st + 0.42, 0, 1, (x) => x * x);
          const mx = (sx0 + TARGET.x) / 2;
          const my = Math.min(sy0, TARGET.y) - 220;
          const x = (1 - p) * (1 - p) * sx0 + 2 * p * (1 - p) * mx + p * p * TARGET.x;
          const y = (1 - p) * (1 - p) * sy0 + 2 * p * (1 - p) * my + p * p * TARGET.y;
          dots.push(<div key={`${ci}-${j}-${g}`} style={{ position: 'absolute', left: x - 5, top: y - 5, width: 10 - g * 2, height: 10 - g * 2, borderRadius: '50%', background: g ? C.blue2 : '#fff', boxShadow: `0 0 14px ${C.blue}`, opacity: (1 - g * 0.25) * (p >= 1 ? 0 : 1) }} />);
        }
      }
    });
  }

  return (
    <Fill bg="#111114">
      <MBlur id="c-cam" bx={bx} by={by}>
        <Camera c={c}>
          {CARDS.slice(0, 4).map((k) => card(k, (
            <>
              {labelBox(k)}
              {k.id === 'bili' && t >= 0.8 && (
                <div style={{ position: 'absolute', left: 30, bottom: 24, display: 'flex', gap: 12, opacity: lin(t, 0.8, 0.95, 0, 1) }}>
                  {['引言', '检索', '生成', '评估'].map((s) => <Box key={s} x={0} y={0} w={150} h={54} r={8} bg="#3a3a40" lc="#ddd" fs={18} label={s} style={{ position: 'relative' }} />)}
                  <span style={{ color: '#aaa', fontSize: 18, alignSelf: 'center' }}>章节 · 关键画面</span>
                </div>
              )}
            </>
          )))}
          {card(ph, phone, { ry: lin(t, 1.4, 1.6, 20, 0), dy: (1 - phIn) * 200, o: phIn })}
          {card(CARDS[5], (
            <>
              {labelBox(CARDS[5])}
              {[0, 1, 2].map((i) => (
                <Box key={i} x={30} y={230 + i * 44 - 120} w={400} h={34} r={8} bg="#3a3a40" lc="#ddd" fs={16} label={`新文章 ${i + 1}`} style={{ opacity: lin(t, 2.1 + i * 0.1, 2.2 + i * 0.1, 0, 1), transform: `translateX(${lin(t, 2.1 + i * 0.1, 2.2 + i * 0.1, 60, 0)}px)`, top: 250 + i * 44 }} />
              ))}
              {t > 2.4 && <div style={{ position: 'absolute', right: -14, top: -14, background: '#E5484D', color: '#fff', borderRadius: 999, padding: '4px 12px', fontSize: 20 }}>+3</div>}
            </>
          ), { dx: lin(t, 2.0, 2.2, 400, 0), o: lin(t, 2.0, 2.15, 0, 1) })}
        </Camera>
      </MBlur>
      <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: dim }} />
      <Caption t={t} a={2.0} b={2.75} text="随时随地，交给小黑" y={470} size={84} />
      {dots}
    </Fill>
  );
};
