import React from 'react';
import { random } from 'remotion';
import { C, Camera, Caption, Fill, MBlur, Pill, camBlur, kf, lin, sp } from '../lib';
import { LOCALES } from '../data/content';
import { useLang, useTr } from '../i18n';
import { Bili, News, Rss, XPost, Xhs } from '../content/cards';
import { App } from '../content/phone';
import { KeyframeThumb } from '../content/understand';
import { LAND_SCREEN } from './D';


// C 万物入口 · 随时随地（9.0–12.0 s），局部时间 t = 全局 − 9
// 世界坐标里排一条 3D 卡片走廊，镜头每半拍甩到下一张

const CARDS = [
  { id: 'news', x: 0, w: 720, h: 450, ry: 18, save: 0.2 },
  { id: 'bili', x: 900, w: 720, h: 450, ry: -18, save: 0.7 },
  { id: 'xhs', x: 1640, w: 500, h: 400, ry: 14, save: 1.15 },
  { id: 'x', x: 2200, w: 500, h: 400, ry: -14, save: 1.25 },
  { id: 'phone', x: 3000, w: 360, h: 720, ry: 0, save: -1 },
  { id: 'rss', x: 3480, w: 460, h: 380, ry: -10, save: 2.35 },
];

const CAM = [
  { t: -0.2, x: 0, y: 540, s: 1 },
  { t: 0.35, x: 0, y: 540, s: 1 },
  { t: 0.5, x: 900, y: 540, s: 1 },
  { t: 0.85, x: 900, y: 540, s: 1 },
  { t: 1.0, x: 1920, y: 540, s: 0.85 },
  { t: 1.35, x: 1920, y: 540, s: 0.85 },
  { t: 1.5, x: 3000, y: 540, s: 0.9 },
  { t: 1.95, x: 3000, y: 540, s: 0.9 },
  { t: 2.1, x: 3240, y: 540, s: 0.9 },
  { t: 2.5, x: 1675, y: 540, s: 0.42 },
];

// 光点汇聚到 D 开场镜头下新资源行的位置（随 D 的镜头算，不写死）
const TARGET = LAND_SCREEN;

export const Cc: React.FC<{ t: number }> = ({ t }) => {
  const lang = useLang(), tr = useTr();
  const Z = LOCALES[lang]; // 线框里的真实内容（data/locales）
  const WECHAT = tr(['📄 Q3 产品复盘.pdf', '🎤 0:12', '🖼 白板照片', '周会结论 #会议'], ['📄 Q3 Product Review.pdf', '🎤 0:12', '🖼 Whiteboard photo', 'Meeting conclusions #meeting']);
  const c = kf(t, CAM);
  const [bx, by] = camBlur(t, CAM);
  const shrink = 1 - lin(t, 2.45, 2.6, 0, 1);
  const dim = lin(t, 2.0, 2.2, 0, 0.35);

  const card = (k: any, inner: React.ReactNode, extra: any = {}) => (
    <div key={k.id} style={{ position: 'absolute', left: k.x - k.w / 2 + (extra.dx || 0), top: 540 - k.h / 2 + (extra.dy || 0), width: k.w, height: k.h, transform: `perspective(1600px) rotateY(${extra.ry ?? k.ry}deg) scale(${shrink})`, opacity: (extra.o ?? 1) * (shrink > 0 ? 1 : 0) }}>
      {inner}
      {k.save >= 0 && t >= k.save && <Pill x={k.w / 2} y={-30} text={tr('✓ 已保存', '✓ Saved')} s={sp(t, k.save)} />}
    </div>
  );

  // 线框 → 真实页面（content/cards.tsx，尺寸与卡片一致）
  const PAGE: Record<string, React.FC<{ c: typeof LOCALES.zh }>> = { news: News, bili: Bili, xhs: Xhs, x: XPost };
  const pageOf = (k: any) => { const P = PAGE[k.id]; return <P c={Z} />; };

  // 手机：微信 → OmniBox App
  const ph = CARDS[4];
  const phIn = sp(t, 1.4);
  const app = lin(t, 2.0, 2.15, 0, 1);
  const phone = (
    <div style={{ position: 'absolute', inset: 0, borderRadius: 48, background: '#111', border: '8px solid #333', overflow: 'hidden', boxSizing: 'border-box' }}>
      <div style={{ opacity: 1 - app }}>
        <div style={{ height: 70, background: '#1e1e1e', color: '#fff', fontSize: 24, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 10, boxSizing: 'border-box' }}>{tr('微信 · 小黑', 'WeChat · Xiaohei')}</div>
        {WECHAT.map((m, i) => {
          const a = 1.55 + i * 0.125;
          const p = sp(t, a);
          return (
            <div key={m} style={{ position: 'absolute', right: 22, top: 100 + i * 80, padding: '12px 16px', borderRadius: 10, background: '#95EC69', color: '#111', fontSize: 20, opacity: p, transform: `scale(${0.7 + 0.3 * p})`, transformOrigin: 'right center' }}>
              {m} {t > a + 0.1 && <span style={{ color: '#1a7f37' }}>✓</span>}
            </div>
          );
        })}
      </div>
      <div style={{ position: 'absolute', inset: 0, opacity: app }}>
        <div style={{ position: 'absolute', left: -8, top: -8 }}><App c={Z} /></div>
        {t > 2.15 && (
          <div style={{ position: 'absolute', left: 30, right: 30, top: 572, height: 56, borderRadius: 14, background: 'rgba(28,28,30,.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, opacity: lin(t, 2.15, 2.25, 0, 1) }}>
            {Array.from({ length: 16 }).map((_, i) => <div key={i} style={{ width: 6, height: t > 2.2 ? 8 + 32 * Math.abs(Math.sin(t * 9 + i)) : 6, borderRadius: 3, background: '#EF4444' }} />)}
          </div>
        )}
      </div>
    </div>
  );

  // 光点：每张卡 6 个，从 2.5 s 时卡片的屏幕位置飞向 D 的侧栏
  const c25 = kf(2.5, CAM);
  const dots: React.ReactNode[] = [];
  if (t >= 2.45) {
    CARDS.forEach((k, ci) => {
      for (let j = 0; j < 6; j++) {
        const sx0 = (k.x - c25.x) * c25.s + 960 + (random(`dx${ci}${j}`) - 0.5) * k.w * c25.s;
        const sy0 = 540 + (random(`dy${ci}${j}`) - 0.5) * k.h * c25.s;
        const st = 2.5 + (ci * 6 + j) * 0.006;
        for (let g = 0; g < 4; g++) {
          const p = lin(t - g * 0.025, st, st + 0.42, 0, 1, (x) => x * x);
          const mx = (sx0 + TARGET.x) / 2;
          const my = Math.min(sy0, TARGET.y) - 220;
          const x = (1 - p) * (1 - p) * sx0 + 2 * p * (1 - p) * mx + p * p * TARGET.x;
          const y = (1 - p) * (1 - p) * sy0 + 2 * p * (1 - p) * my + p * p * TARGET.y;
          dots.push(<div key={`${ci}-${j}-${g}`} style={{ position: 'absolute', left: x - 5, top: y - 5, width: 10 - g * 2, height: 10 - g * 2, borderRadius: '50%', background: g ? C.blue2 : '#fff', boxShadow: `0 0 14px ${C.blue}`, opacity: (1 - g * 0.25) * (p >= 1 ? 0 : 1) }} />);
        }
      }
    });
  }

  return (
    <Fill bg="#111114">
      <MBlur id="c-cam" bx={bx} by={by}>
        <Camera c={c}>
          {CARDS.slice(0, 4).map((k) => card(k, (
            <>
              {pageOf(k)}
              {/* B 站：保存后在底部展开「章节 · 关键画面」缩略图条 */}
              {k.id === 'bili' && t >= 0.8 && (
                <div style={{ position: 'absolute', left: 14, right: 14, bottom: 10, height: 74, borderRadius: 12, background: '#fff', boxShadow: '0 -4px 16px rgba(0,0,0,.12)', display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px', opacity: lin(t, 0.8, 0.95, 0, 1), transform: `translateY(${(1 - lin(t, 0.8, 0.95, 0, 1)) * 20}px)` }}>
                  {[0, 1, 2, 3].map((j) => <div key={j} style={{ width: 102, height: 57, overflow: 'hidden', borderRadius: 4, opacity: lin(t, 0.85 + j * 0.05, 0.95 + j * 0.05, 0, 1) }}><div style={{ transform: 'scale(0.62)', transformOrigin: '0 0' }}><KeyframeThumb c={Z} j={j} /></div></div>)}
                  <span style={{ color: '#61666D', fontSize: 16, marginLeft: 6, whiteSpace: 'nowrap' }}>{tr('章节 · 关键画面', 'Chapters · Key frames')}</span>
                </div>
              )}
            </>
          )))}
          {card(ph, phone, { ry: lin(t, 1.4, 1.6, 20, 0), dy: (1 - phIn) * 200, o: phIn })}
          {card(CARDS[5], (
            <>
              <Rss c={Z} reveal={[0, 1, 2].map((i) => lin(t, 2.1 + i * 0.1, 2.2 + i * 0.1, 0, 1))} badge={t > 2.4} />
            </>
          ), { dx: lin(t, 2.0, 2.2, 400, 0), o: lin(t, 2.0, 2.15, 0, 1) })}
        </Camera>
      </MBlur>
      <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: dim }} />
      <Caption t={t} a={2.0} b={2.75} text={tr('随时随地，交给小黑', 'Anytime, anywhere. Leave it to Xiaohei.')} y={tr(470, 480)} size={tr(84, 68)} />
      {dots}
    </Fill>
  );
};
