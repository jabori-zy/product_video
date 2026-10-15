# tools/sites：第三方网页快照（high_fidelity_v4 起）

片子里的知乎专栏文章页（B 收藏；v5 起 E 段的引用改在 OmniBox 里打开资源，不再用这一页）和 C 段走廊的 B 站、小红书、X 搜索结果页，用的是真实网页的 DOM 与样式，不再手画。

## 为什么不实时渲染

成片要逐帧确定、可重复：直接嵌入线上网页做不到（这些站不允许被 iframe 嵌入，登录态和推荐内容每次都变，还会把账号里别人的内容带进片子）。所以用 ego-browser（登录态）把页面在卡片同样的 CSS 视口下导出成静态快照，片子在本地渲染快照。

## 流程

```sh
sh tools/sites/export.sh            # 全部；或 sh tools/sites/export.sh x,zhihu
python3 -I tools/sites/build.py     # 全部；或 python3 -I tools/sites/build.py xhs
```

1. `targets.json`：每个站点的页面地址与 CSS 视口（与片子里卡片的视口一致：知乎 1200×630、B 站 960×600、小红书 1000×800、X 750×600）。
2. `export-site.mjs`（经 `export.sh` 交给 ego-browser 执行）：打开页面 → 跑 `prepare.js` → 导出静态 DOM（去掉脚本、iframe、事件、链接）和样式表清单 → `out/sites-raw/<站>/`（不入库，含实拍截图）。
3. `prepare.js`（在真实页面里执行）：给内容位打 `data-slot` 并清空，记录图片位尺寸（`data-w`/`data-h`）；去掉广告、多余结果、正文下方带原作者信息的模块；去掉埋点、`title`、`aria-label`、`alt`、`meta` 等可能带用户信息的属性。
4. `build.py`：合并样式表（`<style>` 用原文，外链重新下载原文件，脚本插入的才用 `cssRules`——后者会把 `padding: 0 var(--x)` 这类简写序列化成空值）；只保留真正用到的网页字体（X 的 TwitterChirp，其余站正文是系统字体）；界面图片、雪碧图下载到 `assets/`；用户内容（头像、封面、配图所在的域名）一律不下载、不保留。产物 `public/sites/<站>/index.html`、`style.css`、`assets/`，外加共用的 `public/sites/freeze.css`（停掉动画、过渡、光标、滚动条）。

## 片子里怎么用

`src/content/site.tsx` 的 `SitePage` 在同源 iframe 里加载快照（iframe 尺寸 = 导出时的视口，再整体缩放进卡片），用 React portal 往 `data-slot` 里填片子自己的内容（`data/locales` 的标题、作者、数字，绘制的封面和头像），样式全是网站自己的。`ZhihuPage` / `BiliSearch` / `XhsSearch` / `XSearch` 都在它上面。

知乎引文的位置（B 段光标、划词菜单要用）按快照实际排版量出，写在 `src/content/zhihu.tsx` 的 `QUOTE_1500`；换快照或改引文后用 `OmniProbe` 的 `zhihu` / `zhihu-en` 状态重量（`debug: ["quote-lines"]`）。

## 注意

- 搜索结果每次导出都可能不同（顺序、广告、卡片类型）。B 站这次第 3 张是课程卡片，`BiliSearch` 用 `ORDER` 把片子里的课程条目放过去；`prepare.js` 给 X 挑带「翻译自」和单张配图的帖子。重新导出后要看 `out/sites-raw/<站>-prep.png` 再对一遍。
- X 的 TwitterChirp 字体文件随快照入库，只用于渲染这个画面。
