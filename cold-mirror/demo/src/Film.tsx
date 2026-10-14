// 全片：按全局帧选镜头（每镜 1 小节）。扫屏转场时下一镜提前垫在底下，由上一镜自己裁掉露出来。
import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from 'remotion';
import { K, BAR, BEAT, FPS, SHOTS, fade, at } from './timing';
import { S1, S2, S3, S4, S5, S6 } from './scenes/Act1';
import { S7, S8, S9, S10, S11, S12, S13 } from './scenes/Act2';
import { S14, S15, S16 } from './scenes/Act3';

const SCENES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16];
// 第 n 镜提前多少帧开始画（垫在上一镜的扫屏下面）
const PRE: Record<number, number> = { 9: at(9) - K.bus[0], 11: at(11) - K.doorEdge[0] };

// 全局闪白：穿镜后门外的阳光、每次快门、剪刀合上后切白
const flash = (g: number) => Math.max(
  fade(g, K.sun[0], 288, 288, K.sun[1]),
  ...[K.shutter8, K.shutter9].map((t) => fade(g, t - 1, t, t, t + 2)),
  fade(g, K.snip + 1, at(14), at(14), at(14) + 3),
);

const tc = (g: number) => {
  const s = Math.floor(g / FPS), f = g % FPS;
  return `00:${String(s).padStart(2, '0')}:${String(f).padStart(2, '0')}`;
};

export const Film: React.FC = () => {
  const g = useCurrentFrame();
  const n = Math.floor(g / BAR) + 1;
  const layers = SCENES.map((Scene, i) => ({ Scene, k: i + 1 })).filter(({ k }) => k === n || (k === n + 1 && g >= at(k) - (PRE[k] ?? 0)));
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {layers.reverse().map(({ Scene, k }) => <AbsoluteFill key={k}><Scene g={g} /></AbsoluteFill>)}
      <AbsoluteFill style={{ background: '#fff', opacity: flash(g), pointerEvents: 'none' }} />
      {/* 预览标注：镜号、时间码、小节.拍 */}
      <div style={{ position: 'absolute', left: 24, top: 18, padding: '4px 12px', background: 'rgba(0,0,0,.6)', color: '#FFE14D', fontFamily: '"PingFang SC",monospace', fontSize: 22, borderRadius: 4 }}>{SHOTS[n - 1]}</div>
      <div style={{ position: 'absolute', right: 24, bottom: 16, padding: '4px 12px', background: 'rgba(0,0,0,.6)', color: '#FFE14D', fontFamily: 'Menlo,monospace', fontSize: 22, borderRadius: 4 }}>
        {tc(g)}　bar {n}.{Math.floor((g % BAR) / BEAT) + 1}
      </div>
      <Audio src={staticFile('soundtrack.wav')} />
    </AbsoluteFill>
  );
};
