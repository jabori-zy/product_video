import React from 'react';
import { Composition } from 'remotion';
import './fonts';
import { Main } from './Main';
import { FPS, W, H, DURATION } from './lib';

export const Root: React.FC = () => (
  <Composition id="Demo" component={Main} durationInFrames={Math.round(DURATION * FPS)} fps={FPS} width={W} height={H} />
);
