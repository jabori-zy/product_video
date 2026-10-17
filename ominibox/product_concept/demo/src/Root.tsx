import React from 'react';
import { Composition } from 'remotion';
import './fonts';
import { FPS, W, H } from './lib';
import { MainApp } from './MainApp';
import { TOTAL_APP } from './appTimeline';
import { Hh2 } from './scenes/H2';
import { LangProvider } from './i18n';

// 成片 v1：线框已换成真实内容，结尾 H2，无时间码；声音由 tools/render-final.mjs 合入（方案二）
const Final: React.FC = () => <MainApp ending={Hh2} timecode={false} />;
// 英文成片：同一套画面，文字经 i18n 切到英文（src/i18n.tsx、src/copy.ts、data/locales/en.ts）
const FinalEn: React.FC = () => <LangProvider lang="en"><MainApp ending={Hh2} timecode={false} /></LangProvider>;

export const Root: React.FC = () => (
  <>
    <Composition id="Final" component={Final} durationInFrames={Math.round(TOTAL_APP * FPS)} fps={FPS} width={W} height={H} />
    <Composition id="FinalEn" component={FinalEn} durationInFrames={Math.round(TOTAL_APP * FPS)} fps={FPS} width={W} height={H} />
  </>
);
