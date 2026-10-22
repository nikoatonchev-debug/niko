# Trendfolge und Zeitreihen-Momentum

**Kurz gesagt:** Trendfolge heißt, Märkte zu kaufen, die über Monate gestiegen sind, und gefallene Märkte zu meiden. Über viele Märkte gestreut und auf Monatssicht gehört das zu den am besten belegten Renditemustern, allerdings vor allem in Backtests (nachträglichen Simulationen). Für einen einzelnen Markt ist das Signal schwach. Für den nächsten Tag oder die nächsten Stunden gibt es keinen Beleg für eine Richtungsvorhersage. Die 200-Tage-Linie taugt als Risiko- und Phasenfilter, nicht als Tagesorakel, und echte Trendfonds liefen seit 2010 deutlich schlechter als ihre Backtests.

**Begriffe:** *Zeitreihen-Momentum (TSMOM)* misst einen Markt an seiner eigenen Vergangenheit. Die *Sharpe-Ratio* ist die Rendite über dem Zins pro Einheit Schwankung (0,5 gilt als gut, 1,0 als sehr gut). *Lookback* ist der Rückblickzeitraum. *Brutto* heißt vor Kosten.

## Was belegt ist

1. **[stark] TSMOM im Portfolio.** Moskowitz/Ooi/Pedersen untersuchten 58 Futures von 1985 bis 2009. Die Rendite der letzten 1 bis 12 Monate sagte bei jedem Instrument die Rendite des Folgemonats positiv voraus. Über 12 Monate hinaus kehrte sich der Effekt teilweise um [1]. Hurst u.a. kommen für 1985–2012 auf einen Sharpe von 1,8, nach Assetklassen 0,78 (Aktienindizes) bis 1,05 (Rohstoffe) [2]. Das sind Brutto-Backtests auf Futures mit volatilitätsskalierten Positionen. Auf eine 200-Tage-Regel für einen einzelnen Markt sind sie nicht übertragbar.
2. **[stark, mit Einschränkung] Lange Historie.** AQR (1880–2016, 67 Märkte) findet einen Sharpe von ca. 0,77 nach hypothetischen Gebühren und Kosten [3], CFM findet Trends seit 1800 [4]. Die Daten vor 1960 sind rekonstruiert, die Autoren verkaufen Trendfonds, und die Einzelzahlen sind nicht an den Primärquellen geprüft.
3. **[mittel] Ein einzelner Markt liefert ein schwaches Signal.** Huang u.a. finden pro Markt kaum Vorhersagekraft, außerhalb der Stichprobe ist das R² meist negativ [5]. Ein großer Teil des Erfolgs stammt aus der Volatilitäts-Skalierung: Das Monats-Alpha liegt bei 1,27 % mit Skalierung und bei 0,41 % ohne [6]. Ein weiterer Teil ist schlicht Long-Exposure in steigenden Märkten [7].
4. **[mittel] Volatilitäts-Skalierung** bedeutet kleinere Positionen in schwankungsreichen Märkten. Sie senkt Extremverluste zuverlässig, verbessert den Sharpe aber vor allem bei Aktien [8]. Ob sie auch mehr Rendite bringt, ist umstritten [9].
5. **[mittel] Es gibt keine beste Signallänge.** Lookbacks von 1 bis 12 Monaten funktionierten alle, und eine Mischung ist robuster als jede Einzelwahl [11]. Die 200-Tage-Linie ist nur ein Spezialfall eines Trendfilters [10].
6. **[mittel] Die 10-Monats-Regel auf breite Assetklassen (Faber)** erreichte einen Sharpe von 0,73 statt 0,44 und einen maximalen Jahresverlust von −9,5 % statt −46 %, brutto und ohne Steuern [12]. Nach 2009 lag sie aber lange hinter Aktien und 60/40 und erzeugte Fehlsignale (2011, 2015/16, 2018, 2020). Belastbar ist sie nur als Bremse in langsamen Bärenmärkten. Monatlich zu prüfen schlägt tägliches Prüfen, und Stop-Loss-Regeln brachten nichts zusätzlich [13].
7. **[mittel] Auf Tagessicht trennt die Linie vor allem die Schwankungsphasen.** 76 % der 78 extremsten Tage zwischen 1950 und 2007 lagen unter der Linie [18]. Die tägliche Autokorrelation von Aktienindizes ist seit den 2000ern negativ, auf einen Tag folgt also eher eine leichte Gegenbewegung [17]. Der S&P 500 stieg seit 1928 an 52,1 % der Tage [19].
8. **[mittel] Kurzfristige Trends sind schwächer geworden.** Laut CFM sind kurze Trends verkümmert, lange nicht [4]. Ein Preprint von 2026 ohne Peer Review findet nach 2008 einen Einbruch vor allem bei Kontrakten mit kleiner Tickgröße, während Kontrakte mit großer Tickgröße (typisch: Zins-Futures) weitgehend intakt blieben [20]. Dazu gibt es Widerspruch [21].
9. **[mittel] Auf Stundenebene ist kein Vorteil nutzbar.** Intraday-Momentum hängt an der Schlussauktion und an Absicherungsgeschäften [22], und Krypto hat keine Schlussauktion. Bitcoin-Renditen über 1 bis 4 Stunden kehren sich eher um [23]. Mit Turbo-Zertifikaten verloren 74,2 % der Anleger Geld, im Schnitt 6.358 € (BaFin, 2019–2023) [24]. Seit dem 16.06.2026 ist vor dem Kauf eine Wissensabfrage Pflicht [25].
10. **[mittel] Gewinne in Krisen.** AQR meldet Gewinne in 8 der 10 größten 60/40-Verluste [3], und 2022 erzielte der SG Trend Index netto +27,35 % [27]. Die Stichproben sind klein, die Quellen meist Anbieter. Das gilt nur für Krisen, die über Monate laufen [26].
11. **[stark] Die Live-Rendite liegt unter den Backtests.** Der SG Trend Index brachte 2010–2019 ca. 1,8 % p.a. [30]. In den 12 Monaten bis April 2025 verlor er −18,7 %, im Jahr 2025 gewann er ca. +2,4 % [31]. Sein Sharpe lag 2010–2018 bei ca. 0,05 gegenüber 0,28 seit 2000. Das sind Werte des Fondsindex, keine Einzelmarkt-Werte [34]. CTAs schlugen 1994–2007 den Geldmarkt netto nur um 0,85 % p.a., brutto um ca. 5,4 %. Den Rest fraßen die Gebühren [35]. Für 2026 ist nur Ende April ein Plus von +10,27 % belegt [32], Werte um +15 % Mitte Oktober sind unverifiziert (unsicher) [33].
12. **[mittel] Einzelaktien:** Die Trefferquote ist niedrig, und weniger als 7 % der Trades bringen den Großteil des Gewinns (Anbieter-Studie, brutto) [36]. Nvidia, Apple, Tesla und SAP sind durch Survivorship ausgewählt: Man kennt sie, weil sie große Trends hatten.
13. **[mittel] EUR/USD:** Die Gewinne einfacher Trendregeln sind seit Anfang der 1990er weitgehend verschwunden [37].
14. **[mittel] Krypto:** In frühen Stichproben zeigte sich starkes Momentum auf Tages- und Wochenbasis [38], das nach den Bitcoin-Futures 2017 offenbar verschwand [39]. Wie es heute aussieht, ist (unsicher).
15. **[mittel] Steuern in Deutschland:** Auf jeden realisierten Gewinn fallen 26,375 % an, plus gegebenenfalls Kirchensteuer. Aktienverluste lassen sich nur mit Aktiengewinnen verrechnen, der Sparerpauschbetrag beträgt 1.000 €. Verluste aus Termingeschäften sind seit dem JStG 2024 unbegrenzt verrechenbar [40]. Backtests ignorieren Steuern fast immer.

## Mythen und Vorsicht

- **„Die 200-Tage-Linie bzw. das Golden Cross schlägt Buy-and-Hold bei der Rendite.“** Das ist widerlegt. Beim Dow Jones bleiben 8,11 % nach Kosten gegenüber 9,39 % mit Buy-and-Hold [14]. Nach Korrektur für Data-Snooping waren nur 2 von 17 US-Futures signifikant [15]. Nach einem Death Cross lag die 12-Monats-Rendite im Schnitt bei −0,18 %, also nahe null [16]. Belegt ist nur das bessere Risikoprofil.
- **„Trendfolge schützt in jedem Crash.“** Das ist falsch. Im April 2025 verlor der SG Trend Index −4,89 %, von Mai 2024 bis Mai 2025 −20,4 % bei steigenden Weltaktien [28]. Nach Finanzkrisen ist Trendfolge im Schnitt etwa vier Jahre schwach [29].
- **„Die Trefferquote zeigt die Qualität.“** Trendfolge verdient mit wenigen großen Gewinnen, deshalb kann eine gute Strategie unter 50 % treffen. Eine Umrechnung von Sharpe in Trefferquote führt in die Irre.
- **„Backtests gelten auch künftig.“** Bei Aktienanomalien fielen die Renditen nach der Veröffentlichung um 58 % [41]. Das ist nicht direkt auf Trendfolge übertragbar, ein deutlicher Abschlag ist aber realistisch.
- **Interessenkonflikte:** Die meisten Pro-Trend-Belege stammen von Fondsanbietern (AQR, Man, CFM, Concretum).
- **News:** Der News-Teil der Methode ist nicht geprüft. Öffentliche News sind meist schon eingepreist, und eine spontane Kombination mit dem Trend lädt zu Bestätigungsfehlern ein.

## Was das für Niko heißt

Das ist keine Anlageberatung und kein Gewinnversprechen.

1. **Auf den Horizont achten:** Die 200-Tage-Linie blickt ca. 10 Monate zurück, belegt ist sie für Monatsrenditen. Für den nächsten Tag oder 4–5 Stunden nur niedrige Konfidenz vergeben.
2. **Gegen Baselines messen:** Münzwurf, „steigt immer“ (Aktien steigen an ca. 52–53 % der Tage) und „wie gestern“. „Über der Linie = steigt“ ist im Bullenmarkt fast dasselbe wie „steigt immer“.
3. **Eine Woche beweist nichts:** Ca. 60 Prognosen, teils stark korreliert (S&P, Nasdaq, Nvidia, Apple; BTC und ETH), ergeben effektiv 20–30 Beobachtungen. Allein durch Zufall schwankt die Trefferquote dann um etwa ±13–18 Prozentpunkte um 50 %. Den Test über Monate fortführen.
4. **Sauber protokollieren:** Prüfzeitpunkt und Datenquelle vorher festlegen (Overnight-Lücken, Wochenenden, Krypto rund um die Uhr). Zu jeder Prognose eine Wahrscheinlichkeit notieren und mit dem Brier-Score bewerten statt nur nach richtig oder falsch.
5. **Die Linie als Regime-Filter nutzen:** Unter der Linie mit mehr Schwankung rechnen, die Konfidenz senken und Positionen verkleinern.
6. **Mehrere Lookbacks nutzen:** Die Vorzeichen der 1-, 3- und 12-Monats-Rendite vergleichen und nur bei Übereinstimmung etwas mehr Konfidenz geben.
7. **BTC/ETH (4–5 h) und EUR/USD:** Ohne klaren Auslöser 50/50 mit niedriger Konfidenz ansetzen.
8. **Später mit echtem Geld:** Monatlich prüfen, ein Puffer-Band von ±1–3 % nutzen, Positionen nach Volatilität bemessen, breit streuen und keine Turbos einsetzen. Steuern einrechnen und lange Durststrecken sowie Verluste um 20 % einplanen.

## Offene Fragen

- Wie hoch sind die exakten Sharpe-Werte bei Moskowitz/Ooi/Pedersen? Ist der Einzelmarkt-Sharpe von ca. 0,38 korrekt?
- Wie hat sich der SG Trend Index 2026 wirklich entwickelt? Die Mai-Werte widersprechen sich (+7,33 % vs. +10,27 % im April) [32][42].
- Hält Kurth u.a. (2026) einem Peer Review stand?
- Gibt es Krypto-Momentum nach den Spot-ETFs von 2024 noch?
- Wie viel der CTA-Rendite 2023–2026 ist reiner Zins?
- Verbessert die Kombination aus Trend und News die Tagesprognose messbar?
- Ist die Tages-Autokorrelation bei DAX und SAP 2017–2026 ebenfalls negativ?
- Bringt Volatilitäts-Skalierung bei Tesla und Nvidia nach Kosten und Steuern einen Mehrwert?

## Quellen

1. Moskowitz, Ooi, Pedersen – Time Series Momentum: https://papers.ssrn.com/abstract=2089463
2. Hurst, Ooi, Pedersen – Demystifying Managed Futures: https://www.aqr.com/-/media/AQR/Documents/Insights/Journal-Article/Demystifying-Managed-Futures.pdf
3. AQR – A Century of Evidence on Trend-Following Investing: https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2993026
4. Lempérière u.a. – Two centuries of trend following: https://ar5iv.arxiv.org/html/1404.3274
5. Huang, Li, Wang, Zhou – Time series momentum: Is it there?: https://ideas.repec.org/a/eee/jfinec/v135y2020i3p774-794.html
6. Kim, Tse, Wald – Time Series Momentum and Volatility Scaling: https://works.bepress.com/yiuman-tse/10
7. Goyal, Jegadeesh – Cross-Sectional and Time-Series Tests of Return Predictability: https://sfi.ch/en/publications/cross-sectional-and-time-series-tests-of-return-predictability-what-is-the-difference
8. Harvey u.a. – The Impact of Volatility Targeting: https://scholars.duke.edu/publication/1370354
9. Cederburg u.a. (Zusammenfassung): https://alphaarchitect.com/does-portfolio-timing-based-on-volatility-signals-outperform-buy-and-hold/
10. Levine, Pedersen – Which Trend Is Your Friend?: https://research-api.cbs.dk/ws/files/60084063/lasse_heje_pedersen_et_al_which_trend_is_your_friend_publishersversion.pdf
11. Goulding, Harvey, Mazzoleni – Momentum Turning Points: https://scholars.duke.edu/publication/1586630
12. CXO Advisory – Extension of A Quantitative Approach to Tactical Asset Allocation: https://www.cxoadvisory.com/strategic-allocation/extension-of-a-quantitative-approach-to-tactical-asset-allocation
13. Clare u.a. – Breaking into the Blackbox: https://openaccess.city.ac.uk/id/eprint/17842
14. Validea – Siegel Moving Average Strategy: https://blog.validea.com/the-moving-average-strategy-good-results-if-you-have-the-discipline/
15. Park, Irwin – Technical trading rules in US futures: https://ageconsearch.umn.edu/record/19039/files/cp05pa01.pdf
16. CXO Advisory – Death Crosses and Golden Crosses: https://www.cxoadvisory.com/technical-trading/u-s-stock-market-death-crosses-and-golden-crosses/
17. Baltussen, van Bekkum, Da – Indexing and Stock Market Serial Dependence: https://personal.eur.nl/vanbekkum/2018%20JFE%20BaltussenVanBekkumDa.pdf
18. CXO Advisory – Does a Long-term Moving Average Indicator Predict Big Days?: https://www.cxoadvisory.com/volatility-effects/does-a-long-term-moving-average-indicator-predict-big-days
19. ETF Trends – S&P 500 up days since 1928: https://www.etftrends.com/?p=142073
20. Kurth u.a. – Is Trend Still Your Friend? (Preprint): https://arxiv.org/abs/2607.01550
21. Sepp, Lucic – The Science and Practice of Trend-Following Systems (Preprint): https://arxiv.org/pdf/2607.19497
22. Baltussen, Da, Lammers, Martens – Hedging Demand and Market Intraday Momentum: https://www3.nd.edu/~zda/intramom.pdf
23. LMU München – Bitcoin Autokorrelation auf Stundenbasis: https://epub.ub.uni-muenchen.de/97651/
24. test.de – Studie zu Turbo-Zertifikaten: https://www.test.de/Studie-zu-Turbo-Zertifikaten-Die-meisten-Anleger-machen-mit-Turbo-Zertifikaten-Verluste-6227752-0/
25. PwC Legal – Allgemeinverfügung Turbo-Zertifikate: https://legal.pwc.de/de/news/fachbeitraege/aktuelle-informationen-zur-allgemeinverfuegung-der-bafin-betreffend-turbo-zertifikate
26. Man Group – Trend Following: Equity and Bond Crisis Alpha: https://www.man.com/insights/trend-following-equity-and-bond-crisis-alpha
27. Hedgeweek – CTAs complete record year 2022: https://www.hedgeweek.com/flat-december-sees-ctas-complete-record-year-2022/
28. Alternatives Watch – Trend-following hedge funds endure more pain: https://www.alternativeswatch.com/2025/06/02/trend-following-hedge-funds-endure-more-pain-societe-generale-indices/
29. Swedroe – Trend Following Works Weakest After Crises: https://www.etf.com/sections/index-investor-corner/swedroe-trend-following-works-weakest-after-crises
30. Welton – Performance Drivers Return for Quant Macro and Trend Following: https://www.welton.com/performance-drivers-return-for-quant-macro-and-trend-following/
31. Top Traders Unplugged – Performance Report December 2025: https://www.toptradersunplugged.com/?p=20381
32. Top Traders Unplugged – Week in Review May 1, 2026: https://www.toptradersunplugged.com/trend-following-week-in-review-may-1-2026/
33. Top Traders Unplugged – Week in Review October 16, 2026: https://www.toptradersunplugged.com/trend-following-week-in-review-october-16-2026/
34. Zusammenfassung „You Can't Always Trend When You Want“: https://theideafarm.com/alternative-investment/you-cant-always-trend-when-you-want/
35. CXO Advisory – Analysis of Managed Futures (Bhardwaj, Gorton, Rouwenhorst): https://www.cxoadvisory.com/commodity-futures/analysis-of-managed-futures
36. Concretum – Does Trend Following Still Work on Stocks?: https://concretumgroup.com/does-trend-following-still-work-on-stocks/
37. Neely, Weller, Ulrich – The Adaptive Markets Hypothesis (FX): https://ideas.repec.org/a/cup/jfinqa/v44y2009i02p467-488_09.html
38. Liu, Tsyvinski – Risks and Returns of Cryptocurrency: https://ideas.repec.org/a/oup/rfinst/v34y2021i6p2689-2727..html
39. Swinkels u.a. – Crypto TSMOM nach Bitcoin-Futures (Seminar): https://utilities.tinbergen.nl/?p=66235
40. VLH – Verluste aus Termingeschäften: https://www.vlh.de/kaufen-investieren/geldanlage/verluste-aus-termingeschaeften-das-aendert-sich.html
41. McLean, Pontiff – Does Academic Research Destroy Stock Return Predictability?: https://ivey.uwo.ca/media/3775549/pontiff.pdf
42. Wisdom Trading – Managed Futures May 2026 Recap: https://wisdomtrading.com/insights/managed-futures-may-2026-trend-recap/
