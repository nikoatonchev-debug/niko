# Sprechertexte (lines.json) mit der deutschen Piper-Stimme „Thorsten – fröhlich“ (CC0) erzeugen.
# Pro Satz werden mehrere Aufnahmen („Takes“) gemacht; wenn das Whisper-Modell da ist, wird die
# Aufnahme genommen, die die Spracherkennung am besten versteht.
import difflib, json, os, re
import numpy as np, sherpa_onnx, soundfile as sf

os.chdir(os.path.dirname(os.path.abspath(__file__)))
VOICE = 'models/vits-piper-de_DE-thorsten_emotional-medium'
SPEAKER = 0          # 0 = amused (fröhlich)
TAKES = 8
WHISPER = 'models/sherpa-onnx-whisper-small'

tts = sherpa_onnx.OfflineTts(sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(
    vits=sherpa_onnx.OfflineTtsVitsModelConfig(model=f'{VOICE}/de_DE-thorsten_emotional-medium.onnx', tokens=f'{VOICE}/tokens.txt',
                                               data_dir=f'{VOICE}/espeak-ng-data', length_scale=0.9, noise_scale=0.55, noise_scale_w=0.7),
    num_threads=4)))
asr = None
if os.path.isdir(WHISPER):
    asr = sherpa_onnx.OfflineRecognizer.from_whisper(encoder=f'{WHISPER}/small-encoder.int8.onnx', decoder=f'{WHISPER}/small-decoder.int8.onnx',
                                                     tokens=f'{WHISPER}/small-tokens.txt', language='de', task='transcribe', num_threads=4)

def words(s): return re.sub(r'[^a-zäöüß0-9 ]', ' ', s.lower().replace('11', 'elf')).split()
def score(samples, sr, expect):
    st = asr.create_stream()
    st.accept_waveform(sr, np.concatenate([samples, np.zeros(sr, np.float32)]))
    asr.decode_stream(st)
    heard = st.result.text
    return difflib.SequenceMatcher(None, words(heard), words(expect)).ratio(), heard

out = []
for i, l in enumerate(json.load(open('lines.json'))):
    best = None
    for k in range(TAKES if asr else 1):
        a = tts.generate(l['say'], sid=SPEAKER, speed=1.0)
        s = np.array(a.samples, dtype=np.float32)
        idx = np.where(np.abs(s) > 0.01)[0]
        s = s[max(0, idx[0] - 600): idx[-1] + 2400]          # Stille vorne/hinten weg
        sc, heard = score(s, a.sample_rate, l.get('expect', l['say'])) if asr else (0, '')
        if best is None or sc > best[0]: best = (sc, s, heard)
    sf.write(f'line{i}.wav', best[1], a.sample_rate)
    out.append({'id': l['id'], 'dur': round(len(best[1]) / a.sample_rate, 3)})
    print(f"{l['id']:8s} {out[-1]['dur']:.2f}s  Treffer {best[0]:.2f}  gehört: {best[2]}")
json.dump(out, open('durations.json', 'w'), indent=1)
