import React from 'react';
import { C, Spinner, Tx, sp } from './lib';
import { useRes, useTr } from './i18n';

// OmniBox 网页端（深色）共用部件。坐标系 1920×1080，侧栏宽 300

export const SIDE_W = 300;
export const ROW_H = 40;
export const TREE_Y = 360;

export const Sidebar: React.FC<{ tab: number; children?: React.ReactNode; x?: number }> = ({ tab, children, x = 0 }) => {
  const tr = useTr(), res = useRes();
  return (
  <div style={{ position: 'absolute', left: x, top: 0, width: SIDE_W, height: 1080, background: C.side, borderRight: '1px solid #2a2a2a' }}>
    <div style={{ position: 'absolute', left: 24, top: 26, width: 30, height: 30, borderRadius: 8, background: '#3b3b3b', color: '#fff', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>X</div>
    <Tx x={64} y={28} s={19}>{res('space')} ⌄</Tx>
    {[
      ['🐱', tr('小黑', 'Xiaohei')],
      ['🔔', tr('通知', 'Notifications')],
      ['👥', tr('黑友社区', 'Xiaohei community')],
      ['🎁', tr('邀请有礼', 'Invite and earn')],
    ].map(([ic, name], i) => (
      <div key={name} style={{ position: 'absolute', left: 24, top: 86 + i * 44, display: 'flex', alignItems: 'center', gap: 12, color: i === 3 ? '#8AB4FF' : C.text, fontSize: 19 }}>
        <span style={{ fontSize: 17 }}>{ic}</span>
        {name}
        {i === 1 && <span style={{ background: '#E5484D', color: '#fff', borderRadius: 999, fontSize: 13, padding: '1px 7px' }}>3</span>}
      </div>
    ))}
    {/* 资源 | 对话 胶囊 */}
    <div style={{ position: 'absolute', left: 30, top: 284, width: 240, height: 42, borderRadius: 999, background: '#262626' }}>
      <div style={{ position: 'absolute', left: 4 + tab * 116, top: 4, width: 116, height: 34, borderRadius: 999, background: '#454545' }} />
      {[tr('资源', 'Resources'), tr('对话', 'Chats')].map((s, i) => (
        <div key={i} style={{ position: 'absolute', left: 4 + i * 116, top: 8, width: 116, textAlign: 'center', fontSize: 18, fontWeight: (i ? tab >= 0.5 : tab < 0.5) ? 700 : 400, color: C.text }}>{s}</div>
      ))}
    </div>
    {children}
  </div>
  );
};

/** 资源行 */
export const Row: React.FC<{ y: number; text: string; icon?: string; o?: number; dx?: number; s?: number; right?: React.ReactNode; indent?: number; hl?: boolean }> = ({
  y, text, icon = '📄', o = 1, dx = 0, s = 1, right, indent = 0, hl,
}) => (
  <div style={{ position: 'absolute', left: 16 + indent, top: y, width: 268 - indent, height: ROW_H - 6, borderRadius: 8, background: hl ? '#333' : undefined, display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 10, boxSizing: 'border-box', opacity: o, transform: `translateX(${dx}px) scale(${s})`, transformOrigin: 'left center', color: C.text, fontSize: 17 }}>
    <span style={{ fontSize: 15 }}>{icon}</span>
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
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 18, background: C.comp, border: '1px solid #3a3a3a', boxSizing: 'border-box' }}>
    <Tx x={22} y={20} s={20} c={C.muted} style={{ opacity: ph }}>{tr('随便问点什么吧', 'Ask anything')}</Tx>
    <Tx x={22} y={20} s={20}>
      {text}
      {caret && <span style={{ display: 'inline-block', width: 2, height: 22, background: '#fff', marginLeft: 2, verticalAlign: 'middle' }} />}
    </Tx>
    <div style={{ position: 'absolute', left: 20, bottom: 16, display: 'flex', gap: 18, alignItems: 'center', color: C.muted, fontSize: 16 }}>
      <span style={{ fontSize: 24 }}>＋</span>
      <span>{tr('✋ 手动确认 ⌄', '✋ Manual confirmation ⌄')}</span>
      {think !== undefined && (
        <span style={{ padding: '4px 12px', borderRadius: 999, border: `1px solid ${think > 0.5 ? C.blue : '#555'}`, color: think > 0.5 ? '#8AB4FF' : C.muted, background: think > 0.5 ? '#4A8EF922' : undefined }}>{tr('💡 深度思考', '💡 Deep thinking')}</span>
      )}
      {mode !== undefined && (
        <span style={{ position: 'relative', display: 'inline-flex', borderRadius: 999, background: '#262626', padding: 3 }}>
          <span style={{ position: 'absolute', left: 3 + mode * 58, top: 3, width: 58, height: 26, borderRadius: 999, background: '#4a4a4a' }} />
          <span style={{ position: 'relative', width: 58, textAlign: 'center', color: '#fff' }}>{tr('问答', 'Ask')}</span>
          <span style={{ position: 'relative', width: 58, textAlign: 'center', color: '#fff' }}>{tr('写作', 'Write')}</span>
        </span>
      )}
    </div>
    <div style={{ position: 'absolute', right: 70, bottom: 20, color: C.muted, fontSize: 16 }}>{agent ?? tr('Agent 2.1 中', 'Agent 2.1 Medium')}</div>
    <div style={{ position: 'absolute', right: 16, bottom: 12, width: 40, height: 40, borderRadius: '50%', background: send > 0.5 ? '#fff' : '#555', color: send > 0.5 ? '#000' : '#999', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700 }}>↑</div>
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
  const btn = (s: string) => <span style={{ border: '1px solid #444', borderRadius: 8, padding: '6px 12px', fontSize: 15, color: C.text }}>{s}</span>;
  return (
    <>
      {card(0, (
        <>
          <div style={{ color: '#fff', fontSize: 22, fontWeight: 700 }}>{tr('上传文档', 'Upload documents')}</div>
          <div style={{ color: '#fff', fontSize: 17, marginTop: 8, fontWeight: 600 }}>{tr('让知识为你所用', 'Put your knowledge to work')}</div>
          <div style={{ color: C.muted, fontSize: 15, marginTop: 6 }}>{tr('支持文档、网页、音频和视频等多种类型', 'Supports documents, webpages, audio, video, and more')}</div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>{btn(tr('本地上传', 'Local upload'))}{btn(tr('微信助手', 'WeChat assistant'))}{btn(tr('安装插件', 'Install extension'))}</div>
        </>
      ))}
      {card(1, (
        <>
          <div style={{ color: '#fff', fontSize: 22, fontWeight: 700 }}>{tr('最近更新', 'Recently updated')}</div>
          {[res('monthly'), res('docker')].map((s, i) => (
            <div key={s} style={{ marginTop: i ? 10 : 18, color: C.text, fontSize: 16 }}>📕 {s}<div style={{ color: C.muted, fontSize: 13 }}>{tr('4 天前更新', 'Updated 4 days ago')}</div></div>
          ))}
        </>
      ))}
    </>
  );
};
