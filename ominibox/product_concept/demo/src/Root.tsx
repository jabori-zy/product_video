import React from 'react';
import { Composition } from 'remotion';
import './fonts';
import { Main } from './Main';
import { FPS, W, H, DURATION } from './lib';
import { TOTAL_OUT } from './pace';
import { MainApp } from './MainApp';
import { TOTAL_APP } from './appTimeline';
import { Hh2 } from './scenes/H2';
import { LangProvider } from './i18n';
import { Probe } from './omni/Probe';

const MainAppSlogan: React.FC = () => <MainApp ending={Hh2} />;
// 成片 v1：线框已换成真实内容，结尾 H2，无时间码；声音由 tools/render-final.mjs 合入（方案二）
const Final: React.FC = () => <MainApp ending={Hh2} timecode={false} />;
// 英文成片：同一套画面，文字经 i18n 切到英文（src/i18n.tsx、src/copy.ts、data/locales/en.ts）
const FinalEn: React.FC = () => <LangProvider lang="en"><MainApp ending={Hh2} timecode={false} /></LangProvider>;

export const Root: React.FC = () => (
  <>
    <Composition id="Demo" component={Main} durationInFrames={Math.round(DURATION * FPS)} fps={FPS} width={W} height={H} />
    {/* 不限时长版：同一套画面，按 pace.ts 放慢 */}
    <Composition id="DemoPaced" component={Main} defaultProps={{ paced: true }} durationInFrames={Math.round(TOTAL_OUT * FPS)} fps={FPS} width={W} height={H} />
    {/* 加入手机操作与电脑 ↔ 手机衔接：原片 + 两段插段（appTimeline.ts） */}
    <Composition id="DemoApp" component={MainApp} durationInFrames={Math.round(TOTAL_APP * FPS)} fps={FPS} width={W} height={H} />
    {/* 结尾改版（方案 A「回文翻转」）：同 DemoApp，只把 H 换成 H2 */}
    <Composition id="DemoSlogan" component={MainAppSlogan} durationInFrames={Math.round(TOTAL_APP * FPS)} fps={FPS} width={W} height={H} />
    <Composition id="Final" component={Final} durationInFrames={Math.round(TOTAL_APP * FPS)} fps={FPS} width={W} height={H} />
    {/* 校对：真实网页 HTML 与 omni/app.tsx 组件对比（omni/Probe.tsx） */}
    <Composition id="OmniProbe" component={Probe as any} defaultProps={{ state: 'home', reference: false }} durationInFrames={1} fps={FPS} width={W} height={H} />
    <Composition id="FinalEn" component={FinalEn} durationInFrames={Math.round(TOTAL_APP * FPS)} fps={FPS} width={W} height={H} />
  </>
);
