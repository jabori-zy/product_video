import React from 'react';
import { AbsoluteFill, Easing, interpolate, interpolateColors, spring } from 'remotion';
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
const CAT = 'M28 150 C6 120 8 82 32 62 L36 12 C38 4 45 3 50 8 L82 40 C94 37 106 37 118 40 L150 8 C155 3 162 4 164 12 L168 62 C192 82 194 120 172 150 C148 176 52 176 28 150 Z';

/** 小黑猫头。line=线稿（描边 + 填底色），否则实心黑。look: -1..1 瞳孔左右，blink: 0..1 */
export const Cat: React.FC<{ w?: number; line?: boolean; fill?: string; stroke?: string; blink?: number; look?: number; lookY?: number }> = ({
  w = 150, line = true, fill = C.black, stroke = C.cream, blink = 0, look = 0, lookY = 0,
}) => {
  const ey = 1 - 0.92 * blink;
  return (
    <svg width={w} height={w * 0.88} viewBox="0 0 200 176" style={{ overflow: 'visible', display: 'block' }}>
      <path d={CAT} fill={line ? fill : C.ink} stroke={line ? stroke : 'none'} strokeWidth={7} strokeLinejoin="round" />
      {[72, 128].map((ex) => (
        <g key={ex} transform={`translate(${ex} 104) scale(1 ${ey})`}>
          <ellipse rx={19} ry={16} fill={C.cream} />
          <ellipse cx={look * 7} cy={lookY * 5} rx={9} ry={8.5} fill={line ? fill : C.ink} />
        </g>
      ))}
    </svg>
  );
};

/** logo：蓝色渐变圆角方形，黑猫从底部探头 */
export const Logo: React.FC<{ size?: number; blink?: number; look?: number }> = ({ size = 220, blink = 0, look = 0 }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.24, background: `linear-gradient(180deg, ${C.blue}, ${C.blue2})`, position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
    <div style={{ position: 'absolute', left: size * 0.12, top: size * 0.36 }}>
      <Cat w={size * 0.76} line={false} blink={blink} look={look} />
    </div>
  </div>
);

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
