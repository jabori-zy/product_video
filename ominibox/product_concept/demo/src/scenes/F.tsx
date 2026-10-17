import React from 'react';
import { C, Caption, Cursor, Fill, Logo, Tx, inOut, lin, morph, sp } from '../lib';
import { useTr } from '../i18n';
import { Ic } from '../omni/root';

/** 空间卡片里的资源图标（22px；remixicon 文件图标在产品里 scale-125） */
const SpaceIc: React.FC<{ n: string }> = ({ n }) => (
  <Ic n={n} style={{ width: 22, height: 22, flexShrink: 0, color: '#525252', transform: ['res-audio', 'res-pdf', 'res-image', 'res-video'].includes(n) ? 'scale(1.25)' : undefined }} />
);
import { SHARE } from './E';
import { F_CLICKS, F_K as K } from './F.times';

// F 分享协作（30.0–35.0 s），局部时间 t = 全局 − 30。米白画布，一个组件连续变形（参考 3）

const ST = [
  { t: -0.2, cx: SHARE.x, cy: SHARE.y, w: SHARE.w, h: SHARE.h, r: 8, bg: '#F4F4F5' }, // E 资源页顶栏的「分享」按钮（浅色网页里的悬停底色 --accent，72×32 产品像素）
  { t: -0.15, cx: 960, cy: 540, w: 220, h: 72, r: 36, bg: '#171717' }, // 胶囊按钮
  { t: 0.5, cx: 960, cy: 540, w: 640, h: Math.round(365 * (640 / 455)), r: 12, bg: '#FFFFFF' }, // 分享弹窗（assets/share.png 455×365 等比放大）
  { t: 2.0, cx: 960, cy: 540, w: 460, h: 64, r: 32, bg: '#171717' }, // 链接胶囊
  { t: 2.5, cx: 960, cy: 520, w: 560, h: 210, r: 14, bg: '#FFFFFF' }, // 微信链接卡片（标题 / 摘要 + 缩略图 / 来源）
  { t: 3.4, cx: 960, cy: 560, w: 900, h: 460, r: 28, bg: '#FFFFFF' }, // 团队空间
];

// ---- 分享弹窗（assets/share.png）：截图像素坐标，SHARE_K 放大 ----
const SW = 455, SH = 365, SHARE_K = 640 / SW;
const SHARE_URL = 'https://www.omnibox.pro/s/GFJq2O8GOP';
/** 截图坐标 → 画布坐标（卡片中心 960, 540） */
const S2C = (x: number, y: number) => ({ x: 960 - 320 + x * SHARE_K, y: 540 - (SH * SHARE_K) / 2 + y * SHARE_K });
const Glyph: React.FC<{ d: string; s?: number; c?: string }> = ({ d, s = 14, c = '#171717' }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}><path d={d} /></svg>
);
/** 开关 36×20：开 = 黑底，关 = 浅灰（截图里关着的开关偏淡） */
const Switch: React.FC<{ x: number; y: number; on: number }> = ({ x, y, on }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: 36, height: 20, borderRadius: 10, background: on > 0.5 ? '#171717' : '#E5E5E5' }}>
    <div style={{ position: 'absolute', top: 2, left: 2 + Math.min(1, on) * 16, width: 16, height: 16, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,.2)' }} />
  </div>
);
const Label: React.FC<{ y: number; help?: boolean; children: React.ReactNode }> = ({ y, help, children }) => (
  <div style={{ position: 'absolute', left: 17, top: y - 10, height: 20, display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, whiteSpace: 'nowrap' }}>
    {children}{help && <Glyph d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01" s={12} c="#737373" />}
  </div>
);
const Select: React.FC<{ x: number; y: number; w: number; muted?: boolean; children: React.ReactNode }> = ({ x, y, w, muted, children }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: 24, borderRadius: 6, border: '1px solid #E5E5E5', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px 0 13px', fontSize: 13, color: muted ? '#A3A3A3' : '#171717', whiteSpace: 'nowrap' }}>
    {children}<Glyph d="M6 9l6 6 6-6" s={13} c={muted ? '#A3A3A3' : '#737373'} />
  </div>
);

// ---- 弹窗里的二级操作：按 shadcn Popover 的交互（锚在触发按钮旁、不压暗背景、fade + zoom 95→100），不用 Dialog ----
// 内容照 assets/share.mp4 的「过期时间」「密码」面板；尺寸用 CSS 像素，PK 放大到画布。
// 位置 = side bottom + align end：弹层右上角对齐触发控件的右下角（间距 4px）；日历展开后画面放不下时镜头拉远上移（fitCam）
const PK = 1.4, POP_W = 260;
const EXP_H0 = 156, EXP_H1 = 354, PW_H = 180; // 过期时间：永不过期（Tab + 提示 + 保存）/ 指定日期（Tab + 日历 + 保存）；密码
const WARN_H = 32; // 「永不过期」Tab 下的提示文字
const EXP_TABS_Y = 16, EXP_BODY_Y = 64; // 过期时间弹层（不带标题）：Tab 栏（h 36）、Tab 内容起点
/** 弹层定位：(rx, by) = 触发控件的右下角（画布坐标）→ 弹层右上角贴在它正下方 */
const popBox = (rx: number, by: number, hCss: number) => {
  const h = hCss * PK, w = POP_W * PK;
  return { left: rx - w, top: by + 4 * PK, w, h };
};
/** 镜头：把 [top, bottom]（未缩放的舞台坐标）放进画面 230–1050（上面留给标题），返回额外缩放和上移 */
const fitCam = (zoom: number, top: number, bottom: number) => {
  const a = (top - 540) * zoom, b = (bottom - 540) * zoom;
  const s = Math.min(1, 820 / (b - a));
  const ty = Math.max(230 - (540 + a * s), Math.min(0, 1050 - (540 + b * s)));
  return { s, ty };
};
/** 弹层内（CSS 像素）→ 画布 */
const popXY = (b: { left: number; top: number }, x: number, y: number) => ({ x: b.left + x * PK, y: b.top + y * PK });
const Popover: React.FC<{ box: { left: number; top: number; w: number; h: number }; o: number; children: React.ReactNode }> = ({ box, o, children }) => o <= 0 ? null : (
  <div style={{ position: 'absolute', left: box.left, top: box.top, width: box.w, height: box.h, opacity: o, transform: `scale(${0.95 + 0.05 * o})`, transformOrigin: 'right top', zIndex: 5 }}>
    <div style={{ position: 'absolute', left: 0, top: 0, width: POP_W, height: box.h / PK, transform: `scale(${PK})`, transformOrigin: '0 0', background: '#fff', border: '1px solid #E5E5E5', borderRadius: 6, boxShadow: '0 4px 6px -1px rgba(0,0,0,.1), 0 2px 4px -2px rgba(0,0,0,.1)', boxSizing: 'border-box', color: '#171717', fontSize: 14 }}>{children}</div>
  </div>
);
const Btn: React.FC<{ y: number; press?: boolean; children: React.ReactNode }> = ({ y, press, children }) => (
  <div style={{ position: 'absolute', left: 16, top: y, width: POP_W - 32, height: 32, borderRadius: 6, background: press ? '#404040' : '#171717', color: '#fff', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{children}</div>
);
/** shadcn Calendar：2026 年 10 月（今天 10/17，之前的日子不可选），sel = 选中的日 */
const Calendar: React.FC<{ y: number; o: number; sel: number | null }> = ({ y, o, sel }) => {
  const cw = (POP_W - 32 - 24) / 7;
  const days = [27, 28, 29, 30, ...Array.from({ length: 31 }, (_, i) => i + 1)];
  return (
    <div style={{ position: 'absolute', left: 16, top: y, width: POP_W - 32, height: 230, borderRadius: 6, border: '1px solid #E5E5E5', boxSizing: 'border-box', opacity: o, fontSize: 12 }}>
      <div style={{ position: 'absolute', left: 12, right: 12, top: 10, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 500, fontSize: 13 }}>
        <Glyph d="M15 6l-6 6 6 6" s={14} c="#737373" />October 2026<Glyph d="M9 6l6 6-6 6" s={14} c="#737373" />
      </div>
      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, i) => <div key={d} style={{ position: 'absolute', left: 12 + i * cw, top: 44, width: cw, textAlign: 'center', color: '#737373', fontSize: 11 }}>{d}</div>)}
      {days.map((d, i) => {
        const out = i < 4, past = out || d < 18, on = !out && d === sel;
        return <div key={i} style={{ position: 'absolute', left: 12 + (i % 7) * cw + (cw - 26) / 2, top: 66 + Math.floor(i / 7) * 30, width: 26, height: 26, borderRadius: 6, lineHeight: '26px', textAlign: 'center', background: on ? '#171717' : undefined, color: on ? '#fff' : past ? '#C4C4C4' : '#171717' }}>{d}</div>;
      })}
    </div>
  );
};
/** 日历里第 d 天的中心（弹层 CSS 像素） */
const dayXY = (d: number) => { const i = d + 3, cw = (POP_W - 32 - 24) / 7; return { x: 16 + 12 + (i % 7) * cw + cw / 2, y: EXP_BODY_Y + 66 + Math.floor(i / 7) * 30 + 13 }; };

/** shadcn Tabs：TabsList（muted 底、p-1、h-9）+ 等宽 TabsTrigger，选中的白底带阴影 */
const TAB_W = (POP_W - 32 - 8) / 3;
const tabX = (i: number) => 16 + 4 + TAB_W * (i + 0.5);
const Tabs: React.FC<{ y: number; items: string[]; active: number }> = ({ y, items, active }) => (
  <div style={{ position: 'absolute', left: 16, top: y, width: POP_W - 32, height: 36, borderRadius: 8, background: '#F4F4F5', padding: 4, boxSizing: 'border-box', display: 'flex' }}>
    {items.map((x, i) => (
      <div key={x} style={{ width: TAB_W, height: 28, borderRadius: 6, lineHeight: '28px', textAlign: 'center', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', background: i === active ? '#fff' : undefined, color: i === active ? '#171717' : '#737373', boxShadow: i === active ? '0 1px 2px rgba(0,0,0,.08)' : undefined }}>{x}</div>
    ))}
  </div>
);

const AVA = ['#F97316', '#22C55E', '#8B5CF6', '#0EA5E9'];

export const Ff: React.FC<{ t: number }> = ({ t }) => {
  const tr = useTr();
  const m = morph(t, ST, { damping: 13, mass: 0.8 });
  const press = t > 0.3 && t < 0.42 ? 0.95 : 1; // 只有点「分享」胶囊时整块按下；弹窗里的点击不缩放整张卡
  const stage = m._i;
  const cin = (i: number) => (stage === i ? lin(m._p, 0.4, 1, 0, 1) : 0);
  const zoom = lin(t, 2.5, 5.0, 1.06, 0.94);
  const copied = t > K.copy; // 点复制按钮后图标变成对勾
  // 过期时间弹层：点按钮打开 → 点「过期类型」→ 选「指定日期」→ 日历展开 → 点 24 日 → 保存（关闭，按钮显示日期）
  const expO = Math.min(lin(t, K.exp, K.exp + 0.03, 0, 1), 1 - lin(t, K.expSave, K.expSave + 0.03, 0, 1));
  const cal = lin(t, K.pick, K.pick + 0.05, 0, 1, inOut);
  const EXP_AT = S2C(438, 267); // 「过期时间」按钮右下角
  const expBox = popBox(EXP_AT.x, EXP_AT.y, EXP_H0 + (EXP_H1 - EXP_H0) * cal);
  const box0 = popBox(EXP_AT.x, EXP_AT.y, EXP_H0), box1 = popBox(EXP_AT.x, EXP_AT.y, EXP_H1);
  const dated = t > K.expSave;
  // 密码保护：点开关 → 开关打开 + 密码弹层 → 自动填两遍密码 → 保存
  const pwOn = lin(t, K.pw, K.pw + 0.03, 0, 1);
  const pwO = Math.min(lin(t, K.pw, K.pw + 0.03, 0, 1), 1 - lin(t, K.pwSave, K.pwSave + 0.03, 0, 1));
  const PW_AT = S2C(439, 344); // 「密码保护」开关右下角
  const pwBox = popBox(PW_AT.x, PW_AT.y, PW_H);
  // 镜头跟着日历：展开时把卡片和弹层一起放进画面，保存关闭后回原位
  const cardTop = 540 - (SH * SHARE_K) / 2;
  const camP = Math.min(cal, 1 - lin(t, K.expSave, K.expSave + 0.06, 0, 1, inOut));
  const fit = fitCam(zoom, cardTop, box1.top + box1.h);
  const camS = 1 + (fit.s - 1) * camP, camY = fit.ty * camP;
  const dots = (a: number) => '•'.repeat(Math.round(lin(t, a, a + 0.08, 0, 8)));

  // 点击：分享胶囊 → 需要登录 → 过期时间（指定日期）→ 密码保护 → 复制链接（截图坐标经 S2C、弹层坐标经 popXY 换到画布）
  const path = [
    { t: 0, x: 1300, y: 820 }, { t: 0.28, x: 960, y: 548 }, { t: 0.6, x: 1080, y: 600 }, { t: K.login - 0.02, ...S2C(421, 214) },
    { t: K.exp - 0.02, ...S2C(395, 255) }, { t: K.pick - 0.02, ...popXY(box0, tabX(1), EXP_TABS_Y + 18) },
    { t: K.day - 0.02, ...popXY(box1, dayXY(24).x, dayXY(24).y) }, { t: K.expSave - 0.02, ...popXY(box1, 130, EXP_BODY_Y + 242 + 16) },
    { t: K.pw - 0.02, ...S2C(421, 334) }, { t: K.pw + 0.1, ...S2C(421, 334) }, { t: K.pwSave - 0.02, ...popXY(pwBox, 130, 148) },
    { t: K.copy - 0.02, ...S2C(380, 89) }, { t: 2.4, x: 1300, y: 760 }, { t: 3.2, x: 1400, y: 820 },
  ];

  return (
    <Fill bg={C.canvas}>
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${camY}px) scale(${zoom * camS})`, transformOrigin: '960px 540px' }}>
        {/* 4 个成员头像：先在微信卡片旁冒出，再飞进团队空间表头 */}
        {AVA.map((col, i) => {
          const a = 2.7 + i * 0.2;
          if (t < a) return null;
          const p = sp(t, a);
          const f = lin(t, 3.4 + i * 0.05, 3.7 + i * 0.05, 0, 1);
          const x0 = 1290 + (i % 2) * 70, y0 = 430 + Math.floor(i / 2) * 70;
          // 落点：团队空间卡片里「团队」一栏的表头右侧（缩到 0.7 后约 39 px，间距 34，右对齐在团队框内）
          const x1 = 1306 - (3 - i) * 34, y1 = 422;
          return <div key={i} style={{ position: 'absolute', left: x0 + (x1 - x0) * f, top: y0 + (y1 - y0) * f, width: 56, height: 56, borderRadius: '50%', background: col, border: '3px solid #fff', color: '#fff', fontSize: 22, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${p * (1 - 0.3 * f)})`, zIndex: 2 }}>{tr('林王陈李', 'LWCL')[i]}</div>;
        })}

        {/* 变形中的组件 */}
        <div style={{ position: 'absolute', left: m.cx - m.w / 2, top: m.cy - m.h / 2, width: m.w, height: m.h, borderRadius: m.r, background: m.bg, boxShadow: '0 20px 60px rgba(0,0,0,.12)', overflow: 'hidden', transform: `scale(${press})` }}>
          {stage <= 1 && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 28, fontWeight: 700, whiteSpace: 'nowrap' }}><Ic n="share16" style={{ width: 30, height: 30, color: '#fff' }} /><span style={{ marginLeft: 10, opacity: lin(m.w, 60, 200, 0, 1) }}>{tr('分享', 'Share')}</span></div>}
          {stage === 2 && (
            // 分享弹窗：按产品截图 assets/share.png 1:1（截图 455×365 像素，整体按 SHARE_K 放大到卡片宽 640）
            <div style={{ position: 'absolute', left: 0, top: 0, width: SW, height: SH, transform: `scale(${SHARE_K})`, transformOrigin: '0 0', opacity: cin(2), color: '#171717', fontSize: 14 }}>
              <div style={{ position: 'absolute', left: 0, top: 0, width: SW + 40, height: 46, background: '#FAFAFA', borderBottom: '1px solid #E5E5E5' }}>{/* 比截图宽：卡片弹簧落定前略宽，顶栏也要铺满 */}
                <div style={{ position: 'absolute', left: 22, width: 78, top: 0, height: 46, lineHeight: '46px', textAlign: 'center', fontSize: 14, fontWeight: 500 }}>{tr('分享', 'Share')}</div>
                <div style={{ position: 'absolute', left: 22, width: 78, bottom: -1, height: 2, background: '#171717' }} />
              </div>
              {/* 链接 + 复制 + 总开关 */}
              <div style={{ position: 'absolute', left: 17, top: 71, width: 340, height: 35, borderRadius: 8, border: '1px solid #E5E5E5', boxSizing: 'border-box', padding: '0 16px', lineHeight: '33px', fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden' }}>{SHARE_URL}</div>
              <div style={{ position: 'absolute', left: 366, top: 74, width: 28, height: 30, borderRadius: 6, border: '1px solid #E5E5E5', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', background: copied ? '#F4F4F5' : '#fff' }}>
                {copied ? <Glyph d="M20 6L9 17l-5-5" /> : <Glyph d="M9 9h10v12H9zM5 15V3h10" />}
              </div>
              <Switch x={403} y={79} on={1} />
              {/* 设置项 */}
              <Label y={133} help>{tr('仅分享当前文件', 'Share current file only')}</Label>
              <Switch x={403} y={123} on={1} />
              <Label y={174} help>{tr('排序方式', 'Sort by')}</Label>
              <Select x={263} y={162} w={175} muted>{tr('更新时间 从新到旧', 'Updated · newest first')}</Select>
              <Label y={214} help>{tr('需要登录', 'Require login')}</Label>
              <Switch x={403} y={204} on={lin(t, K.login, K.login + 0.03, 0, 1)} />
              <Label y={255}>{tr('过期时间', 'Expiration')}</Label>
              <div style={{ position: 'absolute', right: 17, top: 243, height: 24, padding: '0 16px', borderRadius: 6, border: '1px solid #E5E5E5', background: '#F4F4F5', lineHeight: '22px', fontSize: 13, fontWeight: 500, boxSizing: 'border-box', whiteSpace: 'nowrap' }}>{dated ? '2026-10-24' : tr('永不过期', 'Never expires')}</div>
              <Label y={295}>{tr('AI 问答', 'AI Q&A')}</Label>
              <Select x={295} y={284} w={143}>{tr('禁用', 'Disabled')}</Select>
              <Label y={334}>{tr('密码保护', 'Password protection')}</Label>
              <Switch x={403} y={324} on={pwOn} />
            </div>
          )}
          {stage === 3 && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 24, fontWeight: 600, opacity: cin(3), whiteSpace: 'nowrap' }}>omnibox.pro/s/GFJq2O8GOP　✓</div>}
          {stage === 4 && (
            // 微信里的链接卡片：标题、摘要 + 右侧缩略图，分隔线下是来源
            <div style={{ position: 'absolute', left: 0, top: 0, width: 560, height: 210, opacity: cin(4) }}>
              <div style={{ position: 'absolute', left: 26, top: 22, right: 26, fontSize: 25, fontWeight: 500, color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tr('来自小黑 OmniBox 的对话', 'Shared from Xiaohei OmniBox')}</div>
              <div style={{ position: 'absolute', left: 26, top: 68, width: 380, fontSize: 18, lineHeight: 1.5, color: '#8A8A8A' }}>{tr('收藏资料里的 AI Agent 趋势 · 小黑 OmniBox，你的 AI 知识伙伴', 'AI agent trends in my saves · Xiaohei OmniBox, your AI knowledge companion')}</div>
              <div style={{ position: 'absolute', right: 26, top: 66, width: 72, height: 72, borderRadius: 4, overflow: 'hidden' }}><Logo size={72} /></div>
              <div style={{ position: 'absolute', left: 26, right: 26, top: 160, height: 1, background: '#EDEDED' }} />
              <div style={{ position: 'absolute', left: 26, top: 172, display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, color: '#9A9A9A' }}><Logo size={20} style={{ borderRadius: 4 }} />{tr('小黑 OmniBox', 'Xiaohei OmniBox')}</div>
            </div>
          )}
          {stage === 5 && (
            <div style={{ position: 'absolute', left: 0, top: 0, width: 900, height: 460, opacity: cin(5) }}>
              <Tx x={40} y={30} s={26} c="#111" b>{tr('空间', 'Spaces')}</Tx>
              <div style={{ position: 'absolute', left: 40, top: 90, width: 390, height: 330, borderRadius: 16, background: '#F4F4F5' }} />
              <div style={{ position: 'absolute', left: 470, top: 90, width: 390, height: 330, borderRadius: 16, background: '#EEF4FF', border: `2px solid ${C.blue}` }} />
              <Tx x={64} y={106} s={22} c="#111" b>{tr('个人', 'Personal')}</Tx>
              <Tx x={494} y={106} s={22} c={C.blue} b>{tr('团队', 'Team')}</Tx>
              {/* 资源图标用产品里的真实图标（omni/svg.ts，与网页端资源树同一套），不用 emoji */}
              {tr(['我的随手记', '读书笔记', '旅行计划'], ['My quick notes', 'Reading notes', 'Travel plans']).map((s, i) => (
                <div key={s} style={{ position: 'absolute', left: 64, top: 160 + i * 50, display: 'flex', alignItems: 'center', gap: 10, fontSize: 20, color: '#555', lineHeight: 1.4 }}><SpaceIc n="res-doc" />{s}</div>
              ))}
              {([['folder', tr('AI 研究', 'AI research')], ['res-audio', tr('周会录音.m4a', 'Weekly Meeting Recording.m4a')], ['res-doc', tr('AI 动态周报 · 第 40 周', 'AI Weekly Brief · Week 40')], ['res-bilibili', tr('10 分钟看懂 RAG', 'Understand RAG in 10 Minutes')]] as const).map(([n, s], i) => (
                <div key={s} style={{ position: 'absolute', left: 494, top: 160 + i * 50, display: 'flex', alignItems: 'center', gap: 10, fontSize: 20, color: '#222', lineHeight: 1.4, opacity: lin(t, 3.6 + i * 0.15, 3.75 + i * 0.15, 0, 1), transform: `translateX(${lin(t, 3.6 + i * 0.15, 3.75 + i * 0.15, 20, 0)}px)` }}><SpaceIc n={n} />{s}</div>
              ))}
            </div>
          )}
        </div>
        {/* 过期时间弹层 */}
        <Popover box={expBox} o={expO}>
          <Tabs y={EXP_TABS_Y} items={[tr('永不过期', 'Never'), tr('指定日期', 'Date'), tr('倒计时', 'Countdown')]} active={t > K.pick ? 1 : 0} />
          {/* 「永不过期」Tab 的内容：一行提示文字（muted 色）；切到「指定日期」后换成日历 */}
          {cal < 1 && (
            <div style={{ position: 'absolute', left: 16, top: EXP_BODY_Y, width: POP_W - 32, height: WARN_H, lineHeight: `${WARN_H}px`, fontSize: 12, color: '#737373', whiteSpace: 'nowrap', opacity: 1 - lin(cal, 0, 0.4, 0, 1) }}>
              {tr('注意：此分享将永久有效', 'Note: This share will be permanently valid')}
            </div>
          )}
          <Calendar y={EXP_BODY_Y} o={cal} sel={t > K.day ? 24 : null} />
          <Btn y={EXP_BODY_Y + WARN_H + 12 + (242 - WARN_H - 12) * cal} press={t > K.expSave && t < K.expSave + 0.02}>{tr('保存', 'Save')}</Btn>
        </Popover>
        {/* 密码弹层 */}
        <Popover box={pwBox} o={pwO}>
          <div style={{ position: 'absolute', left: 16, top: 16, fontWeight: 600 }}>{tr('密码', 'Password')}</div>
          {[[tr('密码', 'Password'), K.pw + 0.04], [tr('确认密码', 'Confirm password'), K.pw + 0.14]].map(([ph, a], i) => {
            const v = dots(a as number), focus = t > (a as number) - 0.01 && t < (a as number) + 0.1;
            return <div key={i} style={{ position: 'absolute', left: 16, top: 48 + i * 40, width: POP_W - 32, height: 32, borderRadius: 6, border: `1px solid ${focus ? '#A3A3A3' : '#E5E5E5'}`, boxSizing: 'border-box', padding: '0 12px', lineHeight: '30px', fontSize: 13, color: v ? '#171717' : '#A3A3A3', letterSpacing: v ? 1 : 0 }}>{v || ph}</div>;
          })}
          <Btn y={132} press={t > K.pwSave && t < K.pwSave + 0.02}>{tr('保存', 'Save')}</Btn>
        </Popover>
        {/* 光标压在弹层（zIndex 5）之上 */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 6 }}><Cursor t={t} path={path} clicks={F_CLICKS} show={[0, 3.2]} k={2.25} /></div>
      </div>
      <Caption t={t} a={0.8} b={2.0} text={tr('分享出去，AI 一起带走', 'Share your knowledge. Take AI along.')} y={130} size={tr(60, 54)} color="#171717" />
      <Caption t={t} a={3.0} b={4.8} text={tr('一个人的第二大脑，一群人的知识库', 'A second brain for you. A knowledge base for your team.')} y={130} size={tr(60, 50)} color="#171717" />
    </Fill>
  );
};
