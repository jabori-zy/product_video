import React, { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { IFrame, cancelRender, continueRender, delayRender, staticFile } from 'remotion';

// 第三方网页的真实快照（high_fidelity_v4）：public/sites/<站>/index.html 是用 ego-browser 从登录态真实页面导出的
// 静态 DOM + 全部样式（tools/sites/）。内容位（data-slot）在导出时已清空，这里用 React portal 把片子自己的内容
// （data/locales 里的标题、作者、封面……）填进去，样式完全用网站自己的 CSS。
// iframe 的 CSS 视口 = 导出时的视口（w/zoom × h/zoom），媒体查询、字体、布局都和真实页面一致。

/** 内容位尺寸（导出时记录的 data-w / data-h，CSS 像素） */
export type SlotSize = { w: number; h: number };
export type Slots = Record<string, React.ReactNode | ((size: SlotSize) => React.ReactNode)>;

export const SitePage: React.FC<{
  site: string; w: number; h: number; zoom: number; slots: Slots;
  /** 页面下滚（CSS 像素） */ scroll?: number;
  /** 选择器 → 属性（输入框的值、占位符等） */ attrs?: Record<string, Record<string, string>>;
  radius?: number; bg?: string;
}> = ({ site, w, h, zoom, slots, scroll = 0, attrs, radius = 0, bg }) => {
  const ref = useRef<HTMLIFrameElement>(null);
  const [els, setEls] = useState<Record<string, HTMLElement> | null>(null);
  const [handle] = useState(() => delayRender(`site ${site}`));
  // 内容位填好、字体就绪之后才放行这一帧
  useLayoutEffect(() => {
    if (!els) return;
    const doc = ref.current!.contentDocument!;
    doc.fonts.load('16px SC').then(() => doc.fonts.ready).then(() => continueRender(handle), () => continueRender(handle));
  }, [els, handle]);
  useLayoutEffect(() => {
    const win = ref.current?.contentWindow;
    if (!els || !win) return;
    win.scrollTo(0, scroll);
    const doc = win.document;
    for (const [sel, a] of Object.entries(attrs ?? {})) doc.querySelectorAll(sel).forEach((n) => Object.entries(a).forEach(([k, v]) => n.setAttribute(k, v)));
  });
  return (
    <div style={{ width: w, height: h, overflow: 'hidden', position: 'relative', borderRadius: radius, background: bg }}>
      <IFrame
        ref={ref}
        src={staticFile(`sites/${site}/index.html`)}
        tabIndex={-1}
        style={{ position: 'absolute', left: 0, top: 0, width: w / zoom, height: h / zoom, border: 0, zoom } as React.CSSProperties}
        onLoad={() => {
          const doc = ref.current?.contentDocument;
          if (!doc) { cancelRender(new Error(`site ${site}: no document`)); return; }
          const m: Record<string, HTMLElement> = {};
          doc.querySelectorAll<HTMLElement>('[data-slot]').forEach((e) => { m[e.dataset.slot!] = e; e.replaceChildren(); });
          setEls(m);
        }}
        onError={() => cancelRender(new Error(`site ${site}: failed to load`))}
      />
      {els && Object.entries(slots).map(([k, v]) => {
        const el = els[k];
        if (!el) return null;
        const node = typeof v === 'function' ? v({ w: Number(el.dataset.w || 0), h: Number(el.dataset.h || 0) }) : v;
        return <React.Fragment key={k}>{createPortal(node, el)}</React.Fragment>;
      })}
    </div>
  );
};

/** 把按固定尺寸 nw×nh 画的内容缩放铺满 w×h（cover 方式，居中裁切） */
export const Fit: React.FC<{ w: number; h: number; nw: number; nh: number; children: React.ReactNode; radius?: number }> = ({ w, h, nw, nh, children, radius }) => {
  const k = Math.max(w / nw, h / nh);
  return (
    <div style={{ position: 'relative', width: w, height: h, overflow: 'hidden', borderRadius: radius }}>
      <div style={{ position: 'absolute', left: (w - nw * k) / 2, top: (h - nh * k) / 2, width: nw, height: nh, transform: `scale(${k})`, transformOrigin: '0 0' }}>{children}</div>
    </div>
  );
};
