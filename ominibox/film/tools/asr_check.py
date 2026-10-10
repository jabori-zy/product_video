"""用 faster-whisper 把每句配音转写回文字，和台词逐字比对（去标点）"""
import json, os, re, sys
from faster_whisper import WhisperModel
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); os.chdir(HERE)
M = WhisperModel(os.environ.get('WM', 'small'), device='cpu', compute_type='int8')
nrm = lambda s: re.sub(r'[\s，。、！？,.!?：:]', '', s).upper()
bad = 0
for L in json.load(open('lines.json')):
    segs, _ = M.transcribe(f"voices/{L['id']}.wav", language='zh', initial_prompt='小黑 OmniBox，简体中文。')
    got = ''.join(s.text for s in segs); ok = nrm(got) == nrm(L.get('asr', L['text']))
    bad += not ok; print('OK ' if ok else 'BAD', L['id'], L['text'], '→', got)
sys.exit(1 if bad else 0)
