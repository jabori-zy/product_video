# 小黑 OmniBox · 产品介绍片提示词 v1（Remotion · 45 秒 · 无口播）

> 配套文件：分镜看 `script.md`（以它的时间为准），画面文字看 `产品功能slogon.md`，风格依据看 `../reference/参考视频特点.md`
> 素材：`../assets/小黑形象.jpg`（猫头六视图）；`../assets/*.mp4 / *.mov` 四段实机录屏**只作界面参考，不进成片**
> 可复用的工程：`../../ominibox_概念视频v1/`（Remotion 4.0.529、TransitionSeries、timing.json、配乐脚本）

---

## 1. 完整提示词（交给 agent 的版本）

```text
用 Remotion 4 做一支 45 秒的「小黑 OmniBox」中文产品介绍片。
规格：1920×1080，60 fps，2700 帧，响度 −14 LUFS。
没有口播、没有人声，只有音乐、音效和画面文字。
分镜严格按 产品视频/result/script.md 执行，画面文字一字不改，使用 产品功能slogon.md 里标 ★ 的条目。

【产品】小黑 OmniBox，你的 AI 知识伙伴。口号：万物变成记忆，记忆变成万物。
【结构】八段，对应「记录 · 理解 · 应用 · 开放」：
  A 开场「你好，小黑！」：黑底打字 → 小黑从左边探头、弹跳出来、跳到文字上、眨眼 → 小黑和文字一起落进对话框 → 发送，小黑回复（0–5 s）
  B 浏览器插件一键收藏（5–9 s）
  C 万物入口快闪（9–12 s）
  D 理解 · 万物变成记忆（12–18 s）
  E 应用 · 问答、写作、Agent 执行（18–30 s）
  F 分享协作（30–35 s）
  G 全平台与开源（35–39 s）
  H 口号和 logo（39–45 s）

【风格】综合三支参考片（细节见 参考视频特点.md）：
  ① LuxAlgo 式镜头：所有 UI 都是 3D 空间里的平面，被一台一直在运动的虚拟摄像机拍摄。
     特写与全景交替；点击后镜头推向点击点（点击推镜）；甩镜带方向性运动模糊；画面边缘有浅景深。
  ② Infinity AI 式排版：黑、白加一个强调色；大字逐词出现，一拍一个词；用圆点、光带这类形状做转场。
  ③ Motion Study 式组件：米白画布上，一个黑色组件用 spring 连续变形，
     按钮 → 加载 → 对勾 → 胶囊，光标是叙事主体。
  不允许有静止超过 1.5 秒的画面，不允许硬切到无关画面。每个转场都要有动机：点击、光点流动、光带、眼圈。

【主角】小黑：纯黑 #171717 圆脑袋，两只尖耳，奶油色 #FEF6EC 圆眼圈加黑瞳孔，没有嘴和身体（见 小黑形象.jpg）。
  它的眼睛是全片的母题：开场线稿小黑从输入框上沿探头，看着开场白落进来 → 聊天首页、设备阵列里的小黑都在眨眼 → 结尾光带收成眼圈，再合成 logo。

【开场（最重要的 5 秒）】
  0.4–1.5 s 黑底居中打字「你好，小黑！」（96 px 白字），模拟中文输入法：拼音 ni hao / xiao hei 带下划线，候选条一闪后上屏；
  每次按键都有机械键盘音，「！」重击落在拍点上。
  1.8–3.6 s 小黑登场。黑底上用线稿版小黑：奶油白描边、白眼圈、内部填 #0B0B0C，否则黑猫在黑底上看不见。
  造型与聊天首页的线稿猫头一致。
    · 1.8 探头：从屏幕左边缘探出耳朵 → 眼睛，看向文字，缩回一下，再探出大半个头并歪头。
    · 2.3 弹出：压扁预备 → 拉长起跳，走抛物线 → 落在文字左下方，压扁回弹，溅出三道短白线。
    · 2.8 跳上文字：更高的一跳，落在「小黑」两个字正上方；整行字被踩得下沉 6 px 再弹回。
    · 3.3 眨眼：转向镜头，眨一下。
    小黑只有头，所有移动都是整头弹跳，严格挤压拉伸（压扁 0.8 / 拉长 1.15，落地 spring damping 10）。
  3.6–4.25 s 小黑和文字同时过渡：文字缩小（96 → 15 px），滑进 OmniBox 聊天首页的输入框，取代「随便问点什么吧」；
  坐在文字上的小黑跟着一起移动、缩小，到达后滑到输入框上沿后方，变成首页那只探头的线稿小黑，落位眨眼。
  界面同时从黑底淡入（推荐问题气泡、手动确认、Agent 2.1、上传文档 / 最近更新 卡片）。4.0 s 全乐队进入。
  文字和小黑都必须是同一组元素连续运动，不能淡出再淡入两份。
  4.25 s 回车发送，文字变成右上的用户气泡，小黑缩回；小黑流式回复；5.0 s 甩镜进入浏览器。

【全部模拟，不贴录屏和截图】用 React + CSS 1:1 重绘：
  - macOS Chrome 窗口：红绿灯、标签栏、地址栏、书签栏、工具栏插件图标。
  - 第三方网页：知乎专栏、新闻站、B 站视频页、小红书笔记、X 帖子，内容按 script.md 第 3 节随机生成。
    只模仿版式和配色，logo 用文字代替。
  - 手机：iPhone 外框、微信聊天（联系人「小黑」）、OmniBox App（底栏 More / Record / Text，Resources / Chats）。
  - OmniBox 网页端深色模式：侧栏（空间名、小黑 / 通知 / 黑友社区 / 邀请有礼、资源 | 对话 胶囊切换、
    资源树、对话历史分组）、聊天首页（线稿小黑、推荐问题气泡、问候语、输入框）、对话页（深度思考、
    引用角标、消息操作图标）、⌘J 搜索、Agent 工具调用与「同意 / 拒绝 / 全部同意」。
  - 浏览器插件浮动卡片、黑色胶囊 toast、划词菜单。
  所有按钮名、菜单名都用产品里的官方文案（见本文第 3 节），不编造功能。

【节奏】120 BPM，1 拍 = 0.5 s = 30 帧，1 小节 = 2 s。
  0–4 s 是无鼓前奏（键盘声、拟音、轻铺底），4.0 s 全乐队进入，之后重拍落在偶数秒。
  转场落在重拍上并配 crash（5.0、9.0 两个甩镜落在小节第 3 拍）；点击、入库、开关翻转落在拍上；打字按十六分音符。
  第 29 秒和第 41.5 秒各抽空一次蓄力。

【音乐与音效】原创配乐，电子加原声混合，干净、明亮、有科技感。
  底鼓四拍；军鼓加拍手落在 2、4 拍；合成贝斯切分；钟琴负责品牌记忆点。
  拟音：机械键盘声（开场打字和后面所有输入框打字共用一套采样，字母键轻、空格和回车重）、点击、啵（入库）、叮（完成）、
  whoosh（甩镜，提前半拍起）、开关咔哒。开场 0–4 s 只有键盘声、底噪和小黑的拟音（探头「咕」、缩回「嗖」、起跳「啵」、落地「咚」、踩字「嘣」、眨眼钟琴单音），4.0 s 全乐队进入。
  音乐和画面共用 src/timing.json 一条时间线。

【交付】
  out/omnibox-product.mp4、poster.png、源码、一键 build.sh。
  tools/stills.mjs 可以按帧号批量导出静帧审片。
```

---

## 2. 工程结构建议

```
产品视频/remotion/
├─ src/
│  ├─ Root.tsx                 # Composition: OmniBoxProduct, 1920x1080, 60fps, 2700f
│  ├─ Product.tsx              # TransitionSeries 串 A–H 八段
│  ├─ timing.json              # 段落、转场、关键帧（帧号）唯一来源
│  ├─ data/                    # 模拟内容：zhihu.ts news.ts bili.ts xhs.ts x.ts wechat.ts resources.ts chats.ts answer.ts report.ts
│  ├─ theme.ts                 # 颜色、字体、圆角、阴影 token
│  ├─ camera/Camera3D.tsx      # perspective 容器 + 关键帧插值（x,y,z,rotX,rotY,scale,blur）
│  ├─ components/
│  │  ├─ Cursor.tsx            # macOS 光标，贝塞尔轨迹 + 按压态
│  │  ├─ Typewriter.tsx        # 按帧打字，十六分音符节奏，带光标闪烁；支持拼音 + 候选条的输入法模式，并输出按键事件给音效
│  │  ├─ TextToComposer.tsx    # 开场白大字 → 输入框文字的共享元素过渡
│  │  ├─ XiaoheiEyes.tsx       # 奶油色眼圈：睁眼 / 眨眼 / 看向
│  │  ├─ XiaoheiLineart.tsx    # 线稿猫头（开场黑底版 + 聊天首页版共用），支持眨眼、视线、歪头、挤压拉伸
│  │  ├─ XiaoheiHop.tsx        # 弹跳动画：预备压扁 → 抛物线起跳拉长 → 落地压扁回弹；输入起点、终点、弧高，输出 transform 和落地事件
│  │  ├─ Logo.tsx              # 蓝渐变圆角方形 + 探头黑猫
│  │  ├─ BigWords.tsx          # 逐词大字
│  │  ├─ browser/ChromeWindow.tsx  ZhihuArticle.tsx  NewsPage.tsx  BiliPage.tsx  XhsNote.tsx  XPost.tsx
│  │  ├─ extension/ExtCard.tsx  SaveMorph.tsx  Toast.tsx  SelectionMenu.tsx
│  │  ├─ phone/IPhone.tsx  WeChatChat.tsx  OmniApp.tsx
│  │  ├─ omnibox/AppShell.tsx  Sidebar.tsx  ResourceTree.tsx  ChatHistory.tsx  ChatHome.tsx
│  │  │          Composer.tsx  AnswerStream.tsx  Citation.tsx  ToolCalls.tsx  SearchModal.tsx
│  │  │          ParseTiles.tsx (PDF/OCR/转写/视频章节四格)  ShareCard.tsx  TeamSpace.tsx
│  │  └─ devices/DeviceFan.tsx  Terminal.tsx  RepoCard.tsx
│  ├─ transitions/  iris.tsx  whip.tsx  morph.tsx  dots.tsx  arc.tsx  push.tsx
│  └─ scenes/  A_Open.tsx  B_Extension.tsx  C_Sources.tsx  D_Understand.tsx  E_Apply.tsx
│              F_Share.tsx  G_Platform.tsx  H_Brand.tsx
├─ audio/music.py               # 读 timing.json 生成配乐和音效 → public/soundtrack.wav
└─ tools/stills.mjs
```

---

## 3. 设计 Token 与界面文案（以源码和录屏为准）

### 颜色

| Token | 值 | 用途 |
|---|---|---|
| `bg.brand` | `#0B0B0C` | A、G、H 段黑底 |
| `bg.canvas` | `#EDEDEA` | F 段米白画布；B 段桌面底色可用 `#E9E6E1` |
| `app.main` | `#262626` | OmniBox 深色主区 |
| `app.sidebar` | `#171717` | 深色侧栏 |
| `app.composer` | `#303030` | 深色输入框 |
| `text.primary` | `#EDEDED` / 浅色界面 `#171717` | — |
| `text.muted` | `#A1A1A1` / `#71717A` | — |
| `brand.gradient` | `#4A8EF9 → #B2D0FF` | logo、光带、引用角标、高亮 |
| `accent.blue` | `#3B82F6` | 邀请有礼礼物、升级图标 |
| `xiaohei.body` / `xiaohei.eye` | `#171717` / `#FEF6EC` | 小黑 |
| `toast` | `#171717`，圆角 16，白字 | 插件保存提示 |

字体：PingFang SC 或 Noto Sans SC；英文、数字用 Inter。圆角基准 8 px，卡片 16 px，胶囊 9999 px。

### OmniBox 网页端文案

- **侧栏**：空间名 + ⌄ ／「小黑」「通知」（红色数字角标）「黑友社区」「邀请有礼」（蓝色礼物图标）／ 胶囊「资源 | 对话」／ 资源区标题「个人」「团队」；对话 Tab 有「搜索聊天历史」「新建对话」；对话历史分组「今天」「过去 7 天」「2026 年 9 月」／ 底部「回收站」。
- **聊天首页**：
  - 问候语「晚上好，今天有什么可以帮您的吗？」
  - 输入框占位「随便问点什么吧」
  - 左下「＋」菜单：选择资源 / 添加图片 / 联网搜索 / 深度思考 / 本地搜索
  - 审批模式「手动确认 ⌄」
  - 右下模型「Agent 2.1」「Agent 1.1」，思考强度「轻 / 中 / 高 / 最大」
  - 发送键（生成中变成「停止」）
  - 下方卡片「上传文档 · 让知识为你所用 · 支持文档、网页、音频和视频等多种类型」，按钮「本地上传 / 微信助手 / 安装插件」；另一张卡片「最近更新」
- **对话页**：
  - 状态依次为「思考中」→ 可折叠的「深度思考」→「搜索中...」
  - 消息操作：重新生成 / 复制 / 将当前回复保存至个人空间 / 分享
  - 底部「内容由小黑 AI 生成，仅供参考」
  - Agent 审批按钮「同意 / 拒绝 / 全部同意」
- **资源页**：右上「编辑」「分享」和打开小黑侧栏的按钮，元信息「x 分钟前更新」。
- **分享**：需要登录、密码保护、过期时间、AI 问答（禁用 / 仅对话 / 启用）、复制链接；微信卡片标题「来自小黑 OmniBox 的对话」。

### 浏览器插件文案

- 浮动卡片：宽 288 px，圆角 16，白底，柔和阴影，固定在页面右上角。
  - 头部：小黑 logo、「小黑」，以及房子 / 反馈 / 齿轮三个灰色 `#8F959E` 图标
  - 主按钮「保存到小黑」：黑底，高 38 px，圆角 8，左侧盒子图标；点击后变成「保存中...」
  - 「保存到」行：个人 / 团队 + 文件夹
  - 「指定区域」开关：右侧「按住 ⌥」
- toast：「正在处理中」（带转圈）→「已保存到该文件夹」+「查看」
- 划词菜单：「复制 | 保存到小黑」

### 手机端文案（录屏可见）

顶栏是空间名加「Upgrade」；输入框「Ask anything」；分段「Resources | Chats」；底栏「More · Record · Text」；More 面板「Photo / Upload file / Link」。

---

## 4. 关键技法（Remotion 实现要点）

1. **Camera3D**
   - 外层 `perspective: 2400px`，内层 `transform: translate3d() rotateX() rotateY() scale()`。
   - 关键帧写在 timing.json，用 `interpolate` 加 `Easing.bezier(0.22, 1, 0.36, 1)` 插值。
   - 摄像机永远带一个很小的漂移（`@remotion/noise`，振幅 2–4 px、0.3°），避免死帧。
2. **景深**：特写时给非焦点层加 `filter: blur(6–14px)`，焦点层保持清晰；用渐变遮罩做边缘虚化。
3. **甩镜 T-WHIP**
   - 0.3 s 内位移 1.2–1.5 屏宽，速度曲线两头慢、中间快。
   - 运动模糊用 `@remotion/motion-blur` 的 `<CameraMotionBlur samples={8}>`，或者用多层错位半透明副本模拟。
   - 只有甩镜时才开启运动模糊。
4. **共享元素变形 T-MORPH**
   - 用一个 `MorphBox` 组件，输入前后两个状态的 `{x, y, w, h, radius, bg}`，用 `spring({damping: 14, mass: 0.8})` 插值。
   - 内容层交叉淡化（前一个状态的内容在 0–40% 时淡出，后一个在 40–100% 时淡入）。
   - 按钮点击态：先缩到 0.95，再回弹。
5. **眼圈 → logo（H 段）**：两个奶油色眼圈用 SVG 圆环绘制，光带的 `strokeDashoffset` 收尾时正好闭合成两个环；之后猫头剪影用 `clip-path` 从眼圈向外扩张，与 logo 对齐后交接。
6. **收点 T-DOT**：每张卡片缩成 8 px 蓝点，沿二次贝塞尔路径（`@remotion/paths`）飞向目标行，带 6 帧拖尾。
7. **光带 T-ARC**：SVG 路径加 `strokeDashoffset` 动画，描边用蓝色渐变，再叠 `blur` 发光副本。
8. **打字与流式输出**
   - 按帧切字符串；中文打字每 7–8 帧一个字（十六分音符），偶尔停顿 2–4 帧，模拟人手。
   - AI 回答按 token 流式出现，每 2 帧 2–4 个字。
9. **数字滚动**：「赞同 3.2 万」「播放 48.6 万」用 `interpolate` 加 `toLocaleString`。
12. **开场白 → 对话框（TextToComposer）**
    - 先在布局里量出输入框文字的目标位置和字号（隐藏渲染一次，或在 theme 里写死坐标）。
    - 同一个 `<span>` 从屏幕中心（96 px）插值到目标位置（15 px）：位置用 spring，字号用 `scale` 而不是 `font-size`，避免逐帧重排导致的抖动。
    - 输入框的占位文字在文字到达前 6 帧淡出；文字到达后把 span 交给 Composer 组件渲染，交接帧位置必须完全一致。
    - 输入法：拼音段用 `text-decoration: underline`；候选条是一个绝对定位的小条，显示 3–5 个候选、第一个高亮，按空格后消失。
    - 每次按键写一个 `{frame, type: "key" | "space" | "enter"}` 事件到 timing.json，由 music.py 放对应的键盘采样。
10. **渐变文字**：逐帧变化的 `background-clip: text` 在连续渲染时会糊（v1 已踩过的坑）。改用实色字加遮罩副本。
11. **确定性**
    - 所有随机内容用 `random(seed)`（remotion），不要用 `Math.random()`。
    - 字体用 `@remotion/fonts` 预加载，`delayRender` 等字体加载完成再渲染。

---

## 5. 审片检查清单

- [ ] 第 3、8、12、18、30、35、39 秒的转场都落在重拍上，并且有声画同步的 crash 或 whoosh
- [ ] 画面里出现的每一个 OmniBox 按钮名都能在第 3 节找到
- [ ] 侧栏对话历史可见（E 段 18–19.5 秒），并且有日期分组
- [ ] 开场「你好，小黑！」是同一个元素从黑底大字连续过渡进输入框，中间没有跳帧；每次按键都有键盘声
- [ ] 小黑探头 → 弹出 → 跳上文字 → 眨眼，每一步都有挤压拉伸和对应拟音；踩到文字时整行文字有回弹
- [ ] 小黑和文字是一起过渡的，小黑最终的位置和造型与聊天首页的探头小黑完全一致
- [ ] E 段对话历史「今天」分组的第一条是「你好，小黑！」，与开场呼应
- [ ] 小黑的眼睛出现在开场、聊天首页、设备阵列和 logo 中，首尾呼应
- [ ] 没有静止超过 1.5 秒的画面；文字停留不少于 0.8 秒（可读）
- [ ] 知乎、B 站等第三方页面只模仿版式，不出现真实 logo 图片
- [ ] 抽检静帧：`node tools/stills.mjs 60 90 120 150 180 204 230 255 330 408 468 600 840 1200 1350 1650 1920 2160 2460 2640`

## 6. 不要做

- 不贴录屏或截图，不使用真实用户数据和真实账号名。
- 不编造产品没有的功能或按钮（例如不要画「一键生成 PPT」）。
- 不加口播和字幕条，不加水印。
- 强调色只用品牌蓝，不要引入第二种强调色（标签胶囊可用低饱和多色）。
