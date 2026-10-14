// 成片：npm run render:final -- <版本> [en]
//   中文：npm run render:final -- final   → out/zh/ominibox_product_video_final.mp4
//   英文：npm run render:final -- final en → out/en/ominibox_product_video_en_final.mp4
//   （high_fidelity_v1 起按语言分目录；更早的版本仍在 out/ 根目录）
//   只重做声音：末尾加 --remux
//   4K（3840×2160，画面按 2 倍渲染，排版不变）：加 --4k → 文件名加 _4k 后缀
// 先按当前时间线重建方案二的声音 → 渲染 Final / FinalEn（线框已填真实内容、无时间码）→ 合成
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const run = (cmd) => execSync(cmd, { cwd: root, stdio: 'inherit' });
const version = process.argv[2] || 'final';
const en = process.argv.includes('en');
const COMP = en ? 'FinalEn' : 'Final';
const MIX = `audio/out/music2${en ? '_en' : ''}/mix.wav`;
const k4 = process.argv.includes('--4k');
const OUT = `out/${en ? 'en' : 'zh'}/ominibox_product_video_${en ? 'en_' : ''}${version}${k4 ? '_4k' : ''}.mp4`;
fs.mkdirSync(path.join(root, path.dirname(OUT)), { recursive: true });
const TMP = `out/.final_silent${en ? '_en' : ''}${k4 ? '_4k' : ''}.mp4`;

const remux = process.argv.includes('--remux'); // 只重做声音：沿用已渲染成片的画面
run(`npm run audio${en ? ' -- en' : ''}`); // 声音事件表与画面同源：画面节奏或文案长度改了，声音跟着重算
if (remux) run(`npx remotion ffmpeg -v error -y -i ${OUT} -map 0:v -c:v copy ${TMP}`);
else run(`npx remotion render ${COMP} ${TMP} --timeout=120000${k4 ? ' --scale=2' : ''}`);
// 母带：loudnorm 只用来测量，再按测量值做固定增益 → −14 LUFS、真峰值 ≤ −1.5 dBTP
const LN = 'I=-14:TP=-2:LRA=20'; // AAC 编码后真峰值会回升约 0.5 dB，目标留到 −2，成片 ≤ −1.5
const probe = execSync(`npx remotion ffmpeg -hide_banner -i ${MIX} -af loudnorm=${LN}:print_format=json -f null - 2>&1`, { cwd: root }).toString();
const m = JSON.parse(probe.slice(probe.lastIndexOf('{'), probe.lastIndexOf('}') + 1));
// 固定增益（loudnorm 只用来测量）：loudnorm 的 linear 模式在增益后真峰值超过 TP 时会退回动态处理，成片峰值反而更高。
// AAC 编码后真峰值的回升每次不同（0–0.6 dB），Remotion 自带的 ffmpeg 又没有 alimiter：
// 所以先按 −14 LUFS 算增益编码，再量成片；真峰值超过 −1.5 dBTP 就把增益减去超出量（再留 0.15 dB）重编，最多 4 次
const measure = (file, extra = '') => {
  const out = execSync(`npx remotion ffmpeg -hide_banner -i ${file} ${extra} -af loudnorm=${LN}:print_format=json -f null - 2>&1`, { cwd: root }).toString();
  return JSON.parse(out.slice(out.lastIndexOf('{'), out.lastIndexOf('}') + 1));
};
let gain = -14 - Number(m.input_i);
for (let i = 0; i < 4; i++) {
  run(`npx remotion ffmpeg -v error -y -i ${TMP} -i ${MIX} -map 0:v -map 1:a -c:v copy -af volume=${gain.toFixed(2)}dB,aresample=44100 -c:a aac -b:a 192k -shortest ${OUT}`);
  const r = measure(OUT, '-map 0:a');
  console.log(`master: gain ${gain.toFixed(2)} dB → ${r.input_i} LUFS, ${r.input_tp} dBTP`);
  if (Number(r.input_tp) <= -1.5) break;
  gain -= Number(r.input_tp) + 1.5 + 0.15;
}
fs.rmSync(path.join(root, TMP));
console.log(`built ${OUT}`);
