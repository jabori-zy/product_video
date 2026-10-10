#!/bin/zsh
# usage: run.sh <shot> [take]
H=~/.local/bin/higgsfield
S=$1; T=${2:-1}
P=$(python3 -c "import json;j=[x for x in json.load(open('jobs.json')) if x['shot']==$S][0];print(j['prompt'])")
D=$(python3 -c "import json;print([x for x in json.load(open('jobs.json')) if x['shot']==$S][0]['duration'])")
IMGS=(--image a7cb795e-9628-4d72-a262-8349de9e3fde)
[ "$S" = 5 ] && IMGS+=(--image ac4cb129-7f9d-48f5-8c96-973300018267)
for a in 1 2 3; do
  $H generate create seedance_2_5 --prompt "$P" --mode omni_reference $IMGS --duration $D --resolution 1080p --aspect_ratio 16:9 --generate_audio false --wait --wait-timeout 30m --json > s${S}_t${T}.json 2>&1
  U=$(python3 -c "import json;print(json.load(open('s${S}_t${T}.json'))[0]['result_url'])" 2>/dev/null) && break
  sleep 5
done
[ -n "$U" ] && curl -fsSL --retry 3 -o s${S}_t${T}.mp4 "$U" && echo "shot $S done" || { echo "shot $S FAILED"; head -c 300 s${S}_t${T}.json; }
