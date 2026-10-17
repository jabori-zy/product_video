import React from 'react';
import { LOCALES } from '../data/content';
import { useLang, useTr } from '../i18n';
import { ZhihuPage, zhihuQuote } from '../content/zhihu';
import { BrowserChrome } from '../content/browser';
import { EXT_BTN, EXT_H, EXT_SAVE_ICON, EXT_W, ExtIc, ExtPopup } from '../content/devices';
import { C, Camera, Caption, Cursor, Fill, Logo, MBlur, Spinner, Tx, camBlur, clamp01, inOut, kf, lin, morph, sp, win } from '../lib';


// B 一键收藏 · 浏览器插件（5.0–9.0 s），局部时间 t = 全局 − 5
// 世界坐标：浏览器窗口 (210,100) 1500×880；窗口内元素用窗口相对坐标
// 窗口是深色 Chrome（content/browser.tsx，对照真实插件录屏），工具栏右侧 (1440,56) 是小黑插件图标

const WX = 210, WY = 100;
const ICON = { x: 1440, y: 56 }; // 小黑插件图标（窗口相对，28×28）
// 插件弹窗：截图 assets/broswer_plugin.png 原尺寸 292×198（content/devices.tsx 的 ExtPopup），右缘贴着插件图标
const CARD = { x: 1478 - EXT_W, y: 100, w: EXT_W, h: EXT_H };

const CAM = [
  { t: 0, x: 960, y: 540, s: 0.92, rx: 6, ry: -14 },
  { t: 1.0, x: WX + ICON.x + 14, y: WY + ICON.y + 14, s: 3.5, rx: 0, ry: 0 },
  { t: 1.2, x: WX + ICON.x + 14, y: WY + ICON.y + 14, s: 3.5 },
  // 卡片弹出后一次移到卡片取景、停稳，再点击（1.8）；不先拉远再推近
  { t: 1.6, x: 1540, y: 270, s: 2.0 },
  { t: 2.0, x: 1540, y: 270, s: 2.0 },
  { t: 2.7, x: 1000, y: 330, s: 1.25 },
  { t: 3.0, x: 820, y: 540, s: 1.3 },
  { t: 3.6, x: 950, y: 560, s: 1.35 },
  { t: 4.2, x: 1000, y: 560, s: 1.35 },
];

const TOAST = { w: 262, h: 43, bg: '#18181B' };
const BTN = [
  { t: 0, x: CARD.x + EXT_BTN.x, y: CARD.y + EXT_BTN.y, w: EXT_BTN.w, h: EXT_BTN.h, r: EXT_BTN.r, bg: EXT_BTN.bg },
  // 保存成功 toast：按截图 assets/broswer_plugin_save_toast.png 1:1（262×43 黑色胶囊；中心与原来的 toast 一致）
  { t: 2.6, x: 750 - TOAST.w / 2, y: 112, w: TOAST.w, h: TOAST.h, r: TOAST.h / 2, bg: TOAST.bg },
];

const HOLD = 0.45, FOLLOW = 1.0; // 光标静止到 HOLD，HOLD → FOLLOW 移到插件图标（镜头同步跟拍）
// 跟拍：光标和镜头用同一条缓动，镜头中心从画面中央移到图标，缩放按指数插值（推近速度均匀）
const follow = (e: number) => {
  const a = CAM[0], b = CAM[1];
  return { x: a.x + (b.x - a.x) * e, y: a.y + (b.y - a.y) * e, s: a.s * Math.pow(b.s / a.s, e), rx: a.rx! * (1 - e), ry: a.ry! * (1 - e) };
};

const PAGE_Y = 92, PAGE_H = 788, SCROLL = 40; // 知乎页面在窗口里的位置；开场下滚 40

export const B: React.FC<{ t: number }> = ({ t }) => {
  const lang = useLang(), tr = useTr();
  const Z = LOCALES[lang]; // 线框里的真实内容（data/locales）
  // 引文位置由知乎页面排版算出（content/zhihu.tsx），选区、光标、划词菜单都跟着它
  const q = zhihuQuote(Z.zhihu, 1500);
  const QUOTE = { x: q.x, y: PAGE_Y + q.y };
  const QY = QUOTE.y - SCROLL; // 下滚后引文在窗口内的 y
  const QEND = { x: q.x + (q.lines > 1 ? q.lastW : q.w), y: QY + q.lineH * (q.lines - 0.5) };
  // 切到知乎后光标先停一下（到 HOLD），再由镜头一路跟着从画面中央推到右上角插件图标（连续推近、不甩镜、无运动模糊）；1.0 s 起按 CAM 关键帧
  const c = t < FOLLOW ? follow(inOut(clamp01((t - HOLD) / (FOLLOW - HOLD)))) : kf(t, CAM);
  const [bx, by] = t < FOLLOW + 0.2 ? [0, 0] : camBlur(t, CAM);
  const scroll = lin(t, 0, 0.8, 0, SCROLL);
  // 卡片和按钮作为一个整体从点击处（插件图标）向左下展开，同一个缩放中心，不淡入
  const cardP = sp(t, 1.2);
  const POP_C = { x: ICON.x + 16, y: ICON.y + 16 };
  const cardO = 1 - lin(t, 2.6, 2.9, 0, 1);
  const m = morph(t, BTN, { damping: 12, mass: 0.8 });
  // 真实点击：按下时轻微缩小、变暗，随即弹回（加载时按钮不再缩成圆点）
  const press = win(t, 1.8, 1.86, 0.04, 0.12);
  const sel = lin(t, 3.0, 3.3, 0, 1);
  const menuP = t < 3.65 ? sp(t, 3.35) : 1 - lin(t, 3.65, 3.8, 0, 1);
  const flash = win(t, 3.6, 3.75, 0.05, 0.15);

  const toW = (x: number, y: number) => ({ x: WX + x, y: WY + y });
  const path = [
    { t: 0, ...toW(700, 500) },
    { t: HOLD, ...toW(700, 500) },
    { t: FOLLOW, ...toW(ICON.x + 16, ICON.y + 16) },
    { t: 1.25, ...toW(ICON.x + 16, ICON.y + 16) },
    { t: 1.7, ...toW(CARD.x + EXT_BTN.x + EXT_BTN.w / 2, CARD.y + EXT_BTN.y + EXT_BTN.h / 2 + 2) },
    { t: 2.1, ...toW(CARD.x + EXT_BTN.x + EXT_BTN.w / 2, CARD.y + EXT_BTN.y + EXT_BTN.h / 2 + 2) },
    { t: 2.9, ...toW(QUOTE.x, QY + q.lineH / 2) },
    { t: 3.0, ...toW(QUOTE.x, QY + q.lineH / 2) },
    { t: 3.3, ...toW(QEND.x, QEND.y) },
    { t: 3.5, ...toW(QUOTE.x + 300, QY - 40) },
    { t: 4.2, ...toW(QUOTE.x + 300, QY - 40) },
  ];

  return (
    <Fill bg={C.desk}>
      <MBlur id="b-cam" bx={bx} by={by}>
        <Camera c={c}>
          {/* 浏览器窗口 */}
          <div style={{ position: 'absolute', left: WX, top: WY, width: 1500, height: 880, borderRadius: 14, background: '#fff', boxShadow: '0 40px 100px rgba(0,0,0,.25)', overflow: 'hidden' }}>
            <BrowserChrome w={1500} title={`${Z.zhihu.title} - ${Z.zhihu.site}`} url="zhuanlan.zhihu.com/p/7281…" logo={false} />
            <div style={{ position: 'absolute', left: ICON.x, top: ICON.y, zIndex: 3, transform: `scale(${t > 1.1 && t < 1.22 ? 0.92 : 1})` }}>
              <Logo size={28} />
            </div>
            {/* 知乎页面（按真实网页还原，选区画在引文底下） */}
            <div style={{ position: 'absolute', left: 0, top: PAGE_Y, width: 1500, height: PAGE_H }}>
              <ZhihuPage c={Z} w={1500} h={PAGE_H} scroll={scroll} sel={t < 4.1 ? sel : 0} selOutline={flash > 0 ? C.blue : undefined} />
            </div>
            {/* 划词菜单 */}
            {menuP > 0 && (
              <div style={{ position: 'absolute', left: QUOTE.x + 180, top: QY - 62, padding: '8px 16px', borderRadius: 10, background: '#fff', boxShadow: '0 6px 24px rgba(0,0,0,.2)', color: '#222', fontSize: 18, display: 'flex', gap: 14, opacity: menuP, transform: `scale(${0.8 + 0.2 * menuP})` }}>
                <span>{tr('复制', 'Copy')}</span><span style={{ color: '#ccc' }}>|</span><b>{tr('保存到小黑', 'Save to Xiaohei')}</b>
              </div>
            )}
            {/* 插件浮动卡片 */}
            {t >= 1.2 && (
              <div style={{ position: 'absolute', left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h, borderRadius: 12, background: '#fff', boxShadow: '0 10px 40px rgba(0,0,0,.18)', transformOrigin: `${POP_C.x - CARD.x}px ${POP_C.y - CARD.y}px`, transform: `scale(${cardP})`, opacity: cardO }}>
                <ExtPopup d={Z.devices.ext} button={false} />
              </div>
            )}
            {/* 保存按钮 → 加载 → 对勾 → 胶囊 toast（共享元素变形） */}
            {t >= 1.2 && (
              // 外层：跟弹窗一起从插件图标处展开；内层：按下时绕按钮自身中心轻微缩小
              <div style={{ position: 'absolute', left: m.x, top: m.y, width: m.w, height: m.h, transformOrigin: t < 2.0 ? `${POP_C.x - m.x}px ${POP_C.y - m.y}px` : '50% 50%', transform: `scale(${t < 2.0 ? cardP : 1})` }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: m.r, background: m.bg, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 14, fontWeight: 600, transform: `scale(${1 - 0.03 * press})`, filter: press > 0 ? `brightness(${1 - 0.25 * press})` : undefined, whiteSpace: 'nowrap', overflow: 'hidden' }}>
                  {t < 2.0 && <><ExtIc d={EXT_SAVE_ICON} s={16} c="#fff" w={2} />{Z.devices.ext.save}</>}
                  {t >= 2.0 && t < 2.45 && <><Spinner t={t} size={16} color="#fff" />{tr('保存中…', 'Saving…')}</>}
                  {t >= 2.45 && t < 2.65 && '✓'}
                  {t >= 2.65 && (
                    // toast：绿色圆形对勾 + 已保存到该文件夹 · 右侧灰色「查看」按钮
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 9px 0 13px', gap: 8, opacity: lin(t, 2.7, 2.85, 0, 1), fontSize: 14, fontWeight: 500 }}>
                      <span style={{ width: 16, height: 16, borderRadius: '50%', background: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><ExtIc d="M20 6L9 17l-5-5" s={10} c="#fff" w={3.5} /></span>
                      <span style={{ flex: 1 }}>{tr('已保存到该文件夹', 'Saved to this folder')}</span>
                      <span style={{ height: 26, padding: '0 14px', borderRadius: 13, background: '#3F3F46', color: '#E4E4E7', fontSize: 13, lineHeight: '26px' }}>{tr('查看', 'View')}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          {/* 光标压在插件图标（zIndex 3）之上：推近到图标时不能被图标盖住 */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 4 }}>
            <Cursor t={t} path={path} clicks={[1.1, 1.8, 3.6]} size={34 / Math.max(1, c.s * 0.6)} />
          </div>
        </Camera>
      </MBlur>
      <Caption t={t} a={3.2} b={4.1} text={tr('一键收藏，整页或选区', 'One click. A whole page or just a selection.')} align="left" x={100} y={900} plate />
    </Fill>
  );
};
