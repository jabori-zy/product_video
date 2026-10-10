import React from 'react';
import { Composition } from 'remotion';
import './fonts';
import { Main } from './Main';
import { FPS, W, H, DURATION } from './lib';
import { TOTAL_OUT } from './pace';

export const Root: React.FC = () => (
  <>
    <Composition id="Demo" component={Main} durationInFrames={Math.round(DURATION * FPS)} fps={FPS} width={W} height={H} />
    {/* 不限时长版：同一套画面，按 pace.ts 放慢 */}
    <Composition id="DemoPaced" component={Main} defaultProps={{ paced: true }} durationInFrames={Math.round(TOTAL_OUT * FPS)} fps={FPS} width={W} height={H} />
  </>
);
