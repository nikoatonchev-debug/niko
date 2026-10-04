# Eigene, lizenzfreie Hintergrundmusik: warmer, leiser Pop-Beat (F-Dur, I–V–vi–IV), 104 BPM.
import numpy as np, soundfile as sf, sys, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
SR = 44100
BPM = 104; BEAT = 60 / BPM; BAR = 4 * BEAT
# Video-Zeitplan: Beat setzt bei REVEAL ein (Takt 2), Schlussakkord bei FINAL, Video-Länge VDUR
REVEAL, FINAL, VDUR = (float(x) for x in sys.argv[1:4])
OFF = 2 * BAR - REVEAL          # so viel Musik wird vorne abgeschnitten
DUR = VDUR + OFF
FIN = FINAL + OFF
N = int(SR * (DUR + 2.5))
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(7)

def hz(m): return 440 * 2 ** ((m - 69) / 12)
def add(sig, t, pan=0.0, gain=1.0):
    i = int(t * SR); j = min(N, i + len(sig))
    if i >= N: return
    s = sig[: j - i] * gain
    L[i:j] += s * np.sqrt(0.5 * (1 - pan)); R[i:j] += s * np.sqrt(0.5 * (1 + pan))
def env(n, a=0.005, d=0.4):
    t = np.arange(n) / SR
    return np.minimum(1, t / a) * np.exp(-t / d)

def epiano(m, dur, vel=1.0):
    n = int(SR * dur); t = np.arange(n) / SR; f = hz(m)
    mod = np.sin(2 * np.pi * f * 2 * t) * 1.6 * np.exp(-t / 0.25)
    s = np.sin(2 * np.pi * f * t + mod) * env(n, 0.004, 0.9) + 0.25 * np.sin(2 * np.pi * f * 4 * t) * env(n, 0.002, 0.12)
    s *= np.minimum(1, (n - np.arange(n)) / (0.05 * SR))  # weiches Ende
    return s * vel * 0.18
def pad(ms, dur):
    n = int(SR * dur); t = np.arange(n) / SR; s = np.zeros(n)
    for m in ms:
        for det in (-0.07, 0.07):
            ph = 2 * np.pi * hz(m) * (1 + det / 100) * t
            s += np.sin(ph) + 0.3 * np.sin(2 * ph) + 0.12 * np.sin(3 * ph)
    a = np.minimum(1, t / 0.6) * np.minimum(1, (dur - t) / 0.6)
    return s * a * 0.022
def bass(m, dur):
    n = int(SR * dur); t = np.arange(n) / SR
    s = np.sin(2 * np.pi * hz(m) * t) + 0.25 * np.sin(4 * np.pi * hz(m) * t)
    return s * env(n, 0.008, 0.5) * np.minimum(1, (n - np.arange(n)) / (0.03 * SR)) * 0.22
def kick():
    n = int(SR * 0.35); t = np.arange(n) / SR
    f = 50 + 70 * np.exp(-t / 0.04)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.12) * 0.42
def shaker():
    n = int(SR * 0.08); s = rng.standard_normal(n)
    s = np.diff(np.concatenate([[0], s]))  # Hochpass
    return s * env(n, 0.003, 0.025) * 0.035
def snap():
    n = int(SR * 0.2); t = np.arange(n) / SR
    s = rng.standard_normal(n); s = np.diff(np.concatenate([[0], s]))
    return (s * env(n, 0.001, 0.05) * 0.06 + np.sin(2 * np.pi * 190 * t) * env(n, 0.001, 0.04) * 0.08)

# F – C – Dm – Bb
CHORDS = [(53, [65, 69, 72]), (48, [64, 67, 72]), (50, [65, 69, 74]), (46, [65, 70, 74])]
ARP = [0, 1, 2, 1, 0, 2, 1, 2]
bars = int(np.ceil(FIN / BAR - 0.05))
for b in range(bars):
    t0 = b * BAR
    part = (FIN - t0) < BAR - 0.05      # letzter, angeschnittener Takt
    root, ch = CHORDS[b % 4]
    add(pad([root + 12] + ch, min(BAR, FIN - t0) + 0.6), t0, 0, 1.0)
    full = b >= 2  # Beat setzt mit der Enthüllung ein
    for k in range(8):  # Achtel-Arpeggio, leicht links/rechts
        vel = 0.75 if k % 2 else 1.0
        if not full and k % 2: continue
        if t0 + k * BEAT / 2 > FIN - 0.15: continue
        add(epiano(ch[ARP[k]] + (12 if k in (3, 7) else 0), BEAT * 1.2, vel), t0 + k * BEAT / 2, -0.3 if k % 2 else 0.3)
    if full and not part:
        for k in range(4):
            add(bass(root - 12 if k % 2 == 0 else root, BEAT * 0.9), t0 + k * BEAT)
            if k in (0, 2): add(kick(), t0 + k * BEAT)
            if k in (1, 3): add(snap(), t0 + k * BEAT, 0.1)
        for k in range(8):
            add(shaker(), t0 + k * BEAT / 2 + (0.012 if k % 2 else 0), 0.4, 1.0 if k % 2 else 0.6)

# Schlussakkord
add(pad([41, 53, 65, 69, 72], DUR - FIN + 0.3), FIN, 0, 1.5)
add(kick(), FIN); add(bass(41, 2.0), FIN)
for m in (65, 69, 72, 77): add(epiano(m, DUR - FIN, 0.9), FIN + 0.03 * (m - 65) / 4)

# Einfacher Hall (Faltung mit abklingendem Rauschen)
def reverb(x, secs=1.6, mix=0.18):
    n = int(SR * secs); ir = rng.standard_normal(n) * np.exp(-np.arange(n) / SR / (secs / 5))
    ir /= np.sqrt((ir ** 2).sum())
    m = len(x) + n - 1; F = 1 << (m - 1).bit_length()
    y = np.fft.irfft(np.fft.rfft(x, F) * np.fft.rfft(ir, F), F)[: len(x)]
    return x * (1 - mix) + y * mix * 2.2
L = reverb(L); R = reverb(R)
out = np.stack([L, R], 1)[int(SR * OFF): int(SR * DUR)]
fade = int(SR * 1.2); out[-fade:] *= np.linspace(1, 0, fade)[:, None]
out *= 0.5 / np.max(np.abs(out))
sf.write('music.wav', out.astype(np.float32), SR)
print('ok', out.shape[0] / SR)
