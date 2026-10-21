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
| 3 | 21.10. 00:00 | S&P 500 | 7.712,57 (Schluss 20.10.) | steigt | 21.10. 22:15 | offen |
| 4 | 21.10. 08:15 | BTC | 82.620 $ (21.10. 08:19) | fällt | 21.10. 13:15 | ❌ 83.313 $ (+0,8 %) |
| 5 | 21.10. 13:15 | BTC | 83.313 $ (21.10. 13:18) | fällt | 21.10. 18:15 | ❌ 84.557 $ (+1,5 %) |
| 6 | 21.10. 14:45 | ETH | 2.467,37 $ | fällt | 21.10. 18:15 | ❌ 2.508,47 $ (+1,7 %) |
| 7 | 21.10. 14:45 | SAP | 205,40 € | steigt | 21.10. 18:15 | ✅ 208,65 € (+1,6 %) |
| 8 | 21.10. 14:45 | Nasdaq 100 | 29.490,28 (Schluss 20.10.) | steigt | 21.10. 22:15 | offen |
| 9 | 21.10. 14:45 | Nvidia | 216,47 $ (Schluss 20.10.) | steigt | 21.10. 22:15 | offen |
| 10 | 21.10. 14:45 | Apple | 339,50 $ (Schluss 20.10.) | steigt | 21.10. 22:15 | offen |
| 11 | 21.10. 14:45 | Tesla | 373,71 $ (Schluss 20.10.) | fällt | 21.10. 22:15 | offen |
| 12 | 21.10. 14:45 | Gold | 4.145,70 $ | fällt | 21.10. 22:15 | offen |
| 13 | 21.10. 14:45 | Öl Brent | 108,39 $ | steigt | 21.10. 22:15 | offen |
| 14 | 21.10. 14:45 | EUR/USD | 1,1233 | fällt | 21.10. 22:15 | offen |
| 15 | 21.10. 18:15 | BTC | 84.557 $ | fällt | 21.10. 22:15 | offen |
| 16 | 21.10. 18:15 | ETH | 2.508,47 $ | fällt | 21.10. 22:15 | offen |
| 17 | 21.10. 18:15 | DAX | 25.645,04 (Schluss 21.10.) | steigt | 22.10. 18:15 | offen |
| 18 | 21.10. 18:15 | SAP | 208,65 € (Schluss 21.10.) | steigt | 22.10. 18:15 | offen |

Trefferquote: 3 / 6 (50 %) · Krypto 1/4 · Europa 2/2 · USA/Rohstoffe/Devisen 0/0
