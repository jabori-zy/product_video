import type { Content } from '../content';

// English: wording follows result/script.md and product-features-and-slogans.md
export const en: Content = {
  zhihu: {
    site: 'Zhihu', nav: ['Home', 'Following', 'For you', 'Trending'], search: 'Search topics you care about…', column: 'Column · AI Tools Watch',
    title: 'The Year of AI Agents: How Can Anyone Build a Second Brain?',
    author: 'Cat in the Woods', bio: 'Product manager · AI & personal productivity', follow: '+ Follow', date: 'Published 2026-09-21 · Shanghai',
    paras: [
      'Over the past year, large models went from talking to doing. Agents read your files, call tools and carry out whole sequences of steps for you. But they share one weakness: they forget you. Every chat starts from zero, while the articles you saved, the meetings you held and the whiteboards you photographed sit scattered across apps.',
      'A second brain gathers those fragments in one place, so AI can understand and organize them and bring them back when you need them. What matters is not how much you store, but whether you can ask for it in plain language and trace every answer back to its source.',
      'My routine is simple: save good content in one click, forward meeting recordings and photos to my assistant, and have it turn everything into a weekly report. Three months in, what changed is not how much I save, but that I now trust AI to remember for me.',
    ],
    quote: "A true second brain isn't a bookmark folder; it's a memory that can answer your questions.",
    upvote: 'Upvote 32k', comments: '1,284 comments', share: 'Share', save: 'Save',
  },
  news: {
    site: 'Tech Frontier Daily', nav: ['Top', 'AI', 'Chips', 'Startups', 'Opinion'], tag: 'Top story',
    headline: 'Chinese LLM Inference Costs Fall 90% in One Year',
    dek: 'A wave of price cuts puts a million tokens at a few cents. Analysts expect an application boom.',
    byline: 'By Yiran Zhou · 2026-10-08 09:30', more: 'Related',
    stories: ['Open model matches closed flagships on coding benchmarks', 'On-device AI chip shipments triple year over year', '"AI-native" apps pass 500 million monthly users'],
  },
  bili: {
    site: 'bilibili', title: 'Understand RAG in 10 Minutes: Teach an LLM Your Own Data', up: 'Code Bear', views: '486k views', danmaku: '3,201 comments',
    date: '2026-08-14', time: '03:42 / 10:08', chapters: ['Intro', 'Retrieval', 'Generation', 'Evaluation'], actions: ['👍 24k', '🪙 8,630', '⭐ 19k', '↗ Share'],
    frame: { docs: 'Your docs', store: 'Vector store', retrieve: 'Top-K search', llm: 'LLM', answer: 'Cited answer' },
  },
  xhs: {
    site: 'Xiaohongshu', title: 'My Notion Alternative: A Productivity Checklist', author: 'Productive Fawn', likes: '21k', saves: '13k',
    tiles: ['Calendar', 'Notes', 'To-dos', 'Wiki', 'Review'], tags: '#productivity #secondbrain #Notion',
  },
  x: {
    name: 'AI Daily', handle: '@ai_daily', text: 'Agents that remember are the next platform shift.', time: '9:41 AM · Oct 7, 2026',
    stats: ['1,204 Reposts', '386 Quotes', '9,876 Likes', '2,310 Bookmarks'], translate: '',
  },
  wechat: {
    contact: 'Xiaohei', pdf: 'Q3 Product Review.pdf', pdfSize: '2.4 MB', voice: '12″', photo: 'Whiteboard', note: 'Weekly meeting conclusions #meeting', input: 'Message',
    boardLines: ['Q4 goal', 'DAU ×2'],
  },
  app: {
    space: "xiaohei's space", tabs: ['Resources', 'Chats'], greet: 'Good evening. How can I help you today?', ask: 'Ask anything', recent: 'Recently updated',
    items: [['📕', 'Q3 Product Review.pdf'], ['🎙', 'Weekly Meeting Recording.m4a'], ['🖼', 'Whiteboard Photo.jpg'], ['🌐', 'The Year of AI Agents… (Zhihu)']],
    bottom: ['More', 'Record', 'Text'],
  },
  rss: {
    folder: 'RSS subscriptions', feeds: '3 feeds · saved automatically', badge: '+3',
    articles: [
      ['Silicon Weekly', 'Agent frameworks this week: who is building long-term memory?', '2 min ago'],
      ['Product Musings', 'Memory is the next piece of the AI product puzzle', '18 min ago'],
      ['Open Source Watch', 'Run a local knowledge base on your laptop with Ollama', '1 hr ago'],
    ],
  },
  pdf: {
    file: 'Q3 Product Review.pdf', title: 'Q3 Product Review', date: 'October 2026 · Product team', sections: ['1. Key metrics', '2. Problems and causes', '3. Q4 plan'],
    kpis: [['DAU', '124k ↑18%'], ['Week-2 retention', '41% ↑3pt'], ['Saves', '860k ↑52%']],
    extract: [
      'Q3 Product Review · October 2026',
      '1. Key metrics: DAU 124k, +18% QoQ',
      'Week-2 retention 41%; saves 860k (+52%)',
      '2. Problem: low first-week activation',
      'Cause: scattered import paths; 23% install the extension',
      '3. Q4 plan: ship the extension on Friday',
      'Goal: double DAU; move to biweekly releases',
      'Owner: Lin · Review due by Friday',
      'Appendix: channel data and interview notes',
    ],
    label: 'Extracted text',
  },
  board: { lines: ['Q4 goal: double DAU', 'Releases: biweekly', 'Owner: Lin'], sticky: ['Extension!', 'Friday'] },
  keyframes: ['Intro', 'Retrieval', 'Generation', 'Evaluation'],
  answer: {
    heads: ['1. From conversation to action: agents start doing the work', '2. Long-term memory becomes standard', '3. Personal knowledge bases become AI context'],
    bodies: [
      'Agents no longer just answer. They call tools, create files and move resources, finishing a whole sequence once you approve. The Zhihu article you saved calls this "the year of AI agents."',
      'Assistants that forget when the chat ends are being left behind. The discussion on X argues that agents that remember are the next platform shift, and products are racing to add long-term memory.',
      'Instead of pasting material again each time, let AI read your knowledge base directly. Retrieval-augmented generation, as "Understand RAG in 10 Minutes" explains, makes your documents the basis of every answer.',
    ],
    sources: ['The Year of AI Agents… (Zhihu)', 'X · @ai_daily', 'Understand RAG in 10 Minutes (Bilibili)'],
    note: 'Sources',
  },
  report: {
    title: 'AI Weekly Brief · Week 40', toc: "Contents: This week's highlights · Key sources · Action items", heads: ["1. This week's highlights", '2. Key sources', '3. Action items'],
    highlights: [
      'Agents move from chat to action: major products now ship tool calls with approval steps.',
      'Long-term memory is becoming standard; "it remembers you" is now a selling point.',
      'Chinese LLM inference costs fell 90% in a year, opening a window for applications.',
      'RAG remains the main way to make AI understand private data.',
      'Internal: the extension ships soon; the DAU goal is to double.',
    ],
    sources: [
      '"The Year of AI Agents: How Can Anyone Build a Second Brain?" · Zhihu',
      '"Chinese LLM Inference Costs Fall 90% in One Year" · Tech Frontier Daily',
      '"Understand RAG in 10 Minutes" · Bilibili · Code Bear',
      'Q3 Product Review.pdf · Weekly Meeting Recording.m4a · Whiteboard Photo.jpg',
      'X @ai_daily: Agents that remember are the next platform shift.',
    ],
    cols: ['Item', 'Owner', 'Status'],
    todos: [['Ship the extension by Friday', 'Lin', 'In progress'], ['Break down the DAU goal', 'Wang', 'Not started'], ['Retro meeting next week', 'Everyone', 'Scheduled']],
  },
  readme: {
    repo: 'import-ai / omnibox', tabs: ['Code', 'Issues', 'Pull requests', 'Discussions'],
    desc: 'Xiaohei OmniBox: your AI knowledge companion. Save, understand, ask and create. Everything becomes memory. Memory becomes everything.',
    badges: ['License · Apache-2.0', 'Docker · ready', 'Ollama · offline'], quick: 'Quick start',
    cmds: ['git clone https://github.com/import-ai/omnibox.git', 'cd omnibox && docker compose up -d'],
    feats: ['✓ Webpages, docs, images, audio and video in one place', '✓ Answers with sources, every time', '✓ Self-host and run offline with Ollama'],
  },
  devices: {
    web: { space: "xiaohei's space", nav: ['Xiaohei', 'Notifications', 'Community'], tabs: ['Resources', 'Chats'], greet: 'Good evening. How can I help?', ask: 'Ask anything' },
    ext: { name: 'Xiaohei', save: '📦 Save to Xiaohei', to: 'Save to: Personal', area: 'Specific area · Hold ⌥' },
    ios: { greet: 'Good evening', ask: 'Ask anything', bottom: ['More', 'Record', 'Text'] },
    android: { title: 'Resources', items: ['Q3 Product Review.pdf', 'Meeting Recording.m4a', 'Whiteboard Photo.jpg', 'AI Weekly Brief', 'Understand RAG'] },
    wechat: { title: 'Xiaohei', msgs: [[true, 'Meeting conclusions #meeting'], [false, 'Saved to Personal, tagged #meeting ✓'], [true, "Last week's action items?"], [false, '3 items: extension, DAU plan, retro']] },
    qq: { title: 'Xiaohei', msgs: [[true, 'Save this article for me'], [false, 'Saved ✓ Summary ready'], [true, 'What are the key points?'], [false, 'Three: action, memory, knowledge']] },
  },
  files: {
    zhihu: 'Zhihu Article · The Year of AI Agents', news: 'News Site · Tech Frontier Daily', bili: 'Bilibili Video · Understand RAG in 10 Minutes', xhs: 'Xiaohongshu Post · My Notion Alternative',
    x: 'X Post · @ai_daily', wechat: 'WeChat Chat · Xiaohei', app: 'OmniBox App · Home', rss: 'RSS Subscription Folder',
    pdf: 'PDF Page · Q3 Product Review', board: 'Whiteboard Photo · Q4 Goals', frame: 'Video Frame · RAG Explained', keyframes: 'Chapter Key Frames · Intro Retrieval Generation Evaluation',
    answer: 'AI Answer · Three Trends', report: 'AI Weekly Brief · Week 40', readme: 'GitHub README · import-ai omnibox',
    'dev-web': 'Device · OmniBox Web in Browser', 'dev-ext': 'Device · Browser Extension', 'dev-ios': 'Device · iPhone App', 'dev-android': 'Device · Android',
    'dev-wechat': 'Device · WeChat Xiaohei', 'dev-qq': 'Device · QQ Xiaohei',
  },
};
