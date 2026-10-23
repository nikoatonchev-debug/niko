# Papier-Trading-Test (21.10.2026 – 27.10.2026)

Regeln:
- Checks täglich 08:15, 13:15, 18:15, 22:15 (Europe/Berlin).
- Bitcoin: Prognose "steigt/fällt bis zum nächsten Check", Auflösung beim nächsten Check.
- DAX: Prognose "nächster Schlusskurs höher/tiefer als letzter Schlusskurs", Auflösung beim 18:15-Check.
- S&P 500: wie DAX, Auflösung beim 22:15-Check.
- Ab 21.10. 14:45 erweitert: Ethereum (wie Bitcoin); SAP (wie DAX, 18:15); Nasdaq 100, Nvidia, Apple, Tesla, Gold, Öl Brent, EUR/USD (wie S&P 500, 22:15). Referenz = letzter bekannter Kurs bei Prognose, Auflösung mit Kurs beim Auflösungs-Check.
- Kursquelle: Branch kurse-daten, Datei kurse.json (GitHub Action, stündlich + bei jedem Check manuell gestartet).
- Methode: Trendfolge (Richtung des 1-Wochen-/12-Monats-Trends) + aktuelle News. Kein echtes Geld, keine Anlageberatung.

| Nr | Erstellt | Markt | Referenz | Prognose | Auflösung fällig | Ergebnis |
|---|---|---|---|---|---|---|
| 1 | 21.10. 00:00 | BTC | 83.048 $ (21.10. 00:20, CoinGecko) | fällt | 21.10. 08:15 | ✅ 82.620 $ (−0,5 %) |
| 2 | 21.10. 00:00 | DAX | 25.304,42 (Schluss 20.10.) | steigt | 21.10. 18:15 | ✅ 25.645,04 (+1,3 %) |
| 3 | 21.10. 00:00 | S&P 500 | 7.712,57 (Schluss 20.10.) | steigt | 21.10. 22:15 | ✅ 7.757,17 (+0,6 %) |
| 4 | 21.10. 08:15 | BTC | 82.620 $ (21.10. 08:19) | fällt | 21.10. 13:15 | ❌ 83.313 $ (+0,8 %) |
| 5 | 21.10. 13:15 | BTC | 83.313 $ (21.10. 13:18) | fällt | 21.10. 18:15 | ❌ 84.557 $ (+1,5 %) |
| 6 | 21.10. 14:45 | ETH | 2.467,37 $ | fällt | 21.10. 18:15 | ❌ 2.508,47 $ (+1,7 %) |
| 7 | 21.10. 14:45 | SAP | 205,40 € | steigt | 21.10. 18:15 | ✅ 208,65 € (+1,6 %) |
| 8 | 21.10. 14:45 | Nasdaq 100 | 29.490,28 (Schluss 20.10.) | steigt | 21.10. 22:15 | ✅ 29.822,52 (+1,1 %) |
| 9 | 21.10. 14:45 | Nvidia | 216,47 $ (Schluss 20.10.) | steigt | 21.10. 22:15 | ✅ 221,97 $ (+2,5 %) |
| 10 | 21.10. 14:45 | Apple | 339,50 $ (Schluss 20.10.) | steigt | 21.10. 22:15 | ✅ 343,99 $ (+1,3 %) |
| 11 | 21.10. 14:45 | Tesla | 373,71 $ (Schluss 20.10.) | fällt | 21.10. 22:15 | ❌ 386,47 $ (+3,4 %) |
| 12 | 21.10. 14:45 | Gold | 4.145,70 $ | fällt | 21.10. 22:15 | ❌ 4.150,00 $ (Tagesschluss, +0,1 %) |
| 13 | 21.10. 14:45 | Öl Brent | 108,39 $ | steigt | 21.10. 22:15 | ✅ 108,82 $ (Tagesschluss, +0,4 %) |
| 14 | 21.10. 14:45 | EUR/USD | 1,1233 | fällt | 21.10. 22:15 | ✅ 1,1227 (Tagesschluss, −0,05 %) |
| 15 | 21.10. 18:15 | BTC | 84.557 $ | fällt | 22.10. 08:15* | ✅ 82.724 $ (−2,2 %) |
| 16 | 21.10. 18:15 | ETH | 2.508,47 $ | fällt | 22.10. 08:15* | ✅ 2.438,12 $ (−2,8 %) |
| 17 | 21.10. 18:15 | DAX | 25.645,04 (Schluss 21.10.) | steigt | 22.10. 18:15 | ❌ 25.371,75 (−1,1 %) |
| 18 | 21.10. 18:15 | SAP | 208,65 € (Schluss 21.10.) | steigt | 22.10. 18:15 | ✅ 215,35 € (+3,2 %) |
| 19 | 22.10. 08:15 | BTC | 82.724 $ | fällt | 22.10. 13:15 | ✅ 81.898 $ (−1,0 %) |
| 20 | 22.10. 08:15 | ETH | 2.438,12 $ | fällt | 22.10. 13:15 | ✅ 2.401,97 $ (−1,5 %) |
| 21 | 22.10. 08:15** | S&P 500 | 7.757,17 (Schluss 21.10.) | steigt | 22.10. 22:15 | ❌ 7.663,43 (−1,2 %) |
| 22 | 22.10. 08:15** | Nasdaq 100 | 29.822,52 (Schluss 21.10.) | steigt | 22.10. 22:15 | ❌ 28.958,69 (−2,9 %) |
| 23 | 22.10. 08:15** | Nvidia | 221,97 $ (Schluss 21.10.) | steigt | 22.10. 22:15 | ❌ 212,21 $ (−4,4 %) |
| 24 | 22.10. 08:15** | Apple | 343,99 $ (Schluss 21.10.) | steigt | 22.10. 22:15 | ✅ 348,22 $ (+1,2 %) |
| 25 | 22.10. 08:15** | Tesla | 386,47 $ (Schluss 21.10.) | fällt | 22.10. 22:15 | ✅ 374,58 $ (−3,1 %) |
| 26 | 22.10. 08:15** | Gold | 4.110,70 $ | fällt | 22.10. 22:15 | ✅ 4.042,70 $ (−1,7 %) |
| 27 | 22.10. 08:15** | Öl Brent | 111,46 $ | steigt | 22.10. 22:15 | ✅ 113,08 $ (+1,5 %) |
| 28 | 22.10. 08:15** | EUR/USD | 1,1245 | fällt | 22.10. 22:15 | ✅ 1,1216 (−0,3 %) |
| 29 | 22.10. 13:15 | BTC | 81.898 $ | fällt | 22.10. 18:15 | ✅ 81.526 $ (−0,5 %) |
| 30 | 22.10. 13:15 | ETH | 2.401,97 $ | fällt | 22.10. 18:15 | ✅ 2.395,03 $ (−0,3 %) |
| 31 | 22.10. 18:15 | BTC | 81.526 $ | fällt | 22.10. 22:15 | ✅ 81.341 $ (−0,2 %) |
| 32 | 22.10. 18:15 | ETH | 2.395,03 $ | fällt | 22.10. 22:15 | ✅ 2.384,37 $ (−0,4 %) |
| 33 | 22.10. 18:15 | DAX | 25.371,75 (Schluss 22.10.) | steigt | 23.10. 18:15 | offen |
| 34 | 22.10. 18:15 | SAP | 215,35 € (Schluss 22.10.) | steigt | 23.10. 18:15 | offen |
| 35 | 22.10. 22:15 | BTC | 81.341 $ | fällt | 23.10. 08:15 | ❌ 81.809 $ (+0,6 %) |
| 36 | 22.10. 22:15 | ETH | 2.384,37 $ | fällt | 23.10. 08:15 | ❌ 2.405,03 $ (+0,9 %) |
| 37 | 22.10. 22:15 | S&P 500 | 7.663,43 (Schluss 22.10.) | steigt | 23.10. 22:15 | offen |
| 38 | 22.10. 22:15 | Nasdaq 100 | 28.958,69 (Schluss 22.10.) | steigt | 23.10. 22:15 | offen |
| 39 | 22.10. 22:15 | Nvidia | 212,21 $ (Schluss 22.10.) | steigt | 23.10. 22:15 | offen |
| 40 | 22.10. 22:15 | Apple | 348,22 $ (Schluss 22.10.) | steigt (TOP) | 23.10. 22:15 | offen |
| 41 | 22.10. 22:15 | Tesla | 374,58 $ (Schluss 22.10.) | fällt | 23.10. 22:15 | offen |
| 42 | 22.10. 22:15 | Gold | 4.042,70 $ | fällt | 23.10. 22:15 | offen |
| 43 | 22.10. 22:15 | Öl Brent | 113,08 $ | steigt (TOP) | 23.10. 22:15 | offen |
| 44 | 22.10. 22:15 | EUR/USD | 1,1216 | fällt | 23.10. 22:15 | offen |
| 45 | 23.10. 08:15 | BTC | 81.809 $ | fällt | 23.10. 13:15 | offen |
| 46 | 23.10. 08:15 | ETH | 2.405,03 $ | fällt | 23.10. 13:15 | offen |

Trefferquote: 23 / 34 (68 %) · Krypto 9/14 · Europa 3/4 · USA/Rohstoffe/Devisen 11/16 · TOP 0/0 (2 offen)

\* Check 21.10. 22:15 ist ausgefallen (Nutzungslimit erreicht). Krypto-Prognosen #15/#16 wurden laut Regel "bis zum nächsten Check" beim nächsten tatsächlichen Check (22.10. 08:18) ausgewertet; US-Gruppe mit offiziellen Schlusskursen vom 21.10.
\*\* Diese Prognosen hätten am 21.10. um 22:15 entstehen sollen; nachgeholt am 22.10. um 08:15 vor US-Börsenstart.
