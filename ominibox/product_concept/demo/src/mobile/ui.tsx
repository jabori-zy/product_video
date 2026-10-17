import React from 'react';
import { FONT } from '../fonts';
import { C, Cat, Spinner, lin, sp } from '../lib';
import { useRes, useTr } from '../i18n';
import { StatusIcons } from '../content/phone';
import { Ic as WebIc } from '../omni/root';
import { SVG } from '../omni/svg';

// OmniBox 手机端（浅色）部件：布局、颜色、文案取自 import-ai/omnibox-react-native
// （BottomTabBar / HomeContentTabs / HomeMascot / MoreEntrySheet / RecordSheet / i18n zh-CN），并按真机录屏校对
export const M = {
  bg: '#F5F5F5', surface: '#EFEFF0', card: '#FFFFFF', border: '#E5E5E5', bar: '#FFFFFF', // 真机：页面浅灰，输入框 / 气泡 / 胶囊白色
  text: '#171717', sub: '#737373', icon: '#8F959E', blue: '#3B82F6',
  line: '#E5E5E5', mute: '#A3A3A3', dim: '#525252',
};
export const PW = 390, PH = 844; // 逻辑尺寸（iPhone 15）

// ---------- 图标（lucide 风格线条） ----------
const ICONS: Record<string, string> = {
  plus: 'M12 5v14M5 12h14',
  mic: 'M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM19 11a7 7 0 0 1-14 0M12 18v3',
  file: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 13h6M9 17h6',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-4.3-4.3',
  refresh: 'M20 11a8 8 0 0 0-14.9-3M4 4v4h4M4 13a8 8 0 0 0 14.9 3M20 20v-4h-4',
  sort: 'M3 6h13M3 12h9M3 18h6M17 10l3 3 3-3M20 13V4',
  camera: 'M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  upload: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M12 18v-6M9 15l3-3 3 3',
  link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
  chevR: 'M9 6l6 6-6 6', chevL: 'M15 6l-6 6 6 6', chevD: 'M6 9l6 6 6-6',
  bell: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 0 0 4 0',
  gift: 'M3 8h18v4H3zM12 8v13M5 12v9h14v-9M12 8C10 4 6 4 7 7M12 8c2-4 6-4 5-1',
  gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 0 1-4 0v-.1A1.7 1.7 0 0 0 7 19.4a1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 1.2 14H1a2 2 0 0 1 0-4h.1A1.7 1.7 0 0 0 2.6 7a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 7 2.6 1.7 1.7 0 0 0 8 1.1V1a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V7a1.7 1.7 0 0 0 1.5 1H23a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
  share: 'M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M16 6l-4-4-4 4M12 2v13',
  more: 'M5 12h.01M12 12h.01M19 12h.01',
  chat: 'M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719', // lucide MessageCircle（与网页端对话列表同一个）
  hand: 'M18 11V6a2 2 0 0 0-4 0v5M14 10V4a2 2 0 0 0-4 0v6M10 10.5V6a2 2 0 0 0-4 0v8a8 8 0 0 0 16 0v-3a2 2 0 0 0-4 0',
  up: 'M12 19V5M5 12l7-7 7 7',
  x: 'M18 6L6 18M6 6l12 12',
  check: 'M20 6L9 17l-5-5',
  listCheck: 'M16 5H3M16 12H3M11 19H3M15 18l2 2 4-4',
  rotateCw: 'M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8M21 3v5h-5',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2',
  history: 'M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8M3 3v5h5M12 7v5l4 2',
};
export const Ic: React.FC<{ n: keyof typeof ICONS | string; s?: number; c?: string; w?: number; style?: React.CSSProperties }> = ({ n, s = 20, c = M.text, w = 2, style }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flexShrink: 0, ...style }}>
    <path d={ICONS[n]} />
  </svg>
);

// ---------- 机身 ----------
/** 状态栏（时间 + 信号 / Wi-Fi / 电池）和灵动岛，M2 交接卡片贴合手机时也画一份 */
export const StatusBar: React.FC<{ time?: string }> = ({ time = '21:06' }) => (
  <>
    <div style={{ position: 'absolute', left: 0, top: 0, width: PW, height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 34px 0 40px', boxSizing: 'border-box', fontSize: 16, fontWeight: 700, color: M.text, fontFamily: FONT, pointerEvents: 'none' }}>
      <span>{time}</span><StatusIcons color={M.text} s={1.1} />
    </div>
    <div style={{ position: 'absolute', left: PW / 2 - 62, top: 11, width: 124, height: 36, borderRadius: 18, background: '#000' }} />
  </>
);

export const PhoneShell: React.FC<{ children: React.ReactNode; time?: string }> = ({ children, time = '21:06' }) => (
  <div style={{ width: PW + 24, height: PH + 24, borderRadius: 64, background: '#0a0a0a', padding: 12, boxSizing: 'border-box', boxShadow: '0 0 0 2px #3a3a3c, 0 50px 120px rgba(0,0,0,.6)', fontFamily: FONT, position: 'relative' }}>
    <div style={{ width: PW, height: PH, borderRadius: 52, overflow: 'hidden', position: 'relative', background: M.bg, color: M.text }}>
      {children}
      <StatusBar time={time} />
      <div style={{ position: 'absolute', left: PW / 2 - 70, bottom: 8, width: 140, height: 5, borderRadius: 3, background: 'rgba(0,0,0,.8)' }} />
    </div>
  </div>
);

// ---------- 首页 ----------
// 按真机截图 assets/iphone.png（1284×2778 @3x = 428×926 pt）1:1 还原，换算到本机逻辑尺寸 390×844（× 390/428）。
// 首页各块的竖直位置（手机像素），场景里的点按位置、光点起点都从这里取
export const HOME = {
  composer: { x: 15, y: 236, w: 360, h: 111 }, // 输入框
  tabs: { y: 371, w: 216, h: 36, active: 118 }, // 资源 | 对话
  toolY: 442, // 工具栏图标中心
  labelY: 486, // 「个人 ⌄」中心
  row0: 527, rowStep: 41, // 资源行中心
  barY: 771, // 底部胶囊中心
};
export const rowCenter = (i: number) => HOME.row0 + i * HOME.rowStep;

const HexGear: React.FC<{ s?: number; c?: string }> = ({ s = 19, c = M.text }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2} strokeLinejoin="round" style={{ display: 'block' }}>
    <path d="M12 2.5l8.2 4.75v9.5L12 21.5l-8.2-4.75v-9.5z" /><circle cx="12" cy="12" r="3.2" />
  </svg>
);
export const HomeHeader: React.FC = () => {
  const tr = useTr(), res = useRes();
  return (
  <div style={{ position: 'absolute', left: 15, right: 15, top: 64, height: 22, display: 'flex', alignItems: 'center' }}>
    <div style={{ width: 22, height: 22, borderRadius: 5, background: '#111', color: '#fff', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>X</div>
    <span style={{ marginLeft: 8, fontSize: 14.5, fontWeight: 500 }}>{res('space')}</span>
    <Ic n="chevD" s={16} w={2.2} style={{ marginLeft: 4 }} />
    <span style={{ marginLeft: 10, height: 18, lineHeight: '18px', padding: '0 7px', borderRadius: 5, background: '#3B82F6', color: '#fff', fontSize: 11.5, fontWeight: 600 }}>{tr('升级', 'Upgrade')}</span>
    <div style={{ marginLeft: 'auto', display: 'flex', gap: 20, alignItems: 'center' }}>
      <Ic n="gift" s={19} c="#3B82F6" />
      <div style={{ position: 'relative' }}><Ic n="bell" s={19} /><div style={{ position: 'absolute', right: -2, top: -2, width: 8, height: 8, borderRadius: 4, background: '#EF4444' }} /></div>
      <HexGear />
    </div>
  </div>
  );
};

/** 网页端同一个小黑 SVG（svg.ts 的 xiaohei）。它的颜色写在产品样式表的 class 里，手机端不在 Shadow DOM 里，换成行内颜色 */
const XIAOHEI_H = SVG.xiaohei.h
  .replace(/class="fill-neutral-950 stroke-black[^"]*"/g, 'fill="#0a0a0a" stroke="#000"')
  .replace(/class="fill-\[#FEF6EC\] stroke-black"/g, 'fill="#FEF6EC" stroke="#000"');
export const Xiaohei: React.FC<{ w: number }> = ({ w }) => (
  <svg width={w} height={(w * 100) / 94} viewBox="0 0 94 100" fill="none" style={{ display: 'block' }} dangerouslySetInnerHTML={{ __html: XIAOHEI_H }} />
);

/** 小黑（实心黑猫，从输入框后面探出半个头）+ 推荐问题气泡（带尾巴的白色胶囊）+ 输入框 */
export const HomeComposer: React.FC<{ y?: number; blink?: number; bubble?: string; text?: string; caret?: boolean }> = ({ bubble, text, caret }) => {
  const tr = useTr();
  const C0 = HOME.composer;
  return (
  <>
    <div style={{ position: 'absolute', left: 30, top: 181, width: 70 }}><Xiaohei w={70} /></div>
    {/* 气泡：白底灰边胶囊，左下角一个小尾巴 */}
    <div style={{ position: 'absolute', left: 115, top: 156, width: 259, height: 64 }}>
      <svg width={259} height={64} viewBox="0 0 259 64" style={{ position: 'absolute', inset: 0 }}>
        <path d="M30 0.5H227A31.5 31.5 0 0 1 227 63.5H10C3 63.5 1.5 60 5 56.5L14 47A31.5 31.5 0 0 1 30 0.5Z" fill="#fff" stroke="#E5E5E5" />
      </svg>
      <div style={{ position: 'absolute', left: 24, right: 14, top: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: 12.6, lineHeight: 1.35, color: '#525252' }}>{bubble ?? tr('列出包含「会议」标签的资源', 'List all resources tagged "meeting"')}</div>
    </div>
    <div style={{ position: 'absolute', left: C0.x, top: C0.y, width: C0.w, height: C0.h, borderRadius: 14, background: M.card, border: '1px solid #E5E5E5', boxSizing: 'border-box' }}>
      <div style={{ position: 'absolute', left: 15, top: 10, fontSize: 14.3, color: text ? M.text : '#A3A3A3' }}>
        {text || tr('随便问点什么吧', 'Ask anything')}{caret && <span style={{ display: 'inline-block', width: 2, height: 17, background: M.blue, marginLeft: 1, verticalAlign: 'middle' }} />}
      </div>
      <div style={{ position: 'absolute', left: 23, top: 77, display: 'flex', alignItems: 'center' }}>
        <Ic n="plus" s={15} c="#525252" />
        <span style={{ marginLeft: 21, display: 'flex', alignItems: 'center', gap: 4 }}><Ic n="hand" s={15} c="#525252" /><Ic n="chevD" s={10} c="#737373" /></span>
      </div>
      <div style={{ position: 'absolute', right: 59, top: 78, fontSize: 11, color: '#737373', whiteSpace: 'nowrap' }}>{tr('Agent 2.1 轻', 'Agent 2.1 Light')}</div>
      <div style={{ position: 'absolute', right: 14, top: 70, width: 29, height: 29, borderRadius: '50%', background: text ? M.text : '#F2F2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ic n="up" s={14} c={text ? '#fff' : '#A3A3A3'} w={2.2} /></div>
    </div>
  </>
  );
};

/** 资源 | 对话 胶囊切换：浅灰底，选中项是白色胶囊（截图里选中块比另一半宽），p：0=资源 1=对话 */
export const ContentTabs: React.FC<{ y?: number; p: number }> = ({ p }) => {
  const tr = useTr();
  const T = HOME.tabs, other = T.w - T.active;
  const left = PW / 2 - T.w / 2;
  const pillX = p * other;
  const cx = [mixN(T.active / 2, other / 2, p), mixN(T.active + other / 2, other + T.active / 2, p)];
  return (
  <div style={{ position: 'absolute', left, top: T.y, width: T.w, height: T.h, borderRadius: T.h / 2, background: '#EBEBEB' }}>
    <div style={{ position: 'absolute', left: pillX, top: 0, width: T.active, height: T.h, borderRadius: T.h / 2, background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,.04)' }} />
    {[tr('资源', 'Resources'), tr('对话', 'Chats')].map((s, i) => <div key={s} style={{ position: 'absolute', left: cx[i], top: 0, height: T.h, lineHeight: `${T.h}px`, transform: 'translateX(-50%)', fontSize: 14.5, whiteSpace: 'nowrap', color: Math.abs(p - i) < 0.5 ? M.text : M.sub }}>{s}</div>)}
  </div>
  );
};
const mixN = (a: number, b: number, e: number) => a + (b - a) * e;

/** 工具栏：搜索 · 刷新 · 多选（对话 tab 时可换成 搜索 · 新建） */
export const ResToolbar: React.FC<{ y?: number; icons?: string[] }> = ({ icons = ['search', 'rotateCw', 'listCheck'] }) => (
  <div style={{ position: 'absolute', right: 15, top: HOME.toolY - 8, display: 'flex', gap: 21 }}>{icons.map((n) => <Ic key={n} n={n} s={16} c="#6B6B6B" w={1.8} />)}</div>
);
/** 「个人 ⌄」分组标题 + 右侧 ··· */
export const ResLabel: React.FC<{ o?: number }> = ({ o = 1 }) => {
  const tr = useTr();
  return (
    <div style={{ position: 'absolute', left: 15, right: 15, top: HOME.labelY - 9, height: 18, display: 'flex', alignItems: 'center', opacity: o, fontSize: 12.6, color: '#A3A3A3' }}>
      {tr('个人', 'Personal')}<Ic n="chevD" s={13} c="#A3A3A3" style={{ marginLeft: 4 }} />
      <Ic n="more" s={18} c="#A3A3A3" w={2.6} style={{ marginLeft: 'auto' }} />
    </div>
  );
};

/** 资源行（高 40，以 y 为行中心）：真实资源图标（与网页端同一套，ResIc）+ 名字 */
export const ResRow: React.FC<{ y: number; icon: string; text: string; o?: number; dx?: number; parsing?: boolean; t?: number; hl?: number }> = ({ y, icon, text, o = 1, dx = 0, parsing, t = 0, hl = 0 }) => {
  const tr = useTr();
  return (
  <div style={{ position: 'absolute', left: 30, right: 10, top: y - 20, height: 40, borderRadius: 10, background: hl ? `rgba(59,130,246,${0.18 * hl})` : undefined, display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px 0 12px', boxSizing: 'border-box', opacity: o, transform: `translateX(${dx}px)`, fontSize: 14.3, color: M.text }}>
    <span style={{ width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><MobileResIc icon={icon} name={text} /></span>
    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</span>
    {parsing && <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: M.sub }}><Spinner t={t} size={13} />{tr('解析中', 'Parsing')}</span>}
  </div>
  );
};
/** 资源图标：与网页端 ResourceIcon 同一套（文件按类型、链接按域名），尺寸 16 */
const MobileResIc: React.FC<{ icon: string; name: string }> = ({ icon, name }) => {
  const n = icon === '📕' ? 'res-pdf' : icon === '🖼' ? 'res-image' : icon === '🎙' ? 'res-audio' : icon === '🎬' ? (/B ?站|Bilibili/i.test(name) ? 'res-bilibili' : 'res-video')
    : icon === '🌐' ? (/知乎|Zhihu/.test(name) ? 'res-zhihu' : 'res-link') : icon === '📁' ? 'folder' : 'res-doc';
  const big = ['res-pdf', 'res-image', 'res-audio', 'res-video'].includes(n); // remixicon 文件图标在产品里 scale-125
  return <WebIc n={n} style={{ width: 16, height: 16, display: 'block', transform: big ? 'scale(1.25)' : undefined, color: '#525252' }} />;
};

/** 底部悬浮胶囊（白底、轻阴影 234×54，中心 HOME.barY）+ 渐隐遮罩；rec：录音中显示波形与计时 */
export const BottomBar: React.FC<{ t: number; rec?: string | null; press?: 'more' | 'record' | 'text' | null }> = ({ t, rec, press }) => {
  const tr = useTr();
  return (
  <div style={{ position: 'absolute', left: 0, bottom: 0, width: PW, height: PH - HOME.barY + 60 }}>
    <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(rgba(245,245,245,0), ${M.bg} 45%)` }} />
    <div style={{ position: 'absolute', left: PW / 2 - 117, top: 60 - 27, width: 234, height: 54, borderRadius: 27, background: M.card, boxShadow: '0 4px 20px rgba(0,0,0,.08)', display: 'flex' }}>
      {([['more', 'plus', tr('更多', 'More')], ['record', 'mic', tr('录音', 'Record')], ['text', 'file', tr('文字', 'Text')]] as const).map(([k, ic, s]) => (
        <div key={k} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, color: press === k ? M.mute : M.text, fontSize: 10.5, fontWeight: 500 }}>
          {k === 'record' && rec ? (
            <>
              <div style={{ display: 'flex', gap: 2, height: 18, alignItems: 'center' }}>{Array.from({ length: 7 }).map((_, i) => <div key={i} style={{ width: 3, borderRadius: 2, background: '#EF4444', height: 5 + 12 * Math.abs(Math.sin(t * 8 + i * 1.3)) }} />)}</div>
              <span style={{ fontVariantNumeric: 'tabular-nums', color: '#EF4444' }}>{rec}</span>
            </>
          ) : (
            <><Ic n={ic} s={17} c={press === k ? M.mute : M.text} w={2} />{s}</>
          )}
        </div>
      ))}
    </div>
  </div>
  );
};

// ---------- 浮层 ----------
/** 底部抽屉：p 0→1 滑出，背后压暗 */
export const Sheet: React.FC<{ p: number; h: number; bg?: string; children: React.ReactNode }> = ({ p, h, bg = '#FFFFFF', children }) => (
  <>
    <div style={{ position: 'absolute', inset: 0, background: `rgba(0,0,0,${0.45 * Math.min(1, p)})` }} />
    <div style={{ position: 'absolute', left: 0, top: PH - h * p, width: PW, height: h + 40, borderRadius: '24px 24px 0 0', background: bg, boxShadow: '0 -10px 40px rgba(0,0,0,.12)' }}>
      <div style={{ position: 'absolute', left: PW / 2 - 18, top: 8, width: 36, height: 5, borderRadius: 3, background: '#D4D4D4' }} />
      {children}
    </div>
  </>
);

export const MoreSheetBody: React.FC<{ press?: number }> = ({ press = -1 }) => {
  const tr = useTr(), res = useRes();
  return (
  <div style={{ padding: '30px 16px 0' }}>
    <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 16 }}>{tr('更多方式', 'More options')}</div>
    <div style={{ borderRadius: 20, background: M.surface, overflow: 'hidden' }}>
      {([['camera', M.text, tr('拍照', 'Photo'), tr('打开相机或相册，保存图片内容', 'Save image from camera or albums')], ['upload', '#22C55E', tr('上传文件', 'Upload file'), tr('选择 PDF、Word 等文件保存到小黑', 'Choose a PDF, Word document, or another file')], ['link', '#60A5FA', tr('链接', 'Link'), tr('抖音/B站/小红书等，一键保存', 'Save webpage or video from link')]] as const).map(([ic, col, ti, de], i) => (
        <div key={ti} style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', background: press === i ? M.line : undefined }}>
          <div style={{ width: 48, height: 48, borderRadius: 16, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}><Ic n={ic} s={24} c={col} /></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 600 }}>{ti}</div>
            <div style={{ fontSize: 13, color: M.sub, marginTop: 2 }}>{de}</div>
          </div>
          <Ic n="chevR" s={20} c="#A3A3A3" />
        </div>
      ))}
    </div>
    <div style={{ marginTop: 16, height: 56, borderRadius: 20, background: M.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, fontWeight: 500 }}>{tr('取消', 'Cancel')}</div>
  </div>
  );
};

/** 录音抽屉（RecordSheet：DestinationFields + 波形 + 暂停/完成） */
export const RecordSheetBody: React.FC<{ t: number; timer: string; active: boolean; press?: 'done' | null }> = ({ t, timer, active, press }) => {
  const tr = useTr(), res = useRes();
  return (
  <div style={{ padding: '30px 16px 0' }}>
    <div style={{ fontSize: 17, fontWeight: 600, textAlign: 'center' }}>{tr('录音并保存', 'Record and Save')}</div>
    <div style={{ marginTop: 18, borderRadius: 16, background: M.surface }}>
      {[[tr('空间', 'Namespace'), res('space')], [tr('添加到', 'Add to'), tr('个人', 'Personal')]].map(([k, v], i) => (
        <div key={k} style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', borderTop: i ? `1px solid ${M.line}` : undefined, fontSize: 15 }}>
          <span style={{ color: M.sub }}>{k}</span><span style={{ marginLeft: 'auto', marginRight: 6 }}>{v}</span><Ic n="chevR" s={16} c="#888" />
        </div>
      ))}
    </div>
    <div style={{ marginTop: 26, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
      {Array.from({ length: 34 }).map((_, i) => <div key={i} style={{ width: 4, borderRadius: 2, background: active ? '#EF4444' : '#D4D4D4', height: active ? 8 + 52 * Math.abs(Math.sin(t * 6 + i * 0.7) * Math.cos(t * 2.3 + i * 0.31)) : 8 }} />)}
    </div>
    <div style={{ textAlign: 'center', fontSize: 34, fontWeight: 300, marginTop: 10, fontVariantNumeric: 'tabular-nums', letterSpacing: 1 }}>{timer}</div>
    <div style={{ textAlign: 'center', fontSize: 13, color: active ? '#EF4444' : M.sub, marginTop: 2 }}>{active ? tr('● 录音中', '● Recording') : tr('准备录音', 'Ready to record')}</div>
    <div style={{ display: 'flex', gap: 12, marginTop: 22 }}>
      <div style={{ flex: 1, height: 52, borderRadius: 26, border: '1px solid #D4D4D4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>{tr('暂停', 'Pause')}</div>
      <div style={{ flex: 1, height: 52, borderRadius: 26, background: press === 'done' ? '#404040' : M.text, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 600, transform: `scale(${press === 'done' ? 0.96 : 1})` }}>{tr('完成', 'Complete')}</div>
    </div>
  </div>
  );
};

export const Dialog: React.FC<{ p: number; title: string; body?: string; cancel: string; ok: string; press?: boolean }> = ({ p, title, body, cancel, ok, press }) => (
  <div style={{ position: 'absolute', inset: 0, background: `rgba(0,0,0,${0.5 * p})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ width: 300, borderRadius: 18, background: '#fff', padding: '22px 20px 16px', boxSizing: 'border-box', opacity: Math.min(1, p * 1.5), transform: `scale(${0.9 + 0.1 * p})` }}>
      <div style={{ fontSize: 17, fontWeight: 600, textAlign: 'center' }}>{title}</div>
      {body && <div style={{ fontSize: 14, color: M.sub, textAlign: 'center', marginTop: 8 }}>{body}</div>}
      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <div style={{ flex: 1, height: 44, borderRadius: 12, background: M.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>{cancel}</div>
        <div style={{ flex: 1, height: 44, borderRadius: 12, background: press ? '#404040' : M.text, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 600 }}>{ok}</div>
      </div>
    </div>
  </div>
);

export const Toast: React.FC<{ t: number; a: number; text: string; y?: number }> = ({ t, a, text, y = PH - 168 }) => {
  if (t < a || t > a + 1.1) return null;
  const o = Math.min(lin(t, a, a + 0.15, 0, 1), 1 - lin(t, a + 0.85, a + 1.05, 0, 1));
  return (
    <div style={{ position: 'absolute', left: 0, top: y, width: PW, display: 'flex', justifyContent: 'center', opacity: o, transform: `translateY(${(1 - o) * -12}px)` }}>
      <div style={{ padding: '10px 18px', borderRadius: 999, background: M.text, color: '#fff', fontSize: 15, fontWeight: 600, display: 'flex', gap: 6, alignItems: 'center', boxShadow: '0 8px 24px rgba(0,0,0,.2)' }}><Ic n="check" s={16} c="#4ADE80" w={3} />{text}</div>
    </div>
  );
};

/** 点按涟漪（手机坐标） */
export const Tap: React.FC<{ t: number; at: number; x: number; y: number }> = ({ t, at, x, y }) => {
  if (t < at - 0.12 || t > at + 0.4) return null;
  const pre = t < at;
  const k = pre ? 1 - (at - t) / 0.12 : (t - at) / 0.4;
  return (
    <>
      {!pre && <div style={{ position: 'absolute', left: x - 10 - 26 * k, top: y - 10 - 26 * k, width: 20 + 52 * k, height: 20 + 52 * k, borderRadius: '50%', border: '2px solid rgba(120,120,128,.7)', opacity: 1 - k }} />}
      <div style={{ position: 'absolute', left: x - 22, top: y - 22, width: 44, height: 44, borderRadius: '50%', background: 'rgba(120,120,128,.28)', opacity: pre ? k : 1 - k, transform: `scale(${pre ? 1 : 1 - 0.3 * k})` }} />
    </>
  );
};

/** 对话列表（聊天历史分组） */
export const HISTORY: [string[], string[][]][] = [ // [[中文, English], 条目]
  [['今天', 'Today'], [['周会待办整理', 'Weekly meeting to-dos'], ['你好，小黑！', 'Hello, Xiaohei!']]],
  [['过去 7 天', 'Past 7 days'], [['RAG 和微调的区别', 'RAG vs. fine-tuning'], ['买菜清单请求', 'Grocery list request'], ['Q3 复盘要点', 'Q3 review highlights']]],
  [['2026 年 9 月', 'September 2026'], [['知乎热榜总结', 'Zhihu trending summary'], ['AI 新闻速览', 'AI news at a glance']]],
];
export const ChatHistoryList: React.FC<{ y: number; o?: number; hl?: string; hlP?: number }> = ({ y, o = 1, hl, hlP = 0 }) => {
  const tr = useTr();
  let yy = y;
  const out: React.ReactNode[] = [];
  for (const [gp, items] of HISTORY) {
    const g = tr(gp[0], gp[1]);
    out.push(<div key={g} style={{ position: 'absolute', left: 18, top: yy, fontSize: 13, color: M.sub }}>{g}</div>);
    yy += 30;
    for (const it of items) {
      const s = tr(it[0], it[1]), isHl = it[0] === hl; // hl 用中文名指定
      out.push(
        <div key={s} style={{ position: 'absolute', left: 8, right: 8, top: yy - 6, height: 40, borderRadius: 10, background: isHl ? `rgba(0,0,0,${0.06 * hlP})` : undefined, display: 'flex', alignItems: 'center', gap: 10, padding: '0 10px', fontSize: 15.5 }}>
          <Ic n="chat" s={16} c={M.text} />{s}
        </div>,
      );
      yy += 40;
    }
    yy += 12;
  }
  return <div style={{ position: 'absolute', inset: 0, opacity: o }}>{out}</div>;
};

/** 对话页顶栏（‹ 标题 · 分享 · 新建 · ···） */
export const ThreadHeader: React.FC<{ title: string }> = ({ title }) => (
  <div style={{ position: 'absolute', left: 12, right: 14, top: 62, height: 40, display: 'flex', alignItems: 'center', gap: 6 }}>
    <Ic n="chevL" s={24} />
    <span style={{ fontSize: 18, fontWeight: 600, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</span>
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Ic n="share" s={19} />
      <div style={{ width: 20, height: 20, borderRadius: 10, background: M.blue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ic n="plus" s={14} c="#fff" w={3} /></div>
      <Ic n="more" s={22} w={3} />
    </div>
  </div>
);

export const ChatComposer: React.FC<{ text?: string; caret?: boolean; send?: boolean }> = ({ text, caret, send }) => {
  const tr = useTr(), res = useRes();
  return (
  <div style={{ position: 'absolute', left: 12, right: 12, bottom: 44, height: 96, borderRadius: 20, background: M.card, border: `1px solid ${M.line}` }}>
    <div style={{ position: 'absolute', left: 16, top: 14, fontSize: 16, color: text ? M.text : '#8a8a8e' }}>
      {text || tr('随便问点什么吧', 'Ask anything')}{caret && <span style={{ display: 'inline-block', width: 2, height: 18, background: M.blue, marginLeft: 1, verticalAlign: 'middle' }} />}
    </div>
    <div style={{ position: 'absolute', left: 16, bottom: 12, display: 'flex', gap: 18 }}><Ic n="plus" s={20} c={M.sub} /><Ic n="hand" s={18} c={M.sub} /></div>
    <div style={{ position: 'absolute', right: 56, bottom: 18, fontSize: 13, color: '#8a8a8e' }}>{tr('Agent 2.1 中', 'Agent 2.1 Medium')}</div>
    <div style={{ position: 'absolute', right: 10, bottom: 8, width: 36, height: 36, borderRadius: 18, background: send ? M.text : M.line, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ic n="up" s={18} c={send ? '#fff' : M.mute} w={2.4} /></div>
  </div>
  );
};

export const Disclaimer = () => {
  const tr = useTr();
  return <div style={{ position: 'absolute', left: 0, bottom: 22, width: PW, textAlign: 'center', fontSize: 11.5, color: M.mute }}>{tr('内容由小黑 AI 生成，仅供参考', 'Generated by OmniBox AI')}</div>;
};

/** 回答里的引用角标（对照 assets/app_citation.MP4）：深色实心小圆、白色粗体数字，紧跟在句末；
 *  tap 0→1：点按（角标按下变暗 + 一圈扩散的涟漪，涟漪画在角标自己身上，文字怎么折行都对得上） */
export const Badge: React.FC<{ n: number; on?: number; tap?: number }> = ({ n, tap = 0 }) => (
  <span style={{ position: 'relative', display: 'inline-flex', width: 17, height: 17, borderRadius: 9, background: tap > 0 && tap < 0.4 ? '#111' : '#3A3D44', color: '#fff', fontSize: 10.5, fontWeight: 700, alignItems: 'center', justifyContent: 'center', marginLeft: 3, verticalAlign: '-2px', lineHeight: 1 }}>
    {n}
    {tap > 0 && tap < 1 && <span style={{ position: 'absolute', left: '50%', top: '50%', width: 17 + 40 * tap, height: 17 + 40 * tap, borderRadius: '50%', transform: 'translate(-50%, -50%)', border: '2px solid rgba(120,120,128,.7)', opacity: 1 - tap }} />}
  </span>
);

/** 用于把 sp() 结果限制在 0–1 区间外的回弹值 */
export const spr = (t: number, at: number, damping = 15) => (t < at ? 0 : sp(t, at, { damping, mass: 0.8 }));
