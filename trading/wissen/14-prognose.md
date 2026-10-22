# Kurzfristige Kursprognosen: was ist realistisch?

**Kurz gesagt:** Ob ein Kurs in den nächsten Stunden oder bis morgen steigt oder fällt, ist bei großen, liquiden Märkten fast Zufall. Selbst die besten Forschungsmodelle erklären nur Bruchteile eines Prozents der Kursschwankungen, und veröffentlichte Muster werden danach schwächer. Wer eine Trefferquote misst, muss sie mit einer einfachen Vergleichsregel wie „immer steigt“ vergleichen, nicht mit 50 %. Ein Wochentest mit rund 60 Prognosen kann Glück und Können nicht unterscheiden. Er eignet sich zum Üben und zum Aufbau sauberer Messregeln, nicht als Beweis.

## Was belegt ist

Belegstärke: [stark] = mehrere solide Studien, [mittel] = einzelne Studien oder Einschränkungen, [schwach] = Preprints oder Sekundärquellen. Preprints aus 2025/2026 sind nicht begutachtet.

- **Die Basisrate ist der eigentliche Gegner [mittel].** Basisrate heißt: Wie oft steigt ein Markt ohnehin? Beim S&P 500 schließen langfristig etwa 52-54 % der Handelstage im Plus. Die Größenordnung ist allgemein bekannt, die genauen Einzelwerte sind ungeprüft [1][2]. Bitcoin liegt laut schwachen Aggregatorzahlen bei 49-54 % Plus-Tagen (unsicher). Das hängt davon ab, welche Uhrzeit als Tagesschluss gilt [3][4][5]. Für BTC/ETH über 4-5 Stunden und für EUR/USD über einen Tag liegt die Basisrate praktisch bei 50 %. In einer einzelnen Woche kann sie stark vom langen Schnitt abweichen, etwa wenn alle 5 Tage im Minus schließen.
- **Kurse sind fast ein Random Walk [stark].** Random Walk heißt: Die nächste Bewegung ist aus den bisherigen nicht vorhersagbar. Lo/MacKinlay lehnten ihn für wöchentliche US-Aktienrenditen 1962-1985 ab. Der gleichgewichtete Index hatte damals eine wöchentliche Autokorrelation (Zusammenhang einer Woche mit der vorherigen) von etwa 30 %. Treiber waren kleine Aktien, die kaum handelbar waren. Einzelaktien zeigten leicht negative Werte [6]. Bei großen Indizes liegt die Autokorrelation heute grob bei null, beim S&P 500 auf Tagesbasis seit den 2000ern teils leicht negativ. Das spricht gegen „Trend setzt sich morgen fort“.
- **Minuten-Vorteile sind weg [stark].** Informationen aus Orderungleichgewichten waren schon 1996-2002 nach 5-60 Minuten eingepreist [8]. Heute geht das durch Hochfrequenzhandel in Sekunden oder schneller. Für Privatanleger ist das nicht erreichbar.
- **Realistische Vorhersagbarkeit ist winzig [stark].** Die besten ML-Modelle bei Gu/Kelly/Xiu erklären out-of-sample (auf neuen, nicht zum Training genutzten Daten) nur 0,33-0,40 % der monatlichen Schwankungen von Einzelaktien. Das gilt in der Fachwelt als Erfolg [9][10][11]. Getrieben wird der Wert stark von Micro Caps (sehr kleinen Firmen), die teuer zu handeln sind. Dass auch kleine R²-Werte nutzbar sein könnten [12], ist umstritten.
- **Der historische Durchschnitt ist schwer zu schlagen [stark].** Klassische Prädiktoren (Dividendenrendite, KGV, Zinsen) schlagen den einfachen Mittelwert out-of-sample kaum verlässlich. Von 29 neueren Variablen sind über ein Drittel schon in-sample (also auf den Daten, an denen sie gefunden wurden) nicht signifikant, und etwa die Hälfte der übrigen versagt danach [13][14][15]. Das sind Monats- und Jahreshorizonte.
- **Deep Learning auf Tagesbasis [mittel].** Fischer/Krauss fanden 0,46 % pro Tag und eine Sharpe Ratio (Rendite pro Risiko) von 5,8 vor Kosten. Ab etwa 2010 schwanken die Renditen um null und sind nach Kosten unprofitabel [16]. Die Studie sagt relative Rangfolgen voraus, nicht „steigt/fällt“. Bei Krypto (täglich) liegen die Trefferquoten bei 52,9-54,1 % [18].
- **Veröffentlichte Muster verlieren an Kraft [stark].** Bei 97 Prädiktoren sanken die Renditen out-of-sample um 26 % und nach Veröffentlichung um 58 % [19][20]. Die Effekte existieren meist weiter, nur schwächer. Ob das auch für Intraday- oder LLM-Strategien gilt, ist plausibel, aber nicht belegt.
- **Intraday-Momentum [mittel].** Die erste halbe Stunde sagt die letzte halbe Stunde etwas voraus (R² etwa 1,6 % in-sample). Der Effekt hängt von der Marktstruktur ab und ist zeitlich instabil [21][22][23][24]. Für Nikos Horizonte passt er nicht.
- **Bitcoin wird effizienter [mittel].** Frühe Tests fanden Ineffizienz [25][26][27]. Mit anderen Testverfahren wirkt Bitcoin schon damals schwach effizient. Ineffizienz bedeutet ohnehin nicht Gewinn nach Kosten.
- **EUR/USD ≈ Zufall [stark].** Seit Meese/Rogoff (1983) ist der Random Walk („morgen wie heute“) kaum zu schlagen [28][29][30]. Einzelne Erfolge sind instabil.
- **Trendfolge wirkt über Monate, nicht über Tage [mittel].** Zeitreihen-Momentum über 1-12 Monate ist in Dutzenden Märkten seit 1880 dokumentiert [31][32][33]. Bei einzelnen Märkten sind die Belege schwächer. Mit sauberer Simulation ist die 200-Tage-Linie nur wenig besser als Kaufen und Halten, und der Vorteil stammt vor allem aus wenigen Crash-Phasen [34]. Auf Tagesbasis entspricht „Kurs über 200-Tage-Linie“ in Aufwärtsphasen praktisch „immer steigt“.
- **News-Stimmung [mittel].** Pessimistische Medien drücken die Kurse am nächsten Tag, danach folgt eine Umkehr. Der Effekt ist in Rezessionen am stärksten [35][36]. Firmenspezifische negative News können echte Information enthalten. Die alten Befunde sind heute weitgehend durch Maschinen eingepreist.
- **LLM-News-Strategien (unsicher) [mittel].** GPT-Bewertungen von Schlagzeilen sagten die Rendite des nächsten Tages voraus, früh etwa 38 Basispunkte pro Tag vor Kosten. Der Vorteil zerfiel mit wachsender LLM-Nutzung und ist nur für Akteure mit sehr niedrigen Kosten nutzbar [37][38][39]. Die genauen Zahlen der Versionen sind nicht vergleichbar.
- **Look-Ahead-Bias bei LLMs [schwach].** LLMs können in Backtests Ereignisse aus ihren Trainingsdaten „erinnern“ [40][41]. Das Problem ist real, aber nicht immer dominant [42]. Echte Live-Prognosen wie in Nikos Test sind davon nicht betroffen.
- **Stündliche Krypto-Signale scheitern an Kosten (unsicher) [schwach].** Laut einer nicht überprüften KI-Zusammenfassung eines Preprints scheitern naive Strategien schon bei 10 Basispunkten Kosten [43].
- **Richtig messen [stark].** Der Brier-Score bewertet Wahrscheinlichkeiten: 0 ist perfekt, „immer 50 %“ ergibt 0,25 [46][47][48]. Der Pesaran-Timmermann-Test funktioniert nicht, wenn man fast immer dasselbe tippt. Besser ist ein gepaarter Diebold-Mariano-Vergleich gegen eine Basisraten-Prognose.
- **Stichprobengröße [stark, eigene Rechnung].** Bei 60 Prognosen liegt der Standardfehler bei etwa 6,5 Prozentpunkten (95-%-Intervall ±12,7). 60 % Treffer sind mit Zufall vereinbar (p ≈ 0,06). Um 55 % gegen 50 % zu zeigen, braucht man etwa 270 unabhängige Prognosen, mit 80 % Power etwa 620. Gegen eine Basisrate von 53 % sind es mehrere tausend. Die 12 Märkte reagieren oft gemeinsam auf Fed, Inflationsdaten oder Risikostimmung. Eine Woche liefert deshalb eher 5-15 unabhängige Beobachtungen als 60.

## Mythen und Vorsicht

- **„Experten treffen die Richtung.“** Widerlegt. 6.582 Prognosen von 68 Gurus (2005-2012) erreichten 46,9 % Treffer, eine weitere Auswertung etwa 48 % [44][45]. Die Bewertung war teils subjektiv.
- **„Mit Daytrading verdient man regelmäßig.“** Widerlegt. Bei 74-89 % der CFD-Konten von Privatkunden gingen Verluste, im Schnitt 1.600-29.000 EUR pro Kunde. Diese ESMA-Zahl stammt von vor den Hebelgrenzen [49]. Weniger als 1 % der Daytrader in Taiwan sind verlässlich profitabel nach Gebühren [50].
- **„60-90 % Trefferquote.“** Solche Werte stammen meist aus Overfitting (Überanpassung an alte Daten), aus Look-Ahead-Bias, aus Marketing oder aus nicht handelbaren Sofortreaktionen. Die „90 %“ bei Lopez-Lira betreffen nur die Reaktion im selben Moment (unsicher) [37].
- **„51-55 % Treffer sind Profi-Niveau.“** Unbelegt. Profis werden über Rendite und Risiko gemessen. Trendfolger treffen oft unter 50 % und verdienen trotzdem, weil die Gewinne größer sind als die Verluste. Umgekehrt kann man mit 60 % Treffern Geld verlieren.
- **„Die 200-Tage-Linie sagt morgen voraus.“** Nein. Sie ist ein Regime- bzw. Risikofilter über Monate.
- **„Wer News liest, hat einen Vorsprung.“** Bis ein Privatanleger eine Schlagzeile gelesen hat, ist sie meist im Kurs.

## Was das für Niko heißt

Das ist keine Anlageberatung und kein Gewinnversprechen.

1. **Vergleichsprognosen mitführen:** Neben jede Prognose „immer steigt“ und „wie gestern“ notieren und am Ende vergleichen. In Aufwärtsphasen misst die Trendfolge-Methode sonst nur die Basisrate der Woche.
2. **Wahrscheinlichkeiten statt nur hoch/runter:** zum Beispiel „BTC steigt bis zum Check: 55 %“. Wer nichts weiß, schreibt 50 %. Am Ende den Brier-Score gegen die Basisrate berechnen.
3. **Nicht überinterpretieren:** Eine Woche beweist nichts, weder Können noch Unfähigkeit. Verwandte Märkte (S&P 500, Nasdaq 100, Nvidia, Apple sowie BTC und ETH) zählen eher als ein Signal.
4. **Regeln vorher festlegen:** Methode und Messgröße vor dem Test notieren und während des Tests nicht ändern. Wer nach jeder Woche nachjustiert, passt die Regeln an den Zufall an.
5. **Stärke der Bewegung erfassen:** Neben „richtig/falsch“ auch die prozentuale Bewegung notieren. Termine wie Fed-Sitzungen und Quartalszahlen (Nvidia, Apple, Tesla, SAP) im Protokoll vermerken.
6. **News nur zählen, wenn sie nach dem letzten Kurs bekannt wurden.**
7. **Kein echtes Geld mit Hebel** (CFDs, Krypto-Futures) auf Basis kurzfristiger Prognosen. Breit gestreute ETFs bleiben die am besten belegte Grundlage. Steuern und Spreads (Differenz zwischen Kauf- und Verkaufskurs) verschieben die Gewinnschwelle zusätzlich. Die Details sollten vor echtem Handel geprüft werden.
8. **Abschlag auf Studienzahlen:** Mindestens die Hälfte des Effekts abziehen und danach noch die Kosten.

## Offene Fragen

- Genaue Plus-Tage-Quote von BTC und ETH aus Primärdaten bei einheitlicher Schlusszeit, auch auf 4-Stunden-Basis.
- Erhöht „Kurs über der 200-Tage-Linie“ bei DAX, SAP, Brent und EUR/USD die Plus-Quote am nächsten Tag messbar? Das ließe sich mit eigenen Daten prüfen.
- Widerspricht die kurzfristige Umkehr bei Einzelaktien (Jegadeesh 1990, Lehmann 1990) einer Trendfolge auf Tagesbasis bei Tesla, Apple und Nvidia? In den Daten ist dazu keine Quelle.
- Wäre es realistischer, die Schwankungsbreite statt der Richtung zu prognostizieren? Volatilität gilt als gut vorhersagbar (GARCH), dafür liegt hier aber keine Quelle vor.
- Wie stark sind FOMC-Drift und Earnings-Effekte heute noch?
- Gibt es Intraday-Momentum bei SPY, QQQ und DAX-Futures nach 2013 noch?
- Wie stark sind LLM-News-Strategien nach 2024 weiter zerfallen, und wie gut kalibriert sind LLM-Wahrscheinlichkeiten in großen Stichproben?
- Lassen sich die ungeprüften Zahlen (Trendfolge-Sharpe 0,4 oder 0,7-0,8, die 80 % Fehlsignale bei Zakamulin, Campbell/Thompson-R²) im Volltext bestätigen? Einige Prüfungen scheiterten an technischen Grenzen.
- Welche Steuerregeln gelten genau für kurzfristige Krypto- und Aktiengewinne in Deutschland?

## Quellen

1. [Asset Dedication: Black Swan](https://www.assetdedication.com/wp-content/uploads/2025/12/PPT-on-Black-Swan-Article-FINAL.pdf)
2. [Hartford Funds CCWP161](https://hartfordfunds.com/dam/en/docs/pub/whitepapers/CCWP161.pdf)
3. [PortfoliosLab BTC-USD](https://portfolioslab.com/symbol/BTC-USD)
4. [DataHub Bitcoin](https://datahub.io/@cheredia19/bitcoin-coingecko)
5. [KuCoin Insight](https://www.kucoin.com/news/insight/BTC/6acf4e6af25df5000749e1c2)
6. [Lo & MacKinlay 1988](https://web.mit.edu/~alo/www/Papers/lo-mackinlay-88.html)
7. [Non-synchronous Trading (arXiv)](https://arxiv.org/pdf/1510.03926)
8. [CFA Digest: Speed of Convergence](https://rpc.cfainstitute.org/en/research/cfa-digest/2005/11/evidence-on-the-speed-of-convergence-to-market-efficiency-digest-summary); [Chung & Hrazdil 2012](https://ideas.repec.org/a/eee/empfin/v19y2012i5p702-720.html)
9. [Gu, Kelly, Xiu (NBER)](https://www.nber.org/system/files/working_papers/w25398/w25398.pdf)
10. [Gu, Kelly, Xiu (RFS)](https://academic.oup.com/rfs/article-pdf/33/5/2223/33209812/hhaa009.pdf)
11. [AQR: ML Asset Pricing](https://www.aqr.com/Insights/Research/Journal-Article/Empirical-Asset-Pricing-via-Machine-Learning)
12. [Kelly, Malamud, Zhou](https://www.sfi.ch/en/publications/the-virtue-of-complexity-in-return-prediction)
13. [Welch & Goyal](https://nber.org/papers/w10483)
14. [Goyal, Welch, Zafirov](https://sfi.ch/en/publications/a-comprehensive-2022-look-at-the-empirical-performance-of-equity-premium-prediction)
15. [Campbell & Thompson](https://nber.org/papers/w11468)
16. [Fischer & Krauss](https://iwf.rw.fau.de/files/2015/12/11-2017.pdf)
17. [LSTM-Replikation (Preprint)](https://arxiv.org/pdf/2608.05755); [Ghosh, Neufeld, Sahoo](https://arxiv.org/pdf/2004.10178)
18. [Jaquart et al. 2022](https://doaj.org/article/cfc09801314441198e3e1c92a3914e54)
19. [McLean & Pontiff (JF)](https://Www.Gwern.net/doc/economics/2016-mclean.pdf)
20. [McLean & Pontiff (Ivey)](https://ivey.uwo.ca/media/3775549/pontiff.pdf)
21. [Gao, Han, Li, Zhou](https://profiles.wustl.edu/en/publications/market-intraday-momentum/)
22. [CXO: First and Last Half-Hours](https://cxoadvisory.com/calendar-effects/first-and-last-half-hours-of-trading-linked)
23. [Rosa 2022](https://ideas.repec.org/a/wly/jfutmk/v42y2022i12p2218-2234.html)
24. [Shen, Urquhart, Wang](https://research.birmingham.ac.uk/en/publications/bitcoin-intraday-time-series-momentum/)
25. [Urquhart: Inefficiency of Bitcoin](https://eprints.soton.ac.uk/400597/1/Bitcoin_20efficiency_20R_26R.docx)
26. [TalTech Thesis](https://digikogu.taltech.ee/en/Download/c4be0010-0888-482e-babe-0e4d3185addc)
27. [Random Walk Krypto](https://kr.cup.edu.in/handle/32116/3063)
28. [Rossi 2013 (via Sekundärpapier)](https://www.redalyc.org/pdf/3058/305845303004.pdf)
29. [Out-of-Sample Test vs. Random Walk](https://ideas.repec.org/a/gam/jmathe/v10y2022i2p228-d722904.html)
30. [Meese & Rogoff](https://www.nber.org/chapters/c4077.pdf)
31. [Moskowitz, Ooi, Pedersen](https://papers.ssrn.com/abstract=2089463)
32. [AQR: A Century of Trend-Following](https://www.aqr.com/Insights/Research/Journal-Article/A-Century-of-Evidence-on-Trend-Following-Investing)
33. [CXO: Intrinsic Momentum](https://www.cxoadvisory.com/momentum-investing/trend-following-with-intrinsic-momentum-over-the-very-long-run)
34. [Zakamulin: Moving Averages](https://c.mql5.com/forextsd/forum/205/Revisiting%20the%20Profitability%20of%20Market%20Timing%20with%20Moving%20Averages__1.pdf)
35. [Tetlock 2007](https://www.columbia.edu/~pt2238/papers/Tetlock_Media_Sentiment_JF.pdf)
36. [Garcia: Sentiment during Recessions](https://leeds-faculty.colorado.edu/garcia/media_v33.pdf)
37. [Lopez-Lira & Tang v6](https://arxiv.org/pdf/2304.07619v6)
38. [Lopez-Lira & Tang, April 2024](https://www.anderson.ucla.edu/sites/default/files/document/2024-04/4.19.24%20Alejandro%20Lopez%20Lira%20ChatGPT_V3.pdf)
39. [Lopez-Lira, Wharton 2024](https://jacobslevycenter.wharton.upenn.edu/wp-content/uploads/2024/09/Lopez-Lira.pdf)
40. [Detecting Lookahead Bias (Preprint)](https://arxiv.org/html/2512.23847)
41. [Profit Mirage (Preprint)](https://arxiv.org/pdf/2510.07920)
42. [Glasserman & Lin](https://arxiv.org/abs/2309.17322)
43. [BTC XGBoost 70.000 Stunden (KI-Zusammenfassung)](https://www.emergentmind.com/papers/2606.00060); [Theseus Thesis](https://www.theseus.fi/handle/10024/900761); [Trade-by-trade (Preprint)](https://arxiv.org/pdf/2010.07404)
44. [CXO Guru Grades](https://www.cxoadvisory.com/gurus/)
45. [Mathinvestor: Gurus](https://mathinvestor.org/2014/03/a-sobering-analysis-of-financial-gurus-market-forecasts/)
46. [FinBench (Preprint)](https://arxiv.org/pdf/2607.16229)
47. [statsmodels Pesaran-Timmermann](https://www.statsmodels.org/stable/generated/statsmodels.stats.diagnostic.pesaran_timmermann.html)
48. [Real Statistics: PT-Test](https://real-statistics.com/time-series-analysis/forecasting-accuracy/pesaran-timmermann-test/)
49. [ESMA: CFD-Beschränkungen](https://www.esma.europa.eu/node/84933)
50. [Barber, Lee, Liu, Odean](https://faculty.haas.berkeley.edu/odean/papers/day%20traders/Day%20Trading%20Skill%20110523.pdf)
