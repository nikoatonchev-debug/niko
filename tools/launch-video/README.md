# Launch-Video

Hochformat-Video (1080×1920, 30 fps, 25 s) mit Sprecherstimme, leiser Musik und Klick-Geräuschen,
im Stil von [/brag](https://github.com/latent-spaces/brag).

- `stage.html` – die Bühne: Texte, Rakel-Wischer, Handy-Rahmen. Jedes Bild ist eine reine Funktion der Zeit.
- `record.js` – lädt die echte Website im Handy, klickt sich durch und macht Bild für Bild Screenshots
  (`frames/`), schreibt die Geräusch-Zeitpunkte nach `cues.json`. `--draft` = „Entwurf“-Stempel,
  `--stills 1.0,8.5` = nur Einzelbilder nach `stills/`.
- `audio/tts.py` + `lines.json` – Sprechertexte, deutsche Stimme „Thorsten“ (Piper, CC0) über sherpa-onnx.
- `audio/music.py` – eigene Musik (selbst erzeugt, keine Lizenzfragen). `audio/mix.py` mischt alles.
- Schriften: Bricolage Grotesque und DM Sans (SIL OFL), Geräusche: Kenney (CC0).

Gezeigt werden die Daten aus dem **Firebase-Emulator**, damit beim Aufnehmen nichts Echtes bestellt wird.
Vorher die echten Produkte in den Emulator kopieren.

```
pip install sherpa-onnx numpy soundfile
curl -L https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-de_DE-thorsten-high.tar.bz2 \
  | tar xj -C tools/launch-video/audio/models
firebase emulators:start --only auth,firestore     # im Repo-Hauptordner
node tools/launch-video/server.js                   # http://127.0.0.1:8935
node tools/launch-video/record.js
python3 tools/launch-video/audio/tts.py
python3 tools/launch-video/audio/music.py 3.0 21.46 25.0   # Beat-Einsatz, Schlussakkord, Länge
python3 tools/launch-video/audio/mix.py
cp tools/launch-video/frames/00720.jpg tools/launch-video/frames/00000.jpg   # Vorschaubild als erstes Bild
ffmpeg -framerate 30 -i tools/launch-video/frames/%05d.jpg -i tools/launch-video/audio/mix.wav \
  -c:v libx264 -pix_fmt yuv420p -crf 18 -c:a aac -b:a 192k -shortest -movflags +faststart launch-video.mp4
```

Szenenzeiten stehen in `stage.html` und `record.js` (`T`), die Sprecher-Einsätze in `audio/mix.py` (`VO_AT`).
