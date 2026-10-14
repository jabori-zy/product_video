#!/bin/sh
# 发型定妆图：同一张脸（her/原色.jpg），只换发型 → looks/<名>.png
# 用 Seedream 5.0 Pro 改真人照片的头发；Seedance 生成视频时只把这些图当参考，避免把发型库模特的脸带进来
# 用法：sh looks.sh            # 全部生成（已存在的跳过）
set -e
cd "$(dirname "$0")"
PUB=../demo/public
BASE="Image 1 is the woman. Keep her face exactly identical to image 1: same eyes, eyebrows, nose, lips, face shape, skin tone and makeup, same expression, same white lace camisole and thin gold chain choker, same selfie pose, same camera angle and the same road background. Change ONLY her hair to the hairstyle shown in image 2:"
one() {  # 名字 发型库图 发型描述
  [ -f looks/$1.png ] && return
  J=$(higgsfield generate create seedream_v5_pro --prompt "$BASE $3. Photoreal, natural hairline." \
      --image-references $PUB/her/原色.jpg --image-references $PUB/$2 --aspect_ratio 2:3 --resolution 1.5k --wait --json)
  URL=$(printf '%s' "$J" | python3 -c "import json,sys;d=json.load(sys.stdin);d=d[0] if isinstance(d,list) else d;print(d['result_url'])")
  curl -sSL "$URL" -o looks/$1.png && echo "look $1"
}
one 狼尾发     lib/甜酷风_狼尾发.jpg     "a shaggy layered wolf cut with curtain bangs, jet black with vivid red streaks" &
one 元气高马尾 lib/欧美_元气高马尾.jpg   "a high bouncy ponytail, sunset orange colour" &
one 日系双马尾 lib/日式_日系双马尾.jpg   "Japanese-style twin tails with soft bangs, light ash blonde" &
one 羊毛卷短发 lib/甜酷风_羊毛卷短发.jpg "short fluffy curly hair, chestnut brown" &
one 蓬松鱼骨辫 lib/欧美_蓬松鱼骨辫.jpg   "a loose fluffy fishtail braid draped over one shoulder, light blonde" &
one 高丸子头   lib/日式_高丸子头.jpg     "a neat high bun on top of the head, dark brown" &
one 优雅公主切 lib/韩式_优雅公主切.jpg   "a long sleek hime cut with cheek-length side locks, platinum blonde" &
wait
