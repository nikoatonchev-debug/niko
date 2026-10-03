# Launch-Video

Erzeugt ein Hochformat-Video (1080×1920, 30 fps, ca. 34 s) der Website für Instagram/WhatsApp.
Die Website läuft dabei in einem Handy-Rahmen (`stage.html`), `record.js` klickt sich durch die
Seiten und macht Bild für Bild Screenshots.

Gezeigt werden die Daten aus dem **Firebase-Emulator** (nicht die echte Datenbank), damit beim
Aufnehmen nichts Echtes bestellt wird. Vorher die echten Produkte in den Emulator kopieren.

```
firebase emulators:start --only auth,firestore     # im Repo-Hauptordner
node tools/launch-video/server.js                   # http://127.0.0.1:8935
node tools/launch-video/record.js                   # --draft = „Entwurf“-Stempel, --until 5 = nur 5 s
ffmpeg -framerate 30 -i tools/launch-video/frames/%05d.jpg -c:v libx264 -pix_fmt yuv420p \
  -crf 18 -preset slow -movflags +faststart launch-video.mp4
```

Szenen, Texte und Zeiten stehen oben in `record.js` (`SCENES`), das Aussehen in `stage.html`.
`frames/` und `*.mp4` werden nicht eingecheckt.
