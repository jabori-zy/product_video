import { clamp, seg, eo, hash } from '/core/lib.js';
import * as UI from './ui.js';
import * as XH from './xiaohei.js';
import * as FM from './film.js';

const Q = new URLSearchParams(location.search), NOSUBS = Q.has('nosubs');
const wEl = document.getElementById('w'), spr = document.getElementById('spr'), hudEl = document.getElementById('hud');
const mbg = document.getElementById('mbg'), mbw = document.getElementById('mbw');

const words = await (await fetch('voices/words.json')).json();
words.__dur = await (await fetch('voices/dur.json')).json();
FM.build(words);
window.DUR = FM.DUR;
window.EV = FM.EV.slice().sort((a, b) => a.t - b.t);
// 开场与片尾的话画面上已有大字（片名、口号），不烧录，只进 .srt
const plain = s => s.replace(/[{}]/g, ''), vo = id => ({ t0: FM.VO[id] - .05, t1: FM.VO[id] + words.__dur[id] + .3 });
window.SUBS = [{ ...vo('v1'), text: '这是小黑，你的 AI 知识伙伴。' }, ...FM.SUBS.map(s => ({ t0: s.t0, t1: s.t1, text: plain(s.text) })),
  { t0: vo('v5a').t0, t1: vo('v5b').t1, text: '万物变成记忆，记忆变成万物。' }];
window.T = FM.T;

const tf = ([cx, cy, z]) => `translate(960px,540px) scale(${z}) translate(${-cx}px,${-cy}px)`;
function render(t) {
  const F = FM.frame(t), [cx, cy, z] = F.cam;
  wEl.innerHTML = UI.desk() + (F.app ? UI.appWin(F.app) : '') + (F.extra || '');
  for (const el of [wEl, spr]) el.style.transform = tf(F.cam);
  // 锚点：元素上一点的世界坐标（每帧从真实 DOM 量）
  const cache = {};
  const A = (key, fx = .5, fy = 0) => { const el = cache[key] !== undefined ? cache[key] : (cache[key] = wEl.querySelector(`[data-a="${key}"]`));
    if (!el) return null; const r = el.getBoundingClientRect(); return { x: (r.left + r.width * fx - 960) / z + cx, y: (r.top + r.height * fy - 540) / z + cy, w: r.width / z, h: r.height / z }; };
  // 动态模糊：只在甩镜时按镜头速度加各向异性高斯，慢推保持清晰
  const [px, py] = FM.camAt(t - 1 / 30), vx = (cx - px) * z, vy = (cy - py) * z;
  const bx = Math.min(40, Math.max(0, Math.abs(vx) - 26) * .32), by = Math.min(40, Math.max(0, Math.abs(vy) - 26) * .32);
  mbg.setAttribute('stdDeviation', `${bx.toFixed(2)} ${by.toFixed(2)}`); mbw.style.filter = bx > .6 || by > .6 ? 'url(#mb)' : '';
  window.DBG = { bx, by, cam: F.cam };
  spr.innerHTML = F.fx.map(f => f(A)).join('') + sprites(F, t, A, z);
  hud(F, t, A, z, cx, cy);
}

function sprites(F, t, A, z) {
  const T = FM.T, act = F.actor; let h = '';
  const c = act.eval(t, A);
  if (c) {
    h += XH.sprite(c);
    for (const j of act.jumps) if (t >= j.t1 && t < j.t1 + .4) { const L = act.eval(j.t1 + .001, A); if (L) h += XH.dust(L.x, L.y, seg(t, j.t1, j.t1 + .4), Math.max(3, L.px * .75), 6, j.t1 * 10); }
    const top = c.y - c.px * 13, P = c.px * .9;
    if (t > T.morph1 && t < T.morph1 + .5) h += XH.BANG(c.x + 8 * c.px, top - 12 * c.px, P, 1 - seg(t, T.morph1 + .35, T.morph1 + .5));
    if (t > T.land1 && t < T.land1 + .5) { const k = seg(t, T.land1, T.land1 + .5); h += XH.SPARK(c.x - 70 - k * 30, top + 10 - k * 20, 5, XH.GOLD, 1 - k) + XH.SPARK(c.x + 70 + k * 30, top - k * 20, 4, XH.GOLD, 1 - k); }
    for (const L of T.land) if (t > L && t < L + .35) { const k = seg(t, L, L + .35); h += XH.SPARK(c.x + 44 + k * 14, top - 6 - k * 16, 3.5, XH.GOLD, 1 - k); }
    for (const [id, f] of Object.entries(T.flip)) if (id !== 'web' && t > f && t < f + .45) { const k = seg(t, f, f + .45); h += XH.CHECK(c.x + 38, top - 18 - k * 18, 4, 1 - k * k); }
    if (t > T.hl && t < T.hl + .7) { const k = seg(t, T.hl, T.hl + .7); for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + .4; h += XH.SPARK(c.x + Math.cos(a) * (36 + k * 50), c.y - 34 + Math.sin(a) * (26 + k * 34), 4, i % 2 ? XH.GOLD : XH.BLUE, 1 - k); } }
    if (t > T.cite && t < T.cite + .45) h += XH.SPARK(c.x + 40, top - 10 - seg(t, T.cite, T.cite + .45) * 20, 4, XH.BLUE, 1 - seg(t, T.cite, T.cite + .45));
    if (t > T.tools[1][1] && t < T.tools[1][1] + .5) h += XH.CHECK(c.x + 34, top - 22, 4, 1 - seg(t, T.tools[1][1] + .3, T.tools[1][1] + .5));
    for (const [i, x] of T.w.entries()) if (t > x && t < x + .45 && i < 3) h += XH.NOTE(c.x + 36, top - 16 - seg(t, x, x + .45) * 30, 5, 1 - seg(t, x + .2, x + .45));
    if (t > T.final && t < T.final + .9) { const k = seg(t, T.final, T.final + .9); for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; h += XH.SPARK(c.x + Math.cos(a) * (50 + k * 160), c.y - 40 + Math.sin(a) * (34 + k * 100), 6, i % 2 ? XH.GOLD : XH.BLUE, 1 - k); } }
    if (t > T.pet && t < T.pet + .9) { const k = seg(t, T.pet, T.pet + .9); h += XH.HEART(c.x + 46 + k * 14, top - 14 - k * 50, 5, 1 - k * k); }
  }
  // 光标（带运动残影，屏幕尺寸恒定）
  const cu = F.cursor.eval(t, A);
  if (cu) {
    if (cu.sp > 900) for (let i = 1; i <= 4; i++) { const g = F.cursor.eval(t - i * .012, A); if (g) h += cursorSvg(g.x, g.y, 1, cu.op * .16 * (5 - i) / 4, z); }
    if (cu.ring > 0) h += `<div class="ring" style="left:${cu.x - 26 * cu.ring - 4}px;top:${cu.y - 26 * cu.ring - 4}px;width:${52 * cu.ring + 8}px;height:${52 * cu.ring + 8}px;opacity:${(1 - cu.ring) * .7};border-width:${3 / z}px"></div>`;
    h += cursorSvg(cu.x, cu.y, cu.sc, cu.op, z);
  }
  return h;
}
const cursorSvg = (x, y, sc, op, z) => { const s = 1.6 * sc / z;
  return `<svg style="position:absolute;left:${x - 2 * s}px;top:${y - 2 * s}px;opacity:${op};filter:drop-shadow(0 ${2 / z}px ${3 / z}px rgba(0,0,0,.3))" width="${22 * s}" height="${30 * s}" viewBox="0 0 22 30"><path d="M2 2 L2 24 L7.5 18.5 L11 27 L15 25.2 L11.6 17 L19 17 Z" fill="#000" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>`; };

function hud(F, t) {
  const H = F.hud; let h = '';
  if (H.chap) h += `<div class="chap" style="opacity:${H.chap.op};transform:scale(${H.chap.sc});transform-origin:0 50%"><b>${H.chap.no}</b>${H.chap.nm}<span>${H.chap.sub}</span></div>`;
  if (H.keys) h += `<div class="keys" style="opacity:${H.keys.op}">${H.keys.keys.map(k => `<i class="${H.keys.dn ? 'dn' : ''}">${k}</i>`).join('')}<span>${H.keys.label}</span></div>`;
  if (H.cap && !NOSUBS) h += `<div class="cap" style="opacity:${H.cap.op};transform:translate(-50%,${H.cap.y}px)">${H.cap.text.replace(/\{([^}]*)\}/g, '<em>$1</em>')}</div>`;
  if (H.flash) h += `<div class="flash" style="opacity:${H.flash}"></div>`;
  if (H.fade) h += `<div class="fade" style="opacity:${H.fade}"></div>`;
  hudEl.innerHTML = h;
}
window.render = render;
await document.fonts.load('16px SC'); await document.fonts.load('800 40px SC'); await document.fonts.load('600 40px SC');
render(+(Q.get('t') || 0));
window.READY = true;
