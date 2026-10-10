"""edge-tts 中文配音 → voices/<id>.wav（48k 单声道，去首尾静音）+ voices/dur.json + voices/words.json（词边界时间戳，秒，相对裁剪后的起点）
用法：python tools/tts.py [voice] [rate]"""
import asyncio, json, os, subprocess, sys, numpy as np, soundfile as sf, edge_tts
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); os.chdir(HERE)
V = sys.argv[1] if len(sys.argv) > 1 else 'zh-CN-XiaoxiaoNeural'
RATE = sys.argv[2] if len(sys.argv) > 2 else '+12%'
lines = json.load(open('lines.json')); dur, words = {}, {}

async def say(L):
    c = edge_tts.Communicate(L.get('say', L['text']), V, rate=L.get('rate', RATE), pitch=L.get('pitch', '+0Hz'), boundary='WordBoundary')
    mp3, wb = b'', []
    async for ch in c.stream():
        if ch['type'] == 'audio': mp3 += ch['data']
        elif ch['type'] == 'WordBoundary': wb.append([ch['text'], ch['offset'] / 1e7, (ch['offset'] + ch['duration']) / 1e7])
    return mp3, wb

def say_retry(L, n=5):
    for k in range(n):
        try: return asyncio.run(say(L))
        except Exception as e: print('  retry', L['id'], type(e).__name__); import time; time.sleep(2 + k * 2)
    raise SystemExit('edge-tts failed for ' + L['id'])

for L in lines:
    mp3, wb = say_retry(L)
    p = f"voices/{L['id']}.mp3"; w = f"voices/{L['id']}.wav"; open(p, 'wb').write(mp3)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', p, '-ar', '48000', '-ac', '1', w], check=True)
    a, sr = sf.read(w); thr = np.abs(a).max() * .02; nz = np.where(np.abs(a) > thr)[0]
    s0 = max(0, nz[0] - int(.02 * sr)); a = a[s0: nz[-1] + int(.12 * sr)]; sf.write(w, a, sr); os.remove(p)
    off = s0 / sr; dur[L['id']] = round(len(a) / sr, 3)
    words[L['id']] = [[t, round(max(0, b - off), 3), round(e - off, 3)] for t, b, e in wb]
    print(L['id'], dur[L['id']], 's ', ' '.join(f'{t}@{b:.2f}' for t, b, _ in words[L['id']]))
json.dump(dur, open('voices/dur.json', 'w'), indent=1); json.dump(words, open('voices/words.json', 'w'), ensure_ascii=False, indent=0)
print('voice', V, RATE, 'total', round(sum(dur.values()), 2))
