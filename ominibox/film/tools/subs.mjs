// 导出字幕：node tools/subs.mjs <film 目录> → out/subs.json（[{t0,t1,text}]，给 core/render/srt.py）
import fs from 'fs'; import path from 'path';
const dir = path.resolve(process.argv[2]);
const LIB = process.env.LEMO_OPUSCAR_HOME || path.join(process.env.HOME, 'Documents/Project/lemo-opuscar');
const { openDemo, closeServer } = await import(path.join(LIB, 'core/render/page.mjs'));
const { browser, page } = await openDemo(dir);
const subs = await page.evaluate(() => window.SUBS.slice().sort((a, b) => a.t0 - b.t0));
fs.mkdirSync(path.join(dir, 'out'), { recursive: true });
fs.writeFileSync(path.join(dir, 'out/subs.json'), JSON.stringify(subs, null, 1));
console.log('subs', subs.length); await browser.close(); closeServer();
