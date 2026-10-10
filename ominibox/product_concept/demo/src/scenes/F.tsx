import React from 'react';
import { C, Caption, Cursor, Fill, Logo, Tx, lin, morph, sp } from '../lib';
import { useTr } from '../i18n';

// F 分享协作（30.0–35.0 s），局部时间 t = 全局 − 30。米白画布，一个组件连续变形（参考 3）

const ST = [
  { t: -0.2, cx: 1835, cy: 44, w: 110, h: 40, r: 20, bg: '#333333' }, // E 右上角「分享」
  { t: -0.15, cx: 960, cy: 540, w: 220, h: 72, r: 36, bg: '#171717' }, // 胶囊按钮
  { t: 0.5, cx: 960, cy: 540, w: 640, h: 440, r: 28, bg: '#FFFFFF' }, // 分享设置卡片
  { t: 2.0, cx: 960, cy: 540, w: 460, h: 64, r: 32, bg: '#171717' }, // 链接胶囊
  { t: 2.5, cx: 960, cy: 520, w: 560, h: 160, r: 20, bg: '#FFFFFF' }, // 微信分享卡片
  { t: 3.4, cx: 960, cy: 560, w: 900, h: 460, r: 28, bg: '#FFFFFF' }, // 团队空间
];

const Toggle: React.FC<{ on: number }> = ({ on }) => (
  <div style={{ width: 56, height: 32, borderRadius: 16, background: on > 0.5 ? '#171717' : '#D4D4D8', position: 'relative' }}>
    <div style={{ position: 'absolute', top: 3, left: 3 + on * 24, width: 26, height: 26, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,.3)' }} />
  </div>
);

const AVA = ['#F97316', '#22C55E', '#8B5CF6', '#0EA5E9'];

export const Ff: React.FC<{ t: number }> = ({ t }) => {
  const tr = useTr();
  const m = morph(t, ST, { damping: 13, mass: 0.8 });
  const press = (t > 0.3 && t < 0.42) || (t > 1.9 && t < 2.0) ? 0.95 : 1;
  const stage = m._i;
  const cin = (i: number) => (stage === i ? lin(m._p, 0.4, 1, 0, 1) : 0);
  const zoom = lin(t, 2.5, 5.0, 1.06, 0.94);
  const seg = sp(t, 1.5);
  const card = { l: 960 - 320, t: 540 - 220 };
  const rows = tr(['需要登录', '密码保护', '过期时间', 'AI 问答'], ['Require login', 'Password protection', 'Expiration', 'AI Q&A']);

  const path = [
    { t: 0, x: 1300, y: 820 }, { t: 0.28, x: 960, y: 548 }, { t: 0.6, x: 1000, y: 600 }, { t: 0.73, x: 1210, y: 430 }, { t: 0.98, x: 1210, y: 500 },
    { t: 1.23, x: 1190, y: 570 }, { t: 1.48, x: 1200, y: 640 }, { t: 1.88, x: 1180, y: 712 }, { t: 2.4, x: 1300, y: 760 }, { t: 3.2, x: 1400, y: 820 },
  ];

  return (
    <Fill bg={C.canvas}>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${zoom})`, transformOrigin: '960px 540px' }}>
        {/* 4 个成员头像：先在微信卡片旁冒出，再飞进团队空间表头 */}
        {AVA.map((col, i) => {
          const a = 2.7 + i * 0.2;
          if (t < a) return null;
          const p = sp(t, a);
          const f = lin(t, 3.4 + i * 0.05, 3.7 + i * 0.05, 0, 1);
          const x0 = 1290 + (i % 2) * 70, y0 = 430 + Math.floor(i / 2) * 70;
          // 落点：团队空间卡片里「团队」一栏的表头右侧（缩到 0.7 后约 39 px，间距 34，右对齐在团队框内）
          const x1 = 1306 - (3 - i) * 34, y1 = 422;
          return <div key={i} style={{ position: 'absolute', left: x0 + (x1 - x0) * f, top: y0 + (y1 - y0) * f, width: 56, height: 56, borderRadius: '50%', background: col, border: '3px solid #fff', color: '#fff', fontSize: 22, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${p * (1 - 0.3 * f)})`, zIndex: 2 }}>{tr('林王陈李', 'LWCL')[i]}</div>;
        })}

        {/* 变形中的组件 */}
        <div style={{ position: 'absolute', left: m.cx - m.w / 2, top: m.cy - m.h / 2, width: m.w, height: m.h, borderRadius: m.r, background: m.bg, boxShadow: '0 20px 60px rgba(0,0,0,.12)', overflow: 'hidden', transform: `scale(${press})` }}>
          {stage <= 1 && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 28, fontWeight: 700, whiteSpace: 'nowrap' }}>{tr('⤴ 分享', '⤴ Share')}</div>}
          {stage === 2 && (
            <div style={{ position: 'absolute', left: 0, top: 0, width: 640, height: 440, opacity: cin(2) }}>
              <Tx x={36} y={28} s={28} c="#111" b>{tr('分享', 'Share')}</Tx>
              {rows.map((r, i) => (
                <React.Fragment key={r}>
                  <Tx x={36} y={94 + i * 70} s={22} c="#333">{r}</Tx>
                  <div style={{ position: 'absolute', right: 36, top: 90 + i * 70 }}>
                    {i < 2 && <Toggle on={sp(t, 0.75 + i * 0.25)} />}
                    {i === 2 && <div style={{ padding: '4px 14px', borderRadius: 8, border: `2px solid ${t > 1.25 ? '#171717' : '#ddd'}`, fontSize: 20, color: '#111' }}>{t > 1.25 ? tr('7 天', '7 days') : tr('永久', 'Never')} ⌄</div>}
                    {i === 3 && (
                      <div style={{ position: 'relative', display: 'flex', width: 270, height: 36, borderRadius: 999, background: '#EEE' }}>
                        <div style={{ position: 'absolute', top: 3, left: 3 + seg * 180, width: 84, height: 30, borderRadius: 999, background: '#171717' }} />
                        {tr(['禁用', '仅对话', '启用'], ['Off', 'Chat only', 'On']).map((s, k) => <div key={s} style={{ position: 'relative', flex: 1, textAlign: 'center', lineHeight: '36px', fontSize: 17, color: (k === 0 && seg < 0.5) || (k === 2 && seg >= 0.5) ? '#fff' : '#555' }}>{s}</div>)}
                      </div>
                    )}
                  </div>
                </React.Fragment>
              ))}
              <div style={{ position: 'absolute', right: 36, bottom: 26, padding: '10px 26px', borderRadius: 999, background: '#171717', color: '#fff', fontSize: 20, fontWeight: 600 }}>{tr('复制链接', 'Copy link')}</div>
            </div>
          )}
          {stage === 3 && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 24, fontWeight: 600, opacity: cin(3), whiteSpace: 'nowrap' }}>omnibox.pro/s/xH8…　✓</div>}
          {stage === 4 && (
            <div style={{ position: 'absolute', left: 0, top: 0, width: 560, height: 160, opacity: cin(4) }}>
              <Tx x={28} y={30} s={26} c="#111" b>{tr('来自小黑 OmniBox 的对话', 'Shared from Xiaohei OmniBox')}</Tx>
              <Tx x={28} y={82} s={18} c="#888">{tr('小黑 OmniBox · 你的 AI 知识伙伴', 'Your AI knowledge companion')}</Tx>
              <div style={{ position: 'absolute', right: 24, top: 30 }}><Logo size={100} /></div>
            </div>
          )}
          {stage === 5 && (
            <div style={{ position: 'absolute', left: 0, top: 0, width: 900, height: 460, opacity: cin(5) }}>
              <Tx x={40} y={30} s={26} c="#111" b>{tr('空间', 'Spaces')}</Tx>
              <div style={{ position: 'absolute', left: 40, top: 90, width: 390, height: 330, borderRadius: 16, background: '#F4F4F5' }} />
              <div style={{ position: 'absolute', left: 470, top: 90, width: 390, height: 330, borderRadius: 16, background: '#EEF4FF', border: `2px solid ${C.blue}` }} />
              <Tx x={64} y={106} s={22} c="#111" b>{tr('个人', 'Personal')}</Tx>
              <Tx x={494} y={106} s={22} c={C.blue} b>{tr('团队', 'Team')}</Tx>
              {tr(['我的随手记', '读书笔记', '旅行计划'], ['My quick notes', 'Reading notes', 'Travel plans']).map((s, i) => <Tx key={s} x={64} y={160 + i * 50} s={20} c="#555">📄 {s}</Tx>)}
              {tr(['📁 AI 研究', '🎙 周会录音.m4a', '📝 AI 动态周报 · 第 40 周', '🎬 10 分钟看懂 RAG'], ['📁 AI research', '🎙 Weekly Meeting Recording.m4a', '📝 AI Weekly Brief · Week 40', '🎬 Understand RAG in 10 Minutes']).map((s, i) => (
                <Tx key={s} x={494} y={160 + i * 50} s={20} c="#222" style={{ opacity: lin(t, 3.6 + i * 0.15, 3.75 + i * 0.15, 0, 1), transform: `translateX(${lin(t, 3.6 + i * 0.15, 3.75 + i * 0.15, 20, 0)}px)` }}>{s}</Tx>
              ))}
            </div>
          )}
        </div>
        <Cursor t={t} path={path} clicks={[0.3, 0.75, 1.0, 1.25, 1.5, 1.9]} show={[0, 3.2]} />
      </div>
      <Caption t={t} a={0.8} b={2.0} text={tr('分享出去，AI 一起带走', 'Share your knowledge. Take AI along.')} y={130} size={tr(60, 54)} color="#171717" />
      <Caption t={t} a={3.0} b={4.8} text={tr('一个人的第二大脑，一群人的知识库', 'A second brain for you. A knowledge base for your team.')} y={130} size={tr(60, 50)} color="#171717" />
    </Fill>
  );
};
