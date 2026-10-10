import React from 'react';
import { FONT } from '../fonts';
import { C, Cat, Spinner, lin, sp } from '../lib';

// OmniBox 手机端（深色）部件：布局、颜色、文案取自 import-ai/omnibox-react-native
// （BottomTabBar / HomeContentTabs / HomeMascot / MoreEntrySheet / RecordSheet / i18n zh-CN），并按真机录屏校对
export const M = {
  bg: '#1c1c1e', surface: '#2a2a2c', card: '#303030', border: '#2c2c2c', bar: '#262626',
  text: '#F5F5F5', sub: '#A3A3A3', icon: '#8F959E', blue: '#3B82F6',
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
  chat: 'M21 12a8 8 0 0 1-11.8 7L3 21l2-6A8 8 0 1 1 21 12z',
  hand: 'M18 11V6a2 2 0 0 0-4 0v5M14 10V4a2 2 0 0 0-4 0v6M10 10.5V6a2 2 0 0 0-4 0v8a8 8 0 0 0 16 0v-3a2 2 0 0 0-4 0',
  up: 'M12 19V5M5 12l7-7 7 7',
  x: 'M18 6L6 18M6 6l12 12',
  check: 'M20 6L9 17l-5-5',
};
export const Ic: React.FC<{ n: keyof typeof ICONS | string; s?: number; c?: string; w?: number; style?: React.CSSProperties }> = ({ n, s = 20, c = M.text, w = 2, style }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flexShrink: 0, ...style }}>
    <path d={ICONS[n]} />
  </svg>
);

// ---------- 机身 ----------
export const PhoneShell: React.FC<{ children: React.ReactNode; time?: string }> = ({ children, time = '21:06' }) => (
  <div style={{ width: PW + 24, height: PH + 24, borderRadius: 64, background: '#0a0a0a', padding: 12, boxSizing: 'border-box', boxShadow: '0 0 0 2px #3a3a3c, 0 50px 120px rgba(0,0,0,.6)', fontFamily: FONT, position: 'relative' }}>
    <div style={{ width: PW, height: PH, borderRadius: 52, overflow: 'hidden', position: 'relative', background: M.bg, color: M.text }}>
      {children}
      <div style={{ position: 'absolute', left: 0, top: 0, width: PW, height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 34px 0 40px', boxSizing: 'border-box', fontSize: 16, fontWeight: 700, pointerEvents: 'none' }}>
        <span>{time}</span><span style={{ fontSize: 12, letterSpacing: 1 }}>▂▄▆ ◒ ▭</span>
      </div>
      <div style={{ position: 'absolute', left: PW / 2 - 62, top: 11, width: 124, height: 36, borderRadius: 18, background: '#000' }} />
      <div style={{ position: 'absolute', left: PW / 2 - 70, bottom: 8, width: 140, height: 5, borderRadius: 3, background: 'rgba(255,255,255,.55)' }} />
    </div>
  </div>
);

// ---------- 首页 ----------
export const HomeHeader: React.FC = () => (
  <div style={{ position: 'absolute', left: 16, right: 16, top: 62, height: 40, display: 'flex', alignItems: 'center', gap: 8 }}>
    <div style={{ width: 26, height: 26, borderRadius: 6, background: '#3b3b3b', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>J</div>
    <span style={{ fontSize: 16, fontWeight: 600 }}>Jabori 的空间</span><Ic n="chevD" s={16} />
    <span style={{ marginLeft: 6, padding: '2px 10px', borderRadius: 6, background: '#2563EB', fontSize: 12, fontWeight: 700 }}>升级</span>
    <div style={{ marginLeft: 'auto', display: 'flex', gap: 16, alignItems: 'center' }}>
      <Ic n="gift" s={21} c="#60A5FA" />
      <div style={{ position: 'relative' }}><Ic n="bell" s={21} /><div style={{ position: 'absolute', right: -1, top: -1, width: 8, height: 8, borderRadius: 4, background: '#EF4444' }} /></div>
      <Ic n="gear" s={21} w={1.6} />
    </div>
  </div>
);

/** 线稿小黑 + 推荐问题气泡 + 输入框（HomeMascot / RecommendedQuestions / ChatInput） */
export const HomeComposer: React.FC<{ y?: number; blink?: number; bubble?: string; text?: string; caret?: boolean }> = ({ y = 118, blink = 0, bubble = '列出包含「会议」标签的资源', text, caret }) => (
  <div style={{ position: 'absolute', left: 0, top: y, width: PW, height: 210 }}>
    <div style={{ position: 'absolute', left: 22, top: 6 }}><Cat w={78} fill={M.bg} blink={blink} look={0.4} lookY={0.4} /></div>
    <div style={{ position: 'absolute', left: 108, top: 2, right: 16, padding: '10px 14px', borderRadius: 18, background: M.surface, fontSize: 14, lineHeight: 1.45, color: '#E5E5E5' }}>{bubble}</div>
    <div style={{ position: 'absolute', left: 12, right: 12, top: 74, height: 128, borderRadius: 20, background: M.surface, border: '1px solid #353537' }}>
      <div style={{ position: 'absolute', left: 16, top: 14, fontSize: 16, color: text ? M.text : '#8a8a8e' }}>
        {text || '随便问点什么吧'}{caret && <span style={{ display: 'inline-block', width: 2, height: 18, background: M.blue, marginLeft: 1, verticalAlign: 'middle' }} />}
      </div>
      <div style={{ position: 'absolute', left: 16, bottom: 14, display: 'flex', gap: 18, alignItems: 'center' }}><Ic n="plus" s={20} c="#bbb" /><Ic n="hand" s={18} c="#bbb" /></div>
      <div style={{ position: 'absolute', right: 58, bottom: 20, fontSize: 13, color: '#8a8a8e' }}>Agent 2.1 中</div>
      <div style={{ position: 'absolute', right: 12, bottom: 10, width: 36, height: 36, borderRadius: 18, background: text ? '#fff' : '#555', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ic n="up" s={18} c={text ? '#000' : '#999'} w={2.4} /></div>
    </div>
  </div>
);

/** 资源 | 对话 胶囊切换（HomeContentTabs，h-10），p：0=资源 1=对话 */
export const ContentTabs: React.FC<{ y: number; p: number }> = ({ y, p }) => (
  <div style={{ position: 'absolute', left: PW / 2 - 84, top: y, width: 168, height: 40, borderRadius: 20, background: '#111113', border: `1px solid ${M.border}` }}>
    <div style={{ position: 'absolute', left: 2 + p * 82, top: 2, width: 82, height: 34, borderRadius: 17, background: '#2c2c2e' }} />
    {['资源', '对话'].map((s, i) => <div key={s} style={{ position: 'absolute', left: 2 + i * 82, top: 2, width: 82, height: 34, lineHeight: '34px', textAlign: 'center', fontSize: 15, color: Math.abs(p - i) < 0.5 ? '#fff' : '#9a9a9e' }}>{s}</div>)}
  </div>
);

export const ResToolbar: React.FC<{ y: number; icons?: string[] }> = ({ y, icons = ['search', 'refresh', 'sort'] }) => (
  <div style={{ position: 'absolute', right: 18, top: y, display: 'flex', gap: 22 }}>{icons.map((n) => <Ic key={n} n={n} s={19} c="#bbb" />)}</div>
);

export const ResRow: React.FC<{ y: number; icon: string; text: string; o?: number; dx?: number; parsing?: boolean; t?: number; hl?: number }> = ({ y, icon, text, o = 1, dx = 0, parsing, t = 0, hl = 0 }) => (
  <div style={{ position: 'absolute', left: 8, right: 8, top: y, height: 44, borderRadius: 10, background: hl ? `rgba(59,130,246,${0.22 * hl})` : undefined, display: 'flex', alignItems: 'center', gap: 12, padding: '0 10px', opacity: o, transform: `translateX(${dx}px)`, fontSize: 15.5 }}>
    <span style={{ fontSize: 17, width: 22, textAlign: 'center' }}>{icon}</span>
    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</span>
    {parsing && <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: M.sub }}><Spinner t={t} size={13} />解析中</span>}
  </div>
);

/** 底部悬浮胶囊（BottomTabBar 258×60 + 112 渐隐遮罩）；rec：录音中显示波形与计时 */
export const BottomBar: React.FC<{ t: number; rec?: string | null; press?: 'more' | 'record' | 'text' | null }> = ({ t, rec, press }) => (
  <div style={{ position: 'absolute', left: 0, bottom: 0, width: PW, height: 112 }}>
    <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(rgba(28,28,30,0), ${M.bg})` }} />
    <div style={{ position: 'absolute', left: PW / 2 - 129, bottom: 40, width: 258, height: 60, borderRadius: 30, background: M.bar, boxShadow: '0 4px 16px rgba(0,0,0,.35)', display: 'flex' }}>
      {([['more', 'plus', '更多'], ['record', 'mic', '录音'], ['text', 'file', '文字']] as const).map(([k, ic, s]) => (
        <div key={k} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, color: press === k ? '#737373' : '#fff', fontSize: 12 }}>
          {k === 'record' && rec ? (
            <>
              <div style={{ display: 'flex', gap: 2, height: 20, alignItems: 'center' }}>{Array.from({ length: 7 }).map((_, i) => <div key={i} style={{ width: 3, borderRadius: 2, background: '#EF4444', height: 5 + 13 * Math.abs(Math.sin(t * 8 + i * 1.3)) }} />)}</div>
              <span style={{ fontVariantNumeric: 'tabular-nums', color: '#EF4444' }}>{rec}</span>
            </>
          ) : (
            <><Ic n={ic} s={20} c={press === k ? '#737373' : '#fff'} />{s}</>
          )}
        </div>
      ))}
    </div>
  </div>
);

// ---------- 浮层 ----------
/** 底部抽屉：p 0→1 滑出，背后压暗 */
export const Sheet: React.FC<{ p: number; h: number; bg?: string; children: React.ReactNode }> = ({ p, h, bg = '#1f1f21', children }) => (
  <>
    <div style={{ position: 'absolute', inset: 0, background: `rgba(0,0,0,${0.45 * Math.min(1, p)})` }} />
    <div style={{ position: 'absolute', left: 0, top: PH - h * p, width: PW, height: h + 40, borderRadius: '24px 24px 0 0', background: bg, boxShadow: '0 -10px 40px rgba(0,0,0,.4)' }}>
      <div style={{ position: 'absolute', left: PW / 2 - 18, top: 8, width: 36, height: 5, borderRadius: 3, background: '#555' }} />
      {children}
    </div>
  </>
);

export const MoreSheetBody: React.FC<{ press?: number }> = ({ press = -1 }) => (
  <div style={{ padding: '30px 16px 0' }}>
    <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 16 }}>更多方式</div>
    <div style={{ borderRadius: 20, background: '#2a2a2c', overflow: 'hidden' }}>
      {([['camera', '#fff', '拍照', '打开相机或相册，保存图片内容'], ['upload', '#22C55E', '上传文件', '选择 PDF、Word 等文件保存到小黑'], ['link', '#60A5FA', '链接', '抖音/B站/小红书等，一键保存']] as const).map(([ic, col, ti, de], i) => (
        <div key={ti} style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', background: press === i ? '#3a3a3c' : undefined }}>
          <div style={{ width: 48, height: 48, borderRadius: 16, background: '#3a3a3c', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}><Ic n={ic} s={24} c={col} /></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 600 }}>{ti}</div>
            <div style={{ fontSize: 13, color: M.sub, marginTop: 2 }}>{de}</div>
          </div>
          <Ic n="chevR" s={20} c="#A3A3A3" />
        </div>
      ))}
    </div>
    <div style={{ marginTop: 16, height: 56, borderRadius: 20, background: '#2a2a2c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, fontWeight: 500 }}>取消</div>
  </div>
);

/** 录音抽屉（RecordSheet：DestinationFields + 波形 + 暂停/完成） */
export const RecordSheetBody: React.FC<{ t: number; timer: string; active: boolean; press?: 'done' | null }> = ({ t, timer, active, press }) => (
  <div style={{ padding: '30px 16px 0' }}>
    <div style={{ fontSize: 17, fontWeight: 600, textAlign: 'center' }}>录音并保存</div>
    <div style={{ marginTop: 18, borderRadius: 16, background: '#2a2a2c' }}>
      {[['空间', 'Jabori 的空间'], ['添加到', '个人']].map(([k, v], i) => (
        <div key={k} style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', borderTop: i ? '1px solid #3a3a3c' : undefined, fontSize: 15 }}>
          <span style={{ color: M.sub }}>{k}</span><span style={{ marginLeft: 'auto', marginRight: 6 }}>{v}</span><Ic n="chevR" s={16} c="#888" />
        </div>
      ))}
    </div>
    <div style={{ marginTop: 26, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
      {Array.from({ length: 34 }).map((_, i) => <div key={i} style={{ width: 4, borderRadius: 2, background: active ? '#EF4444' : '#555', height: active ? 8 + 52 * Math.abs(Math.sin(t * 6 + i * 0.7) * Math.cos(t * 2.3 + i * 0.31)) : 8 }} />)}
    </div>
    <div style={{ textAlign: 'center', fontSize: 34, fontWeight: 300, marginTop: 10, fontVariantNumeric: 'tabular-nums', letterSpacing: 1 }}>{timer}</div>
    <div style={{ textAlign: 'center', fontSize: 13, color: active ? '#EF4444' : M.sub, marginTop: 2 }}>{active ? '● 录音中' : '准备录音'}</div>
    <div style={{ display: 'flex', gap: 12, marginTop: 22 }}>
      <div style={{ flex: 1, height: 52, borderRadius: 26, border: '1px solid #4a4a4c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>暂停</div>
      <div style={{ flex: 1, height: 52, borderRadius: 26, background: press === 'done' ? '#d4d4d4' : '#fff', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 600, transform: `scale(${press === 'done' ? 0.96 : 1})` }}>完成</div>
    </div>
  </div>
);

export const Dialog: React.FC<{ p: number; title: string; body?: string; cancel: string; ok: string; press?: boolean }> = ({ p, title, body, cancel, ok, press }) => (
  <div style={{ position: 'absolute', inset: 0, background: `rgba(0,0,0,${0.5 * p})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ width: 300, borderRadius: 18, background: '#2a2a2c', padding: '22px 20px 16px', boxSizing: 'border-box', opacity: Math.min(1, p * 1.5), transform: `scale(${0.9 + 0.1 * p})` }}>
      <div style={{ fontSize: 17, fontWeight: 600, textAlign: 'center' }}>{title}</div>
      {body && <div style={{ fontSize: 14, color: M.sub, textAlign: 'center', marginTop: 8 }}>{body}</div>}
      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <div style={{ flex: 1, height: 44, borderRadius: 12, background: '#3a3a3c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>{cancel}</div>
        <div style={{ flex: 1, height: 44, borderRadius: 12, background: press ? '#d4d4d4' : '#fff', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 600 }}>{ok}</div>
      </div>
    </div>
  </div>
);

export const Toast: React.FC<{ t: number; a: number; text: string; y?: number }> = ({ t, a, text, y = PH - 168 }) => {
  if (t < a || t > a + 1.1) return null;
  const o = Math.min(lin(t, a, a + 0.15, 0, 1), 1 - lin(t, a + 0.85, a + 1.05, 0, 1));
  return (
    <div style={{ position: 'absolute', left: 0, top: y, width: PW, display: 'flex', justifyContent: 'center', opacity: o, transform: `translateY(${(1 - o) * -12}px)` }}>
      <div style={{ padding: '10px 18px', borderRadius: 999, background: '#f5f5f5', color: '#111', fontSize: 15, fontWeight: 600, display: 'flex', gap: 6, alignItems: 'center', boxShadow: '0 8px 24px rgba(0,0,0,.35)' }}><Ic n="check" s={16} c="#16A34A" w={3} />{text}</div>
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
      {!pre && <div style={{ position: 'absolute', left: x - 10 - 26 * k, top: y - 10 - 26 * k, width: 20 + 52 * k, height: 20 + 52 * k, borderRadius: '50%', border: '2px solid rgba(255,255,255,.7)', opacity: 1 - k }} />}
      <div style={{ position: 'absolute', left: x - 22, top: y - 22, width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,.28)', opacity: pre ? k : 1 - k, transform: `scale(${pre ? 1 : 1 - 0.3 * k})` }} />
    </>
  );
};

/** 对话列表（聊天历史分组） */
export const HISTORY: [string, string[]][] = [
  ['今天', ['周会待办整理', '你好，小黑！']],
  ['过去 7 天', ['RAG 和微调的区别', '买菜清单请求', 'Q3 复盘要点']],
  ['2026 年 9 月', ['知乎热榜总结', 'AI 新闻速览']],
];
export const ChatHistoryList: React.FC<{ y: number; o?: number; hl?: string; hlP?: number }> = ({ y, o = 1, hl, hlP = 0 }) => {
  let yy = y;
  const out: React.ReactNode[] = [];
  for (const [g, items] of HISTORY) {
    out.push(<div key={g} style={{ position: 'absolute', left: 18, top: yy, fontSize: 13, color: M.sub }}>{g}</div>);
    yy += 30;
    for (const s of items) {
      out.push(
        <div key={s} style={{ position: 'absolute', left: 8, right: 8, top: yy - 6, height: 40, borderRadius: 10, background: s === hl ? `rgba(255,255,255,${0.08 * hlP})` : undefined, display: 'flex', alignItems: 'center', gap: 10, padding: '0 10px', fontSize: 15.5 }}>
          <Ic n="chat" s={17} c="#ddd" />{s}
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
      <div style={{ width: 20, height: 20, borderRadius: 10, background: M.blue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ic n="plus" s={14} w={3} /></div>
      <Ic n="more" s={22} w={3} />
    </div>
  </div>
);

export const ChatComposer: React.FC<{ text?: string; caret?: boolean; send?: boolean }> = ({ text, caret, send }) => (
  <div style={{ position: 'absolute', left: 12, right: 12, bottom: 44, height: 96, borderRadius: 20, background: M.surface, border: '1px solid #353537' }}>
    <div style={{ position: 'absolute', left: 16, top: 14, fontSize: 16, color: text ? M.text : '#8a8a8e' }}>
      {text || '随便问点什么吧'}{caret && <span style={{ display: 'inline-block', width: 2, height: 18, background: M.blue, marginLeft: 1, verticalAlign: 'middle' }} />}
    </div>
    <div style={{ position: 'absolute', left: 16, bottom: 12, display: 'flex', gap: 18 }}><Ic n="plus" s={20} c="#bbb" /><Ic n="hand" s={18} c="#bbb" /></div>
    <div style={{ position: 'absolute', right: 56, bottom: 18, fontSize: 13, color: '#8a8a8e' }}>Agent 2.1 中</div>
    <div style={{ position: 'absolute', right: 10, bottom: 8, width: 36, height: 36, borderRadius: 18, background: send ? '#fff' : '#555', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ic n="up" s={18} c={send ? '#000' : '#999'} w={2.4} /></div>
  </div>
);

export const Disclaimer = () => <div style={{ position: 'absolute', left: 0, bottom: 22, width: PW, textAlign: 'center', fontSize: 11.5, color: '#6b6b6f' }}>内容由小黑 AI 生成，仅供参考</div>;

export const Badge: React.FC<{ n: number; on?: number }> = ({ n, on = 0 }) => (
  <span style={{ display: 'inline-flex', width: 18, height: 18, borderRadius: 9, background: C.blue, color: '#fff', fontSize: 11, fontWeight: 700, alignItems: 'center', justifyContent: 'center', marginLeft: 4, verticalAlign: 'middle', boxShadow: on ? `0 0 0 ${4 * on}px rgba(74,142,249,.35)` : undefined }}>{n}</span>
);

/** 用于把 sp() 结果限制在 0–1 区间外的回弹值 */
export const spr = (t: number, at: number, damping = 15) => (t < at ? 0 : sp(t, at, { damping, mass: 0.8 }));
