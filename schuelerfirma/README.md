# Siebdruck-Schülerfirma – Website

Website für die Siebdruck-Schülerfirma der Montessori-Schule Dietramszell.
Diese Datei wird nicht mit veröffentlicht (siehe `.github/workflows/pages.yml`).

## Seiten

- `index.html` – Startseite
- `shop.html` – Shop mit Warenkorb und Bestellung
- `spezialbestellungen.html` – Wunschbestellungen (Telefonnummer ist Pflicht)
- `bewertungen.html` – Feedback und Bewertungen
- `meine-bestellungen.html` – eigene Bestellungen ansehen, Konto löschen
- `impressum.html`, `datenschutz.html`, `agb.html` – Rechtliches
  (gelb markierte Felder `[…]` müssen noch ausgefüllt werden)
- `admin.html` – Admin-Bereich (Zugang ganz unten im Footer)

## Admin-Bereich

Beim allerersten Login gilt das Startpasswort aus dem Code. Direkt danach muss
ein eigenes Passwort (mindestens 8 Zeichen) festgelegt werden. Nach 5 falschen
Versuchen wird der Login kurz gesperrt, nach 30 Minuten ohne Aktivität wird man
automatisch abgemeldet.

## Lokal ansehen

```
cd schuelerfirma
python3 -m http.server 8080
```

Danach `http://localhost:8080/index.html` öffnen.

## Wichtig: Wo die Daten liegen

Es gibt noch keinen Server/keine Datenbank. Produkte, Bestellungen,
Spezialbestellungen, Bewertungen und Konten werden **nur im Browser des
jeweiligen Geräts (localStorage)** gespeichert. Bestellungen von Kund:innen
tauchen deshalb **nicht** im Admin-Bereich auf einem anderen Gerät auf, und
Änderungen an Produkten im Admin-Bereich sehen nur Besucher:innen auf demselben
Gerät. Für echten Betrieb braucht die Website eine Datenbank im Hintergrund.

## E-Mail-Bestätigung (EmailJS)

Der Bestätigungscode wird über [EmailJS](https://www.emailjs.com) verschickt.
Zugangsdaten stehen in `js/email-config.js`, das EmailJS-Skript liegt lokal in
`js/vendor/` (Version 4.4.1, BSD-3-Lizenz), es wird also nichts von fremden
Servern nachgeladen. Klappt der Versand nicht, bekommt man eine Fehlermeldung –
der Code wird nie auf dem Bildschirm angezeigt.

Empfohlen im EmailJS-Dashboard: unter „Account“ → „Security“ nur die eigene
Domain (`nikoatonchev-debug.github.io`) erlauben.

## Sicherheit

- Passwörter werden mit PBKDF2 (SHA-256, 150.000 Runden, zufälliges Salt)
  gespeichert; alte Einträge werden beim nächsten Login automatisch umgestellt.
- Content-Security-Policy per `<meta>`-Tag auf jeder Seite (GitHub Pages kann
  keine eigenen HTTP-Header setzen).
- Login-Sperre nach Fehlversuchen, 30 Sekunden Wartezeit zwischen Code-E-Mails,
  Codes laufen nach 15 Minuten bzw. 5 Fehlversuchen ab.
- Achtung: Ohne Server läuft alles im Browser. Wer sich auskennt, kann über die
  Entwicklerwerkzeuge die eigenen lokal gespeicherten Daten ansehen und ändern.
  Echte Zugriffskontrolle gibt es erst mit einem Backend.
