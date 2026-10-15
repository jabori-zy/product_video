import React from 'react';
import { Band, C, Camera, Caption, Fill, KeyHud, Tx, Words, kf, lin, morph, sp, typed } from '../lib';
import { GroupLabel, Ic, OMNI_BG, Row, SearchDialog, SystemGroup, WebHome, Z, rowRect, rowTop, rowY } from '../ui';
import { LOCALES } from '../data/content';
import { useLang, useRes, useTr } from '../i18n';
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
  { x: 360, y: 90, row: 1, st: 1.0, corner: ['文档 → 全文可搜', 'Documents → Full-text search'], tag: [['#产品', '#product']] },
  { x: 1140, y: 90, row: 2, st: 1.75, corner: ['图片 → 文字识别', 'Images → Text recognition'], tag: [['#会议', '#meeting']] },
  { x: 360, y: 560, row: 3, st: 2.5, corner: ['音视频 → 转写摘要', 'Audio & video → Transcripts'], tag: [['#待办', '#todo'], ['#会议', '#meeting']] },
  { x: 1140, y: 560, row: 4, st: 3.25, corner: null, tag: [['#AI', '#AI']] },
];
const TW = 760, TH = 430;
const tc = (i: number) => ({ x: TILES[i].x + TW / 2, y: TILES[i].y + TH / 2 });

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
  const n = { '🌐': 'res-link', '📕': 'res-pdf', '🖼': 'res-image', '🎙': 'res-audio', '🎬': 'res-video' }[icon] ?? 'file-text';
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
            <Tx x={30} y={150} s={20} c="#404040">{typed(t, k.st + 0.2, tr('[00:12] 这周先把插件发版……', '[00:12] Ship the extension this week…'), tr(0.012, 0.007))}</Tx>
            <Tx x={30} y={185} s={20} c="#404040">{typed(t, k.st + 0.3, tr('[00:31] 待办：周五前完成评审……', '[00:31] To-do: finish the review by Friday…'), tr(0.012, 0.006))}</Tx>
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
            const p = sp(t, 4.0 + j * 0.08);
            return <span key={g} style={{ padding: '4px 14px', borderRadius: 999, background: ['#7C3AED', '#0EA5E9', '#F59E0B', '#22C55E'][(i + j) % 4], color: '#fff', fontSize: 18, transform: `scale(${p})`, display: 'inline-block' }}>{g}</span>;
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
    { icon: '🎙', title: '周会录音.m4a', text: '[00:31] 待办：上周会议确定的待办——周五前发布插件，下周一前完成评审，DAU 目标翻倍……' },
    { icon: '🖼', title: '白板照片.jpg', text: '会议待办：插件周五发版 / DAU 翻倍 / 下周复盘' },
    { icon: '📕', title: 'Q3 产品复盘.pdf', text: '……下季度待办清单：插件生态、移动端体验、团队协作……' },
  ], [
    { icon: '🎙', title: 'Weekly Meeting Recording.m4a', text: "[00:31] To-do: last week's meeting set these to-dos: ship the extension by Friday, finish the review by Monday, double DAU…" },
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
