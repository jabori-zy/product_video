#!/bin/sh
# 从 ego-browser（登录态）导出第三方网页快照：sh tools/sites/export.sh [zhihu,bili,xhs,x]
# ego-browser 的 node 进程拿不到 shell 的环境变量和工作目录，这里把它们写在脚本最前面
cd "$(dirname "$0")/../.." || exit 1
{ printf "process.env.DEMO=%s; process.env.SITES=%s;\n" "'$PWD'" "'${1:-}'"; cat tools/sites/export-site.mjs; } | ego-browser nodejs
