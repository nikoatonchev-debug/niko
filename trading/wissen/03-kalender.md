# Kalender- und Saisoneffekte

**Kurz gesagt:** Kalendereffekte sind wiederkehrende Kursmuster, die an Datum oder Uhrzeit hängen, zum Beispiel am Monatswechsel, an Zinsterminen der US-Notenbank oder an der Jahreszeit. Viele davon gab es in alten Daten tatsächlich. Die meisten sind aber nach ihrer Veröffentlichung stark geschrumpft oder verschwunden. Die übrigen bringen nur wenige hundertstel Prozent pro Tag, und Kosten und Steuern fressen das meist auf. Für Nikos Tagesprognosen taugen Kalendereffekte höchstens als Notiz oder als Entscheidungshilfe bei Gleichstand, nicht als Signal.

## Was belegt ist

**Belegstärke:** [stark] = mehrere begutachtete Studien, repliziert; [mittel] = begutachtet, aber begrenzt oder mit Lücken; [schwach] = wenig oder indirekter Beleg.

**1. Veröffentlichte Effekte schrumpfen. [stark]**
McLean & Pontiff (2016) untersuchten 97 bekannte Renditemuster aus der Forschung. Außerhalb der ursprünglichen Stichprobe waren die Renditen im Schnitt 26 % niedriger, nach der Veröffentlichung 58 % niedriger [13]. Die 26 % gelten als Obergrenze für reinen Zufallsfund („Data-Mining“, also Muster, die man durch langes Suchen zufällig findet). Am besten überlebten Muster in schwer handelbaren Aktien mit hohem Einzelrisiko und geringer Liquidität, also nicht in Nikos großen Werten. Sullivan, Timmermann & White (2001) testeten rund 9.500 Kalenderregeln an etwa 100 Jahren Dow-Jones-Daten. Nach Korrektur für Mehrfachtests war keine signifikant. Die Fälle unten (Overnight-Drift, Pre-FOMC, Montag, Vor-Feiertag) passen ins Bild. Die Ursachen unterscheiden sich aber, daher ist das ein Indiz, kein Beweis.

**2. Monatswechsel (Turn-of-the-Month, TOM). [mittel]**
Das TOM-Fenster umfasst den letzten Handelstag eines Monats und die ersten drei des nächsten. McConnell & Xu (2008) fanden: Von 1987 bis 2005 fiel die gesamte positive Überrendite des US-Marktes in dieses Fenster. Der Effekt zeigte sich in 31 von 35 Ländern [1][2]. Laut einer Zusammenfassung lag die Tagesrendite an TOM-Tagen bei etwa +0,14 %, an den übrigen Tagen bei etwa -0,01 % (wertgewichtet) [3]. Diese Zahlen stammen nicht aus dem Abstract, sind also vorsichtig zu lesen. Kaufdruck am Monatsende erklärt den Effekt laut den Autoren nicht. Ob er nach 2005 noch so stark ist, ist offen (siehe Offene Fragen).
Als eigene Rein-Raus-Strategie (nur an 4 Tagen investiert) schlägt TOM Buy-and-Hold nach Kosten wohl nicht verlässlich [4][5] **(unsicher)**: etwa 24 Transaktionen pro Jahr, und jeder Gewinn wird sofort versteuert.

**3. Über-Nacht- gegen Tagesrendite bei US-Aktien. [stark, nur USA, beschreibend]**
Historisch kam fast die ganze Rendite von US-Aktien zwischen Schluss und Eröffnung zustande; tagsüber lag sie nahe null. Für 1993 bis 2006 werden etwa +0,03 bis +0,05 % pro Nacht genannt [6] (nur Zusammenfassung). Lou, Polk & Skouras (2019) erklären das unter anderem damit, dass verschiedene Anlegergruppen zu unterschiedlichen Zeiten handeln [7][8]. Ein Teil sind Nachrichten nach Börsenschluss, etwa Quartalszahlen. Das Muster gilt nicht überall (in China ist die Nachtrendite typischerweise negativ) und schwankt stark zwischen Zeiträumen.

**4. Der „Overnight Drift“ in US-Futures ist verschwunden. [mittel]**
Boyarchenko, Larsen & Whelan fanden in E-mini-S&P-500-Futures (Terminkontrakte auf den Index) ein Stundenfenster von 2 bis 3 Uhr New Yorker Zeit mit etwa 3,7 % Rendite pro Jahr [9][12]. Ihr Update vom Juli 2026 zeigt: Seit 2021 liegt dieses Fenster im Schnitt nahe null, auch bei Nasdaq-100- und Dow-Futures [10][11]. Als Hauptgrund nennen sie eine veränderte Marktstruktur (algorithmische Liquiditätsgeber).

**5. Kursanstieg vor Fed-Zinsentscheiden (Pre-FOMC-Drift). [stark für 1994–2011, danach mittel]**
Lucca & Moench (2015): Von 1994 bis 2011 stieg der S&P 500 im Schnitt um 0,49 % in den 24 Stunden vor geplanten Fed-Entscheiden, das war über 80 % der Aktienprämie dieser Zeit [14][15]. Bei Messung Schluss-zu-Schluss sind es eher 0,33 %, die Zahl hängt also von der Messmethode ab. Seit etwa 2015/2016 ist der Effekt im Durchschnitt verschwunden [17][18][19]. Eine Studie (Hu/Pan/Wang/Zhu 2022) findet ihn noch, wenn die Unsicherheit (VIX) vorher gestiegen ist **(unsicher, nicht im Volltext geprüft)**. Eine handelbare Regel ergibt sich aus keinem der beiden Befunde.

**6. Winter stärker als Sommer (Halloween-Effekt). [mittel für die Zeit vor 2003, heute schwach]**
Bouman & Jacobsen (2002): Von 1970 bis 1998 waren die Renditen November bis April in 36 von 37 Ländern höher als Mai bis Oktober, besonders in Europa [21][22]. Längere Datenreihen (bis zurück 1693) sollen das bestätigen [23][24]; die genauen Zahlen sind ungeprüft **(unsicher)**. Wichtig: Der Sommer war meist schwächer, nicht verlustreich. Dichtl & Drobetz (2014) sehen den Effekt in den letzten Jahren stark abgeschwächt oder verschwunden [26].

**7. Intraday-Momentum. [mittel]**
Gao, Han, Li & Zhou (2018): Die Rendite vom Vortagesschluss bis 10:00 Uhr New York sagt ein wenig über die letzte halbe Stunde des US-Handels voraus (SPY, 1993–2013) [29][30][31]. Die Erklärungskraft ist klein (R² etwa 1–2 %, also 98–99 % der Bewegung bleiben unerklärt). Eine Folgestudie (Baltussen et al. 2021) findet das Muster in über 60 Futures-Märkten bis etwa 2020 **(unsicher, hier nicht verlinkt)**. Für Nikos Tagesschluss-Prognosen vom Vortag ist das nutzlos.

## Mythen und Vorsicht

- **„Nur über Nacht investiert sein schlägt Buy-and-Hold.“** Falsch in der Praxis. Der ETF NSPY verlor seit Start 6,9 %, während der S&P 500 um 22 % stieg; NIWM verlor über 10 % [40][41][42][43]. Beide wurden im August 2023 liquidiert, kurz darauf auch die Schwester NSPL. Die Live-Phase war kurz, das stärkere Argument sind die Kosten: zwei Transaktionen pro Tag gegen wenige hundertstel Prozent Vorteil.
- **„Das Nacht/Tag-Muster beweist Manipulation“** (Knuteson, auch zu Tesla) [44][45][46]. Nicht begutachtete Preprints. Begutachtete Studien erklären das Muster ohne Manipulation [7][9].
- **„Sell in May“ bringt bei DAX und S&P 500 mehr als Buy-and-Hold.** Für große Indizes nicht belegt. In den USA hing der Effekt an zwei Ausreißern (Crash Oktober 1987, August 1998) [27]. Von 2003 bis 2012 war Buy-and-Hold bei S&P 500, DAX und anderen großen Indizes besser [28].
- **Wochentagseffekt („schwache Montage“).** Widerlegt als heute handelbar: In den 1990ern verschwunden, auch in Deutschland, teils sogar umgekehrt [32][33][34].
- **Vor-Feiertags-Effekt bei großen Aktien.** Früher stark (Ariel 1990), seit etwa 1990 nur noch bei kleinen Firmen [35][36][37][38].
- **Januar-Effekt und „Januar-Barometer“.** War vor allem ein Small-Cap-Phänomen, für Large Caps sehr wahrscheinlich nicht nutzbar; direkte Belege fehlen hier.
- **Verfallstage (Optionsverfall, „Hexensabbat“) als Richtungssignal** **(unsicher, ohne Quelle):** Bekannt sind erhöhtes Volumen, kurzfristiger Preisdruck und „Pinning“ (Schlusskurse häufen sich nahe den Basispreisen), aber keine verlässliche Richtung.
- **Saisonalitäts-Charts von Brokern und Social Media**: meist ohne Kosten, ohne Signifikanztest, ohne Prüfung nach Veröffentlichung.

## Was das für Niko heißt

Keine Anlageberatung, keine Gewinnversprechen. Nur Regeln für den Umgang mit Kalenderwissen.

1. **Trend (200-Tage-Linie) und News bleiben die Hauptsignale.** Ein Kalender-Flag darf eine Prognose höchstens kippen, wenn alles andere neutral ist. Höchstens **einen** vorher festgelegten Kalenderfilter verwenden; wer viele Filter ausprobiert, betreibt selbst Data-Mining.
2. **Eine Woche beweist nichts.** Rund 60 Prognosen haben einen Standardfehler der Trefferquote von etwa 6,5 Prozentpunkten. Kalendereffekte liegen bei wenigen Basispunkten (0,01 %), Tagesschwankungen bei 1–4 %, bei Krypto, Tesla und Nvidia mehr. Treffer oder Fehler in der Testwoche sind Rauschen.
3. **Kalender der Testwoche** (bitte prüfen): EU stellt am 25.10. auf Winterzeit um, die USA erst am 01.11. Vom 26. bis 30.10. läuft der US-Handel von 14:30 bis 21:00 Uhr deutscher Zeit, Check-Zeiten anpassen. Fed-Entscheid voraussichtlich Mi 28.10., 19:00 Uhr deutscher Zeit (federalreserve.gov prüfen): kein Long-Bonus, aber geringere Konfidenz für US-Indizes, US-Aktien, Gold, EUR/USD und Krypto. TOM-Fenster erst Fr 30.10. bis Mi 04.11. Kein großer Verfall (nächster Monatsverfall 20.11., großer 18.12.).
4. **Nicht auf andere Märkte übertragen.** Fast alle Belege betreffen Aktien, meist US-Aktien. Für Bitcoin, Ethereum, Gold, Brent und EUR/USD gibt es hier keine belastbaren Kalendereffekte.
5. **Echte Termine schlagen Kalendermuster.** Quartalszahlen von SAP, Apple, Nvidia, Tesla und wichtige Makrodaten vor jeder Prognose prüfen.
6. **Keine Rein-Raus-Strategien mit echtem Geld** (TOM, Halloween, Overnight). Jeder Verkauf mit Gewinn löst Abgeltungsteuer plus Soli (ca. 26,4 %) aus, dazu Spreads und Gebühren. In den US-Studien fehlt das.
7. **Jede veröffentlichte Effektgröße mindestens halbieren** und auf Version und Messmethode achten (Working Paper vs. Journal, 49 vs. 33 Basispunkte).
8. **Kalender-Flags als eigene Spalte protokollieren** und erst nach Monaten bzw. hunderten Prognosen auswerten, mit Korrektur für Mehrfachtests.

## Offene Fragen

- Lebt der TOM-Effekt nach 2005 in S&P 500 und DAX, auch nach Kosten? Die „Dash for Cash“-Studie (Etula et al., RFS 2020) findet ein Monatsend-Muster in jüngeren Daten; nicht im Volltext geprüft.
- Pre-FOMC 2020–2026: Ist der Effekt bei hoher Unsicherheit zurück? Ein Blog behauptet es [20], begutachtete Belege fehlen.
- Kehrt der Overnight-Drift zurück, wenn die Auftragsungleichgewichte zum Schluss wieder stärker streuen [10]?
- Wie verändern täglich verfallende Optionen (0DTE) Intraday-Momentum, Schlussauktion und Pinning? Ist das Paper „Beat the Market“ [47] belastbar?
- Gibt es nach Kosten nutzbare Kalendereffekte bei Krypto (Wochenende, Monatsende), Gold, Öl oder EUR/USD?
- Halloween nach 2017: unabhängige Studien (ohne Jacobsen als Koautor) für DAX und S&P 500 fehlen.
- Januar-Effekt: Primärquellen (Keim 1983, Haugen & Jorion 1996, Gu 2003) nachrecherchieren.
- Verfallstage: Belege (Stoll & Whaley, Ni/Pearson/Poteshman 2005) mit Quellen nachtragen.
- Methodik: Die Zahlen stammen teils nur aus Zusammenfassungen; Volltexte prüfen.

## Quellen

1. McConnell & Xu: Equity Returns at the Turn of the Month (FAJ 2008) – https://rpc.cfainstitute.org/research/financial-analysts-journal/2008/equity-returns-at-the-turn-of-the-month
2. IDEAS/RePEc: McConnell & Xu, FAJ 64(2) – https://ideas.repec.org/a/taf/ufajxx/v64y2008i2p49-64.html
3. CXO Advisory: The Turn-of-the-Month Effect – https://www.cxoadvisory.com/calendar-effects/the-turn-of-the-month-effect/
4. Financial Services Review: TOM in international ETFs – https://openjournals.libs.uga.edu/fsr/article/download/3338/2971
5. Quantpedia: Turn of the Month in Equity Indexes – https://quantpedia.com/strategies/turn-of-the-month-in-equity-indexes
6. CXO Advisory: Buy at the Close and Sell at the Open? – https://www.cxoadvisory.com/calendar-effects/buy-at-the-close-and-sell-at-the-open
7. Lou, Polk, Skouras: A Tug of War (JFE 2019) – https://personal.lse.ac.uk/polk/research/TugOfWar.pdf
8. LSE Research Online: A tug of war – https://eprints.lse.ac.uk/87481/
9. NY Fed Staff Report 917: The Overnight Drift – https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr917.pdf
10. Liberty Street Economics (2026): The Disappearing Overnight Drift – https://libertystreeteconomics.newyorkfed.org/2026/07/the-disappearing-overnight-drift/
11. SSRN: The Disappearing Overnight Drift – https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7035838
12. Liberty Street Economics (2021): The Overnight Drift in U.S. Equity Returns – https://libertystreeteconomics.newyorkfed.org/2021/05/the-overnight-drift-in-us-equity-returns
13. McLean & Pontiff: Does Academic Research Destroy Stock Return Predictability? (JF 2016) – https://www.gwern.net/doc/economics/2016-mclean.pdf
14. VoxEU/CEPR: Predictable movements in asset prices around FOMC meetings – https://cepr.org/voxeu/columns/predictable-movements-asset-prices-around-fomc-meetings
15. NY Fed Staff Report 512: The Pre-FOMC Announcement Drift – https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr512.pdf
16. R-bloggers: Update on the Pre-FOMC Announcement Drift – https://www.r-bloggers.com/2015/03/update-on-the-pre-fomc-announcement-drift/
17. Kurov, Wolfe, Gilbert: The disappearing pre-FOMC announcement drift (FRL 2021) – https://econpapers.repec.org/RePEc:eee:finlet:v:40:y:2021:i:c:s1544612320315956
18. Applied Economics (2024): The pre-FOMC announcement drift: short-lived or long-lasting? – https://www.tandfonline.com/doi/full/10.1080/00036846.2024.2322573
19. SSE: The Pre-Monetary Policy Announcement Drift on the Swedish market – http://arc.hhs.se/download.aspx?MediumId=3247
20. QuantSeeker: Trading the Fed: The Pre-FOMC Drift is Alive (Blog) – https://www.quantseeker.com/p/trading-the-fed-the-pre-fomc-drift
21. Bouman & Jacobsen: The Halloween Indicator (AER 2002) – https://pure.eur.nl/en/publications/the-halloween-indicator-sell-in-may-and-go-away-another-puzzle/
22. Bouman & Jacobsen, Working Paper – https://www.tias.edu/docs/default-source/Kennisartikelen/ssrn-id76248.pdf?sfvrsn=2
23. Jacobsen & Zhang, Working Paper – https://www.tias.edu/docs/default-source/Kennisartikelen/ssrn-id2154873.pdf
24. JIMF: Halloween indicator everywhere and all the time – https://www.sciencedirect.com/science/article/abs/pii/S0261560620302242
25. IRFA: The Halloween effect: Trick or treat? – https://www.sciencedirect.com/science/article/abs/pii/S1057521910000608
26. Dichtl & Drobetz (2014): Sell in May and Go Away: Still Good Advice for Investors? – https://www.bnains.org/backtest/periode/Sell_in_May_and_Go_away_Still_Good_Advice_for_Investors_-_Hubert_Dichtl_&_Wolfgang_Drobetz,_2014.pdf
27. Maberly & Pierce (Econ Journal Watch 2004) – https://econjwatch.org/articles/stock-market-efficiency-withstands-another-challenge-solving-the-sell-in-may-buy-after-halloween-puzzle
28. CXO Advisory: Halloween Indicator Out-of-sample Test – https://www.cxoadvisory.com/calendar-effects/halloween-indicator-out-of-sample-test/
29. Market intraday momentum (JFE 2018) – https://profiles.wustl.edu/en/publications/market-intraday-momentum/
30. Market Intraday Momentum (Autoren-PDF) – https://assets.super.so/e46b77e7-ee08-445e-b43f-4ffd88ae0a0e/files/ee7dac49-530b-4950-b5d0-e0b5eee08f2e.pdf
31. SSRN 2440866: Intraday Momentum – https://www.smallake.kr/wp-content/uploads/2015/01/SSRN-id2440866.pdf
32. Pandey: Day-of-the-week effect – https://works.bepress.com/vivek-pandey/18
33. Journal of Empirical Finance 18(3), 2011 – https://ideas.repec.org/a/eee/empfin/v18y2011i3p447-460.html
34. Day-of-the-week effect in the Canadian money market – https://researchworks.creighton.edu/esploro/outputs/journalArticle/Day-of-the-week-effect-in-the-Canadian-money/991005929654302656
35. Ko & Yang: The Pre-Holiday Premium (Critical Finance Review 2024) – https://nowpublishers.com/article/Details/CFR-0111
36. Ko & Yang (PDF) – https://cfr.ivo-welch.info/published/papers/ko2021pre.pdf
37. W. P. Carey (ASU): Don't bet on holiday effect – https://knowledge.wpcarey.asu.edu/20190311-dont-bet-holiday-effect-boost-market-returns
38. Firm Size & Pre-Holiday Effect (Neuseeland) – https://repository.usp.ac.fj/id/eprint/7566
39. Intraday Time-series Momentum: Evidence from China – https://pureadmin.qub.ac.uk/ws/files/194643805/Intraday_Time_series_Momentum_Evidence_from_China.pdf
40. WealthManagement/Bloomberg: Night Effect ETFs to Shut Down – https://www.wealthmanagement.com/etfs/night-effect-etfs-shut-down-overnight-stock-returns-elusive
41. etf.com: 2 NightShares ETFs Close – https://www.etf.com/sections/news/2-nightshares-etfs-close-after-struggling-gain-traction
42. InvestmentNews: ETF strategy designed for night owls gets a wake-up call – https://investmentnews.com/rias/etf-strategy-designed-for-night-owls-gets-a-wake-up-call/240147
43. Mutual Fund Observer: another NightShare ETF to liquidate (NSPL) – https://mutualfundobserver.com/discuss/discussion/61419/another-nightshare-etf-to-liquidate
44. Knuteson: Strikingly Suspicious Overnight and Intraday Returns (Preprint) – https://arxiv.org/pdf/2010.01727
45. Knuteson: They Chose to Not Tell You (Preprint) – https://ar5iv.labs.arxiv.org/html/2107.12516
46. Columbia Statistical Modeling Blog (2025): Tesla tagsüber/über Nacht – https://statmodeling.stat.columbia.edu/2025/04/19/for-15-years-tesla-stock-has-been-edging-down-during-the-day-and-shooting-up-overnight/
47. Zarattini et al.: Beat the Market (Praktiker-Paper, nicht begutachtet) – https://www.researchgate.net/publication/380582442_Beat_the_Market_An_Effective_Intraday_Momentum_Strategy_for_SP500_ETF_SPY
