# 小黑 OmniBox 产品介绍片 · 草稿 demo

- 成片：`out/demo.mp4`（1920×1080 · 30 fps · 45 s · 无配乐）
- 依据：`../result/script.md`（时间轴一一对应，右下角黄色标注当前段落和时间码，正式版删除）
- 简化：网页、设备、文档内容都是带标识的占位矩形；文字、转场、镜头运动完整实现
- 渲染：`npm run render`（约 30 s）；预览调整：`npm run studio`
- 不限时长版：`npm run render:paced` → `out/demo-<秒>s.mp4`（当前 `demo-89s.mp4`）；同一套画面，`src/pace.ts` 把输出时间映射回脚本时间，只放慢不改内容；对应脚本 `../result/script-untimed.md`
- 手机版：`npm run render:app` → `out/demo-add_more_app.mp4`（≈119 s）；在不限时长版里插入两段手机操作（C+ 手机随手记、E+ 跨端接力），首尾定格在原片同一帧，衔接无缝；对应脚本 `../result/script-add_more_app.md`
- 依赖：`npm install`（Remotion 4.0.529）

| 文件 | 内容 |
|---|---|
| `src/pace.ts` | 不限时长版节奏表：每段脚本时间的放慢倍数（阅读处 2–6×，运动 1.3–1.8×，转场 ≈1.2×） |
| `src/appTimeline.ts` · `src/MainApp.tsx` | 手机版时间线：原片段（经 pace.ts）+ 插段；`Main` 的 `at` 参数把原片定格在某一帧 |
| `src/scenes/M1.tsx` · `M2.tsx` | 两段手机插段；`src/mobile/` 是按 omnibox-react-native 还原的手机端界面与舞台（笔记本、手机、镜头） |
| `src/Main.tsx` | 八段排布与段间转场（甩镜、光点、光带擦除、分享按钮圆形展开） |
| `src/lib.tsx` | 时间工具（kf 关键帧、morph 共享元素变形、hop 弹跳）、摄像机、运动模糊、小黑、logo、光标、大字 |
| `src/ui.tsx` | OmniBox 网页端部件：侧栏、资源行、输入框、首页卡片 |
| `src/scenes/A–H.tsx` | 各段，局部时间 t = 全局时间 − 段起点 |
