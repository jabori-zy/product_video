import React from 'react';
import { interpolateColors } from 'remotion';
import { C, Cat, Fill, KeyHud, W, blinkAt, hop, kf, lin, sp, typed } from '../lib';
import { AppFrame, ChatComposerBar, ChatHeader, ChatScroll, Composer, HomeBody, HomeCards, HomeHeader, Main, Markdown, OMNI_BG, Sidebar, Tree, UserMsg, Z, useRecent } from '../ui';
import { useRes } from '../i18n';
import type { ResKey } from '../copy';
import { textW, useLang, useTr } from '../i18n';
import { OPEN_TEXT_EN, TYPED, openKeys, stepOf, txt } from '../copy';

// A 开场 · 你好，小黑！（0.0–5.0 s）
// 3.6 起出现真实网页首页（浅色，侧栏收起）；大字落进输入框 → 发送后变成对话页的用户气泡，侧栏展开，小黑回复

const CANDS: Record<string, string> = { n: '1.你好  2.拟好  3.你  4.呢', x: '1.小黑  2.小嘿  3.小  4.晓' };

// 版式（产品像素，侧栏收起的首页 / 侧栏展开的对话页，omni/Probe 量过）
const K = (14 * Z) / 96; // 大字 96px → 输入框 14px
const BUBBLE = { right: 1216 * Z, y: 92 * Z, k: (16 * Z) / 96 }; // 用户气泡文字：右缘 1216、行中心 92、16px
const COMP_TOP = 330 * Z; // 输入框上沿（小黑落位后被它挡住下半截）
const SLOT = { x: (386 + 46) * Z, y: (258.5 + 98) * Z }; // 首页小黑位（推荐问题左边）的底边中心
const GROUND = 588;
const TEXT_TOP = 495;
const OLD: [string, ResKey][] = [['🌐', 'zhihuHome'], ['📕', 'monthly'], ['📕', 'docker']];

export const A: React.FC<{ t: number }> = ({ t }) => {
  const lang = useLang(), tr = useTr(), res = useRes();
  const recent = useRecent();
  const KEYS = openKeys(lang);
  // ---- 排版（按实测文字宽度：中文 6 个 96px 字；英文更宽）----
  const full = tr('你好，小黑！', OPEN_TEXT_EN);
  const W_FULL = textW(full, 96);
  const left = 960 - (W_FULL + 11) / 2; // 11 = 光标宽度 + 间距
  const CAT_X = lang === 'en' ? left + textW('Hello, ', 96) + textW('Xiaohei', 96) / 2 : 1056; // 小黑落在「小黑 / Xiaohei」上
  const TEXT_IN_COMP = { x: 350 * Z + (W_FULL * K) / 2, y: 357.3 * Z }; // 文字在输入框里的中心（textarea 左 350、首行中心 357）
  const BUBBLE_X = BUBBLE.right - (W_FULL * BUBBLE.k) / 2;
  // ---- 打字 ----
  let committed = '';
  let pinyin = '';
  for (const [k, c, p] of KEYS) if (t >= k) { committed = c; pinyin = p; }
  const caretOn = (t < 0.4 && (t % 0.2) < 0.1) || (t >= 0.4 && t < 1.5) || (t >= 1.5 && t < 1.8 && t < 1.6);
  const lastKey = [...KEYS].reverse().find(([k]) => t >= k)?.[0] ?? -1;
  const pop = 1 + 0.04 * (1 - sp(t, lastKey, { damping: 12 }));

  // 踩字回弹
  const d = t - 3.15;
  const dip = d > 0 && t < 3.6 ? 6 * Math.exp(-d * 7) * Math.cos(d * 22) : 0;

  // 文字整体变换：中心 → 输入框 → 用户气泡
  const g = kf(t, [
    { t: 3.6, x: 960, y: 540, k: 1 },
    { t: 4.0, x: TEXT_IN_COMP.x, y: TEXT_IN_COMP.y, k: K },
    { t: 4.25, x: TEXT_IN_COMP.x, y: TEXT_IN_COMP.y, k: K },
    { t: 4.45, x: BUBBLE_X, y: BUBBLE.y, k: BUBBLE.k },
  ]);

  // ---- 小黑 ----
  let cat: any;
  let rot = 0;
  if (t < 2.3) {
    const pk = kf(t, [{ t: 1.8, x: -90 }, { t: 1.95, x: 20 }, { t: 2.05, x: -30 }, { t: 2.15, x: 45 }, { t: 2.3, x: 45 }]);
    cat = { x: pk.x, y: GROUND, sx: 1, sy: 1, s: 1 };
    rot = lin(t, 2.05, 2.15, 0, 10);
  } else if (t < 2.8) {
    cat = { ...hop(t, 2.4, 2.65, { x: 45, y: GROUND }, { x: 412, y: GROUND }, 180), s: 1 };
    rot = lin(t, 2.3, 2.4, 10, 0);
  } else if (t < 3.6) {
    cat = { ...hop(t, 2.88, 3.15, { x: 412, y: GROUND }, { x: CAT_X, y: TEXT_TOP }, 210, 0.08), s: 1 };
    cat.y += dip;
  } else {
    // 坐在文字上随文字移动，4.0 后滑到输入框上沿后方
    const ride = { x: g.x + (CAT_X - 960) * g.k, y: g.y - 45 * g.k };
    const p2 = sp(t, 4.0, { damping: 15 });
    const fx = SLOT.x, fy = SLOT.y;
    const s = lin(t, 3.6, 4.0, 1, 0.78) - 0.02 * p2;
    cat = { x: ride.x + (fx - ride.x) * (t >= 4.0 ? p2 : 0), y: ride.y + (fy - ride.y) * (t >= 4.0 ? p2 : 0), sx: 1, sy: 1, s };
    if (t >= 4.25) cat.y += lin(t, 4.25, 4.45, 0, 1) * 360; // 跟着输入框一起下沉
  }
  const look = t < 3.25 ? 1 : t < 3.6 ? 0 : -0.6;
  const lookY = t >= 3.6 ? 0.8 : 0;
  const blink = blinkAt(t, [3.4, 4.15]);

  // ---- 背景与界面 ----
  const bgP = lin(t, 3.6, 4.25, 0, 1);
  const bg = interpolateColors(bgP, [0, 1], [C.black, OMNI_BG]);
  const uiO = lin(t, 3.6, 3.95, 0, 1);
  const uiS = lin(t, 3.6, 4.0, 1.18, 1);
  const leave = lin(t, 4.25, 4.45, 0, 1);
  const open = lin(t, 4.25, 4.42, 0, 1); // 侧栏展开（气泡在 4.45 落定前展开完，落点就是最终版式）
  const bubbleO = lin(t, 4.35, 4.45, 0, 1);
  // 小黑：黑底上是描边线稿；浅色网页出现后变成产品里的实心黑猫头
  const catFill = interpolateColors(bgP, [0, 1], [C.black, '#171717']);
  const catLine = interpolateColors(lin(t, 3.6, 3.95, 0, 1), [0, 1], [C.cream, '#171717']);
  const ink = interpolateColors(lin(t, 3.6, 3.95, 0, 1), [0, 1], ['#ffffff', '#171717']); // 白字 → 落进白底输入框变深色
  const reply = typed(t, 4.5, txt(TYPED.reply, lang), stepOf(TYPED.reply, lang));

  const dust = lin(t, 2.65, 2.85, 0, 1);

  // final：气泡落定后推近对话（右上角为原点，气泡和回复都留在画面里），回复字不再小
  const zoom = lin(t, 4.4, 4.9, 1, 1.25);
  // 小黑落位后藏在输入框后面：按输入框上沿裁掉下半截（输入框跟着首页一起下沉时裁切线也跟着走）
  const compTop = COMP_TOP + (t >= 4.25 ? lin(t, 4.25, 4.45, 0, 1) * 300 : 0);
  const catClip = t >= 4.0 ? Math.max(0, cat.y - compTop) * (t >= 4.25 ? 1 : sp(t, 4.0, { damping: 15 })) : 0;
  return (
    <Fill bg={bg}>
     <div style={{ position: 'absolute', inset: 0, transform: `scale(${zoom})`, transformOrigin: '1540px 120px' }}>
      {/* 真实网页：首页（侧栏收起）→ 发送后侧栏展开、进入对话页 */}
      <div style={{ position: 'absolute', inset: 0, opacity: uiO, transform: `scale(${uiS})`, transformOrigin: '960px 540px' }}>
        {t >= 3.6 && (
          <AppFrame open={open} side={<Sidebar tab={0} space={res('space')} home={t < 4.25}><Tree rows={OLD.map(([ic, k]) => [ic, res(k)])} /></Sidebar>}>
            <Main header={t < 4.25 ? <HomeHeader collapsed /> : <ChatHeader title={tr('向小黑问好', 'Saying hi to Xiaohei')} collapsed={open < 1} titleO={lin(t, 4.6, 4.75, 0, 1)} />}>
              <div className="relative flex min-h-0 flex-1 flex-col">
                {t < 4.45 && (
                  <div className="absolute inset-0 flex flex-col" style={{ opacity: 1 - leave, transform: `translateY(${(leave * 300) / Z}px)` }}>
                    <HomeBody
                      tip={tr('创建一个文件夹“图片收藏”并移入最近的图片', 'Create an "Image collection" folder and move recent images into it')}
                      chip={sp(t, 3.85)} cat={null}
                      composer={<Composer ph={t < 3.85} ready={t >= 4.0} />}
                      cards={<HomeCards recent={recent} o={sp(t, 3.9)} dy={(1 - sp(t, 3.9)) * 45} />}
                    />
                  </div>
                )}
                {t >= 4.25 && (
                  <div className="absolute inset-0 flex flex-col" style={{ opacity: lin(t, 4.3, 4.45, 0, 1) }}>
                    <ChatScroll>
                      <div className="space-y-4">
                        <div style={{ opacity: bubbleO }}><UserMsg text={full} textO={t >= 4.45 ? 1 : 0} /></div>
                        {reply && <Markdown><p>{reply}</p></Markdown>}
                      </div>
                    </ChatScroll>
                    <ChatComposerBar><Composer ring /></ChatComposerBar>
                  </div>
                )}
              </div>
            </Main>
          </AppFrame>
        )}
      </div>

      {/* 小黑：落位后被输入框挡住下半截 */}
      {t >= 1.8 && (
        <div style={{ position: 'absolute', left: cat.x, top: cat.y, opacity: t >= 4.25 ? 1 - leave : 1 }}>
          <div style={{ position: 'absolute', left: -75, bottom: 0, width: 150, height: 300, clipPath: catClip > 0 ? `inset(0 -40px ${catClip}px -40px)` : undefined }}>
            <div style={{ position: 'absolute', left: 0, bottom: 0, transformOrigin: '75px 100%', transform: `rotate(${rot}deg) scale(${cat.s * cat.sx}, ${cat.s * cat.sy})` }}>
              <Cat w={150} fill={catFill} stroke={catLine} blink={blink} look={look} lookY={lookY} />
            </div>
          </div>
        </div>
      )}
      {/* 落地扬尘 */}
      {dust > 0 && dust < 1 && [-1, 0, 1].map((i) => (
        <div key={i} style={{ position: 'absolute', left: 412 + i * 70 - 14, top: GROUND - 6 - (i === 0 ? 10 : 0), width: 28, height: 4, borderRadius: 2, background: C.cream, opacity: 1 - dust, transform: `translate(${i * dust * 30}px, ${-dust * 14}px) rotate(${i * 30}deg)` }} />
      ))}

      {/* 开场白文字：同一个元素一路变形到输入框、再到用户气泡（4.45 起交给真实气泡里的文字） */}
      {t < 4.45 && (
        <div
          style={{
            position: 'absolute', left: 0, top: 470, width: W, height: 140, lineHeight: '140px', textAlign: 'center', color: ink, fontSize: 96, fontWeight: 500, whiteSpace: 'nowrap',
            transformOrigin: '960px 70px', transform: `translate(${g.x - 960}px, ${g.y - 540 + (t < 3.6 ? dip : 0)}px) scale(${g.k})`,
          }}
        >
          <span style={{ display: 'inline-block', transform: `scale(${t < 1.6 ? pop : 1})` }}>{committed}</span>
          {pinyin && <span style={{ fontSize: 64, color: '#ddd', textDecoration: 'underline', textUnderlineOffset: 10 }}>{pinyin}</span>}
          <span style={{ display: 'inline-block', width: 5, height: 96, marginLeft: 6, verticalAlign: 'middle', background: ink, opacity: caretOn ? 1 : 0 }} />
        </div>
      )}
      {/* 输入法候选条 */}
      {pinyin && (
        <div style={{ position: 'absolute', left: 960 - 230, top: 620, width: 460, padding: '12px 20px', borderRadius: 12, background: 'rgba(60,60,60,.6)', color: '#eee', fontSize: 26, textAlign: 'center' }}>
          {CANDS[pinyin[0]]}
        </div>
      )}
     </div>
      <KeyHud t={t} a={4.25} b={4.7} text={tr('⏎ 发送', '⏎ Send')} />
    </Fill>
  );
};
