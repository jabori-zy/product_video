import React from 'react';
import { Box, C, Caption, Fill, Tx, blinkAt, lin, sp } from '../lib';

// G 开放 · 全平台（35.0–39.0 s），局部时间 t = 全局 − 35

const DEV = [
  { w: 460, h: 300, label: '浏览器 · OmniBox 网页', tag: '网页' },
  { w: 200, h: 250, label: '浏览器插件', tag: '插件' },
  { w: 170, h: 350, label: 'iPhone · App', tag: 'iOS' },
  { w: 170, h: 350, label: 'Android', tag: 'Android' },
  { w: 260, h: 350, label: '微信 · 小黑', tag: '微信' },
  { w: 260, h: 350, label: 'QQ · 小黑', tag: 'QQ' },
];
const GAP = 40;
const TOTAL = DEV.reduce((s, d) => s + d.w, 0) + GAP * (DEV.length - 1);

const Eyes: React.FC<{ b: number }> = ({ b }) => (
  <div style={{ display: 'flex', gap: 14 }}>
    {[0, 1].map((i) => (
      <div key={i} style={{ width: 30, height: 26 * (1 - 0.9 * b), borderRadius: '50%', background: C.cream, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 13, height: 12 * (1 - 0.9 * b), borderRadius: '50%', background: C.black }} />
      </div>
    ))}
  </div>
);

const FLASH = [
  { a: 2.0, word: '开源', node: (
    <>
      <Box x={0} y={0} w={1100} h={520} r={20} bg="#161b22" border="1px solid #30363d" />
      <Tx x={50} y={50} s={30} c="#58a6ff" b>import-ai / omnibox</Tx>
      <Tx x={50} y={110} s={22} c="#8b949e">GitHub 仓库 · ⭐ Star · Apache-2.0</Tx>
      <Box x={50} y={180} w={1000} h={290} r={12} bg="#0d1117" lc="#555" fs={28} label="README（占位）" />
    </>
  ) },
  { a: 2.65, word: '私有部署', node: (
    <>
      <Box x={0} y={0} w={1100} h={520} r={20} bg="#0f0f10" border="1px solid #333" />
      <Tx x={50} y={50} s={26} c="#4ADE80">$ docker compose up</Tx>
      <Tx x={50} y={100} s={24} c="#ccc">✓ omnibox-web　started</Tx>
      <Tx x={50} y={140} s={24} c="#ccc">✓ omnibox-backend　started</Tx>
      <Tx x={50} y={200} s={28} c="#fff" b>Ollama · 离线运行</Tx>
    </>
  ) },
  { a: 3.3, word: '你的 Agent 也能用', node: (
    <>
      <Box x={0} y={0} w={1100} h={520} r={20} bg="#0f0f10" border="1px solid #333" />
      <Tx x={50} y={50} s={26} c="#D97757">$ claude</Tx>
      <Tx x={50} y={100} s={24} c="#fff">&gt; /omnibox search "周会待办"</Tx>
      <Tx x={50} y={150} s={24} c="#ccc">✓ 找到 3 条：周会录音.m4a · 白板照片.jpg · Q3 产品复盘.pdf</Tx>
      <Tx x={50} y={200} s={22} c="#888">Claude Code / Codex · Skill</Tx>
    </>
  ) },
];

export const Gg: React.FC<{ t: number }> = ({ t }) => {
  const ry = lin(t, 0, 2.0, 0, 30);
  const fanO = 1 - lin(t, 1.9, 2.0, 0, 1);
  let x = (1920 - TOTAL) / 2;
  const cur = [...FLASH].reverse().find((f) => t >= f.a);
  const punch = cur ? lin(t, cur.a, cur.a + 0.15, 1.06, 1) : 1;

  return (
    <Fill bg={C.black}>
      {fanO > 0 && (
        <div style={{ position: 'absolute', inset: 0, perspective: 2000, opacity: fanO }}>
          <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateY(${ry}deg)`, transformOrigin: '960px 470px' }}>
            {DEV.map((d, i) => {
              const a = 0.1 + i * 0.15;
              const p = sp(t, a, { damping: 16 });
              const left = x;
              x += d.w + GAP;
              return (
                <div key={i} style={{ position: 'absolute', left, top: 470 - d.h / 2, width: d.w, height: d.h, borderRadius: i >= 2 && i <= 3 ? 30 : 16, background: '#1c1c1e', border: '2px solid #3a3a3c', transform: `translateZ(${(1 - p) * -600}px)`, opacity: p, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
                  <div style={{ color: '#bbb', fontSize: 20, fontWeight: 600 }}>{d.label}</div>
                  <Eyes b={blinkAt(t, [0.9 + i * 0.12])} />
                </div>
              );
            })}
          </div>
          <div style={{ position: 'absolute', top: 700, width: 1920, display: 'flex', justifyContent: 'center', gap: 34, fontSize: 30, fontWeight: 600 }}>
            {DEV.map((d, i) => <span key={d.tag} style={{ color: t > 0.3 + i * 0.2 ? '#fff' : '#444' }}>{d.tag}{i < DEV.length - 1 && <span style={{ color: '#444', marginLeft: 34 }}>·</span>}</span>)}
          </div>
          <Caption t={t} a={0.8} b={1.85} text="全平台，一个小黑" y={820} size={72} />
        </div>
      )}
      {cur && (
        <>
          <div style={{ position: 'absolute', left: 410, top: 230, width: 1100, height: 520, transform: `scale(${punch})` }}>{cur.node}</div>
          <div style={{ position: 'absolute', top: 800, width: 1920, textAlign: 'center', color: '#fff', fontSize: 80, fontWeight: 800, transform: `scale(${punch})` }}>{cur.word}</div>
        </>
      )}
    </Fill>
  );
};
