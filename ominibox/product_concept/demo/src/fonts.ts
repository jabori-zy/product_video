import { continueRender, delayRender, staticFile } from 'remotion';
// Noto Sans SC（SIL OFL 1.1）
export const FONT = 'SC';
if (typeof document !== 'undefined' && !(window as any).__scFont) {
  (window as any).__scFont = true;
  const h = delayRender('font');
  const f = new FontFace(FONT, `url(${staticFile('fonts/NotoSansSC.ttf')})`, { weight: '100 900' });
  f.load().then(() => { document.fonts.add(f); continueRender(h); }).catch((e) => { console.error(e); continueRender(h); });
}
