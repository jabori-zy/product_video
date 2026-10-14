#!/bin/sh
# Higgsfield 草稿生成：Seedance 2.5 draft（seedance_2_5 + --draft true），提示词从 prompts.md 读取
# 用法：sh generate.sh seg1 [cost]     # 加 cost 只估价不生成；结果写到 out/v2/
# 参考图只给她自己的脸：her/*.jpg 和 looks/*.png（v1 用发型库别的模特当参考，脸会跑偏）
set -e
cd "$(dirname "$0")"
mkdir -p out/v2
SEG=$1; MODE=${2:-create}
PUB=../demo/public
case $SEG in
  seg1) DUR=12; REFS="$PUB/her/原色.jpg $PUB/her/奶茶粉紫.jpg $PUB/her/初恋蓬松短发.jpg" ;;
  seg2) DUR=10; REFS="$PUB/her/原色.jpg $PUB/her/初恋蓬松短发.jpg looks/狼尾发.png looks/元气高马尾.png $PUB/her/蜂蜜茶色.jpg looks/日系双马尾.png" ;;
  seg3) DUR=8;  REFS="$PUB/her/原色.jpg looks/羊毛卷短发.png looks/蓬松鱼骨辫.png looks/高丸子头.png looks/优雅公主切.png" ;;
  seg4) DUR=6;  REFS="" ;;
  *) echo "usage: sh generate.sh seg1|seg2|seg3|seg4 [cost]"; exit 1 ;;
esac
# prompts.md 里「## segN」下面的引用块（> 开头的行）就是提示词
PROMPT=$(awk -v s="## $SEG " 'index($0, s) == 1 {on=1; next} /^## / {on=0} on && /^> / {sub(/^> /, ""); printf "%s ", $0}' prompts.md)
[ -n "$PROMPT" ] || { echo "no prompt for $SEG"; exit 1; }
ARGS="--draft true --aspect_ratio 9:16 --resolution 1080p --generate_audio false --duration $DUR"
if [ -n "$REFS" ]; then
  ARGS="$ARGS --mode omni_reference"
  for r in $REFS; do ARGS="$ARGS --image-references $r"; done
else
  ARGS="$ARGS --mode t2v"
fi
if [ "$MODE" = cost ]; then
  higgsfield generate cost seedance_2_5 --prompt "$PROMPT" $ARGS
else
  higgsfield generate create seedance_2_5 --prompt "$PROMPT" $ARGS --wait --wait-timeout 30m --json > out/v2/$SEG.json
  python3 -c "import json;d=json.load(open('out/v2/$SEG.json'));d=d[0] if isinstance(d,list) else d;print(json.dumps(d,ensure_ascii=False)[:600])"
fi
