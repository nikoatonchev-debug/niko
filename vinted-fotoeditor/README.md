# Vinted Fotoeditor

Eine einzelne statische Seite (`index.html`), auf der man Produktfotos hochlädt. Sie werden über die OpenRouter Unified Image API (`POST https://openrouter.ai/api/v1/images`) mit KI bearbeitet.

- Standardmodell: `google/gemini-3.1-flash-lite-image`, dazu einige Alternativen und ein Feld für eine eigene Modell-ID
- Vier Prompt-Voreinstellungen (Holzboden, Stein/Beton, Nahaufnahme Logo, Nahaufnahme Etikett), jeweils mit festen Regeln: Farben und Farbintensität nie ändern, nichts hinzufügen (z. B. keine Preisetiketten), Logo und Etikett gestochen scharf, Vintage-Look erhalten
- Logo- und Etikett-Schutz: Logo und Etiketten werden automatisch erkannt (Text-Modell, Bereiche pro Foto mit dem Finger anpassbar). Nach der KI-Bearbeitung sucht die Seite die Stelle im KI-Bild und setzt dort die Original-Pixel ein. Das Einsetzen ist nahtlos: Stofffarbe und Licht werden am Rand pro Farbkanal an das KI-Bild angeglichen und glatt ins Innere verteilt. Jedes Detail von Logo und Etikett stammt aus dem Original.
- Bei Nahaufnahmen wird die Farbintensität des Ergebnisses automatisch auf das Original zurückgesetzt, falls das Modell die Farben verstärkt hat (abschaltbar)
- Ausgabe-Auflösung wählbar (1K / 2K / 4K, Standard 2K)
- Automatischer Inserat-Text (Titel, Beschreibung, Marke, Größe, Kategorie, Zustand, Farbe, Material, Hashtags) aus den Originalfotos über `POST /api/v1/chat/completions`, mit „Bitte prüfen“-Hinweisen, wenn etwas auf dem Etikett nicht lesbar ist
- Mehrere Fotos auf einmal (Drag & Drop oder Auswahl), pro Foto Status und Download-Button (auf dem iPhone zusätzlich „In Fotos sichern / Teilen“)
- Screenshot-Ansicht: Foto antippen zeigt es etwas kleiner als den Bildschirm auf Schwarz, ohne Bedienelemente (Antippen schließt, Wischen blättert)
- Laufende Kostenanzeige aus `usage.cost` der API-Antwort
- Der API-Key liegt nur im `localStorage` des Browsers und wird nur an openrouter.ai gesendet

Es gibt keinen Build-Schritt und kein Backend. Die Seite läuft auf jedem statischen Hosting, z. B. auf GitHub Pages.
