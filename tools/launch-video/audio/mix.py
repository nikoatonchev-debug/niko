# Mischt Sprecher (line*.wav), Musik (music.wav) und Geräusche (../cues.json) zu mix.wav.
# Musik bleibt leise und wird unter der Stimme noch etwas weiter abgesenkt.
import json, os, subprocess
import numpy as np, soundfile as sf

os.chdir(os.path.dirname(os.path.abspath(__file__)))
SR = 44100
DUR = 30.5
N = int(SR * DUR)
# Wann welcher Satz beginnt (Sekunden, passend zu stage.html)
VO_AT = {'hook': 0.35, 'reveal': 3.1, 'shop': 8.45, 'pickup': 13.1, 'special': 18.8, 'end': 25.2}
SFX = {  # Datei, Lautstärke in dB
    'click': ('sfx/click2.ogg', -17), 'swish': ('sfx/card-slide-1.ogg', -15),
    'stamp': ('sfx/impactSoft_medium_001.ogg', -10), 'pop': ('sfx/select_008.ogg', -19),
}

def load(path):
    x, sr = sf.read(path, dtype='float32', always_2d=True)
    x = x.mean(axis=1)
    if sr != SR:
        t = np.arange(int(len(x) * SR / sr)) / SR
        x = np.interp(t, np.arange(len(x)) / sr, x).astype(np.float32)
    return x
def place(track, x, t, gain=1.0):
    i = int(t * SR); j = min(len(track), i + len(x))
    if i < len(track): track[i:j] += x[: j - i] * gain
def db(v): return 10 ** (v / 20)
def rms(x): return float(np.sqrt(np.mean(x[np.abs(x) > 0.01] ** 2)))

lines = json.load(open('lines.json'))
voice = np.zeros(N, np.float32)
active = np.zeros(N, np.float32)
for i, l in enumerate(lines):
    x = load(f'line{i}.wav')
    x = x * (0.12 / rms(x))                     # alle Sätze gleich laut
    place(voice, x, VO_AT[l['id']])
    a = int((VO_AT[l['id']] - 0.12) * SR); b = int((VO_AT[l['id']] + len(x) / SR + 0.25) * SR)
    active[max(0, a): min(N, b)] = 1

# weiche Ducking-Kurve (0,2 s rein/raus)
k = int(0.2 * SR); kernel = np.ones(k, np.float32) / k
duck = np.convolve(active, kernel, mode='same')

music = sf.read('music.wav', dtype='float32', always_2d=True)[0][:N]
music_gain = db(-12) * (1 - duck * (1 - db(-9)))   # ohne Stimme -12 dB, unter der Stimme weitere -9 dB

fx = np.zeros(N, np.float32)
for c in json.load(open('../cues.json')):
    f, g = SFX[c['sfx']]
    place(fx, load(f), c['t'] - (0.02 if c['sfx'] == 'click' else 0.0), db(g))

L = music[:, 0] * music_gain + voice + fx * 0.9
R = music[:, 1] * music_gain + voice + fx * 1.0
out = np.stack([L, R], 1)
out /= max(1.0, np.max(np.abs(out)) / 0.95)
sf.write('mix_raw.wav', out.astype(np.float32), SR)
# Stimme klarer (Hochpass) + Lautheit für Social Media (-14 LUFS, Spitzen max. -1,5 dB)
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', 'mix_raw.wav', '-af',
                'highpass=f=60,loudnorm=I=-14:TP=-1.5:LRA=9', '-ar', '44100', 'mix.wav'], check=True)
print('mix.wav fertig')
