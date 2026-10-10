// 线框里的真实内容：类型 + 语言表 + 截图清单
// 加一种语言 = 在 locales/ 加一个文件，再在 LOCALES 里登记；缺字段 TypeScript 会报错
import { zh } from './locales/zh';
import { en } from './locales/en';

export type Content = {
  zhihu: {
    site: string; nav: string[]; search: string; column: string; title: string;
    author: string; bio: string; follow: string; date: string;
    paras: string[]; quote: string; upvote: string; comments: string; share: string; save: string;
  };
  news: { site: string; nav: string[]; tag: string; headline: string; dek: string; byline: string; more: string; stories: string[] };
  bili: {
    site: string; title: string; up: string; views: string; danmaku: string; date: string; time: string;
    chapters: string[]; actions: string[]; frame: { docs: string; store: string; retrieve: string; llm: string; answer: string };
  };
  xhs: { site: string; title: string; author: string; likes: string; saves: string; tiles: string[]; tags: string };
  x: { name: string; handle: string; text: string; time: string; stats: string[]; translate: string };
  wechat: { contact: string; pdf: string; pdfSize: string; voice: string; photo: string; note: string; input: string; boardLines: string[] };
  app: {
    space: string; tabs: [string, string]; greet: string; ask: string; recent: string;
    items: [string, string][]; bottom: string[];
  };
  rss: { folder: string; feeds: string; badge: string; articles: [string, string, string][] };
  pdf: {
    file: string; title: string; date: string; sections: string[]; kpis: [string, string][];
    extract: string[]; label: string;
  };
  board: { lines: string[]; sticky: string[] };
  keyframes: string[];
  answer: { heads: string[]; bodies: string[]; sources: string[]; note: string };
  report: {
    title: string; toc: string; heads: string[]; highlights: string[]; sources: string[];
    cols: string[]; todos: [string, string, string][];
  };
  readme: { repo: string; tabs: string[]; desc: string; badges: string[]; quick: string; cmds: string[]; feats: string[] };
  devices: {
    web: { space: string; nav: string[]; tabs: [string, string]; greet: string; ask: string };
    ext: { name: string; save: string; to: string; area: string };
    ios: { greet: string; ask: string; bottom: string[] };
    android: { title: string; items: string[] };
    wechat: { title: string; msgs: [boolean, string][] };
    qq: { title: string; msgs: [boolean, string][] };
  };
  /** 截图文件名（不含编号与扩展名） */
  files: Record<Slug, string>;
};

export const LOCALES = { zh, en } satisfies Record<string, Content>;
export type Lang = keyof typeof LOCALES;
export const LANGS = Object.keys(LOCALES) as Lang[];

export type Slug =
  | 'zhihu' | 'news' | 'bili' | 'xhs' | 'x' | 'wechat' | 'app' | 'rss' | 'pdf' | 'board' | 'frame' | 'keyframes'
  | 'answer' | 'report' | 'readme' | 'dev-web' | 'dev-ext' | 'dev-ios' | 'dev-android' | 'dev-wechat' | 'dev-qq';

/** 截图清单：顺序 = 在视频里出现的顺序；where = 填哪个线框（45 s 版 / 89 s 版时间） */
export const ITEMS: { slug: Slug; w: number; h: number; where: string }[] = [
  { slug: 'zhihu', w: 1500, h: 788, where: 'B 知乎页面 + 正文（5.0–9.0 s / 9.3–16.9 s）；E 引用跳转（22.9–23.5 s / 48.4–49.6 s）' },
  { slug: 'news', w: 720, h: 450, where: 'C 新闻站页面（9.0–9.5 s / 16.9–18.1 s）' },
  { slug: 'bili', w: 720, h: 450, where: 'C B 站视频页（9.5–10.0 s / 18.1–19.5 s）' },
  { slug: 'xhs', w: 500, h: 400, where: 'C 小红书页面（10.0–10.5 s / 19.5–21.2 s）' },
  { slug: 'x', w: 500, h: 400, where: 'C X 帖子（10.0–10.5 s / 19.5–21.2 s）' },
  { slug: 'wechat', w: 360, h: 720, where: 'C 手机 · 微信（10.5–11.0 s / 21.2–22.9 s）' },
  { slug: 'app', w: 360, h: 720, where: 'C 手机 · OmniBox App（11.0–11.5 s / 22.9–24.3 s）' },
  { slug: 'rss', w: 460, h: 380, where: 'C RSS 订阅文件夹 + 新文章 1–3（11.0–11.5 s / 22.9–24.3 s）' },
  { slug: 'pdf', w: 760, h: 360, where: 'D ① PDF 页面 + 文字条（13.0–13.75 s / 27.0–29.2 s）' },
  { slug: 'board', w: 330, h: 330, where: 'D ② 白板照片（13.75–14.5 s / 29.2–31.5 s）' },
  { slug: 'frame', w: 330, h: 190, where: 'D ④ 视频画面（15.25–16.0 s / 33.7–35.8 s）' },
  { slug: 'keyframes', w: 690, h: 92, where: 'D ④ 章节关键帧 ×4（同上）' },
  { slug: 'answer', w: 960, h: 470, where: 'E 回答正文（灰条，21.0–22.5 s / 44.1–47.6 s）' },
  { slug: 'report', w: 960, h: 940, where: 'E 周报正文 + 待办表（23.5–26.5 s / 49.6–55.0 s）' },
  { slug: 'readme', w: 1000, h: 290, where: 'G README（37.0–37.65 s / 75.0–76.6 s）' },
  { slug: 'dev-web', w: 460, h: 300, where: 'G 设备阵列 · 网页（35.0–37.0 s / 71.1–75.0 s）' },
  { slug: 'dev-ext', w: 200, h: 250, where: 'G 设备阵列 · 插件' },
  { slug: 'dev-ios', w: 170, h: 350, where: 'G 设备阵列 · iOS' },
  { slug: 'dev-android', w: 170, h: 350, where: 'G 设备阵列 · Android' },
  { slug: 'dev-wechat', w: 260, h: 350, where: 'G 设备阵列 · 微信' },
  { slug: 'dev-qq', w: 260, h: 350, where: 'G 设备阵列 · QQ' },
];

export const fileName = (lang: Lang, slug: Slug) => {
  const i = ITEMS.findIndex((it) => it.slug === slug);
  return `${String(i + 1).padStart(2, '0')} ${LOCALES[lang].files[slug]}`;
};
