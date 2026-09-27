# Vinted Fotoeditor

Eine einzelne statische Seite (`index.html`), auf der man Produktfotos hochlädt. Sie werden über die OpenRouter Unified Image API (`POST https://openrouter.ai/api/v1/images`) mit KI bearbeitet.

- Standardmodell: `google/gemini-3.1-flash-lite-image`, dazu einige Alternativen und ein Feld für eine eigene Modell-ID
- Drei Prompt-Voreinstellungen: Holzboden, Stein/Beton, Nahaufnahme
- Mehrere Fotos auf einmal (Drag & Drop oder Auswahl), pro Foto Status und Download-Button (auf dem iPhone zusätzlich „In Fotos sichern / Teilen“)
- Laufende Kostenanzeige aus `usage.cost` der API-Antwort
- Der API-Key liegt nur im `localStorage` des Browsers und wird nur an openrouter.ai gesendet

Es gibt keinen Build-Schritt und kein Backend. Die Seite läuft auf jedem statischen Hosting, z. B. auf GitHub Pages.
