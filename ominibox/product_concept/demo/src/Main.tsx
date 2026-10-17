import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Band, FPS, H, MBlur, W, inOut, lin } from './lib';
import { FONT } from './fonts';
import { A } from './scenes/A';
import { B } from './scenes/B';
import { Cc } from './scenes/C';
import { Dd } from './scenes/D';
import { Ee, SHARE } from './scenes/E';
import { Ff } from './scenes/F';
import { Gg } from './scenes/G';
import { Hh } from './scenes/H';
import { ARC_DE, toScript } from './pace';

// 八段与转场，时间严格对应 result/script.md
export const SCENES = [
  { id: 'A', s: 0, e: 5, C: A, name: '开场 · 你好，小黑！' },
  { id: 'B', s: 5, e: 9, C: B, name: '一键收藏 · 浏览器插件' },
  { id: 'C', s: 9, e: 12, C: Cc, name: '万物入口 · 随时随地' },
  { id: 'D', s: 12, e: 18, C: Dd, name: '理解 · 万物变成记忆' },
  { id: 'E', s: 18, e: 30, C: Ee, name: '应用 · 记忆变成万物' },
  { id: 'F', s: 30, e: 35, C: Ff, name: '分享协作' },
  { id: 'G', s: 35, e: 39, C: Gg, name: '开放 · 全平台' },
  { id: 'H', s: 39, e: 45, C: Hh, name: '品牌 · 口号' },
];

// 甩镜：tb 时刻，内容朝 (dx,dy) 方向甩出，0.3 s 完成
const whip = (T: number, tb: number, dx: number, dy: number) => {
  const p = inOut(Math.max(0, Math.min(1, (T - (tb - 0.15)) / 0.3)));
  const b = Math.sin(Math.PI * p) * 40;
  return {
    out: { x: dx * W * p, y: dy * H * p, bx: dx ? b : 0, by: dy ? b : 0 },
    in: { x: -dx * W * (1 - p), y: -dy * H * (1 - p), bx: dx ? b : 0, by: dy ? b : 0 },
  };
};

// 光带擦除：tb 前后 0.25 s，光带从左扫到右，左侧露出下一场
const arcX = (T: number, tb: number) => lin(T, tb - 0.25, tb + 0.25, -400, W + 400, inOut);

const Layer: React.FC<{ id: string; T: number; s: number; C: any; x?: number; y?: number; bx?: number; by?: number; style?: React.CSSProperties }> = ({ id, T, s, C, x = 0, y = 0, bx = 0, by = 0, style }) => (
  <MBlur id={`w-${id}`} bx={bx} by={by} style={{ transform: `translate(${x}px, ${y}px)`, ...style }}>
    <C t={T - s} />
  </MBlur>
);

// paced：不限时长版，输出时间经节奏表映射回脚本时间，内容不变
// at：固定在某个脚本时间（嵌进笔记本屏幕、插段衔接用）；label=false 不画草稿标注
// ending：替换 H 段（品牌结尾）的组件，默认原版 Hh
export const Main: React.FC<{ paced?: boolean; at?: number; label?: boolean; ending?: React.FC<{ t: number }> }> = ({ paced, at, label = true, ending = Hh }) => {
  const sec = useCurrentFrame() / FPS;
  const T = at ?? (paced ? toScript(sec) : sec);
  const L: React.ReactNode[] = [];
  const in_ = (a: number, b: number) => T >= a && T < b;

  const w5 = whip(T, 5, -1, 0); // A → B 向右甩（内容向左）
  const w9 = whip(T, 9, 1, 0); // B → C 向左甩（内容向右）
  const w35 = whip(T, 35, -1, 0); // F → G：内容向左甩出，G 的设备卡片从右往左逐个飞进来（G.tsx）

  if (in_(0, 5.15)) L.push(<Layer key="A" id="A" T={T} s={0} C={A} {...w5.out} />);
  if (in_(4.85, 9.15)) {
    const v = T < 7 ? w5.in : w9.out;
    L.push(<Layer key="B" id="B" T={T} s={5} C={B} {...v} />);
  }
  if (in_(8.85, 12.05)) L.push(<Layer key="C" id="C" T={T} s={9} C={Cc} {...w9.in} />);
  // C → D：光点流进侧栏，D 淡入
  if (in_(11.85, ARC_DE + 0.25)) L.push(<Layer key="D" id="D" T={T} s={12} C={Dd} style={{ opacity: lin(T, 11.85, 12.05, 0, 1) }} />);
  // D → E：光带擦除
  if (in_(ARC_DE - 0.25, 30.2)) L.push(<Layer key="E" id="E" T={T} s={18} C={Ee} style={{ clipPath: T < ARC_DE + 0.25 ? `inset(0 ${Math.max(0, W - arcX(T, ARC_DE))}px 0 0)` : undefined }} />);
  // E → F：右上角「分享」图标放大成米白画布
  // F → G：G 垫在下面（黑底 + 从右侧飞入的设备卡片），F 向左甩出露出 G
  if (in_(34.85, 39.25)) L.push(<Layer key="G" id="G" T={T} s={35} C={Gg} />);
  if (in_(29.8, 35.15)) {
    const r = lin(T, 29.8, 30.2, 0, 2300);
    L.push(<Layer key="F" id="F" T={T} s={30} C={Ff} {...w35.out} style={{ clipPath: T < 30.2 ? `circle(${r}px at ${SHARE.x}px ${SHARE.y}px)` : undefined }} />);
  }
  // G → H：光带擦除
  if (in_(38.75, 45.01)) L.push(<Layer key="H" id="H" T={T} s={39} C={ending} style={{ clipPath: T < 39.25 ? `inset(0 ${Math.max(0, W - arcX(T, 39))}px 0 0)` : undefined }} />);

  const band = (tb: number) => (T > tb - 0.25 && T < tb + 0.25 ? <Band key={`band${tb}`} x={arcX(T, tb)} /> : null);
  const cur = [...SCENES].reverse().find((s) => T >= s.s)!;

  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: FONT }}>
      {L}
      {band(ARC_DE)}
      {band(39)}
      {/* 草稿标注：段落与时间码 */}
      {label && <div style={{ position: 'absolute', right: 16, bottom: 12, padding: '4px 10px', borderRadius: 6, background: 'rgba(0,0,0,.55)', color: '#ffd84a', fontSize: 18, fontFamily: 'monospace' }}>
        DRAFT {cur.id} {cur.name} · {T.toFixed(2)}s{paced ? ` → ${sec.toFixed(1)}s` : ''}
      </div>}
    </AbsoluteFill>
  );
};
