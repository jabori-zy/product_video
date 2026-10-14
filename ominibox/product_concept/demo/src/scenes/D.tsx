import React from 'react';
import { Band, C, Camera, Caption, Fill, KeyHud, Tx, Words, kf, lin, morph, sp, typed } from '../lib';
import { AppShell, OI, Parsing, ResIcon, Row, Sidebar } from '../ui';
import { LOCALES } from '../data/content';
import { useLang, useRes, useTr } from '../i18n';
import { TYPED, stepOf, txt, type ResKey } from '../copy';
import { Board, KeyframeThumb, PdfLines, PdfPage, RagFrame } from '../content/understand';


// D 理解 · 万物变成记忆（12.0–18.0 s），局部时间 t = 全局 − 12

export const TREE0 = 376;
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
  { x: 340, y: 90, row: 1, st: 1.0, corner: ['文档 → 全文可搜', 'Documents → Full-text search'], tag: [['#产品', '#product']] },
  { x: 1120, y: 90, row: 2, st: 1.75, corner: ['图片 → 文字识别', 'Images → Text recognition'], tag: [['#会议', '#meeting']] },
  { x: 340, y: 560, row: 3, st: 2.5, corner: ['音视频 → 转写摘要', 'Audio & video → Transcripts'], tag: [['#待办', '#todo'], ['#会议', '#meeting']] },
  { x: 1120, y: 560, row: 4, st: 3.25, corner: null, tag: [['#AI', '#AI']] },
];
const TW = 760, TH = 430;
const tc = (i: number) => ({ x: TILES[i].x + TW / 2, y: TILES[i].y + TH / 2 });

const CAM = [
  { t: -0.2, x: 400, y: 480, s: 1.6, ry: 10 },
  { t: 0.6, x: 420, y: 520, s: 1.5, ry: 0 },
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
const rowY = (i: number) => TREE0 + i * 40;
/** D 的镜头（局部时间）：M1 插段从 D 开场定格帧出发，用同一个镜头拉远 */
export const dCam = (t: number) => kf(t, CAM);
/** ⌘J 搜索弹窗（屏幕坐标） */
const MODAL = { x: 250, y: 150, w: 1420, h: 560 };
const sel = (label: string, w: number, mt: number) => (
  <div style={{ marginTop: mt, width: w, height: 44, borderRadius: 8, border: '1px solid #444', boxSizing: 'border-box', display: 'flex', alignItems: 'center', padding: '0 14px', fontSize: 16, color: C.text }}>
    {label}<OI.down size={18} color={C.muted} style={{ marginLeft: 'auto' }} />
  </div>
);
/** C 段光点的汇聚点：新资源行落脚处（世界坐标），以及 D 开场镜头下它在画面上的位置（C 的光点飞向这里） */
const LAND_WORLD = { x: 40, y: rowY(5) + 17 };
export const LAND_SCREEN = (() => { const c = kf(0, CAM); return { x: (LAND_WORLD.x - c.x) * c.s + 960, y: (LAND_WORLD.y - c.y) * c.s + 540 }; })();

const Tile: React.FC<{ i: number; t: number }> = ({ i, t }) => {
  const lang = useLang(), tr = useTr(), res = useRes();
  const Z = LOCALES[lang]; // 线框里的真实内容（data/locales）
  const L = (p: string[]) => (lang === 'en' ? p[1] : p[0]);
  const k = TILES[i];
  const ry = rowY(3 + k.row);
  const m = morph(t, [
    { t: 0, x: 16, y: ry, w: 268, h: 34, r: 8 },
    { t: k.st, x: k.x, y: k.y, w: TW, h: TH, r: 18 },
  ]);
  if (t < k.st) return null;
  const o = lin(t, k.st + 0.2, k.st + 0.35, 0, 1);
  const q = (a: number, b: number) => lin(t, k.st + a, k.st + b, 0, 1);
  const collapse = lin(t, 4.5, 4.65, 0, 1);
  return (
    <div style={{ position: 'absolute', left: m.x, top: m.y, width: m.w, height: m.h, borderRadius: m.r, background: '#2e2e2e', border: '1px solid #3d3d3d', overflow: 'hidden', opacity: 1 - collapse, transform: `scale(${1 - 0.1 * collapse})` }}>
      <div style={{ position: 'absolute', inset: 0, opacity: o }}>
        <div style={{ position: 'absolute', left: 20, top: 16, display: 'flex', alignItems: 'center', gap: 10, color: C.text, fontSize: 20, fontWeight: 700 }}><ResIcon icon={NEW[k.row][0]} size={22} />{res(NEW[k.row][1])}</div>
        {k.corner && <div style={{ position: 'absolute', right: 16, top: 12, padding: '6px 14px', borderRadius: 999, background: '#4A8EF933', color: '#AFCBFF', fontSize: 18, fontWeight: 600, opacity: q(0.5, 0.65) }}>{L(k.corner)}</div>}
        {i === 0 && (
          <>
            <div style={{ position: 'absolute', left: 30, top: 60 }}><PdfPage c={Z} /></div>
            <div style={{ position: 'absolute', left: 300, top: 68 }}><PdfLines c={Z} reveal={q(0.3, 0.75)} w={430} size={17} /></div>
          </>
        )}
        {i === 1 && (
          <>
            <div style={{ position: 'absolute', left: 30, top: 60, borderRadius: 6, overflow: 'hidden' }}><Board c={Z} /></div>
            <div style={{ position: 'absolute', left: 30, top: 60 + 330 * q(0.25, 0.6), width: 330, height: 4, background: C.blue, boxShadow: `0 0 16px ${C.blue}`, opacity: t < k.st + 0.62 ? 1 : 0 }} />
            {[0, 1, 2].map((j) => (
              <React.Fragment key={j}>
                <div style={{ position: 'absolute', left: 60, top: 100 + j * 90, width: 240, height: 50, border: `3px solid ${C.blue}`, borderRadius: 4, opacity: q(0.3 + j * 0.1, 0.35 + j * 0.1) }} />
                <Tx x={400} y={110 + j * 90} s={22} c="#eee" style={{ opacity: q(0.4 + j * 0.1, 0.5 + j * 0.1) }}>{Z.board.lines[j]}</Tx>
              </React.Fragment>
            ))}
          </>
        )}
        {i === 2 && (
          <>
            {Array.from({ length: 44 }).map((_, j) => (
              <div key={j} style={{ position: 'absolute', left: 30 + j * 16, top: 100, width: 8, height: 10 + 50 * Math.abs(Math.sin(j * 1.7)), transform: 'translateY(-50%)', borderRadius: 4, background: '#6b8fd6', opacity: 1 - 0.6 * q(0.2, 0.4) }} />
            ))}
            <Tx x={30} y={150} s={20} c="#ddd">{typed(t, k.st + 0.2, tr('[00:12] 这周先把插件发版……', '[00:12] Ship the extension this week…'), tr(0.012, 0.007))}</Tx>
            <Tx x={30} y={185} s={20} c="#ddd">{typed(t, k.st + 0.3, tr('[00:31] 待办：周五前完成评审……', '[00:31] To-do: finish the review by Friday…'), tr(0.012, 0.006))}</Tx>
            <Tx x={30} y={240} s={20} c="#AFCBFF" b style={{ opacity: q(0.4, 0.45) }}>{tr('AI 摘要', 'AI summary')}</Tx>
            {tr(['① 插件周五发版', '② DAU 目标翻倍', '③ 下周复盘'], ['① Extension ships Friday', '② Double DAU', '③ Retro next week']).map((s, j) => {
              const p = sp(t, k.st + 0.45 + j * 0.1);
              return <Tx key={s} x={30} y={280 + j * 36} s={20} style={{ opacity: p, transform: `scale(${0.8 + 0.2 * p})`, transformOrigin: 'left center' }}>{s}</Tx>;
            })}
          </>
        )}
        {i === 3 && (
          <>
            <div style={{ position: 'absolute', left: 30, top: 60, borderRadius: 6, overflow: 'hidden' }}><RagFrame c={Z} /></div>
            <div style={{ position: 'absolute', left: 30, top: 275, width: 700, height: 10, borderRadius: 5, background: '#444' }} />
            {[0, 1, 2, 3].map((j) => (
              <React.Fragment key={j}>
                <div style={{ position: 'absolute', left: 30 + j * 175, top: 275, width: 170 * q(0.2 + j * 0.08, 0.3 + j * 0.08), height: 10, borderRadius: 5, background: ['#4A8EF9', '#22C55E', '#F59E0B', '#EC4899'][j] }} />
                <div style={{ position: 'absolute', left: 30 + j * 175, top: 305, opacity: q(0.3 + j * 0.08, 0.4 + j * 0.08) }}><KeyframeThumb c={Z} j={j} /></div>
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
  const tree = (
    <>
      <Tx x={26} y={340} s={15} c={C.muted}>{tr('个人 ⌄', 'Personal ⌄')}</Tx>
      {OLD.map(([ic, s], i) => <Row key={s} y={rowY(i)} icon={ic} text={resName(s)} />)}
      {NEW.map(([ic, s], i) => {
        const a = 0.22 + i * 0.2; // final：从 0.07 s 起才出现，C+ 在 0.05 s 定格时画面里还没有光点
        const p = sp(t, a + 0.12);
        const done = t > (TILES.find((k) => k.row === i)?.st ?? 1.0) + 0.6;
        return <Row key={s} y={rowY(3 + i)} icon={ic} text={resName(s)} o={p} dx={(1 - p) * -30} right={<Parsing t={t} done={done} />} />;
      })}
    </>
  );
  // 落进资源树的光点
  const dots = NEW.map((_, i) => {
    const a = 0.22 + i * 0.2; // final：从 0.07 s 起才出现，C+ 在 0.05 s 定格时画面里还没有光点
    const p = lin(t, a - 0.15, a + 0.12, 0, 1, (x) => x * x);
    if (p <= 0 || p >= 1) return null;
    return <div key={i} style={{ position: 'absolute', left: LAND_WORLD.x + (36 - LAND_WORLD.x) * p - 6, top: LAND_WORLD.y + (rowY(3 + i) + 17 - LAND_WORLD.y) * p - 6, width: 12, height: 12, borderRadius: '50%', background: '#fff', boxShadow: `0 0 18px ${C.blue}` }} />;
  });

  // ⌘J 搜索
  const sP = sp(t, 4.55);
  const q = typed(t, 4.65, txt(TYPED.search, lang), stepOf(TYPED.search, lang));
  // 搜索结果：[文件, 前文, 高亮, 中间, 高亮, 后文]
  const res = tr([
    ['🎙 周会录音.m4a', '…', '上周会议', '确定的', '待办', '：周五前发布插件…'],
    ['🖼 白板照片.jpg', '…', '会议', '', '待办', '：DAU 翻倍…'],
    ['📕 Q3 产品复盘.pdf', '…下季度', '', '', '待办', '清单…'],
  ], [
    ['🎙 Weekly Meeting Recording.m4a', '…', "last week's meeting", ' set these ', 'to-dos', ': ship the extension by Friday…'],
    ['🖼 Whiteboard Photo.jpg', '…', 'meeting', ' ', 'to-dos', ': double DAU…'],
    ['📕 Q3 Product Review.pdf', '…next quarter ', '', '', 'to-do', ' list…'],
  ]);
  const black = lin(t, 5.5, 5.6, 0, 1);

  return (
    <Fill bg={C.main}>
      <Camera c={c}>
        <AppShell />
        <Sidebar tab={0}>{tree}{dots}</Sidebar>
        {TILES.map((_, i) => <Tile key={i} i={i} t={t} />)}
      </Camera>
      <Caption t={t} a={4.0} b={4.5} text={tr('自动打标签', 'Automatically tagged')} y={930} size={56} plate />
      {/* ⌘J 搜索：按真实网页的搜索弹窗还原（输入行 + 资源结果 + 右侧筛选） */}
      {t >= 4.5 && t < 5.7 && (
        <>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.55)', opacity: Math.min(sP * 1.5, 1) }} />
          <div style={{ position: 'absolute', left: MODAL.x, top: MODAL.y, width: MODAL.w, height: MODAL.h, borderRadius: 16, background: '#1F1F1F', border: '1px solid #333', boxShadow: '0 30px 80px rgba(0,0,0,.5)', overflow: 'hidden', transformOrigin: '50% 40%', transform: `scale(${(0.92 + 0.08 * sP) * lin(t, 4.6, 5.4, 1, 1.06)})`, opacity: Math.min(sP * 1.5, 1) }}>
            {/* 输入行 */}
            <div style={{ position: 'absolute', left: 0, top: 0, width: MODAL.w, height: 70, borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', gap: 14, padding: '0 26px', boxSizing: 'border-box' }}>
              <OI.search size={24} color="#ddd" />
              <span style={{ flex: 1, color: '#fff', fontSize: 24, fontWeight: 600 }}>{q || <span style={{ color: C.muted, fontWeight: 400 }}>{tr('搜索', 'Search')}</span>}{t < 5.15 && <span style={{ display: 'inline-block', width: 2, height: 26, background: '#fff', marginLeft: 2, verticalAlign: 'middle' }} />}</span>
              <span style={{ color: '#ddd', fontSize: 18 }}>{tr('清除', 'Clear')}</span>
              <span style={{ width: 1, height: 22, background: '#444' }} />
              <OI.close size={22} color="#ddd" />
            </div>
            {/* 资源结果 */}
            <div style={{ position: 'absolute', left: 30, top: 92, color: C.muted, fontSize: 18, fontWeight: 600 }}>{tr('资源', 'Resources')}</div>
            {res.map((r, i) => {
              const p = sp(t, 5.15 + i * 0.07);
              const [ic, ...name] = r[0].split(' ');
              return (
                <div key={i} style={{ position: 'absolute', left: 22, top: 128 + i * 104, width: 1000, height: 92, borderRadius: 12, background: i === 0 ? '#3A3A3A' : undefined, padding: '14px 20px 0 58px', boxSizing: 'border-box', opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>
                  <div style={{ position: 'absolute', left: 20, top: 17 }}><ResIcon icon={ic} size={24} /></div>
                  <div style={{ color: '#fff', fontSize: 22, fontWeight: 700 }}>{name.join(' ')}</div>
                  <div style={{ color: '#a3a3a3', fontSize: 18, marginTop: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {r[1]}<span style={{ color: '#8AB4FF' }}>{r[2]}</span>{r[3]}<span style={{ color: '#8AB4FF' }}>{r[4]}</span>{r[5]}
                  </div>
                </div>
              );
            })}
            {/* 右侧筛选 */}
            <div style={{ position: 'absolute', left: 1046, top: 70, width: 1, height: MODAL.h - 70, background: '#333' }} />
            <div style={{ position: 'absolute', left: 1074, top: 92, width: 330, color: C.text }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: 22, fontWeight: 700 }}>{tr('筛选', 'Filters')}</span>
                <span style={{ marginLeft: 'auto', fontSize: 14, color: C.muted }}>{tr('条件行剩余：2 / 3', 'Rows left: 2 / 3')}</span>
              </div>
              <div style={{ fontSize: 17, fontWeight: 600, marginTop: 26 }}>{tr('匹配下列条件', 'Match these conditions')}</div>
              {sel(tr('全部', 'All'), 130, 12)}
              <div style={{ fontSize: 17, fontWeight: 600, marginTop: 22 }}>{tr('条件 1', 'Condition 1')}</div>
              <div style={{ display: 'flex', gap: 12 }}>{sel(tr('标题', 'Title'), 159, 12)}{sel(tr('包含', 'Contains'), 159, 12)}</div>
              <div style={{ marginTop: 12, height: 44, borderRadius: 8, border: '1px solid #444', color: C.muted, fontSize: 16, lineHeight: '44px', paddingLeft: 14 }}>{tr('请输入关键词', 'Enter a keyword')}</div>
              <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 8, fontSize: 17 }}><OI.plus size={18} />{tr('添加条件', 'Add condition')}</div>
            </div>
          </div>
        </>
      )}
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
