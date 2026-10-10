import React from 'react';
import { C, Caption, Spinner, blinkAt, kf, lin, typed } from '../lib';
import { LOCALES } from '../data/content';
import { useLang, useRes, useTr } from '../i18n';
import { TYPED, stepOf, txt, type ResKey } from '../copy';
import { CAM_FULL, CAM_WIDE, Laptop, PHONE, Phone, Stage, phoneToWorld, screenToWorld } from '../mobile/stage';
import { Badge, BottomBar, ChatComposer, ChatHistoryList, ContentTabs, Disclaimer, HomeComposer, HomeHeader, Ic, M, PH, PW, ResRow, ResToolbar, Sheet, Tap, ThreadHeader, spr } from '../mobile/ui';

// E+ 跨端接力（插在 E 26.45 s：周报刚存进资源树）：周报从电脑屏幕里浮起、变形落进手机 → 手机上读周报、
// 切到「对话」接着问、点引用看来源 → 回到电脑，接 E 的 Agent 归档
export const M2_AT = 26.45;
const CAM_PHONE = { x: 1520, y: 560, s: 1.32 };
const CAM = [
  { t: 0, ...CAM_FULL }, { t: 1.3, ...CAM_WIDE }, { t: 3.0, ...CAM_WIDE }, { t: 3.6, ...CAM_PHONE },
  { t: 12.3, ...CAM_PHONE }, { t: 13.1, ...CAM_WIDE }, { t: 13.5, ...CAM_WIDE }, { t: 15.2, ...CAM_FULL },
];
// 电脑侧栏里「AI 动态周报 · 第 40 周」那一行（原片 E 资源树第 9 行，屏幕坐标）
const ROW_SCREEN = { x: 16, y: 697, w: 268, h: 34 };
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
        {(items as string[]).map((s, i) => <div key={s} style={{ display: 'flex', gap: 8, fontSize: 14.5, lineHeight: 1.6, color: '#d4d4d4', marginTop: 6 }}><span style={{ color: C.blue, fontWeight: 700 }}>{i + 1}.</span><span>{s}</span></div>)}
      </div>
    ))}
    <div style={{ fontSize: 18, fontWeight: 700, marginTop: 22 }}>{R.heads[2]}</div>
    <div style={{ marginTop: 10, borderRadius: 10, overflow: 'hidden', border: '1px solid #3a3a3c' }}>
      {[R.cols, ...R.todos].map((row, i) => (
        <div key={i} style={{ display: 'flex', fontSize: 14, background: i ? '#262628' : '#333', fontWeight: i ? 400 : 700 }}>
          {row.map((c, j) => <div key={j} style={{ flex: j ? 1 : 2, padding: '9px 10px', color: i && j === 2 ? ['#FBBF24', '#A1A1A1', '#4ADE80'][i - 1] : '#ddd' }}>{c}</div>)}
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
const CITES: [string, ResKey, string[]][] = [
  ['🎙', 'meeting', ['[00:31] 待办：周五前完成评审……', '[00:31] To-do: finish the review by Friday…']],
  ['🖼', 'board', ['负责人：林 · 发布节奏：双周', 'Owner: Lin · Releases: biweekly']],
  ['📝', 'weekly', ['周五前发布插件 ｜ 林 ｜ 进行中', 'Ship the extension by Friday | Lin | In progress']],
];

export const M2: React.FC<{ t: number }> = ({ t }) => {
  const lang = useLang(), tr = useTr(), res = useRes();
  const SRC_Y = tr(462, 488); // 英文回答更长：「来源」一行下移
  const cam = kf(t, CAM);
  const enter = spr(t, 0.7, 16);
  const px = PHONE.x + (1 - enter) * 900 + lin(t, 13.5, 15.2, 0, 420);
  const ph = { ...PHONE, x: px };

  // 交接：电脑侧栏那一行 → 浮起 → 变形成手机里的文档
  const lift = lin(t, 1.6, 1.9, 0, 1);
  const hp = spr(t, 1.9, 14);
  const a = screenToWorld(ROW_SCREEN.x, ROW_SCREEN.y);
  const a2 = screenToWorld(ROW_SCREEN.x + ROW_SCREEN.w, ROW_SCREEN.y + ROW_SCREEN.h);
  const b = phoneToWorld(0, 0, ph);
  const b2 = phoneToWorld(PW, PH, ph);
  const card = {
    x: a.x + (b.x - a.x) * hp, y: a.y + (b.y - a.y) * hp, w: (a2.x - a.x) + ((b2.x - b.x) - (a2.x - a.x)) * hp, h: (a2.y - a.y) + ((b2.y - b.y) - (a2.y - a.y)) * hp,
  };
  const handing = t >= 1.6 && t < 3.05;
  const docOn = t >= 2.75 && t < 5.45;

  // 首页 ↔ 对话 ↔ 会话
  const tabP = lin(t, 5.85, 6.1, 0, 1);
  const threadX = (1 - lin(t, 6.8, 7.1, 0, 1)) * PW;
  const q = typed(t, 7.3, txt(TYPED.m2q, lang), stepOf(TYPED.m2q, lang));
  const sent = t >= 8.55;
  const ansText = ANSWER[lang];
  const ans = typed(t, 9.2, ansText, 1.2 / Array.from(ansText).length);
  const citeP = t < 12.2 ? spr(t, 10.9) : 1 - lin(t, 12.2, 12.4, 0, 1);

  const home = (
    <>
      <HomeHeader />
      <HomeComposer blink={blinkAt(t, [1.2, 5.6])} bubble={tr('帮我总结「AI 动态周报」的待办', 'Summarize the to-dos in "AI Weekly Brief"')} />
      <ContentTabs y={340} p={tabP} />
      <ResToolbar y={396} icons={tabP > 0.5 ? ['search', 'plus'] : undefined} />
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - lin(t, 5.9, 6.05, 0, 1) }}>
        <div style={{ position: 'absolute', left: 18, top: 398, fontSize: 13, color: M.sub }}>{tr('个人 ⌄', 'Personal ⌄')}</div>
        {PHONE_ROWS.map(([ic, s], i) => <ResRow key={s} y={432 + i * 46} icon={ic} text={res(s)} hl={i === 0 ? Math.max(0, 1 - lin(t, 3.2, 4.2, 0, 1)) * (t > 1.9 ? 1 : 0) : 0} />)}
      </div>
      {t > 5.95 && <ChatHistoryList y={428} o={lin(t, 5.95, 6.15, 0, 1)} hl="周会待办整理" hlP={Math.max(0, 1 - Math.abs(t - 6.7) / 0.2)} />}
      <BottomBar t={t} />
    </>
  );

  const thread = (
    <div style={{ position: 'absolute', inset: 0, background: M.bg, transform: `translateX(${threadX}px)` }}>
      <ThreadHeader title={tr('周会待办整理', 'Weekly meeting to-dos')} />
      <div style={{ position: 'absolute', left: 0, top: 112, width: PW, textAlign: 'center', fontSize: 12, color: '#777' }}>{tr('今天', 'Today')}</div>
      <div style={{ position: 'absolute', right: 14, top: 140, maxWidth: 260, padding: '10px 14px', borderRadius: 16, background: '#2c2c2e', fontSize: 15 }}>{tr('上周会议的待办？', "Last week's meeting to-dos?")}</div>
      <div style={{ position: 'absolute', left: 18, right: 18, top: 196, fontSize: 15, lineHeight: 1.65, color: '#e5e5e5' }}>
        {tr('共 3 项：周五前发布插件（林，进行中）、DAU 目标拆解（王，未开始）、下周复盘会（全员，已排期）。', '3 items: extension by Friday (Lin, in progress), DAU plan (Wang, not started), retro (all, scheduled).')}<Badge n={1} /><Badge n={2} />
      </div>
      {sent && (
        <>
          <div style={{ position: 'absolute', right: 14, top: 310, padding: '10px 14px', borderRadius: 16, background: '#2c2c2e', fontSize: 15, opacity: lin(t, 8.55, 8.7, 0, 1) }}>{txt(TYPED.m2q, lang)}</div>
          <div style={{ position: 'absolute', left: 18, top: 368, display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: M.sub, opacity: lin(t, 8.75, 8.9, 0, 1) }}>
            {tr('推理模式', 'Reasoning')} <Ic n="chevD" s={14} c={M.sub} />{t < 9.2 && <><Spinner t={t} size={13} /> {tr('正在检索资料…', 'Searching sources…')}</>}
          </div>
          <div style={{ position: 'absolute', left: 18, right: 18, top: 402, fontSize: 15.5, lineHeight: 1.65, color: '#f0f0f0' }}>{ans}</div>
          {t > 10.4 && <div style={{ position: 'absolute', left: 18, top: SRC_Y, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: M.sub, opacity: lin(t, 10.4, 10.55, 0, 1) }}>{tr('来源', 'Sources')}<Badge n={1} on={Math.max(0, 1 - Math.abs(t - 10.75) / 0.2)} /><Badge n={2} /><Badge n={3} /></div>}
        </>
      )}
      <ChatComposer text={sent ? '' : q} caret={t > 7.2 && !sent} send={!sent && q.length > 2} />
      <Disclaimer />
      {citeP > 0.001 && (
        <Sheet p={citeP} h={450}>
          <div style={{ padding: '28px 16px 0' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 17, fontWeight: 600 }}>{tr('引用来源', 'Citations')}</span><span style={{ fontSize: 13, color: M.sub }}>{tr('3 段落', '3 paragraphs')}</span>
              <span style={{ marginLeft: 'auto', fontSize: 15, color: '#60A5FA', fontWeight: 600 }}>{tr('完成', 'Done')}</span>
            </div>
            {CITES.map(([ic, s, ex], i) => (
              <div key={s} style={{ marginTop: 12, padding: '12px 14px', borderRadius: 14, background: '#2a2a2c', border: i === 0 ? `1px solid ${C.blue}` : '1px solid transparent' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600 }}><Badge n={i + 1} />{ic} {res(s)}<span style={{ marginLeft: 'auto', fontSize: 13, color: '#60A5FA', fontWeight: 400 }}>{tr('原文 ›', 'Original ›')}</span></div>
                <div style={{ fontSize: 13.5, color: '#cfcfcf', marginTop: 6 }}>{tr(ex[0], ex[1])}</div>
              </div>
            ))}
          </div>
        </Sheet>
      )}
    </div>
  );

  const screen = (
    <>
      {home}
      {docOn && (
        <div style={{ position: 'absolute', inset: 0, background: M.bg, opacity: 1 - lin(t, 5.3, 5.45, 0, 1) }}>
          <DocBody scroll={lin(t, 3.6, 5.0, 0, -430)} />
          <DocHeader />
        </div>
      )}
      <Tap t={t} at={5.3} x={24} y={82} />
      <Tap t={t} at={5.85} x={236} y={360} />
      <Tap t={t} at={6.65} x={150} y={470} />
      {t >= 6.8 && thread}
      <Tap t={t} at={8.45} x={350} y={774} />
      <Tap t={t} at={10.75} x={tr(70, 86)} y={SRC_Y + 9} />
      <Tap t={t} at={12.1} x={348} y={PH - 450 + 38} />
    </>
  );

  // 回传：手机上的新问答同步回电脑对话（光点）
  const sp0 = phoneToWorld(200, 420, ph), sp1 = screenToWorld(1100, 520);
  const sq = lin(t, 12.7, 13.45, 0, 1, (x) => x * x * (3 - 2 * x));
  const sync = t > 12.7 && sq < 1 && (
    <div style={{ position: 'absolute', left: sp0.x + (sp1.x - sp0.x) * sq - 11, top: sp0.y + (sp1.y - sp0.y) * sq - 220 * 4 * sq * (1 - sq) - 11, width: 22, height: 22, borderRadius: '50%', background: '#fff', boxShadow: '0 0 30px 6px #4A8EF9' }} />
  );

  return (
    <>
      <Stage cam={cam}>
        <Laptop at={M2_AT} blur={5 * lin(cam.x, 960, CAM_PHONE.x, 0, 1) * lin(cam.s, 1, CAM_PHONE.s, 0, 1)} glow={Math.max(0, 1 - Math.abs(t - 13.5) / 0.4)}>
          {/* 侧栏里那一行先亮起，再「被拿走」 */}
          {t >= 1.5 && t < 3.2 && <div style={{ position: 'absolute', left: ROW_SCREEN.x, top: ROW_SCREEN.y, width: ROW_SCREEN.w, height: ROW_SCREEN.h, borderRadius: 8, background: `rgba(74,142,249,${0.35 * Math.min(1, lin(t, 1.5, 1.65, 0, 1))})`, boxShadow: `0 0 0 2px rgba(74,142,249,${0.8 * (1 - hp)})` }} />}
        </Laptop>
        <Phone x={px} y={PHONE.y} k={PHONE.k}>{screen}</Phone>
        {handing && (
          <div style={{ position: 'absolute', left: card.x, top: card.y - 30 * lift * (1 - hp), width: card.w, height: card.h, opacity: 1 - lin(t, 2.75, 3.05, 0, 1), borderRadius: 8 + 44 * hp, background: '#262628', border: '1px solid #4a4a4e', overflow: 'hidden', boxShadow: `0 ${30 * lift}px ${80 * lift}px rgba(0,0,0,.6), 0 0 ${40 * lift * (1 - hp)}px rgba(74,142,249,.6)`, transform: `perspective(1400px) rotateY(${-18 * Math.sin(Math.PI * hp)}deg) scale(${1 + 0.12 * lift * (1 - hp)})` }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', gap: 10 * (1 - hp) + 4, padding: '0 10px', fontSize: 17, color: M.text, opacity: 1 - lin(hp, 0.1, 0.35, 0, 1) }}>📝 {res('weekly')}</div>
            <div style={{ position: 'absolute', left: 0, top: 0, width: PW, height: PH, transform: `scale(${card.w / PW})`, transformOrigin: '0 0', opacity: lin(hp, 0.35, 0.7, 0, 1), background: M.bg }}>
              <DocBody />
              <DocHeader />
            </div>
          </div>
        )}
        {sync}
      </Stage>
      <Caption t={t} a={2.0} b={3.5} text={tr('电脑上开始，手机上接着', 'Start on your computer. Pick up on your phone.')} y={930} size={56} />
    </>
  );
};
