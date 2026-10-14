import React from 'react';
import { Composition } from 'remotion';
import { Film } from './Film';
import { FPS, TOTAL } from './timing';

export const Root: React.FC = () => (
  <Composition id="ColdMirrorDemo" component={Film} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080} />
);
