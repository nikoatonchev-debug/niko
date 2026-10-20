# Trading-Strategien – was Sinn ergibt (Stand: Oktober 2026)

Notizen für spätere Claude-Sitzungen und für Niko. Nur Strategien mit
belastbaren Belegen (Studien, lange Datenreihen). **Keine Anlageberatung.**

## 0. Die harte Wahrheit zuerst

- **Daytrading:** Die meisten verlieren. In Studien (Barber/Odean, Taiwan)
  verlieren in einem typischen Halbjahr über 80 % der Daytrader Geld. Nur ein
  sehr kleiner Teil gewinnt dauerhaft nach Kosten.
- **CFDs / Hebelprodukte:** Laut EU-Aufsicht ESMA verlieren 74–89 % der
  Privatkonten Geld.
- **Profis schaffen es meist auch nicht:** 2025 lagen ca. 79 % der aktiven
  US-Large-Cap-Fonds hinter dem S&P 500 (SPIVA). Über 10+ Jahre ist es meistens
  noch schlechter.

Daraus folgt: Die Messlatte für jede Strategie ist "besser als ein billiger
Welt-ETF, nach Kosten und Steuern". Die meisten Strategien schaffen das nicht.

## 1. Basis-Strategie: Breiter ETF, kaufen und halten (Grundlage für alles)

- Billiger, breit gestreuter Index-ETF (z. B. MSCI World / FTSE All-World),
  niedrige Kosten (TER), Sparplan.
- **Einmalanlage oder Sparplan?** Vanguard: Einmalanlage war in ca. 2/3 der
  Fälle besser, weil Märkte meistens steigen. Den Betrag aufzuteilen (DCA)
  schützt aber besser vor schlechten Einstiegszeitpunkten und vor eigener Panik.
  Bei laufendem Einkommen ist der monatliche Sparplan sowieso der natürliche Weg.
- Warum es Sinn ergibt: niedrige Kosten, keine Prognose nötig, schlägt die
  meisten Profis.

## 2. Trendfolge / Zeitreihen-Momentum (gut belegt)

- Idee: Was in den letzten ~12 Monaten gestiegen ist, steigt eher weiter; was
  gefallen ist, fällt eher weiter. Belegt über 58–156 Märkte und Daten bis
  zurück ins Jahr 1880 (Moskowitz/Ooi/Pedersen, Hurst/Ooi/Pedersen, AQR).
- Einfache Variante für Privatanleger: **200-Tage-Linie als Filter**.
  Index über 200-Tage-Durchschnitt → investiert; darunter → Anleihen/Cash.
  Monatlich prüfen, nicht täglich (weniger Fehlsignale).
- **Dual Momentum (Antonacci):** relativ (welches ist stärker, z. B. USA oder
  Welt ohne USA?) + absolut (schlägt es überhaupt Cash?).
- Ehrliche Grenzen: Verringert vor allem große Verluste (Crashs), bringt aber
  nicht unbedingt mehr Rendite. Kostet in Seitwärtsmärkten durch Fehlsignale.
  Die letzten 5–10 Jahre waren schwächer. Backtests zeigen trotzdem Verluste
  von 19–45 %, je nach Variante. Steuern bei jedem Verkauf (DE:
  Abgeltungsteuer).

## 3. Faktor-Investing (gut belegt, aber mit langen Durststrecken)

Lange Datenreihen (Dimson/Marsh/Staunton: bis 117 Jahre, 23 Länder) stützen:

| Faktor | Idee | Hinweis |
|---|---|---|
| Value | günstige Aktien (KGV, KBV) | seit ~2018 lange schwach |
| Momentum (Querschnitt) | Gewinner der letzten 12 Monate (ohne letzten Monat) | hoher Umschlag → Kosten |
| Quality | profitable, gering verschuldete Firmen | stabil gut |
| Low Volatility | schwankungsarme Aktien | Beleg umstrittener |
| Size (klein) | Small Caps | schwächster Beleg |

Am einfachsten umzusetzen über Faktor-ETFs oder Multi-Faktor-ETFs. Ein Faktor
kann 5–10 Jahre lang schlechter laufen als der Markt, und man muss
durchhalten.

## 4. Gibt es, aber für Privatleute meist schwer umzusetzen

- **Post-Earnings-Drift (PEAD):** Kurse laufen nach Gewinnüberraschungen weiter
  in dieselbe Richtung. Inzwischen nur noch ca. 1 %/Jahr, bei großen
  US-Aktien weitgehend verschwunden.
- **Kurzfristige Umkehr (Mean Reversion, 1 Woche):** Vor Kosten stark, nach
  Kosten meist weg. Höchstens mit großen, liquiden Aktien und wenig Umschlag.
  Gefährlich in Crashs.
- **Klassische Chartmuster** (Schulter-Kopf-Schulter, Doppeltop, Kerzen):
  Belege gemischt bis schwach. Viele Muster bringen nach Kosten nichts. Am
  ehesten belegt sind einfache Trendregeln (gleitende Durchschnitte,
  Ausbrüche).

## 5. Risikomanagement (wichtiger als die Strategie)

- **Pro Trade maximal 1–2 % des Kontos riskieren.**
  Positionsgröße = riskierter Betrag ÷ Abstand zum Stop-Loss.
  Beispiel: 10.000 € Konto, 1 % = 100 €, Stop 5 € unter Einstieg → 20 Aktien.
- **Kelly-Formel** f = W − (1−W)/R (W = Trefferquote, R = Ø Gewinn/Ø Verlust)
  nur als Obergrenze sehen. Wenn überhaupt, höchstens ¼ bis ½ davon nehmen,
  weil man W und R nie genau kennt.
- Kein oder nur sehr wenig Hebel. Streuen. Nur Geld einsetzen, das man
  mehrere Jahre nicht braucht.
- Ein **Trading-Tagebuch** führen (Einstieg, Grund, Ausstieg, Ergebnis). Ohne
  Tagebuch weiß man nicht, ob man wirklich einen Vorteil hat.

## 6. Wie man eine neue Strategie prüft (Fallen beim Backtest)

- **Überanpassung:** Wer viele Varianten testet, findet immer eine, die im
  Backtest super aussieht (Bailey/López de Prado: "Probability of Backtest
  Overfitting", "Deflated Sharpe Ratio"). Also: wenige Parameter, Test auf
  Daten, die man vorher nicht benutzt hat, und in mehreren Märkten.
- Kosten, Spread, Slippage und Steuern immer mitrechnen.
- Funktioniert die Strategie auch mit leicht anderen Parametern (z. B. 150
  oder 250 statt 200 Tage)? Wenn nicht, ist sie wahrscheinlich Zufall.
- Gibt es einen **Grund**, warum sie funktionieren sollte (Risiko-Prämie,
  menschliches Verhalten)? Ohne Grund ist es wahrscheinlich Data-Mining.
- Erst mit kleinem Geld oder auf Papier testen (Paper-Trading).

## 7. Sinnvolle Kombination für Niko (Vorschlag)

1. **Kern (z. B. 70–90 %):** Welt-ETF-Sparplan, nicht anfassen.
2. **Satellit (z. B. 10–30 %):** *eine* regelbasierte Strategie, z. B.
   200-Tage-Trendfilter oder Dual Momentum, monatlich prüfen.
3. Regeln vorher festschreiben und befolgen, nicht nach Gefühl handeln.

## Quellen

- AQR – Time Series Momentum: https://www.aqr.com/Insights/Research/Journal-Article/Time-Series-Momentum
- Alpha Architect – Trend following historical evidence: https://alphaarchitect.com/time-series-momentum-aka-trend-following-the-historical-evidence/
- Quantpedia – Time-Series Momentum Works Everywhere: https://quantpedia.com/time-series-momentum-works-everywhere/
- Jordan & Diltz (2003), Profitability of Day Traders: https://rpc.cfainstitute.org/research/financial-analysts-journal/2003/the-profitability-of-day-traders
- Motley Fool zu Barber/Odean: https://www.fool.com/investing/general/2010/03/10/an-80-chance-youll-fail.aspx
- ESMA zu CFDs: https://www.esma.europa.eu/pl/node/84933
- SPIVA U.S. Year-End 2025: https://www.spglobal.com/spdji/en/spiva/article/spiva-us-year-end-2025/
- Dimson/Marsh/Staunton, Factor-based investing: https://www.london.edu/faculty-and-research/academic-research/f/factor-based-investing-the-long-term-evidence
- CXO Advisory – Equity factor investing update: https://www.cxoadvisory.com/value-premium/equity-factor-investing-update/
- Dual Momentum Kritik: https://awealthofcommonsense.com/2015/07/my-thoughts-on-gary-antonaccis-dual-momentum/
- Lump Sum vs. DCA (Vanguard-Zusammenfassung): https://robberger.com/lump-sum-investing-vs-dollar-cost-averaging
- PEAD – "Rest in Peace PEAD": https://cfr.ivo-welch.info/published/papers/martineau2021rest.pdf
- Short-term reversal: https://quantpedia.com/strategies/short-term-reversal-in-stocks
- Backtest Overfitting: https://papers.ssrn.com/abstract=2326253
- Deflated Sharpe Ratio: https://papers.ssrn.com/abstract=2460551
- Technische Analyse (MSCI, False Discovery Rate): https://arxiv.org/pdf/1811.06766
- Kelly-Kriterium: https://www.luxalgo.com/library/concept/kelly-criterion/
