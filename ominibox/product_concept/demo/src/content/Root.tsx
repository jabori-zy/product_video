import React from 'react';
import { Still } from 'remotion';
import '../fonts';
import { ITEMS, LANGS, LOCALES, fileName, type Content, type Lang, type Slug } from '../data/content';
import { Zhihu } from './zhihu';
import { Bili, News, Rss, XPost, Xhs } from './cards';
import { App, WeChat } from './phone';
import { Board, Keyframes, Pdf, RagFrame } from './understand';
import { Answer, Report } from './answers';
import { Readme } from './github';
import { DevAndroid, DevExt, DevIos, DevQQ, DevWeb, DevWechat } from './devices';

// 线框内容的独立入口：不影响视频的 Root.tsx。每项 × 每种语言一个 Still，id = <lang>-<slug>
const VIEW: Record<Slug, React.FC<{ c: Content }>> = {
  zhihu: Zhihu, news: News, bili: Bili, xhs: Xhs, x: XPost, wechat: WeChat, app: App, rss: Rss,
  pdf: Pdf, board: Board, frame: RagFrame, keyframes: Keyframes, answer: Answer, report: Report, readme: Readme,
  'dev-web': DevWeb, 'dev-ext': DevExt, 'dev-ios': DevIos, 'dev-android': DevAndroid, 'dev-wechat': DevWechat, 'dev-qq': DevQQ,
};

// file / where 只给截图脚本用（文件名、README 索引）
const Item: React.FC<{ lang: Lang; slug: Slug; file: string; where: string }> = ({ lang, slug }) => {
  const V = VIEW[slug];
  return <V c={LOCALES[lang]} />;
};

export const ContentRoot: React.FC = () => (
  <>
    {LANGS.flatMap((lang) =>
      ITEMS.map(({ slug, w, h, where }) => (
        <Still key={`${lang}-${slug}`} id={`${lang}-${slug}`} component={Item} defaultProps={{ lang, slug, file: fileName(lang, slug), where }} width={w} height={h} />
      )),
    )}
  </>
);
