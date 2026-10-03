# Sprechertexte (lines.json) erzeugen. Pro Satz werden mehrere Aufnahmen („Takes“) gemacht; wenn das
# Whisper-Modell da ist, wird die Aufnahme genommen, die die Spracherkennung am besten versteht.
#   python3 tts.py                 Stimme „Thorsten“ (Piper thorsten-high, CC0) – Standard
#   python3 tts.py supertonic 2    Supertonic 3 (OpenRAIL-M), Stimme 0–4 weiblich, 5–9 männlich
#   --only end                      nur diesen Satz neu aufnehmen (die anderen bleiben)
import difflib, json, os, re, sys
import numpy as np, sherpa_onnx as so, soundfile as sf

os.chdir(os.path.dirname(os.path.abspath(__file__)))
ONLY = sys.argv[sys.argv.index('--only') + 1] if '--only' in sys.argv else None
if ONLY: del sys.argv[sys.argv.index('--only'):sys.argv.index('--only') + 2]
ENGINE = sys.argv[1] if len(sys.argv) > 1 else 'thorsten'
WHISPER = 'models/sherpa-onnx-whisper-small'

if ENGINE == 'thorsten':
    M = 'models/vits-piper-de_DE-thorsten-high'
    TAKES = 8
    tts = so.OfflineTts(so.OfflineTtsConfig(model=so.OfflineTtsModelConfig(vits=so.OfflineTtsVitsModelConfig(
        model=f'{M}/de_DE-thorsten-high.onnx', tokens=f'{M}/tokens.txt', data_dir=f'{M}/espeak-ng-data',
        length_scale=0.92, noise_scale=0.6, noise_scale_w=0.7), num_threads=4)))
    def synth(text, k):
        return tts.generate(text, sid=0, speed=1.0)
else:
    VOICE = int(sys.argv[2]) if len(sys.argv) > 2 else 2
    D = 'models/sherpa-onnx-supertonic-3-tts-int8-2026-05-11'
    TAKES = 6
    tts = so.OfflineTts(so.OfflineTtsConfig(model=so.OfflineTtsModelConfig(supertonic=so.OfflineTtsSupertonicModelConfig(
        duration_predictor=f'{D}/duration_predictor.int8.onnx', text_encoder=f'{D}/text_encoder.int8.onnx',
        vector_estimator=f'{D}/vector_estimator.int8.onnx', vocoder=f'{D}/vocoder.int8.onnx', tts_json=f'{D}/tts.json',
        unicode_indexer=f'{D}/unicode_indexer.bin', voice_style=f'{D}/voice.bin'), num_threads=4)))
    def synth(text, k):
        g = so.GenerationConfig(); g.sid = VOICE; g.num_steps = 16 + 4 * k; g.speed = 1.05; g.extra['lang'] = 'de'
        return tts.generate(text, g)

asr = None
if os.path.isdir(WHISPER):
    asr = so.OfflineRecognizer.from_whisper(encoder=f'{WHISPER}/small-encoder.int8.onnx', decoder=f'{WHISPER}/small-decoder.int8.onnx',
                                            tokens=f'{WHISPER}/small-tokens.txt', language='de', task='transcribe', num_threads=4)

def letters(s): return re.sub(r'[^a-zäöüß0-9]', '', s.lower().replace('11', 'elf'))   # Zusammen-/Getrenntschreibung egal
def score(samples, sr, expect):
    st = asr.create_stream()
    st.accept_waveform(sr, np.concatenate([samples, np.zeros(sr, np.float32)]))
    asr.decode_stream(st)
    heard = st.result.text
    return difflib.SequenceMatcher(None, letters(heard), letters(expect)).ratio(), heard

old = {d['id']: d for d in json.load(open('durations.json'))} if ONLY and os.path.exists('durations.json') else {}
out, total = [], 0
for i, l in enumerate(json.load(open('lines.json'))):
    if ONLY and l['id'] != ONLY:
        out.append(old[l['id']]); continue
    say = l.get(ENGINE, l['say'])              # optionale Aussprache-Hilfe je Stimme
    best = None
    for k in range(TAKES if asr else 1):
        a = synth(say, k)
        s = np.array(a.samples, dtype=np.float32)
        idx = np.where(np.abs(s) > 0.01)[0]
        pad = a.sample_rate // 36
        s = s[max(0, idx[0] - pad): idx[-1] + 4 * pad]          # Stille vorne/hinten weg
        sc, heard = score(s, a.sample_rate, l['say']) if asr else (0, '')
        if best is None or sc > best[0]: best = (sc, s, heard)
        if sc >= 0.995: break
    sf.write(f'line{i}.wav', best[1], a.sample_rate)
    out.append({'id': l['id'], 'dur': round(len(best[1]) / a.sample_rate, 3)})
    total += best[0]
    print(f"{l['id']:8s} {out[-1]['dur']:.2f}s  Treffer {best[0]:.2f}  gehört: {best[2]}")
print(f'{ENGINE}: Durchschnitt {total / (1 if ONLY else len(out)):.3f}')
json.dump(out, open('durations.json', 'w'), indent=1)
