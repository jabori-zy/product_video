// 用 sh tools/sites/export.sh [站点,…] 运行（读 tools/sites/targets.json，写 out/sites-raw/<站>/）
// Exports the rendered DOM of each configured page: static markup (no scripts / iframes / handlers),
// absolute asset URLs, form values, plus the list of stylesheets (href or inline text).
const fs = await import('node:fs/promises');
const D = (process.env.DEMO || process.cwd()) + '/out/sites-raw/';
await fs.mkdir(D, { recursive: true });
const ONLY = (process.env.SITES || '').split(',').filter(Boolean);
const SITES = JSON.parse(await fs.readFile((process.env.DEMO || process.cwd()) + '/tools/sites/targets.json', 'utf8')).filter((s) => !ONLY.length || ONLY.includes(s.k));
const task = await taskSpace('site snapshots');
const page = task.page('p1');
for (const s of SITES) {
  await page.cdp('Emulation.setDeviceMetricsOverride', { width: s.w, height: s.h, deviceScaleFactor: 1, mobile: false });
  await page.goto(s.url).catch((e) => console.log(s.k, 'goto', e.message));
  await page.waitForTimeout(s.wait ?? 6000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
  await page.screenshot({ path: D + s.k + '-live.png' });
  const PREP = await fs.readFile((process.env.DEMO || process.cwd()) + '/tools/sites/prepare.js', 'utf8');
  const rep = await page.evaluate('(' + PREP + ')(' + JSON.stringify(s.k) + ')');
  console.log(s.k, 'prepare', JSON.stringify(rep));
  await page.waitForTimeout(300);
  await page.screenshot({ path: D + s.k + '-prep.png' });
  const r = await page.evaluate(() => {
    const abs = (u) => { try { return new URL(u, location.href).href; } catch { return u; } };
    const root = document.documentElement.cloneNode(true);
    const orig = [document.documentElement, ...document.documentElement.querySelectorAll('*')];
    const clone = [root, ...root.querySelectorAll('*')];
    orig.forEach((el, i) => {
      const c = clone[i];
      if (!c) return;
      if (el instanceof HTMLImageElement) { c.setAttribute('src', el.currentSrc || el.src); c.removeAttribute('srcset'); c.removeAttribute('loading'); }
      if (el instanceof HTMLInputElement) c.setAttribute('value', el.value);
      if (el instanceof HTMLTextAreaElement) c.textContent = el.value;
      if (el instanceof HTMLVideoElement) c.setAttribute('poster', abs(el.poster || ''));
      if (el instanceof HTMLCanvasElement) { try { const img = document.createElement('img'); img.src = el.toDataURL(); img.setAttribute('style', el.getAttribute('style') || ''); img.className = el.className; img.width = el.width; img.height = el.height; c.replaceWith(img); } catch {} }
      const sr = el.shadowRoot; if (sr) c.setAttribute('data-had-shadow', '1');
    });
    root.querySelectorAll('script,noscript,iframe,link[rel=preload],link[rel=prefetch],link[rel=dns-prefetch],link[rel=preconnect],link[rel=modulepreload],link[rel=manifest],link[rel=icon],link[rel="shortcut icon"],meta[http-equiv]').forEach((n) => n.remove());
    for (const el of root.querySelectorAll('*')) {
      for (const a of [...el.attributes]) {
        if (/^on/i.test(a.name)) el.removeAttribute(a.name);
        if (a.name === 'href' && el.tagName !== 'LINK') el.removeAttribute('href');
        if (a.name === 'src' || a.name === 'poster' || (a.name === 'href' && el.tagName === 'LINK')) el.setAttribute(a.name, abs(a.value));
        if (a.name === 'style' && /url\(/.test(a.value)) el.setAttribute('style', a.value.replace(/url\((['"]?)([^'")]+)\1\)/g, (_, q, u) => `url("${abs(u)}")`));
      }
    }
    const sheets = [...document.styleSheets].map((sh) => {
      // 原文优先：cssRules 序列化会把带 var() 的简写属性（padding: 0 var(--x)）写成空值。
      // <style> 用原文；外链样式表交给 build.py 重新下载原文件；脚本 insertRule 进去的（原文为空）才用 cssRules
      let text = null;
      const own = sh.ownerNode;
      if (own && own.tagName === 'STYLE' && own.textContent.trim()) text = own.textContent;
      else if (!sh.href) { try { text = [...sh.cssRules].map((x) => x.cssText).join('\n'); } catch {} }
      return { href: sh.href, media: sh.media && sh.media.mediaText, text, owner: sh.ownerNode && sh.ownerNode.tagName };
    });
    return { html: '<!doctype html>\n' + root.outerHTML, sheets, url: location.href, w: innerWidth, h: innerHeight, htmlClass: document.documentElement.className, bodyClass: document.body.className };
  });
  await fs.mkdir(D + s.k, { recursive: true });
  await fs.writeFile(D + s.k + '/raw.html', r.html);
  await fs.writeFile(D + s.k + '/sheets.json', JSON.stringify(r.sheets));
  console.log(s.k, r.url, r.w, r.h, 'html', Math.round(r.html.length / 1024), 'KB', 'sheets', r.sheets.length, 'unreadable', r.sheets.filter((x) => x.text === null).length);
}
await page.cdp('Emulation.clearDeviceMetricsOverride', {});
