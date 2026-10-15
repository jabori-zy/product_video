import React from 'react';
import { Band, C, Camera, Caption, Cursor, Fill, MBlur, W, Words, inOut, kf, lin, morph, sp, typed } from '../lib';
import {
  Accordion, AnswerActions, AppFrame, ApprovalCard, ChatComposerBar, ChatHeader, ChatRow, ChatScroll, Cite, CiteCard, Composer, DateLabel, GroupLabel,
  HomeBody, HomeCards, HomeHeader, Main, Markdown, OMNI_BG, Row, Sidebar, SystemGroup, ThoughtFor, ToolCall, UserMsg, Z, rowRect, rowTop, useRecent,
} from '../ui';
import { LOCALES } from '../data/content';
import { useLang, useRes, useTr } from '../i18n';
import { TYPED, stepOf, txt, type ResKey } from '../copy';
import { ZhihuPage } from '../content/zhihu';
import { BrowserChrome, CHROME_H } from '../content/browser';
import { E_CLICKS, E_Q1_AT } from './E.times';

export { SHARE } from '../ui';

// E 应用 · 记忆变成万物（18.0–30.0 s），局部时间 t = 全局 − 18
// 真实网页（浅色，omni/）：首页调思考强度 → 提问 → 带引用的回答 → 写周报并保存进资源树 → Agent 归档（待确认卡片 → 同意）

const HISTORY: [string[], string[][]][] = [ // [[中文, English], 条目]；日期分组写法照产品（「过去7天」「2026 年 9 月」）
  [['今天', 'Today'], [['你好，小黑！', 'Hello, Xiaohei!'], ['周会待办整理', 'Weekly meeting to-dos']]],
  [['过去7天', 'Past 7 days'], [['RAG 和微调的区别', 'RAG vs. fine-tuning'], ['买菜清单请求', 'Grocery list request'], ['Q3 复盘要点', 'Q3 review highlights']]],
  [['2026 年 9 月', 'September 2026'], [['知乎热榜总结', 'Zhihu trending summary'], ['AI 新闻速览', 'AI news at a glance'], ['新对话', 'New chat']]],
];
const TREE: [string, ResKey][] = [
  ['🌐', 'zhihuHome'], ['🌐', 'agentYear'], ['📕', 'q3'], ['🖼', 'board'], ['🎙', 'meeting'],
  ['🎬', 'rag'], ['📕', 'monthly'], ['📕', 'docker'], ['📝', 'weekly'],
];
const MOVE = [1, 5, 8, 0, 2, 7]; // 被 Agent 归档进「AI 研究」的 6 条
const STAY = [3, 4, 6];

const FULL = { x: 960, y: 540, s: 1 };
const CAM = [
  { t: -0.3, x: 230, y: 560, s: 1.4 },
  { t: 0, x: 230, y: 560, s: 1.4 },
  { t: 1.5, x: 1125, y: 540, s: 1.1 },
  { t: 1.6, x: 1125, y: 540, s: 1.1 },
  { t: 1.85, x: 1200, y: 500, s: 1.6 },
  { t: 2.9, x: 1200, y: 500, s: 1.6 },
  { t: 3.0, x: 1200, y: 500, s: 1.9 },
  { t: 3.2, x: 1125, y: 420, s: 1.25 },
  { t: 4.5, ...FULL },
  // final：写周报和 Agent 两段不再全程全景——输入时推近输入框，周报生成时跟着内容，保存时拉回看资源树
  { t: 5.5, ...FULL },
  { t: 5.75, x: 1125, y: 880, s: 1.5 },
  { t: 6.45, x: 1125, y: 880, s: 1.5 },
  { t: 6.7, x: 1125, y: 400, s: 1.3 },
  { t: 7.75, x: 1125, y: 560, s: 1.3 },
  { t: 8.1, ...FULL },
  { t: 8.45, ...FULL },
  { t: 8.65, x: 1125, y: 880, s: 1.5 },
  { t: 9.1, x: 1125, y: 880, s: 1.5 },
  { t: 9.3, ...FULL },
  { t: 9.45, x: 1125, y: 742, s: 1.6 },
  { t: 9.6, x: 1125, y: 742, s: 1.6 },
  { t: 9.9, ...FULL },
];

// 画布坐标（产品像素 × Z）：光标目标。按真实版式量出来（omni/Probe 的 E 状态校对）
const P = (x: number, y: number) => ({ x: x * Z, y: y * Z });
const AT = {
  agent: P(1132, 421), // 首页「Agent 2.1 轻」
  slideHigh: P(1115, 372.5), // 弹层滑条「高」档（滑条 951–1157.5，拇指 24）
  homeSend: P(1198, 421),
  chatSend: P(1198, 749),
  cite2: P(610.5, 447), // 第 2 条回答的引用角标
  save: P(532, 584), // 周报末尾「保存」（滚动 400 之后）
  approve: P(560, 709), // 待确认卡片「同意」
};

// 对话页里三问三答各自一层：回答完成后上一层往上滑走，像列表滚到最新的提问
const Block: React.FC<{ o: number; dy?: number; children: React.ReactNode }> = ({ o, dy = 0, children }) => (
  <div style={{ position: 'absolute', left: 0, right: 0, top: 0, opacity: o, transform: `translateY(${dy}px)` }}>
    <div className="space-y-4">{children}</div>
  </div>
);

/** 文字按比例露出（流式输出） */
const reveal = (s: string, p: number) => Array.from(s).slice(0, Math.ceil(Array.from(s).length * Math.max(0, Math.min(1, p)))).join('');

export const Ee: React.FC<{ t: number }> = ({ t }) => {
  const lang = useLang(), tr = useTr(), res = useRes();
  const Zc = LOCALES[lang]; // 线框里的真实内容（data/locales）
  const L = (p: string[]) => (lang === 'en' ? p[1] : p[0]);
  const c = kf(t, CAM);
  const recent = useRecent();

  // ---- 侧栏：资源 → 对话 → 资源 ----
  const tab = t < 7.9 ? sp(t, 0) : 1 - sp(t, 7.9);
  const histO = tab;
  const folderP = sp(t, 9.8);
  const expand = (j: number) => sp(t, 10.6 + j * 0.05);
  const compact = lin(t, 10.55, 10.75, 0, 1);
  const weeklyP = t >= 8.3 ? sp(t, 8.3) : 0;
  const tree = (
    <div style={{ opacity: 1 - histO }}>
      <GroupLabel top={308} text={tr('个人', 'Personal')} />
      {t >= 9.8 && <Row top={rowTop(0)} icon="📁" text={res('aiFolder')} o={folderP} hover={t > 10.1 && t < 10.7} caret={t > 10.6 ? 'open' : 'closed'} />}
      {TREE.map(([ic, s], i) => {
        if (i === 8 && t < 8.3) return null;
        const mi = MOVE.indexOf(i);
        const base = rowTop(i + folderP);
        if (mi >= 0) {
          const st = 10.1 + mi * 0.07;
          const p = lin(t, st, st + 0.2, 0, 1, inOut);
          if (p >= 1) return null;
          return <Row key={s} top={base + (rowTop(0) - base) * p} icon={ic} text={res(s)} o={(i === 8 ? weeklyP : 1) * (1 - p)} s={1 - 0.4 * p} />;
        }
        const k = STAY.indexOf(i);
        return <Row key={s} top={base + (rowTop(7 + k) - base) * compact} icon={ic} text={res(s)} />;
      })}
      {t >= 10.6 && MOVE.map((i, j) => (
        <Row key={`in${i}`} top={rowTop(1 + j)} depth={1} icon={TREE[i][0]} text={res(TREE[i][1])} o={expand(j)} />
      ))}
      <SystemGroup top={rowTop(7 + weeklyP + folderP) + 34 + 8} />
    </div>
  );
  // 对话历史：发出提问后，新对话出现在「今天」最上面
  const newChat = t >= 3.0 ? sp(t, 3.0) : 0;
  const history = (
    <div style={{ opacity: histO }}>
      {(() => {
        let y = 308;
        let n = 0;
        return HISTORY.map(([g, items], gi) => {
          const gy = y;
          y += 32;
          const rows: React.ReactNode[] = [];
          if (gi === 0) {
            rows.push(<ChatRow key="new" top={y} text={tr('收藏资料里的 AI Agent 趋势', 'AI agent trends in my saves')} active o={newChat} dx={(1 - newChat) * -16} />);
            y += 36 * newChat;
          }
          items.forEach((it) => {
            const p = sp(t, 0.2 + n++ * 0.07);
            rows.push(<ChatRow key={L(it)} top={y} text={L(it)} o={p} dx={(1 - p) * -16} />);
            y += 36;
          });
          y += 2;
          return (
            <React.Fragment key={g[0]}>
              <DateLabel top={gy} text={L(g)} />
              {rows}
            </React.Fragment>
          );
        });
      })()}
    </div>
  );

  // ---- 首页：点「Agent 2.1 轻」→ 滑条拉到「高」→ 打字 → 发送 ----
  const homeO = 1 - lin(t, 2.95, 3.1, 0, 1);
  const chatO = lin(t, 3.0, 3.1, 0, 1);
  const q1 = typed(t, E_Q1_AT, txt(TYPED.q1, lang), stepOf(TYPED.q1, lang));
  const popO = Math.min(lin(t, 1.62, 1.72, 0, 1), 1 - lin(t, 2.02, 2.12, 0, 1));
  const level = lin(t, 1.92, 2.02, 3, 5); // 3 = 轻（默认）→ 5 = 高
  const LV = tr(['轻', '中', '高', '最大'], ['Light', 'Medium', 'High', 'Max']);
  const levelName = LV[Math.round(level) - 3];
  const homeComposer = (
    <Composer text={q1} caret={t > 1.95 && t < 2.92} level={levelName} agentHover={t > 1.5 && t < 1.66} think={popO > 0 ? { value: level, o: popO, s: popO } : undefined} sendHover={t > 2.8 && t < 2.92} />
  );

  // ---- 对话页 ----
  const heads = Zc.answer.heads;
  const q1Fade = lin(t, 5.6, 5.8, 0, 1);
  const thinking = t < 3.5;
  const searching = t >= 3.5 && t < 3.7;
  const status = t < 3.7 ? (
    <>
      <Accordion title={tr('深度思考', 'Deep thinking')}>
        {typed(t, 3.2, tr('用户在问收藏资料里的趋势，先检索知识库里与 AI Agent 相关的内容……', 'The user asks about trends in their saved sources. Search the knowledge base for AI agent content first…'), tr(0.006, 0.0026))}
      </Accordion>
      {!thinking && (
        <Accordion title={tr('工具调用', 'Tool calls')} busy={searching} spin={t * 720}>
          <ul><ToolCall name={tr('搜索资源', 'Search resources')} args={['AI Agent']} /></ul>
        </Accordion>
      )}
    </>
  ) : <ThoughtFor sec={12} />;
  const citeCard = t > 4.65 && t < 4.95;
  const q1Block = (
    <Block o={chatO * (1 - q1Fade)} dy={-q1Fade * 150}>
      <UserMsg text={txt(TYPED.q1, lang)} />
      {status}
      {t >= 3.7 && (
        <Markdown>
          {heads.map((h, j) => {
            const a = 3.7 + j * 0.27;
            const body = Zc.answer.bodies[j];
            return (
              <React.Fragment key={h}>
                <h2 style={{ opacity: t >= a ? 1 : 0 }}>{typed(t, a, h, 0.008)}</h2>
                <p style={{ opacity: t >= a + 0.08 ? 1 : 0 }}>
                  {reveal(body, lin(t, a + 0.08, a + 0.25, 0, 1))}
                  {t > a + 0.2 && (
                    <span style={{ position: 'relative', display: 'inline-block', marginLeft: 4 }}>
                      <Cite n={j + 1} s={sp(t, a + 0.2)} hover={j === 1 && t > 4.6 && t < 5.0} />
                      {j === 1 && citeCard && (
                        <span style={{ position: 'absolute', left: '50%', bottom: 'calc(100% + 4px)', transform: 'translateX(-50%)', zIndex: 50 }}>
                          <CiteCard title={Zc.zhihu.title} text={Zc.zhihu.paras[0]} id="k7Rz2QpLmN4xV8cT" o={lin(t, 4.65, 4.72, 0, 1)} s={sp(t, 4.65)} />
                        </span>
                      )}
                    </span>
                  )}
                </p>
              </React.Fragment>
            );
          })}
          <AnswerActions o={lin(t, 4.45, 4.6, 0, 1)} />
        </Markdown>
      )}
    </Block>
  );

  // 引用 → 知乎原文 → 甩回（内部甩镜）
  const w1 = lin(t, 4.95, 5.1, 0, 1, inOut);
  const w2 = lin(t, 5.3, 5.45, 0, 1, inOut);
  const chatOff = t < 5.3 ? -W * w1 : -W * (1 - w2);
  const wb = Math.sin(Math.PI * w1) * 30 + Math.sin(Math.PI * w2) * 30;

  // Q2 周报：回答就是周报正文；点「保存」→ 存成资源（整块缩成一行飞进资源树）
  const q2 = typed(t, 5.7, txt(TYPED.q2, lang), stepOf(TYPED.q2, lang));
  const q3 = typed(t, 8.5, txt(TYPED.q3, lang), stepOf(TYPED.q3, lang));
  const compText = t < 6.4 ? (t >= 5.7 ? q2 : '') : t >= 8.5 && t < 9.15 ? q3 : '';
  const q2O = lin(t, 6.45, 6.6, 0, 1) * (1 - lin(t, 8.35, 8.5, 0, 1));
  const R = Zc.report;
  const docT = typed(t, 6.5, txt(TYPED.docTitle, lang), stepOf(TYPED.docTitle, lang));
  const sec = (j: number) => 6.7 + j * 0.35;
  const scroll = lin(t, 6.6, 7.8, 0, 400);
  const inFlow = t < 7.95; // 保存之后正文由飞行卡片接管
  const q2Block = (
    <Block o={q2O * (inFlow ? 1 : 0)} dy={-scroll}>
      <UserMsg text={txt(TYPED.q2, lang)} />
      <ThoughtFor sec={6} />
      <Markdown>
        <h1>{docT}</h1>
        <p style={{ opacity: lin(t, 6.6, 6.7, 0, 1) }}>{R.toc}</p>
        {R.heads.map((h, j) => (
          <React.Fragment key={h}>
            <h2 style={{ opacity: lin(t, sec(j), sec(j) + 0.08, 0, 1) }}>{h}</h2>
            {j < 2 ? (
              <ul>
                {(j === 0 ? R.highlights : R.sources).map((s, k) => {
                  const o = lin(t, sec(j) + 0.05 + k * 0.05, sec(j) + 0.1 + k * 0.05, 0, 1);
                  return <li key={s} style={{ opacity: o }}>{s}</li>;
                })}
              </ul>
            ) : (
              <table style={{ opacity: lin(t, sec(j), sec(j) + 0.08, 0, 1) }}>
                <thead><tr>{R.cols.map((x) => <th key={x}>{x}</th>)}</tr></thead>
                <tbody>
                  {R.todos.map((r, k) => (
                    <tr key={r[0]} style={{ opacity: lin(t, sec(j) + 0.1 + k * 0.08, sec(j) + 0.2 + k * 0.08, 0, 1) }}>{r.map((x) => <td key={x}>{x}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            )}
          </React.Fragment>
        ))}
        <AnswerActions o={lin(t, 7.6, 7.7, 0, 1)} saveHover={t > 7.7 && t < 7.95} tip={t > 7.7 && t < 7.95 ? tr('将当前回复保存至个人空间', 'Save this response to personal space') : undefined} />
      </Markdown>
    </Block>
  );
  // 保存：正文区缩成资源行飞进侧栏（产品像素）
  const row8 = rowRect(8);
  const doc = morph(t, [
    { t: 0, x: 460, y: 56, w: 768, h: 580, r: 0 },
    { t: 7.95, x: row8.x / Z, y: row8.y / Z, w: row8.w / Z, h: row8.h / Z, r: 6 },
  ]);
  const docCard = t >= 7.95 && t < 8.3 && (
    <div style={{ position: 'absolute', left: doc.x, top: doc.y, width: doc.w, height: doc.h, borderRadius: doc.r, background: '#fff', border: '1px solid hsl(240 5.9% 90%)', boxShadow: '0 12px 40px rgba(15,23,42,.18)', zIndex: 60 }} />
  );

  // Q3 Agent：工具调用，创建文件夹要人工确认（卡片在输入框的位置）
  const q3O = lin(t, 9.2, 9.35, 0, 1);
  const pending = t >= 9.35 && t < 9.8;
  const approved = t >= 9.8;
  const q3Block = t >= 9.15 && (
    <Block o={q3O}>
      <UserMsg text={txt(TYPED.q3, lang)} />
      <Accordion title={tr('工具调用', 'Tool calls')} busy={t < 10.45} spin={t * 720}>
        <ul>
          <ToolCall name={tr('搜索资源', 'Search resources')} args={['AI']} o={sp(t, 9.25)} />
          {t >= 9.35 && <ToolCall name={tr('创建文件夹', 'Create folder')} args={[tr('个人', 'Personal'), res('aiFolder')]} pending={!approved} o={sp(t, 9.35)} />}
          {t >= 10.1 && <ToolCall name={tr('移动资源', 'Move resources')} args={[tr('6 条', '6 items'), res('aiFolder')]} o={sp(t, 10.1)} />}
          {t >= 10.4 && <ToolCall name={tr('添加标签', 'Add tag')} args={['#AI']} o={sp(t, 10.4)} />}
        </ul>
      </Accordion>
      {t >= 10.5 && (
        <Markdown>
          <p style={{ opacity: sp(t, 10.5) }}>{reveal(tr('已把 6 条 AI 相关资料归档到「AI 研究」，并打上 #AI 标签。', 'Filed 6 AI sources into "AI research" and tagged them #AI.'), lin(t, 10.5, 10.8, 0, 1))}</p>
        </Markdown>
      )}
    </Block>
  );

  const black = Math.min(lin(t, 11.0, 11.1, 0, 1), 1 - lin(t, 11.7, 11.8, 0, 1));

  const path = [
    { t: 1.3, x: 1300, y: 820 }, { t: 1.55, ...AT.agent }, { t: 1.75, ...AT.agent }, { t: 1.88, ...AT.slideHigh }, { t: 2.1, ...AT.slideHigh },
    { t: 2.45, x: AT.homeSend.x - 60, y: AT.homeSend.y + 40 }, { t: 2.85, ...AT.homeSend },
    { t: 4.45, x: 1300, y: 600 }, { t: 4.6, ...AT.cite2 }, { t: 5.45, ...AT.cite2 },
    { t: 5.75, x: 1250, y: 930 }, { t: 6.2, x: 1350, y: 960 }, { t: 6.38, ...AT.chatSend }, { t: 7.5, x: 900, y: 820 }, { t: 7.75, ...AT.save },
    { t: 8.6, x: 1350, y: 960 }, { t: 9.1, ...AT.chatSend }, { t: 9.4, ...AT.approve }, { t: 10.2, x: 900, y: 600 },
  ];

  const chatComposer = pending
    ? <ApprovalCard title={tr('创建文件夹', 'Create folder')} args={[tr('个人', 'Personal'), res('aiFolder')]} press={t > 9.5 && t < 9.62 ? 1 : 0} />
    : <Composer text={compText} caret={!!compText} level={levelName} ring sendHover={(t > 6.3 && t < 6.42) || (t > 9.05 && t < 9.17)} />;

  return (
    <Fill bg={OMNI_BG}>
      <MBlur id="e-whip" bx={wb}>
        <div style={{ position: 'absolute', inset: 0, transform: `translateX(${chatOff}px)` }}>
          <Camera c={c}>
            <AppFrame side={<Sidebar tab={tab} space={res('space')} home={t < 3.0}>{tree}{history}</Sidebar>} overlay={docCard}>
              <Main header={t < 3.0 ? <HomeHeader /> : <ChatHeader title={tr('收藏资料里的 AI Agent 趋势', 'AI agent trends in my saves')} titleO={lin(t, 3.3, 3.45, 0, 1)} shareGlow={lin(t, 11.7, 11.8, 0, 1)} />}>
                <div className="relative flex min-h-0 flex-1 flex-col">
                  {/* 首页 */}
                  {homeO > 0 && (
                    <div className="absolute inset-0 flex flex-col" style={{ opacity: homeO }}>
                      <HomeBody tip={tr('列出包含“会议”标签的所有资源', 'List all resources tagged "meeting"')} chip={sp(t, 0.5)} composer={homeComposer} cards={<HomeCards recent={recent} />} />
                    </div>
                  )}
                  {/* 对话页 */}
                  {chatO > 0 && (
                    <div className="absolute inset-0 flex flex-col" style={{ opacity: chatO }}>
                      <ChatScroll>
                        <div style={{ position: 'relative', height: 700 }}>
                          {q1Block}
                          {q2Block}
                          {q3Block}
                        </div>
                      </ChatScroll>
                      <ChatComposerBar>{chatComposer}</ChatComposerBar>
                    </div>
                  )}
                </div>
              </Main>
            </AppFrame>
            <Cursor t={t} path={path} clicks={E_CLICKS} show={[1.3, 10.4]} size={34 / Math.max(1, c.s * 0.7)} />
          </Camera>
        </div>
        {/* 知乎原文（引用跳转） */}
        {t > 4.9 && t < 5.5 && (
          <div style={{ position: 'absolute', inset: 0, transform: `translateX(${chatOff + W}px)`, background: C.desk }}>
            {/* 浏览器窗口里的知乎原文 */}
            <div style={{ position: 'absolute', left: 260, top: 110, width: 1400, height: 860, borderRadius: 14, background: '#fff', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,.25)' }}>
              <BrowserChrome w={1400} title={`${Zc.zhihu.title} - ${Zc.zhihu.site}`} url="zhuanlan.zhihu.com/p/7281…" />
              {/* 原文页面，引文被定位并黄色高亮 */}
              <div style={{ position: 'absolute', left: 0, top: CHROME_H }}><ZhihuPage c={Zc} w={1400} h={860 - CHROME_H} sel={lin(t, 5.1, 5.25, 0, 1)} selColor="#FDE68A" /></div>
            </div>
          </div>
        )}
      </MBlur>

      <Caption t={t} a={3.8} b={5.3} text={tr('有问必答，句句有出处', 'Answers with sources. Every time.')} y={720} size={60} plate />
      <Caption t={t} a={7.0} b={8.15} text={tr('资料变成周报', 'Turn your sources into a weekly report.')} y={720} size={60} plate />
      <Caption t={t} a={10.0} b={10.9} text={tr('一句话，帮你整理好', 'One request. Everything organized.')} y={720} size={60} plate />

      <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: black }} />
      {t >= 11.0 && t < 11.85 && (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - lin(t, 11.7, 11.8, 0, 1) }}>
          <Band x={lin(t, 11.0, 11.6, 2200, -300)} o={0.55} />
          <Words t={t} times={[11.1, 11.25, 11.4]} words={tr(['记忆', '变成', '万物'], ['Memory', 'becomes', 'everything.'])} colors={['#7FB0FF']} />
          <Caption t={t} a={11.55} b={12} text={tr('问答 · 写作 · 执行', 'Ask · Write · Act')} y={600} size={40} />
        </div>
      )}
    </Fill>
  );
};
