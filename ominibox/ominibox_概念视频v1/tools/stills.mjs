// 审片：一次打包，渲染若干帧静图 → out/stills/f_<帧>.jpg。用法：node tools/stills.mjs 30 75 120 ...
import path from 'path'; import fs from 'fs'; import { fileURLToPath } from 'url';
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PW = fs.readFileSync(path.join(root, 'remotion.config.ts'), 'utf8').match(/const PW = '([^']*)'/)?.[1];
const browserExecutable = PW && fs.existsSync(PW) ? PW : null;
const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts') });
const comp = await selectComposition({ serveUrl, id: 'OmniBoxConcept', browserExecutable });
const out = path.join(root, 'out/stills'); fs.mkdirSync(out, { recursive: true });
for (const f of process.argv.slice(2).map(Number)) {
  await renderStill({ serveUrl, composition: comp, frame: f, output: path.join(out, `f_${String(f).padStart(3, '0')}.jpg`), imageFormat: 'jpeg', jpegQuality: 85, browserExecutable });
  console.log('still', f);
}
