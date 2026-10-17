import React from 'react';
import type { Content } from '../data/content';
import { FONT } from '../fonts';
import { C, Cat, Logo } from '../lib';
import { PersonAvatar } from './icons';
import { StatusIcons } from './phone';
import { useRes } from '../i18n';
import { WebHome } from '../ui';
import type { ResKey } from '../copy';
import { BottomBar, ChatHistoryList, ContentTabs, HOME, HomeComposer, HomeHeader, M, PH, PW, ResLabel, ResRow, ResToolbar, StatusBar, rowCenter } from '../mobile/ui';

// G 设备阵列：六块屏幕，尺寸与线框一致；每块都有小黑的眼睛（全片母题）
const Shell: React.FC<{ w: number; h: number; r?: number; bg?: string; fg?: string; children: React.ReactNode }> = ({ w, h, r = 16, bg = '#1c1c1e', fg = C.text, children }) => (
  <div style={{ width: w, height: h, borderRadius: r, background: bg, border: '2px solid #3a3a3c', boxSizing: 'border-box', overflow: 'hidden', position: 'relative', fontFamily: FONT, color: fg }}>{children}</div>
);
const Dots = () => (
  <div style={{ display: 'flex', gap: 5 }}>{['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />)}</div>
);

/** 浏览器 · OmniBox 网页 460×300 */
/** 网页 460×285：浏览器顶栏 + OmniBox 网页首页（与片中电脑上同一个 WebHome，1920×1080 等比缩放） */
const WEB_K = 460 / 1920, WEB_BAR = 26;
const WEB_ROWS: [string, ResKey][] = [['🌐', 'zhihuHome'], ['🌐', 'agentYear'], ['📕', 'q3'], ['🖼', 'board'], ['🎙', 'meeting'], ['🎬', 'rag'], ['📕', 'monthly'], ['📕', 'docker'], ['📝', 'weekly']];
const WebPage: React.FC = () => {
  const res = useRes();
  return <WebHome rows={WEB_ROWS.map(([ic, k]) => [ic, res(k)])} />;
};
export const DevWeb: React.FC<{ c: Content }> = () => (
  <Shell w={460} h={WEB_BAR + Math.round(1080 * WEB_K)} bg="#fff">
    <div style={{ height: WEB_BAR, background: '#EDEDEF', borderBottom: '1px solid #DDDDE0', display: 'flex', alignItems: 'center', padding: '0 10px', gap: 10, boxSizing: 'border-box' }}>
      <Dots /><div style={{ flex: 1, height: 16, borderRadius: 8, background: '#fff', fontSize: 9, color: '#666', lineHeight: '16px', paddingLeft: 8 }}>omnibox.pro</div>
    </div>
    <div style={{ position: 'absolute', left: 0, top: WEB_BAR, width: 1920, height: 1080, transform: `scale(${WEB_K})`, transformOrigin: '0 0' }}><WebPage /></div>
  </Shell>
);

/** 浏览器插件 200×250 */
/** 浏览器插件弹窗：按截图 assets/broswer_plugin.png（292×198 像素）1:1，坐标就是截图像素。
 *  ExtPopup 只画弹窗内容（不含外框）：B 段在浏览器里原尺寸用（主按钮由 B 段自己画，要变形成加载 / toast），G 段设备阵列缩放后用 */
export const EXT_W = 292, EXT_H = 198;
/** 主按钮「保存到小黑」在弹窗里的位置 */
export const EXT_BTN = { x: 18, y: 55, w: 256, h: 39, r: 8, bg: '#111827' };
export const EXT_SAVE_ICON = 'M3 7h18v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1zM3 7l2-4h14l2 4M9 13l3 3 3-3M12 10v6';
export const ExtIc: React.FC<{ d: string; s?: number; c?: string; w?: number }> = ({ d, s = 15, c = '#9CA3AF', w = 1.8 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flexShrink: 0 }}><path d={d} /></svg>
);
export const ExtPopup: React.FC<{ d: Content['devices']['ext']; button?: boolean }> = ({ d, button = true }) => (
  <div style={{ position: 'absolute', left: 0, top: 0, width: EXT_W, height: EXT_H, color: '#111827', fontFamily: FONT }}>
    {/* 顶栏：logo + 小黑 · 首页 / 反馈 / 设置 */}
    <div style={{ position: 'absolute', left: 18, top: 18, height: 18, display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600 }}><Logo size={17} style={{ borderRadius: 4 }} />{d.name}</div>
    <div style={{ position: 'absolute', right: 20, top: 19, display: 'flex', gap: 18 }}>
      <ExtIc d="M3 10l9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
      <ExtIc d="M21 12a8 8 0 0 1-11.8 7L3 21l2-6A8 8 0 1 1 21 12zM12 8v4M12 16h.01" />
      <ExtIc d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 3 14H3a2 2 0 0 1 0-4h.1A1.7 1.7 0 0 0 4.6 7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 10 3V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.7 1.7 0 0 0 21 10h.1a2 2 0 0 1 0 4z" />
    </div>
    {/* 主按钮：保存到小黑 */}
    {button && (
      <div style={{ position: 'absolute', left: EXT_BTN.x, top: EXT_BTN.y, width: EXT_BTN.w, height: EXT_BTN.h, borderRadius: EXT_BTN.r, background: EXT_BTN.bg, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 14, fontWeight: 600 }}>
        <ExtIc d={EXT_SAVE_ICON} s={16} c="#fff" w={2} />{d.save}
      </div>
    )}
    {/* 保存到 个人 ⌄ */}
    <div style={{ position: 'absolute', left: 18, top: 116, height: 20, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
      <span style={{ color: '#6478A8' }}>{d.to}</span><span style={{ fontSize: 14, fontWeight: 600 }}>{d.space}</span><ExtIc d="M6 9l6 6 6-6" s={14} c="#111827" w={2.2} />
    </div>
    <div style={{ position: 'absolute', left: 18, right: 18, top: 148, height: 1, background: '#F1F2F4' }} />
    {/* 指定区域 · 按住 ⌥ · 开关 */}
    <div style={{ position: 'absolute', left: 18, top: 159, height: 20, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#374151' }}>
      <ExtIc d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M9 12h6" s={16} c="#4B5563" />{d.area}
    </div>
    <div style={{ position: 'absolute', right: 22, top: 160, height: 18, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9CA3AF' }}>
      {d.hold}<span style={{ width: 18, height: 18, borderRadius: 4, background: '#E8EDF7', color: '#5B6E9A', fontSize: 11, lineHeight: '18px', textAlign: 'center' }}>⌥</span>
      <span style={{ position: 'relative', width: 30, height: 16, borderRadius: 8, background: '#E5E7EB', marginLeft: 4 }}><span style={{ position: 'absolute', left: 2, top: 2, width: 12, height: 12, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,.15)' }} /></span>
    </div>
  </div>
);
/** G 设备阵列里的插件 260×176 */
export const DevExt: React.FC<{ c: Content }> = ({ c: { devices: { ext: d } } }) => (
  <div style={{ width: 260, height: 176, borderRadius: 12, background: '#fff', overflow: 'hidden', position: 'relative', boxShadow: '0 0 0 1px rgba(0,0,0,.06)' }}>
    <div style={{ position: 'absolute', left: 0, top: 0, width: EXT_W, height: EXT_H, transform: `scale(${260 / EXT_W})`, transformOrigin: '0 0' }}><ExtPopup d={d} /></div>
  </div>
);

/** 手机 App 首页（与 M1 / M2 的手机端同一套组件，按真机截图还原），390×844 整体缩放进设备卡片。
 *  iOS：灵动岛 + 「对话」tab（对话历史）；Android：打孔摄像头 + 「资源」tab（资源列表） */
const APP_RES: [string, ResKey][] = [['🌐', 'zhihuHome'], ['📝', 'weekly'], ['🎙', 'meeting'], ['🖼', 'board'], ['📕', 'monthly'], ['📕', 'docker']];
const AppHome: React.FC<{ os: 'ios' | 'android' }> = ({ os }) => {
  const res = useRes();
  const chats = os === 'ios';
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: PW, height: PH, background: M.bg, color: M.text, fontFamily: FONT, overflow: 'hidden' }}>
      <HomeHeader />
      <HomeComposer />
      <ContentTabs p={chats ? 1 : 0} />
      <ResToolbar icons={chats ? ['search', 'plus'] : undefined} />
      {chats ? <ChatHistoryList y={HOME.labelY - 9} /> : (
        <>
          <ResLabel />
          {APP_RES.map(([ic, k], i) => <ResRow key={k} y={rowCenter(i)} icon={ic} text={res(k)} />)}
        </>
      )}
      <BottomBar t={0} />
      {chats ? <StatusBar /> : (
        // Android：时间靠左、图标靠右，屏幕上沿正中一个打孔摄像头
        <>
          <div style={{ position: 'absolute', left: 0, top: 0, width: PW, height: 46, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 26px 0 28px', boxSizing: 'border-box', fontSize: 15, fontWeight: 600 }}>
            <span>21:06</span><StatusIcons color={M.text} s={1.05} />
          </div>
          <div style={{ position: 'absolute', left: PW / 2 - 9, top: 16, width: 18, height: 18, borderRadius: 9, background: '#000' }} />
        </>
      )}
    </div>
  );
};
const APP_K = 170 / PW;
const DevApp: React.FC<{ os: 'ios' | 'android' }> = ({ os }) => (
  <Shell w={170} h={Math.round(PH * APP_K)} r={os === 'ios' ? 30 : 24} bg={M.bg} fg={M.text}>
    <div style={{ position: 'absolute', left: 0, top: 0, width: PW, height: PH, transform: `scale(${APP_K})`, transformOrigin: '0 0' }}><AppHome os={os} /></div>
  </Shell>
);
/** iPhone App 170×368：首页「对话」tab */
export const DevIos: React.FC<{ c: Content }> = () => <DevApp os="ios" />;
/** Android 170×368：首页「资源」tab */
export const DevAndroid: React.FC<{ c: Content }> = () => <DevApp os="android" />;

// ---------- 聊天 App：微信 / QQ / Telegram 里和小黑机器人的对话（按 assets/screenshot/wechat.PNG、qq.PNG、telegram.PNG 还原） ----------
// 都画成 390×844 的手机整屏（与 iOS / Android 卡片同一套缩放），截图 1284×2778 @3x ≈ 428 pt 宽，换算 × 390/428
const PhoneFrame: React.FC<{ bg: string; children: React.ReactNode }> = ({ bg, children }) => (
  <Shell w={170} h={Math.round(PH * APP_K)} r={30} bg={bg}>
    <div style={{ position: 'absolute', left: 0, top: 0, width: PW, height: PH, transform: `scale(${APP_K})`, transformOrigin: '0 0', fontFamily: FONT, overflow: 'hidden', background: bg, color: '#111' }}>{children}</div>
  </Shell>
);
/** iOS 状态栏（颜色可换：微信深色用白字） */
const IosStatus: React.FC<{ color: string; time?: string }> = ({ color, time = '21:06' }) => (
  <>
    <div style={{ position: 'absolute', left: 0, top: 0, width: PW, height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 34px 0 40px', boxSizing: 'border-box', fontSize: 16, fontWeight: 600, color }}>
      <span>{time}</span><StatusIcons color={color} s={1.1} />
    </div>
    <div style={{ position: 'absolute', left: PW / 2 - 62, top: 11, width: 124, height: 36, borderRadius: 18, background: '#000' }} />
  </>
);
const Glyph24: React.FC<{ d: string; s?: number; c: string; w?: number }> = ({ d, s = 24, c, w = 1.8 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flexShrink: 0 }}><path d={d} /></svg>
);
const G = {
  back: 'M15 5l-7 7 7 7', more: 'M5 12h.01M12 12h.01M19 12h.01', menu: 'M4 7h16M4 12h16M4 17h16', plusC: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 8v8M8 12h8',
  smile: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01', voice: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM9.5 9.5a3.5 3.5 0 0 1 0 5M12.5 7.5a6.5 6.5 0 0 1 0 9',
  mic: 'M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM19 11a7 7 0 0 1-14 0M12 18v3', image: 'M4 5h16v14H4zM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM20 15l-5-5L5 19',
  camera: 'M4 8h3l2-3h6l2 3h3v11H4zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', clip: 'M21 11l-8.5 8.5a5 5 0 0 1-7-7L14 4a3.5 3.5 0 0 1 5 5l-8.5 8.5a2 2 0 0 1-3-3L15 7',
  sticker: 'M12 22a10 10 0 1 1 10-10M22 12a10 10 0 0 1-10 10c0-5.5 4.5-10 10-10z', hash: 'M5 9h14M5 15h14M10 3L8 21M16 3l-2 18', check2: 'M2 12l5 5L17 7M9 17l1 1L22 6',
};

/** 微信（深色）：顶栏标题居中 + 分隔线；绿色发出气泡（深色字）、深灰收到气泡；圆角方头像；居中灰色时间；底栏 语音 · 「按住 说话」· 表情 · 加号 */
export const DevWechat: React.FC<{ c: Content }> = ({ c: { devices: { wechat: d } } }) => {
  const W = { bg: '#111111', bar: '#1E1E1E', line: '#262626', me: '#3EB575', other: '#2C2C2C', fg: '#E8E8E8', sub: '#7A7A7A' };
  return (
    <PhoneFrame bg={W.bg}>
      <IosStatus color="#fff" />
      <div style={{ position: 'absolute', left: 0, top: 54, width: PW, height: 30, borderBottom: `1px solid ${W.line}`, paddingBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EDEDED', fontSize: 16.5, fontWeight: 500 }}>
        <div style={{ position: 'absolute', left: 12 }}><Glyph24 d={G.back} s={22} c="#EDEDED" /></div>{d.title}<div style={{ position: 'absolute', right: 14 }}><Glyph24 d={G.more} s={24} c="#EDEDED" w={3} /></div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center', fontSize: 12.5, color: W.sub }}>星期五 20:01</div>
      <div style={{ position: 'absolute', left: 10, right: 10, top: 150 }}>
        {d.msgs.map(([me, t], i) => (
          <div key={i} style={{ display: 'flex', justifyContent: me ? 'flex-end' : 'flex-start', gap: 10, marginTop: 16, alignItems: 'flex-start' }}>
            {!me && <Logo size={38} style={{ borderRadius: 5 }} />}
            <div style={{ maxWidth: 240, padding: '9px 12px', borderRadius: 5, background: me ? W.me : W.other, color: me ? '#0B0B0B' : W.fg, fontSize: 15, lineHeight: 1.45 }}>{t}</div>
            {me && <PersonAvatar size={38} bg="#C4B5FD" radius={5} />}
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 0, bottom: 0, width: PW, height: 86, background: W.bar, borderTop: `1px solid ${W.line}`, display: 'flex', alignItems: 'flex-start', gap: 10, padding: '9px 10px 0', boxSizing: 'border-box' }}>
        <Glyph24 d={G.voice} s={28} c="#D6D6D6" w={1.5} />
        <div style={{ flex: 1, height: 36, borderRadius: 6, background: '#2C2C2C', color: '#8A8A8A', fontSize: 14.5, lineHeight: '36px', textAlign: 'center', marginTop: -4 }}>可按住 转文字</div>
        <Glyph24 d={G.smile} s={28} c="#D6D6D6" w={1.5} /><Glyph24 d={G.plusC} s={28} c="#D6D6D6" w={1.5} />
      </div>
    </PhoneFrame>
  );
};

/** QQ（浅色）：顶栏 ‹ 标题 ☰；浅灰底；收到的消息上方有等级标签 + 昵称，白色圆角气泡；发出的蓝色气泡；圆头像；底部白色输入框 + 一排工具图标 */
export const DevQQ: React.FC<{ c: Content }> = ({ c: { devices: { qq: d } } }) => {
  const Q = { bg: '#F2F3F5', me: '#0099FF', sub: '#8E8E93' };
  return (
    <PhoneFrame bg={Q.bg}>
      <IosStatus color="#000" />
      <div style={{ position: 'absolute', left: 0, top: 54, width: PW, height: 30, paddingBottom: 12, borderBottom: '1px solid #E3E4E8', display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px 12px', boxSizing: 'content-box', color: '#111', fontSize: 16.5, fontWeight: 500 }}>
        <Glyph24 d={G.back} s={22} c="#111" /><span>{d.title}</span><div style={{ marginLeft: 'auto', marginRight: 28 }}><Glyph24 d={G.menu} s={22} c="#111" /></div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 112, textAlign: 'center', fontSize: 12.5, color: Q.sub }}>周二 14:18</div>
      <div style={{ position: 'absolute', left: 10, right: 12, top: 132 }}>
        {d.msgs.map(([me, t], i) => (
          <div key={i} style={{ display: 'flex', justifyContent: me ? 'flex-end' : 'flex-start', gap: 9, marginTop: 14, alignItems: 'flex-start' }}>
            {!me && <Logo size={36} style={{ borderRadius: '50%' }} />}
            <div style={{ maxWidth: 250 }}>
              {!me && <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4, fontSize: 11.5, color: Q.sub }}><span style={{ padding: '1px 5px', borderRadius: 4, background: '#5AD2B8', color: '#fff', fontSize: 10 }}>LV99 机器人</span>{d.title}</div>}
              <div style={{ padding: '9px 13px', borderRadius: 12, background: me ? Q.me : '#fff', color: me ? '#fff' : '#111', fontSize: 15, lineHeight: 1.45 }}>{t}</div>
            </div>
            {me && <PersonAvatar size={36} bg="#93C5FD" />}
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 0, bottom: 0, width: PW, height: 110, background: '#F7F7F9' }}>
        <div style={{ position: 'absolute', left: 14, right: 14, top: 8, height: 36, borderRadius: 8, background: '#fff' }} />
        <div style={{ position: 'absolute', left: 22, right: 22, top: 56, display: 'flex', justifyContent: 'space-between' }}>
          {[G.mic, G.image, G.camera, G.sticker, G.smile, G.plusC].map((p, i) => <Glyph24 key={i} d={p} s={23} c="#222" w={1.6} />)}
        </div>
      </div>
    </PhoneFrame>
  );
};

/** Telegram（浅色）：绿色花纹壁纸；顶部悬浮胶囊（返回 · 名字 / 机器人 · 头像）；白色气泡左下尾巴、时间在气泡内右下；发出的浅绿气泡带已读双勾；底部 回形针 · 「输入消息」· 麦克风 */
export const DevTelegram: React.FC<{ c: Content }> = ({ c: { devices: { telegram: d } } }) => {
  const pill = { background: 'rgba(255,255,255,.62)', boxShadow: '0 1px 6px rgba(0,0,0,.08)', backdropFilter: 'blur(8px)' } as const;
  return (
    <PhoneFrame bg="#C9DDB0">
      {/* 壁纸：黄绿渐变 + 淡色涂鸦点 */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #D7E6A7 0%, #B9D59B 45%, #8FBE8C 100%)' }} />
      <svg width={PW} height={PH} style={{ position: 'absolute', inset: 0, opacity: 0.09 }}>
        {Array.from({ length: 60 }).map((_, i) => <circle key={i} cx={(i * 97) % PW} cy={(i * 131) % PH} r={4 + (i % 5) * 2} fill="none" stroke="#2F5D2A" strokeWidth={1.5} />)}
      </svg>
      <IosStatus color="#000" />
      <div style={{ position: 'absolute', left: 14, top: 56, width: 40, height: 40, borderRadius: 20, ...pill, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Glyph24 d={G.back} s={22} c="#111" /></div>
      <div style={{ position: 'absolute', left: PW / 2 - 85, top: 56, width: 170, height: 40, borderRadius: 20, ...pill, textAlign: 'center' }}>
        <div style={{ fontSize: 15, fontWeight: 600, marginTop: 4 }}>{d.title}</div>
        <div style={{ fontSize: 11, color: '#6B7280' }}>{d.sub}</div>
      </div>
      <div style={{ position: 'absolute', right: 14, top: 56, width: 40, height: 40, borderRadius: 20, overflow: 'hidden' }}><Logo size={40} style={{ borderRadius: '50%' }} /></div>
      <div style={{ position: 'absolute', left: 10, right: 10, top: 120 }}>
        {d.msgs.map(([me, t], i) => (
          <div key={i} style={{ display: 'flex', justifyContent: me ? 'flex-end' : 'flex-start', gap: 8, marginTop: 10, alignItems: 'flex-end' }}>
            {!me && <Logo size={30} style={{ borderRadius: '50%' }} />}
            <div style={{ maxWidth: 260, padding: '7px 10px 6px 11px', borderRadius: 16, borderBottomLeftRadius: me ? 16 : 4, borderBottomRightRadius: me ? 4 : 16, background: me ? '#EFFDDE' : '#fff', fontSize: 15, lineHeight: 1.4, color: '#111', boxShadow: '0 1px 1px rgba(0,0,0,.08)' }}>
              {!me && <div style={{ fontSize: 13, fontWeight: 600, color: '#3B82C4' }}>{d.title}</div>}
              {t}
              <span style={{ marginLeft: 8, fontSize: 11, color: me ? '#4FAE4E' : '#9CA3AF', display: 'inline-flex', alignItems: 'center', gap: 2, verticalAlign: '-2px' }}>21:0{6 + i}{me && <Glyph24 d={G.check2} s={14} c="#4FAE4E" w={2} />}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 12, right: 12, bottom: 30, height: 44, display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 44, height: 44, borderRadius: 22, ...pill, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Glyph24 d={G.clip} s={22} c="#333" /></div>
        <div style={{ flex: 1, height: 44, borderRadius: 22, ...pill, display: 'flex', alignItems: 'center', padding: '0 14px', color: '#8E8E93', fontSize: 15 }}>输入消息<div style={{ marginLeft: 'auto' }}><Glyph24 d={G.sticker} s={20} c="#555" /></div></div>
        <div style={{ width: 44, height: 44, borderRadius: 22, ...pill, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Glyph24 d={G.mic} s={22} c="#333" /></div>
      </div>
    </PhoneFrame>
  );
};
