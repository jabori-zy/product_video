// 成片：npm run render:final -- <版本> [en]
//   中文：npm run render:final -- final   → out/ominibox_product_video_final.mp4
//   英文：npm run render:final -- v1 en   → out/ominibox_product_video_en_v1.mp4
// 先按当前时间线重建方案二的声音 → 渲染 Final / FinalEn（线框已填真实内容、无时间码）→ 合成
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const run = (cmd) => execSync(cmd, { cwd: root, stdio: 'inherit' });
const version = process.argv[2] || 'final';
const en = process.argv[3] === 'en';
const COMP = en ? 'FinalEn' : 'Final';
const MIX = `audio/out/music2${en ? '_en' : ''}/mix.wav`;
const OUT = `out/ominibox_product_video_${en ? 'en_' : ''}${version}.mp4`;
const TMP = `out/.final_silent${en ? '_en' : ''}.mp4`;

run(`npm run audio${en ? ' -- en' : ''}`); // 声音事件表与画面同源：画面节奏或文案长度改了，声音跟着重算
run(`npx remotion render ${COMP} ${TMP}`);
// 母带：两遍 loudnorm（先测量，再线性增益）→ −14 LUFS、真峰值 ≤ −1.5 dBTP
const LN = 'I=-14:TP=-1.5:LRA=20';
const probe = execSync(`npx remotion ffmpeg -hide_banner -i ${MIX} -af loudnorm=${LN}:print_format=json -f null - 2>&1`, { cwd: root }).toString();
const m = JSON.parse(probe.slice(probe.lastIndexOf('{'), probe.lastIndexOf('}') + 1));
const AF = `loudnorm=${LN}:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true,aresample=44100`;
run(`npx remotion ffmpeg -v error -y -i ${TMP} -i ${MIX} -map 0:v -map 1:a -c:v copy -af ${AF} -c:a aac -b:a 192k -shortest ${OUT}`);
fs.rmSync(path.join(root, TMP));
console.log(`built ${OUT}`);
