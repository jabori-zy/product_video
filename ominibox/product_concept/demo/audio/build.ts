// 生成成片声音（方案二）：npm run audio
// → audio/out/music2/<分轨>.wav + mix.wav（母带约 −14 LUFS、峰值 −1 dBFS）；合进画面由 tools/render-final.mjs 完成
import fs from 'fs';
import path from 'path';
import { Bus, db, limit, loudness, reverb, writeWav } from './dsp';
import { END } from './cues';
import { PLANS } from './plans';

// 每条分轨的混响量（湿声比例）
const WET: Record<string, number> = { music: 0.25, melody: 0.2, motif: 0.35, xiaohei: 0.18, ui: 0.12, ui_keys: 0.08, pc: 0.08, phone: 0.1, transitions: 0.15, bass_synth: 0.1, keys: 0.04, drums: 0.05 };

for (const make of PLANS) {
  const t0 = Date.now();
  const plan = make();
  const dir = path.join('audio/out', plan.id);
  fs.mkdirSync(dir, { recursive: true });
  const mix = new Bus(END);
  for (const [name, b] of Object.entries(plan.stems)) { if (WET[name]) b.mix(reverb(b, 1, 0.4), WET[name]); mix.mix(b); }
  const L = loudness(mix), g = db(-14 - L);
  mix.scale(g); limit(mix);
  for (const [name, b] of Object.entries(plan.stems)) { b.scale(g); writeWav(path.join(dir, `${name}.wav`), b); }
  writeWav(path.join(dir, 'mix.wav'), mix);
  console.log(`${plan.name}: 分轨 ${Object.keys(plan.stems).join(' / ')} · 原始响度 ${L.toFixed(1)} dB → −14 · ${((Date.now() - t0) / 1000).toFixed(1)} s → ${dir}/mix.wav`);
}
