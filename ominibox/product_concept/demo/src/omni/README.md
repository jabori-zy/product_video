# omni/：OmniBox 网页端的真实 DOM（high_fidelity_v3 起）

片子里的 OmniBox 网页（A 首页与对话、D 资源树与 ⌘J 搜索、E 对话 / 周报 / Agent、M1/M2 笔记本里的网页）不再手画，而是用产品自己的 DOM 结构、class 和整份样式表渲染。浅色主题。

## 来源

- `public/omni/product.css`、`public/omni/demo.css`：取自 omnibox-art 仓库 `origin/feat/sidebar-guide-video-2655`（2008120）的 `assets/product/omnibox-ui/product-20261009.css` 与 `demo.css`，原样入库。那是用 ego-browser 从 test.omnibox.pro 导出的整份已加载样式表，`:hover` 已换成 `[data-demo-hover]`（悬停态由属性控制）。
- `public/omni/nav-logo.svg`：同一批 HTML 里侧栏「小黑」的图标。
- 组件结构与 class：照 omnibox-art 的 HTML 状态（home、chat-open、chats、resource-results、folder-expanded 等）逐字搬过来。
- omnibox-art 没有的状态，2026-10-15 用 ego-browser 在 test.omnibox.pro（pr-test 空间）实拍：思考强度弹层与四个档位（轻 / 中 / 高 / 最大）、回答里的引用角标与悬浮卡、生成中的「深度思考」「工具调用」折叠块、待确认的工具调用卡片（同意 / 拒绝）、「保存」按钮提示、各资源类型图标。实拍时设置已恢复默认，创建文件夹的请求点了「拒绝」，没有在测试账号里留下新资源（只多了一条对话记录）。
- `svg.ts`：上面所有来源里的 SVG 原样取出，按 lucide 名或用途命名（`res-pdf`、`res-zhihu` 等是资源类型图标）。

## 文件

| 文件 | 内容 |
|---|---|
| `root.tsx` | `Omni`：Shadow DOM 宿主，装样式表；产品视口 1440×810，`zoom` 4/3 铺满 1920×1080。`Ic`：产品图标 |
| `app.tsx` | 产品组件（侧栏、资源行、对话行、输入框、思考强度弹层、首页、对话页、引用、工具调用、待确认卡片、⌘J 搜索弹窗） |
| `svg.ts` | 图标表 |
| `Probe.tsx` | 校对用合成 `OmniProbe`：原始 HTML（`public/omni-ref/`）与组件同屏渲染逐像素比；`debug` 模式在画面上打印元素的产品像素坐标（光标目标从这里量） |

## 样式表在浏览器里的改写（`adaptCss`）

样式表原样入库，加载时做最小改写再放进 Shadow DOM，不让 Tailwind preflight 影响片子其他部分：

- `:root` / `html` / `body` → `:host` / `.omni-html` / `.omni-body`
- `vh` / `svh` / `dvh`、`vw` 按产品视口折成 px
- 宽度类 `@media` 按 1440 求值（画布是 1920，不能让 2xl 断点生效）；hover / pointer 按桌面求值

## 校对

```sh
npx remotion still OmniProbe out/probe/home-ref.png --props='{"state":"home","reference":true}'
npx remotion still OmniProbe out/probe/home-mine.png --props='{"state":"home"}'
```

2026-10-15：home 与原始 HTML 不同的像素 0.11%（只差一个子像素的行位置），⌘J 搜索弹窗 0.055%；chat-open 只有刻意换掉的内容不同。

## 已知差异

- 搜索弹窗用 `zoom` 渲染时，fixed 的 grid 会被拉满视口，高度写死为产品里的 640。
- 资源行的「解析中」和 `#AI` 标签在真实侧栏里没有对应元素，v3 去掉了（解析过程由 D 的四张卡片表现）。
- 「移动资源」「添加标签」两个工具名没有实拍到，按产品里「创建文件夹」「搜索资源」的写法补的。
- 英文版（FinalEn）的产品界面文字仍是中文（采样的是中文界面）。
