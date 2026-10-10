# 小黑 OmniBox · 概念产品片 v1

- 成片：`out/ominibox-concept.mp4`（1920×1080 · 30 fps · 600 帧 · 20 s · −14 LUFS）；封面 `poster.png`
- 提示词 / 分镜：`../prompt/ominibox_prompt_概念视频v1.md`
- 重建：`sh build.sh`；预览与调整：`npm run studio`

| 路径 | 作用 |
|---|---|
| `src/timing.json` | 唯一的节拍表（120 BPM，1 拍 = 15 帧）：场景 / 转场帧数和所有关键帧；画面与 `audio/music.py` 共用 |
| `src/Concept.tsx` | `TransitionSeries` 串起六场 + 五个转场 + 配乐 |
| `src/scenes/` | S1 睁眼 · S2 万物（9 个来源按拍飞入）· S3 变成记忆（扫描解析 → 星图）· S4 记忆变成万物（提问 → 引用 → 成果）· S5 快闪 · S6 品牌 |
| `src/transitions/` | 眼圈光圈 · 剪影吞噬 · 星图拉镜 · 液体融合 · 光漏闪白 |
| `src/components/` | 小黑轮廓 / logo、渐变光场、玻璃卡片、粒子、记忆星图 |
| `audio/music.py` | 原创配乐 + 音效 → `public/soundtrack.wav` |
| `tools/stills.mjs` | 一次打包渲染多帧静图审片：`node tools/stills.mjs 60 180 300` |

注意：逐帧改渐变的 `background-clip: text` 在连续渲染视频时会糊成色块（单帧静图正常），扫光效果用"实色字 + 遮罩副本"实现。
