import React, { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { continueRender, delayRender, staticFile } from 'remotion';
import { SVG } from './svg';

// 真实网页 UI 的渲染宿主（high_fidelity_v3）
// 样式表是 omnibox-art 从 test.omnibox.pro 导出的整份产品 CSS（public/omni/product.css，浅色主题），原样入库；
// 这里在浏览器里做最小改写后装进 Shadow DOM，Tailwind 的 preflight 不会漏到片子其他部分：
//   :root/html/body → :host/.omni-html/.omni-body；svh/vh/vw → 按产品视口折成 px；
//   宽度类 @media 按产品视口 1440 求值（片子画布是 1920，不能让 2xl 断点生效），hover/pointer 按桌面求值
// 产品视口 1440×810（16:9），zoom 4/3 正好铺满 1920×1080

export const VW = 1440;
export const VH = 810;
/** 产品像素 → 画布像素 */
export const Z = 1920 / VW;

const ENV = { width: VW, height: VH };

const feature = (f: string): boolean | null => {
  const m = f.trim().match(/^\(\s*([a-z-]+)\s*(?::\s*([^)]+?))?\s*\)$/);
  if (!m) return null;
  const [, k, v = ''] = m;
  const px = (s: string) => (/(r?em)$/.test(s) ? parseFloat(s) * 16 : parseFloat(s));
  switch (k) {
    case 'min-width': return ENV.width >= px(v);
    case 'max-width': return ENV.width <= px(v);
    case 'min-height': return ENV.height >= px(v);
    case 'max-height': return ENV.height <= px(v);
    case 'hover': case 'any-hover': return v === 'hover';
    case 'pointer': case 'any-pointer': return v === 'fine';
    case 'prefers-reduced-motion': return v === 'no-preference';
    case 'prefers-color-scheme': return v === 'light';
    case 'orientation': return v === 'landscape';
    default: return null;
  }
};

/** 单条媒体查询在产品视口下的真假；看不懂的返回 null（保持原样） */
const query = (q: string): boolean | null => {
  let neg = false;
  let s = q.trim();
  if (/^not\s/.test(s)) { neg = true; s = s.slice(4); }
  s = s.replace(/^only\s+/, '').replace(/^(screen|all)\s*(and\s+)?/, '').trim();
  if (!s) return !neg;
  let r = true;
  for (const part of s.split(/\s+and\s+/)) {
    const v = feature(part);
    if (v === null) return null;
    r = r && v;
  }
  return neg ? !r : r;
};

const media = (cond: string) => {
  const parts = cond.split(',').map(query);
  if (parts.some((p) => p === null)) return `@media ${cond}`;
  return parts.some(Boolean) ? '@media all' : '@media not all';
};

const unit = (decl: string) =>
  decl
    .replace(/(-?\d*\.?\d+)(svh|dvh|lvh|vh)\b/g, (_, n) => `${(parseFloat(n) * VH) / 100}px`)
    .replace(/(-?\d*\.?\d+)(svw|dvw|lvw|vw)\b/g, (_, n) => `${(parseFloat(n) * VW) / 100}px`);

const selector = (sel: string) =>
  sel
    .replace(/:root\b/g, ':host')
    .replace(/(^|[\s,>+~(])html(?![\w-])/g, '$1.omni-html')
    .replace(/(^|[\s,>+~(])body(?![\w-])/g, '$1.omni-body');

export const adaptCss = (css: string) =>
  css
    .split('\n')
    .map((line) => {
      const t = line.trimStart();
      const i = line.indexOf('{');
      if (t.startsWith('@media')) return line.replace(/@media\s+([^{]+?)\s*\{/, (_, c) => `${media(c)} {`);
      if (t.startsWith('@') || i < 0) return unit(line);
      return selector(line.slice(0, i)) + unit(line.slice(i));
    })
    .join('\n');

// 整片共用一张构造样式表；加载完之前不出帧
let sheet: CSSStyleSheet | null = null;
if (typeof document !== 'undefined' && !(window as any).__omniCss) {
  (window as any).__omniCss = true;
  const h = delayRender('omni css');
  sheet = new CSSStyleSheet();
  (window as any).__omniSheet = sheet;
  // product-20261015-resource.css：2026-10-15 实拍资源页（引用跳转）时，整份样式表里比 product.css 多出的规则（ProseMirror 基础样式等）
  Promise.all(['omni/product.css', 'omni/product-20261015-resource.css', 'omni/demo.css'].map((f) => fetch(staticFile(f)).then((r) => r.text())))
    .then(([p, r, d]) => { sheet!.replaceSync(adaptCss(p + '\n' + r) + '\n' + d); continueRender(h); })
    .catch((e) => { console.error(e); continueRender(h); });
} else if (typeof window !== 'undefined') sheet = (window as any).__omniSheet;

/**
 * 产品 DOM 的容器：画布坐标 (0,0) 起 1920×1080，里面是 1440×810 的产品视口。
 * children 用产品像素和真实 class 写；放在 Camera 里随镜头一起动。
 */
export const Omni: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; bg?: string }> = ({ children, style, bg }) => {
  const host = useRef<HTMLDivElement>(null);
  const [root, setRoot] = useState<HTMLElement | null>(null);
  useLayoutEffect(() => {
    const el = host.current!;
    const sr = el.shadowRoot ?? el.attachShadow({ mode: 'open' });
    if (sheet) sr.adoptedStyleSheets = [sheet];
    let c = sr.querySelector<HTMLElement>('.omni-html');
    if (!c) {
      c = document.createElement('div');
      c.className = 'omni-html light';
      Object.assign(c.style, {
        position: 'absolute', left: '0', top: '0', width: `${VW}px`, height: `${VH}px`, zoom: String(Z),
        contain: 'layout paint', overflow: 'hidden', colorScheme: 'light',
      });
      c.style.setProperty('--app-height', `${VH}px`);
      sr.appendChild(c);
    }
    setRoot(c);
  }, []);
  return (
    <div ref={host} style={{ position: 'absolute', left: 0, top: 0, width: VW * Z, height: VH * Z, ...style }}>
      {root && createPortal(<div className="omni-body" style={bg ? { background: bg } : undefined}><div id="root">{children}</div></div>, root)}
    </div>
  );
};

/** 产品图标（svg.ts 里是真实 DOM 取出的 SVG）；className 叠加在原 class 上 */
export const Ic: React.FC<{ n: string; className?: string; style?: React.CSSProperties }> = ({ n, className, style }) => {
  const d = SVG[n];
  if (!d) throw new Error(`missing icon ${n}`);
  const cls = [d.c, className].filter(Boolean).join(' ');
  return <svg {...(d.p as any)} className={cls || undefined} style={style} aria-hidden="true" dangerouslySetInnerHTML={{ __html: d.h }} />;
};
