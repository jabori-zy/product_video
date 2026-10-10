// 线框内容截图：node tools/render-content.mjs [lang...]
// → ../Content Screenshots/<lang>/<NN> <名称>.png（2× PNG）+ README.md 索引。只渲染 src/content，不碰视频
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { bundle } from '@remotion/bundler';
import { getCompositions, renderStill } from '@remotion/renderer';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.resolve(root, '../Content Screenshots');
const only = process.argv.slice(2);

const serveUrl = await bundle({ entryPoint: path.join(root, 'src/content/index.ts') });
const comps = await getCompositions(serveUrl);
const langs = [...new Set(comps.map((c) => c.defaultProps.lang))];
for (const lang of langs) {
  if (only.length && !only.includes(lang)) continue;
  const dir = path.join(outDir, lang);
  fs.mkdirSync(dir, { recursive: true });
  for (const comp of comps.filter((c) => c.defaultProps.lang === lang)) {
    const file = path.join(dir, `${comp.defaultProps.file}.png`);
    await renderStill({ serveUrl, composition: comp, output: file, imageFormat: 'png', scale: 2 });
    console.log(`${lang}/${comp.defaultProps.file}.png`);
  }
}

// 索引：编号 → 各语言文件 → 填哪个线框
const slugs = [...new Set(comps.map((c) => c.defaultProps.slug))];
const row = (slug) => {
  const per = langs.map((l) => comps.find((c) => c.defaultProps.lang === l && c.defaultProps.slug === slug));
  const first = per[0];
  return `| ${first.defaultProps.file.slice(0, 2)} | ${per.map((c) => `\`${c.defaultProps.lang}/${c.defaultProps.file}.png\``).join('<br>')} | ${first.width}×${first.height} | ${first.defaultProps.where} |`;
};
fs.writeFileSync(path.join(outDir, 'README.md'), `# Content Screenshots

Real content for every wireframe in the demo video (\`demo/out/demo-add_more_app.mp4\`), fully simulated in Remotion (React/CSS/SVG). The video itself is unchanged.

- Languages: ${langs.join(', ')} (one subfolder each). Copy lives in \`demo/src/data/locales/<lang>.ts\`; add a language by adding a file there and registering it in \`demo/src/data/content.ts\`.
- Size = wireframe size; PNGs are rendered at 2× for sharpness.
- Rebuild: \`cd demo && npm run render:content\` (or \`npm run render:content -- en\` for one language).

| # | Files | Size | Fills wireframe (45 s / 89 s) |
|---|---|---|---|
${slugs.map(row).join('\n')}
`);
console.log(`wrote ${path.relative(root, outDir)}/README.md`);
