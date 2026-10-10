// 小型离线音频工具：单声道信号（Float32Array）+ 立体声总线、滤波、包络、混响、响度与限幅、WAV 读写
import fs from 'fs';

export const SR = 44100;
export type Sig = Float32Array;
export const len = (sec: number) => Math.max(1, Math.round(sec * SR));
export const mtof = (m: number) => 440 * 2 ** ((m - 69) / 12);
export const db = (x: number) => 10 ** (x / 20);

/** 可复现的随机数 */
export const rng = (seed: number) => () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// ---------- 立体声总线 ----------
export class Bus {
  L: Float32Array; R: Float32Array;
  constructor(public dur: number) { this.L = new Float32Array(len(dur)); this.R = new Float32Array(len(dur)); }
  /** 在 t 秒处加一段单声道信号；pan −1（左）…1（右），等功率声像 */
  add(s: Sig, t: number, gain = 1, pan = 0) {
    const o = Math.round(t * SR), a = (pan + 1) * Math.PI / 4, gl = Math.cos(a) * gain * Math.SQRT2, gr = Math.sin(a) * gain * Math.SQRT2;
    for (let i = 0; i < s.length; i++) { const j = o + i; if (j < 0) continue; if (j >= this.L.length) break; this.L[j] += s[i] * gl; this.R[j] += s[i] * gr; }
  }
  mix(b: Bus, gain = 1) { for (let i = 0; i < this.L.length; i++) { this.L[i] += b.L[i] * gain; this.R[i] += b.R[i] * gain; } }
  scale(g: number) { for (let i = 0; i < this.L.length; i++) { this.L[i] *= g; this.R[i] *= g; } }
  /** 按时间曲线乘增益（用于压低/淡出），fn(t) → 线性增益 */
  automate(fn: (t: number) => number) {
    for (let i = 0; i < this.L.length; i += 64) { const g = fn(i / SR); for (let k = i; k < Math.min(i + 64, this.L.length); k++) { this.L[k] *= g; this.R[k] *= g; } }
  }
}

// ---------- 发声 ----------
export const sine = (f: number | ((t: number) => number), dur: number, phase = 0): Sig => {
  const n = len(dur), s = new Float32Array(n); let ph = phase;
  for (let i = 0; i < n; i++) { const fr = typeof f === 'number' ? f : f(i / SR); ph += 2 * Math.PI * fr / SR; s[i] = Math.sin(ph); }
  return s;
};
/** 带限锯齿（polyBLEP，适合垫音与贝斯）；detune 单位音分，phase 0–1 */
export const saw = (f: number, dur: number, detune = 0, phase = 0): Sig => {
  const n = len(dur), s = new Float32Array(n), dt = f * 2 ** (detune / 1200) / SR;
  let p = phase;
  const blep = (t: number) => (t < dt ? ((t /= dt), t + t - t * t - 1) : t > 1 - dt ? ((t = (t - 1) / dt), t * t + t + t + 1) : 0);
  for (let i = 0; i < n; i++) { s[i] = (2 * p - 1 - blep(p)) * 0.5; p += dt; if (p >= 1) p -= 1; }
  return s;
};
export const noise = (dur: number, seed = 1): Sig => { const r = rng(seed), n = len(dur), s = new Float32Array(n); for (let i = 0; i < n; i++) s[i] = r() * 2 - 1; return s; };

// ---------- 包络 ----------
/** 指数衰减（tau 秒），可带起音 a 秒 */
export const decay = (s: Sig, tau: number, a = 0.001): Sig => { for (let i = 0; i < s.length; i++) { const t = i / SR; s[i] *= Math.min(1, t / a) * Math.exp(-t / tau); } return s; };
/** ADSR 风格：起音 a、保持到 dur − r、释放 r */
export const ar = (s: Sig, a: number, r: number): Sig => { const d = s.length / SR; for (let i = 0; i < s.length; i++) { const t = i / SR; s[i] *= Math.min(1, t / a, Math.max(0, (d - t) / r)); } return s; };
export const shape = (s: Sig, fn: (t: number) => number): Sig => { for (let i = 0; i < s.length; i++) s[i] *= fn(i / SR); return s; };
export const gain = (s: Sig, g: number): Sig => { for (let i = 0; i < s.length; i++) s[i] *= g; return s; };
export const sum = (...xs: Sig[]): Sig => { const n = Math.max(...xs.map((x) => x.length)), o = new Float32Array(n); for (const x of xs) for (let i = 0; i < x.length; i++) o[i] += x[i]; return o; };
export const delay = (s: Sig, sec: number): Sig => { const o = new Float32Array(s.length + len(sec)); o.set(s, len(sec)); return o; };

// ---------- 滤波（双二阶，可随时间变化的截止频率） ----------
export type FType = 'lp' | 'hp' | 'bp';
export const biquad = (s: Sig, type: FType, f: number | ((t: number) => number), q = 0.707): Sig => {
  const o = new Float32Array(s.length);
  let b0 = 0, b1 = 0, b2 = 0, a1 = 0, a2 = 0, x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  const coef = (fc: number) => {
    const w = 2 * Math.PI * Math.min(fc, SR * 0.45) / SR, c = Math.cos(w), al = Math.sin(w) / (2 * q), a0 = 1 + al;
    if (type === 'lp') { b0 = (1 - c) / 2; b1 = 1 - c; b2 = (1 - c) / 2; }
    else if (type === 'hp') { b0 = (1 + c) / 2; b1 = -(1 + c); b2 = (1 + c) / 2; }
    else { b0 = al; b1 = 0; b2 = -al; }
    b0 /= a0; b1 /= a0; b2 /= a0; a1 = (-2 * c) / a0; a2 = (1 - al) / a0;
  };
  if (typeof f === 'number') coef(f);
  for (let i = 0; i < s.length; i++) {
    if (typeof f !== 'number' && i % 32 === 0) coef(f(i / SR));
    const y = b0 * s[i] + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
    x2 = x1; x1 = s[i]; y2 = y1; y1 = y; o[i] = y;
  }
  return o;
};

/** 变速重采样（rate > 1 升调变短） */
export const resample = (s: Sig, rate: number): Sig => {
  const n = Math.floor(s.length / rate), o = new Float32Array(n);
  for (let i = 0; i < n; i++) { const x = i * rate, k = Math.floor(x), f = x - k; o[i] = (s[k] ?? 0) * (1 - f) + (s[k + 1] ?? 0) * f; }
  return o;
};

/** 简易混响（Schroeder：4 梳状 + 2 全通），返回湿声总线 */
export const reverb = (b: Bus, size = 1, damp = 0.35): Bus => {
  const out = new Bus(b.dur);
  const run = (x: Float32Array, y: Float32Array, spread: number) => {
    const combs = [1116, 1188, 1277, 1356].map((d) => Math.round((d + spread) * size));
    for (const d of combs) {
      const buf = new Float32Array(d); let idx = 0, lp = 0;
      for (let i = 0; i < x.length; i++) { const v = buf[idx]; lp = v * (1 - damp) + lp * damp; buf[idx] = x[i] + lp * 0.84; y[i] += v * 0.25; idx = (idx + 1) % d; }
    }
    for (const d of [556, 441].map((v) => v + spread)) {
      const buf = new Float32Array(d); let idx = 0;
      for (let i = 0; i < y.length; i++) { const bv = buf[idx], v = -y[i] + bv; buf[idx] = y[i] + bv * 0.5; y[i] = v; idx = (idx + 1) % d; }
    }
  };
  run(b.L, out.L, 0); run(b.R, out.R, 23);
  return out;
};

// ---------- 响度与母带 ----------
/** 近似积分响度：400 ms 块的 RMS，剔除 −50 dB 以下静音块（不做 K 计权，约 ±1–2 dB） */
export const loudness = (b: Bus): number => {
  const N = len(0.4); let acc = 0, cnt = 0;
  for (let i = 0; i + N <= b.L.length; i += N >> 1) {
    let e = 0; for (let k = i; k < i + N; k++) e += (b.L[k] ** 2 + b.R[k] ** 2) / 2;
    e /= N; if (e > 1e-5) { acc += e; cnt++; }
  }
  return cnt ? 10 * Math.log10(acc / cnt) : -99;
};
/** 前瞻峰值限幅到 ceiling（线性） */
export const limit = (b: Bus, ceiling = db(-1)) => {
  const n = b.L.length, look = len(0.005), rel = Math.exp(-1 / (0.08 * SR));
  const peak = new Float32Array(n);
  for (let i = 0; i < n; i++) peak[i] = Math.max(Math.abs(b.L[i]), Math.abs(b.R[i]));
  // 前瞻窗口内的最大值
  const need = new Float32Array(n); const dq: number[] = []; let head = 0;
  for (let i = 0; i < n + look; i++) {
    if (i < n) { while (dq.length > head && peak[dq[dq.length - 1]] <= peak[i]) dq.pop(); dq.push(i); }
    const j = i - look; if (j < 0) continue;
    while (dq[head] < j) head++;
    need[j] = peak[dq[head]] > ceiling ? ceiling / peak[dq[head]] : 1;
  }
  let g = 1;
  for (let i = 0; i < n; i++) { g = need[i] < g ? need[i] : 1 - (1 - g) * rel; b.L[i] *= g; b.R[i] *= g; }
};

// ---------- WAV ----------
export const readWav = (path: string): Sig => {
  const b = fs.readFileSync(path); let o = 12, ch = 1;
  while (b.toString('ascii', o, o + 4) !== 'data') { if (b.toString('ascii', o, o + 4) === 'fmt ') ch = b.readUInt16LE(o + 10); o += 8 + b.readUInt32LE(o + 4); }
  const n = b.readUInt32LE(o + 4) / 2 / ch, d = o + 8, s = new Float32Array(n);
  for (let i = 0; i < n; i++) s[i] = b.readInt16LE(d + 2 * i * ch) / 32768;
  return s;
};
export const writeWav = (path: string, b: Bus) => {
  const n = b.L.length, buf = Buffer.alloc(44 + n * 4);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 4, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
  buf.write('data', 36); buf.writeUInt32LE(n * 4, 40);
  const c = (v: number) => Math.round(Math.max(-1, Math.min(1, v)) * 32767);
  for (let i = 0; i < n; i++) { buf.writeInt16LE(c(b.L[i]), 44 + i * 4); buf.writeInt16LE(c(b.R[i]), 46 + i * 4); }
  fs.writeFileSync(path, buf);
};
