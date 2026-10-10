import React from 'react';
import { LOCALES } from '../data/content';
import { ZhihuBody, ZhihuHeader } from '../content/zhihu';
import { C, Camera, Caption, Cursor, Fill, Logo, MBlur, Spinner, Tx, camBlur, kf, lin, morph, sp, win } from '../lib';

const Z = LOCALES.zh; // 线框里的真实内容（data/locales/zh.ts）

// B 一键收藏 · 浏览器插件（5.0–9.0 s），局部时间 t = 全局 − 5
// 世界坐标：浏览器窗口 (210,100) 1500×880；窗口内元素用窗口相对坐标

const WX = 210, WY = 100;
const ICON = { x: 1440, y: 56 }; // 小黑插件图标（窗口相对，28×28）
const CARD = { x: 1190, y: 100, w: 288, h: 210 };

const CAM = [
  { t: 0, x: 960, y: 540, s: 0.92, rx: 6, ry: -14 },
  { t: 0.8, x: 1000, y: 520, s: 1.0, rx: 4, ry: -10 },
  { t: 1.0, x: WX + ICON.x + 14, y: WY + ICON.y + 14, s: 3.5, rx: 0, ry: 0 },
  { t: 1.2, x: WX + ICON.x + 14, y: WY + ICON.y + 14, s: 3.5 },
  { t: 1.6, x: 1450, y: 330, s: 1.5 },
  { t: 1.8, x: 1540, y: 270, s: 2.0 },
  { t: 2.0, x: 1540, y: 270, s: 2.0 },
  { t: 2.7, x: 1000, y: 330, s: 1.25 },
  { t: 3.0, x: 820, y: 540, s: 1.3 },
  { t: 3.6, x: 950, y: 560, s: 1.35 },
  { t: 4.2, x: 1000, y: 560, s: 1.35 },
];

const BTN = [
  { t: 0, x: 1206, y: 148, w: 256, h: 38, r: 8 },
  { t: 2.0, x: 1315, y: 148, w: 38, h: 38, r: 19 },
  { t: 2.6, x: 560, y: 112, w: 380, h: 46, r: 23 },
];

const QUOTE = { x: 350, y: 520, w: 640 };
const QY = QUOTE.y - 40; // 页面下滚 40 后引文在窗口内的 y

export const B: React.FC<{ t: number }> = ({ t }) => {
  const c = kf(t, CAM);
  const [bx, by] = camBlur(t, CAM);
  const scroll = lin(t, 0, 0.8, 0, -40);
  const cardP = sp(t, 1.2);
  const cardO = 1 - lin(t, 2.6, 2.9, 0, 1);
  const m = morph(t, BTN, { damping: 12, mass: 0.8 });
  const sel = lin(t, 3.0, 3.3, 0, 1);
  const menuP = t < 3.65 ? sp(t, 3.35) : 1 - lin(t, 3.65, 3.8, 0, 1);
  const flash = win(t, 3.6, 3.75, 0.05, 0.15);

  const toW = (x: number, y: number) => ({ x: WX + x, y: WY + y });
  const path = [
    { t: 0, ...toW(700, 500) },
    { t: 0.8, ...toW(1380, 80) },
    { t: 1.0, ...toW(ICON.x + 16, ICON.y + 16) },
    { t: 1.25, ...toW(ICON.x + 16, ICON.y + 16) },
    { t: 1.7, ...toW(1334, 167) },
    { t: 2.1, ...toW(1334, 167) },
    { t: 2.9, ...toW(QUOTE.x, QY + 14) },
    { t: 3.0, ...toW(QUOTE.x, QY + 14) },
    { t: 3.3, ...toW(QUOTE.x + QUOTE.w, QY + 14) },
    { t: 3.5, ...toW(QUOTE.x + 300, QY - 40) },
    { t: 4.2, ...toW(QUOTE.x + 300, QY - 40) },
  ];

  return (
    <Fill bg={C.desk}>
      <MBlur id="b-cam" bx={bx} by={by}>
        <Camera c={c}>
          {/* 浏览器窗口 */}
          <div style={{ position: 'absolute', left: WX, top: WY, width: 1500, height: 880, borderRadius: 14, background: '#fff', boxShadow: '0 40px 100px rgba(0,0,0,.25)', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, width: 1500, height: 44, background: '#DCDCDF', zIndex: 2 }}>
              {['#FF5F57', '#FEBC2E', '#28C840'].map((col, i) => <div key={i} style={{ position: 'absolute', left: 18 + i * 22, top: 15, width: 13, height: 13, borderRadius: '50%', background: col }} />)}
              <Tx x={110} y={10} s={16} c="#333">浏览器</Tx>
            </div>
            <div style={{ position: 'absolute', left: 0, top: 44, width: 1500, height: 48, background: '#F2F2F4', borderBottom: '1px solid #ddd', zIndex: 2 }}>
              <div style={{ position: 'absolute', left: 110, top: 9, width: 1200, height: 30, borderRadius: 15, background: '#fff', color: '#555', fontSize: 15, lineHeight: '30px', paddingLeft: 16 }}>zhuanlan.zhihu.com/p/7281…</div>
            </div>
            <div style={{ position: 'absolute', left: ICON.x, top: ICON.y, zIndex: 3, transform: `scale(${t > 1.1 && t < 1.22 ? 0.92 : 1})` }}>
              <Logo size={28} />
            </div>
            {/* 知乎页面 */}
            <div style={{ position: 'absolute', left: 0, top: 92 + scroll, width: 1500, height: 900 }}>
              <div style={{ position: 'absolute', left: 300, top: 20 }}><ZhihuHeader c={Z} /></div>
              <Tx x={QUOTE.x} y={300} s={30} c="#222" b>AI Agent 元年：普通人如何搭建自己的「第二大脑」？</Tx>
              <div style={{ position: 'absolute', left: QUOTE.x - 4, top: QUOTE.y - 4 - 92, width: QUOTE.w * sel + 8, height: 40, background: '#4A8EF955', borderRadius: 4, outline: flash > 0 ? `3px solid ${C.blue}` : undefined, opacity: t < 4.1 ? 1 : 0 }} />
              <Tx x={QUOTE.x} y={QUOTE.y - 92} s={22} c="#333">真正的第二大脑，不是收藏夹，而是能回答你问题的记忆</Tx>
              <div style={{ position: 'absolute', left: 300, top: 480 }}><ZhihuBody c={Z} /></div>
            </div>
            {/* 划词菜单 */}
            {menuP > 0 && (
              <div style={{ position: 'absolute', left: QUOTE.x + 180, top: QY - 62, padding: '8px 16px', borderRadius: 10, background: '#fff', boxShadow: '0 6px 24px rgba(0,0,0,.2)', color: '#222', fontSize: 18, display: 'flex', gap: 14, opacity: menuP, transform: `scale(${0.8 + 0.2 * menuP})` }}>
                <span>复制</span><span style={{ color: '#ccc' }}>|</span><b>保存到小黑</b>
              </div>
            )}
            {/* 插件浮动卡片 */}
            {t >= 1.2 && (
              <div style={{ position: 'absolute', left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h, borderRadius: 16, background: '#fff', boxShadow: '0 10px 40px rgba(0,0,0,.18)', transformOrigin: '100% 0', transform: `scale(${cardP})`, opacity: cardO }}>
                <div style={{ position: 'absolute', left: 16, top: 14, display: 'flex', alignItems: 'center', gap: 8, fontSize: 17, fontWeight: 700, color: '#111' }}><Logo size={18} />小黑</div>
                <div style={{ position: 'absolute', right: 16, top: 14, color: '#8F959E', fontSize: 16, letterSpacing: 8 }}>⌂✉⚙</div>
                <Tx x={16} y={104} s={15} c="#666">保存到：个人 / AI 研究</Tx>
                <Tx x={16} y={150} s={15} c="#666">指定区域 · 按住 ⌥</Tx>
                <div style={{ position: 'absolute', right: 16, top: 152, width: 36, height: 20, borderRadius: 10, background: '#ddd' }} />
              </div>
            )}
            {/* 保存按钮 → 加载 → 对勾 → 胶囊 toast（共享元素变形） */}
            {t >= 1.2 && (
              <div style={{ position: 'absolute', left: m.x, top: m.y, width: m.w, height: m.h, borderRadius: m.r, background: C.ink, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 600, transform: `scale(${(t < 2.0 ? cardP : 1) * (t > 1.8 && t < 1.92 ? 0.95 : 1)})`, whiteSpace: 'nowrap', overflow: 'hidden' }}>
                {t < 2.0 && '📦 保存到小黑'}
                {t >= 2.0 && t < 2.45 && <Spinner t={t} size={20} color="#fff" />}
                {t >= 2.45 && t < 2.65 && '✓'}
                {t >= 2.65 && <span style={{ opacity: lin(t, 2.7, 2.85, 0, 1), fontSize: 18 }}>✓ 已保存到该文件夹　<u>查看</u></span>}
              </div>
            )}
            {t >= 2.0 && t < 2.45 && <Tx x={1290} y={192} s={14} c="#888">保存中...</Tx>}
          </div>
          <Cursor t={t} path={path} clicks={[1.1, 1.8, 3.6]} size={34 / Math.max(1, c.s * 0.6)} />
        </Camera>
      </MBlur>
      <Caption t={t} a={3.2} b={4.1} text="一键收藏，整页或选区" align="left" x={100} y={900} color="#171717" />
    </Fill>
  );
};
