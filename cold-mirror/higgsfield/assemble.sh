#!/bin/sh
# 把四段 Higgsfield 草稿接成 36 s 的竖版成片草稿，铺上 Remotion 预览同一条配乐（时间轴见 ../demo/src/timing.json）
#   seg1 0–12 s · seg2 12–22 s · seg3 22–30 s · seg4 取前 4 s（30–34 s）· endcard 34–36 s（Remotion 渲染的白色收尾卡，无预览标注）
# 片尾卡：cd ../demo && npx remotion render ColdMirrorDemo ../higgsfield/out/endcard.mp4 --frames=816-863 --props='{"hud":false}' --muted
# 用法：sh assemble.sh  → out/cold_mirror_draft_v1.mp4
set -e
cd "$(dirname "$0")"
FF="npx --prefix ../demo remotion ffmpeg"
for s in seg1 seg2 seg3 seg4; do
  [ -f out/$s.mp4 ] && continue
  URL=$(python3 -c "import json,re;t=open('out/$s.json').read();m=re.findall(r'https?://[^\"\s]+?\.mp4[^\"\s]*',t);print(m[0] if m else '')")
  [ -n "$URL" ] || { echo "no video url in out/$s.json"; exit 1; }
  curl -sSL "$URL" -o out/$s.mp4
done
# Remotion 自带的 ffmpeg 没有 fps / setpts / setsar 滤镜：所有片段本来就是 24 fps，trim 都从 0 开始，所以不需要
V='scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,format=yuv420p'
$FF -y -loglevel error \
  -i out/seg1.mp4 -i out/seg2.mp4 -i out/seg3.mp4 -i out/seg4.mp4 -i out/endcard.mp4 -i ../demo/public/soundtrack.wav \
  -filter_complex "[0:v]trim=0:12,$V[a];[1:v]trim=0:10,$V[b];[2:v]trim=0:8,$V[c];[3:v]trim=0:4,$V[d];[4:v]trim=0:2,$V[e];[a][b][c][d][e]concat=n=5:v=1:a=0[v]" \
  -map "[v]" -map 5:a -t 36 -c:v libx264 -crf 18 -preset medium -c:a aac -b:a 320k -movflags +faststart out/cold_mirror_draft_v1.mp4
echo "wrote out/cold_mirror_draft_v1.mp4"
