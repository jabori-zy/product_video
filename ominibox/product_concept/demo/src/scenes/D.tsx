import React from 'react';
import { Band, C, Camera, Caption, Fill, KeyHud, Tx, Words, kf, lin, morph, sp, typed } from '../lib';
import { GroupLabel, Ic, OMNI_BG, Row, SearchDialog, SystemGroup, WebHome, Z, rowRect, rowTop, rowY } from '../ui';
import { LOCALES } from '../data/content';
import { textW, useLang, useRes, useTr } from '../i18n';
import { TYPED, stepOf, txt, type ResKey } from '../copy';
import { Board, KeyframeThumb, PdfLines, PdfPage, RagFrame } from '../content/understand';


// D 理解 · 万物变成记忆（12.0–18.0 s），局部时间 t = 全局 − 12
// 背景是真实网页（浅色，omni/）：侧栏资源树逐行长出新资源，四张理解卡片从对应的行里展开，最后 ⌘J 搜索弹窗（产品原样）

const OLD: [string, ResKey][] = [
  ['🌐', 'zhihuHome'],
  ['📕', 'monthly'],
  ['📕', 'docker'],
];
const NEW: [string, ResKey][] = [
  ['🌐', 'agentYear'],
  ['📕', 'q3'],
  ['🖼', 'board'],
  ['🎙', 'meeting'],
  ['🎬', 'rag'],
];
const TILES = [
  { x: 360, y: 90, row: 1, st: 1.0, corner: ['文档 → 全文可搜', 'Documents → Full-text search'], tag: [['#产品', '#product'], ['#复盘', '#review'], ['#数据', '#data']] },
  { x: 1140, y: 90, row: 2, st: 1.75, corner: ['图片 → 文字识别', 'Images → Text recognition'], tag: [['#会议', '#meeting'], ['#目标', '#goals'], ['#OKR', '#OKR']] },
  { x: 360, y: 560, row: 3, st: 2.5, corner: ['音视频 → 转写摘要', 'Audio & video → Transcripts'], tag: [['#待办', '#todo'], ['#周会', '#weekly'], ['#录音', '#audio']] },
  { x: 1140, y: 560, row: 4, st: 3.25, corner: null, tag: [['#AI', '#AI'], ['#RAG', '#RAG'], ['#教程', '#tutorial']] },
];
const TW = 760, TH = 430;
const tc = (i: number) => ({ x: TILES[i].x + TW / 2, y: TILES[i].y + TH / 2 });

// ---- 自动打标签：iMessage「回声」效果 ----
// 4.0 起每个标签各出一份（12 个标签互不重复）散在画面上，停一下，再各自飞回所属卡片右下角的标签位并合进去；落地时真标签弹出
const TAG_COLORS = ['#7C3AED', '#0EA5E9', '#F59E0B', '#22C55E'];
const tagColor = (i: number, j: number) => TAG_COLORS[(i + j) % 4];
const TAG_FS = 18, TAG_H = 30, TAG_GAP = 8;
const rnd = (k: number, s: number) => { const x = Math.sin(k * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); };
// 无关标签：和卡片内容无关、互不重复，散开后不回卡片，向画面外飞走并淡出
const DECOY: [string, string][] = [
  ['#灵感', '#ideas'], ['#旅行', '#travel'], ['#读书', '#reading'], ['#健身', '#fitness'], ['#美食', '#food'], ['#设计', '#design'],
  ['#招聘', '#hiring'], ['#财报', '#earnings'], ['#摄影', '#photo'], ['#电影', '#movies'], ['#英语', '#english'], ['#播客', '#podcast'],
  ['#音乐', '#music'], ['#理财', '#finance'], ['#育儿', '#parenting'], ['#宠物', '#pets'], ['#咖啡', '#coffee'], ['#跑步', '#running'],
  ['#心理学', '#psychology'], ['#历史', '#history'], ['#编程', '#coding'], ['#前端', '#frontend'], ['#后端', '#backend'], ['#运维', '#devops'],
  ['#营销', '#marketing'], ['#品牌', '#branding'], ['#运营', '#growth'], ['#法务', '#legal'], ['#合同', '#contracts'], ['#报销', '#expenses'],
  ['#日程', '#calendar'], ['#面试', '#interviews'], ['#简历', '#resume'], ['#论文', '#papers'], ['#考研', '#exams'], ['#健康', '#health'],
  ['#睡眠', '#sleep'], ['#烘焙', '#baking'], ['#露营', '#camping'], ['#游戏', '#gaming'],
];
const DECOY_COLORS = ['#64748B', '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16'];
// 真标签每个 (卡片, 标签) 一份 + 无关标签各一份，共 52 个、互不重复。
// 散开位置随机、疏密不均：约六成落在三个随机簇附近（扎堆），其余在全屏随机撒；只要求和已放的不完全叠住（椭圆距离 > 62）
const SLOTS: { i: number; j: number }[] = [...TILES.flatMap((k, i) => k.tag.map((_, j) => ({ i, j }))), ...DECOY.map((_, j) => ({ i: -1, j }))];
const CLUSTERS = [0, 1, 2].map((c) => ({ x: 300 + rnd(c, 21) * 1320, y: 200 + rnd(c, 22) * 680 }));
const SPOTS: { x: number; y: number }[] = [];
SLOTS.forEach((_, k) => {
  let best = { x: 960, y: 540 }, bestD = -1;
  for (let n = 0; n < 40; n++) {
    const r = (q: number) => rnd(k * 41 + n, q);
    let x, y;
    if (r(5) < 0.6) {
      const c = CLUSTERS[Math.floor(r(6) * 3)], ang = r(7) * Math.PI * 2, rad = 60 + (r(8) + r(9)) * 140;
      x = c.x + Math.cos(ang) * rad * 1.5; y = c.y + Math.sin(ang) * rad;
    } else { x = 140 + r(10) * 1640; y = 100 + r(11) * 880; }
    x = Math.max(120, Math.min(1800, x)); y = Math.max(90, Math.min(990, y));
    const d = Math.min(...SPOTS.map((p) => Math.hypot((p.x - x) / 1.7, p.y - y)), 1e9);
    if (d > 62) { best = { x, y }; break; }
    if (d > bestD) { bestD = d; best = { x, y }; }
  }
  SPOTS.push(best);
});
const ECHO = SLOTS.map(({ i, j }, k) => ({
  i, j, ...SPOTS[k],
  rot: (rnd(k, 3) - 0.5) * 40, s: 0.85 + rnd(k, 4) * 1.15,
  born: 4.0 + rnd(k, 12) * 0.2, back: 4.24 + rnd(k, 13) * 0.07,
}));
const ECHO_FLY = 0.1;
/** 第 j 个标签第一次有副本落地的时刻 → 真标签弹出 */
const tagArrive = (i: number, j: number) => Math.min(...ECHO.filter((e) => e.i === i && e.j === j).map((e) => e.back + ECHO_FLY));
const DECOY_FLY = 0.12;
const backOut = (x: number) => { const c = 1.70158; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
/** 卡片右下角第 j 个标签的中心（世界坐标）：标签行贴右 16、贴底 14，从右往左排 */
const tagSlot = (i: number, j: number, labels: string[]) => {
  const w = labels.map((g) => textW(g, TAG_FS, 400) + 28);
  let right = TILES[i].x + TW - 16;
  for (let n = labels.length - 1; n > j; n--) right -= w[n] + TAG_GAP;
  return { x: right - w[j] / 2, y: TILES[i].y + TH - 14 - TAG_H / 2 };
};

const CAM = [
  { t: -0.2, x: 440, y: 590, s: 1.6, ry: 10 },
  { t: 0.6, x: 460, y: 630, s: 1.5, ry: 0 },
  { t: 1.0, x: 960, y: 540, s: 1 },
  { t: 1.2, ...tc(0), s: 1.45 },
  { t: 1.75, ...tc(0), s: 1.45 },
  { t: 1.95, ...tc(1), s: 1.45 },
  { t: 2.5, ...tc(1), s: 1.45 },
  { t: 2.7, ...tc(2), s: 1.45 },
  { t: 3.25, ...tc(2), s: 1.45 },
  { t: 3.45, ...tc(3), s: 1.45 },
  { t: 3.8, ...tc(3), s: 1.45 },
  { t: 4.0, x: 960, y: 540, s: 1 },
  // final：⌘J 搜索框弹出后推近
  { t: 4.6, x: 960, y: 540, s: 1 },
  { t: 5.5, x: 960, y: 540, s: 1.2 },
];
/** D 的镜头（局部时间）：M1 插段从 D 开场定格帧出发，用同一个镜头拉远 */
export const dCam = (t: number) => kf(t, CAM);
/** 资源行图标中心（画布坐标）：行 li 左 8 + 缩进 28 + 图标半宽 8 */
const iconAt = (i: number) => ({ x: 44 * Z, y: rowY(i) + 17 * Z });
/** C 段光点的汇聚点：新资源行落脚处（世界坐标），以及 D 开场镜头下它在画面上的位置（C 的光点飞向这里） */
const LAND_WORLD = iconAt(5);
export const LAND_SCREEN = (() => { const c = kf(0, CAM); return { x: (LAND_WORLD.x - c.x) * c.s + 960, y: (LAND_WORLD.y - c.y) * c.s + 540 }; })();

/** 卡片标题上的资源图标：产品图标（卡片在 Shadow DOM 外，颜色直接写） */
const TileIcon: React.FC<{ icon: string }> = ({ icon }) => {
  const n = { '🌐': 'res-link', '📕': 'res-pdf', '🖼': 'res-image', '🎙': 'res-audio', '🎬': 'res-bilibili' }[icon] ?? 'file-text'; // 🎬 是 B 站链接（omnibox-web 按域名用 bilibili 图标）
  return <Ic n={n} style={{ width: 22, height: 22, fill: n === 'res-image' ? '#F43F5E' : undefined, flexShrink: 0 }} />;
};
const INK = '#171717', MUTED = '#737373';

const Tile: React.FC<{ i: number; t: number }> = ({ i, t }) => {
  const lang = useLang(), tr = useTr(), res = useRes();
  const ZC = LOCALES[lang]; // 线框里的真实内容（data/locales）
  const L = (p: string[]) => (lang === 'en' ? p[1] : p[0]);
  const k = TILES[i];
  const m = morph(t, [
    { t: 0, ...rowRect(3 + k.row) },
    { t: k.st, x: k.x, y: k.y, w: TW, h: TH, r: 18 },
  ]);
  if (t < k.st) return null;
  const o = lin(t, k.st + 0.2, k.st + 0.35, 0, 1);
  const q = (a: number, b: number) => lin(t, k.st + a, k.st + b, 0, 1);
  const collapse = lin(t, 4.5, 4.65, 0, 1);
  return (
    <div style={{ position: 'absolute', left: m.x, top: m.y, width: m.w, height: m.h, borderRadius: m.r, background: '#fff', border: '1px solid #E5E7EB', boxShadow: '0 18px 50px rgba(15,23,42,.14)', overflow: 'hidden', opacity: 1 - collapse, transform: `scale(${1 - 0.1 * collapse})` }}>
      <div style={{ position: 'absolute', inset: 0, opacity: o }}>
        <div style={{ position: 'absolute', left: 20, top: 16, display: 'flex', alignItems: 'center', gap: 10, color: INK, fontSize: 20, fontWeight: 700 }}><TileIcon icon={NEW[k.row][0]} />{res(NEW[k.row][1])}</div>
        {k.corner && <div style={{ position: 'absolute', right: 16, top: 12, padding: '6px 14px', borderRadius: 999, background: '#EFF6FF', color: '#2563EB', fontSize: 18, fontWeight: 600, opacity: q(0.5, 0.65) }}>{L(k.corner)}</div>}
        {i === 0 && (
          <>
            <div style={{ position: 'absolute', left: 30, top: 60 }}><PdfPage c={ZC} /></div>
            <div style={{ position: 'absolute', left: 300, top: 68 }}><PdfLines c={ZC} reveal={q(0.3, 0.75)} w={430} size={17} ink={[INK, '#525252']} /></div>
          </>
        )}
        {i === 1 && (
          <>
            <div style={{ position: 'absolute', left: 30, top: 60, borderRadius: 6, overflow: 'hidden' }}><Board c={ZC} /></div>
            <div style={{ position: 'absolute', left: 30, top: 60 + 330 * q(0.25, 0.6), width: 330, height: 4, background: C.blue, boxShadow: `0 0 16px ${C.blue}`, opacity: t < k.st + 0.62 ? 1 : 0 }} />
            {[0, 1, 2].map((j) => (
              <React.Fragment key={j}>
                <div style={{ position: 'absolute', left: 60, top: 100 + j * 90, width: 240, height: 50, border: `3px solid ${C.blue}`, borderRadius: 4, opacity: q(0.3 + j * 0.1, 0.35 + j * 0.1) }} />
                <Tx x={400} y={110 + j * 90} s={22} c={INK} style={{ opacity: q(0.4 + j * 0.1, 0.5 + j * 0.1) }}>{ZC.board.lines[j]}</Tx>
              </React.Fragment>
            ))}
          </>
        )}
        {i === 2 && (
          <>
            {Array.from({ length: 44 }).map((_, j) => (
              <div key={j} style={{ position: 'absolute', left: 30 + j * 16, top: 100, width: 8, height: 10 + 50 * Math.abs(Math.sin(j * 1.7)), transform: 'translateY(-50%)', borderRadius: 4, background: '#6b8fd6', opacity: 1 - 0.6 * q(0.2, 0.4) }} />
            ))}
            <Tx x={30} y={150} s={20} c="#404040">{typed(t, k.st + 0.2, tr('[00:12] Speaker1：这周先把插件发版……', '[00:12] Speaker1: Ship the extension this week…'), tr(0.012, 0.007))}</Tx>
            <Tx x={30} y={185} s={20} c="#404040">{typed(t, k.st + 0.3, tr('[00:31] Speaker2：待办，周五前完成评审……', '[00:31] Speaker2: To-do, finish the review by Friday…'), tr(0.012, 0.006))}</Tx>
            <Tx x={30} y={240} s={20} c="#2563EB" b style={{ opacity: q(0.4, 0.45) }}>{tr('AI 摘要', 'AI summary')}</Tx>
            {tr(['① 插件周五发版', '② DAU 目标翻倍', '③ 下周复盘'], ['① Extension ships Friday', '② Double DAU', '③ Retro next week']).map((s, j) => {
              const p = sp(t, k.st + 0.45 + j * 0.1);
              return <Tx key={s} x={30} y={280 + j * 36} s={20} c={INK} style={{ opacity: p, transform: `scale(${0.8 + 0.2 * p})`, transformOrigin: 'left center' }}>{s}</Tx>;
            })}
          </>
        )}
        {i === 3 && (
          <>
            <div style={{ position: 'absolute', left: 30, top: 60, borderRadius: 6, overflow: 'hidden' }}><RagFrame c={ZC} /></div>
            <div style={{ position: 'absolute', left: 30, top: 275, width: 700, height: 10, borderRadius: 5, background: '#E5E7EB' }} />
            {[0, 1, 2, 3].map((j) => (
              <React.Fragment key={j}>
                <div style={{ position: 'absolute', left: 30 + j * 175, top: 275, width: 170 * q(0.2 + j * 0.08, 0.3 + j * 0.08), height: 10, borderRadius: 5, background: ['#4A8EF9', '#22C55E', '#F59E0B', '#EC4899'][j] }} />
                <div style={{ position: 'absolute', left: 30 + j * 175, top: 305, opacity: q(0.3 + j * 0.08, 0.4 + j * 0.08) }}><KeyframeThumb c={ZC} j={j} /></div>
              </React.Fragment>
            ))}
          </>
        )}
        {/* 自动打标签 */}
        <div style={{ position: 'absolute', right: 16, bottom: 14, display: 'flex', gap: 8 }}>
          {k.tag.map(L).map((g, j) => {
            const a = tagArrive(i, j), p = t < a ? 0 : backOut(lin(t, a, a + 0.04, 0, 1, (x) => x));
            return <span key={g} style={{ height: TAG_H, lineHeight: `${TAG_H}px`, padding: '0 14px', borderRadius: 999, background: tagColor(i, j), color: '#fff', fontSize: TAG_FS, transform: `scale(${p})`, display: 'inline-block', boxSizing: 'border-box' }}>{g}</span>;
          })}
        </div>
      </div>
    </div>
  );
};

export const Dd: React.FC<{ t: number }> = ({ t }) => {
  const lang = useLang(), tr = useTr(), resName = useRes();
  const c = kf(t, CAM);
  // 新资源逐行长出来（真实的资源行；「系统」分组跟着往下让位）
  const grow = NEW.map((_, i) => sp(t, 0.22 + i * 0.2 + 0.12)); // final：从 0.07 s 起才出现，C+ 在 0.05 s 定格时画面里还没有光点
  const added = grow.reduce((a, b) => a + b, 0);
  const tree = (
    <>
      <GroupLabel top={308} text={tr('个人', 'Personal')} />
      {OLD.map(([ic, s], i) => <Row key={s} top={rowTop(i)} icon={ic} text={resName(s)} />)}
      {NEW.map(([ic, s], i) => <Row key={s} top={rowTop(3 + i)} icon={ic} text={resName(s)} o={grow[i]} dx={(1 - grow[i]) * -22} />)}
      <SystemGroup top={rowTop(2) + 36 * added + 34 + 8} />
    </>
  );
  // 落进资源树的光点（落在新行的图标上）
  const dots = NEW.map((_, i) => {
    const a = 0.22 + i * 0.2;
    const p = lin(t, a - 0.15, a + 0.12, 0, 1, (x) => x * x);
    if (p <= 0 || p >= 1) return null;
    const to = iconAt(3 + i);
    return <div key={i} style={{ position: 'absolute', left: LAND_WORLD.x + (to.x - LAND_WORLD.x) * p - 6, top: LAND_WORLD.y + (to.y - LAND_WORLD.y) * p - 6, width: 12, height: 12, borderRadius: '50%', background: '#fff', boxShadow: `0 0 18px ${C.blue}, 0 0 4px ${C.blue}` }} />;
  });

  // ⌘J 搜索（产品的搜索弹窗：输入行 + 资源结果 + 右侧筛选；结果摘要是资源正文，产品里不高亮）
  const sP = sp(t, 4.55);
  const q = typed(t, 4.65, txt(TYPED.search, lang), stepOf(TYPED.search, lang));
  const hits = tr([
    { icon: '🎙', title: '周会录音.m4a', text: '[00:31] Speaker2：上周会议确定的待办——周五前发布插件，下周一前完成评审，DAU 目标翻倍……' },
    { icon: '🖼', title: '白板照片.jpg', text: '会议待办：插件周五发版 / DAU 翻倍 / 下周复盘' },
    { icon: '📕', title: 'Q3 产品复盘.pdf', text: '……下季度待办清单：插件生态、移动端体验、团队协作……' },
  ], [
    { icon: '🎙', title: 'Weekly Meeting Recording.m4a', text: "[00:31] Speaker2: last week's meeting set these to-dos: ship the extension by Friday, finish the review by Monday, double DAU…" },
    { icon: '🖼', title: 'Whiteboard Photo.jpg', text: 'Meeting to-dos: ship extension Friday / double DAU / retro next week' },
    { icon: '📕', title: 'Q3 Product Review.pdf', text: '…next quarter to-do list: extension ecosystem, mobile experience, team collaboration…' },
  ]);
  const search = t >= 4.5 && t < 5.7 && (
    <SearchDialog query={q} caret={t < 5.15} hits={t >= 5.15 ? hits : []} hitO={(i) => sp(t, 5.15 + i * 0.07)} o={Math.min(sP * 1.5, 1)} s={0.95 + 0.05 * sP} />
  );
  const black = lin(t, 5.5, 5.6, 0, 1);

  return (
    <Fill bg={OMNI_BG}>
      <Camera c={c}>
        <WebHome homeO={0} tree={tree} overlay={search} />
        {dots}
        {TILES.map((_, i) => <Tile key={i} i={i} t={t} />)}
        {/* 标签回声：真标签 + 无关标签铺满画面 → 真标签飞回各自卡片的标签位，无关标签向外飞走淡出 */}
        {t >= 4.0 && t < 4.5 && ECHO.map((e, k) => {
          if (t < e.born) return null;
          const pop = backOut(lin(t, e.born, e.born + 0.035, 0, 1, (x) => x));
          if (e.i < 0) {
            const f = lin(t, e.back, e.back + DECOY_FLY, 0, 1, (x) => x * x);
            if (f >= 1) return null;
            const dx = e.x - 960, dy = e.y - 540, d = Math.hypot(dx, dy) || 1;
            const drift = (t - e.born) * 30;
            const x = e.x + (dx / d) * 1100 * f + Math.cos(k) * drift, y = e.y + (dy / d) * 1100 * f + Math.sin(k) * drift;
            return (
              <div key={k} style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) rotate(${e.rot * (1 + f)}deg) scale(${e.s * pop * (1 - 0.3 * f)})`, opacity: 1 - f, height: TAG_H, lineHeight: `${TAG_H}px`, padding: '0 14px', borderRadius: 999, background: DECOY_COLORS[e.j % DECOY_COLORS.length], color: '#fff', fontSize: TAG_FS, whiteSpace: 'nowrap', boxShadow: '0 8px 24px rgba(15,23,42,.18)', zIndex: 20 }}>{tr(DECOY[e.j][0], DECOY[e.j][1])}</div>
            );
          }
          const labels = TILES[e.i].tag.map((p) => tr(p[0], p[1]));
          const to = tagSlot(e.i, e.j, labels);
          const f = lin(t, e.back, e.back + ECHO_FLY, 0, 1, (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2));
          if (f >= 1) return null;
          const drift = (t - e.born) * 30;
          const x = e.x + (to.x - e.x) * f + (1 - f) * Math.cos(k) * drift, y = e.y + (to.y - e.y) * f + (1 - f) * Math.sin(k) * drift;
          const s = (e.s + (1 - e.s) * f) * pop, rot = e.rot * (1 - f), o = f > 0.8 ? (1 - f) / 0.2 : 1;
          return (
            <div key={k} style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${s})`, opacity: o, height: TAG_H, lineHeight: `${TAG_H}px`, padding: '0 14px', borderRadius: 999, background: tagColor(e.i, e.j), color: '#fff', fontSize: TAG_FS, whiteSpace: 'nowrap', boxShadow: '0 8px 24px rgba(15,23,42,.18)', zIndex: 20 }}>{labels[e.j]}</div>
          );
        })}
      </Camera>
      <Caption t={t} a={4.0} b={4.5} text={tr('自动打标签', 'Automatically tagged')} y={930} size={56} plate />
      <KeyHud t={t} a={4.5} b={5.0} text="⌘ J" />
      <Caption t={t} a={4.8} b={5.45} text={tr('⌘J，一搜就到', '⌘J. Search. Found.')} y={880} size={60} plate />
      <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: black }} />
      {t >= 5.5 && (
        <>
          <Band x={lin(t, 5.5, 6.0, -300, 2200)} o={0.55} />
          <Words t={t} times={[5.55, 5.7, 5.85]} words={tr(['万物', '变成', '记忆'], ['Everything', 'becomes', 'memory.'])} colors={['#fff', '#fff', '#7FB0FF']} />
        </>
      )}
    </Fill>
  );
};
