import React from 'react';
import { AbsoluteFill, Easing, Img, interpolate, interpolateColors, spring, staticFile } from 'remotion';
import { FONT } from './fonts';

// 草稿：30 fps 省资源；所有时间都用秒写，与 script.md 一一对应
export const FPS = 30;
export const W = 1920;
export const H = 1080;
export const DURATION = 45;

export const C = {
  black: '#0B0B0C',
  main: '#262626',
  side: '#171717',
  comp: '#303030',
  line: '#3A3A3A',
  text: '#EDEDED',
  muted: '#A1A1A1',
  cream: '#FEF6EC',
  blue: '#4A8EF9',
  blue2: '#B2D0FF',
  canvas: '#EDEDEA',
  desk: '#E9E6E1',
  ink: '#171717',
  ph: '#D9D9DE', // 占位矩形
};

// ---------- 时间与插值 ----------
export const easeOut = Easing.bezier(0.22, 1, 0.36, 1);
export const inOut = Easing.inOut(Easing.cubic);
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export const lin = (t: number, a: number, b: number, x: number, y: number, e: (n: number) => number = easeOut) =>
  interpolate(t, [a, b], [x, y], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e });

export const sp = (t: number, start: number, config: any = { damping: 14, mass: 0.8 }) =>
  t < start ? 0 : spring({ frame: (t - start) * FPS, fps: FPS, config });

/** 淡入淡出窗口：a 起 fi 秒淡入，b 起 fo 秒淡出 */
export const win = (t: number, a: number, b: number, fi = 0.2, fo = 0.2) =>
  Math.min(lin(t, a, a + fi, 0, 1), 1 - lin(t, b, b + fo, 0, 1));

/** 关键帧：[{t, ...数值}]，段间 inOut；非数值字段取较近的一端 */
export function kf(t: number, frames: any[], e: (n: number) => number = inOut): any {
  if (t <= frames[0].t) return frames[0];
  for (let i = 0; i < frames.length - 1; i++) {
    const a = frames[i];
    const b = frames[i + 1];
    if (t <= b.t) {
      const p = (b.e || e)(clamp01((t - a.t) / (b.t - a.t)));
      const o: any = { t };
      for (const k of Object.keys({ ...a, ...b })) {
        if (k === 't' || k === 'e') continue;
        const va = a[k] ?? b[k];
        const vb = b[k] ?? a[k];
        o[k] = typeof vb === 'number' ? va + (vb - va) * p : p < 0.5 ? va : vb;
      }
      return o;
    }
  }
  return frames[frames.length - 1];
}

/** 共享元素变形：每个状态在 t 时刻成为新目标，用 spring 追过去（参考 3） */
export function morph(t: number, states: any[], config: any = { damping: 14, mass: 0.8 }): any {
  let cur: any = { ...states[0], _i: 0, _p: 1 };
  for (let i = 1; i < states.length; i++) {
    const s = states[i];
    if (t < s.t) break;
    const p = sp(t, s.t, config);
    const o: any = {};
    for (const k of Object.keys(s)) {
      if (k === 't') continue;
      const a = cur[k] ?? s[k];
      if (typeof s[k] === 'number') o[k] = a + (s[k] - a) * p;
      else if (k === 'bg' || k === 'fg') o[k] = interpolateColors(clamp01(p), [0, 1], [a, s[k]]);
      else o[k] = s[k];
    }
    cur = { ...cur, ...o, _i: i, _p: p };
  }
  return cur;
}

/** 眨眼：在 times 中每个时刻闭眼 0.14 s，返回 0（睁）→1（闭） */
export const blinkAt = (t: number, times: number[]) => {
  let v = 0;
  for (const c of times) if (t >= c && t <= c + 0.14) v = Math.max(v, 1 - Math.abs((t - c) / 0.07 - 1));
  return v;
};

/** 打字：从 start 起每 step 秒一个字 */
export const typed = (t: number, start: number, text: string, step = 0.06) => {
  const chars = Array.from(text);
  const n = Math.max(0, Math.min(chars.length, Math.floor((t - start) / step) + 1));
  return t < start ? '' : chars.slice(0, n).join('');
};

/** 弹跳：只有脑袋的小黑，预备压扁 → 抛物线拉长 → 落地压扁回弹。锚点在底边中心 */
export function hop(t: number, t0: number, t1: number, from: { x: number; y: number }, to: { x: number; y: number }, h: number, pre = 0.1) {
  if (t < t0 - pre) return { x: from.x, y: from.y, sx: 1, sy: 1 };
  if (t < t0) {
    const k = (t - (t0 - pre)) / pre;
    return { x: from.x, y: from.y, sx: 1 + 0.15 * k, sy: 1 - 0.2 * k };
  }
  if (t < t1) {
    const p = (t - t0) / (t1 - t0);
    const st = 1 + 0.15 * Math.sin(Math.PI * Math.min(1, p * 1.4));
    return { x: from.x + (to.x - from.x) * p, y: from.y + (to.y - from.y) * p - h * 4 * p * (1 - p), sx: 1 / Math.sqrt(st), sy: st };
  }
  const d = t - t1;
  const amt = 0.22 * Math.exp(-d * 9) * Math.cos(d * 28);
  return { x: to.x, y: to.y, sx: 1 + amt * 0.7, sy: 1 - amt };
}

// ---------- 组件 ----------
export const Fill: React.FC<{ bg?: string; style?: React.CSSProperties; children?: React.ReactNode }> = ({ bg, style, children }) => (
  <AbsoluteFill style={{ background: bg, fontFamily: FONT, ...style }}>{children}</AbsoluteFill>
);

/** 虚拟摄像机：焦点 (x,y) 移到画面中心，缩放 s，带 3D 倾斜 */
export const Camera: React.FC<{ c: any; children: React.ReactNode }> = ({ c, children }) => (
  <AbsoluteFill style={{ perspective: 2400, overflow: 'hidden' }}>
    <div
      style={{
        position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: '0 0',
        transform: `translate(${W / 2}px,${H / 2}px) scale(${c.s ?? 1}) rotateX(${c.rx || 0}deg) rotateY(${c.ry || 0}deg) translate(${-(c.x ?? W / 2)}px,${-(c.y ?? H / 2)}px)`,
      }}
    >
      {children}
    </div>
  </AbsoluteFill>
);

/** 摄像机运动模糊强度（只在快速移动时出现） */
export const camBlur = (t: number, frames: any[]) => {
  const a = kf(t, frames);
  const b = kf(t + 1 / FPS, frames);
  const s = a.s ?? 1;
  const vx = Math.abs((b.x ?? 0) - (a.x ?? 0)) * s * FPS;
  const vy = Math.abs((b.y ?? 0) - (a.y ?? 0)) * s * FPS;
  const k = (v: number) => (v < 1500 ? 0 : Math.min(30, (v - 1500) / 250));
  return [k(vx), k(vy)];
};

/** 方向性模糊（甩镜） */
export const MBlur: React.FC<{ id: string; bx?: number; by?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ id, bx = 0, by = 0, style, children }) => {
  const on = bx > 0.3 || by > 0.3;
  return (
    <AbsoluteFill style={style}>
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id={id} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
            <feGaussianBlur stdDeviation={`${bx.toFixed(2)} ${by.toFixed(2)}`} />
          </filter>
        </defs>
      </svg>
      <AbsoluteFill style={{ filter: on ? `url(#${id})` : undefined }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/** 占位矩形：内部只写标识 */
export const Box: React.FC<{
  x: number; y: number; w: number; h: number; r?: number; bg?: string; label?: React.ReactNode; lc?: string; fs?: number;
  border?: string; style?: React.CSSProperties; children?: React.ReactNode;
}> = ({ x, y, w, h, r = 12, bg = C.ph, label, lc = '#7A7A80', fs = 24, border, style, children }) => (
  <div
    style={{
      position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: r, background: bg, border, boxSizing: 'border-box',
      display: 'flex', alignItems: 'center', justifyContent: 'center', color: lc, fontSize: fs, fontWeight: 600, overflow: 'hidden', ...style,
    }}
  >
    {label}
    {children}
  </div>
);

export const Tx: React.FC<{ x: number; y: number; s?: number; c?: string; w?: number; b?: boolean; style?: React.CSSProperties; children: React.ReactNode }> = ({
  x, y, s = 20, c = C.text, w, b, style, children,
}) => (
  <div style={{ position: 'absolute', left: x, top: y, fontSize: s, color: c, fontWeight: b ? 700 : 400, whiteSpace: w ? 'normal' : 'nowrap', width: w, lineHeight: 1.4, ...style }}>
    {children}
  </div>
);

/** 画面大字：模糊 → 清晰浮起，b 后淡出 */
export const Caption: React.FC<{ t: number; a: number; b: number; text: React.ReactNode; y?: number; x?: number; size?: number; color?: string; align?: 'center' | 'left'; sub?: string; plate?: boolean }> = ({
  t, a, b, text, y = 880, x = 120, size = 64, color = '#fff', align = 'center', sub, plate,
}) => {
  if (t < a - 0.01 || t > b + 0.3) return null;
  const pin = lin(t, a, a + 0.3, 0, 1);
  const o = Math.min(pin, 1 - lin(t, b, b + 0.25, 0, 1));
  return (
    <div
      style={{
        position: 'absolute', top: y, left: align === 'center' ? 0 : x, width: align === 'center' ? W : undefined, textAlign: align,
        transform: `translateY(${(1 - pin) * 24}px)`, opacity: o, filter: `blur(${(1 - pin) * 8}px)`, color, fontSize: size, fontWeight: 700,
        textShadow: color === '#fff' ? '0 4px 30px rgba(0,0,0,.6)' : undefined, fontFamily: FONT,
      }}
    >
      {/* plate：叠在界面上的标题垫一块磨砂深色底，压在任何画面上都看得清 */}
      <span style={plate ? { display: 'inline-block', padding: `${size * 0.22}px ${size * 0.6}px`, borderRadius: size * 0.42, background: 'rgba(14,14,16,.72)', backdropFilter: 'blur(18px)', boxShadow: '0 20px 60px rgba(0,0,0,.35)', border: '1px solid rgba(255,255,255,.08)' } : undefined}>{text}</span>
      {sub && <div style={{ fontSize: size * 0.42, fontWeight: 400, opacity: 0.75, marginTop: 14 }}>{sub}</div>}
    </div>
  );
};

/** 逐词大字：words 依次出现，排成一行 */
export const Words: React.FC<{ t: number; times: number[]; words: string[]; size?: number; y?: number; colors?: string[] }> = ({ t, times, words, size = 120, y = 470, colors }) => (
  <div style={{ position: 'absolute', top: y, left: 0, width: W, display: 'flex', justifyContent: 'center', gap: size * 0.25, fontFamily: FONT }}>
    {words.map((w, i) => {
      const p = lin(t, times[i], times[i] + 0.25, 0, 1);
      return (
        <span key={i} style={{ fontSize: size, fontWeight: 800, color: colors?.[i] || '#fff', opacity: p, filter: `blur(${(1 - p) * 10}px)`, transform: `translateY(${(1 - p) * 30}px) scale(${1.1 - 0.1 * p})`, display: 'inline-block' }}>
          {w}
        </span>
      );
    })}
  </div>
);

/** 品牌光带：竖向发光条，x 为中心 */
export const Band: React.FC<{ x: number; o?: number; w?: number; reverse?: boolean }> = ({ x, o = 1, w = 280 }) => (
  <div style={{ position: 'absolute', left: x - w / 2, top: -200, width: w, height: H + 400, transform: 'skewX(-14deg)', opacity: o, pointerEvents: 'none' }}>
    <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg, transparent, ${C.blue}AA 35%, ${C.blue2} 50%, ${C.blue}AA 65%, transparent)`, filter: 'blur(24px)' }} />
    <div style={{ position: 'absolute', left: w / 2 - 3, top: 0, width: 6, height: '100%', background: '#fff', filter: 'blur(2px)', opacity: 0.9 }} />
  </div>
);

// ---------- 小黑 ----------
// 小黑标准形（result/xiaohei.svg，用户提供）：坐标是六视图原图 assets/xiaohei-character.jpg 的像素坐标，原样保留
const HEAD = 'M607.2 224.8 C605.8 188.6 607.4 148.1 622.2 120.4 C628.4 108.8 636.6 102.7 647.2 104.2 C669.0 106.3 695.1 134.5 713.9 163.2 C748.5 156.1 786.1 155.8 821.3 163.0 C839.5 135.6 865.4 106.1 885.9 104.0 C915.0 99.8 929.4 149.3 928.1 224.0 C943.1 249.1 951.3 277.1 952.0 304.4 C953.1 340.8 942.9 370.5 921.8 393.4 C894.3 424.2 843.2 442.5 770.0 443.3 C694.0 444.8 642.2 430.7 612.3 399.7 C591.6 378.1 582.4 347.7 582.7 311.6 C582.5 280.4 590.5 249.8 607.2 224.8 Z';
/** 眼白中心/半径、瞳孔位置/半径（瞳孔略向内） */
const EYES = [
  { cx: 694.6, cy: 302.5, rx: 49.3, ry: 49.9, px: 696.9, py: 302.0, prx: 25.8, pry: 26.2 },
  { cx: 839.9, cy: 302.5, rx: 49.5, ry: 49.9, px: 837.7, py: 302.2, prx: 25.7, pry: 26.2 },
];
const PUPIL = '#20201e';

/** 小黑的图形本体（原图坐标系）。line=深色背景用：头填 fill（场景底色）+ 奶白描边，否则会融进黑底 */
export const CatShapes: React.FC<{ line?: boolean; fill?: string; stroke?: string; strokeW?: number; blink?: number; look?: number; lookY?: number }> = ({
  line = false, fill = C.black, stroke = C.cream, strokeW = 8, blink = 0, look = 0, lookY = 0,
}) => {
  const id = React.useId().replace(/:/g, '');
  const ey = 1 - 0.92 * blink;
  return (
    <>
      <defs>
        <radialGradient id={`fur${id}`} cx="48%" cy="43%" r="72%"><stop offset="0" stopColor="#1d1d1b" /><stop offset="1" stopColor="#1a1a18" /></radialGradient>
        <radialGradient id={`eye${id}`} cx="46%" cy="40%" r="70%"><stop offset="0" stopColor="#fffdf7" /><stop offset="1" stopColor="#f8f3e9" /></radialGradient>
      </defs>
      <path d={HEAD} fill={line ? fill : `url(#fur${id})`} stroke={line ? stroke : 'none'} strokeWidth={strokeW} strokeLinejoin="round" />
      {EYES.map((e) => (
        <g key={e.cx} transform={`translate(0 ${e.cy}) scale(1 ${ey}) translate(0 ${-e.cy})`}>
          <ellipse cx={e.cx} cy={e.cy} rx={e.rx} ry={e.ry} fill={`url(#eye${id})`} />
          <ellipse cx={e.px + look * 16} cy={e.py + lookY * 12} rx={e.prx} ry={e.pry} fill={PUPIL} />
        </g>
      ))}
    </>
  );
};

// 头部外框（原图坐标）→ 组件的 200×176 画框：等比缩放到 176 高、左右居中，底边对齐（各场景的落脚、logo 探头都按这个框排）
const HB = { x0: 582.5, x1: 952, y0: 99.8, y1: 444.8 };
const CS = 176 / (HB.y1 - HB.y0);
const CAT_TF = `translate(${(200 - (HB.x1 - HB.x0) * CS) / 2 - HB.x0 * CS} ${-HB.y0 * CS}) scale(${CS})`;

/** 小黑猫头。line=深色背景用（底色填充 + 细奶白描边），否则就是标准形。look: -1..1 瞳孔左右，blink: 0..1 */
export const Cat: React.FC<{ w?: number; line?: boolean; fill?: string; stroke?: string; blink?: number; look?: number; lookY?: number }> = ({
  w = 150, line = true, fill = C.black, stroke = C.cream, blink = 0, look = 0, lookY = 0,
}) => (
  <svg width={w} height={w * 0.88} viewBox="0 0 200 176" style={{ overflow: 'visible', display: 'block' }}>
    <g transform={CAT_TF}>
      <CatShapes line={line} fill={fill} stroke={stroke} strokeW={4 / CS} blink={blink} look={look} lookY={lookY} />
    </g>
  </svg>
);

/** logo：产品图标（assets/product-icon.png，复制到 public/） */
export const Logo: React.FC<{ size?: number; style?: React.CSSProperties }> = ({ size = 220, style }) => (
  <Img src={staticFile('product-icon.png')} width={size} height={size} style={{ display: 'block', flexShrink: 0, ...style }} />
);

// 绘制版猫 → 产品图标里的猫：两眼中点、眼距、倾角对齐（按 product-icon.png 像素量出，单位 = logo 边长）
// 绘制版两眼 (0.359, 0.753) (0.641, 0.753)；图标两眼 (0.280, 0.763) (0.613, 0.808)
const TO_ICON = { ox: 0.5, oy: 0.753, dx: -0.0533, dy: 0.0328, rot: 7.7, s: 1.194 };

/** 绘制版 logo：蓝色渐变圆角方形，黑猫从底部探头（会眨眼）；只在结尾小黑钻进方块的交接里用。
 *  toIcon 0→1：猫移到产品图标里的位置和大小，之后淡到 Logo（PNG）就不会出现两只猫 */
export const LogoDrawn: React.FC<{ size?: number; blink?: number; look?: number; toIcon?: number }> = ({ size = 220, blink = 0, look = 0, toIcon = 0 }) => {
  const k = toIcon, T = TO_ICON;
  const tf = `translate(${T.dx * size * k}px, ${T.dy * size * k}px) rotate(${T.rot * k}deg) scale(${1 + (T.s - 1) * k})`;
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.24, background: `linear-gradient(180deg, ${C.blue}, ${C.blue2})`, position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
      <div style={{ position: 'absolute', inset: 0, transformOrigin: `${T.ox * size}px ${T.oy * size}px`, transform: tf }}>
        <div style={{ position: 'absolute', left: size * 0.12, top: size * 0.36 }}>
          <Cat w={size * 0.76} line={false} blink={blink} look={look} />
        </div>
      </div>
    </div>
  );
};

// ---------- 光标与 HUD ----------
/** macOS 光标：path=[{t,x,y}]，clicks=[秒]，点击时缩小并出现涟漪 */
export const Cursor: React.FC<{ t: number; path: any[]; clicks?: number[]; show?: [number, number]; size?: number; dark?: boolean }> = ({
  t, path, clicks = [], show, size = 34, dark,
}) => {
  if (show && (t < show[0] || t > show[1])) return null;
  const p = kf(t, path);
  const c = clicks.find((k) => t >= k && t < k + 0.35);
  const press = c !== undefined && t < c + 0.12 ? 0.82 : 1;
  const rp = c !== undefined ? (t - c) / 0.35 : 0;
  return (
    <>
      {c !== undefined && (
        <div style={{ position: 'absolute', left: p.x - 30 * rp - 6, top: p.y - 30 * rp - 6, width: 12 + 60 * rp, height: 12 + 60 * rp, borderRadius: '50%', border: `3px solid ${C.blue}`, opacity: 1 - rp }} />
      )}
      <svg width={size} height={size * 1.4} viewBox="0 0 20 28" style={{ position: 'absolute', left: p.x - 2, top: p.y - 2, transform: `scale(${press})`, transformOrigin: '2px 2px', filter: 'drop-shadow(0 2px 3px rgba(0,0,0,.4))' }}>
        <path d="M1 1 L1 22 L6.5 16.8 L10.2 25.5 L13.6 24 L9.9 15.5 L17 15.5 Z" fill={dark ? '#000' : '#000'} stroke="#fff" strokeWidth={1.6} strokeLinejoin="round" />
      </svg>
    </>
  );
};

/** 左下角按键提示 */
export const KeyHud: React.FC<{ t: number; a: number; b: number; text: string }> = ({ t, a, b, text }) => {
  const o = win(t, a, b, 0.08, 0.15);
  if (o <= 0) return null;
  return (
    <div style={{ position: 'absolute', left: 60, bottom: 60, padding: '14px 26px', borderRadius: 14, background: 'rgba(30,30,30,.85)', border: '1px solid #555', color: '#fff', fontSize: 30, fontWeight: 600, opacity: o, transform: `scale(${0.9 + 0.1 * o})`, fontFamily: FONT }}>
      {text}
    </div>
  );
};

/** 黑色胶囊 toast */
export const Pill: React.FC<{ x: number; y: number; text: string; o?: number; s?: number; bg?: string }> = ({ x, y, text, o = 1, s = 1, bg = C.ink }) => (
  <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${s})`, opacity: o, background: bg, color: '#fff', fontSize: 22, fontWeight: 600, padding: '10px 22px', borderRadius: 999, whiteSpace: 'nowrap', boxShadow: '0 6px 20px rgba(0,0,0,.25)' }}>
    {text}
  </div>
);

export const Spinner: React.FC<{ t: number; size?: number; color?: string }> = ({ t, size = 18, color = C.muted }) => (
  <div style={{ width: size, height: size, borderRadius: '50%', border: `3px solid ${color}44`, borderTopColor: color, transform: `rotate(${t * 720}deg)`, boxSizing: 'border-box', display: 'inline-block' }} />
);
