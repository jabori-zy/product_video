import React from 'react';
import { Box, C, Caption, Fill, Tx, lin } from '../lib';
import { LOCALES } from '../data/content';
import { useLang, useTr } from '../i18n';
import { Readme } from '../content/github';
import { DevAndroid, DevExt, DevIos, DevQQ, DevTelegram, DevWeb, DevWechat } from '../content/devices';

// G 开放 · 全平台（35.0–39.0 s），局部时间 t = 全局 − 35

const DEV = [
  { w: 460, h: 285, tag: ['网页', 'Web'] }, // 浏览器顶栏 26 + 网页 1920×1080 缩到 460 宽
  { w: 260, h: 176, tag: ['插件', 'Extension'] }, // 按插件弹窗截图 292×198 等比
  { w: 170, h: 368, tag: ['iOS', 'iOS'] }, // 手机首页 390×844 等比
  { w: 170, h: 368, tag: ['Android', 'Android'] },
  { w: 170, h: 368, tag: ['微信', 'WeChat'] }, // 聊天 App 也画成手机整屏（与 iOS / Android 同尺寸）
  { w: 170, h: 368, tag: ['QQ', 'QQ'] },
  { w: 170, h: 368, tag: ['Telegram', 'Telegram'] },
];
const GAP = 40;
const TOTAL = DEV.reduce((s, d) => s + d.w, 0) + GAP * (DEV.length - 1);
/** 七块屏幕放不进 1920：整排等比缩小（左端随 rotateY 转向镜头会变大，留出余量让「网页」整块入画） */
const ROW_K = Math.min(1, 1560 / TOTAL);
/** 逐个弹出的间隔（七块要在 1.9 s 收起前都落定，比六块时的 0.15 紧一点）；声音事件表同用 */
export const DEV_STEP = 0.1, TAG_STEP = 0.17;
/** 设备卡片飞入：从画面右侧外飞到各自位置，ENTER_T 起每张错开 DEV_STEP，各飞 FLY 秒 */
export const ENTER_T = -0.08, FLY = 0.42;
/** 离场：从最左边那张开始，逐个继续向左飞出画面（EXIT_T 起每张错开 EXIT_STEP，各飞 EXIT_FLY 秒，2.0 前全部飞完，接「开源」快切） */
export const EXIT_T = 1.3, EXIT_STEP = 0.06, EXIT_FLY = 0.32;

// 设备阵列里的七块真实屏幕（content/devices.tsx，尺寸与 DEV 一致）
const DEV_VIEW = [DevWeb, DevExt, DevIos, DevAndroid, DevWechat, DevQQ, DevTelegram];

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
          <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateY(${ry}deg) scale(${ROW_K})`, transformOrigin: '960px 470px' }}>
            {DEV.map((d, i) => {
              // 从右往左逐个飞入：起点在画面右侧外（同一个落点再往右 2400），缓出落定，飞行中带一点倾斜
              const a = ENTER_T + i * DEV_STEP;
              const e = lin(t, a, a + FLY, 0, 1, (q) => 1 - Math.pow(1 - q, 3));
              const ex = lin(t, EXIT_T + i * EXIT_STEP, EXIT_T + i * EXIT_STEP + EXIT_FLY, 0, 1, (q) => q * q * q); // 离场：缓入加速向左
              const left = x;
              x += d.w + GAP;
              if (t < a || ex >= 1) return null;
              return (
                <div key={i} style={{ position: 'absolute', left, top: 470 - d.h / 2, width: d.w, height: d.h, transform: `translateX(${(1 - e) * 2400 - ex * 2600}px) rotate(${(1 - e) * -6 + ex * 6}deg)` }}>
                  {React.createElement(DEV_VIEW[i], { c: Z })}
                </div>
              );
            })}
          </div>
          <div style={{ position: 'absolute', top: 700, width: 1920, display: 'flex', justifyContent: 'center', gap: 34, fontSize: 30, fontWeight: 600 }}>
            {DEV.map((d, i) => <span key={d.tag[0]} style={{ color: t > 0.3 + i * TAG_STEP ? '#fff' : '#444' }}>{tr(d.tag[0], d.tag[1])}{i < DEV.length - 1 && <span style={{ color: '#444', marginLeft: 34 }}>·</span>}</span>)}
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
