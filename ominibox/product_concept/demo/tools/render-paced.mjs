// 渲染不限时长版：时长由 src/pace.ts 算出，输出 out/demo-<秒>s.mp4（不覆盖已有文件）
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { bundle } from '@remotion/bundler';
import { selectComposition } from '@remotion/renderer';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts') });
const comp = await selectComposition({ serveUrl, id: 'DemoPaced' });
const n = Math.round(comp.durationInFrames / comp.fps);
const out = `out/demo-${n}s.mp4`;
if (fs.existsSync(path.join(root, out)) && !process.argv.includes('--force')) {
  console.error(`${out} 已存在，加 --force 覆盖`);
  process.exit(1);
}
execSync(`npx remotion render DemoPaced ${out}`, { cwd: root, stdio: 'inherit' });
console.log(`built ${out}`);
