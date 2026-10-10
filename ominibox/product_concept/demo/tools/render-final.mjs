// 成片：渲染 Final（线框已填真实内容、无时间码）→ 合入方案二的声音 → out/ominibox_product_video_v1.mp4
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const run = (cmd) => execSync(cmd, { cwd: root, stdio: 'inherit' });
const MIX = 'audio/out/music2/mix.wav';
const OUT = 'out/ominibox_product_video_v1.mp4';
const TMP = 'out/.final_silent.mp4';

if (!fs.existsSync(path.join(root, MIX))) run('npm run audio'); // 声音事件表与画面同源，混音缺失时重新生成
run(`npx remotion render Final ${TMP}`);
run(`npx remotion ffmpeg -v error -y -i ${TMP} -i ${MIX} -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest ${OUT}`);
fs.rmSync(path.join(root, TMP));
console.log(`built ${OUT}`);
