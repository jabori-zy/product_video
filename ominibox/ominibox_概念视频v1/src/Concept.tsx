// 《小黑 OmniBox》概念片：六场 + 五个自定义转场 + 原创配乐（无人声）。总长 600 帧，每个转场的中点落在小节重拍上
import React from 'react';
import { AbsoluteFill, Audio, staticFile } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import './fonts';
import { SCENES, TRANS, C } from './timing';
import { S1Eyes, EYE_X, EYE_Y } from './scenes/S1Eyes';
import { S2Fragments } from './scenes/S2Fragments';
import { S3Memory } from './scenes/S3Memory';
import { S4Output } from './scenes/S4Output';
import { S5Flash } from './scenes/S5Flash';
import { S6Brand } from './scenes/S6Brand';
import { eyeIris, silhouetteSwallow, dollyZoom, liquidBlend, lightLeak } from './transitions';

const SC = [S1Eyes, S2Fragments, S3Memory, S4Output, S5Flash, S6Brand];
const TR = [eyeIris(EYE_X[1], EYE_Y), silhouetteSwallow(), dollyZoom(960, 560), liquidBlend(), lightLeak()];

export const Concept: React.FC = () => (
  <AbsoluteFill style={{ background: C.void }}>
    <TransitionSeries>
      {SC.map((Scene, i) => (
        <React.Fragment key={i}>
          <TransitionSeries.Sequence durationInFrames={SCENES[i]}><Scene /></TransitionSeries.Sequence>
          {i < TR.length && <TransitionSeries.Transition presentation={TR[i]} timing={linearTiming({ durationInFrames: TRANS[i] })} />}
        </React.Fragment>
      ))}
    </TransitionSeries>
    <Audio src={staticFile('soundtrack.wav')} />
  </AbsoluteFill>
);
