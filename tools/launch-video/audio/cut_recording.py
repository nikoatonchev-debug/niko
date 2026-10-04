# Schneidet eine eigene Sprachaufnahme (z. B. von ElevenLabs) in die 6 Sätze aus lines.json.
#   python3 cut_recording.py aufnahme/voice.wav 0.30-2.20 2.40-7.17 ...   (Start-Ende je Satz in Sekunden)
import json, os, sys
import numpy as np, soundfile as sf

os.chdir(os.path.dirname(os.path.abspath(__file__)))
src = sys.argv[1]
spans = [tuple(map(float, s.split('-'))) for s in sys.argv[2:]]
lines = json.load(open('lines.json'))
assert len(spans) == len(lines), f'{len(lines)} Zeitbereiche nötig'
x, sr = sf.read(src, dtype='float32', always_2d=True)
x = x.mean(axis=1)
out = []
for i, ((a, b), l) in enumerate(zip(spans, lines)):
    s = x[int(a * sr): int(b * sr)].copy()
    fi, fo = int(0.01 * sr), int(0.04 * sr)
    s[:fi] *= np.linspace(0, 1, fi); s[-fo:] *= np.linspace(1, 0, fo)
    sf.write(f'line{i}.wav', s, sr)
    out.append({'id': l['id'], 'dur': round(len(s) / sr, 3)})
    print(f"{l['id']:8s} {out[-1]['dur']:.2f}s")
json.dump(out, open('durations.json', 'w'), indent=1)
