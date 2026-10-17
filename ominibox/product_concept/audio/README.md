# AI 生成的成片声音（Higgsfield）

配乐和音效都由 Higgsfield 生成，再按画面的声音事件表（`../demo/audio/cues.ts`）逐个放到时间线上合成。事件时间与画面同源，改了画面节奏重跑合成即可，不用重新生成素材。

| 文件 | 内容 |
|---|---|
| `sfx.json` | 音效清单：文件名、对应的事件类型（kind）、生成提示词；`cuts` 从一条素材里截出单个声音（生成结果常含多下），每段算一个变体 |
| `generate.mjs` | 批量生成音效：`node generate.mjs [名字…]`，Seed Audio 1.0，4 条并行，已有的跳过 |
| `raw/` | 原始下载：38 条音效 `<name>.wav`（Seed Audio 1.0）+ 配乐 `bgm_1.m4a`（Sonilo Music，136 s，120 BPM 电子流行，纯器乐）；`bgm_1_with_vocals.m4a` 是第一版配乐（带人声，已弃用，留作素材） |
| `samples/` | 处理后的素材：44.1 kHz 单声道，切掉首尾静音、峰值归一到 −1 dBFS；`bgm.wav` 是立体声配乐 |
| `out/`、`out_en/` | 合成结果：`mix.wav`（总混，约 −14 LUFS）、`music.wav`（配乐分轨）、`sfx.wav`（音效分轨）；英文版只有打字声不同 |

## 重新合成

```sh
cd ../demo
npm run audio:ai          # → ../audio/out/mix.wav
npm run audio:ai -- en    # → ../audio/out_en/mix.wav
```

电平、变体轮换、打字的音高随机都在 `../demo/audio/sampled.ts`。

## 重新生成某条素材

改 `sfx.json` 里的提示词，删掉 `raw/<name>.wav`，再 `node generate.mjs <name>`；如果新素材里也有多下，按需要改 `cuts`。配乐：

```sh
higgsfield generate create sonilo_music --prompt "…" --duration 136 --wait
```

下载成 `raw/bgm_1.m4a` 后重跑合成。
