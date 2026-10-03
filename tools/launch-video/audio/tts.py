# Sprechertexte (lines.json) mit Supertonic 3 (Supertone, OpenRAIL-M, kommerziell nutzbar) erzeugen.
# Pro Satz werden mehrere Aufnahmen („Takes“) gemacht; wenn das Whisper-Modell da ist, wird die
# Aufnahme genommen, die die Spracherkennung am besten versteht.
#   python3 tts.py [STIMME] [AUSGABE-PRÄFIX]     STIMME 0–4 weiblich, 5–9 männlich
import difflib, json, os, re, sys
import numpy as np, sherpa_onnx as so, soundfile as sf

os.chdir(os.path.dirname(os.path.abspath(__file__)))
VOICE = int(sys.argv[1]) if len(sys.argv) > 1 else 2
PREFIX = sys.argv[2] if len(sys.argv) > 2 else 'line'
SPEED = 1.05
TAKES = 6
D = 'models/sherpa-onnx-supertonic-3-tts-int8-2026-05-11'
WHISPER = 'models/sherpa-onnx-whisper-small'

tts = so.OfflineTts(so.OfflineTtsConfig(model=so.OfflineTtsModelConfig(supertonic=so.OfflineTtsSupertonicModelConfig(
    duration_predictor=f'{D}/duration_predictor.int8.onnx', text_encoder=f'{D}/text_encoder.int8.onnx',
    vector_estimator=f'{D}/vector_estimator.int8.onnx', vocoder=f'{D}/vocoder.int8.onnx', tts_json=f'{D}/tts.json',
    unicode_indexer=f'{D}/unicode_indexer.bin', voice_style=f'{D}/voice.bin'), num_threads=4)))
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

out, total = [], 0
for i, l in enumerate(json.load(open('lines.json'))):
    best = None
    for k in range(TAKES if asr else 1):
        g = so.GenerationConfig(); g.sid = VOICE; g.num_steps = 16 + 4 * k; g.speed = SPEED; g.extra['lang'] = 'de'
        a = tts.generate(l['say'], g)
        s = np.array(a.samples, dtype=np.float32)
        idx = np.where(np.abs(s) > 0.01)[0]
        s = s[max(0, idx[0] - 1200): idx[-1] + 4800]           # Stille vorne/hinten weg
        sc, heard = score(s, a.sample_rate, l.get('expect', l['say'])) if asr else (0, '')
        if best is None or sc > best[0]: best = (sc, s, heard)
        if sc >= 0.995: break
    sf.write(f'{PREFIX}{i}.wav', best[1], a.sample_rate)
    out.append({'id': l['id'], 'dur': round(len(best[1]) / a.sample_rate, 3)})
    total += best[0]
    print(f"{l['id']:8s} {out[-1]['dur']:.2f}s  Treffer {best[0]:.2f}  gehört: {best[2]}")
print(f'Stimme {VOICE}: Durchschnitt {total / len(out):.3f}')
json.dump(out, open(f'durations-{PREFIX}.json', 'w'), indent=1)
