// 小黑 OmniBox 网页版界面：按 assets/screenshot 用 DOM 重绘（不贴图）。状态 → HTML。
import * as XH from './xiaohei.js';

export const WIN = { x: 150, y: 60, w: 1620, h: 980 };      // 世界坐标里的窗口
export const SIDE = 270, BAR = 40, MW = WIN.w - SIDE;       // 侧栏宽、标题栏高、主区宽
export const IN = { x: (MW - 740) / 2, w: 740, h: 116, y0: 470, y1: 800 };   // 输入框（主区局部坐标）

const I = {   // 线性图标（16px）
  bell: '<path d="M6 13a2 2 0 0 0 4 0M3.5 11.5h9l-1.2-1.6V7a3.3 3.3 0 0 0-6.6 0v2.9z"/>',
  users: '<circle cx="6" cy="5.5" r="2.3"/><path d="M1.8 13c.4-2.3 2.2-3.6 4.2-3.6s3.8 1.3 4.2 3.6M10.5 3.4a2.2 2.2 0 0 1 0 4.3M12.2 9.8c1.1.5 1.8 1.6 2 3.2"/>',
  gift: '<rect x="2.5" y="6" width="11" height="3" rx=".6"/><path d="M3.5 9v4.5h9V9M8 6v7.5M8 6C6.5 3 4 3.5 4.6 5.2 5 6 8 6 8 6zM8 6c1.5-3 4-2.5 3.4-.8C11 6 8 6 8 6z"/>',
  search: '<circle cx="7" cy="7" r="4.3"/><path d="M10.2 10.2 13.5 13.5"/>',
  grid: '<circle cx="8" cy="8" r="5.5" stroke-dasharray="1.6 1.6"/>',
  refresh: '<path d="M13 8a5 5 0 1 1-1.5-3.6M13 2.5v3h-3"/>',
  list: '<path d="M2.5 4h8M2.5 8h8M2.5 12h5M12 10.5l1.3 1.3L15 9.5"/>',
  trash: '<path d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.7 9h5.6l.7-9"/>',
  hist: '<path d="M2.8 8a5.2 5.2 0 1 0 1.5-3.7M2.5 2.5v2.6h2.6M8 5v3.2l2 1.3"/>',
  plus: '<path d="M8 3v10M3 8h10"/>',
  hand: '<path d="M5.5 8.5V3.8a1 1 0 0 1 2 0v3.7M7.5 7V3a1 1 0 0 1 2 0v4M9.5 7V3.8a1 1 0 0 1 2 0V9c0 2.8-1.6 4.5-4 4.5-1.7 0-2.7-.9-3.6-2.3L2.6 9a1 1 0 0 1 1.7-1l1.2 1.4"/>',
  down: '<path d="M4.5 6.5 8 10l3.5-3.5"/>',
  up: '<path d="M8 12.5V3.5M4.5 7 8 3.5 11.5 7"/>',
  help: '<circle cx="8" cy="8" r="5.8"/><path d="M6.4 6.3a1.7 1.7 0 1 1 2.3 1.6c-.5.2-.7.6-.7 1.1v.3M8 11.3v.2"/>',
  doc: '<path d="M4 2.5h5.5L12.5 5.5v8H4z"/><path d="M9.5 2.5v3h3"/>',
  wx: '<path d="M6.2 3C3.6 3 1.8 4.7 1.8 6.6c0 1.1.6 2.1 1.6 2.8l-.4 1.5 1.7-.9c.5.1 1 .2 1.5.2M14.2 9.4c0-1.8-1.8-3.2-3.9-3.2S6.4 7.6 6.4 9.4s1.8 3.2 3.9 3.2c.4 0 .9-.1 1.3-.2l1.4.8-.3-1.3c.9-.6 1.5-1.5 1.5-2.5z"/>',
  plug: '<path d="M6 2.5v3M10 2.5v3M4.5 5.5h7v2.5a3.5 3.5 0 0 1-7 0zM8 11.5v2.5"/>',
  folder: '<path d="M2 4.5h4.2l1.3 1.5H14v7H2z"/>',
  play: '<path d="M5.5 3.5v9l7-4.5z" fill="currentColor"/>',
  quote: '<path d="M3 4h10v7H7l-3 2.5V11H3z"/>',
};
export const ico = (k, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round">${I[k]}</svg>`;
const FT = {   // 资源类型徽标
  img: ['#E8F6EE', '#1F9D57', '<rect x="3" y="3.5" width="10" height="9" rx="1.5"/><circle cx="6.2" cy="6.6" r="1.1"/><path d="M3.5 11.5 7 8.5l2 1.7 1.6-1.3 2 1.8"/>'],
  web: ['#EAF2FE', '#2E7CF6', '<circle cx="8" cy="8" r="5.2"/><path d="M2.8 8h10.4M8 2.8c1.6 1.6 1.6 8.8 0 10.4M8 2.8c-1.6 1.6-1.6 8.8 0 10.4"/>'],
  aud: ['#FFF3E6', '#E8772E', '<path d="M3.5 6.5v3M6 4.5v7M8.5 6v4M11 3.5v9M13 6.5v3"/>'],
  pdf: ['#FDECEC', '#E0413A', '<path d="M4 2.5h5.5L12.5 5.5v8H4z"/><path d="M6 9.5h4M6 11.5h2.5"/>'],
  chat: ['#F1F1F3', '#55555C', '<path d="M3 4h10v6.5H7.5L4.5 13v-2.5H3z"/>'],
};
export const ft = k => { const [bg, c, p] = FT[k]; return `<span class="ft" style="background:${bg};color:${c}"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${p}</svg></span>`; };

// ───────── 桌面（壁纸 + 顶栏）
export const desk = () => `<div id="wall"></div><div id="menubar"><b>小黑 OmniBox</b><span>文件</span><span>编辑</span><span>视图</span><span class="r"><span>周一 10:08</span></span></div>`;

// ───────── 应用窗口
export function appWin(A) {
  const S = A.side, M = A.main;
  const rows = S.rows.map(r => `<div class="rrow ${r.hl ? 'hl' : ''}" data-a="r-${r.id}" style="height:${r.h ?? 38}px;opacity:${r.op ?? 1};transform:${r.tf || 'none'}">${ft(r.icon)}<span class="nm">${r.name}</span>${
    r.st === 'parse' ? `<span class="st parse"><i class="spin" style="transform:rotate(${r.spin || 0}deg)"></i>解析中</span>` : r.st === 'done' ? `<span class="st done" style="transform:scale(${r.pop ?? 1})">${r.tag}</span>` : ''}</div>`).join('');
  const side = `<div class="side">
    <div class="ns"><span class="av">小</span>我的 Namespace ${ico('down', 'sm')}<span class="colb"></span></div>
    <div class="nav on">${`<span class="xh">${XH.vector({ x: 9, y: 16, w: 18 })}</span>`}小黑</div>
    <div class="nav">${ico('bell')}通知<span class="badge" style="transform:scale(${S.badgePop ?? 1})">${S.badge}</span></div>
    <div class="nav">${ico('users')}黑友社区</div>
    <div class="nav blue">${ico('gift')}邀请有礼</div>
    <div class="segs"><span class="${S.tab === '资源' ? 'on' : ''}">资源</span><span class="${S.tab === '对话' ? 'on' : ''}">对话</span></div>
    <div class="tools">${ico('search')}${ico('grid')}${ico('refresh')}${ico('list')}</div>
    <div class="sec">我的资源 ${ico('down', 'sm')}</div>
    <div class="rows" data-a="rows">${rows}</div>
    <div class="sec">系统 ${ico('down', 'sm')}</div>
    <div class="rrow sys">${ico('trash')}<span class="nm">回收站</span></div>
    <div class="foot">${ico('help')}${ico('wx')}${ico('users')}<span class="upd">${ico('up')}</span></div>
  </div>`;
  let main = `<div class="histb">${ico('hist')}</div>`;
  if (M.home) main += home(M.home);
  if (M.doc) main += doc(M.doc);
  if (M.chat) main += chat(M.chat);
  if (M.input) main += input(M.input);
  const w = A.winSt || {};
  return `<div class="win" style="left:${WIN.x}px;top:${WIN.y}px;width:${WIN.w}px;height:${WIN.h}px;opacity:${w.op ?? 1};transform:${w.tf || 'none'}">
    <div class="tbar"><div class="lights"><i></i><i></i><i></i></div><div class="ttl">小黑 OmniBox</div></div>
    <div class="body">${side}<div class="main">${main}</div></div></div>`;
}

function home(H) {
  let h = '';
  // 原界面的小气泡：片名出现前是真实的提示气泡
  if (H.bubble > 0) h += `<div class="bubble" style="left:${IN.x + 190}px;top:${IN.y0 - 118}px;opacity:${H.bubble};transform:scale(${.9 + .1 * H.bubble})">为 "Docker技术入门与实战（第4版）.pdf" 添加 "科技" 标签。</div>`;
  if (H.title) { const T = H.title;
    h += `<div class="ktitle" style="top:${IN.y0 - 196}px;opacity:${T.op ?? 1}"><div class="big" data-a="title">${[...'小黑'].map((c, i) => `<span style="transform:translateY(${(1 - T.p[i]) * -70}px);opacity:${Math.min(1, T.p[i] * 3)}">${c}</span>`).join('')}<span class="om" style="opacity:${T.om};transform:translateX(${(1 - T.om) * 24}px)">OmniBox</span></div>
      <div class="sub" style="opacity:${T.sub};transform:translateY(${(1 - T.sub) * 10}px)">你的 <b>AI</b> 知识伙伴</div></div>`; }
  // 探头的矢量小黑（被输入框挡住下半身）；离开后只剩虚线轮廓
  if (H.peek) h += `<div class="peek" style="left:${IN.x + 100}px;top:${IN.y0 + 24}px">${H.peek.op > 0 ? XH.vector({ x: 0, y: 0, w: 92, op: H.peek.op, eyes: H.peek.eyes }) : ''}${H.peek.outline > 0 ? `<svg style="position:absolute;left:-46px;top:${-92 * .84}px;opacity:${H.peek.outline}" width="92" height="${92 * .84}" viewBox="0 0 100 84"><path d="${XH.VECTOR_PATH}" fill="none" stroke="#B9BCC4" stroke-width="2.6" stroke-dasharray="6 6"/></svg>` : ''}</div>`;
  if (H.cards > 0) h += `<div class="cards" style="opacity:${H.cards};transform:translateY(${(1 - H.cards) * 30}px)">
    <div class="card"><h4>上传文档</h4><h5>让知识为你所用</h5><p>支持文档、网页、音频和视频等多种类型</p>
      <div class="btns"><span>${ico('doc', 'red')}本地上传</span><span>${ico('wx', 'green')}微信助手</span><span>${ico('plug', 'blue')}安装插件</span></div></div>
    <div class="card"><h4>最近更新</h4>
      <div class="rec">${ft('pdf')}<div><b>Superex2024年10月月报.pdf</b><small>5 个月前更新</small></div><span class="chev">›</span></div>
      <div class="rec">${ft('pdf')}<div><b>Docker技术入门与实战（第4版）.pdf</b><small>5 个月前更新</small></div><span class="chev">›</span></div></div></div>`;
  return h;
}

function input(P) {
  const y = P.y ?? IN.y0;
  const text = P.text ? `${P.text}${P.caret ? '<i class="caret"></i>' : ''}` : `${P.caret ? '<i class="caret"></i>' : ''}<span class="ph">随便问点什么吧</span>`;
  return `<div class="pb ${P.focus ? 'focus' : ''}" data-a="pb" style="left:${IN.x}px;top:${y}px;width:${IN.w}px">
    <div class="txt" data-a="ptxt">${text}</div>
    <div class="row"><span class="plus">${ico('plus')}</span><span class="mode">${ico('hand')}手动确认 ${ico('down', 'sm')}</span>
      <span class="agent">Agent 2.1 轻</span><span class="send ${P.text ? 'on' : ''} ${P.press ? 'dn' : ''}" data-a="send">${ico('up')}</span></div></div>`;
}

function doc(D) {
  const sum = ['首页改版进入评审阶段', '确定 3 项<mark>待办</mark>，负责人已分配', '下周二评审新版首页'];
  const tr = [['00:12', '先对一下本周进度，首页改版已经进入评审。'], ['03:12', '<mark>待办</mark>一：周五前提交 Q4 方案。'], ['05:40', '<mark>待办</mark>二：整理用户访谈纪要。'], ['09:05', '<mark>待办</mark>三：下周二评审新版首页。']];
  const hl = D.hl || 0, mk = s => s.replace(/<mark>/g, `<mark style="background:rgba(255,214,77,${.85 * hl});box-shadow:0 0 0 ${2 * hl}px rgba(255,214,77,${.85 * hl})">`);
  return `<div class="doc" style="opacity:${D.op};transform:translateX(${(1 - D.op) * 40}px)">
    <div class="crumb">资源 <span>/</span> 我的资源 <span>/</span> <b>周会录音.m4a</b></div>
    <h1>${ft('aud')}周会录音.m4a</h1>
    <div class="meta"><span class="src">随手记</span><span>12:48</span><span class="st done">已转写</span><span class="st done">可搜索</span></div>
    <div class="player">${ico('play')}<div class="wave">${Array.from({ length: 64 }, (_, i) => `<i style="height:${6 + Math.abs(Math.sin(i * 1.7) * 18 + Math.sin(i * .43) * 9)}px;background:${i < 64 * (D.play || 0) ? '#E8772E' : '#D9DBE1'}"></i>`).join('')}</div><span class="tm">12:48</span></div>
    <div class="sum" data-a="sum" style="opacity:${Math.min(1, D.sum[0] * 3)}"><div class="sh">${ico('quote')}AI 摘要</div>
      ${sum.map((s, i) => `<div class="li" style="opacity:${D.sum[i]};transform:translateX(${(1 - D.sum[i]) * -16}px)"><i></i>${mk(s)}</div>`).join('')}</div>
    <div class="trh">转写</div>
    ${tr.map(([ts, s], i) => `<div class="tl" data-a="tl-${i}" style="opacity:${D.lines[i]}"><span class="ts">${ts}</span>${mk(s)}</div>`).join('')}
  </div>`;
}

function chat(C) {
  const m = C.msgs.map(x => {
    if (x.k === 'u') return `<div class="u" data-a="umsg" style="opacity:${x.op ?? 1};transform:${x.tf || 'none'}">${x.text}</div>`;
    if (x.k === 'a') return `<div class="a" data-a="${x.id || ''}" style="opacity:${x.op ?? 1};transform:${x.tf || 'none'}">${x.html}</div>`;
    if (x.k === 'cite') return `<div class="cite" data-a="cite" style="opacity:${x.op};transform:scale(${x.sc ?? 1})">${ft('aud')}<b>周会录音.m4a</b><span>03:12 · 05:40 · 09:05</span></div>`;
    if (x.k === 'tool') return `<div class="tool" data-a="${x.id}" style="opacity:${x.op}">${x.done ? '<i class="ok">✓</i>' : `<i class="spin" style="transform:rotate(${x.spin || 0}deg)"></i>`}${ico('folder')}<span>${x.text}</span></div>`;
    return '';
  }).join('');
  return `<div class="chat" style="left:${IN.x}px;width:${IN.w}px;opacity:${C.op ?? 1}">${m}</div>`;
}
