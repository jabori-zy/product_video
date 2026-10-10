import React from 'react';
import { Box, C, Caption, Fill, Tx, lin, sp } from '../lib';
import { LOCALES } from '../data/content';
import { useLang, useTr } from '../i18n';
import { Readme } from '../content/github';
import { DevAndroid, DevExt, DevIos, DevQQ, DevWeb, DevWechat } from '../content/devices';

// G 开放 · 全平台（35.0–39.0 s），局部时间 t = 全局 − 35

const DEV = [
  { w: 460, h: 300, tag: ['网页', 'Web'] },
  { w: 200, h: 250, tag: ['插件', 'Extension'] },
  { w: 170, h: 350, tag: ['iOS', 'iOS'] },
  { w: 170, h: 350, tag: ['Android', 'Android'] },
  { w: 260, h: 350, tag: ['微信', 'WeChat'] },
  { w: 260, h: 350, tag: ['QQ', 'QQ'] },
];
const GAP = 40;
const TOTAL = DEV.reduce((s, d) => s + d.w, 0) + GAP * (DEV.length - 1);

// 设备阵列里的六块真实屏幕（content/devices.tsx，尺寸与 DEV 一致）
const DEV_VIEW = [DevWeb, DevExt, DevIos, DevAndroid, DevWechat, DevQQ];

/** 开源 · 私有部署 · Agent 可用：三个快切画面（文字随语言） */
const flashes = (Z: typeof LOCALES.zh, tr: <T,>(zh: T, en: T) => T) => [
  { a: 2.0, word: tr('开源', 'Open source'), node: (
    <>
      <Box x={0} y={0} w={1100} h={520} r={20} bg="#161b22" border="1px solid #30363d" />
      <Tx x={50} y={50} s={30} c="#58a6ff" b>import-ai / omnibox</Tx>
      <Tx x={50} y={110} s={22} c="#8b949e">{tr('GitHub 仓库 · ⭐ Star · Apache-2.0', 'GitHub repository · ⭐ Star · Apache-2.0')}</Tx>
      <div style={{ position: 'absolute', left: 50, top: 180 }}><Readme c={Z} /></div>
    </>
  ) },
  { a: 2.65, word: tr('私有部署', 'Self-hosted'), node: (
    <>
      <Box x={0} y={0} w={1100} h={520} r={20} bg="#0f0f10" border="1px solid #333" />
      <Tx x={50} y={50} s={26} c="#4ADE80">$ docker compose up</Tx>
      <Tx x={50} y={100} s={24} c="#ccc">✓ omnibox-web　started</Tx>
      <Tx x={50} y={140} s={24} c="#ccc">✓ omnibox-backend　started</Tx>
      <Tx x={50} y={200} s={28} c="#fff" b>{tr('Ollama · 离线运行', 'Ollama · Run offline')}</Tx>
    </>
  ) },
  { a: 3.3, word: tr('你的 Agent 也能用', 'Ready for your agent'), node: (
    <>
      <Box x={0} y={0} w={1100} h={520} r={20} bg="#0f0f10" border="1px solid #333" />
      <Tx x={50} y={50} s={26} c="#D97757">$ claude</Tx>
      <Tx x={50} y={100} s={24} c="#fff">&gt; /omnibox search "{tr('周会待办', 'weekly meeting to-dos')}"</Tx>
      <Tx x={50} y={150} s={tr(24, 20)} c="#ccc">{tr('✓ 找到 3 条：周会录音.m4a · 白板照片.jpg · Q3 产品复盘.pdf', '✓ 3 found: Weekly Meeting Recording.m4a · Whiteboard Photo.jpg · Q3 Product Review.pdf')}</Tx>
      <Tx x={50} y={200} s={22} c="#888">Claude Code / Codex · Skill</Tx>
    </>
  ) },
];

export const Gg: React.FC<{ t: number }> = ({ t }) => {
  const lang = useLang(), tr = useTr();
  const Z = LOCALES[lang]; // 线框里的真实内容（data/locales）
  const FLASH = flashes(Z, tr);
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
                <div key={i} style={{ position: 'absolute', left, top: 470 - d.h / 2, width: d.w, height: d.h, transform: `translateZ(${(1 - p) * -600}px)`, opacity: p }}>
                  {React.createElement(DEV_VIEW[i], { c: Z })}
                </div>
              );
            })}
          </div>
          <div style={{ position: 'absolute', top: 700, width: 1920, display: 'flex', justifyContent: 'center', gap: 34, fontSize: 30, fontWeight: 600 }}>
            {DEV.map((d, i) => <span key={d.tag[0]} style={{ color: t > 0.3 + i * 0.2 ? '#fff' : '#444' }}>{tr(d.tag[0], d.tag[1])}{i < DEV.length - 1 && <span style={{ color: '#444', marginLeft: 34 }}>·</span>}</span>)}
          </div>
          <Caption t={t} a={0.8} b={1.85} text={tr('全平台，一个小黑', 'Every platform. One Xiaohei.')} y={820} size={72} />
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
