// 会被「逐字打出来」的文案（画面与声音事件表共用，不依赖 React）
// 英文更长：保持中文版的总时长不变，按字数换算每个字的间隔，打字节奏与画面同步
export type Lang = 'zh' | 'en';
export type TypedCopy = { zh: string; en: string; step: number };

export const TYPED = {
  reply: { zh: '你好！我是小黑（OmniBox），很高兴见到你 👋 想记住什么，交给我就好。', en: "Hello! I'm Xiaohei (OmniBox), nice to meet you 👋 Whatever you want to remember, leave it to me.", step: 0.4 / 36 },
  search: { zh: '上周会议的待办', en: "Last week's meeting to-dos", step: 0.065 },
  q1: { zh: '我收藏的资料里，AI Agent 有哪三个趋势？', en: 'What are three AI agent trends in my saved sources?', step: 0.03 }, // v3：先调思考强度再打字，打字从 E 2.0 s 起
  q2: { zh: '把这些整理成一份周报，然后保存下来', en: 'Turn these into a weekly report, then save it', step: 0.6 / 17 }, // 打字总时长不变（0.6 s），发送点击仍在 6.4
  q3: { zh: '帮我把 AI 相关资料归档，并打上标签', en: 'Organize my AI sources and add tags', step: 0.034 },
  docTitle: { zh: 'AI 动态周报 · 第 40 周', en: 'AI Weekly Brief · Week 40', step: 0.02 },
  m2q: { zh: '待办里哪项最急？', en: 'Which to-do is most urgent?', step: 0.11 },
} satisfies Record<string, TypedCopy>;

/** 当前语言的文字 */
export const txt = (c: TypedCopy, lang: Lang) => (lang === 'en' ? c.en : c.zh);
/** 当前语言的打字间隔：英文按中文总时长均分 */
export const stepOf = (c: TypedCopy, lang: Lang) => (lang === 'en' ? (c.step * Array.from(c.zh).length) / Array.from(c.en).length : c.step);

/** 开场打字：中文是拼音输入法（[时刻, 已上屏, 拼音]），英文是逐字母输入 */
export const OPEN_KEYS_ZH: [number, string, string][] = [
  [0.4, '', 'n'], [0.46, '', 'ni'], [0.52, '', 'nih'], [0.58, '', 'niha'], [0.64, '', 'nihao'],
  [0.72, '你好', ''], [0.82, '你好，', ''],
  [0.88, '你好，', 'x'], [0.93, '你好，', 'xi'], [0.98, '你好，', 'xia'], [1.03, '你好，', 'xiao'], [1.08, '你好，', 'xiaoh'], [1.13, '你好，', 'xiaohe'], [1.18, '你好，', 'xiaohei'],
  [1.3, '你好，小黑', ''], [1.5, '你好，小黑！', ''],
];
export const OPEN_TEXT_EN = 'Hello, Xiaohei!';
export const OPEN_KEYS_EN: [number, string, string][] = Array.from(OPEN_TEXT_EN).map((_, i, a) => [0.4 + (1.1 * i) / (a.length - 1), OPEN_TEXT_EN.slice(0, i + 1), '']);
export const openKeys = (lang: Lang) => (lang === 'en' ? OPEN_KEYS_EN : OPEN_KEYS_ZH);

/** 资源 / 文件名（网页侧栏、手机列表、对话里都用同一套名字） */
export const RES = {
  zhihuHome: { zh: '首页 - 知乎', en: 'Home - Zhihu' },
  agentYear: { zh: 'AI Agent 元年…（知乎）', en: 'The Year of AI Agents… (Zhihu)' },
  q3: { zh: 'Q3 产品复盘.pdf', en: 'Q3 Product Review.pdf' },
  board: { zh: '白板照片.jpg', en: 'Whiteboard Photo.jpg' },
  meeting: { zh: '周会录音.m4a', en: 'Weekly Meeting Recording.m4a' },
  rag: { zh: '10 分钟看懂 RAG（B 站）', en: 'Understand RAG in 10 Minutes (Bilibili)' },
  monthly: { zh: '2026 年 10 月月报.pdf', en: 'October 2026 Monthly Report.pdf' },
  docker: { zh: 'Docker 技术入门与实战（第 4 版）.pdf', en: 'Docker: Introduction and Practice (4th Ed.).pdf' },
  weekly: { zh: 'AI 动态周报 · 第 40 周', en: 'AI Weekly Brief · Week 40' },
  aiFolder: { zh: 'AI 研究', en: 'AI research' },
  space: { zh: 'xiaohei 的空间', en: "xiaohei's space" },
} satisfies Record<string, { zh: string; en: string }>;
export type ResKey = keyof typeof RES;
export const resName = (k: ResKey, lang: Lang) => RES[k][lang];
