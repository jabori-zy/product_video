import React from 'react';
import { Composition } from 'remotion';
import { Concept } from './Concept';
import { FPS, TOTAL } from './timing';

export const Root: React.FC = () => (
  <Composition id="OmniBoxConcept" component={Concept} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080} />
);
