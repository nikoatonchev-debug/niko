import sherpa_onnx, soundfile as sf, json, sys, numpy as np
import os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
M = 'models/vits-piper-de_DE-thorsten-high'
cfg = sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(
    vits=sherpa_onnx.OfflineTtsVitsModelConfig(model=f'{M}/de_DE-thorsten-high.onnx', tokens=f'{M}/tokens.txt', data_dir=f'{M}/espeak-ng-data',
        length_scale=float(sys.argv[1]) if len(sys.argv) > 1 else 0.92, noise_scale=0.6, noise_scale_w=0.7),
    num_threads=4))
tts = sherpa_onnx.OfflineTts(cfg)
LINES = json.load(open('lines.json'))
out = []
for i, l in enumerate(LINES):
    a = tts.generate(l['say'], sid=0, speed=1.0)
    s = np.array(a.samples, dtype=np.float32)
    # Stille am Anfang/Ende abschneiden
    idx = np.where(np.abs(s) > 0.01)[0]
    s = s[max(0, idx[0] - 600): idx[-1] + 2400]
    sf.write(f'line{i}.wav', s, a.sample_rate)
    out.append({'id': l['id'], 'dur': round(len(s) / a.sample_rate, 3)})
    print(l['id'], out[-1]['dur'])
json.dump(out, open('durations.json', 'w'), indent=1)
