"""配乐 + 音效 + 人声 → mix.wav（读 events.json，时间与画面同源）
120 BPM、一小节 2 秒。两种分辨率：高清层（钢琴、贝斯、真鼓组、拍手、沙锤、钟琴、弦乐采样）是世界，方波是小黑的声音。
结构：0–2 只有踩镲 + 方波琶音 → 2.0 小黑落地全乐队进 → 4/8/12 每章重拍 crash，前半拍通鼓过门 →
8–12 加十六分沙锤 → 15.0 抽掉底鼓，军鼓滚奏蓄力，15.75 静一拍的四分之一 → 16.0 回归 → 片尾逐词方波音符 → 18.0 Cmaj9 大和弦。
用法：python sound.py（在 Lemo-Opuscar 库的 .venv 里运行；LEMO_OPUSCAR_HOME 指向库根目录）"""
import sys, os, json, numpy as np, soundfile as sf, soxr
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LEMO_OPUSCAR_HOME', os.path.expanduser('~/Documents/Project/lemo-opuscar'))
sys.path.insert(0, LIB)
from core.audio.sfx import SR, bp, lp, hp, noise, add, compress, limit, click as sclick
from core.audio import sampler as S
EVJ = json.load(open(os.path.join(HERE, 'events.json'))); E = EVJ['ev']; DUR = EVJ['dur']
rng = np.random.default_rng(7); S.seed(7)
NS = int((DUR + 1.5) * SR)
B = .5; BAR = 4 * B
def tt(d): return np.arange(int(round(d * SR))) / SR
def db(x): return 10 ** (x / 20)
def all_(tp): return [e for e in E if e['type'] == tp]
def first(tp): return all_(tp)[0]['t']
hz = S.hz

# ───────── 像素层：带限方波
def pulse(f, d, duty=.25, vol=1., att=.003, rel=.05, slide=None):
    t = tt(d); fr = np.full(len(t), float(f)) if slide is None else f * (slide ** (t / d))
    ph = np.cumsum(fr) / SR; x = np.zeros(len(t))
    for k in range(1, 24):
        m = fr * k < 16000; x += m * (np.sin(np.pi * k * duty) / k) * np.cos(2 * np.pi * k * (ph - duty / 2))
    e = np.minimum(1, t / att) * np.minimum(1, (d - t) / rel).clip(0)
    return (x * e * vol * .5).astype(np.float32)
def crush(x, bits=5): q = 2 ** bits; return (np.round(x * q) / q).astype(np.float32)
def nz(d, lo, hi, vol=1., tau=None):
    x = bp(rng.standard_normal(int(d * SR)), lo, hi) * vol
    if tau: x *= np.exp(-tt(d)[:len(x)] / tau)
    return x.astype(np.float32)

# ═════════ 配乐
band = np.zeros((NS, 2), np.float32); chip = np.zeros((NS, 2), np.float32)
CH = {'C': ('C2', ['E3', 'G3', 'C4', 'D4']), 'F': ('F2', ['A3', 'C4', 'E4', 'G4']), 'G': ('G2', ['B3', 'D4', 'E4', 'G4']),
      'Em': ('E2', ['G3', 'B3', 'D4', 'E4']), 'Am': ('A2', ['G3', 'C4', 'E4', 'A4']), 'Cmaj9': ('C2', ['E3', 'B3', 'D4', 'G4'])}
PROG = ['C', 'F', 'G', 'Em', 'Am', 'F', 'G', 'Em', 'F', 'Cmaj9', 'Cmaj9']          # 每小节一个和弦
def chord_at(t): return CH[PROG[min(len(PROG) - 1, int(t // BAR))]]
EVN = []
def N(t, inst, p, d, v, pan=0., g=1.): EVN.append((t, inst, p, d, v, pan, g))
BRK0, BRK1, IN, FIN = 15.0, 16.0, 2.0, first('final')

# 前奏 0–2：踩镲八分（渐强）+ 很轻的钢琴长音
for n in range(4):
    N(n * B, 'drum_kit', 'hi_hat_closed', .1, .18 + .05 * n, .3); N(n * B + B / 2, 'drum_kit', 'hi_hat_closed', .1, .12 + .04 * n, .3)
for n in range(4, 8): N(n * B, 'drum_kit', 'hi_hat_closed', .1, .34, .3); N(n * B + B / 2, 'drum_kit', 'hi_hat_closed', .1, .22, .3)
[N(.0 + j * .03, 'piano', p, 1.9, .22, -.15) for j, p in enumerate(CH['C'][1])]
N(1.0, 'piano', 'G4', .9, .2, -.1); N(1.5, 'piano', 'D5', .5, .2, -.1)
for k in range(4): N(1.5 + k * B / 4, 'drum_kit', 'snare_1', .15, .2 + .12 * k, .1)                 # 落地前的军鼓 pickup
rs = noise(1.0); rs = hp(rs, 1400) * np.linspace(0, 1, len(rs)) ** 2.2 * .1; add(band, rs.astype(np.float32), IN - 1.0, 1, 0)

# 主律动：底鼓四拍、2/4 拍军鼓 + 拍手、踩镲八分、贝斯切分、钢琴小节头长和弦 + 反拍短和弦
def groove(t0, t1, shaker=lambda t: False, half=False):
    for n in range(int(round(t0 / B)), int(round(t1 / B))):
        t = n * B; bi = n % 4; root, ch = chord_at(t + 1e-3)
        if not half or bi in (0, 2): N(t, 'drum_kit', 'kick_drum_left', .3, .9 if bi == 0 else .78, 0)
        if bi == 3 and n % 8 == 7 and not half: N(t + B * .5, 'drum_kit', 'kick_drum_right', .3, .55, 0)
        if bi in (1, 3): N(t, 'claps', None, .3, .5, .08); N(t, 'drum_kit', 'snare_2', .3, .42, .05)
        N(t, 'drum_kit', 'hi_hat_closed', .1, .3, .3)
        N(t + B / 2, 'drum_kit', 'hi_hat_open' if bi == 3 else 'hi_hat_closed', .18 if bi == 3 else .1, .24, .3)
        if shaker(t):
            for q in (.25, .75): N(t + q * B, 'shaker', None, .12, .26, -.35)
        r2 = S.name(S.midi(root) + 12)
        N(t, 'jazz_bass', root, .22, .8, 0); N(t + B * .5, 'jazz_bass', r2 if bi % 2 else root, .18, .55, 0)
        if bi == 3: N(t + B * .75, 'jazz_bass', S.name(S.midi(root) + 7), .12, .5, 0)
        if bi == 0: [N(t + j * .012, 'piano', p, 1.7, .4, -.2) for j, p in enumerate(ch)]
        elif bi in (1, 3): [N(t + B / 2, 'piano', p, .2, .3, -.2) for p in ch[1:]]
groove(IN, BRK0, shaker=lambda t: 8 <= t < 12)
# 章节过门：前半拍四连通鼓，重拍 crash
for w in [e['t'] for e in all_('wipe')] + [IN]:
    if w < BRK1:
        if w > IN: [N(w - B / 2 + k * B / 8, 'drum_kit', tm, .3, .5 + .1 * k, (k - 1.5) * .3) for k, tm in enumerate(['tom_1', 'tom_2', 'tom_3', 'tom_4'])]
        N(w, 'drum_kit', 'crash_left', 2.0, .6 if w > IN else .7, -.2)
N(IN, 'drum_kit', 'kick_drum_left', .4, 1., 0)
# 蓄力 15.0–15.75：抽掉底鼓和贝斯，军鼓十六分渐强 + 上行噪声；15.75–16.0 静
for k in range(6): N(BRK0 + k * B / 4, 'drum_kit', 'snare_1', .15, .25 + .1 * k, .1)          # 十六分：15.0–15.625
[N(BRK0 + j * .02, 'piano', p, 1.3, .32, -.2) for j, p in enumerate(CH['Em'][1])]
N(BRK0 + .5, 'drum_kit', 'hi_hat_closed', .1, .25, .3)
rs = noise(.75); rs = hp(rs, 1200) * np.linspace(0, 1, len(rs)) ** 2.5 * .16; add(band, rs.astype(np.float32), BRK0, 1, 0)
# 16.0 回归：crash + 底鼓；片尾两小节轻律动（半拍感，给逐词跳留空间）
N(BRK1, 'drum_kit', 'crash_right', 2.4, .8, .2); N(BRK1, 'drum_kit', 'kick_drum_left', .4, 1., 0)
groove(BRK1, FIN, half=True)
# 18.0 大和弦：Cmaj9 钢琴 + 贝斯 + 弦乐 + 钟琴琶音 + crash
N(FIN, 'drum_kit', 'crash_left', 3.5, .85, -.2); N(FIN, 'drum_kit', 'kick_drum_left', .4, 1., 0)
N(FIN, 'jazz_bass', 'C2', 2.4, .8, 0)
for j, p in enumerate(['C3', 'G3', 'E4', 'B4', 'D5', 'G5']): N(FIN + j * .03, 'piano', p, 3.2, .55, -.15 + j * .06)
for p in ['E4', 'G4', 'B4']: EVN.append(dict(t=FIN, inst='violins', pitch=p, dur=2.6, vel=.36, pan=.1, attack=.25))
for j, p in enumerate(['C6', 'E6', 'G6', 'B6', 'D7', 'G7']): N(FIN + .1 + j * B / 4, 'glockenspiel', p, 1.4, .42, .35)
for n in range(3):
    t = FIN + 1.0 + n * B; N(t, 'drum_kit', 'hi_hat_closed', .1, .2, .3)
    if n % 2 == 0: N(t + B, 'claps', None, .3, .26, 0)
bandmix = S.render(EVN, dur=DUR + 1.5); band[:len(bandmix)] += bandmix[:NS]

# 像素层（小黑的声音）
for n in range(8):                                                       # 前奏方波琶音 C–E–G–D
    add(chip, pulse(hz(['C5', 'E5', 'G5', 'D6'][n % 4]), .09, .125, .12 + .02 * n), n * B / 2 + .02, 1, .2)
m0 = first('morph')
for k, p in enumerate(['C5', 'E5', 'G5', 'C6', 'E6', 'G6']): add(chip, pulse(hz(p), .07, .125, .24), m0 + k * .05, 1, (k - 2.5) * .15)
THEME = [('G5', 0, .5), ('E5', .5, .5), ('C6', 1, 1), ('D6', 2, .5), ('C6', 2.5, 1.5)]      # 落地后的小黑主题（半拍为单位）
for p, o, d in THEME: ts = 3.0 + o * B / 2; add(chip, pulse(hz(p), d * B / 2 * .9, .25, .3), ts, 1, .15); add(band, S.note('glockenspiel', p, d * B / 2, .45), ts, .5, .15)
for e, p in zip(sorted(all_('word'), key=lambda e: e['i']), ['C5', 'E5', 'G5', 'C6']):         # 逐词跳：C–E–G–C
    add(chip, pulse(hz(p), .22, .25, .2), e['t'], 1, .1); add(band, S.note('glockenspiel', p, .6, .45), e['t'], .5, .1)
music = S.room(band + chip, size=.3, mix=.1)
music = (music - .5 * np.stack([lp(music[:, c], 110, 2) for c in (0, 1)], 1)).astype(np.float32)   # 低频收 6 dB，小喇叭上不糊

# ═════════ 音效
fx = np.zeros((NS, 2), np.float32)
def key(v=.8, heavy=False):
    d = .09; t = tt(d); th = np.sin(2 * np.pi * (170 + rng.uniform(-20, 20)) * t) * np.exp(-t / .018) * .5
    ck = nz(d, 2500, 7000, .5, .006) + nz(d, 900, 2200, .3, .012)
    return ((th + ck[:len(th)]) * v * (1.5 if heavy else 1)).astype(np.float32)
def tick(v=.5, f=2600): t = tt(.05); return (np.sin(2 * np.pi * f * t) * np.exp(-t / .008) * v + nz(.05, 3000, 8000, .15 * v, .004)[:len(t)]).astype(np.float32)
def pop(v=.6, f0=520, f1=980): t = tt(.12); f = f0 * (f1 / f0) ** np.minimum(1, t / .05); return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .035) * v).astype(np.float32)
def swish(d=.35, v=.5, lo=400, hi=4000):
    x = rng.standard_normal(int(d * SR)); t = tt(d)[:len(x)]; e = np.sin(np.pi * t / d) ** 2
    return (bp(x, lo, hi) * e * v).astype(np.float32)
def boom(v=1., f0=90, d=.9): v *= .45; t = tt(d); f = f0 * np.exp(-t * 2.2) + 32; return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .3) * v).astype(np.float32)
for e in E:
    t0, tp = e['t'], e['type']
    if tp == 'key': add(fx, key(e.get('v', .7) * .6), t0, .5, -.1 + rng.uniform(-.1, .1))
    elif tp == 'enter': add(fx, key(1, True), t0, .4, 0)
    elif tp == 'click': add(fx, sclick(1.1, .8), t0, .45, .1)
    elif tp == 'pop': add(fx, pop(.34, 560 + 60 * e.get('i', 0), 1050 + 80 * e.get('i', 0)), t0, 1, -.1)
    elif tp == 'fly': add(fx, swish(.36, .22, 700, 6000), t0, 1, -.5)
    elif tp == 'tick': add(fx, tick(.25), t0, 1, .2)
    elif tp == 'tool': add(fx, tick(.3, 3200) + np.pad(tick(.2, 4200), (int(.05 * SR), 0))[:int(.05 * SR)], t0, 1, -.2)
    elif tp == 'ding':
        for k, p in enumerate(['G6', 'C7']): add(fx, S.note('glockenspiel', p, .7, .5), t0 + k * .06, .55, .2)
    elif tp == 'flip': add(fx, pulse(hz('E6'), .05, .125, .16), t0, 1, .3); add(fx, pulse(hz('A6'), .06, .125, .14), t0 + .06, 1, .3)
    elif tp == 'flip2': add(fx, pop(.22, 700, 1300), t0, 1, .3)
    elif tp in ('whoosh',): add(fx, swish(.5, .34, 300, 3800), t0 - .06, 1, (e.get('d', .5) or 0) * .4)
    elif tp == 'send': add(fx, swish(.3, .25, 800, 6000), t0, 1, 0); add(fx, pop(.25, 600, 1100), t0 + .25, 1, 0)
    elif tp == 'jump': d = min(.16, e.get('d', .3) * .4); add(fx, pulse(330, d, .25, .16, slide=2.4), t0, 1, .1)
    elif tp == 'land': add(fx, pulse(110, .06, .5, .22 * e.get('v', .6)), t0, 1, 0); add(fx, crush(nz(.05, 200, 2000, .25 * e.get('v', .6), .015)), t0, 1, 0)
    elif tp == 'blink': add(fx, pulse(hz('C6'), .04, .125, .18), t0, 1, -.2); add(fx, pulse(hz('G5'), .04, .125, .14), t0 + .09, 1, -.2)
    elif tp == 'morph':
        for k in range(26): add(fx, pulse(rng.uniform(900, 2600), .03, .125, .07), t0 + rng.uniform(0, .32), 1, rng.uniform(-.6, .6))
    elif tp == 'stomp': add(fx, pulse(hz('C3'), .1, .5, .3, slide=.5), t0, 1, .1); add(fx, boom(.35, 120, .35), t0, 1, 0)
    elif tp == 'hit': add(fx, boom(.5, 100, .6), t0, 1, 0)
    elif tp == 'final': add(fx, pulse(hz('C3'), .14, .5, .35, slide=.5), t0, 1, 0); add(fx, boom(.7, 110, .8), t0, 1, 0)
    elif tp == 'boing': d = .45; add(fx, (np.sin(2 * np.pi * np.cumsum(420 * (1 + .25 * np.sin(2 * np.pi * 14 * tt(d)) * np.exp(-tt(d) / .15))) / SR) * np.exp(-tt(d) / .12) * .3).astype(np.float32), t0, 1, .2)

# ═════════ 人声 + 闪避
vo = np.zeros((NS, 2), np.float32)
for e in all_('vo'):
    y, sr = sf.read(os.path.join(HERE, 'voices', e['id'] + '.wav'), dtype='float32')
    if y.ndim > 1: y = y.mean(1)
    y = soxr.resample(y, sr, SR).astype(np.float32); y = compress(y, .3, 3.0); add(vo, y, e['t'], 1.0, 0)
env = np.abs(vo[:, 0]); k = int(.12 * SR); env = np.convolve(env, np.ones(k) / k, 'same'); env = np.clip(env / (env.max() * .25), 0, 1)
music *= (1 - .5 * env)[:, None]                                           # 人声下压约 6 dB
music = music / (np.abs(music).max() + 1e-9) * .55
fx = fx / (np.abs(fx).max() + 1e-9) * .4
vo = vo / (np.abs(vo).max() + 1e-9) * .9
G_MUS, G_FX = db(float(os.environ.get('GM', 0))), db(float(os.environ.get('GF', 0)))
mix = music * G_MUS + fx * G_FX + vo
if os.environ.get('STEMS'):
    os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
    for nm, y in (('music', music * G_MUS), ('fx', fx * G_FX), ('vo', vo)): sf.write(os.path.join(HERE, 'out', nm + '.wav'), y[:int((DUR + .1) * SR)], SR)
fade = np.ones(NS); fo = int(.5 * SR); end = int(DUR * SR); fade[end - fo:end] = np.linspace(1, 0, fo); fade[end:] = 0
mix = limit(mix * fade[:, None], .95)
sf.write(os.path.join(HERE, 'mix.wav'), mix[:int((DUR + .1) * SR)], SR)
print('mix.wav', round(DUR, 2), 's; notes', len(EVN))
