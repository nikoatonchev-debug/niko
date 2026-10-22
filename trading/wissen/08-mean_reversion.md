# Mittelwert-Rückkehr und kurzfristige Umkehr

**Kurz gesagt:** Mittelwert-Rückkehr (Mean Reversion) bedeutet, dass ein Kurs nach einer starken Bewegung teilweise wieder zurückläuft. Bei Einzelaktien ist das über Wochen bis Monate historisch gut belegt. Nach Kosten bleibt für Privatanleger aber kaum etwas übrig, und seit 2000 ist der Effekt schwächer geworden. Für Nikos Horizonte (4-5 Stunden bei Krypto, ein Handelstag sonst) gibt es kein verlässliches Umkehrsignal. Die Trendfolge bleibt die Basis, und Umkehr-Ideen werden höchstens getrennt getestet.

## Was belegt ist

**Wichtig vorab:** Fast alle Belege betreffen Einzelaktien im *Querschnitt*. Gemeint ist ein Long-Short-Portfolio: Man kauft viele Verlierer und verkauft viele Gewinner leer. Daraus folgt nicht, ob *ein einzelner* Markt wie Nvidia morgen steigt (*Zeitreihe*). Außerdem geht es dort meist um Wochen oder Monate, nicht um Stunden.

- **Kurzfristige Umkehr bei Einzelaktien** [mittel]: Verlierer des Vormonats schlugen die Gewinner um ca. 2 % pro Monat (Jegadeesh 1990). Auf Wochenbasis lagen die Verlierer danach bei +0,86 bis +1,24 % pro Woche, die Gewinner bei -0,35 bis -0,55 % (Lehmann 1990) [1]. Diese Gewinne sind aber klein im Vergleich zu den Transaktionskosten [2]. Seit 2000 ist der Effekt schwächer (Cheng/Hameed/Subrahmanyam/Titman) [3]. Er steckt vor allem in kleinen, illiquiden Aktien mit hohem *Spread* (Differenz zwischen Kauf- und Verkaufskurs). Für Privatanleger mit Einzelorders liegt der Gewinn nach Kosten realistisch bei etwa null.
- **Verfeinerte Varianten** [mittel, nur historisch und institutionell]: Residuale Umkehr ist robuster. Damit ist Umkehr nach Herausrechnen von Markt- und Faktoreinflüssen gemeint (Blitz u. a. 2013) [4]. Da/Liu/Schaumburg finden das 3- bis 4-Fache des Standardeffekts. Dafür brauchen sie aber kommerzielle Analystendaten [5]. Selbst bei institutionellen Kosten geht etwa die Hälfte des Brutto-Alphas für Kosten verloren (1,57 % gegenüber 0,80 % pro Monat). Für die Zeit nach 2013 fehlen unabhängige Belege, und ein Teil der Autoren steht Robeco nahe, einem Anbieter solcher Strategien.
- **Warum es Umkehr gibt** [stark, für den Mechanismus]: Wer kauft, wenn andere verkaufen *müssen*, stellt Liquidität bereit und wird dafür bezahlt. Diese Prämie schwankt stark. Am größten ist sie in Krisen mit hohem VIX (Angstindex), also genau dann, wenn auch das Risiko am größten ist (Nagel 2012) [6]. Privatanleger kaufen typischerweise nach Kursverlusten (Kaniel/Saar/Titman 2008) [7]. Hohe Volatilität bringt eine schnellere Umkehr, niedriger Umsatz eine langsamere [8]. Liquidität erklärt aber nicht alles. Bei der Short-Seite spielen Sentiment und Leerverkaufsgrenzen mit [5].
- **Pairs Trading** [stark für 1962-2002, danach abgeschwächt]: Man handelt Aktienpaare mit ähnlichem Kursverlauf gegeneinander. Das brachte bis zu 11 % pro Jahr, vor realistischen Leihgebühren [9]. Die Überrendite der Top-20-Paare sank von 0,86 % (1962-88) über 0,37 % (1989-2002) auf 0,24 % pro Monat (2003-09) [10]. Nach Kosten blieben 38 Bp (Distanzmethode) bzw. 5 Bp (Copula-Methode) pro Monat, und das bei Leihkosten von null [11]. Die Handelsgelegenheiten sind ab 2009 deutlich zurückgegangen.
- **Aktienindizes auf Tagesbasis** [mittel]: Seit den 2000ern sind die Tagesrenditen von 20 Indizes weltweit leicht *negativ* autokorreliert. Auf einen Plustag folgt also etwas häufiger ein Minustag. Die Autoren erklären das mit der Verbreitung von ETFs und Futures [12]. Belegt ist nur ein schwacher Effekt, keine handelbare Prognose. Für die Zeit nach 2019 ist er ungeprüft.
- **Gegenbeleg innerhalb eines Tages** [mittel]: Beim breiten Markt sagt die erste halbe Stunde die letzte voraus, es gibt also *Momentum* statt Umkehr (SPY, 1993-2013) [13]. Laut Prüfer bestätigt eine Studie mit über 60 Futures das (Baltussen/Da/Lammers/Martens 2021, hier nicht eingesehen) und erklärt es mit Absicherungsgeschäften von Optionshändlern.
- **Futures auf 1-12 Monate** [stark für Monatsbasis]: Bei 58 Futures (Indizes, Gold, Öl, Währungen) setzte sich der Trend der letzten 12 Monate fort [19]. Laut Prüfer gibt es Gegenstudien (Huang u. a. 2020, Kim/Tse/Wald 2016, hier nicht eingesehen), und 2012-2019 war eine schwache Trendfolge-Phase. Für Tages- oder 4-Stunden-Prognosen folgt daraus nichts.
- **Devisen** [mittel]: Einfache technische Regeln brachten bei Dollar-Kursen bis Anfang der 1990er Gewinne, danach nicht mehr [20]. Für EUR/USD ist ein Tages-Edge nicht belegt.
- **Krypto** [schwach]: Umkehr gibt es vor allem bei illiquiden Altcoins [22] und auf 15-Minuten-Horizonten. Im Holdout lag die mittlere AUC bei 0,522 gegenüber 0,501 bei Aktien (0,5 = Zufall), konservativ gerechnet beträgt der Vorsprung nur +0,011 [21]. Bei 4 Stunden findet sich kein Signal (AUC 0,496, *unsicher*, nicht geprüft). Große Coins zeigen auf Tagesbasis eher Momentum.
- **Veröffentlichte Effekte schrumpfen** [stark]: Bei 97 Prädiktoren lagen die Renditen nach der Veröffentlichung 58 % niedriger [23]. Laut Prüfer verschwinden Liquiditätseffekte wie Reversal oft ganz, wenn man Microcaps ausschließt (Hou/Xue/Zhang 2020, hier nicht eingesehen).

## Mythen und Vorsicht

- **"Buy the Dip schlägt Buy & Hold"** – widerlegt als Strategie, bei der man mit Cash auf Rückgänge wartet. Untersucht wurden 196 Varianten von 1965 bis 2025. Im Mittel lag die Sharpe Ratio 0,04 unter Buy & Hold, über 60 % der Varianten schnitten schlechter ab, ab 1989 beträgt die Lücke 0,27 [14]. Auch über 1871-2025 gibt es keinen Vorteil [15]. Treffender als "deutlich schlechter" ist "kein Vorteil". AQR ist selbst Trendfolge-Anbieter.
- **"Hohe Trefferquote = profitabel" (RSI(2) nach Connors)** – widerlegt. Ein Praktiker-Backtest auf den S&P 500 kommt auf 71 % Treffer, aber nur 1,7 % CAGR gegenüber 13,5 % bei Buy & Hold [24] *(unsicher: Methodik nicht geprüft, niedrige Zeit im Markt verzerrt den Vergleich)*. Eine peer-reviewte Out-of-Sample-Bestätigung gibt es nicht.
- **"Der Markt kehrt über Jahre verlässlich zum Mittelwert zurück"** – statistisch nicht gesichert. Ein Random Walk ließ sich nicht ablehnen [17], und der Effekt hängt vor allem an den Jahren 1926-46 [18].
- **Langfristige Umkehr (Verlierer der letzten 3-5 Jahre)**: Es gab sie, aber vor allem bei Small Caps, im Januar und überlappend mit Value. Teilweise ist sie ein Rechenartefakt aus Bid-Ask-Effekten [16].
- **Bid-Ask-Bounce**: Ein Teil der gemessenen Kurzfrist-Umkehr entsteht nur dadurch, dass Schlusskurse mal auf dem Geld-, mal auf dem Briefkurs liegen. Diesen Teil kann man nicht handeln [16].
- **Interessenkonflikte**: Robeco und AQR verkaufen Strategien, Backtrex und Quantified Strategies sind Backtests ohne prüfbare Methodik.

## Was das für Niko heißt

1. **Trend bleibt Basis.** Ein Umkehrsignal überstimmt nie die 200-Tage-Linie. Trendfolge und Umkehr *ohne feste Regel* zu mischen ist Data Mining in Echtzeit.
2. **BTC/ETH (4-5 h):** Die letzte Bewegung zählt als Münzwurf. Nicht dagegen wetten, nur weil sie groß war.
3. **DAX, S&P 500, Nasdaq 100:** Nach ungewöhnlich großen Tagesbewegungen im Papiertest nur ein Feld "Umkehr-Tilt ja/nein" notieren und es getrennt auswerten. Es fließt nicht in die Prognose ein.
4. **News-Tage getrennt markieren:** Nach echten News (Earnings, Makrodaten) ist eher Fortsetzung zu erwarten, Umkehr eher nach Bewegungen ohne News *(unsicher, für Indizes nicht direkt belegt)*. Starke Morgenbewegungen kehren sich nicht automatisch bis zum Schluss um [13].
5. **Kein "überverkauft" als Einzelsignal.** Wer RSI(2) testet, legt Regeln vorher fest (nur long über der 200-Tage-Linie), rechnet Kosten ein und misst Erwartungswert pro Trade und Drawdown, nicht die Trefferquote.
6. **Kein Pairs Trading und kein Einzelaktien-Reversal** (Nvidia, Apple, Tesla, SAP). Der Netto-Edge der Profis ist kleiner als die Kosten von CFD-Finanzierung, Spread, Ordergebühren und Abgeltungsteuer.
7. **Publizierte Effekte mindestens halbieren**, Reversal-Effekte eher noch stärker kürzen.
8. **Kein Cash für Dips horten.** Ein Sparplan oder investiert zu bleiben ist mindestens gleich gut.
9. **Papiertest richtig lesen:** Eine Woche ergibt etwa 60-85 Prognosen. Der Standardfehler der Trefferquote liegt dann bei 5-6,5 Prozentpunkten, das 95-%-Intervall bei rund ±11-13 Punkten. 55 % lassen sich so nicht von 50 % unterscheiden, und ein Vergleich von Trend und Umkehr ist erst nach Monaten möglich.

## Offene Fragen

- Wie groß ist die negative Tages-Autokorrelation bei DAX, S&P 500 und Nasdaq 100 in den Jahren 2019-2026? Dafür wäre ein eigener rollierender Test nötig.
- Wie haben sich Reversal und Pairs Trading nach 2014 *netto* entwickelt, und wie viel bleibt ohne Microcaps (Hou/Xue/Zhang)?
- Lässt sich der Krypto-Preprint unabhängig replizieren?
- Gibt es aktuelle Belege für tägliche Umkehr bei Gold, Brent und EUR/USD?
- Wie stark trägt Intraday-Momentum aus Optionsabsicherung bei Indizes, Gold, Öl und FX (Baltussen u. a. 2021)?
- Wie wirken sich die Gegenstudien zu Time-Series Momentum auf Nikos Trendbasis aus?
- Steuerdetails für deutsche Privatanleger bei Termingeschäften und CFDs (Verlustverrechnung) sollten aktuell geprüft werden.

## Quellen

1. [Alpha Architect: Short-Term Return Reversal](https://alphaarchitect.com/quantitative-momentum-research-short-term-return-reversal/)
2. [Avramov/Chordia/Goyal (2006), JF](https://ideas.repec.org/a/bla/jfinan/v61y2006i5p2365-2394.html)
3. [Cheng/Hameed/Subrahmanyam/Titman: Short-Term Reversals and the Efficiency of Liquidity Provision](https://www.abfer.org/media/abfer-events-2014/annual-conference/investment-finance/short-term-reversals-and-the-efficiency-of-liquidity-provision.pdf)
4. [Blitz u. a. (2013): Short-term residual reversal](https://repub.eur.nl/pub/40707)
5. [Da/Liu/Schaumburg, Management Science 2014](https://ideas.repec.org/a/inm/ormnsc/v60y2014i3p658-674.html)
6. [Nagel: Evaporating Liquidity (NBER)](https://nber.org/papers/w17653)
7. [Kaniel/Saar/Titman (2008), JF](https://ideas.repec.org/a/bla/jfinan/v63y2008i1p273-310.html)
8. [Dai/Medhat/Novy-Marx/Rizova (FAJ 2024)](https://rpc.cfainstitute.org/research/financial-analysts-journal/2024/reversals-and-the-returns-to-liquidity-provision)
9. [CXO Advisory: Classic Paper on Matched Pairs Trading](https://www.cxoadvisory.com/technical-trading/classic-paper-matched-pairs-trading/)
10. [Do & Faff (2010): Does Simple Pairs Trading Still Work?](https://ideas.repec.org/a/taf/ufajxx/v66y2010i4p83-95.html)
11. [Rad/Low/Faff (2016)](https://research.bond.edu.au/en/publications/the-profitability-of-pairs-trading-strategies-distance-cointegrat/)
12. [Baltussen/van Bekkum/Da: Indexing and serial dependence](https://www3.nd.edu/~zda/Indexing.pdf)
13. [Gao/Han/Li/Zhou: Market intraday momentum](https://profiles.wustl.edu/en/publications/market-intraday-momentum/)
14. [AQR: Hold the Dip](https://www.aqr.com/Insights/Research/Alternative-Thinking/Hold-the-Dip)
15. [CXO Advisory: To Buy or Not to Buy the Dip (Estrada)](https://www.cxoadvisory.com/technical-trading/to-buy-or-not-to-buy-the-dip/)
16. [Conrad & Kaul (1993), JF](https://ideas.repec.org/a/bla/jfinan/v48y1993i1p39-63.html)
17. [Poterba & Summers: Mean Reversion in Stock Prices (NBER)](https://nber.org/papers/w2343)
18. [Kim/Nelson/Startz: A Reappraisal (NBER)](https://www.nber.org/papers/w2795)
19. [Moskowitz/Ooi/Pedersen: Time Series Momentum](https://papers.ssrn.com/abstract=2089463)
20. [Neely/Weller/Ulrich: Adaptive Markets Hypothesis, FX](https://files.stlouisfed.org/files/htdocs/wp/2006/2006-046.pdf)
21. [Kitron & Wengrowicz (2026), RePEc](https://ideas.repec.org/p/arx/papers/2608.21888.html)
22. [Up or down? Reversal, momentum and liquidity in crypto](https://www.researchgate.net/publication/354881251_Up_or_down_Short-term_reversal_momentum_and_liquidity_effects_in_cryptocurrency_markets)
23. [McLean & Pontiff (2016)](https://Www.Gwern.net/doc/economics/2016-mclean.pdf)
24. [Backtrex: RSI(2) on the S&P 500](https://backtrex.com/en/backtests/connors-rsi-2-sp-500)
