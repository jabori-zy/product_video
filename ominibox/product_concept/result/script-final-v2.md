# 小黑 OmniBox · 产品介绍片 · Final v2（≈127.9 s）

> 成片：`../demo/out/ominibox_product_video_final_v2.mp4`（`npm run render:final -- final_v2`），英文 `ominibox_product_video_en_final_v2.mp4`（`-- final_v2 en`）。
> 只改结尾口号（H2，约 1:57–2:01），其余与 `script-final.md` 相同。

## 改动

- **口号顺序**：Final 里双行是「记忆变成万物 / 万物变成记忆」，顺序反了。现在互换后的「记忆 变成 万物」下移成第二行，「万物 变成 记忆」回到第一行逐词出现：先「万物变成记忆」，后「记忆变成万物」。
- **主标题卡**：

  | | 中文 | English |
  |---|---|---|
  | 主标题 | 随时随地<br>万物变成记忆<br>记忆变成万物 | Anytime, anywhere<br>everything becomes memory<br>memory becomes everything |
  | 副标题 | 记录、收藏、订阅、整理、问答、创作、分享、协作，一个就够了。 | Capture, save, subscribe, organize, ask, create, share, collaborate — one app is all you need. |

  「随时随地」较小、灰色，在两行口号上方；副标题在下方。两者淡入带音效（钟琴），之后和口号一起掉落。
- **小黑**改为跳上第一行的蓝色「记忆」，由它缩成 logo 方块（第二行的「记忆」随其他词掉落），不再挡住上一行。
- **停留**：标题卡从 2.0 s 加到 3.5 s（`H2.tsx` 的 `HOLD`、`audio/cues.ts` 的 `H_HOLD`）；`pace.ts` 结尾口号段相应加长 1.5 s，logo 之后的节奏（按钮、眨眼、淡出）不变。全片 126.4 → ≈127.9 s。

## 时间（成片秒）

| | 起点 |
|---|---|
| H 结尾 | 113.64 |
| 主标题卡（两行 + 随时随地 + 副标题） | ≈117.0–120.5 |
| 小黑跳上「记忆」 | ≈121.5 |
| logo | ≈122.9 |
| 结束 | ≈127.9 |
