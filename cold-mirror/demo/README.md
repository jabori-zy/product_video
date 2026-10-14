# Cold Mirror · Remotion 预览（demo_v1）

按 `../result/script.md` 做的 32 s animatic（1920×1080，24 fps，120 BPM，16 镜每镜 1 小节）。正片由 Higgsfield 生成，这里只定节奏、镜头和转场。

```sh
npm install
python tools/assets.py      # ../assets → public/（需要 numpy + Pillow）
npm run music               # timing.json → public/soundtrack.wav，归一到 −14 LUFS / ≤ −2 dBTP
npm run render              # → out/demo_v1.mp4（会先跑 music）
node tools/stills.mjs 156 236 604   # 审片静图 → out/stills/
npm run studio
```

- **唯一时间源**：`src/timing.json`。画面（`src/scenes/Act1–3.tsx`）、配乐（`tools/music.mjs`）、素材（`tools/assets.py`）都读它；改节奏只改这里。
- **她的发色**：`public/her/*.jpg` 是从 `model.JPG` 抠头发、按发色库色卡重新上色得到的，脸逐像素不变，所以扫光前后严丝合缝。`初恋蓬松短发` 是 App 真实的换发型结果，按眼睛位置对齐。
- **STAND-IN**：换发型的镜头（狼尾、马尾、双马尾……）用的是发型库原图，模特不是她，画面右上角有黄色虚线标注。
- 黄色的镜号、时间码、动作说明只是预览标注。
- 片尾的字母和工具是从首页截图里裁出来的（`tools/assets.py` 把白底转成透明）。
