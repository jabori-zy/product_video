// 加入手机操作的版本（demo-add_more_app）：原片按 pace.ts 放慢，在两处插入手机段
// 插段从原片某一帧（at）定格出发，最后回到同一帧，原片从 at 接着播，衔接处逐帧连续
import { toOut, toScript } from './pace';

// final：插段在成片里占整数小节（dur = 8 小节 = 16 s），画面按 len / dur 略放慢（≈5%），转场才能卡在小节线上
export const INSERTS = [
  { id: 'C+', name: '手机随手记', at: 12.05, len: 15.25, dur: 16 },
  { id: 'E+', name: '跨端接力', at: 26.45, len: 15.2, dur: 16 },
] as const;
/** 插段局部时间：成片秒 → 插段自己的时间轴（M1 / M2 和 cues 里写的秒） */
export const insertScale = (id: InsertId) => { const i = INSERTS.find((x) => x.id === id)!; return i.len / i.dur; };
export type InsertId = (typeof INSERTS)[number]['id'];

type Seg = { kind: 'orig'; from: number; to: number; o0: number; o1: number } | { kind: 'ins'; id: InsertId; at: number; o0: number; o1: number };

const SEGS: Seg[] = [];
{
  let o = 0, s = 0;
  for (const ins of [...INSERTS, { id: null, at: 45, dur: 0 }] as { id: InsertId | null; at: number; dur: number }[]) {
    const len = toOut(ins.at) - toOut(s);
    SEGS.push({ kind: 'orig', from: s, to: ins.at, o0: o, o1: o + len });
    o += len;
    if (ins.id) { SEGS.push({ kind: 'ins', id: ins.id, at: ins.at, o0: o, o1: o + ins.dur }); o += ins.dur; }
    s = ins.at;
  }
}
export const TOTAL_APP = SEGS[SEGS.length - 1].o1;

/** 输出秒 → 原片脚本时间，或插段局部时间 */
export const resolve = (sec: number): { kind: 'orig'; t: number } | { kind: 'ins'; id: InsertId; t: number; at: number } => {
  const g = SEGS.find((x) => sec < x.o1) ?? SEGS[SEGS.length - 1];
  if (g.kind === 'ins') return { kind: 'ins', id: g.id, t: (sec - g.o0) * insertScale(g.id), at: g.at };
  return { kind: 'orig', t: Math.min(g.to, toScript(toOut(g.from) + (sec - g.o0))) };
};

/** 原片脚本时间 → 本版输出时间（写 script-add_more_app.md 用） */
export const toOutApp = (t: number) => toOut(t) + INSERTS.filter((i) => i.at < t).reduce((a, i) => a + i.dur, 0);
/** 插段起点在本版里的输出时间 */
export const insertStart = (id: InsertId) => SEGS.find((x) => x.kind === 'ins' && x.id === id)!.o0;
