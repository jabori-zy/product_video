// 成片：npm run render:final -- v2
// 先按当前时间线重建方案二的声音 → 渲染 Final（线框已填真实内容、无时间码）→ 合成 out/ominibox_product_video_<版本>.mp4
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const run = (cmd) => execSync(cmd, { cwd: root, stdio: 'inherit' });
const version = process.argv[2] || 'v1';
const MIX = 'audio/out/music2/mix.wav';
const OUT = `out/ominibox_product_video_${version}.mp4`;
const TMP = 'out/.final_silent.mp4';

run('npm run audio'); // 声音事件表与画面同源：画面节奏改了，声音跟着重算
run(`npx remotion render Final ${TMP}`);
run(`npx remotion ffmpeg -v error -y -i ${TMP} -i ${MIX} -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest ${OUT}`);
fs.rmSync(path.join(root, TMP));
console.log(`built ${OUT}`);
