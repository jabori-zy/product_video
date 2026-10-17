import React from 'react';
import { AbsoluteFill, interpolateColors } from 'remotion';
import { C, Caption, Spinner, blinkAt, inOut, kf, lin, typed } from '../lib';
import { Main } from '../Main';
import { CatPeek } from '../peek';
import { LOCALES } from '../data/content';
import { useLang, useRes, useTr } from '../i18n';
import { TYPED, stepOf, txt, type ResKey } from '../copy';
import { CAM_FULL, CAM_WIDE, Laptop, PHONE, Phone, Stage, pageToWorld, phoneToWorld } from '../mobile/stage';
import { Omni, Row as WebRow, rowRect, rowTop } from '../ui';
import { Badge, BottomBar, ChatComposer, ChatHistoryList, ContentTabs, Disclaimer, HomeComposer, HomeHeader, Ic, M, PH, PW, ResRow, ResToolbar, Sheet, StatusBar, Tap, ThreadHeader, spr, HOME, ResLabel, rowCenter } from '../mobile/ui';

// E+ 跨端接力（插在 E 26.45 s：周报刚存进资源树）：周报从电脑屏幕里浮起、变形落进手机 → 手机上读周报、
// 切到「对话」接着问、点引用看来源 → 回到电脑，接 E 的 Agent 归档
export const M2_AT = 26.45;
const CAM_PHONE = { x: 1520, y: 560, s: 1.32 };
// final：读周报、输入追问、看回答、看引用时分别推近手机对应区域
// ---- 手机 → 电脑：对话框拉宽成网页首页的输入框，手机边框随屏幕一起拉到满屏后消失，最后小黑从输入框后面探出 ----
const CAM_COMP = { x: PHONE.x, y: 764, s: 2.44 }; // 对话框在画面下半、手机宽约 760
const MORPH = { a: 13.2, b: 14.3 }, FROZEN_IN = { a: 14.1, b: 14.35 }, PEEK = { a: 14.45, b: 14.95 };
const toScreen = (p: { x: number; y: number }) => ({ x: (p.x - CAM_COMP.x) * CAM_COMP.s + 960, y: (p.y - CAM_COMP.y) * CAM_COMP.s + 540 });
const PK2 = PHONE.k * CAM_COMP.s; // 手机像素 → 画面像素
const PHONE_SCR = (() => { const a = toScreen(phoneToWorld(0, 0)); return { x: a.x, y: a.y, w: PW * PK2, h: PH * PK2, r: 52 * PK2 }; })();
const PHONE_COMP = (() => { const a = toScreen(phoneToWorld(12, PH - 44 - 96)); return { x: a.x, y: a.y, w: (PW - 24) * PK2, h: 96 * PK2, r: 20 * PK2 }; })();
/** 电脑首页（E 26.45 定格帧）里输入框的边框盒（画布像素，按定格帧量） */
const PC_COMP = { x: 615, y: 441, w: 1020, h: 159, r: 21 };
const mix = (a: number, b: number, e: number) => a + (b - a) * e;

const CAM_TOP = { x: 1590, y: 470, s: 1.75 }, CAM_BOTTOM = { x: 1590, y: 700, s: 1.9 }, CAM_SHEET = { x: 1590, y: 655, s: 1.75 };
const CAM = [
  { t: 0, ...CAM_FULL }, { t: 1.3, ...CAM_WIDE }, { t: 3.0, ...CAM_WIDE }, { t: 3.6, ...CAM_PHONE },
  { t: 3.9, ...CAM_TOP }, { t: 5.1, ...CAM_TOP }, { t: 5.35, ...CAM_PHONE }, { t: 7.1, ...CAM_PHONE },
  { t: 7.45, ...CAM_BOTTOM }, { t: 8.5, ...CAM_BOTTOM }, { t: 8.9, ...CAM_TOP }, { t: 10.6, ...CAM_TOP },
  { t: 11.0, ...CAM_SHEET }, { t: 12.15, ...CAM_SHEET }, // 引用阅读面板（手机 y 240 到底）整块入画
  // 回电脑：不拉远，推近手机的对话框（12.45 → 13.2），随后手机屏幕和对话框一起拉宽成电脑首页（见 MORPH）
  { t: 12.45, ...CAM_BOTTOM }, { t: 13.2, ...CAM_COMP },
];
// 电脑侧栏里「AI 动态周报 · 第 40 周」那一行（原片 E 资源树第 9 行，下标 8）：直接取资源树版式（画布像素），不手填
const WEEKLY_ROW = 8;
const ROW_SCREEN = rowRect(WEEKLY_ROW);
const PHONE_ROWS: [string, ResKey][] = [['📝', 'weekly'], ['🎙', 'meeting'], ['🖼', 'board'], ['📕', 'q3'], ['🌐', 'agentYear']];

/** 手机上的周报正文（与电脑生成的同一份） */
const DocBody: React.FC<{ scroll?: number }> = ({ scroll = 0 }) => {
  const R = LOCALES[useLang()].report;
  return (
  <div style={{ position: 'absolute', left: 20, right: 20, top: 116 + scroll, color: M.text }}>
    <div style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.3 }}>{R.title}</div>
    <div style={{ fontSize: 13, color: M.sub, marginTop: 8 }}>{R.toc}</div>
    {[[R.heads[0], R.highlights], [R.heads[1], R.sources]].map(([h, items]) => (
      <div key={h as string}>
        <div style={{ fontSize: 18, fontWeight: 700, marginTop: 22 }}>{h}</div>
        {(items as string[]).map((s, i) => <div key={s} style={{ display: 'flex', gap: 8, fontSize: 14.5, lineHeight: 1.6, color: '#404040', marginTop: 6 }}><span style={{ color: C.blue, fontWeight: 700 }}>{i + 1}.</span><span>{s}</span></div>)}
      </div>
    ))}
    <div style={{ fontSize: 18, fontWeight: 700, marginTop: 22 }}>{R.heads[2]}</div>
    <div style={{ marginTop: 10, borderRadius: 10, overflow: 'hidden', border: `1px solid ${M.line}` }}>
      {[R.cols, ...R.todos].map((row, i) => (
        <div key={i} style={{ display: 'flex', fontSize: 14, background: i ? M.card : '#EBEBEB', fontWeight: i ? 400 : 700 }}>
          {row.map((c, j) => <div key={j} style={{ flex: j ? 1 : 2, padding: '9px 10px', color: i && j === 2 ? ['#D97706', '#737373', '#16A34A'][i - 1] : '#262626' }}>{c}</div>)}
        </div>
      ))}
    </div>
  </div>
  );
};

const DocHeader = () => {
  const res = useRes();
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: PW, height: 108, background: M.bg }}>
      <ThreadHeader title={res('weekly')} />
    </div>
  );
};

const ANSWER = { zh: '最急的是「周五前发布插件」：负责人林，状态进行中，周五就要发版。', en: 'Most urgent: "Ship the extension by Friday" — Lin owns it, it is in progress, and it ships Friday.' };
/** 引用阅读面板的上沿（手机像素；视频里面板盖到导航栏下方约 30% 处） */
const CITE_TOP = 240;

export const M2: React.FC<{ t: number }> = ({ t }) => {
  const lang = useLang(), tr = useTr(), res = useRes();
  const cam = kf(t, CAM);
  const enter = spr(t, 0.7, 16);
  const px = PHONE.x + (1 - enter) * 900;
  const ph = { ...PHONE, x: px };

  // 交接：电脑侧栏那一行 → 浮起 → 变形成手机里的文档
  const lift = lin(t, 1.6, 1.9, 0, 1);
  const hp = lin(t, 1.9, 2.6, 0, 1, inOut); // 缓动、不用弹簧：落到手机正好贴合，不冲过头再弹回
  // 笔记本显示整个浏览器（插段首尾缩放回原片满屏），网页内坐标经 pageToWorld 换到世界坐标
  const browser = Math.min(lin(t, 0.15, 1.0, 0, 1), 1 - lin(t, 13.6, 14.6, 0, 1));
  const a = pageToWorld(ROW_SCREEN.x, ROW_SCREEN.y, browser);
  const a2 = pageToWorld(ROW_SCREEN.x + ROW_SCREEN.w, ROW_SCREEN.y + ROW_SCREEN.h, browser);
  const b = phoneToWorld(0, 0, ph);
  const b2 = phoneToWorld(PW, PH, ph);
  const card = {
    x: a.x + (b.x - a.x) * hp, y: a.y + (b.y - a.y) * hp, w: (a2.x - a.x) + ((b2.x - b.x) - (a2.x - a.x)) * hp, h: (a2.y - a.y) + ((b2.y - b.y) - (a2.y - a.y)) * hp,
  };
  const handing = t >= 1.6 && t < 3.05;
  const docOn = t >= 2.75 && t < 5.62;
  // 点返回（5.3）→ 周报页向右滑出（iOS 返回），下面的首页从左侧 30% 处跟着滑回
  const back = lin(t, 5.32, 5.62, 0, 1, inOut);

  // 首页 ↔ 对话 ↔ 会话
  const tabP = lin(t, 5.85, 6.1, 0, 1);
  const threadX = (1 - lin(t, 6.8, 7.1, 0, 1)) * PW;
  const q = typed(t, 7.3, txt(TYPED.m2q, lang), stepOf(TYPED.m2q, lang));
  const sent = t >= 8.55;
  const ansText = ANSWER[lang];
  const ans = typed(t, 9.2, ansText, 1.2 / Array.from(ansText).length);
  const citeP = t < 12.2 ? lin(t, 10.88, 11.12, 0, 1, inOut) : 1 - lin(t, 12.2, 12.4, 0, 1, inOut);

  const home = (
    <>
      <HomeHeader />
      <HomeComposer blink={blinkAt(t, [1.2, 5.6])} bubble={tr('帮我总结「AI 动态周报」的待办', 'Summarize the to-dos in "AI Weekly Brief"')} />
      <ContentTabs p={tabP} />
      <ResToolbar icons={tabP > 0.5 ? ['search', 'plus'] : undefined} />
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - lin(t, 5.9, 6.05, 0, 1) }}>
        <ResLabel />
        {PHONE_ROWS.map(([ic, s], i) => <ResRow key={s} y={rowCenter(i)} icon={ic} text={res(s)} hl={i === 0 ? Math.max(0, 1 - lin(t, 3.2, 4.2, 0, 1)) * (t > 1.9 ? 1 : 0) : 0} />)}
      </div>
      {t > 5.95 && <ChatHistoryList y={HOME.labelY - 9} o={lin(t, 5.95, 6.15, 0, 1)} hl="周会待办整理" hlP={Math.max(0, 1 - Math.abs(t - 6.7) / 0.2)} />}
      <BottomBar t={t} />
    </>
  );

  const thread = (
    <div style={{ position: 'absolute', inset: 0, background: M.card, transform: `translateX(${threadX}px)` }}>{/* 对话页是白底（app_citation.MP4） */}
      <ThreadHeader title={tr('周会待办整理', 'Weekly meeting to-dos')} />
      <div style={{ position: 'absolute', left: 0, top: 112, width: PW, textAlign: 'center', fontSize: 12, color: M.mute }}>{tr('今天', 'Today')}</div>
      <div style={{ position: 'absolute', right: 14, top: 140, maxWidth: 260, padding: '10px 14px', borderRadius: 16, background: M.surface, fontSize: 15 }}>{tr('上周会议的待办？', "Last week's meeting to-dos?")}</div>
      <div style={{ position: 'absolute', left: 18, right: 18, top: 196, fontSize: 15, lineHeight: 1.65, color: '#262626' }}>
        {tr('共 3 项：周五前发布插件（林，进行中）、DAU 目标拆解（王，未开始）、下周复盘会（全员，已排期）。', '3 items: extension by Friday (Lin, in progress), DAU plan (Wang, not started), retro (all, scheduled).')}<Badge n={1} /><Badge n={2} />
      </div>
      {sent && (
        <>
          <div style={{ position: 'absolute', right: 14, top: 310, padding: '10px 14px', borderRadius: 16, background: M.surface, fontSize: 15, opacity: lin(t, 8.55, 8.7, 0, 1) }}>{txt(TYPED.m2q, lang)}</div>
          <div style={{ position: 'absolute', left: 18, top: 368, display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: M.sub, opacity: lin(t, 8.75, 8.9, 0, 1) }}>
            {tr('推理模式', 'Reasoning')} <Ic n="chevD" s={14} c={M.sub} />{t < 9.2 && <><Spinner t={t} size={13} /> {tr('正在检索资料…', 'Searching sources…')}</>}
          </div>
          {/* 回答写完后引用角标紧跟在句末（没有单独的「来源」一行）；10.75 点第 1 个角标 */}
          <div style={{ position: 'absolute', left: 18, right: 18, top: 402, fontSize: 15.5, lineHeight: 1.65, color: M.text }}>
            {ans}{t > 10.4 && <span style={{ opacity: lin(t, 10.4, 10.55, 0, 1) }}><Badge n={1} tap={lin(t, 10.75, 10.95, 0, 1, (x) => x)} /><Badge n={2} /><Badge n={3} /></span>}
          </div>
        </>
      )}
      <ChatComposer text={sent ? '' : q} caret={t > 7.2 && !sent} send={!sent && q.length > 2} />
      <Disclaimer />
      {/* 点角标 → 被引资源的阅读面板（app_citation.MP4）：压暗对话，白色面板从下滑到 CITE_TOP；
          顶栏「完成 · 资源名 · 原文」，下面创建 / 更新时间、分隔线、资源正文（被引那一句蓝底） */}
      {citeP > 0.001 && (
        <>
          <div style={{ position: 'absolute', inset: 0, background: `rgba(0,0,0,${0.32 * Math.min(1, citeP)})` }} />
          <div style={{ position: 'absolute', left: 0, top: CITE_TOP + (PH - CITE_TOP) * (1 - citeP), width: PW, height: PH - CITE_TOP + 20, borderRadius: '12px 12px 0 0', background: '#fff', overflow: 'hidden', color: M.text }}>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 50, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12, fontSize: 14.5 }}>
              <span style={{ color: '#525252' }}>{tr('完成', 'Done')}</span>
              <span style={{ flex: 1, minWidth: 0, textAlign: 'center', fontWeight: 600, fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{res('meeting')}：{tr('周会转写与 AI 摘要', 'transcript & AI summary')}</span>
              <span style={{ color: '#525252' }}>{tr('原文', 'Original')}</span>
            </div>
            {[['clock', tr('创建时间', 'Created'), '2026-10-13 10:02'], ['history', tr('更新时间', 'Updated'), '2026-10-13 10:05']].map(([ic, k, v], i) => (
              <div key={k} style={{ position: 'absolute', left: 16, top: 60 + i * 28, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5 }}>
                <Ic n={ic} s={13} c="#737373" /><span style={{ color: '#737373', width: 60 }}>{k}</span><span style={{ color: '#404040' }}>{v}</span>
              </div>
            ))}
            <div style={{ position: 'absolute', left: 16, right: 16, top: 128, height: 1, background: '#EDEDED' }} />
            <div style={{ position: 'absolute', left: 16, right: 16, top: 146 }}>
              <div style={{ fontSize: 23, fontWeight: 700 }}>{res('meeting')}</div>
              <div style={{ marginTop: 12, borderLeft: '4px solid #A3A3A3', padding: '2px 0 2px 16px', fontSize: 14.5, lineHeight: 1.7, color: '#262626' }}>
                {/* 中文字体里的 “ 靠全角格子右边，会比正文缩进；用西文字体让它和正文左缘对齐 */}
                <div style={{ color: '#525252', fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 18, lineHeight: 1.2 }}>“</div>
                {tr('AI 摘要：插件周五发版；DAU 目标翻倍；下周复盘。', 'AI summary: the extension ships Friday; double DAU; retro next week.')}
              </div>
              <div style={{ marginTop: 16, fontSize: 17, fontWeight: 700 }}>{tr('转写', 'Transcript')}</div>
              {[
                [tr('[00:12] Speaker1：这周先把插件发版……', '[00:12] Speaker1: Ship the extension this week…'), false],
                [tr('[00:31] Speaker2：待办，周五前完成评审……', '[00:31] Speaker2: To-do, finish the review by Friday…'), true],
                [tr('[00:48] Speaker3：DAU 目标拆到每周……', '[00:48] Speaker3: Break the DAU goal down by week…'), false],
              ].map(([line, hl], i) => (
                <div key={i} style={{ marginTop: 6, padding: '3px 6px', marginLeft: -6, borderRadius: 6, background: hl ? 'rgba(0,144,255,.2)' : undefined, fontSize: 14.5, lineHeight: 1.65 }}>{line as string}</div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );

  const screen = (
    <>
      <div style={{ position: 'absolute', inset: 0, transform: docOn ? `translateX(${-0.3 * PW * (1 - back)}px)` : undefined }}>{home}</div>
      {docOn && (
        <div style={{ position: 'absolute', inset: 0, background: M.bg, transform: `translateX(${back * PW}px)`, boxShadow: back > 0 ? '-8px 0 24px rgba(0,0,0,.12)' : undefined }}>
          <DocBody scroll={lin(t, 3.6, 5.0, 0, -430)} />
          <DocHeader />
        </div>
      )}
      <Tap t={t} at={5.3} x={24} y={82} />
      <Tap t={t} at={5.85} x={PW / 2 - HOME.tabs.w / 2 + HOME.tabs.active + (HOME.tabs.w - HOME.tabs.active) / 2} y={HOME.tabs.y + HOME.tabs.h / 2} />
      <Tap t={t} at={6.65} x={150} y={HOME.labelY - 9 + 44} />
      {t >= 6.8 && thread}
      <Tap t={t} at={8.45} x={350} y={774} />
      <Tap t={t} at={12.1} x={32} y={CITE_TOP + 25} />
    </>
  );

  // 手机 → 电脑：屏幕（连边框）和对话框一起拉宽；手机里的内容先被白底盖住（全程白色 = 网页主区的底色），网页首页最后淡入并接管
  const e = lin(t, MORPH.a, MORPH.b, 0, 1, inOut);
  const R = { x: mix(PHONE_SCR.x, 0, e), y: mix(PHONE_SCR.y, 0, e), w: mix(PHONE_SCR.w, 1920, e), h: mix(PHONE_SCR.h, 1080, e), r: mix(PHONE_SCR.r, 0, e) };
  const bz = 12 * PK2 * (1 - e); // 机身边框跟着变薄直到消失
  const Cb = { x: mix(PHONE_COMP.x, PC_COMP.x, e), y: mix(PHONE_COMP.y, PC_COMP.y, e), w: mix(PHONE_COMP.w, PC_COMP.w, e), h: mix(PHONE_COMP.h, PC_COMP.h, e), r: mix(PHONE_COMP.r, PC_COMP.r, e) };
  const at = (pc: [number, number], pcx: [number, number]) => ({ x: mix(pc[0] * PK2, pcx[0], e), y: mix(pc[1] * PK2, pcx[1], e) }); // 输入框内的点：手机像素 → 网页画布像素（相对输入框左上）
  const fs = (a: number, b: number) => mix(a * PK2, b, e);
  const morph = t >= MORPH.a && t < FROZEN_IN.b && (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', left: R.x, top: R.y, width: R.w, height: R.h, borderRadius: R.r, overflow: 'hidden', boxShadow: bz > 0.5 ? `0 0 0 ${bz}px #0a0a0a, 0 0 0 ${bz + 2 * (1 - e)}px #3a3a3c` : undefined }}>
        <div style={{ position: 'absolute', inset: 0, background: '#FFFFFF', opacity: lin(t, MORPH.a, MORPH.a + 0.12, 0, 1) }} />
      </div>
      <div style={{ position: 'absolute', left: Cb.x, top: Cb.y, width: Cb.w, height: Cb.h, borderRadius: Cb.r, boxSizing: 'border-box', border: `1px solid ${interpolateColors(e, [0, 1], [M.line, '#E5E7EB'])}`, background: interpolateColors(e, [0, 1], [M.card, '#FFFFFF']), color: '#8a8a8e', fontFamily: 'inherit' }}>
        {(() => { const p = at([16, 14], [17, 20]); return <div style={{ position: 'absolute', left: p.x, top: p.y, fontSize: fs(16, 18.7), whiteSpace: 'nowrap' }}>{tr('随便问点什么吧', 'Ask anything')}</div>; })()}
        {(() => { const p = at([26, 74], [37, 120]), s = fs(20, 21); return <div style={{ position: 'absolute', left: p.x - s / 2, top: p.y - s / 2 }}><Ic n="plus" s={s} c={M.sub} /></div>; })()}
        {(() => { const p = at([63, 75], [91, 120]), s = fs(18, 21); return <div style={{ position: 'absolute', left: p.x - s / 2, top: p.y - s / 2 }}><Ic n="hand" s={s} c={M.sub} /></div>; })()}
        {(() => { const p = at([PW - 24 - 56, 71], [PC_COMP.w - 80, 120]); return <div style={{ position: 'absolute', right: Cb.w - p.x, top: p.y, transform: 'translateY(-50%)', fontSize: fs(13, 16), whiteSpace: 'nowrap' }}>{e < 0.5 ? tr('Agent 2.1 中', 'Agent 2.1 Medium') : tr('Agent 2.1 高', 'Agent 2.1 High')}</div>; })()}
        {(() => { const p = at([PW - 24 - 28, 70], [PC_COMP.w - 38, 120]), s = fs(36, 42); return <div style={{ position: 'absolute', left: p.x - s / 2, top: p.y - s / 2, width: s, height: s, borderRadius: '50%', background: interpolateColors(e, [0, 1], [M.line, '#A3A3A3']), display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ic n="up" s={s / 2} c="#fff" w={2.4} /></div>; })()}
      </div>
    </AbsoluteFill>
  );
  // 定格的电脑首页（= 原片 E 26.45 那一帧）：淡入接管，然后小黑从输入框后面探出；插段结束时与原片逐帧一致（peek = 1）
  const pcFrame = t >= FROZEN_IN.a && (
    <AbsoluteFill style={{ opacity: lin(t, FROZEN_IN.a, FROZEN_IN.b, 0, 1) }}>
      <CatPeek.Provider value={lin(t, PEEK.a, PEEK.b, 0, 1, (x) => 1 - Math.pow(1 - x, 3))}><Main at={M2_AT} label={false} /></CatPeek.Provider>
    </AbsoluteFill>
  );

  return (
    <>
      <Stage cam={cam}>
        <Laptop at={M2_AT} browser={browser} blur={5 * lin(cam.x, 960, CAM_PHONE.x, 0, 1) * lin(cam.s, 1, CAM_PHONE.s, 0, 1)} glow={0}>
          {/* 侧栏里那一行先亮起，再「被拿走」 */}
          {t >= 1.5 && t < 3.2 && <div style={{ position: 'absolute', left: ROW_SCREEN.x, top: ROW_SCREEN.y, width: ROW_SCREEN.w, height: ROW_SCREEN.h, borderRadius: ROW_SCREEN.r, background: `rgba(74,142,249,${0.35 * Math.min(1, lin(t, 1.5, 1.65, 0, 1))})`, boxShadow: `0 0 0 2px rgba(74,142,249,${0.8 * (1 - hp)})` }} />}
        </Laptop>
        <Phone x={px} y={PHONE.y} k={PHONE.k}>{screen}</Phone>
        {/* 飞行卡片不带蓝色光晕：蓝框只属于电脑侧栏那一行（画在笔记本里、在卡片下面），不能压在飞行中的手机画面上 */}
        {handing && (
          <div style={{ position: 'absolute', left: card.x, top: card.y - 30 * lift * (1 - hp), width: card.w, height: card.h, opacity: 1 - lin(t, 2.75, 3.05, 0, 1), borderRadius: 8 + 44 * hp, background: M.bg, border: `1px solid ${M.line}`, overflow: 'hidden', boxShadow: `0 ${30 * lift}px ${80 * lift}px rgba(0,0,0,.35)`, transform: `perspective(1400px) rotateY(${-18 * Math.sin(Math.PI * hp)}deg) scale(${1 + 0.12 * lift * (1 - hp)})` }}>
            {/* 浮起时的标题：用网页侧栏同一个 Row 组件（同图标、字号、缩进），按卡片宽度缩放，和侧栏那一行一模一样 */}
            <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', transform: `scale(${card.w / ROW_SCREEN.w}) translate(${-ROW_SCREEN.x}px, ${-ROW_SCREEN.y}px)`, opacity: 1 - lin(hp, 0.1, 0.35, 0, 1), pointerEvents: 'none' }}>
              <Omni><WebRow top={rowTop(WEEKLY_ROW)} icon="📝" text={res('weekly')} /></Omni>
            </div>
            <div style={{ position: 'absolute', left: 0, top: 0, width: PW, height: PH, transform: `scale(${card.w / PW})`, transformOrigin: '0 0', opacity: lin(hp, 0.35, 0.7, 0, 1), background: M.bg }}>
              <DocBody />
              <DocHeader />
              {/* 贴合手机的那一刻状态栏（时间、信号、电池）和灵动岛一起直接出现（卡片盖在手机上面，不画的话会随卡片淡出慢慢透出来） */}
              {hp >= 1 && <StatusBar />}
            </div>
          </div>
        )}
      </Stage>
      {morph}
      {pcFrame}
      <Caption t={t} a={2.0} b={3.5} text={tr('电脑上开始，手机上接着', 'Start on your computer. Pick up on your phone.')} y={930} size={56} plate />
    </>
  );
};
