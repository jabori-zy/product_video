import React from 'react';
import { Composition } from 'remotion';
import { Film } from './Film';
import { FPS, TOTAL, W, H } from './timing';

export const Root: React.FC = () => (
  <Composition id="ColdMirrorDemo" component={Film} durationInFrames={TOTAL} fps={FPS} width={W} height={H} />
);
