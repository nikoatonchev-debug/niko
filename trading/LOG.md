# Papier-Trading-Test (21.10.2026 – 27.10.2026)

Regeln:
- Checks täglich 08:15, 13:15, 18:15, 22:15 (Europe/Berlin).
- Bitcoin: Prognose "steigt/fällt bis zum nächsten Check", Auflösung beim nächsten Check.
- DAX: Prognose "nächster Schlusskurs höher/tiefer als letzter Schlusskurs", Auflösung beim 18:15-Check.
- S&P 500: wie DAX, Auflösung beim 22:15-Check.
- Kursquelle: Branch kurse-daten, Datei kurse.json (GitHub Action, stündlich + bei jedem Check manuell gestartet).
- Methode: Trendfolge (Richtung des 1-Wochen-/12-Monats-Trends) + aktuelle News. Kein echtes Geld, keine Anlageberatung.

| Nr | Erstellt | Markt | Referenz | Prognose | Auflösung fällig | Ergebnis |
|---|---|---|---|---|---|---|
| 1 | 21.10. 00:00 | BTC | 83.048 $ (21.10. 00:20, CoinGecko) | fällt | 21.10. 08:15 | ✅ 82.620 $ (−0,5 %) |
| 2 | 21.10. 00:00 | DAX | 25.304,42 (Schluss 20.10.) | steigt | 21.10. 18:15 | offen |
| 3 | 21.10. 00:00 | S&P 500 | 7.712,57 (Schluss 20.10.) | steigt | 21.10. 22:15 | offen |
| 4 | 21.10. 08:15 | BTC | 82.620 $ (21.10. 08:19) | fällt | 21.10. 13:15 | offen |

Trefferquote: 1 / 1 (100 %)
