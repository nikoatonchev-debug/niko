# Siebdruck-Schülerfirma – Website

Website für die Siebdruck-Schülerfirma der Montessori-Schule Dietramszell.
Diese Datei wird nicht mit veröffentlicht (siehe `.github/workflows/pages.yml`).

## Seiten

- `index.html` – Startseite
- `shop.html` – Shop mit Warenkorb und Bestellung
- `spezialbestellungen.html` – Wunschbestellungen (Telefonnummer ist Pflicht)
- `bewertungen.html` – Bewertungen (eine pro Konto, nur mit bestätigter E-Mail)
- `meine-bestellungen.html` – eigene Bestellungen ansehen, Konto löschen
- `impressum.html`, `datenschutz.html`, `agb.html` – Rechtliches
- `admin.html` – Admin-Bereich (Zugang ganz unten im Footer)

## Wie die Website funktioniert

Die Seiten sind statisch und laufen auf **Firebase Hosting** unter https://schuelerfirma-siebdruck.web.app
(GitHub Action `.github/workflows/firebase-hosting.yml`, Secret `FIREBASE_SERVICE_ACCOUNT`). Die alte Adresse
`nikoatonchev-debug.github.io/niko` leitet nur noch weiter (`.github/workflows/pages.yml`). Alle Daten liegen in **Google Firebase**
(Projekt `schuelerfirma-siebdruck`, Datenbank in Europa):

- **Firebase Authentication** – Konten mit E-Mail + Passwort. Beim Registrieren schickt
  Firebase einen Bestätigungslink. Ohne bestätigte E-Mail kann man weder bestellen noch bewerten.
- **Cloud Firestore** – Produkte, Bestellungen, Spezialbestellungen, Bewertungen, Kundenprofile.

Wer was darf, steht in `../firestore.rules` und wird **auf Googles Servern** durchgesetzt
(nicht im Browser). Kurz: Produkte und Bewertungen sind öffentlich lesbar, jede:r sieht nur die
eigenen Bestellungen, nur der Admin sieht und ändert alles. Der Lagerbestand wird beim Bestellen
in einer Transaktion mitgezählt – es kann nicht mehr verkauft werden als vorrätig ist.

## Admin

Admin ist, wer sich mit einer in `firestore.rules` (Funktion `isAdmin`) eingetragenen,
**bestätigten** E-Mail-Adresse anmeldet (aktuell `erdkinderkollektiv@gmail.com`). Das Konto entsteht
ganz normal über „Registrieren“ auf der Website (oder in der Firebase-Konsole unter Authentication)
und muss per Link bestätigt werden. Das Passwort ändert man über „Passwort vergessen?“ bzw.
im Admin-Bereich unter „Einstellungen“. Nach 30 Minuten ohne Aktivität wird man abgemeldet.

Weitere Admins: Adresse in `firestore.rules` eintragen und die Regeln neu veröffentlichen
(und in `js/firebase-config.js` bei `SF_ADMIN_EMAILS` ergänzen).

## Einmalige Einrichtung in der Firebase-Konsole

1. **Authentication → Sign-in method:** „E-Mail/Passwort“ aktivieren (bereits erledigt).
2. **Authentication → Einstellungen → Autorisierte Domains:** `schuelerfirma-siebdruck.web.app` ist automatisch erlaubt.
3. **Authentication → Vorlagen:** Sprache auf Deutsch stellen, Absendernamen auf „Erdkinderkollektiv“,
   Betreff/Text nach Wunsch (E-Mail-Adressbestätigung und Passwort zurücksetzen).
4. **Firestore Database → Regeln:** den Inhalt von `../firestore.rules` einfügen und **Veröffentlichen**.
   Ohne diesen Schritt bleibt die Datenbank komplett gesperrt.
5. Optional, empfohlen: In der Google Cloud Console (APIs & Dienste → Anmeldedaten) den
   API-Schlüssel auf die Referrer `https://schuelerfirma-siebdruck.web.app/*` und `https://schuelerfirma-siebdruck.firebaseapp.com/*` beschränken.
6. Kostenlos bleiben: Im Spark-Tarif (ohne Kreditkarte) kostet nichts etwas; bei Überschreiten der
   Gratis-Grenzen wird nur gedrosselt.

## E-Mail „Deine Bestellung ist abholbereit“ (Gmail + Google Apps Script)

Wenn im Admin-Bereich bei einer Bestellung **„Abholbereit“** geklickt wird, schickt ein kleines Programm im
Gmail-Konto der Schülerfirma eine E-Mail an die (bestätigte) Adresse des Kundenkontos. Kostenlos, ohne eigene
Domain, bis **100 E-Mails pro Tag** (Gmail-Limit für Apps Script, ca. 3.000 im Monat). Die E-Mails kommen echt von
`erdkinderkollektiv@gmail.com` und landen deshalb nicht im Spam.

Sicher: Die Website schickt nur, *welche* Bestellung es ist, plus den Login-Nachweis des Admins. Das Skript liest die
Bestellung mit diesem Login aus Firestore (Google prüft Echtheit und Regeln), prüft „Admin + abholbereit“ und nimmt
Empfänger und Text selbst aus der Datenbank. Niemand kann darüber fremde E-Mails verschicken.

Solange in `js/firebase-config.js` bei `SF_MAIL_URL` nichts steht, werden keine E-Mails verschickt (die Website zeigt
„Abholbereit“ trotzdem an).

Einrichtung (einmalig, ca. 10 Minuten, am besten am Computer):

1. Mit `erdkinderkollektiv@gmail.com` auf **script.google.com** gehen → **Neues Projekt**.
2. Den Projektnamen oben auf `Schülerfirma E-Mail` ändern.
3. Den ganzen Inhalt von `tools/email-apps-script/Code.gs` in die Datei `Code.gs` kopieren (vorhandenen Text ersetzen)
   → **Speichern**.
4. **Bereitstellen → Neue Bereitstellung** → Zahnrad → **Web-App**.
   - *Ausführen als*: **Ich (erdkinderkollektiv@gmail.com)**
   - *Wer hat Zugriff*: **Jeder**
   → **Bereitstellen**.
5. Google fragt nach Berechtigungen → **Zugriff autorisieren** → Konto wählen. Erscheint „Google hat diese App nicht
   überprüft“: **Erweitert → Zu Schülerfirma E-Mail wechseln (unsicher)** → **Zulassen**. (Das ist euer eigenes
   Skript; die Warnung kommt bei jedem selbst geschriebenen Skript.)
6. Die **Web-App-URL** kopieren (`https://script.google.com/macros/s/…/exec`) und in `js/firebase-config.js` bei
   `SF_MAIL_URL` eintragen.
7. Test: Die URL im Browser öffnen → es sollte „E-Mail-Dienst der Schülerfirma läuft“ erscheinen.

Ändert man später etwas am Skript: **Bereitstellen → Bereitstellungen verwalten → Bearbeiten → Version: Neue
Version** – dann bleibt die URL gleich.

## Lokal ansehen und testen

```
cd schuelerfirma
python3 -m http.server 8080      # dann http://localhost:8080 öffnen
```

Das spricht mit der echten Datenbank. Zum gefahrlosen Ausprobieren gibt es den Firebase-Emulator
(`firebase emulators:start --only auth,firestore`, Konfiguration in `../firebase.json`); die Seiten
verbinden sich damit, wenn vor dem Laden `window.__SF_EMULATOR = true` gesetzt ist.

## Firebase-SDK neu bauen

`js/vendor/firebase.bundle.js` ist das Firebase-SDK (Auth + Firestore) als eine Datei, damit nichts von
fremden Servern nachgeladen wird. Neu bauen (z. B. für Updates):

```
cd tools/firebase-bundle
npm install
npm run build
```

## Sicherheit in Kürze

- Passwörter verwaltet Firebase (gesalzen, verschlüsselt); die Website sieht sie nie.
- Content-Security-Policy per `<meta>`-Tag auf jeder Seite, keine Inline-Skripte, Ausgaben werden maskiert.
- Bild-Uploads (Admin): nur JPG/PNG/WebP/GIF, werden neu als JPEG gezeichnet (entfernt Standort-Metadaten),
  alle Bilder eines Produkts zusammen höchstens ca. 800 KB.
- Der Firebase-API-Schlüssel in `js/firebase-config.js` ist absichtlich öffentlich – geschützt wird über
  die Regeln, nicht über Verstecken.
