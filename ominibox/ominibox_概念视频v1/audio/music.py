"""小黑 OmniBox 概念片配乐 + 音效 → public/soundtrack.wav（20 s，120 BPM，C 大调，无人声）
时间全部来自 src/timing.json（与画面同源）。合成器声部用 numpy 合成；钢琴 / 钟琴 / 弦乐 / 军鼓 / 拍手 / 踩镲
用 Lemo-Opuscar 采样库（CC0 / CC BY，见 CREDITS）。
结构：0–2 氛围 pad + 心跳 → 2 底鼓、pluck 琶音、贝斯 → 6 clap、十六分踩镲 → 10 全编曲 + lead →
15 抽掉底鼓、滤波扫频、军鼓滚奏，15.87 静默 → 16 drop → 18 Cmaj9 大和弦延音到结尾。
用法：LEMO_OPUSCAR_HOME=<库> <库>/.venv/bin/python audio/music.py"""
import os, sys, json, subprocess, numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt, sosfilt_zi
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
LIB = os.environ.get('LEMO_OPUSCAR_HOME', os.path.expanduser('~/Documents/Project/lemo-opuscar')); sys.path.insert(0, LIB)
from core.audio import sampler as S
from core.audio.sfx import add as _add, limit, compress
SR = 48000; S.seed(11); rng = np.random.default_rng(11)
TM = json.load(open(os.path.join(ROOT, 'src', 'timing.json'))); K = TM['k']; FPS = TM['fps']
f2s = lambda f: f / FPS
B = 60 / TM['bpm']; BAR = 4 * B; DUR = TM['total'] / FPS; NS = int((DUR + 1) * SR)
hz = S.hz; midi = S.midi
def tt(d): return np.arange(int(round(d * SR))) / SR
def lp(x, f, o=2): return sosfilt(butter(o, min(f, SR / 2 - 100), 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)
def st(x): return np.asarray(x, np.float32)
def add(buf, x, at, gain=1., pan=0.):
    """单声道 → 按声像放进立体声 buffer；(N,2) 的直接叠加"""
    x = np.asarray(x, np.float32)
    if x.ndim == 1: return _add(buf, x, at, gain, pan)
    s0 = int(round(at * SR)); e = min(len(buf), s0 + len(x)); buf[s0:e] += x[:e - s0] * gain

# ───────── 振荡器
def saw(f, d, phase=0.):
    """polyBLEP 锯齿波，f 可为常数或逐样本数组"""
    n = int(round(d * SR)); fr = np.full(n, float(f)) if np.isscalar(f) else f[:n]
    dt = fr / SR; ph = (phase + np.cumsum(dt)) % 1.0; y = 2 * ph - 1
    m = ph < dt; x = ph[m] / dt[m]; y[m] -= x + x - x * x - 1
    m = ph > 1 - dt; x = (ph[m] - 1) / dt[m]; y[m] -= x * x + x + x + 1
    return y
def supersaw(p, d, voices=7, det=.18, seed=0):
    r = np.random.default_rng(seed); f0 = hz(p); y = np.zeros(int(round(d * SR)))
    for v in range(voices):
        c = (v - (voices - 1) / 2) / ((voices - 1) / 2); y += saw(f0 * 2 ** (c * det / 12), d, r.random()) * (1 - .3 * abs(c))
    return y / voices
def adsr(d, a=.01, dcy=.1, s=.7, r=.2):
    n = int(round(d * SR)); t = tt(d); e = np.where(t < a, t / max(a, 1e-4), s + (1 - s) * np.exp(-(t - a) / max(dcy, 1e-4)))
    rn = min(n, int(r * SR)); e[n - rn:] *= np.linspace(1, 0, rn) ** 2 if rn else 1; return e
def sweep_lp(x, f0, f1, blocks=80):
    """分块时变低通（滤波扫频）"""
    y = np.zeros_like(x); n = len(x); edges = np.linspace(0, n, blocks + 1).astype(int); zi = None
    for i in range(blocks):
        f = f0 * (f1 / f0) ** (i / (blocks - 1)); sos = butter(2, min(f, SR / 2 - 100), 'low', fs=SR, output='sos')
        if zi is None: zi = sosfilt_zi(sos) * x[0]
        y[edges[i]:edges[i + 1]], zi = sosfilt(sos, x[edges[i]:edges[i + 1]], zi=zi)
    return y

# ───────── 和弦（每小节一个，从 2.0 s 开始；前奏是 Cmaj9）
CH = {'C9': ['C3', 'E3', 'G3', 'B3', 'D4'], 'F': ['F3', 'A3', 'C4', 'E4'], 'G': ['G3', 'B3', 'D4', 'E4'], 'Em': ['E3', 'G3', 'B3', 'D4'], 'Am': ['A3', 'C4', 'E4', 'G4']}
ROOT_ = {'C9': 'C2', 'F': 'F1', 'G': 'G1', 'Em': 'E2', 'Am': 'A1'}
PROG = ['C9', 'F', 'G', 'Em', 'Am', 'F', 'G', 'Em', 'F', 'C9', 'C9']
def chord_at(t): return PROG[min(len(PROG) - 1, int(t // BAR))]
T_KICK, T_CLAP, T_FULL, T_BRK, T_SIL, T_DROP, T_CHORD = 2.0, 6.0, 10.0, 15.0, f2s(K['silence']), f2s(K['drop']), f2s(K['chord'])

pad = np.zeros((NS, 2), np.float32); syn = np.zeros((NS, 2), np.float32); drm = np.zeros((NS, 2), np.float32); fx = np.zeros((NS, 2), np.float32)

# 1. Pad（supersaw 和弦，左右声道各一组去相关）：前奏低通 + 渐开；15 s 扫频收紧；drop 后全开
for b in range(len(PROG)):
    t0 = b * BAR
    if t0 >= DUR: break
    d = BAR + .3; ch = CH[chord_at(t0)]
    for ci, c in enumerate((0, 1)):
        y = sum(supersaw(p, d, 7, .22, seed=b * 10 + ci * 5 + j) for j, p in enumerate(ch)) / len(ch)
        y *= adsr(d, .08 if b else 1.2, .5, .85, .3)
        cut = 900 if b == 0 else 2400 if t0 < T_FULL else 3600
        if T_BRK <= t0 < T_DROP: y = sweep_lp(y, 3600, 500)
        y = lp(y, cut).astype(np.float32); s0 = int(t0 * SR); e = min(NS, s0 + len(y)); pad[s0:e, c] += y[:e - s0] * .5   # 左右各一组，天然宽
# 前奏另起一个 swell：睁眼时 pad 从暗到亮
sw = sweep_lp(sum(supersaw(p, 2.1, 5, .15, seed=90 + j) for j, p in enumerate(CH['C9'])) / 5 * adsr(2.1, 1.0, .5, .9, .1), 300, 2600)
add(pad, st(sw.astype(np.float32)), f2s(K['eyeOpen']) - .3, .25, 0)

# 2. Pluck 琶音：2 s 起八分，6 s 起十六分；drop 后十六分
def pluck(p, d=.25, v=.3):
    y = saw(hz(p), d) * np.exp(-tt(d) / .07); return lp(y, 3500) * v
t = T_KICK; i = 0
while t < DUR - .1:
    if T_SIL <= t < T_DROP: t += B / 4; continue                         # 静默的四分之一拍
    step = B / 2 if t < T_CLAP else B / 4
    ch = CH[chord_at(t + 1e-3)]; seq = ch + [S.name(midi(ch[1]) + 12), S.name(midi(ch[2]) + 12)]
    p = S.name(midi(seq[i % len(seq)]) + 12); v = .22 if t < T_FULL else .26
    if t >= T_CHORD + 1.0: v *= max(0, 1 - (t - T_CHORD - 1) / 1.5)
    if v > 0: add(syn, st(pluck(p, .22, v).astype(np.float32)), t, 1, .35 if i % 2 else -.35)
    t += step; i += 1

# 3. 贝斯：house 反拍 sub + 八度；10 s 后切分
def bassnote(p, d, v=.6):
    t = tt(d); f = hz(p); y = np.sin(2 * np.pi * f * t) + .35 * np.sin(4 * np.pi * f * t) + .15 * saw(f * 2, d)   # 加谐波，小喇叭也听得到
    return lp(y * adsr(d, .005, .15, .8, .05), 900) * v
for n in range(int(T_KICK / B), int(DUR / B)):
    t = n * B
    if T_BRK <= t < T_DROP or t >= T_CHORD + .1: continue
    r = ROOT_[chord_at(t + 1e-3)]
    add(syn, st(bassnote(S.name(midi(r) + 12), B * .45, .32).astype(np.float32)), t + B / 2, 1, 0)
    if t >= T_FULL and n % 4 == 3: add(syn, st(bassnote(S.name(midi(r) + 19), B * .2, .4).astype(np.float32)), t + B * .75, 1, 0)
add(syn, st(bassnote('C2', 2.4, .7).astype(np.float32)), T_CHORD, 1, 0)

# 4. 鼓：合成底鼓；采样拍手 / 军鼓 / 踩镲 / crash
def kick(v=1.):
    d = .42; t = tt(d); f = 45 + 120 * np.exp(-t / .035); y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .16)
    y[:int(.004 * SR)] += rng.standard_normal(int(.004 * SR)) * .3; return (y * v).astype(np.float32)
KICKS = []
for n in range(int(T_KICK / B), int(DUR / B)):
    t = n * B
    if T_BRK <= t < T_DROP or t > T_CHORD + 1.2: continue
    add(drm, st(kick(1. if n % 4 == 0 else .9)), t, .6, 0); KICKS.append(t)
EVN = []
for n in range(int(T_CLAP / B), int(DUR / B)):
    t = n * B
    if T_BRK <= t < T_DROP or t > T_CHORD + 1.2: continue
    if n % 4 in (1, 3): EVN += [(t, 'claps', None, .3, .6, .1), (t, 'drum_kit', 'snare_2', .3, .35, .05)]
    for q in (0, .25, .5, .75): EVN.append((t + q * B, 'drum_kit', 'hi_hat_closed', .08, .32 if q == .5 else .18, .3))
    if t >= T_FULL and n % 2: EVN.append((t + B / 2, 'drum_kit', 'hi_hat_open', .2, .22, -.3))
for n in range(int(T_KICK / B), int(T_CLAP / B)): EVN.append((n * B + B / 2, 'drum_kit', 'hi_hat_closed', .08, .22, .3))
for t0 in [T_KICK, T_CLAP, T_FULL, T_DROP]: EVN.append((t0, 'drum_kit', 'crash_left', 2.2, .55, -.2))
for k in range(int((T_SIL - T_BRK) / (B / 4))): EVN.append((T_BRK + k * B / 4, 'drum_kit', 'snare_1', .12, .22 + .5 * k / 7, .1))   # 军鼓十六分渐强
EVN.append((T_CHORD, 'drum_kit', 'crash_right', 3.5, .7, .2))
# 钢琴 + 弦乐 + 钟琴：drop 后的大和弦
for j, p in enumerate(['C3', 'G3', 'E4', 'B4', 'D5', 'G5']): EVN.append((T_CHORD + j * .025, 'piano', p, 2.6, .5, -.15 + j * .06))
for p in ['E4', 'G4', 'B4', 'D5']: EVN.append(dict(t=T_CHORD, inst='violins', pitch=p, dur=2.3, vel=.35, pan=.1, attack=.2))
for j, p in enumerate(['C6', 'E6', 'G6', 'B6', 'D7', 'G7']): EVN.append((T_CHORD + .08 + j * B / 4, 'glockenspiel', p, 1.4, .4, .35))
# Lead（10–15 s）：钟琴 + 方波同奏的主旋律（回文：上行一句、下行一句）
MEL = [('E5', 0), ('G5', .5), ('C6', 1), ('B5', 1.5), ('G5', 2.5), ('A5', 3), ('C6', 4), ('D6', 4.5), ('E6', 5), ('D6', 6), ('C6', 6.5), ('G5', 7), ('E5', 8), ('G5', 8.5)]
for p, o in MEL:
    t = T_FULL + o * B
    if t < T_BRK: EVN.append((t, 'glockenspiel', p, .5, .38, .2))
lead = np.zeros((NS, 2), np.float32)
for p, o in MEL:
    t = T_FULL + o * B
    if t < T_BRK: y = supersaw(p, .42, 5, .12, seed=int(o * 10)) * adsr(.42, .01, .2, .5, .1); add(lead, st(lp(y, 5000).astype(np.float32) * .16), t, 1, -.1)
smp = S.render(EVN, dur=DUR + 1)

# 5. Sidechain：pad、pluck、贝斯随底鼓"呼吸"
duck = np.ones(NS)
for t in KICKS:
    i = int(t * SR); n = min(NS - i, int(.3 * SR)); duck[i:i + n] = np.minimum(duck[i:i + n], 1 - .7 * np.exp(-np.arange(n) / SR / .09))
pad *= duck[:, None]; syn *= (.4 + .6 * duck)[:, None]

# ───────── 音效（全部对齐画面关键帧）
def noise(d): return rng.standard_normal(int(round(d * SR)))
def whoosh(d=.5, lo=300, hi=5000, rev=False, v=.5):
    x = bp(noise(d), lo, hi); e = np.sin(np.pi * tt(d)[:len(x)] / d) ** 2
    if rev: e = (tt(d)[:len(x)] / d) ** 3
    return (x * e * v).astype(np.float32)
def impact(v=1.):
    d = 1.4; t = tt(d); f = 38 + 90 * np.exp(-t / .08); y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .5) * .8
    y += lp(noise(d), 2500) * np.exp(-t / .09) * .5; return (y * v).astype(np.float32)
def subdrop(v=1.): d = 1.6; t = tt(d); f = 70 * np.exp(-t * 1.4) + 28; return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .7) * v).astype(np.float32)
def glitch(v=.4, d=.12):
    x = noise(d) * (rng.random(int(d * SR)) > .6); x = np.round(bp(x, 800, 7000) * 6) / 6
    g = (np.floor(tt(d) / .012) % 2)[:len(x)]; return (x * g * v).astype(np.float32)
def pop(v=.5, f0=500, f1=1100): t = tt(.12); f = f0 * (f1 / f0) ** np.minimum(1, t / .04); return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .03) * v).astype(np.float32)
def blip(p, v=.2, d=.08): return (saw(hz(p), d) * np.exp(-tt(d) / .025) * v).astype(np.float32)
def key(v=.5):
    d = .07; t = tt(d); y = np.sin(2 * np.pi * (180 + rng.uniform(-20, 20)) * t) * np.exp(-t / .015) * .4 + bp(noise(d), 2500, 7000) * np.exp(-t / .006) * .5
    return (y * v).astype(np.float32)
def riser(d, v=.25): x = noise(d); x = sweep_lp(x, 300, 9000, 60); return (x * np.linspace(0, 1, len(x)) ** 2 * v).astype(np.float32)
F = lambda f: f2s(f)
add(fx, st(sweep_lp(noise(1.6), 120, 1400, 40).astype(np.float32) * np.linspace(0, 1, int(1.6 * SR)) ** 2 * .12), 0, 1, 0)   # 睁眼前的底噪 swell
add(fx, st(subdrop(.18)), F(K['eyeOpen']), 1, 0)
add(fx, st(blip('C6', .15, .05)), F(K['blink']), 1, -.2); add(fx, st(blip('G5', .12, .05)), F(K['blink']) + .08, 1, -.2)
add(fx, glitch(.35), F(K['anytime']), 1, 0)
add(fx, st(whoosh(.5, 400, 6000, v=.4)), F(TM['downbeats'][0]) - .25, 1, 0)
for i, f in enumerate(K['items']): add(fx, st(pop(.32, 480 + 55 * i, 1000 + 90 * i)), F(f), 1, (-1) ** i * .4); add(fx, st(whoosh(.25, 1500, 8000, v=.12)), F(f) - .2, 1, (-1) ** i * .6)
add(fx, st(whoosh(.55, 200, 4000, rev=True, v=.5)), F(K['swallowWhoosh']), 1, 0); add(fx, st(impact(.55)), F(TM['downbeats'][1]), 1, 0)
add(fx, st(riser(1.7, .12)), F(K['parse'][0]) - .5, 1, 0)
for i, f in enumerate(K['parse']): add(fx, st(blip(['C6', 'E6', 'G6', 'C7'][i], .16)), F(f), 1, .3)
for i, f in enumerate(K['nodes']): add(fx, st(S.note('glockenspiel', ['G6', 'A6', 'C7', 'D7', 'E7'][i], .6, .35)), F(f), .45, (-1) ** i * .5)
add(fx, st(whoosh(.6, 300, 7000, v=.5)), F(TM['downbeats'][2]) - .3, 1, 0); add(fx, st(impact(.45)), F(TM['downbeats'][2]), 1, 0)
for i in range(11): add(fx, st(key(.45 + .2 * rng.random())), F(K['type0'] + i * K['typeStep']), 1, -.1)
add(fx, st(impact(.5)), F(K['enter']), 1, 0); add(fx, st(key(.9)), F(K['enter']), 1, 0)
add(fx, st(pop(.3, 900, 1500)), F(K['cite']), 1, .3)
for i, f in enumerate(K['cards']): add(fx, st(pop(.35, 400 + 80 * i, 900 + 120 * i)), F(f), 1, (-1) ** i * .3)
for f in K['checks']: add(fx, st(S.note('glockenspiel', 'E7', .4, .3)), F(f), .35, .4)
for f in K['agents']: add(fx, st(blip('G6', .14, .06)), F(f), 1, -.3); add(fx, st(blip('C7', .12, .06)), F(f) + .06, 1, -.3)
add(fx, st(whoosh(.7, 200, 3000, v=.45)), F(TM['downbeats'][3]) - .35, 1, 0)
add(fx, st(riser(T_SIL - T_BRK, .22)), T_BRK, 1, 0)
for f in K['flash']: add(fx, glitch(.28, .08), F(f), 1, 0)
add(fx, st(impact(.8)), T_DROP, 1, 0); add(fx, st(subdrop(.35)), T_DROP, 1, 0); add(fx, st(whoosh(.45, 800, 9000, rev=True, v=.35)), T_DROP - .45, 1, 0)
add(fx, st(impact(.45)), F(K['logo']), 1, 0)
for f in K['slogan']: add(fx, st(whoosh(.3, 2000, 10000, v=.12)), F(f) - .1, 1, 0)
add(fx, st(S.note('glockenspiel', 'C7', .8, .4)), F(K['cta']), .5, .2)

# ───────── 混音
music = pad * 1.0 + syn * 1.0 + drm * 1.0 + smp * .9 + lead
music = S.room(music, size=.35, mix=.12)
music = (music - .6 * np.stack([lp(music[:, c], 110) for c in (0, 1)], 1)).astype(np.float32)   # 低频收 8 dB
music = np.stack([hp(music[:, c], 32) for c in (0, 1)], 1).astype(np.float32)
intro = np.clip((np.arange(NS) / SR - 1.0) / 1.0, 0, 1); music *= (.4 + .6 * intro)[:, None]          # 前奏压低 8 dB，2 s 前渐开
fx = S.room(fx, size=.25, mix=.1)
# 静默：15.87–16.0 只留混响尾巴
sil0, sil1 = int(T_SIL * SR), int(T_DROP * SR); env = np.ones(NS); env[sil0:sil1] = np.linspace(.3, .02, sil1 - sil0); music *= env[:, None]; fx[sil0:sil1] *= env[sil0:sil1, None]
mix = np.tanh(music * .9) * .85 + fx * .9                                   # 软饱和代替压缩（立体声联动）
end = int(DUR * SR); fo = int((DUR - F(K['fadeOut'])) * SR); mix[end - fo:end] *= np.linspace(1, 0, fo)[:, None] ** 1.5; mix[end:] = 0
mix = limit(mix / (np.abs(mix).max() + 1e-9) * .9, .95)[:end]
raw = os.path.join(HERE, 'soundtrack_raw.wav'); sf.write(raw, mix, SR)
# 两遍 loudnorm → −14 LUFS / TP −1.2
out = os.path.join(ROOT, 'public', 'soundtrack.wav')
j = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', raw, '-af', 'loudnorm=I=-14:TP=-1.2:LRA=11:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
m = json.loads(j[j.rindex('{'):j.rindex('}') + 1])
ln = f"loudnorm=I=-14:TP=-1.2:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true"
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', raw, '-af', ln + ',aresample=48000', '-c:a', 'pcm_s16le', out], check=True)
print('soundtrack.wav', round(DUR, 2), 's; sample notes', len(EVN), '; input', m['input_i'], 'LUFS')
