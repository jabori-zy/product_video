# Cold Mirror · Remotion 预览（demo_v1）

按 `../result/script.md` 做的 32 s animatic（1920×1080，24 fps，120 BPM，16 镜每镜 1 小节）。正片由 Higgsfield 生成，这里只定节奏、镜头和转场。

```sh
npm install
python tools/assets.py      # ../assets → public/（需要 numpy + Pillow）
npm run music               # timing.json → public/soundtrack.wav（K-pop 舞曲 / EDM），归一到 −14 LUFS / ≤ −2 dBTP
npm run render              # → out/demo_v1.mp4（会先跑 music）
node tools/stills.mjs 156 236 604   # 审片静图 → out/stills/
npm run studio
```

- **人物动作 = 火柴人**（`src/stick.tsx`）：走路、撩头发、转身、举手机、跳下路沿、喝咖啡、坐进理发椅都用火柴人做，头发按当前造型画颜色和形状。照片只出现在「看发型」的镜头里：镜中特写、手机屏、自拍蒙太奇、镜子 / 橱窗里的倒影。
- **配乐**：K-pop 舞曲 / EDM，A 小调 Am–F–C–G，第 6 小节 Build（军鼓滚奏、噪声上升、最后半拍静音），第 7 小节 Drop（四踩、泵感 supersaw、808、人声切片）。
- **唯一时间源**：`src/timing.json`。画面（`src/scenes/Act1–3.tsx`）、配乐（`tools/music.mjs`）、素材（`tools/assets.py`）都读它；改节奏只改这里。
- **她的发色**：`public/her/*.jpg` 是从 `model.JPG` 抠头发、按发色库色卡重新上色得到的，脸逐像素不变，所以扫光前后严丝合缝。`初恋蓬松短发` 是 App 真实的换发型结果，按眼睛位置对齐。
- **STAND-IN**：手机屏和自拍蒙太奇里换发型的照片（狼尾、双马尾……）用的是发型库原图，模特不是她，画面右上角有黄色虚线标注。
- 黄色的镜号、时间码、动作说明只是预览标注。
- 片尾的字母和工具是从首页截图里裁出来的（`tools/assets.py` 把白底转成透明）。
