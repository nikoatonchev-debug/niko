# Risikomanagement und Positionsgröße

**Kurz gesagt:** Wie viel man pro Position einsetzt, entscheidet langfristig mehr über Erfolg oder Ruin als jedes einzelne Signal. Verluste sind asymmetrisch: Nach −50 % braucht man +100 %, um wieder bei null zu sein. Hebel vervielfacht Verluste überproportional, und rund drei Viertel der Privatanleger verlieren mit Hebelprodukten Geld. Positionen sollten nach Risiko (Schwankung) bemessen werden, nicht nach Euro-Betrag, und ohne gemessenen Vorteil (Edge) ist die richtige Wettgröße nach Kelly null. Dieses Kapitel ist keine Anlageberatung und verspricht keine Gewinne.

## Was belegt ist

**Erholungs-Mathematik** [stark]. Nach einem Verlust von x braucht man x/(1−x) Gewinn: −10 % → +11,1 %, −20 % → +25 %, −50 % → +100 %, −75 % → +300 %, −90 % → +900 %. Reale Beispiele: Der Nikkei 225 brauchte rund 34 Jahre (Hoch Dezember 1989, neues Hoch Februar 2024) und lag zum Tiefpunkt 2008/09 rund 82 % im Minus. Der Nasdaq brauchte rund 15 Jahre (2000 bis 2015). Beides gilt für Preisindizes ohne Dividenden; mit Dividenden und Sparraten ging es schneller. Bitcoin fiel in jedem großen Zyklus um etwa 77–93 % (Zahlen aus Branchenresearch). [1][2][3]

**Kelly-Kriterium** [stark]. Kelly ist eine Formel für die wachstumsoptimale Wettgröße. Im idealen Modell mit bekannten Parametern liegt bei vollem Kelly die Wahrscheinlichkeit, irgendwann die Hälfte des Vermögens zu verlieren, bei 50 %. Bei Half Kelly (halbe Größe) sind es nur 12,5 %, das langfristige Wachstum sinkt dabei nur um 25 %. Echte Märkte haben Kurssprünge und dicke Ränder, reale Drawdowns (Rückgänge vom Höchststand) sind also größer. [4][5]

**Schätzfehler** [stark]. In der Praxis wird die Edge geschätzt und meist überschätzt. Fehler beim erwarteten Ertrag kosten laut Chopra und Ziemba (1993) etwa 10-mal so viel wie Fehler bei der Varianz. Deshalb muss die Wettgröße unter Kelly „geschrumpft“ werden. Bei Trefferquoten nahe 50 % ist die Unsicherheit größer als die Edge selbst. [6][7]

**Volatility Drag** [stark]. Die tatsächlich erzielte (geometrische) Rendite ist etwa die Durchschnittsrendite minus halbe Varianz. Bei 30 % Volatilität sind das rund 4,5 % pro Jahr, mit 2x Hebel 18 %. Ein 2x-ETF mit täglichem Reset verliert bei 50 % Volatilität und unverändertem Basiswert in einem Jahr etwa 22 %. SEC und FINRA warnten 2009 vor solchen Produkten für längere Haltedauern. [8][9]

**Hebel bei Privatanlegern** [stark]. ESMA (2018): 74–89 % der CFD-Konten von Privatanlegern verlieren. BaFin-Untersuchung zu Turbo-Zertifikaten 2019–2023: 74,2 % mit Verlust, im Schnitt 6.358 € (Zahlen laut Prüfer vor Verwendung auf bafin.de nachlesen). Day-Trader in Taiwan verloren in Summe; nur rund 1 % war vorhersagbar profitabel. In Brasilien verloren 97 % der ausdauernden Day-Trader Geld. [10][11][12][13]

**Positionsgröße nach Volatilität** [mittel]. Wer Positionen bei hoher Schwankung verkleinert, glättet das Risiko. Ein höheres Sharpe Ratio (Rendite pro Risikoeinheit) gab es vor allem bei Aktien, kaum bei Anleihen, Währungen und Rohstoffen. Bei Momentum-Strategien stieg das Sharpe Ratio mit Volatilitätsskalierung von ca. 0,53 auf 0,97, der schlimmste Monat verbesserte sich von ca. −79 % auf −28 %. Achtung: Vol-Steuerung reagiert verzögert auf plötzliche Schocks (März 2020), der erste Schlag trifft die volle Position. [14][15][16]

**Korrelationen steigen in Krisen** [stark]. Aktienmärkte laufen in Abstürzen deutlich stärker zusammen als in Aufschwüngen (Longin/Solnik 2001). Bitcoin und S&P 500: Korrelation 0,01 in 2017–2019, 0,36 in 2020–2021 (IMF). [17][18]

**Gleichgewichtung** [mittel]. Optimierte Portfolios waren out-of-sample (auf neuen Daten) nicht konsistent besser als einfache Gleichgewichtung (1/N). Gleichgewichtung „gewinnt“ aber nicht immer; mit vernünftigen Annahmen kann Optimierung besser sein. [19][20]

**Dispositionseffekt** [stark]. Privatanleger realisieren Gewinne etwa 1,5-mal so häufig wie Verluste (Odean 1998), die verkauften Gewinner liefen danach besser als die gehaltenen Verlierer. Das spricht für vorab festgelegte Ausstiegsregeln. [21]

**Stop-Loss** [mittel]. Bei reinem Zufallsverlauf senken Stops die erwartete Rendite. Helfen können sie nur, wenn Kurse Momentum oder Regimewechsel zeigen. Enge Stops auf Einzelaktien schnitten nach Kosten schlechter ab als Kaufen und Halten (1964–2014). Bei Kurslücken wird deutlich unter dem Stop-Kurs ausgeführt. [22][23]

**200-Tage-Linie** (unsicher): Die Trendregel wirkt vor allem als Bremse in langsamen Bärenmärkten; monatliche Signale scheinen nicht schlechter als tägliche. Die Studie konnte nicht im Volltext geprüft werden. Für die Richtung der nächsten Stunden oder des nächsten Tages hat sie keine belegte Prognosekraft. [24]

## Mythen und Vorsicht

- **„Ein Stop-Loss schützt immer und verbessert die Rendite“ – widerlegt.** Stops sind ein Risikowerkzeug, keine Renditequelle. Die oft zitierten +50–100 Basispunkte gelten nur in den Ausgestoppt-Phasen.
- **„Volatility Targeting ist Gratis-Alpha“ – schwach.** Bei vielen Einzelstrategien verschwand der Vorteil out-of-sample bzw. nach Kosten; klassische Varianten erzeugten bei globalen Aktien teils größere Drawdowns. Ein bedingter Ansatz (nur bei Extrem-Volatilität eingreifen) schnitt besser ab. [16][25]
- **„Breite Streuung über Aktienmärkte schützt im Crash“ – schwach.** Genau dann steigen die Korrelationen.
- **„Gold schützt in jeder Krise dauerhaft“ – schwach.** Der Schutz hielt nur etwa 15 Handelstage, im März 2020 fiel Gold anfangs mit; 2011–2015 verlor Gold rund 45 %. [26][27]
- **Stop-Loss auf Momentum-Portfolios** (Han/Zhou/Zhu, −49,8 % → −11,4 % schlimmster Monat): schwache Evidenz, vor Kosten, unterstellt perfekte Ausführung. [28]
- **Anbieter-Bias:** Viel Trendfolge-Evidenz stammt von AQR, das solche Fonds verkauft; die Zahlen sind simuliert. Trendfolge brachte 2010–2019 nur ca. 1,8 % p. a. [29]

## Was das für Niko heißt

1. **Kein Hebel.** Keine CFDs, Turbos, Knock-outs oder gehebelten ETFs. Knock-outs können bei einer Kurslücke wertlos verfallen.
2. **Größe nach Risiko.** Größe = Risikobudget / (Volatilität × Kurs), Volatilität z. B. als ATR oder Standardabweichung über 20–60 Tage. Bitcoin, Ethereum und Tesla bekommen so viel kleinere Positionen als EUR/USD oder Gold.
3. **Kelly = 0, solange keine Edge gemessen ist.** Später höchstens 1/4 bis 1/2 Kelly einer bewusst vorsichtig geschätzten Edge.
4. **Feste Risiko-Quote.** Pro Trade 0,5–1 % des Kontos bis zum Stop riskieren. Das ist eine Praktiker-Faustregel, keine Studienzahl.
5. **Klumpenrisiko begrenzen.** Die 12 Märkte sind effektiv nur etwa 3–5 unabhängige Wetten: eine große Aktienwette (DAX, SAP, S&P 500, Nasdaq 100, Nvidia, Apple, Tesla), Krypto (an die Nasdaq gekoppelt), dazu Gold, Öl und EUR/USD. Die Aktiengruppe bekommt höchstens ein Drittel bis die Hälfte des Risikobudgets.
6. **Drawdown-Budget vorher festlegen,** z. B. Pause und Systemprüfung bei −15 bis −20 % (Heuristik).
7. **Stops weit und volatilitätsbasiert** oder als Trend-Ausstieg, keine engen Prozent-Stops. Kurslücken bei Earnings, am Wochenende und bei Krypto einkalkulieren.
8. **Regeln schriftlich festlegen,** bevor eine Position eröffnet wird, und nicht während der Position ändern.
9. **Papiertest realistisch auswerten.** Eine Woche ergibt etwa 60–100 korrelierte Prognosen; das 95-%-Konfidenzintervall der Trefferquote ist etwa ±10–13 Prozentpunkte breit. Selbst 60 % Treffer sind nicht von Zufall zu unterscheiden. Vergleichsmaßstab ist die Basisrate: Bei Aktienindizes liefert „immer steigt“ schon etwa 53 %.
10. **Kosten und Steuern:** Spreads, Gebühren und Abgeltungsteuer senken die Netto-Rendite; Aktienverluste sind nur mit Aktiengewinnen verrechenbar.

## Offene Fragen

- Hat die Methode (200-Tage-Linie plus News) auf 4–5 Stunden bzw. 1 Tag überhaupt eine Edge? Dafür braucht es Hunderte ausgewertete Prognosen.
- Wie haben sich Volatility Targeting und Trendfolge nach 2020 out-of-sample und nach Kosten entwickelt?
- Wie hoch ist die aktuelle Korrelation von Bitcoin/Ethereum mit Nasdaq und S&P 500 (2025/26)?
- Ist Gold in den jüngsten Krisen weiterhin nur kurzfristig ein sicherer Hafen?
- Gibt es Primärstudien für die 1–2-%- bzw. 0,5–1-%-Risikoregel?
- Die Detailzahlen von Clare et al. (2013), Kaminski/Lo sowie die BaFin-Turbo-Zahlen sind gegen die Volltexte nachzuprüfen; die Prüfung lief ohne neuen Quellenabgleich.
- Wirken Stops bei Krypto mit 24/7-Handel anders als bei Aktien mit Kurslücken?
- Welches Aktien-Anleihen-Korrelationsregime herrscht im Oktober 2026?

## Quellen

1. Bloomberg: Nikkei Reclaims Its 1989 Peak – https://www.bloomberg.com/news/articles/2024-02-22/japan-s-nikkei-hits-intraday-high-surging-past-1989-record
2. FT (via euro2day): The Nasdaq – going nowhere for 15 years – https://www.euro2day.gr/ftcom_en/article-ft-en/1327025/the-nasdaq-going-nowhere-for-15-years.html
3. NYDIG: Charting drawdowns during up cycles – https://nydig.com/research/charting-drawdowns-during-up-cycles
4. MacLean, Thorp, Ziemba: Good and Bad Properties of the Kelly Criterion – https://www.stat.berkeley.edu/~aldous/157/Papers/Good_Bad_Kelly.pdf
5. MacLean, Thorp, Ziemba (Quantitative Finance 2010) – https://escholarship.org/content/qt5mr5k8qj/qt5mr5k8qj.pdf
6. Baker & McHale: Optimal Betting Under Parameter Uncertainty (2013) – https://pubsonline.informs.org/doi/fpi/10.1287/deca.2013.0271
7. Chopra & Ziemba (1993), JPM – https://doi.org/10.3905/jpm.1993.409440
8. Variance Tax (Blog) – https://philippdubach.com/posts/variance-tax/
9. SLCG zur SEC/FINRA-Warnung – https://www.slcg.com/resources/blog/33
10. ESMA: Restrict CFDs – https://www.esma.europa.eu/node/84933
11. BaFin: Turbo-Zertifikate (15.10.2025) – https://www.bafin.de/SharedDocs/Veroeffentlichungen/DE/Pressemitteilung/2025/pm_2025_10_15_Turbo_Zertifikat_Knock_Out.html
12. Barber, Lee, Liu, Odean: Day Traders – https://faculty.haas.berkeley.edu/odean/papers/day%20traders/day%20trading%20and%20learning%20110217.pdf
13. Chague, De-Losso, Giovannetti: Day Trading for a Living? – https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3423101
14. Harvey et al.: The Impact of Volatility Targeting – https://scholars.duke.edu/publication/1370354
15. Barroso & Santa-Clara: Momentum has its moments – https://ciencia.ucp.pt/en/publications/momentum-has-its-moments/
16. Bongaerts, Kang, van Dijk: Conditional Volatility Targeting – https://rpc.cfainstitute.org/research/financial-analysts-journal/2020/conditional-volatility-targeting
17. Longin & Solnik: Extreme Correlation – https://repec.cepr.org/repec/cpr/ceprdp/Dp2538.pdf
18. IMF Blog: Crypto Prices Move More in Sync With Stocks – https://www.imf.org/en/blogs/articles/2022/01/11/crypto-prices-move-more-in-sync-with-stocks-posing-new-risks
19. DeMiguel, Garlappi, Uppal: Optimal Versus Naive Diversification – https://ideas.repec.org/a/oup/rfinst/v22y2009i5p1915-1953.html
20. Kritzman, Page, Turkington: In Defense of Optimization – https://doi.org/10.2469/faj.v66.n2.6
21. Odean: Are Investors Reluctant to Realize Their Losses? – https://faculty.haas.berkeley.edu/odean/papers/disposition/disposition.html
22. Kaminski & Lo: When Do Stop-Loss Rules Stop Losses? – https://dspace.mit.edu/handle/1721.1/114876
23. Lo & Remorov: Stop-loss strategies – https://dspace.mit.edu/handle/1721.1/107017
24. Clare et al.: Breaking into the blackbox – https://openaccess.city.ac.uk/17842
25. Cederburg et al.: On the Performance of Volatility-Managed Portfolios – https://www.lehigh.edu/~xuy219/research/COWY.pdf
26. Baur & Lucey: Is Gold a Hedge or a Safe Haven? – https://www.tcd.ie/triss/assets/PDFs/iiis/iiisdp198.pdf
27. Baur & McDermott: Is gold a safe haven? – https://doi.org/10.1016/j.jbankfin.2009.12.008
28. Alpha Architect: Taming the momentum roller coaster – https://alphaarchitect.com/taming-the-momentum-roller-coaster-fact-or-fiction/
29. Hurst, Ooi, Pedersen: A Century of Evidence on Trend-Following – https://www.aqr.com/Insights/Research/Journal-Article/A-Century-of-Evidence-on-Trend-Following-Investing?aqrPDF=1
