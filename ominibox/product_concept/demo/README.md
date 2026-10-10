# 小黑 OmniBox 产品介绍片

- **Final 成片**：`npm run render:final -- final` → `out/ominibox_product_video_final.mp4`（≈126 s；转场卡小节线、按段编曲、−14 LUFS / −1.5 dBTP、标题垫底、镜头推近；改动见 `../result/script-final.md`）；审片截图 `node tools/stills.mjs [--scale=0.33] <秒>…` → `out/stills/`
- **v2 成片**：`npm run render:final -- v2` → `out/ominibox_product_video_v2.mp4`（≈124 s，1920×1080，30 fps，含方案二声音）；先按当前时间线重建声音，再渲染 Final、合成。脚本 `../result/script-v2.md`；v1 成片保留在 `out/ominibox_product_video_v1.mp4`
- **英文成片**：`npm run render:final -- v1 en` → `out/ominibox_product_video_en_v1.mp4`（组件 `FinalEn`，画面与时长同中文版）。文案切换走 `src/i18n.tsx`（`useTr` / `useRes` / `textW`）、`src/copy.ts`（打字文案、开场按键、资源名，画面与声音共用）、`src/data/locales/en.ts`；英文更宽的地方（开场、结尾口号与品牌名）按实测宽度排版；英文打字保持中文版总时长，声音按英文按键重算（`npm run audio -- en` → `audio/out/music2_en/`）

- 成片：`out/demo.mp4`（1920×1080 · 30 fps · 45 s · 无配乐）
- 依据：`../result/script.md`（时间轴一一对应，右下角黄色标注当前段落和时间码，正式版删除）
- 简化：网页、设备、文档内容都是带标识的占位矩形；文字、转场、镜头运动完整实现
- 渲染：`npm run render`（约 30 s）；预览调整：`npm run studio`
- 不限时长版：`npm run render:paced` → `out/demo-<秒>s.mp4`（成片已删除，需要时重新渲染）；同一套画面，`src/pace.ts` 把输出时间映射回脚本时间，只放慢不改内容；对应脚本 `../result/script-untimed.md`
- 手机版：`npm run render:app` → `out/demo-add_more_app.mp4`（≈119 s）；在不限时长版里插入两段手机操作（C+ 手机随手记、E+ 跨端接力），首尾定格在原片同一帧，衔接无缝；对应脚本 `../result/script-add_more_app.md`
- 结尾改版：`npm run render:slogan` → `out/demo_modify_slogon.mp4`；同手机版，只把 H 段换成方案 A「回文翻转」（`src/scenes/H2.tsx`）；对应脚本 `../result/script-modify_slogon.md`
- 声音（方案二：音乐主导、120 BPM 卡拍子）：`npm run audio` → `out/demo_music2.mp4`；事件表 `audio/cues.ts`（`buildCues(lang)`）取自画面时间线，音色 `audio/voices.ts`，方案 `audio/plans.ts`；分轨 WAV（drums / bass_synth / melody / transitions / ui_keys / xiaohei）在 `audio/out/music2/`（不入库）；猫叫为 CC0 录音，见 `audio/samples/CREDITS.md`
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
