// 审片截图：node tools/stills.mjs <秒> [秒…] [--comp=Final]
// --scale=0.33 出小图快速通看。打包一次，渲染多张 → out/stills/s_<秒>.jpg（与成片同一时间轴，单位秒）
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { bundle } from '@remotion/bundler';
import { getCompositions, renderStill } from '@remotion/renderer';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const comp = (args.find((a) => a.startsWith('--comp=')) || '--comp=Final').slice(7);
const scale = Number((args.find((a) => a.startsWith('--scale=')) || '--scale=1').slice(8));
const secs = args.filter((a) => !a.startsWith('--')).map(Number);
const dir = path.join(root, 'out/stills');
fs.mkdirSync(dir, { recursive: true });

const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts') });
const c = (await getCompositions(serveUrl)).find((x) => x.id === comp);
for (const s of secs) {
  const frame = Math.min(c.durationInFrames - 1, Math.round(s * c.fps));
  const output = path.join(dir, `s_${s.toFixed(1)}.jpg`);
  await renderStill({ serveUrl, composition: c, frame, output, imageFormat: 'jpeg', jpegQuality: 80, scale });
  console.log(path.relative(root, output));
}
