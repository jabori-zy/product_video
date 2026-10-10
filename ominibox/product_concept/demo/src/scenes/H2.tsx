import React from 'react';
import { C, Cat, Fill, Logo, blinkAt, hop, kf, lin, sp } from '../lib';
import { toOut } from '../pace';
import { textW, useTr } from '../i18n';

// H2 品牌结尾 · 方案 A「回文翻转」（替换 H，见 result/script-modify_slogon.md）
// 口号逐词出现 → 「万物」「记忆」沿两条弧线互换位置 → 双行整句「记忆变成万物 / 万物变成记忆」→ 开场的线稿小黑跳上「记忆」→
// 「记忆」缩成蓝色圆角方块、小黑钻进去，变成 logo 里探头的猫 → 品牌文字 → 眨眼淡出
// 局部时间 t = 全局 − 39；节奏按成片秒数 u（经 pace.ts 换算）来写，便于与脚本对时

const ROW_Y = 540; // 口号行中心
const ROW1 = 470; // v2：互换后第一行上移，第二行「万物 变成 记忆」出现在下面
const GROUND = 790; // 小黑探头时的地面（两行口号下方）
const BLUE = '#7FB0FF';

// 最终 logo（与原版 H 相同：260px 居中，随后左移 330）
const LS = 260;
const L0 = { x: 960 - LS / 2, y: 540 - LS / 2 };
const CW = LS * 0.76; // logo 里猫头宽
const CAT_BOTTOM = L0.y + LS * 0.36 + CW * 0.88; // logo 里猫头底边（被方块裁掉一截）

const Word: React.FC<{ text: string; x: number; y: number; fs: number; o?: number; blur?: number; rot?: number; color?: string; s?: number }> = ({ text, x, y, fs, o = 1, blur = 0, rot = 0, color = '#fff', s = 1 }) => (
  <div style={{ position: 'absolute', left: x - 400, top: y - 100, width: 800, height: 200, lineHeight: '200px', textAlign: 'center', fontSize: fs, fontWeight: 800, color, opacity: o, filter: blur > 0.2 ? `blur(${blur}px)` : undefined, transform: `rotate(${rot}deg) scale(${s})`, whiteSpace: 'nowrap' }}>{text}</div>
);

/** 线稿/实心小黑，锚点在底边中心 */
const Xiaohei: React.FC<{ x: number; y: number; sx?: number; sy?: number; s?: number; solid?: number; blink?: number; look?: number; lookY?: number }> = ({ x, y, sx = 1, sy = 1, s = 1, solid = 0, blink = 0, look = 0, lookY = 0 }) => (
  <div style={{ position: 'absolute', left: x, top: y }}>
    <div style={{ position: 'absolute', left: -75, bottom: 0, transformOrigin: '75px 100%', transform: `scale(${s * sx}, ${s * sy})` }}>
      <div style={{ opacity: 1 - solid }}><Cat w={150} fill={C.black} blink={blink} look={look} lookY={lookY} /></div>
      {solid > 0 && <div style={{ position: 'absolute', left: 0, top: 0, opacity: solid }}><Cat w={150} line={false} blink={blink} look={look} lookY={lookY} /></div>}
    </div>
  </div>
);

export const Hh2: React.FC<{ t: number }> = ({ t }) => {
  const tr = useTr();
  // 口号三词与排版：中文每词两个 150px 字；英文用小写、104px，按实测宽度排（互换后两端词宽度不同，需重新居中）
  const FS = tr(150, 104), GAP = tr(60, 44);
  const [W1, W2, W3] = tr(['万物', '变成', '记忆'], ['everything', 'becomes', 'memory']);
  const wd = [W1, W2, W3].map((w) => textW(w, FS, 800));
  const centers = (ws: number[]) => { const tot = ws.reduce((a, b) => a + b, 0) + GAP * (ws.length - 1); let x = 960 - tot / 2; return ws.map((w) => { const c = x + w / 2; x += w + GAP; return c; }); };
  const SLOT = centers(wd); // 互换前（也是第二行）：W1 W2 W3
  const [a3, a2, a1] = centers([wd[2], wd[1], wd[0]]); // 互换后：W3 W2 W1
  const ROW2 = tr(650, ROW1 + FS * 1.2);
  const uRaw = toOut(39 + t) - toOut(39); // 本段成片秒数（0 ≈ 结尾起点）
  // v2：互换之后插入 2 秒的「双行整句」，这期间原有时间线停在 3.3，之后整体顺延 2 秒
  const HOLD0 = 3.3, HOLD = 2.0;
  const u = uRaw < HOLD0 ? uRaw : Math.max(HOLD0, uRaw - HOLD);

  // ⓪ 双行：第一行「记忆 变成 万物」上移，第二行「万物 变成 记忆」逐词出现
  const rise = uRaw < 3.35 ? 0 : sp(uRaw, 3.35, { damping: 15, mass: 0.8 });
  const rowY = ROW_Y + (ROW1 - ROW_Y) * rise;
  const WORD_TOP = rowY - FS / 2; // 第一行字面顶端（小黑落脚处）
  const l2 = [3.6, 3.8, 4.0].map((a) => lin(uRaw, a, a + 0.4, 0, 1));

  // ① 逐词出现
  const rev = (a: number) => lin(u, a, a + 0.4, 0, 1);
  const r0 = rev(0.3), r1 = rev(0.75), r2 = rev(1.2); // final：光带一过就出第一个词，不留黑场

  // ② 互换：万物走上弧、记忆走下弧，变成像跷跷板一样点一下
  const sw = u < 2.1 ? 0 : sp(u, 2.1, { damping: 12, mass: 0.9 });
  const arc = Math.sin(Math.PI * Math.min(1, Math.max(0, sw)));
  const wanX = SLOT[0] + (a1 - SLOT[0]) * sw, wanY = rowY - 170 * arc;
  const jiX = SLOT[2] + (a3 - SLOT[2]) * sw, jiY = rowY + 170 * arc;
  const bianX = SLOT[1] + (a2 - SLOT[1]) * sw;
  const seesaw = 7 * arc * (sw < 0.5 ? 1 : -1);

  // ③ 小黑：从左边探头 → 跳上「记忆」（互换后在左侧）
  const LAND = 4.3;
  const d = u - LAND;
  const dip = d > 0 && u < 4.75 ? 9 * Math.exp(-d * 7) * Math.cos(d * 22) : 0; // 蹦床回弹
  let cat: { x: number; y: number; sx: number; sy: number; s: number } = { x: -90, y: GROUND, sx: 1, sy: 1, s: 1 };
  if (u < 3.95) {
    const pk = kf(u, [{ t: 3.3, x: -90 }, { t: 3.55, x: 40 }, { t: 3.65, x: 15 }, { t: 3.8, x: 60 }]);
    cat = { x: pk.x, y: GROUND, sx: 1, sy: 1, s: 1 };
  } else if (u < 4.75) {
    cat = { ...hop(u, 3.95, LAND, { x: 60, y: GROUND }, { x: a3, y: WORD_TOP }, 260, 0.12), s: 1 };
    cat.y += dip;
  }

  // ④ 其余两个词掉落；「记忆」缩成蓝色圆角方块并移到中心；小黑骑在方块上沿
  const fall = lin(u, 4.65, 5.05, 0, 1, (x) => x * x);
  const sq = u < 4.8 ? 0 : sp(u, 4.8, { damping: 15, mass: 0.8 });
  const sqW = wd[2] + (LS - wd[2]) * sq, sqH = FS + (LS - FS) * sq; // 起始 = 「记忆」字框：上沿正好是字面顶端，小黑不跳
  const sqX = a3 + (960 - a3) * sq, sqY = rowY + (ROW_Y - rowY) * sq;
  const sqTop = sqY - sqH / 2;
  const sqO = lin(u, 4.75, 4.95, 0, 1);
  if (u >= 4.75 && u < 5.35) cat = { x: sqX, y: sqTop, sx: 1, sy: 1, s: 1 };

  // ⑤ 小黑钻进方块：小跳 + 放大到 logo 里猫头的大小，线稿 → 实心
  const DIVE0 = 5.35, DIVE1 = 5.8;
  if (u >= 5.35) {
    const h = hop(u, DIVE0, DIVE1, { x: 960, y: sqTop }, { x: 960, y: CAT_BOTTOM }, 110, 0.08);
    const g = lin(u, DIVE0, DIVE1, 0, 1);
    cat = { ...h, s: 1 + (CW / 150 - 1) * g };
  }
  const solid = lin(u, 5.45, 5.8, 0, 1);
  const logoOn = u >= 5.9; // 交接给 Logo 组件（几何一致，不跳）

  // ⑥ 品牌文字
  // 英文品牌名更宽：logo + 间距 80 + 文字整体居中（中文保持原来的 −330 / 840）
  const brandW = Math.max(textW('Xiaohei OmniBox', 96, 800), textW('Your AI knowledge companion', 46, 500));
  const SHIFT = tr(-330, -(80 + brandW) / 2);
  const TEXT_X = tr(840, 960 + LS / 2 + SHIFT + 80);
  const shift = lin(u, 6.1, 6.6, 0, SHIFT);
  const line = (a: number) => lin(u, a, a + 0.4, 0, 1);
  const U_END = toOut(45) - toOut(39) - HOLD; // 本段最后一刻（u）
  const push = lin(u, 7.0, U_END, 1, 1.03);
  const fade = lin(u, U_END - 0.6, U_END - 0.1, 0, 1);
  const blink = blinkAt(u, [4.45, 8.2, U_END - 1.6]);
  const cta = u < 7.25 ? 0 : sp(u, 7.25, { damping: 11, mass: 0.7 });
  const look = u < 4.4 ? 0.9 : 0; // 先看着字，落地后看镜头
  const lookY = u >= 4.75 ? 0.5 : 0;

  const glow = Math.min(r0, 1 - lin(u, 4.6, 5.0, 0, 1));

  return (
    <Fill bg={C.black}>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${push})`, transformOrigin: '960px 540px', opacity: 1 - fade }}>
        {/* 口号背后的柔光 */}
        <div style={{ position: 'absolute', left: 260, top: 280, width: 1400, height: 560, borderRadius: '50%', background: `radial-gradient(ellipse, rgba(74,142,249,${0.18 * glow}) 0%, transparent 70%)` }} />

        {/* 口号三词 */}
        {u < 5.1 && (
          <>
            <Word text={W1} fs={FS} x={wanX} y={wanY + dip + fall * 420} o={r0 * (1 - fall)} blur={(1 - r0) * 12} rot={fall * -25} />
            <div style={{ position: 'absolute', inset: 0, transform: `rotate(${seesaw}deg)`, transformOrigin: `960px ${rowY}px` }}>
              <Word text={W2} fs={FS} x={bianX} y={rowY + dip + fall * 460} o={r1 * (1 - fall)} blur={(1 - r1) * 12} rot={fall * 18} />
            </div>
            {/* 第二行：万物 变成 记忆（和第一行一起掉落） */}
            {[W1, W2, W3].map((w, i) => (
              <Word key={`l2${w}`} text={w} fs={FS} x={SLOT[i]} y={ROW2 + fall * (380 + i * 40)} o={l2[i] * (1 - fall)} blur={(1 - l2[i]) * 12} rot={fall * [22, -14, 26][i]} color={i === 2 ? BLUE : '#fff'} />
            ))}
            <Word text={W3} fs={FS} x={u < 4.75 ? jiX : sqX} y={(u < 4.75 ? jiY : sqY) + dip} o={r2 * (1 - lin(u, 4.75, 4.95, 0, 1))} blur={(1 - r2) * 12} color={BLUE} s={u < 4.75 ? 1 : 1 - 0.3 * sq} />
          </>
        )}

        <div style={{ position: 'absolute', inset: 0, transform: `translateX(${shift}px)` }}>
          {/* 「记忆」→ 蓝色圆角方块（尺寸与 Logo 一致后交给 Logo） */}
          {!logoOn && sqO > 0 && (
            <div style={{ position: 'absolute', left: sqX - sqW / 2, top: sqY - sqH / 2, width: sqW, height: sqH, borderRadius: Math.min(sqW, sqH) * 0.24, background: `linear-gradient(180deg, ${C.blue}, ${C.blue2})`, opacity: sqO, overflow: 'hidden' }} />
          )}
          {/* 小黑：钻进方块后，方块下沿以下被裁掉（和 logo 里一样只露上半个头） */}
          {u >= 3.3 && !logoOn && (
            <div style={{ position: 'absolute', inset: 0, clipPath: u >= DIVE0 + 0.15 ? `inset(0 0 ${1080 - (sqY + sqH / 2)}px 0)` : undefined }}>
              <Xiaohei {...cat} solid={solid} blink={blink} look={look} lookY={lookY} />
            </div>
          )}
          {logoOn && (
            <div style={{ position: 'absolute', left: L0.x, top: L0.y }}>
              <Logo size={LS} blink={blink} />
            </div>
          )}
        </div>

        {/* 品牌文字（与原版相同的三行） */}
        {u >= 6.5 && (
          <div style={{ position: 'absolute', left: TEXT_X, top: 395 }}>
            {[
              { a: 6.55, s: 96, w: 800, c: '#fff', text: tr('小黑 OmniBox', 'Xiaohei OmniBox') },
              { a: 6.9, s: 46, w: 500, c: '#ddd', text: tr('你的 AI 知识伙伴', 'Your AI knowledge companion') },
            ].map((l) => (
              <div key={l.text} style={{ fontSize: l.s, fontWeight: l.w, color: l.c, marginBottom: 16, opacity: line(l.a), filter: `blur(${(1 - line(l.a)) * 10}px)`, whiteSpace: 'nowrap' }}>{l.text}</div>
            ))}
            {/* final：行动按钮（弹出）+ 网址 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 28, marginTop: 18, opacity: Math.min(1, cta * 1.5) }}>
              <div style={{ padding: '16px 40px', borderRadius: 999, background: `linear-gradient(180deg, ${C.blue}, #6FA6FB)`, color: '#fff', fontSize: 34, fontWeight: 700, boxShadow: `0 10px 40px ${C.blue}66`, transform: `scale(${0.6 + 0.4 * cta})`, transformOrigin: 'left center', whiteSpace: 'nowrap' }}>
                {tr('免费开始 →', 'Start for free →')}
              </div>
              <div style={{ fontSize: 34, fontWeight: 500, color: '#cfcfcf', letterSpacing: 0.5 }}>omnibox.pro</div>
            </div>
          </div>
        )}
      </div>
    </Fill>
  );
};
