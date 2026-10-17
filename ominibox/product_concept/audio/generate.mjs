// 批量生成音效素材：node generate.mjs [名字…]
// 读 sfx.json，每条用 Higgsfield Seed Audio 1.0 生成，下载到 raw/<name>.wav（已存在的跳过）；4 条并行
import { execFile } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const { items } = JSON.parse(fs.readFileSync(path.join(dir, 'sfx.json'), 'utf8'));
const only = process.argv.slice(2);
const todo = items.filter((it) => (!only.length || only.includes(it.name)) && !fs.existsSync(path.join(dir, 'raw', `${it.name}.wav`)));
fs.mkdirSync(path.join(dir, 'raw'), { recursive: true });

const run = (it) => new Promise((resolve) => {
  const args = ['generate', 'create', 'seed_audio', '--prompt', it.prompt, '--format', 'wav', '--sample_rate', '44100', '--wait', '--wait-timeout', '15m'];
  execFile('higgsfield', args, { maxBuffer: 1 << 20 }, async (err, stdout, stderr) => {
    const url = (stdout.match(/https?:\/\/\S+\.wav/) || [])[0];
    if (err || !url) { console.log(`✗ ${it.name}: ${(stderr || stdout || String(err)).trim().split('\n').pop()}`); return resolve(false); }
    const res = await fetch(url);
    fs.writeFileSync(path.join(dir, 'raw', `${it.name}.wav`), Buffer.from(await res.arrayBuffer()));
    console.log(`✓ ${it.name}`);
    resolve(true);
  });
});

let i = 0;
const worker = async () => { while (i < todo.length) await run(todo[i++]); };
await Promise.all([worker(), worker(), worker(), worker()]);
console.log(`done: ${todo.length} requested`);
