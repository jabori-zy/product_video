import React from 'react';
import { C, Cat, Logo, Spinner, Tx, W, H, sp } from './lib';
import { useRes, useTr } from './i18n';

// OmniBox 网页端（深色）共用部件。坐标系 1920×1080，侧栏宽 300
// 按真实网页还原（ego-browser 登录 test.omnibox.pro 截图对照）：侧栏透明压在页面底色上，主区是内缩 8 px 的圆角面板；
// 图标是 lucide 风格线性图标（网页端用 lucide-react），不用 emoji

export const SIDE_W = 300;
export const ROW_H = 40;
export const TREE_Y = 360;
/** 主区面板：侧栏右侧，上下右内缩 8 px，圆角 16 */
export const PANEL = { x: SIDE_W, y: 8, w: W - SIDE_W - 8, h: H - 16, r: 16 };

// ---------- 图标 ----------
type IP = { size?: number; color?: string; sw?: number; style?: React.CSSProperties };
const Lu: React.FC<IP & { children: React.ReactNode }> = ({ size = 20, color = C.text, sw = 1.8, style, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flexShrink: 0, ...style }}>{children}</svg>
);
export const OI = {
  bell: (p: IP) => <Lu {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></Lu>,
  users: (p: IP) => <Lu {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></Lu>,
  gift: (p: IP) => <Lu {...p}><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" /><path d="M7.5 8a2.5 2.5 0 0 1 0-5C9.5 3 12 8 12 8s2.5-5 4.5-5a2.5 2.5 0 0 1 0 5" /></Lu>,
  search: (p: IP) => <Lu {...p}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></Lu>,
  locate: (p: IP) => <Lu {...p}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3" /></Lu>,
  refresh: (p: IP) => <Lu {...p}><path d="M21 12a9 9 0 1 1-9-9c2.5 0 4.9 1 6.7 2.7L21 8" /><path d="M21 3v5h-5" /></Lu>,
  sort: (p: IP) => <Lu {...p}><path d="M3 6h18M3 12h12M3 18h7" /><path d="m15 18 2 2 4-4" /></Lu>,
  panel: (p: IP) => <Lu {...p}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18" /></Lu>,
  plus: (p: IP) => <Lu {...p}><path d="M12 5v14M5 12h14" /></Lu>,
  chat: (p: IP) => <Lu {...p}><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" /></Lu>,
  chatPlus: (p: IP) => <Lu {...p}><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" /><path d="M8 12h8M12 8v8" /></Lu>,
  help: (p: IP) => <Lu {...p}><circle cx="12" cy="12" r="10" /><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01" /></Lu>,
  discord: (p: IP) => <Lu {...p}><path d="M8 7.5a14 14 0 0 1 8 0M8 16.5a14 14 0 0 0 8 0" /><path d="M6.5 6.5C4.5 9 3.5 12 3.5 16c1.5 1.5 3.5 2.5 5 2.5l1-2M17.5 6.5c2 2.5 3 5.5 3 9.5-1.5 1.5-3.5 2.5-5 2.5l-1-2" /><circle cx="9.5" cy="12.5" r="1" /><circle cx="14.5" cy="12.5" r="1" /></Lu>,
  wechat: (p: IP) => <Lu {...p}><path d="M9.5 4C5.4 4 2 6.7 2 10c0 1.9 1.1 3.6 2.8 4.7L4.3 17l2.6-1.4c.8.2 1.7.4 2.6.4" /><path d="M15.5 9c3.6 0 6.5 2.3 6.5 5.2 0 1.6-.9 3-2.3 4l.4 1.8-2.1-1.1c-.8.2-1.6.3-2.5.3-3.6 0-6.5-2.3-6.5-5S11.9 9 15.5 9z" /></Lu>,
  arrowUp: (p: IP) => <Lu {...p}><path d="m5 12 7-7 7 7M12 19V5" /></Lu>,
  file: (p: IP) => <Lu {...p}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" /><path d="M14 2v4a2 2 0 0 0 2 2h4M10 9H8M16 13H8M16 17H8" /></Lu>,
  globe: (p: IP) => <Lu {...p}><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20" /></Lu>,
  folder: (p: IP) => <Lu {...p}><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.7-.9l-.8-1.2A2 2 0 0 0 7.9 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z" /></Lu>,
  hand: (p: IP) => <Lu {...p}><path d="M18 11V6a2 2 0 0 0-4 0M14 10V4a2 2 0 0 0-4 0v2M10 10.5V6a2 2 0 0 0-4 0v8" /><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.9-5.9-2.4L2.5 16a2 2 0 0 1 3-2.6L7 15" /></Lu>,
  down: (p: IP) => <Lu {...p}><path d="m6 9 6 6 6-6" /></Lu>,
  up: (p: IP) => <Lu {...p}><path d="m18 15-6-6-6 6" /></Lu>,
  right: (p: IP) => <Lu {...p}><path d="m9 18 6-6-6-6" /></Lu>,
  forward: (p: IP) => <Lu {...p}><path d="m15 14 5-5-5-5" /><path d="M4 20v-7a4 4 0 0 1 4-4h12" /></Lu>,
  copy: (p: IP) => <Lu {...p}><rect x="8" y="8" width="14" height="14" rx="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></Lu>,
  save: (p: IP) => <Lu {...p}><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" /><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7M7 3v4a1 1 0 0 0 1 1h7" /></Lu>,
  fileUp: (p: IP) => <Lu {...p}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" /><path d="M12 12v6M15 15l-3-3-3 3" /></Lu>,
  puzzle: (p: IP) => <Lu {...p}><path d="M15.4 2.6a1 1 0 0 0-1.4 0l-1.6 1.6a2.4 2.4 0 1 1-3.4 3.4L7.4 9.2a1 1 0 0 0 0 1.4l1.6 1.6a2.4 2.4 0 1 0 3.4 3.4l1.6 1.6a1 1 0 0 0 1.4 0l1.6-1.6a2.4 2.4 0 1 1 3.4-3.4l1.6-1.6a1 1 0 0 0 0-1.4z" /></Lu>,
  history: (p: IP) => <Lu {...p}><path d="M3 12a9 9 0 1 0 9-9 9.8 9.8 0 0 0-6.7 2.7L3 8" /><path d="M3 3v5h5M12 7v5l4 2" /></Lu>,
  more: (p: IP) => <Lu {...p}><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></Lu>,
  close: (p: IP) => <Lu {...p}><path d="M18 6 6 18M6 6l12 12" /></Lu>,
};

/** 文件类型图标（真实网页：文档灰线框、图片红底、音频紫底、网页蓝色地球）；参数沿用旧的 emoji 写法 */
export const ResIcon: React.FC<{ icon: string; size?: number }> = ({ icon, size = 20 }) => {
  const tile = (bg: string, inner: React.ReactNode) => (
    <div style={{ width: size, height: size, borderRadius: size * 0.22, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{inner}</div>
  );
  const s = size * 0.72;
  switch (icon) {
    case '🌐': return <OI.globe size={size} color="#5B8DEF" />;
    case '📕': return tile('#E5484D', <span style={{ color: '#fff', fontSize: size * 0.34, fontWeight: 800, letterSpacing: -0.3 }}>PDF</span>);
    case '🖼': return tile('#E5484D', <Lu size={s} color="#fff" sw={2.2}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" /></Lu>);
    case '🎙': return tile('#6366F1', <Lu size={s} color="#fff" sw={2.2}><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></Lu>);
    case '🎬': return tile('#8B5CF6', <Lu size={s} color="#fff" sw={2.2}><path d="m16 13 5.2 3.5a.5.5 0 0 0 .8-.4V7.9a.5.5 0 0 0-.8-.4L16 11" /><rect x="2" y="6" width="14" height="12" rx="2" /></Lu>);
    case '💬': return <OI.chat size={size} color={C.text} />;
    case '📁': return <OI.folder size={size} color={C.text} />;
    case '📄': case '📝': return <OI.file size={size} color={C.text} />;
    default: return <span style={{ fontSize: size * 0.8 }}>{icon}</span>;
  }
};

/** 页面底色 + 主区面板（D / E 用；A 用 PanelFrame 在侧栏滑入时套出面板边） */
export const AppShell: React.FC = () => (
  <>
    <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, background: C.side }} />
    <div style={{ position: 'absolute', left: PANEL.x, top: PANEL.y, width: PANEL.w, height: PANEL.h, borderRadius: PANEL.r, background: C.main }} />
  </>
);
/** 只画面板外圈的页面底色（中间透明），叠在已有内容上 */
export const PanelFrame: React.FC<{ o?: number }> = ({ o = 1 }) => (
  <div style={{ position: 'absolute', left: PANEL.x, top: PANEL.y, width: PANEL.w, height: PANEL.h, borderRadius: PANEL.r, boxShadow: `0 0 0 400px ${C.side}`, opacity: o, pointerEvents: 'none' }} />
);

export const Sidebar: React.FC<{ tab: number; children?: React.ReactNode; x?: number }> = ({ tab, children, x = 0 }) => {
  const tr = useTr(), res = useRes();
  const nav: [React.ReactNode, string][] = [
    [<Logo key="l" size={22} style={{ borderRadius: 5 }} />, tr('小黑', 'Xiaohei')],
    [<OI.bell key="b" size={20} />, tr('通知', 'Notifications')],
    [<OI.users key="u" size={20} />, tr('黑友社区', 'Xiaohei community')],
    [<OI.gift key="g" size={20} color="#5B8DEF" />, tr('邀请有礼', 'Invite and earn')],
  ];
  const tools = (items: (keyof typeof OI)[], o: number) => (
    <div style={{ position: 'absolute', right: 22, top: 334, display: 'flex', gap: 12, opacity: o }}>
      {items.map((k) => { const I = OI[k]; return <I key={k} size={20} color={C.text} />; })}
    </div>
  );
  return (
  <div style={{ position: 'absolute', left: x, top: 0, width: SIDE_W, height: 1080, background: C.side }}>
    {/* 空间切换 + 收起侧栏 */}
    <div style={{ position: 'absolute', left: 18, top: 26, width: 30, height: 30, borderRadius: 8, background: '#3b3b3b', color: '#fff', fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{res('space').slice(0, 1).toUpperCase()}</div>
    <div style={{ position: 'absolute', left: 58, top: 28, display: 'flex', alignItems: 'center', gap: 6, color: C.text, fontSize: 19, fontWeight: 500 }}>{res('space')}<OI.down size={16} color={C.muted} /></div>
    <div style={{ position: 'absolute', right: 18, top: 31 }}><OI.panel size={20} color={C.muted} /></div>
    {nav.map(([ic, name], i) => (
      <div key={name} style={{ position: 'absolute', left: 10, top: 78 + i * 42, width: SIDE_W - 20, height: 38, borderRadius: 8, background: i === 0 ? '#2a2a2a' : undefined, display: 'flex', alignItems: 'center', gap: 12, paddingLeft: 12, boxSizing: 'border-box', color: C.text, fontSize: 18 }}>
        {ic}{name}
        {i === 1 && <span style={{ background: '#E5484D', color: '#fff', borderRadius: 999, fontSize: 13, padding: '1px 7px', lineHeight: '18px' }}>3</span>}
      </div>
    ))}
    {/* 资源 | 对话 胶囊 */}
    <div style={{ position: 'absolute', left: 30, top: 280, width: 240, height: 42, borderRadius: 999, background: '#1f1f1f', border: '1px solid #333', boxSizing: 'border-box' }}>
      <div style={{ position: 'absolute', left: 3 + tab * 116, top: 3, width: 116, height: 34, borderRadius: 999, background: '#333' }} />
      {[tr('资源', 'Resources'), tr('对话', 'Chats')].map((s, i) => (
        <div key={i} style={{ position: 'absolute', left: 3 + i * 116, top: 7, width: 116, textAlign: 'center', fontSize: 17, fontWeight: 600, color: (i ? tab >= 0.5 : tab < 0.5) ? '#fff' : '#bbb' }}>{s}</div>
      ))}
    </div>
    {/* 列表工具栏：资源（搜索、定位、刷新、排序）/ 对话（搜索、新对话） */}
    {tools(['search', 'locate', 'refresh', 'sort'], 1 - tab)}
    {tools(['search', 'chatPlus'], tab)}
    {children}
    {/* 底部：帮助、Discord、微信、升级 */}
    <div style={{ position: 'absolute', left: 36, top: 1030, display: 'flex', gap: 42, alignItems: 'center' }}>
      <OI.help size={22} color={C.muted} /><OI.discord size={22} color={C.muted} /><OI.wechat size={22} color={C.muted} />
      <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><OI.arrowUp size={14} color="#fff" sw={2.6} /></div>
    </div>
  </div>
  );
};

/** 资源行 */
export const Row: React.FC<{ y: number; text: string; icon?: string; o?: number; dx?: number; s?: number; right?: React.ReactNode; indent?: number; hl?: boolean }> = ({
  y, text, icon = '📄', o = 1, dx = 0, s = 1, right, indent = 0, hl,
}) => (
  <div style={{ position: 'absolute', left: 10 + indent, top: y, width: SIDE_W - 20 - indent, height: ROW_H - 4, borderRadius: 8, background: hl ? '#2e2e2e' : undefined, display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 22, boxSizing: 'border-box', opacity: o, transform: `translateX(${dx}px) scale(${s})`, transformOrigin: 'left center', color: C.text, fontSize: 17 }}>
    <ResIcon icon={icon} size={19} />
    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{text}</span>
    {right && <span style={{ marginRight: 10, display: 'flex', alignItems: 'center', gap: 6, color: C.muted, fontSize: 13 }}>{right}</span>}
  </div>
);

export const Parsing: React.FC<{ t: number; done: boolean }> = ({ t, done }) => {
  const tr = useTr();
  return done ? <span style={{ color: '#4ADE80' }}>✓</span> : (<><Spinner t={t} size={14} /> {tr('解析中', 'Parsing')}</>);
};

/** 聊天输入框（深色）。text 为空时显示占位 */
export const Composer: React.FC<{
  x: number; y: number; w: number; h?: number; text?: string; ph?: number; send?: number; mode?: number; think?: number; agent?: string; caret?: boolean;
}> = ({ x, y, w, h = 150, text = '', ph = 1, send = 0, mode, think, agent, caret }) => {
  const tr = useTr();
  return (
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 18, background: C.comp, boxSizing: 'border-box' }}>
    <Tx x={22} y={20} s={20} c={C.muted} style={{ opacity: ph }}>{tr('随便问点什么吧', 'Ask anything')}</Tx>
    <Tx x={22} y={20} s={20}>
      {text}
      {caret && <span style={{ display: 'inline-block', width: 2, height: 22, background: '#fff', marginLeft: 2, verticalAlign: 'middle' }} />}
    </Tx>
    <div style={{ position: 'absolute', left: 20, bottom: 18, display: 'flex', gap: 18, alignItems: 'center', color: C.muted, fontSize: 16 }}>
      <OI.plus size={22} color={C.muted} />
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><OI.hand size={18} color={C.muted} />{tr('手动确认', 'Manual confirmation')}<OI.down size={15} color={C.muted} /></span>
      {think !== undefined && (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 999, border: `1px solid ${think > 0.5 ? C.blue : '#555'}`, color: think > 0.5 ? '#8AB4FF' : C.muted, background: think > 0.5 ? '#4A8EF922' : undefined }}>
          <Lu size={15} color={think > 0.5 ? '#8AB4FF' : C.muted}><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5M9 18h6M10 22h4" /></Lu>
          {tr('深度思考', 'Deep thinking')}
        </span>
      )}
      {mode !== undefined && (
        <span style={{ position: 'relative', display: 'inline-flex', borderRadius: 999, background: '#262626', padding: 3 }}>
          <span style={{ position: 'absolute', left: 3 + mode * 58, top: 3, width: 58, height: 26, borderRadius: 999, background: '#4a4a4a' }} />
          <span style={{ position: 'relative', width: 58, textAlign: 'center', color: '#fff' }}>{tr('问答', 'Ask')}</span>
          <span style={{ position: 'relative', width: 58, textAlign: 'center', color: '#fff' }}>{tr('写作', 'Write')}</span>
        </span>
      )}
    </div>
    <div style={{ position: 'absolute', right: 70, bottom: 22, color: C.muted, fontSize: 16 }}>{agent ?? tr('Agent 2.1 中', 'Agent 2.1 Medium')}</div>
    <div style={{ position: 'absolute', right: 16, bottom: 12, width: 40, height: 40, borderRadius: '50%', background: send > 0.5 ? '#fff' : '#444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <OI.arrowUp size={20} color={send > 0.5 ? '#000' : '#888'} sw={2.4} />
    </div>
  </div>
  );
};

/** 聊天首页底部两张卡片 */
export const HomeCards: React.FC<{ x: number; y: number; w: number; t: number; a: number }> = ({ x, y, w, t, a }) => {
  const tr = useTr(), res = useRes();
  const cw = (w - 20) / 2;
  const card = (i: number, node: React.ReactNode) => {
    const p = sp(t, a + i * 0.1);
    return (
      <div style={{ position: 'absolute', left: x + i * (cw + 20), top: y + (1 - p) * 60, width: cw, height: 200, borderRadius: 16, background: '#2e2e2e', opacity: p, padding: 24, boxSizing: 'border-box' }}>{node}</div>
    );
  };
  const btn = (I: (p: IP) => React.ReactElement, color: string, s: string) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: '1px solid #444', borderRadius: 8, padding: '6px 12px', fontSize: 15, color: C.text, whiteSpace: 'nowrap' }}><I size={16} color={color} />{s}</span>
  );
  return (
    <>
      {card(0, (
        <>
          <div style={{ color: '#fff', fontSize: 22, fontWeight: 700 }}>{tr('上传文档', 'Upload documents')}</div>
          <div style={{ color: '#fff', fontSize: 17, marginTop: 8, fontWeight: 600 }}>{tr('让知识为你所用', 'Put your knowledge to work')}</div>
          <div style={{ color: C.muted, fontSize: 15, marginTop: 6 }}>{tr('支持文档、网页、音频和视频等多种类型', 'Supports documents, webpages, audio, video, and more')}</div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>{btn(OI.fileUp, '#E5484D', tr('本地上传', 'Local upload'))}{btn(OI.chat, '#22C55E', tr('微信助手', 'WeChat assistant'))}{btn(OI.puzzle, '#5B8DEF', tr('安装插件', 'Install extension'))}</div>
        </>
      ))}
      {card(1, (
        <>
          <div style={{ color: '#fff', fontSize: 22, fontWeight: 700 }}>{tr('最近更新', 'Recently updated')}</div>
          {[res('monthly'), res('docker')].map((s, i) => (
            <div key={s} style={{ marginTop: i ? 12 : 18, display: 'flex', alignItems: 'center', gap: 10, color: C.text, fontSize: 16 }}>
              <ResIcon icon="📕" size={18} />
              <div style={{ flex: 1, minWidth: 0 }}><div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s}</div><div style={{ color: C.muted, fontSize: 13 }}>{tr('4 天前更新', 'Updated 4 days ago')}</div></div>
              <OI.right size={16} color={C.muted} />
            </div>
          ))}
        </>
      ))}
    </>
  );
};

/** 完整网页（侧栏资源树 + 聊天首页），笔记本浏览器里用；rows = [图标, 资源名] */
/** homeO：首页内容（问候、小黑、输入框、卡片）的不透明度；0 时只剩侧栏 + 空主区，与原片 D 开场一致 */
export const WebHome: React.FC<{ rows: [string, string][]; blink?: number; homeO?: number }> = ({ rows, blink = 0, homeO = 1 }) => {
  const tr = useTr();
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <AppShell />
      <Sidebar tab={0}>
        <Tx x={26} y={340} s={15} c={C.muted}>{tr('个人 ⌄', 'Personal ⌄')}</Tx>
        {rows.map(([ic, name], i) => <Row key={name} y={376 + i * 40} icon={ic} text={name} />)}
      </Sidebar>
      <div style={{ position: 'absolute', inset: 0, opacity: homeO, transform: `translateY(${(1 - homeO) * 24}px)` }}>
      <div style={{ position: 'absolute', left: 300, top: 300, width: 1620, textAlign: 'center', color: '#fff', fontSize: 34, fontWeight: 600 }}>{tr('晚上好，今天有什么可以帮您的吗？', 'Good evening. How can I help you today?')}</div>
      <div style={{ position: 'absolute', left: 690, top: 455 }}><Cat w={120} fill={C.main} blink={blink} look={0.3} lookY={0.4} /></div>
      <div style={{ position: 'absolute', left: 830, top: 470, padding: '10px 22px', borderRadius: 999, background: '#383838', color: '#cfcfcf', fontSize: 18 }}>{tr('列出包含"会议"标签的所有资源', 'List all resources tagged "meeting"')}</div>
      <Composer x={630} y={560} w={960} />
      <HomeCards x={630} y={850} w={960} t={1} a={-1} />
      </div>
    </div>
  );
};
