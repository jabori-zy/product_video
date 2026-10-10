import React from 'react';
import { Band, Box, C, Camera, Caption, Cat, Cursor, Fill, MBlur, Spinner, Tx, W, Words, blinkAt, inOut, kf, lin, morph, sp, typed } from '../lib';
import { Bars, Composer, HomeCards, Row, Sidebar } from '../ui';
import { TREE0 } from './D';

// E 应用 · 记忆变成万物（18.0–30.0 s），局部时间 t = 全局 − 18

const HISTORY: [string, string[]][] = [
  ['今天', ['你好，小黑！', '周会待办整理']],
  ['过去 7 天', ['RAG 和微调的区别', '买菜清单请求', 'Q3 复盘要点']],
  ['2026 年 9 月', ['知乎热榜总结', 'AI 新闻速览', '新对话']],
];
const TREE = [
  ['🌐', '首页 - 知乎'], ['🌐', 'AI Agent 元年…（知乎）'], ['📕', 'Q3 产品复盘.pdf'], ['🖼', '白板照片.jpg'], ['🎙', '周会录音.m4a'],
  ['🎬', '10 分钟看懂 RAG（B 站）'], ['📕', 'Superexx 2024 年 10 月月报.pdf'], ['📕', 'Docker 技术入门与实战（第 4 版）.pdf'], ['📝', 'AI 动态周报 · 第 40 周'],
];
const MOVE = [1, 5, 8, 0, 2, 7]; // 被 Agent 归档进「AI 研究」的 6 条
const STAY = [3, 4, 6];
const rowY = (i: number) => TREE0 + i * 40;

const FULL = { x: 960, y: 540, s: 1 };
const CAM = [
  { t: -0.3, x: 200, y: 500, s: 1.4 },
  { t: 0, x: 200, y: 500, s: 1.4 },
  { t: 1.5, x: 1110, y: 540, s: 1.1 },
  { t: 1.6, x: 1110, y: 540, s: 1.1 },
  { t: 2.0, x: 1110, y: 640, s: 1.6 },
  { t: 2.9, x: 1110, y: 640, s: 1.6 },
  { t: 3.0, x: 1110, y: 640, s: 1.9 },
  { t: 3.2, x: 1110, y: 420, s: 1.25 },
  { t: 4.5, ...FULL },
  { t: 9.3, ...FULL },
  { t: 9.45, x: 700, y: 320, s: 2.4 },
  { t: 9.6, x: 700, y: 320, s: 2.4 },
  { t: 9.9, ...FULL },
];

const COMP_HOME = { x: 630, y: 560, w: 960 };
const COMP_CHAT = { x: 630, y: 900, w: 960, h: 120 };

const Bubble: React.FC<{ y: number; text: string; o: number }> = ({ y, text, o }) => (
  <div style={{ position: 'absolute', right: W - 1590, top: y, padding: '12px 20px', borderRadius: 16, background: '#383838', color: '#fff', fontSize: 22, opacity: o, transform: `translateY(${(1 - o) * 20}px)` }}>{text}</div>
);

export const Ee: React.FC<{ t: number }> = ({ t }) => {
  const c = kf(t, CAM);

  // ---- 侧栏：资源 → 对话 → 资源 ----
  const tab = t < 7.9 ? sp(t, 0) : 1 - sp(t, 7.9);
  const histO = tab;
  const folderP = sp(t, 9.8);
  const expand = (j: number) => sp(t, 10.6 + j * 0.05);
  const compact = lin(t, 10.55, 10.75, 0, 1);
  const tree = (
    <div style={{ opacity: 1 - histO }}>
      <Tx x={26} y={340} s={15} c={C.muted}>个人 ⌄</Tx>
      {t >= 9.8 && <Row y={rowY(0)} icon="📁" text="AI 研究" o={folderP} hl={t > 10.1 && t < 10.7} right={t > 10.6 ? <span>⌄</span> : undefined} />}
      {TREE.map(([ic, s], i) => {
        if (i === 8 && t < 8.3) return null;
        const mi = MOVE.indexOf(i);
        const base = rowY(i + folderP);
        if (mi >= 0) {
          const st = 10.1 + mi * 0.07;
          const p = lin(t, st, st + 0.2, 0, 1, inOut);
          if (p >= 1) return null;
          return <Row key={s} y={base + (rowY(0) - base) * p} icon={ic} text={s} o={(i === 8 ? sp(t, 8.3) : 1) * (1 - p)} s={1 - 0.4 * p} />;
        }
        const k = STAY.indexOf(i);
        return <Row key={s} y={base + (rowY(7 + k) - base) * compact} icon={ic} text={s} />;
      })}
      {t >= 10.6 && MOVE.map((i, j) => (
        <Row key={`in${i}`} y={rowY(1 + j)} indent={22} icon={TREE[i][0]} text={TREE[i][1]} o={expand(j)} right={<span style={{ color: '#8AB4FF' }}>#AI</span>} />
      ))}
    </div>
  );
  const history = (
    <div style={{ opacity: histO }}>
      <Tx x={190} y={340} s={16} c={C.muted}>🔍　＋</Tx>
      {(() => {
        let y = 370;
        let n = 0;
        return HISTORY.map(([g, items]) => {
          const gy = y;
          y += 30;
          const rows = items.map((s) => {
            const ry = y;
            y += 38;
            const p = sp(t, 0.2 + n++ * 0.07);
            return <Row key={s} y={ry} icon="💬" text={s} o={p} dx={(1 - p) * -20} hl={s === '你好，小黑！'} />;
          });
          y += 8;
          return (
            <React.Fragment key={g}>
              <Tx x={26} y={gy} s={15} c={C.muted}>{g}</Tx>
              {rows}
            </React.Fragment>
          );
        });
      })()}
    </div>
  );

  // ---- 首页 → 对话页 ----
  const homeO = 1 - lin(t, 2.95, 3.1, 0, 1);
  const chatO = lin(t, 3.0, 3.1, 0, 1);
  const q1 = typed(t, 1.7, '我收藏的资料里，AI Agent 有哪三个趋势？', 0.042);
  const think = t >= 2.65 ? 1 : 0;

  // Q1 回答
  const q1Fade = lin(t, 5.6, 5.8, 0, 1);
  const status =
    t < 3.2 ? <><Spinner t={t} size={16} /> 思考中…</> :
    t < 3.5 ? <span>深度思考 ⌃<div style={{ fontSize: 15, color: '#777', marginTop: 6 }}>{typed(t, 3.2, '用户在问收藏资料里的趋势，先检索知识库里与 AI Agent 相关的内容……', 0.006)}</div></span> :
    t < 3.7 ? <><Spinner t={t} size={16} /> 搜索中...</> : <span>深度思考 ⌄</span>;
  const heads = ['1. 从对话到行动：Agent 开始替你执行任务', '2. 长期记忆成为标配', '3. 个人知识库变成 AI 的上下文'];

  // 引用 → 知乎原文 → 甩回（内部甩镜）
  const w1 = lin(t, 4.95, 5.1, 0, 1, inOut);
  const w2 = lin(t, 5.3, 5.45, 0, 1, inOut);
  const chatOff = t < 5.3 ? -W * w1 : -W * (1 - w2);
  const wb = Math.sin(Math.PI * w1) * 30 + Math.sin(Math.PI * w2) * 30;

  // Q2 周报
  const mode = lin(t, 5.6, 5.75, 0, 1);
  const q2 = typed(t, 5.7, '把这些整理成一份周报', 0.06);
  const q3 = typed(t, 8.5, '帮我把 AI 相关资料归档，并打上标签', 0.034);
  const compText = t < 6.4 ? (t >= 5.7 ? q2 : '') : t >= 8.5 && t < 9.15 ? q3 : '';
  const q2O = lin(t, 6.45, 6.6, 0, 1) * (1 - lin(t, 8.35, 8.5, 0, 1));
  const doc = morph(t, [
    { t: 0, x: 630, y: 190, w: 960, h: 640, r: 16 },
    { t: 7.95, x: 16, y: rowY(8), w: 268, h: 34, r: 8 },
  ]);
  const docInner = 1 - lin(t, 7.95, 8.05, 0, 1);
  const docShow = t >= 6.5 && t < 8.3;

  // Q3 Agent
  const q3O = lin(t, 9.2, 9.35, 0, 1);
  const approved = t >= 9.8;

  const black = Math.min(lin(t, 11.0, 11.1, 0, 0.88), 0.88 - lin(t, 11.7, 11.8, 0, 0.88));

  const path = [
    { t: 1.3, x: 1300, y: 820 }, { t: 1.6, x: 900, y: 600 }, { t: 2.5, x: 900, y: 610 }, { t: 2.65, x: 875, y: 682 }, { t: 2.85, x: 1554, y: 680 },
    { t: 4.45, x: 1300, y: 600 }, { t: 4.6, x: 872, y: 377 }, { t: 5.45, x: 872, y: 377 }, { t: 5.58, x: 907, y: 988 },
    { t: 6.2, x: 1200, y: 960 }, { t: 6.38, x: 1554, y: 988 }, { t: 7.5, x: 1000, y: 870 }, { t: 7.75, x: 705, y: 852 },
    { t: 8.6, x: 1200, y: 960 }, { t: 9.1, x: 1554, y: 988 }, { t: 9.4, x: 695, y: 320 }, { t: 10.2, x: 900, y: 520 },
  ];

  return (
    <Fill bg={C.main}>
      <MBlur id="e-whip" bx={wb}>
        <div style={{ position: 'absolute', inset: 0, transform: `translateX(${chatOff}px)` }}>
          <Camera c={c}>
            <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, background: C.main }} />
            <Sidebar tab={tab}>{tree}{history}</Sidebar>

            {/* 聊天首页 */}
            <div style={{ position: 'absolute', inset: 0, opacity: homeO }}>
              <div style={{ position: 'absolute', left: 300, top: 300, width: 1620, textAlign: 'center', color: '#fff', fontSize: 34, fontWeight: 600 }}>晚上好，今天有什么可以帮您的吗？</div>
              <div style={{ position: 'absolute', left: 690, top: 455 }}><Cat w={120} fill={C.main} blink={blinkAt(t, [0.8, 2.2])} look={t > 1.6 ? 0.6 : 0} lookY={t > 1.6 ? 0.6 : 0} /></div>
              <div style={{ position: 'absolute', left: 830, top: 470, padding: '10px 22px', borderRadius: 999, background: '#383838', color: '#cfcfcf', fontSize: 18, transform: `scale(${sp(t, 0.5)})`, transformOrigin: 'left bottom' }}>列出包含"会议"标签的所有资源</div>
              <Composer x={COMP_HOME.x} y={COMP_HOME.y} w={COMP_HOME.w} text={q1} ph={q1 ? 0 : 1} think={think} send={q1.length > 5 ? 1 : 0} caret={t > 1.6 && t < 2.9} />
              <HomeCards x={COMP_HOME.x} y={850} w={COMP_HOME.w} t={t} a={-1} />
            </div>

            {/* 对话页 */}
            <div style={{ position: 'absolute', inset: 0, opacity: chatO }}>
              <div style={{ position: 'absolute', right: 30, top: 24, padding: '8px 18px', borderRadius: 10, background: '#333', color: '#fff', fontSize: 18, boxShadow: t > 11.7 ? `0 0 0 3px ${C.blue}, 0 0 30px ${C.blue}` : undefined }}>⤴ 分享</div>
              <div style={{ position: 'absolute', inset: 0, opacity: 1 - q1Fade, transform: `translateY(${-q1Fade * 200}px)` }}>
                <Bubble y={100} text="我收藏的资料里，AI Agent 有哪三个趋势？" o={chatO} />
                <div style={{ position: 'absolute', left: 630, top: 175, color: C.muted, fontSize: 18, display: 'flex', gap: 8, alignItems: 'center', width: 960 }}>{status}</div>
                {heads.map((h, j) => {
                  const a = 3.7 + j * 0.27;
                  return (
                    <React.Fragment key={h}>
                      <Tx x={630} y={240 + j * 120} s={24} b>
                        {typed(t, a, h, 0.008)}
                        {t > a + 0.2 && <span style={{ display: 'inline-flex', marginLeft: 8, width: 26, height: 26, borderRadius: '50%', background: C.blue, color: '#fff', fontSize: 15, alignItems: 'center', justifyContent: 'center', verticalAlign: 'middle', transform: `scale(${sp(t, a + 0.2)})`, boxShadow: j === 1 && t > 4.6 && t < 5.0 ? '0 0 0 4px #fff6' : undefined }}>{'①②③'[j]}</span>}
                      </Tx>
                      <Bars x={630} y={285 + j * 120} n={2} w={900} gap={26} reveal={lin(t, a + 0.08, a + 0.25, 0, 1)} />
                    </React.Fragment>
                  );
                })}
                {t > 4.65 && t < 4.95 && (
                  <div style={{ position: 'absolute', left: 880, top: 400, padding: '14px 20px', borderRadius: 12, background: '#3a3a3a', border: '1px solid #555', color: '#ddd', fontSize: 18, transform: `scale(${sp(t, 4.65)})`, transformOrigin: 'left top' }}>来源：AI Agent 元年…（知乎）· 段落</div>
                )}
              </div>

              {/* Q2：周报 */}
              <div style={{ position: 'absolute', inset: 0, opacity: q2O }}>
                <Bubble y={100} text="把这些整理成一份周报" o={q2O} />
                {t < 8.3 && (
                  <div style={{ position: 'absolute', left: 630, top: 842, display: 'flex', gap: 28, color: C.muted, fontSize: 22, opacity: docInner }}>
                    <span>⟳</span><span>⧉</span><span style={{ color: t > 7.75 ? '#fff' : C.muted }}>⬇</span><span>↗</span>
                    {t > 7.7 && <span style={{ fontSize: 16, background: '#111', color: '#fff', padding: '4px 10px', borderRadius: 6 }}>将当前回复保存至个人空间</span>}
                  </div>
                )}
              </div>
              {/* Q3：Agent 工具调用 */}
              {t >= 9.15 && (
                <div style={{ position: 'absolute', inset: 0, opacity: q3O }}>
                  <Bubble y={100} text="帮我把 AI 相关资料归档，并打上标签" o={q3O} />
                  <Tx x={630} y={180} s={18} c={C.muted}>Agent 2.1 · 工具调用</Tx>
                  <Tx x={630} y={220} s={22} style={{ opacity: sp(t, 9.25) }}>✓ 搜索资源 · 找到 6 条</Tx>
                  {t >= 9.35 && (
                    <Tx x={630} y={268} s={22} c={approved ? C.text : '#FBBF24'} style={{ opacity: sp(t, 9.35) }}>
                      {approved ? '✓ 创建文件夹「AI 研究」' : '⏸ 创建文件夹「AI 研究」 · 等待确认'}
                    </Tx>
                  )}
                  {t >= 9.35 && (
                    <div style={{ position: 'absolute', left: 650, top: 304, display: 'flex', gap: 12, opacity: 1 - lin(t, 9.8, 9.9, 0, 1) }}>
                      <span style={{ padding: '6px 18px', borderRadius: 8, background: '#fff', color: '#111', fontSize: 18, fontWeight: 700, transform: `scale(${t > 9.5 && t < 9.62 ? 0.92 : 1})`, display: 'inline-block' }}>同意</span>
                      <span style={{ padding: '6px 18px', borderRadius: 8, border: '1px solid #666', color: '#ddd', fontSize: 18 }}>拒绝</span>
                      <span style={{ padding: '6px 18px', borderRadius: 8, border: '1px solid #666', color: '#ddd', fontSize: 18 }}>全部同意</span>
                    </div>
                  )}
                  {t >= 10.1 && <Tx x={630} y={360} s={22} style={{ opacity: sp(t, 10.1) }}>✓ 移动 6 条资源</Tx>}
                  {t >= 10.4 && <Tx x={630} y={408} s={22} style={{ opacity: sp(t, 10.4) }}>✓ 添加标签 #AI</Tx>}
                </div>
              )}
              <Composer x={COMP_CHAT.x} y={COMP_CHAT.y} w={COMP_CHAT.w} h={COMP_CHAT.h} text={compText} ph={compText ? 0 : 1} mode={mode} send={compText.length > 3 ? 1 : 0} caret={!!compText} />
              <div style={{ position: 'absolute', left: 630, top: 1036, width: 960, textAlign: 'center', color: '#777', fontSize: 14 }}>内容由小黑 AI 生成，仅供参考</div>
            </div>

            {/* 周报文档：生成 → 缩成一行飞进资源树 */}
            {docShow && (
              <div style={{ position: 'absolute', left: doc.x, top: doc.y, width: doc.w, height: doc.h, borderRadius: doc.r, background: '#2e2e2e', border: '1px solid #444', overflow: 'hidden', opacity: q2O }}>
                <div style={{ position: 'absolute', left: 36, top: 30 + lin(t, 6.6, 7.8, 0, -380), width: 880, opacity: docInner }}>
                  <Tx x={0} y={0} s={32} b>{typed(t, 6.5, 'AI 动态周报 · 第 40 周', 0.02)}</Tx>
                  <Tx x={0} y={56} s={18} c={C.muted} style={{ opacity: lin(t, 6.6, 6.7, 0, 1) }}>目录：本周要点 · 重点资料 · 待办</Tx>
                  {['一、本周要点', '二、重点资料', '三、待办'].map((h, j) => {
                    const a = 6.7 + j * 0.35;
                    return (
                      <React.Fragment key={h}>
                        <Tx x={0} y={110 + j * 260} s={24} b style={{ opacity: lin(t, a, a + 0.08, 0, 1) }}>{h}</Tx>
                        {j < 2 ? (
                          <Bars x={0} y={160 + j * 260} n={5} w={860} gap={34} reveal={lin(t, a + 0.05, a + 0.3, 0, 1)} />
                        ) : (
                          ['周五前发布插件 ｜ 林 ｜ 进行中', 'DAU 目标拆解 ｜ 王 ｜ 未开始', '下周复盘会 ｜ 全员 ｜ 已排期'].map((r, k) => (
                            <Box key={r} x={0} y={170 + j * 260 + k * 56} w={860} h={46} r={6} bg="#3a3a3a" lc="#ddd" fs={18} label={r} style={{ opacity: lin(t, a + 0.1 + k * 0.08, a + 0.2 + k * 0.08, 0, 1) }} />
                          ))
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            )}
            <Cursor t={t} path={path} clicks={[1.6, 2.65, 2.9, 4.9, 5.6, 6.4, 7.9, 9.15, 9.5]} show={[1.3, 10.4]} size={34 / Math.max(1, c.s * 0.7)} />
          </Camera>
        </div>
        {/* 知乎原文（引用跳转） */}
        {t > 4.9 && t < 5.5 && (
          <div style={{ position: 'absolute', inset: 0, transform: `translateX(${chatOff + W}px)`, background: C.desk }}>
            <Box x={260} y={110} w={1400} h={860} r={14} bg="#fff" label="" />
            <Box x={260} y={110} w={1400} h={44} r={0} bg="#DCDCDF" lc="#444" fs={16} label="浏览器 · zhuanlan.zhihu.com" />
            <Box x={420} y={200} w={1080} h={300} label="知乎页面" fs={40} />
            <div style={{ position: 'absolute', left: 416, top: 556, width: 640 * lin(t, 5.1, 5.25, 0, 1) + 10, height: 40, background: '#FDE68A', borderRadius: 4 }} />
            <Tx x={420} y={560} s={24} c="#222">真正的第二大脑，不是收藏夹，而是能回答你问题的记忆</Tx>
            <Box x={420} y={630} w={1080} h={280} label="正文（占位）" fs={28} />
          </div>
        )}
      </MBlur>

      <Caption t={t} a={3.8} b={5.3} text="有问必答，句句有出处" y={720} size={60} />
      <Caption t={t} a={7.0} b={8.3} text="资料变成周报" y={720} size={60} />
      <Caption t={t} a={10.0} b={10.9} text="一句话，帮你整理好" y={720} size={60} />

      <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: black }} />
      {t >= 11.0 && t < 11.85 && (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - lin(t, 11.7, 11.8, 0, 1) }}>
          <Band x={lin(t, 11.0, 11.6, 2200, -300)} o={0.55} />
          <Words t={t} times={[11.1, 11.25, 11.4]} words={['记忆', '变成', '万物']} y={420} />
          <Caption t={t} a={11.55} b={12} text="问答 · 写作 · 执行" y={600} size={40} />
        </div>
      )}
    </Fill>
  );
};
