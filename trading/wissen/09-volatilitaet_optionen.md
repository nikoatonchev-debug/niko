# Volatilität und Optionen

**Kurz gesagt:** Volatilität (Vola) misst, wie stark ein Kurs schwankt. Sie lässt sich deutlich besser vorhersagen als die Kursrichtung. Optionen sind Versicherungsverträge auf Kursbewegungen. Wer sie verkauft, wurde historisch im Mittel bezahlt, trägt aber seltene, sehr große Verluste. Seit etwa 2010-2012 ist dieser Vorteil laut neuester Forschung kaum noch messbar. Privatanleger, die Optionen oder Hebelprodukte kaufen, verlieren im Durchschnitt Geld, vor allem wegen der Kosten. Für Niko taugt Volatilität deshalb zur Steuerung der Positionsgröße und des Risikos, nicht als Signal für die Richtung.

## Was belegt ist

**Begriffe:** *Implizite Vola* ist die Schwankung, die in Optionspreisen „eingepreist“ ist (z.B. der VIX für den S&P 500). *Realisierte Vola* ist die Schwankung, die danach tatsächlich eintritt. Die Differenz heißt *Varianz-Risikoprämie (VRP)*.

- **[stark] Die VRP gab es historisch.** Implizite Varianz lag im Mittel über der realisierten. Optionskäufer zahlten also drauf, Verkäufer wurden fürs Crashrisiko bezahlt (Carr/Wu 2009, 1996-2003; Dew-Becker et al. 2017). Bezahlt wurde vor allem kurzfristiges, unerwartetes Schwankungsrisiko. Laut einer Cboe-finanzierten Studie: 19,3 % implizite gegen 15,1 % realisierte Vola (1990-2018, ungeprüft). Wichtig: Das ist eine Versicherungsprämie und kein risikofreier Gewinn. In Crashs (1987, 2008, 2018, 2020) ging sie für die Verkäufer teilweise oder ganz verloren. [1][2][3]
- **[mittel] Seit etwa 2010-2012 ist das Alpha weitgehend verschwunden.** *Alpha* ist die Rendite, die über die Bezahlung für Marktrisiko hinausgeht. Bei gehandelten S&P-500-Optionen ist es seit rund 15 Jahren nicht mehr von null unterscheidbar (Dew-Becker/Giglio, Chicago Fed WP 2025-17, noch ein Working Paper). Einschränkungen: Bei 15 Jahren schiefer Daten heißt das nicht „nachweislich null“. Außerdem kann die rohe Differenz zwischen impliziter und realisierter Vola weiter bestehen, dann aber als Bezahlung für Markt- und Crashrisiko. [4][5]
- **[mittel] Put-Write-Indizes** (laufender Verkauf abgesicherter Puts, Cboe PUT) schafften 1986-2015 brutto 10,1 % p.a. bei 10,1 % Vola, der S&P 500 9,8 % bei 15,3 % Vola (Sharpe 0,67 gegen 0,47). Die Studie ist Cboe-gesponsert. Der Vorteil entstand vor allem bis 2009. Von 2010 bis 2024 lag PUT nur in 3 von 15 Jahren vorn (2011, 2015, 2022). Alles brutto, ohne Kosten und Steuern. [6][7][8]
- **[stark] Covered Calls sind kein „Einkommen“.** Sie bestehen überwiegend aus Aktienrisiko. Dazu kommen eine kleine Short-Vol-Komponente und eine unbezahlte Wette auf eine Gegenbewegung. Die Prämie bezahlt abgegebenes Aufwärtspotenzial und übernommenes Crashrisiko (Israelov/Nielsen 2015, AQR). [9][10]
- **[stark] Long-VIX-Produkte verlieren langfristig.** 1-Monats-VIX-Futures mit konstanter Laufzeit verloren 2006-2013 rund 30 % pro Jahr (Eraker/Wu 2017). Grund ist der *Contango*: Spätere Futures sind meist teurer, deshalb kostet das laufende „Rollen“ in den nächsten Kontrakt Geld. In Crashs steigen diese Produkte kurzfristig stark. [11]
- **[stark] Short-Vol kann an einem Tag fast alles verlieren.** Am 05.02.2018 fiel der S&P 500 um 4 %, der VIX stieg um etwa 20 Punkte. Short-Vol-ETPs verloren über 90 %, XIV etwa 96 %, und Credit Suisse kündigte das Produkt. Am 05.08.2024 fiel der TOPIX um 12 %. Die VIX-Spitze von etwa 65 vor Börsenbeginn war teils ein Messartefakt wegen breiter Spannen, der Schlusskurs lag bei etwa 38. [12][13][14][15]
- **[mittel] Volatility Targeting** heißt, die Position so zu skalieren, dass ihre Schwankung einen Zielwert hat. Das verbessert die Sharpe Ratio nur bei Aktien und Credit. Extreme Renditen werden aber über alle Anlageklassen hinweg seltener (Harvey et al. 2018, über 60 Anlagen ab 1926). Die maximalen Drawdowns sanken laut Studie vor allem bei gemischten Portfolios. Die Studie kommt von der Man Group, die solche Strategien verkauft. Gegen Ein-Tages-Crashs hilft die Methode nicht. [16]
- **[stark] Vola-Steuerung bringt kein verlässliches Zusatz-Alpha.** Mit Regeln, die man in Echtzeit wirklich umsetzen kann, und nach Kosten schlagen vola-gesteuerte Faktorportfolios die ungesteuerten meist nicht (Cederburg et al. 2020, 103 Strategien; Barroso/Detzel 2021). Am ehesten bleibt ein Effekt beim Gesamtmarkt. Die starken Ursprungsergebnisse (Moreira/Muir 2017) waren in-sample. [17][18][19]
- **[stark] Put-Kauf als Dauerabsicherung ist teuer.** Bei gleicher Durchschnittsrendite liefert eine niedrigere Aktienquote kleinere Drawdowns und eine höhere Sharpe Ratio als Protective Puts (Israelov 2019). Ausnahme ist ein großer Crash kurz vor dem Verfall. Wer Versicherung oder Lotterielose kauft, wird langfristig nicht belohnt (Ilmanen 2012). [20][21]
- **[schwach] Trendfolge als Crashschutz** war langfristig und brutto günstiger als Puts, das gilt aber nicht in jedem Jahrzehnt (AQR, Interessenkonflikt). Bei schnellen Crashs reagiert sie zu spät. [22]
- **[stark] Privatanleger verlieren mit Optionen im Schnitt.** Sie bevorzugen billige Wochenoptionen mit durchschnittlich 12,6 % Geld-Brief-Spanne (Bryzgalova et al. 2023). Optionskäufe vor Quartalszahlen verloren im Schnitt 5-9 % (de Silva et al.). Eine Gegenstudie (Bogousslavsky/Muravyev) findet kleinere Verluste, die Höhe ist also umstritten. [23][24][25]
- **[mittel] 0DTE-Optionen** (Verfall am selben Tag) machten bei Privatanlegern seit Mai 2022 im Aggregat etwa 358.000 USD Verlust pro Tag. Über 60 % davon entfielen auf Kosten. Eine durchschnittliche Long-Position verlor 53 % (Beckmeyer et al., Working Paper). [26][27]
- **[mittel] Korea:** Rund 66 % der aktiven Privatanleger in KOSPI-200-Optionen halten einfache, einseitige Positionen und verlieren (Hu et al. 2024). [28]
- **[stark] Deutschland:** Bei Turbo-Zertifikaten (Knock-outs) machten 2019-2023 rund 74,2 % der Kleinanleger Verlust, im Schnitt 6.358 EUR, zusammen über 3,4 Mrd. EUR (BaFin, etwa 543.000 Anleger). Seit dem 16.06.2026 gelten deshalb Verlustwarnung, Kenntnistest und ein Verbot von Boni. Die Turbos selbst sind nicht verboten. [29][30]

## Mythen und Vorsicht

- **„Covered Calls und Put-Verkauf sind sicheres Zusatzeinkommen.“** Widerlegt. Man bekommt kleine, regelmäßige Gewinne und trägt seltene, große Verluste (*negative Schiefe*).
- **„VIX-ETPs eignen sich als Daueralarmanlage fürs Depot.“** Widerlegt: Sie verlieren etwa 30 % pro Jahr.
- **„Inverse VIX-Produkte sind eine Geldmaschine.“** Der 05.02.2018 widerlegt das.
- **„Optionsverkauf liefert heute noch Gratis-Alpha.“** Für den S&P 500 nicht mehr belegt.
- **„0DTE destabilisiert den Markt“** ist umstritten. Dim/Eraker/Vilkov finden keinen Verstärkungseffekt. [31]
- **Spektakuläre Tail-Fonds-Zahlen** (Universa „+3.612 %“) sind Eigenangaben. Sie beziehen sich auf ein hypothetisches Portfolio und sind umstritten. [32]
- **(unsicher)** Die Steigung der VIX-Terminstruktur sagt laut Johnson (2017) die Renditen von Volatilitätsanlagen voraus. Für die Tagesrichtung von Aktien ist sie nicht belegt, und eine Prüfung nach 2013 fehlt. [33]
- Die VRP sagt Aktienrenditen allenfalls auf Quartalssicht voraus, und zwar in-sample. Out-of-sample ist der Effekt deutlich schwächer zu erwarten, für Stunden- oder Tageshorizonte ist er irrelevant. [34]
- **Interessenkonflikte und Survivorship:** Viele Kernquellen stammen von Anbietern (Cboe, AQR, Man, Universa). Indizes wie PUT oder BXM enthalten nicht die Totalverluste geschlossener Produkte wie XIV.

## Was das für Niko heißt

1. **Im Papiertest keine Optionen, 0DTE oder Knock-outs als Vehikel.** Bei Spannen um 12 % frisst der Spread jeden realistischen Prognosevorteil. Falls später echtes Geld ins Spiel kommt: nur das Basisinstrument (ETF oder Aktie), ohne Hebel.
2. **Vola nur für Größe und Erwartung nutzen, nicht für die Richtung.** Eine mögliche Regel: Positionsgröße = Zielvola / realisierte 20-Tage-Vola, mit Obergrenze 1. Rechenhilfe: Der VIX geteilt durch 16 (≈ √252) ergibt grob die erwartete tägliche Schwankung des S&P 500 in %.
3. **VIX und VIX3M nur als Kontext mitprotokollieren** (VIX über VIX3M = Backwardation = Stress). Anschließend auswerten, ob die Trefferquote an Stresstagen schlechter ist. Nach einer Woche ist das statistisch kaum aussagekräftig.
4. **Bilanztage markieren:** Ende Oktober berichten SAP, Tesla, Apple und Nvidia. An diesen Tagen dominiert Rauschen das Trendsignal. Getrennt auswerten oder ausschließen.
5. **Kein Short-Vol, keine Long-VIX-Dauerposition.**
6. **Die billigste Absicherung ist weniger Risiko**, also eine niedrigere Aktienquote oder mehr Cash. Die 200-Tage-Regel ist bereits ein langsamer Crashschutz, schützt aber nicht vor Ein-Tages-Crashs.
7. **Basisrate merken:** 74 % der Turbo-Händler verlieren. Bei jeder Hebel-Idee fragen: Warum sollte ich zu den anderen 26 % gehören?
8. **Bei jeder Studie prüfen:** Wer hat sie finanziert? Sind die Zahlen brutto oder netto? Welcher Zeitraum, vor oder nach 2010?

Das ist keine Anlageberatung und kein Gewinnversprechen.

## Offene Fragen

- Bleibt die VRP dauerhaft klein, oder kehrt sie mit dem 0DTE-Boom bzw. nach Crashs zurück?
- Wie groß sind die Verluste mit Retail-Optionen wirklich? Die Studien widersprechen sich.
- Lässt sich die Vola-Steuerung des Gesamtmarkts nach 2017 out-of-sample und nach Kosten bestätigen? Steuerung nach Abwärts-Vola gilt als robuster, das ist umstritten.
- Wie entwickeln sich VDAX-NEW, VSTOXX und die VRP von Eurex-Optionen? Fast alle Studien betreffen den S&P 500.
- Krypto (Deribit, DVOL, Funding-Raten, Handel rund um die Uhr): Die S&P-Evidenz ist nicht übertragbar, und eine Primärstudie fehlt.
- Wie stark ist der *Leverage-Effekt*, also dass die Vola bei fallenden Kursen steigt? Ein steigender VIX läuft dann meist gleichzeitig mit den Kursen und nicht voraus. Bei Gold wirkt der Effekt vermutlich schwächer oder umgekehrt. Nicht geprüft.
- Wurde die Verlustverrechnungsgrenze von 20.000 EUR für Termingeschäfte durch das Jahressteuergesetz 2024 abgeschafft? Das ist noch zu prüfen.
- Sind GEX-Indikatoren („Gamma-Exposure“) für die Tagesrichtung brauchbar? Sie sind schwach belegt und sollten nicht ungeprüft genutzt werden.
- Wie hoch sind die Nettokosten von Put-Hedging mit DAX-Optionen der Eurex für Privatanleger?

## Quellen

1. Carr & Wu (RFS 2009): https://ideas.repec.org/a/oup/rfinst/v22y2009i3p1311-1341..html
2. Dew-Becker et al. (JFE 2017): https://pure.psu.edu/en/publications/the-price-of-variance-risk/
3. Cboe, PUT-White-Paper (Interessenkonflikt): https://www.cboe.com/insights/posts/white-paper-shows-volatility-risk-premium-facilitated-higher-risk-adjusted-returns-for-put-index/
4. Chicago Fed WP 2025-17: https://www.chicagofed.org/publications/working-papers/2025/2025-17
5. Dew-Becker & Giglio (SSRN): https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5525882
6. Indexology zu Bondarenko: https://www.indexologyblog.com/2016/02/18/paper-by-professor-bondarenko-has-intriguing-new-analysis-of-put-and-wput-indexes/
7. Cboe PUT-Factsheet: https://cdn.cboe.com/resources/indices/factsheet/CboeGlobalIndices_PUT-Index.pdf
8. CXO, PutWrite: https://www.cxoadvisory.com/equity-options/performance-of-cboe-putwrite-indexes
9. Israelov & Nielsen (FAJ 2015): https://rpc.cfainstitute.org/research/financial-analysts-journal/2015/covered-calls-uncovered
10. AQR, Covered Call Myths: https://www.aqr.com/-/media/AQR/Documents/Insights/Journal-Article/FAJ-Covered-Call-Strategies-One-Fact-and-Eight-Myths.pdf
11. Eraker & Wu (JFE 2017): https://ideas.repec.org/a/eee/jfinec/v125y2017i1p72-98.html
12. BIS, 5. Februar 2018: https://www.bis.org/publ/qtrpdf/r_qt1803t.htm
13. FAJ 2021, Volmageddon: https://rpc.cfainstitute.org/research/financial-analysts-journal/2021/volmageddon-failure-short-volatility-products
14. SEC-Strafe gegen S&P DJI: https://www.businessinsurance.com/sec-fines-sp-dow-jones-indices-over-%c2%91volatility%c2%92-crash-credit-suisse-group-ag/
15. BIS Bulletin 90: https://www.bis.org/publ/bisbull90.pdf
16. Harvey et al. (JPM 2018): https://people.duke.edu/~charvey/Research/Published_Papers/P135_The_impact_of.pdf
17. Moreira & Muir: https://www.nber.org/papers/22208
18. Cederburg et al. (JFE 2020): https://www.lehigh.edu/~xuy219/research/COWY.pdf
19. Barroso & Detzel: https://sbfc.sydney.edu.au/2019/papers/P057_Named.pdf
20. AQR, Pathetic Protection: https://www.aqr.com/insights/research/white-papers/pathetic-protection-the-elusive-benefits-of-protective-puts
21. Ilmanen (FAJ 2012): https://rpc.cfainstitute.org/research/financial-analysts-journal/2012/do-financial-markets-reward-buying-or-selling-insurance-and-lottery-tickets
22. AQR, Put vs. Trend: https://www.aqr.com/insights/research/white-papers/tail-risk-hedging-contrasting-put-and-trend-strategies
23. Bryzgalova et al. (JF 2023): https://lbsresearch.london.edu/id/eprint/2827
24. de Silva, Smith, So: https://www.gsb.stanford.edu/faculty-research/publications/losing-optional-retail-option-trading-expected-announcement
25. Bogousslavsky & Muravyev: https://finance.darden.virginia.edu/?p=1885
26. Bloomberg, 0DTE-Verluste: https://www.bloomberg.com/news/articles/2023-04-21/day-traders-lose-358-000-per-day-gambling-on-zero-day-options
27. CXO, Retail 0DTE: https://cxoadvisory.com/individual-investing/retail-0dte-option-trader-performance
28. Hu et al. (Mgmt. Science 2024): https://ideas.repec.org/a/inm/ormnsc/v70y2024i7p4742-4761.html
29. Börse Online zur BaFin-Studie: https://www.boerse-online.de/nachrichten/aktien/im-schnitt-6358-euro-verlust-bei-privatanlegern-bafin-greift-ein-20402916.html
30. PwC Legal zur Allgemeinverfügung: https://legal.pwc.de/de/news/fachbeitraege/aktuelle-informationen-zur-allgemeinverfuegung-der-bafin-betreffend-turbo-zertifikate
31. Dim, Eraker, Vilkov (0DTE): https://www.maths.ox.ac.uk/node/67396
32. BNN Bloomberg zu Universa: https://www.bnnbloomberg.ca/why-one-firm-s-3-612-return-is-drawing-the-ire-of-hedge-funds-1.1903852
33. Johnson (JFQA 2017): https://ideas.repec.org/a/cup/jfinqa/v52y2017i06p2461-2490_00.html
34. Bollerslev, Tauchen, Zhou: https://papers.ssrn.com/abstract=948309
