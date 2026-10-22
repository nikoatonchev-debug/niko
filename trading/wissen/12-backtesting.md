# Backtesting und Statistik richtig

**Kurz gesagt:** Ein Backtest ist eine nachträgliche Simulation einer Regel auf alten Kursen. Er sieht fast immer besser aus als die spätere Wirklichkeit, weil man unbewusst so lange probiert, bis etwas passt (Overfitting = Anpassung an Zufall). Wer viele Varianten testet, findet allein durch Glück eine "Super-Strategie". Eine Woche Papier-Trading mit 12 Märkten kann statistisch nichts beweisen, für 55 % statt 50 % Trefferquote braucht man über 600 unabhängige Prognosen. Der saubere Weg ist, die Regeln vorher einzufrieren, lange vorwärts zu testen und gegen naive Vergleichsregeln zu messen.

**Begriffe:** *t-Wert* misst, wie klar ein Ergebnis vom Zufall abweicht (t > 2 entspricht etwa p < 5 %). *Sharpe-Ratio* ist die Überrendite pro Einheit Schwankung. *In-sample* sind die Daten, auf denen man die Regel gebaut hat, *out-of-sample* sind unberührte Daten.

## Was belegt ist

1. **[stark] Die Hürde t > 2 reicht nicht.** Harvey/Liu/Zhu werten 316 publizierte Faktoren aus und empfehlen für neue Faktoren t > 3,0. Ihr Fazit: Die meisten behaupteten Befunde sind wahrscheinlich falsch [1][2]. Chordia/Goyal/Saretto leiten aus rund 2 Mio. Zufallsstrategien Hürden von etwa 3,1 bis 3,8 ab (genaue Werte und Fehlerquote unsicher) [3]. Faustformel: t ≈ Sharpe (p.a.) × √Jahre, gültig nur bei unabhängigen, etwa normalverteilten Renditen. Für t = 3 braucht man über 10 Jahre einen Sharpe von 0,95, für 5 Jahre 1,34. Wer selbst viel probiert, braucht eine noch höhere Hürde.
2. **[mittel] Wie schlimm die "Replikationskrise" ist, hängt von der Methode ab.** Hou/Xue/Zhang: Von 452 Anomalien scheitern 65 % an t ≥ 1,96 und 82 % an 2,78 [4]. Jensen/Kelly/Pedersen finden dagegen mit einem bayesianischen Modell in 93 Ländern, dass die Mehrheit repliziert [5]. Chen/Zimmermann schätzen nur rund 12 % Abschlag durch Publikationsbias [6]. Lehre: Ein robuster Effekt muss viele vernünftige Testvarianten überstehen.
3. **[stark] Viele Versuche erzeugen Schein-Erfolge.** Bei 5 Jahren Daten liefern schon etwa 45 unabhängige Varianten im Erwartungswert einen Sharpe von 1,0, obwohl keine Variante echt etwas kann. Bei 1 Jahr und 10 Varianten sind es 1,57 [8]. Der *Deflated Sharpe Ratio* korrigiert dafür: Er berücksichtigt die Zahl der Versuche, die Streuung ihrer Sharpe-Werte, Schiefe/Fat Tails und die Datenlänge [7]. Um einen echten Sharpe von 0,5 mit 95 % Sicherheit von null zu unterscheiden, braucht man rund 11 Jahre Daten [9].
4. **[mittel] PBO** (Probability of Backtest Overfitting) schätzt, wie oft die in-sample beste Variante out-of-sample unter dem Median aller Varianten landet. Über 0,5 ist die Auswahl schlechter als Zufall [10]. Sinnvoll erst bei vielen Parameter-Varianten.
5. **[mittel] Walk-Forward ist nötig, aber kein Freibrief.** Er testet nur einen historischen Pfad. Wer nach schlechtem Out-of-sample-Ergebnis nachjustiert, overfittet erneut [11]. Protokoll nach Arnott/Harvey/Markowitz: Begründung vorab festlegen, alle Versuche zählen, Out-of-sample-Daten nur einmal nutzen [12].
6. **[stark] Backtest-Sharpe sagt Live-Ergebnisse kaum voraus.** Bei 888 Quantopian-Algorithmen erklärt er den Live-Sharpe mit R² < 0,025. Volatilität und Drawdown sind aussagekräftiger, und je mehr ein Autor backtestet, desto größer die Lücke [13]. Bei 215 Bank-Strategien fiel der Sharpe vom Backtest zum Live-Betrieb im Median um rund 73 % [14].
7. **[stark] Effekte schrumpfen nach der Veröffentlichung.** Bei 97 Prädiktoren sind die Renditen nach der Publikation 58 % niedriger [15]. Die 200-Tage-Linie ist seit Jahrzehnten öffentlich.
8. **[stark] Survivorship Bias** (nur Überlebende im Datensatz) überzeichnet Renditen. Bei Fonds beträgt er bis zu etwa 1 % p.a. bei langen Stichproben [20][21]. Performancebedingte Delistings verloren im Schnitt etwa −30 % (unsicher) [22]. Nvidia, Apple, Tesla und SAP sind heutige Gewinner.
9. **[stark/mittel] Look-Ahead Bias** heißt, Daten zu nutzen, die damals noch nicht bekannt waren, etwa revidierte Bilanzdaten oder den Schlusskurs als Ausführungskurs [23]. Bei Sprachmodellen kommt das Risiko hinzu, dass das Modell die Zukunft aus den Trainingsdaten kennt. Glasserman/Lin zeigen allerdings, dass anonymisierte Schlagzeilen teils sogar besser abschneiden. Das Risiko ist plausibel, aber als Größe nicht gut gemessen [24].
10. **[stark] Kosten entscheiden.** Anomalien mit über etwa 50 % Monatsumschlag überleben Kosten kaum [25]. Break-even-Trefferquote = 0,5 + Kosten/(2 × typische Bewegung), bei 1 % Bewegung und 0,2 % Kosten also 60 %.
11. **[stark] Basisrate von Privatanlegern.** Das aktivste Fünftel von 66.465 US-Haushalten erzielte 11,4 % p.a. gegenüber 17,9 % für den Markt [26]. 97 % der brasilianischen Dauer-Daytrader verloren Geld [27]. In Taiwan war weniger als 1 % verlässlich profitabel [28]. Laut ESMA (2018) verlieren 74–89 % der CFD-Konten [29].
12. **[stark] Trefferquoten brauchen große Stichproben.** Für 55 % gegen 50 % braucht man etwa 620 (einseitig) bis 780 (zweiseitig) unabhängige Prognosen [30]. Bei 60 Prognosen ist p ≤ 0,05 erst ab 37 Treffern (61,7 %) erreicht, die Unsicherheit beträgt ±12,7 Punkte. Ein Münzwurf erreicht mit 26 % Wahrscheinlichkeit 55 % oder mehr. Testet man 12 Märkte einzeln, liegt die Chance auf mindestens einen Zufallstreffer bei 46 % [33].
13. **[stark] Renditeprognose ist extrem schwer.** Die meisten bekannten Prädiktoren schlagen out-of-sample nicht einmal den historischen Mittelwert [36]. Selbst gute Modelle erreichen auf Monatssicht ein Out-of-sample-R² unter 1 % [37].

## Mythen und Vorsicht

- **"Die 200-Tage-Linie schlägt Buy & Hold bei der Rendite."** Widerlegt für große Aktienindizes nach Kosten: Die beste von rund 7.800 Regeln zeigte out-of-sample keine Überlegenheit [16][17]. Offen bleibt ein mögliches besseres Risikoprofil. Trendfolge ist nur für Monatshorizonte und diversifizierte Futures belegt, und selbst das ist umstritten [18][19].
- **"Hohe Trefferquote = gute Strategie."** Widerlegt. Erwartungswert = p × Ø-Gewinn − (1−p) × Ø-Verlust − Kosten. 70 % Treffer mit seltenen großen Verlusten können Geld verlieren. Bei Autokorrelation können naiv annualisierte Sharpe-Werte um bis zu etwa 65 % überzeichnet sein [34].
- **"Backtest-Sharpe einfach halbieren."** Schwach. Der nötige Abschlag ist nichtlinear: Grenzwertige Ergebnisse brauchen oft weit über 50 %, bis zu 100 % [35].
- **"Walk-Forward eliminiert Overfitting."** Falsch, siehe Punkt 5.
- **Hinweis:** Die meisten Zahlen hier wurden nur aus dem Gedächtnis gegen Abstracts geprüft, nicht live.

## Was das für Niko heißt

1. **Regeln vorher einfrieren:** Signal, Horizont, Messzeitpunkt, Referenzkurs und Bewertung schriftlich festlegen. Jede Prognose mit Zeitstempel und Kurs protokollieren und während des Tests nichts anpassen. Jede Änderung startet einen neuen Test.
2. **Die Woche ist ein Prozesstest, kein Nachweis.** Zwischen etwa 38 % und 62 % ist alles mit Zufall vereinbar. Korrelierte Märkte (BTC/ETH; S&P 500, Nasdaq, Nvidia, Apple; DAX/SAP) zählen fast als dieselbe Wette, und eine einzige Makro-Nachricht kann die ganze Woche färben. Über Monate weiterführen.
3. **Gegen naive Benchmarks messen, nicht gegen 50 %:** "immer steigt", "wie gestern" und das reine 200-Tage-Signal ohne News. Aktienindizes steigen an etwa 52–54 % der Tage, eine Regel, die meist "hoch" sagt, erreicht das ohne Können. Passende Tests sind Pesaran-Timmermann [31] und für Methodenvergleiche Diebold-Mariano [32].
4. **Nicht im Nachhinein den besten Markt herauspicken.** Gepoolt auswerten oder Holm/Benjamini-Hochberg-Korrektur nutzen [33].
5. **Payoff und Kosten mitmessen:** Bewegungsgröße, Spread, Slippage und die Break-even-Trefferquote. In Deutschland fallen auf Gewinne 25 % Abgeltungsteuer plus Soli an (ggf. Kirchensteuer), bei Krypto gilt die Jahresfrist (§ 23 EStG). Besser noch: Wahrscheinlichkeiten angeben und mit dem Brier-Score bewerten.
6. **Fristen beachten:** Für 4–5-Stunden- oder Tagesprognosen ist die 200-Tage-Linie nicht belegt. Sie lässt sich nur als bewusste Hypothese testen.
7. **News-Komponente getrennt protokollieren.** Sie ist nicht reproduzierbar und anfällig für Rückschaufehler. Eine KI-Prognose nie rückwirkend auf alte Tage "backtesten", es zählen nur echte Vorwärtstests.
8. **Nicht ständig nachschauen und bei gutem Stand aufhören** (Optional Stopping). Die Stichprobengröße vorher festlegen.
9. **Realistische Erwartung:** Der Normalfall ist, Buy & Hold eines breiten ETFs nicht zu schlagen. Dieses Kapitel ist keine Anlageberatung.

## Offene Fragen

- Alle Quellen wurden ohne Websuche geprüft. Unsicher sind vor allem die Zahlen von Chordia/Goyal/Saretto, Shumway (−30 %), Suhonen (73 %), Lo (65 %) und die Lesart von Glasserman/Lin.
- Wie stark verkleinern die Korrelationen die effektive Stichprobe der 12 Märkte?
- Wie hoch ist die Aufwärts-Basisrate je Markt und Horizont, auch für Krypto über 4–5 Stunden?
- Welche realen Kosten haben deutsche Neo-Broker und Krypto-Apps für diese Märkte?
- Bringt die News-Komponente einen Mehrwert gegenüber dem reinen 200-Tage-Signal?
- Laut Prüfer stammt bei Zeitreihen-Momentum ein Großteil der Rendite aus der Volatilitätsskalierung (Kim/Tse/Wald 2016), und auch das Update von Goyal/Welch/Zafirov (2024) bestätigt die schwache Prognosekraft. Beides ist hier nicht mit Link belegt.
- Wie liefen Trendstrategien nach 2016 bis Oktober 2026, und wie bewähren sich PBO und Purged CV unabhängig gemessen?
- Eine Woche, ein Regime: Auch echte Effekte können in einer bestimmten Phase ausfallen.

## Quellen

1. Harvey, Liu, Zhu (2016), RFS: https://doi.org/10.1093/rfs/hhv059 (NBER: https://www.nber.org/papers/w20592)
2. Harvey (2017), Presidential Address, JF: https://doi.org/10.1111/jofi.12530
3. Chordia, Goyal, Saretto (2020), RFS: https://doi.org/10.1093/rfs/hhaa018
4. Hou, Xue, Zhang (2020), Replicating Anomalies: https://doi.org/10.1093/rfs/hhy131 (NBER: https://www.nber.org/papers/w23394)
5. Jensen, Kelly, Pedersen (2023), JF: https://doi.org/10.1111/jofi.13249 (NBER: https://www.nber.org/papers/w28432)
6. Chen, Zimmermann (2020), RAPS: https://doi.org/10.1093/rapstu/raz011
7. Bailey, López de Prado (2014), Deflated Sharpe Ratio: https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2460551
8. Bailey, Borwein, López de Prado, Zhu (2014), Pseudo-Mathematics: https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2308659
9. Bailey, López de Prado (2012), Sharpe Ratio Efficient Frontier: https://papers.ssrn.com/sol3/papers.cfm?abstract_id=1821643
10. Bailey et al. (2017), Probability of Backtest Overfitting: https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2326253
11. López de Prado (2018), 10 Reasons ML Funds Fail: https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3104816 sowie Advances in Financial ML: https://www.wiley.com/en-us/Advances+in+Financial+Machine+Learning-p-9781119482086
12. Arnott, Harvey, Markowitz (2019), Backtesting Protocol: https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3275654
13. Wiecki et al. (2016), All That Glitters: https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2745220
14. Suhonen, Lennkh, Perez (2017), JPM: https://doi.org/10.3905/jpm.2017.43.2.090
15. McLean, Pontiff (2016), JF: https://doi.org/10.1111/jofi.12365 (SSRN: https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2156623)
16. Sullivan, Timmermann, White (1999), JF: https://doi.org/10.1111/0022-1082.00163 sowie White (2000): https://doi.org/10.1111/1468-0262.00152
17. Bajgrowicz, Scaillet (2012), JFE: https://doi.org/10.1016/j.jfineco.2012.06.001
18. Moskowitz, Ooi, Pedersen (2012), JFE: https://doi.org/10.1016/j.jfineco.2011.11.003 sowie Hurst, Ooi, Pedersen (2017, AQR): https://www.aqr.com/Insights/Research/Journal-Article/A-Century-of-Evidence-on-Trend-Following-Investing
19. Huang, Li, Wang, Zhou (2020), JFE: https://doi.org/10.1016/j.jfineco.2019.08.004
20. Brown, Goetzmann, Ibbotson, Ross (1992), RFS: https://doi.org/10.1093/rfs/5.4.553
21. Carhart et al. (2002), RFS: https://doi.org/10.1093/rfs/15.5.1439
22. Shumway (1997), JF: https://doi.org/10.1111/j.1540-6261.1997.tb03818.x
23. Kothari, Shanken, Sloan (1995), JF: https://doi.org/10.1111/j.1540-6261.1995.tb05171.x
24. Glasserman, Lin (2023), arXiv: https://arxiv.org/abs/2309.17322
25. Novy-Marx, Velikov (2016), RFS: https://doi.org/10.1093/rfs/hhv063 sowie Frazzini, Israel, Moskowitz (2018): https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3229719
26. Barber, Odean (2000), JF: https://doi.org/10.1111/0022-1082.00226
27. Chague, De-Losso, Giovannetti (2019): https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3423101
28. Barber, Lee, Liu, Odean (2014), JFM: https://doi.org/10.1016/j.finmar.2013.05.006
29. ESMA (2018): https://www.esma.europa.eu/press-news/esma-news/esma-agrees-prohibit-binary-options-and-restrict-cfds-protect-retail-investors
30. SciPy binomtest: https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.binomtest.html
31. Pesaran, Timmermann (1992), JBES: https://doi.org/10.1080/07350015.1992.10509922
32. Diebold, Mariano (1995), JBES: https://doi.org/10.1080/07350015.1995.10524599
33. Benjamini, Hochberg (1995), JRSS B: https://doi.org/10.1111/j.2517-6161.1995.tb02031.x
34. Lo (2002), FAJ: https://doi.org/10.2469/faj.v58.n4.2453
35. Harvey, Liu (2015), Backtesting: https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2345489 sowie (2014) Evaluating Trading Strategies: https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2474755
36. Welch, Goyal (2008), RFS: https://doi.org/10.1093/rfs/hhm014
37. Campbell, Thompson (2008), RFS: https://doi.org/10.1093/rfs/hhm055
