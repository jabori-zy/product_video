import React from 'react';
import type { Content } from '../data/content';
import { FONT } from '../fonts';
import { XiaoheiAvatar } from './avatar';
import { C, Cat, Logo } from '../lib';

// C 段手机：微信聊天 → OmniBox App（360×720，含机身边框，与线框一致）

/** iOS 状态栏图标：信号、Wi-Fi、电池 */
const StatusIcons: React.FC<{ color: string }> = ({ color }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
    <svg width={17} height={11} viewBox="0 0 17 11" style={{ display: 'block' }}>{[0, 1, 2, 3].map((i) => <rect key={i} x={i * 4.5} y={8 - i * 2.6} width={3} height={3 + i * 2.6} rx={0.8} fill={color} />)}</svg>
    <svg width={15} height={11} viewBox="0 0 15 11" style={{ display: 'block' }} fill="none" stroke={color} strokeWidth={1.7} strokeLinecap="round"><path d="M1 3.8a9 9 0 0 1 13 0M3.4 6.3a5.6 5.6 0 0 1 8.2 0" /><circle cx="7.5" cy="9" r="1.1" fill={color} stroke="none" /></svg>
    <div style={{ width: 24, height: 12, borderRadius: 3.5, border: `1px solid ${color}88`, padding: 1.5, boxSizing: 'border-box', position: 'relative' }}>
      <div style={{ width: '78%', height: '100%', borderRadius: 1.5, background: color }} />
      <div style={{ position: 'absolute', right: -3.5, top: 3.5, width: 1.8, height: 4, borderRadius: 1, background: `${color}88` }} />
    </div>
  </div>
);

export const Phone: React.FC<{ bg: string; dark?: boolean; time?: string; bar?: string; children: React.ReactNode }> = ({ bg, dark, time = '9:41', bar, children }) => (
  <div style={{ width: 360, height: 720, borderRadius: 48, background: '#111', border: '8px solid #333', boxSizing: 'border-box', overflow: 'hidden', position: 'relative', fontFamily: FONT }}>
    <div style={{ position: 'absolute', inset: 0, background: bg, borderRadius: 40, overflow: 'hidden' }}>
      <div style={{ height: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2px 26px 0 34px', fontSize: 15, fontWeight: 600, color: dark ? '#fff' : '#111', background: bar }}>
        <span>{time}</span><StatusIcons color={dark ? '#fff' : '#111'} />
      </div>
      <div style={{ position: 'absolute', left: 116, top: 10, width: 112, height: 30, borderRadius: 15, background: '#000', zIndex: 3 }} />
      {children}
    </div>
  </div>
);

// 微信（iOS 深色模式），按 assets/screenshot/wechat.PNG 取色：聊天底 #111111，发出的气泡 #28B561（字近黑），
// 顶栏 / 输入栏 #1C1C1C，输入框 #2C2C2C，时间 #7A7A7A；头像是圆角方形，图片消息不带气泡
const WX = { bg: '#111111', bar: '#1C1C1C', field: '#2C2C2C', green: '#28B561', ink: '#0B0B0B', grey: '#7A7A7A', card: '#2C2C2C', icon: '#D6D6D6' };

/** 发出的气泡（右侧带小尾巴） */
const Sent: React.FC<{ children: React.ReactNode; w?: number; bg?: string; pad?: string }> = ({ children, w, bg = WX.green, pad = '9px 12px' }) => (
  <div style={{ position: 'relative', width: w, maxWidth: 214, background: bg, borderRadius: 5, padding: pad, boxSizing: 'border-box', color: bg === WX.green ? WX.ink : '#E8E8E8', fontSize: 15.5, lineHeight: 1.4 }}>
    {children}
    <div style={{ position: 'absolute', right: -5, top: 13, width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: `6px solid ${bg}` }} />
  </div>
);

/** reveal：每条消息的出现进度（C 段逐条弹出）；省略时全部显示 */
export const WeChat: React.FC<{ c: Content; reveal?: number[] }> = ({ c: { wechat: w }, reveal = [1, 1, 1, 1] }) => {
  const me = (i: number, node: React.ReactNode) => {
    const p = reveal[i] ?? 1;
    return (
      <div key={i} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', gap: 10, marginTop: 16, opacity: Math.min(1, p * 1.5), transform: `scale(${0.7 + 0.3 * p})`, transformOrigin: 'right top' }}>
        {node}
        <XiaoheiAvatar size={38} radius={5} />
      </div>
    );
  };
  const ico = (d: React.ReactNode) => (
    <svg width={28} height={28} viewBox="0 0 28 28" fill="none" stroke={WX.icon} strokeWidth={1.6} strokeLinecap="round" style={{ display: 'block', flexShrink: 0 }}><circle cx="14" cy="14" r="12.5" />{d}</svg>
  );
  return (
    <Phone bg={WX.bg} dark time="21:08" bar={WX.bar}>
      {/* 顶栏 */}
      <div style={{ height: 44, background: WX.bar, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16.5, fontWeight: 500, color: '#EDEDED', borderBottom: '0.5px solid rgba(255,255,255,.08)', position: 'relative' }}>
        <svg width={11} height={19} viewBox="0 0 11 19" style={{ position: 'absolute', left: 14 }} fill="none" stroke="#EDEDED" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 1.5 2 9.5l7.5 8" /></svg>
        {w.contact}
        <svg width={22} height={6} viewBox="0 0 22 6" style={{ position: 'absolute', right: 16 }}>{[3, 11, 19].map((x) => <circle key={x} cx={x} cy={3} r={2.2} fill="#EDEDED" />)}</svg>
      </div>
      <div style={{ padding: '0 12px' }}>
        <div style={{ textAlign: 'center', fontSize: 12.5, color: WX.grey, marginTop: 14 }}>21:06</div>
        {/* 文件 */}
        {me(0, (
          <Sent w={214} bg={WX.card} pad="11px 12px">
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, color: '#EDEDED', lineHeight: 1.3, wordBreak: 'break-all' }}>{w.pdf}</div>
                <div style={{ fontSize: 12, color: WX.grey, marginTop: 6 }}>{w.pdfSize}</div>
              </div>
              <div style={{ width: 36, height: 44, borderRadius: 3, background: '#E5484D', color: '#fff', fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 6, boxSizing: 'border-box', clipPath: 'polygon(0 0, 72% 0, 100% 22%, 100% 100%, 0 100%)' }}>PDF</div>
            </div>
          </Sent>
        ))}
        {/* 语音：时长在气泡外左侧（灰字），声波朝左 */}
        {me(1, (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: WX.grey, fontSize: 14 }}>{w.voice}</span>
            <Sent w={104}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', height: 21, alignItems: 'center' }}>
                <svg width={16} height={18} viewBox="0 0 16 18" fill="none" stroke={WX.ink} strokeWidth={1.9} strokeLinecap="round"><path d="M12.5 2.5a9 9 0 0 1 0 13M8.5 5.5a5 5 0 0 1 0 7" /><circle cx="4.5" cy="9" r="1.6" fill={WX.ink} stroke="none" /></svg>
              </div>
            </Sent>
          </div>
        ))}
        {/* 图片：不带气泡 */}
        {me(2, (
          <div style={{ width: 128, height: 150, borderRadius: 5, overflow: 'hidden', background: 'radial-gradient(ellipse at 30% 20%,#fff,#E6E2D6)', boxSizing: 'border-box', padding: '14px 12px', fontWeight: 800, border: '3px solid #B8BCC4' }}>
            <div style={{ fontSize: 13, color: '#1D4ED8', transform: 'rotate(-3deg)' }}>{w.boardLines[0]}</div>
            <div style={{ fontSize: 17, color: '#B91C1C', marginTop: 10, transform: 'rotate(2deg)' }}>{w.boardLines[1]}</div>
            <div style={{ width: 34, height: 30, background: '#FDE047', marginLeft: 66, marginTop: 14, transform: 'rotate(8deg)' }} />
          </div>
        ))}
        {/* 文字 */}
        {me(3, <Sent>{w.note}</Sent>)}
      </div>
      {/* 输入栏 */}
      <div style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: 84, background: WX.bar, borderTop: '0.5px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'flex-start', padding: '10px 10px 0', gap: 8, boxSizing: 'border-box' }}>
        {ico(<path d="M11 10.5a5 5 0 0 1 0 7M14.5 8a8.5 8.5 0 0 1 0 12M8 13.2v1.6" />)}
        <div style={{ flex: 1, height: 36, borderRadius: 6, background: WX.field, fontSize: 14, color: '#5C5C5C', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: -4 }}>{w.input}</div>
        {ico(<><path d="M9 16a6 6 0 0 0 10 0" /><circle cx="10" cy="11" r="1" fill={WX.icon} stroke="none" /><circle cx="18" cy="11" r="1" fill={WX.icon} stroke="none" /></>)}
        {ico(<path d="M14 8.5v11M8.5 14h11" />)}
        <div style={{ position: 'absolute', left: 116, bottom: 8, width: 112, height: 4, borderRadius: 2, background: '#fff' }} />
      </div>
    </Phone>
  );
};

export const App: React.FC<{ c: Content }> = ({ c: { app: a } }) => (
  <Phone bg="#1c1c1e" dark>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 20px' }}>
      <Logo size={30} />
      <div style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>{a.space} ⌄</div>
      <span style={{ marginLeft: 'auto', color: C.muted, fontSize: 18 }}>🔔</span>
    </div>
    <div style={{ margin: '10px 20px 0', height: 36, borderRadius: 999, background: '#2a2a2a', display: 'flex', padding: 3, boxSizing: 'border-box' }}>
      {a.tabs.map((s, i) => <div key={s} style={{ flex: 1, borderRadius: 999, background: i === 1 ? '#454545' : undefined, color: '#fff', fontSize: 14, fontWeight: i === 1 ? 700 : 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s}</div>)}
    </div>
    <div style={{ textAlign: 'center', color: '#fff', fontSize: 17, fontWeight: 600, marginTop: 34, padding: '0 24px', lineHeight: 1.4 }}>{a.greet}</div>
    <div style={{ position: 'relative', margin: '52px 20px 0', height: 84 }}>
      <div style={{ position: 'absolute', left: 116, top: -46 }}><Cat w={74} fill="#1c1c1e" look={0.3} lookY={0.5} /></div>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 18, background: '#2a2a2a', border: '1px solid #3a3a3a', padding: 14, boxSizing: 'border-box' }}>
        <div style={{ color: C.muted, fontSize: 14 }}>{a.ask}</div>
        <div style={{ position: 'absolute', right: 10, bottom: 10, width: 30, height: 30, borderRadius: '50%', background: '#555', color: '#bbb', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>↑</div>
        <div style={{ position: 'absolute', left: 14, bottom: 10, color: C.muted, fontSize: 18 }}>＋</div>
      </div>
    </div>
    <div style={{ margin: '28px 20px 0', color: C.muted, fontSize: 13 }}>{a.recent}</div>
    {a.items.map(([ic, s]) => (
      <div key={s} style={{ margin: '8px 20px 0', height: 40, borderRadius: 10, background: '#262626', display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px', color: C.text, fontSize: 14 }}>
        <span>{ic}</span><span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s}</span>
      </div>
    ))}
    <div style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: 78, background: '#151517', borderTop: '1px solid #2a2a2a', display: 'flex', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 10, boxSizing: 'border-box' }}>
      {a.bottom.map((s, i) => (
        <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: i === 1 ? '#8AB4FF' : '#ddd', fontSize: 12, fontWeight: i === 1 ? 700 : 400 }}>
          <div style={{ width: i === 1 ? 44 : 26, height: i === 1 ? 44 : 26, borderRadius: '50%', background: i === 1 ? C.blue : undefined, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: i === 1 ? 20 : 18 }}>{['☰', '🎙', '✎'][i]}</div>
          {s}
        </div>
      ))}
    </div>
  </Phone>
);
