#!/bin/sh
# 小黑 OmniBox 概念片（Remotion，20 s，无口播）— 一键重建：配乐 → 渲染 → 封面
# 配乐依赖 Lemo-Opuscar 库的采样器与 .venv：默认 ~/Documents/Project/lemo-opuscar，可用 LEMO_OPUSCAR_HOME 覆盖
set -e
cd "$(dirname "$0")"
LIB=${LEMO_OPUSCAR_HOME:-$HOME/Documents/Project/lemo-opuscar}; export LEMO_OPUSCAR_HOME=$LIB
[ -d node_modules ] || npm install --no-audit --no-fund
$LIB/.venv/bin/python audio/music.py                       # → public/soundtrack.wav（−14 LUFS）
npx remotion render OmniBoxConcept out/ominibox-concept.mp4
ffmpeg -loglevel error -y -ss 19.5 -i out/ominibox-concept.mp4 -frames:v 1 poster.png
echo "built out/ominibox-concept.mp4"
