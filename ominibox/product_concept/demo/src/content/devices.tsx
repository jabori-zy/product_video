import React from 'react';
import type { Content } from '../data/content';
import { FONT } from '../fonts';
import { C, Cat, Logo } from '../lib';
import { PersonAvatar } from './icons';

// G 设备阵列：六块屏幕，尺寸与线框一致；每块都有小黑的眼睛（全片母题）
const Shell: React.FC<{ w: number; h: number; r?: number; bg?: string; children: React.ReactNode }> = ({ w, h, r = 16, bg = '#1c1c1e', children }) => (
  <div style={{ width: w, height: h, borderRadius: r, background: bg, border: '2px solid #3a3a3c', boxSizing: 'border-box', overflow: 'hidden', position: 'relative', fontFamily: FONT, color: C.text }}>{children}</div>
);
const Dots = () => (
  <div style={{ display: 'flex', gap: 5 }}>{['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />)}</div>
);
const Bubble: React.FC<{ me: boolean; s: string; meBg: string; otherBg: string; fg?: string; r?: number; meAv?: boolean }> = ({ me, s, meBg, otherBg, fg = '#111', r = 8, meAv }) => (
  <div style={{ display: 'flex', justifyContent: me ? 'flex-end' : 'flex-start', gap: 6, marginTop: 10, alignItems: 'flex-start' }}>
    {!me && <Logo size={22} style={{ borderRadius: meAv ? 3 : undefined }} />}
    <div style={{ maxWidth: 170, padding: '7px 10px', borderRadius: r, background: me ? meBg : otherBg, color: fg, fontSize: 12, lineHeight: 1.4 }}>{s}</div>
    {me && meAv && <PersonAvatar size={22} bg="#C4B5FD" radius={3} />}
  </div>
);

/** 浏览器 · OmniBox 网页 460×300 */
export const DevWeb: React.FC<{ c: Content }> = ({ c: { devices: { web: d } } }) => (
  <Shell w={460} h={300}>
    <div style={{ height: 26, background: '#2a2a2c', display: 'flex', alignItems: 'center', padding: '0 10px', gap: 10 }}>
      <Dots /><div style={{ flex: 1, height: 16, borderRadius: 8, background: '#1c1c1e', fontSize: 9, color: '#999', lineHeight: '16px', paddingLeft: 8 }}>omnibox.pro</div>
    </div>
    <div style={{ display: 'flex', height: 270, background: C.side }}>
      <div style={{ width: 120, background: C.side, padding: '10px 10px', boxSizing: 'border-box', fontSize: 10 }}>
        <div style={{ fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.space}</div>
        {d.nav.map((s) => <div key={s} style={{ marginTop: 8, color: '#ccc' }}>{s}</div>)}
        <div style={{ marginTop: 12, display: 'flex', borderRadius: 999, background: '#262626', padding: 2 }}>
          {d.tabs.map((s, i) => <div key={s} style={{ flex: 1, textAlign: 'center', borderRadius: 999, background: i ? '#454545' : undefined, fontSize: 9, padding: '2px 0' }}>{s}</div>)}
        </div>
        {[0.9, 0.7, 0.8, 0.6].map((w, i) => <div key={i} style={{ height: 6, width: `${w * 100}%`, background: '#2e2e2e', borderRadius: 3, marginTop: 10 }} />)}
      </div>
      {/* 主区：内缩的圆角面板（同真实网页） */}
      <div style={{ flex: 1, background: C.main, position: 'relative', margin: '4px 4px 4px 0', borderRadius: 8 }}>
        <div style={{ textAlign: 'center', fontSize: 14, fontWeight: 600, marginTop: 50 }}>{d.greet}</div>
        <div style={{ position: 'absolute', left: 130, top: 92 }}><Cat w={60} fill={C.main} look={0.3} lookY={0.5} /></div>
        <div style={{ position: 'absolute', left: 30, right: 30, top: 128, height: 62, borderRadius: 12, background: C.comp, padding: 10, boxSizing: 'border-box', fontSize: 11, color: C.muted }}>
          {d.ask}
          <div style={{ position: 'absolute', right: 8, bottom: 8, width: 20, height: 20, borderRadius: '50%', background: '#555' }} />
        </div>
      </div>
    </div>
  </Shell>
);

/** 浏览器插件 200×250 */
export const DevExt: React.FC<{ c: Content }> = ({ c: { devices: { ext: d } } }) => (
  <Shell w={200} h={250} bg="#fff">
    <div style={{ padding: 14, color: '#111' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700 }}><Logo size={22} />{d.name}<span style={{ marginLeft: 'auto', color: '#999', fontSize: 11, letterSpacing: 4 }}>⌂⚙</span></div>
      <div style={{ marginTop: 40, display: 'flex', justifyContent: 'center' }}><Cat w={56} line={false} look={0.2} /></div>
      <div style={{ marginTop: 14, height: 32, borderRadius: 8, background: C.ink, color: '#fff', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'nowrap' }}>{d.save}</div>
      <div style={{ marginTop: 12, fontSize: 11, color: '#666' }}>{d.to}</div>
      <div style={{ marginTop: 6, fontSize: 11, color: '#666', display: 'flex', alignItems: 'center' }}>{d.area}<span style={{ marginLeft: 'auto', width: 24, height: 14, borderRadius: 7, background: '#ddd' }} /></div>
    </div>
  </Shell>
);

/** iPhone App 170×350 */
export const DevIos: React.FC<{ c: Content }> = ({ c: { devices: { ios: d } } }) => (
  <Shell w={170} h={350} r={30}>
    <div style={{ position: 'absolute', left: 55, top: 8, width: 60, height: 16, borderRadius: 8, background: '#000' }} />
    <div style={{ textAlign: 'center', fontSize: 15, fontWeight: 700, marginTop: 70 }}>{d.greet}</div>
    <div style={{ position: 'absolute', left: 55, top: 112 }}><Cat w={60} fill="#1c1c1e" look={0.3} lookY={0.5} /></div>
    <div style={{ position: 'absolute', left: 14, right: 14, top: 148, height: 56, borderRadius: 14, background: '#2a2a2a', border: '1px solid #3a3a3a', padding: 10, boxSizing: 'border-box', fontSize: 11, color: C.muted }}>{d.ask}</div>
    <div style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: 56, background: '#151517', display: 'flex', justifyContent: 'space-around', alignItems: 'center', fontSize: 10, color: '#ddd' }}>
      {d.bottom.map((s, i) => <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, color: i === 1 ? '#8AB4FF' : '#ddd' }}><div style={{ width: i === 1 ? 28 : 16, height: i === 1 ? 28 : 16, borderRadius: '50%', background: i === 1 ? C.blue : '#333' }} />{s}</div>)}
    </div>
  </Shell>
);

/** Android 170×350：资源列表 */
export const DevAndroid: React.FC<{ c: Content }> = ({ c: { devices: { android: d } } }) => (
  <Shell w={170} h={350} r={30}>
    <div style={{ position: 'absolute', left: 80, top: 10, width: 10, height: 10, borderRadius: '50%', background: '#000' }} />
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '34px 14px 0' }}><Logo size={24} /><div style={{ fontSize: 15, fontWeight: 700 }}>{d.title}</div></div>
    {d.items.map((s, i) => (
      <div key={s} style={{ margin: '8px 12px 0', padding: '8px 8px', borderRadius: 8, background: '#262626', fontSize: 10.5, display: 'flex', gap: 6, alignItems: 'center' }}>
        <span>{['📕', '🎙', '🖼', '📝', '🎬'][i]}</span><span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s}</span>
      </div>
    ))}
    <div style={{ position: 'absolute', right: 14, bottom: 22, width: 44, height: 44, borderRadius: 14, background: C.blue, color: '#fff', fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>＋</div>
  </Shell>
);

const Chat: React.FC<{ title: string; msgs: [boolean, string][]; head: string; bg: string; meBg: string; otherBg: string; meFg?: string; dark?: boolean }> = ({ title, msgs, head, bg, meBg, otherBg, meFg, dark }) => (
  <Shell w={260} h={350} bg={bg}>
    <div style={{ height: 40, background: head, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 14, fontWeight: dark ? 500 : 700, color: dark ? '#EDEDED' : '#111', borderBottom: dark ? '0.5px solid rgba(255,255,255,.08)' : undefined }}>{!dark && <Logo size={20} />}{title}</div>
    <div style={{ padding: '4px 12px' }}>
      {msgs.map(([me, s], i) => <Bubble key={i} me={me} s={s} meBg={meBg} otherBg={otherBg} fg={me ? (meFg ?? '#111') : dark ? '#E8E8E8' : '#111'} r={dark ? 4 : 8} meAv={dark} />)}
    </div>
    {dark
      ? <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 46, background: '#1C1C1C', display: 'flex', alignItems: 'center', gap: 6, padding: '0 8px', boxSizing: 'border-box' }}>{[0, 1].map((i) => <React.Fragment key={i}>{i === 1 && <div style={{ flex: 1, height: 26, borderRadius: 4, background: '#2C2C2C' }} />}<div style={{ width: 20, height: 20, borderRadius: '50%', border: '1.4px solid #D6D6D6', boxSizing: 'border-box' }} /></React.Fragment>)}<div style={{ width: 20, height: 20, borderRadius: '50%', border: '1.4px solid #D6D6D6', boxSizing: 'border-box' }} /></div>
      : <div style={{ position: 'absolute', left: 10, right: 10, bottom: 10, height: 28, borderRadius: 6, background: '#fff', border: '1px solid #ddd' }} />}
  </Shell>
);

/** 微信 · 小黑 260×350 */
export const DevWechat: React.FC<{ c: Content }> = ({ c: { devices: { wechat: d } } }) => (
  // 深色模式，取色同 C 段的微信（assets/screenshot/wechat.PNG）
  <Chat title={d.title} msgs={d.msgs} head="#1C1C1C" bg="#111111" meBg="#28B561" otherBg="#2C2C2C" meFg="#0B0B0B" dark />
);

/** QQ · 小黑 260×350 */
export const DevQQ: React.FC<{ c: Content }> = ({ c: { devices: { qq: d } } }) => (
  <Chat title={d.title} msgs={d.msgs} head="#E8F3FF" bg="#F2F6FA" meBg="#12B7F5" otherBg="#fff" meFg="#fff" />
);
