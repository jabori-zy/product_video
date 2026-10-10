# 小黑 OmniBox 产品介绍片 · 草稿 demo

- 成片：`out/demo.mp4`（1920×1080 · 30 fps · 45 s · 无配乐）
- 依据：`../result/script.md`（时间轴一一对应，右下角黄色标注当前段落和时间码，正式版删除）
- 简化：网页、设备、文档内容都是带标识的占位矩形；文字、转场、镜头运动完整实现
- 渲染：`npm run render`（约 30 s）；预览调整：`npm run studio`
- 依赖：`node_modules` 软链接到 `../../ominibox_概念视频v1/node_modules`（Remotion 4.0.529）

| 文件 | 内容 |
|---|---|
| `src/Main.tsx` | 八段排布与段间转场（甩镜、光点、光带擦除、分享按钮圆形展开） |
| `src/lib.tsx` | 时间工具（kf 关键帧、morph 共享元素变形、hop 弹跳）、摄像机、运动模糊、小黑、logo、光标、大字 |
| `src/ui.tsx` | OmniBox 网页端部件：侧栏、资源行、输入框、首页卡片 |
| `src/scenes/A–H.tsx` | 各段，局部时间 t = 全局时间 − 段起点 |
