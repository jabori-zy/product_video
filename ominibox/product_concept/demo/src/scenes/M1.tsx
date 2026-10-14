import React from 'react';
import { C, Camera, Caption, blinkAt, inOut, kf, lin } from '../lib';
import { dCam } from './D';
import { LOCALES } from '../data/content';
import { useLang, useRes, useTr } from '../i18n';
import type { ResKey } from '../copy';
import { Board } from '../content/understand';
import { CAM_FULL, CAM_WIDE, Laptop, PHONE, Phone, Stage, pageToWorld, phoneToWorld } from '../mobile/stage';
import { WebHome } from '../ui';
import { BottomBar, ContentTabs, Dialog, HomeComposer, HomeHeader, Ic, M, MoreSheetBody, PH, PW, RecordSheetBody, ResRow, ResToolbar, Sheet, Tap, Toast, spr } from '../mobile/ui';

// C+ 手机随手记（插在 D 开场 12.05 s）：电脑画面拉远成笔记本 → 手机录下周会、拍下白板 → 两条资源化作光点飞进电脑侧栏 → 推回电脑，接 D
export const M1_AT = 12.05;
const DOT_FLIGHT = 1.5; // 光点从手机飘到电脑侧栏的时长（v2 从 0.85 s 放慢）
const CAM_PHONE = { x: 1520, y: 560, s: 1.32 };
// final：操作时推近手机下半屏（录音面板、对话框、「更多方式」），手机界面字不再小
const CAM_SHEET = { x: 1590, y: 720, s: 1.9 }, CAM_DLG = { x: 1590, y: 590, s: 1.9 };
const CAM = [
  { t: 0, ...CAM_FULL }, { t: 1.3, ...CAM_WIDE }, { t: 1.5, ...CAM_WIDE }, { t: 2.3, ...CAM_PHONE },
  { t: 2.75, ...CAM_PHONE }, { t: 3.15, ...CAM_SHEET }, { t: 5.9, ...CAM_SHEET }, { t: 6.2, ...CAM_DLG }, { t: 6.95, ...CAM_DLG },
  { t: 7.4, ...CAM_PHONE }, { t: 8.35, ...CAM_PHONE }, { t: 8.7, ...CAM_SHEET }, { t: 9.15, ...CAM_SHEET }, { t: 9.45, ...CAM_PHONE },
  { t: 11.2, ...CAM_PHONE }, { t: 12.2, ...CAM_WIDE }, { t: 13.6, ...CAM_WIDE }, { t: 15.25, ...CAM_FULL },
];

const BAR_Y = PH - 70; // 胶囊中心
const ROW0 = 432, ROW_STEP = 46;
const OLD: [string, ResKey][] = [['🌐', 'zhihuHome'], ['📕', 'monthly'], ['📕', 'docker']];
const NEW: { at: number; icon: string; text: ResKey }[] = [{ at: 7.3, icon: '🎙', text: 'meeting' }, { at: 10.95, icon: '🖼', text: 'board' }];

const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

export const M1: React.FC<{ t: number }> = ({ t }) => {
  const lang = useLang(), tr = useTr(), res = useRes();
  const cam = kf(t, CAM);
  const enter = spr(t, 0.7, 16);
  const px = PHONE.x + (1 - enter) * 900 + lin(t, 13.6, 15.25, 0, 420);

  // 录音
  const recP = t < 7.0 ? spr(t, 2.75) : 1 - lin(t, 7.0, 7.3, 0, 1);
  const active = t >= 3.0 && t < 6.9;
  const timer = fmt(t < 3.0 ? 0 : Math.min(1935, lin(t, 3.0, 5.6, 0, 1935, (x) => x)));
  const dlgP = t < 6.95 ? spr(t, 6.05) : 1 - lin(t, 6.95, 7.15, 0, 1);
  // 更多 → 拍照
  const moreP = t < 9.2 ? spr(t, 8.45) : 1 - lin(t, 9.2, 9.4, 0, 1);
  const camP = Math.min(lin(t, 9.3, 9.55, 0, 1), 1 - lin(t, 10.6, 10.85, 0, 1));
  const flash = Math.min(lin(t, 10.1, 10.14, 0, 1), 1 - lin(t, 10.14, 10.35, 0, 1));
  const thumb = lin(t, 10.25, 10.55, 0, 1);

  // 资源列表：新行插到最上面
  const rows: { icon: string; text: string; o: number; parsing?: boolean; key: string }[] = [];
  [...NEW].reverse().forEach((n) => { if (t >= n.at) rows.push({ icon: n.icon, text: n.text, o: spr(t, n.at), parsing: true, key: n.text }); });
  OLD.forEach(([icon, text]) => rows.push({ icon, text, o: 1, key: text }));
  // 新行出现时把下面的行平滑推下去：每行的 y = 上面各行高度之和（新行按出现进度计）
  const ys: number[] = [];
  rows.reduce((y, r) => { ys.push(y); return y + ROW_STEP * (r.parsing ? Math.min(1, r.o) : 1); }, ROW0);
  const hlOf = (key: string) => { const n = NEW.find((x) => x.text === key); return n ? Math.max(0, 1 - lin(t, n.at + 0.6, n.at + 1.6, 0, 1)) : 0; };

  const press = t > 2.5 && t < 2.7 ? 'record' : t > 8.2 && t < 8.4 ? 'more' : null;
  const barRec = t >= 3.0 && t < 7.0 ? timer : null;

  const screen = (
    <>
      <HomeHeader />
      <HomeComposer blink={blinkAt(t, [2.0, 8.0, 11.6])} />
      <ContentTabs y={340} p={0} />
      <div style={{ position: 'absolute', left: 18, top: 398, fontSize: 13, color: M.sub, display: 'flex', alignItems: 'center', gap: 2 }}>{tr('个人', 'Personal')} <Ic n="chevD" s={13} c={M.sub} /></div>
      <ResToolbar y={396} />
      {rows.map((r, i) => <ResRow key={r.key} y={ys[i]} icon={r.icon} text={res(r.text as ResKey)} o={r.o} dx={(1 - Math.min(1, r.o)) * 30} parsing={r.parsing} t={t} hl={hlOf(r.key)} />)}
      <BottomBar t={t} rec={barRec} press={press} />
      <Tap t={t} at={2.6} x={195} y={BAR_Y} />
      {recP > 0.001 && (
        <Sheet p={recP} h={470}>
          <RecordSheetBody t={t} timer={timer} active={active} press={t > 5.85 && t < 6.05 ? 'done' : null} />
        </Sheet>
      )}
      <Tap t={t} at={5.9} x={288} y={768} />
      {dlgP > 0.001 && <Dialog p={dlgP} title={tr('结束并保存录音？', 'End and save recording?')} body={tr('返回后可继续录音。', 'You can keep recording after going back.')} cancel={tr('继续录音', 'Keep recording')} ok={tr('结束并保存', 'End and save')} press={t > 6.85 && t < 6.98} />}
      <Tap t={t} at={6.9} x={262} y={461} />
      <Toast t={t} a={7.15} text={tr('保存成功', 'Saved successfully')} />
      <Tap t={t} at={8.3} x={105} y={BAR_Y} />
      {moreP > 0.001 && (
        <Sheet p={moreP} h={440}>
          <MoreSheetBody press={t > 9.0 && t < 9.25 ? 0 : -1} />
        </Sheet>
      )}
      <Tap t={t} at={9.05} x={195} y={512} />
      {camP > 0.001 && (
        <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: camP, transform: `scale(${1.04 - 0.04 * camP})` }}>
          <div style={{ position: 'absolute', left: 20, top: 62 }}><Ic n="x" s={26} /></div>
          {/* 取景器：白板 */}
          <div style={{ position: 'absolute', left: 0, top: 120, width: PW, height: 520, overflow: 'hidden', background: '#2a2826' }}>
            <div style={{ position: 'absolute', left: 12, top: 60, transform: 'perspective(900px) rotateY(-8deg) rotateX(4deg) scale(1.11)', transformOrigin: '50% 50%' }}><Board c={LOCALES[lang]} /></div>
            {[[0.33, 0], [0.66, 0], [0, 0.33], [0, 0.66]].map(([gx, gy], i) => <div key={i} style={{ position: 'absolute', left: gx ? PW * gx : 0, top: gy ? 520 * gy : 0, width: gx ? 1 : PW, height: gy ? 1 : 520, background: 'rgba(255,255,255,.25)' }} />)}
          </div>
          <div style={{ position: 'absolute', left: 0, top: 666, width: PW, display: 'flex', justifyContent: 'center', gap: 34, fontSize: 14 }}>
            <span style={{ color: '#aaa' }}>{tr('相册', 'Albums')}</span><span style={{ color: '#FACC15', fontWeight: 700 }}>{tr('拍照', 'Camera')}</span>
          </div>
          <div style={{ position: 'absolute', left: PW / 2 - 37, top: 708, width: 74, height: 74, borderRadius: 37, border: '4px solid #fff', boxSizing: 'border-box', padding: 4 }}>
            <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#fff', transform: `scale(${t > 10.05 && t < 10.2 ? 0.86 : 1})` }} />
          </div>
          {thumb > 0 && <div style={{ position: 'absolute', left: 40 + (1 - thumb) * 120, top: 718 - (1 - thumb) * 330, width: 54 + (1 - thumb) * 250, height: 54 + (1 - thumb) * 250, borderRadius: 8, overflow: 'hidden', border: '2px solid #fff', background: '#eee' }} />}
          <div style={{ position: 'absolute', inset: 0, background: '#fff', opacity: flash }} />
        </div>
      )}
      <Tap t={t} at={10.1} x={195} y={745} />
      <Toast t={t} a={10.9} text={tr('保存成功', 'Saved successfully')} />
    </>
  );

  // 光点：手机里的两条新资源 → 笔记本侧栏（原片 D 开场正要落下资源行的位置）
  const dots = NEW.map((n, i) => {
    const a = 11.9 + i * 0.25;
    const p = lin(t, a, a + DOT_FLIGHT, 0, 1, (x) => x * x * (3 - 2 * x));
    if (t < a || p >= 1) return null;
    const from = phoneToWorld(60, ROW0 + i * ROW_STEP + 22, { ...PHONE, x: px });
    const to = pageToWorld(60, 376 + (3 + i) * 40 + 17); // 浏览器网页里侧栏资源行下方
    const x = from.x + (to.x - from.x) * p, y = from.y + (to.y - from.y) * p - 260 * 4 * p * (1 - p);
    return (
      <React.Fragment key={n.text}>
        {[0.06, 0.03, 0].map((g, j) => {
          const q = Math.max(0, p - g);
          const gx = from.x + (to.x - from.x) * q, gy = from.y + (to.y - from.y) * q - 260 * 4 * q * (1 - q);
          return <div key={j} style={{ position: 'absolute', left: gx - 9 + j * 2, top: gy - 9 + j * 2, width: 18 - j * 4, height: 18 - j * 4, borderRadius: '50%', background: j ? '#B2D0FF' : '#fff', boxShadow: '0 0 24px #4A8EF9, 0 0 8px #fff', opacity: 0.5 + j * 0.25 }} />;
        })}
        <div style={{ position: 'absolute', left: x - 11, top: y - 11, width: 22, height: 22, borderRadius: '50%', background: '#fff', boxShadow: '0 0 30px 6px #4A8EF9' }} />
      </React.Fragment>
    );
  });
  const glow = Math.max(0, 1 - Math.abs(t - 13.55) / 0.5);
  // 电脑：原片定格帧（D 开场推近侧栏的特写）→ 同一个镜头拉远成完整网页 → 缩进 Chrome 窗口；结尾倒放回定格帧
  // 三段错开叠在一起，像一次连续的拉远：镜头 0.05–1.2，浏览器 0.35–1.35，首页内容 0.5–1.1 淡入
  const pull = Math.min(lin(t, 0.05, 1.2, 0, 1, inOut), 1 - lin(t, 14.05, 15.15, 0, 1, inOut));
  const browser = Math.min(lin(t, 0.35, 1.35, 0, 1, inOut), 1 - lin(t, 13.75, 14.85, 0, 1, inOut));
  const homeO = Math.min(lin(t, 0.5, 1.1, 0, 1), 1 - lin(t, 13.85, 14.45, 0, 1));
  const c0 = dCam(M1_AT - 12), c1 = { x: 960, y: 540, s: 1, rx: 0, ry: 0 };
  const webCam = Object.fromEntries((['x', 'y', 's', 'rx', 'ry'] as const).map((k) => [k, (c0[k] ?? c1[k]) + (c1[k] - (c0[k] ?? c1[k])) * pull]));

  return (
    <>
      <Stage cam={cam}>
        {/* 笔记本显示整个浏览器（见上面 pull / browser / homeO） */}
        <Laptop at={M1_AT} glow={glow} blur={5 * lin(cam.x, 960, CAM_PHONE.x, 0, 1) * lin(cam.s, 1, CAM_PHONE.s, 0, 1)} browser={browser}
          page={<div style={{ position: 'absolute', inset: 0, background: C.main }}><Camera c={webCam}><WebHome rows={OLD.map(([ic, k]) => [ic, res(k)])} blink={blinkAt(t, [3.0, 9.0])} homeO={homeO} /></Camera></div>} />
        <Phone x={px} y={PHONE.y} k={PHONE.k}>{screen}</Phone>
        {dots}
      </Stage>
      <Caption t={t} a={11.7} b={13.5} text={tr('手机随手记，电脑马上有', "Capture it on your phone. It's already on your computer.")} y={930} size={56} />
    </>
  );
};
