# Siebdruck-Schülerfirma – Website

Website für die Siebdruck-Schülerfirma der Montessori-Schule Dietramszell.

## Seiten

- `index.html` – Startseite mit Vorstellung der Schülerfirma
- `shop.html` – Shop mit Warenkorb und Bestellung
- `spezialbestellungen.html` – Formular für individuelle Wunschbestellungen (Telefonnummer ist Pflicht)
- `bewertungen.html` – Kund:innen-Feedback und Bewertungen
- `admin.html` – Admin-Bereich (Standardpasswort: `1234`, änderbar unter „Einstellungen“)

Der Zugang zum Admin-Bereich befindet sich ganz unten im Footer jeder Seite
(kleiner „Admin“-Button neben dem Zahnrad-Symbol).

## Lokal ansehen

Da die Seite komplett ohne Server-Backend läuft, reicht ein einfacher
statischer Webserver, z. B.:

```
cd schuelerfirma
python3 -m http.server 8080
```

Danach im Browser `http://localhost:8080/index.html` öffnen.

## Wichtiger Hinweis zu den Daten

Produkte, Bestellungen, Spezialbestellungen und Bewertungen werden aktuell
**nur im Browser (localStorage)** gespeichert – es gibt noch keine echte
Datenbank/Server. Das bedeutet:

- Bestellungen, die Kund:innen auf ihrem eigenen Handy/PC aufgeben, tauchen
  **nicht automatisch** im Admin-Bereich auf einem anderen Gerät auf.
- Für den "scharfen" Betrieb mit Bestellungen von überall braucht ihr später
  einen kleinen Server bzw. eine Datenbank im Hintergrund.
- Für erste Tests, Vorführungen und um die Website/den Admin-Bereich
  auszuprobieren, reicht der aktuelle Stand völlig aus.

## Bilder

Aktuell werden alle Produkte mit einfachen SVG-Platzhalter-"Pullis" in
Wunschfarbe dargestellt (`js/icons.js`, Funktion `hoodie`). Sobald echte
Fotos da sind, können diese in `product-image`-Boxen eingebaut werden.
