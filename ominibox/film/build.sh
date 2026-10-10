#!/bin/sh
# Living Screencast ·《小黑 OmniBox》产品介绍（中文，20.4 s）— 一键重建
#   sh build.sh [--vo]      --vo：重新合成配音（edge-tts，需联网）并用 whisper 校对
# 依赖 Lemo-Opuscar 库（渲染器、采样器、.venv）：默认 ~/Documents/Project/lemo-opuscar，可用 LEMO_OPUSCAR_HOME 覆盖
set -e
F=$(cd "$(dirname "$0")" && pwd)
LIB=${LEMO_OPUSCAR_HOME:-$HOME/Documents/Project/lemo-opuscar}; export LEMO_OPUSCAR_HOME=$LIB
PY=$LIB/.venv/bin/python
if [ "$1" = "--vo" ]; then
  $PY $F/tools/tts.py zh-CN-XiaoxiaoNeural +12%                    # 配音 + 词边界时间戳
  WM=${WM:-$LIB/core/tts/faster-whisper-small} $PY $F/tools/asr_check.py   # 逐句转写比对
fi
cd $LIB
node core/render/events.mjs $F                                    # 每个落地、弹出、按键 → events.json
$PY $F/sound.py                                                   # 配乐 + 音效 + 配音 → mix.wav
node core/render/video.mjs $F --fps 30 --workers 6 --out $F/out/video30.mp4
sh core/render/mux.sh $F/out/video30.mp4 $F/mix.wav $F/ominibox.mp4 30 0
node $F/tools/subs.mjs $F && $PY core/render/srt.py $F/out/subs.json $F/ominibox.srt
node core/render/still.mjs $F 19.7 --q nosubs=1 --prefix po_ --out $F/out/stills && cp $F/out/stills/po_19.7.jpg $F/poster.jpg
echo "built $F/ominibox.mp4"
