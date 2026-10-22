# Makro, Bewertung und Marktregime

**Kurz gesagt:** Zinsen, Zinskurve, Kreditspreads, Inflation und Bewertung (z.B. das Shiller-KGV) sagen etwas über die Konjunktur und die *durchschnittliche* Aktienrendite der nächsten Monate bis zehn Jahre. Für die Richtung des nächsten Tages oder der nächsten Stunden sagen sie praktisch nichts. Selbst auf Monatssicht schlagen die meisten dieser Kennzahlen den einfachen historischen Durchschnitt nicht. Nützlich sind sie als Risiko-Thermometer und für langfristige Erwartungen, nicht als Kauf- oder Verkaufssignal.

> Hinweis zur Datenlage: Alle Zahlen stammen aus Fachliteratur, die in diesem Lauf nicht live gegengeprüft werden konnte. Mit „ca.“ markierte Werte sind Näherungen. Aktuelle Werte für 2026 (CAPE, Zinskurve, Spreads) fehlen. Das ist keine Anlageberatung.

## Was belegt ist

**1. Makro- und Bewertungsvariablen schlagen den Durchschnitt nicht** [stark]
Welch/Goyal (2008) testeten Dividendenrendite, KGV, Zinsen, Zinskurve, Default Spread, Inflation u.a. für US-Aktien (Daten ab 1871). Die meisten haben ein negatives *Out-of-sample-R²*: Wer sie in Echtzeit zur Prognose genutzt hätte, lag schlechter als mit dem simplen Mittelwert. (Out-of-sample = mit Daten getestet, die beim Bau des Modells nicht verwendet wurden.) Das Update von 2024 prüft 29 neuere Variablen mit Daten bis 2021: Über ein Drittel ist schon in-sample nicht signifikant, von den übrigen scheitert etwa die Hälfte out-of-sample, die Überlebenden hängen oft an Einzelepisoden wie 2008 [1][2][3].

**2. Mit Tricks gibt es eine winzige Prognostizierbarkeit** [mittel]
Mit Restriktionen (z.B. keine negativen Prognosen) erreichen manche Variablen ein monatliches Out-of-sample-R² von ca. 0,1–0,5 % [4]. Kombinierte Prognosen kommen auf Quartalsbasis auf ca. 3–4 % [5]. Das hilft höchstens bei der Gewichtung über Monate, vor Kosten, und ist laut dem Update von 2024 zeitlich instabil.

**3. Das Shiller-KGV (CAPE) sagt etwas über die nächsten ~10 Jahre** [mittel]
CAPE = Kurs geteilt durch den inflationsbereinigten Gewinn der letzten 10 Jahre. US-Daten ab 1926: im günstigsten Zehntel ca. 10 % reale Rendite p.a. über 10 Jahre, im teuersten ca. 0,5 % [8]. Aber: Es gibt seit 1881 nur ca. 14 unabhängige 10-Jahres-Perioden, die Prognosebänder liegen bei etwa ±4–6 Prozentpunkten p.a. [9], und seit 1990 lag der CAPE fast immer über dem Mittel (ca. 16–17), während die Renditen trotzdem höher ausfielen als prognostiziert [6][7]. Ende 2025 lag der S&P-500-CAPE bei ca. 38–40 (unsicher, aktuellen Wert prüfen).

**4. Inverse Zinskurve als Rezessionswarnung** [mittel]
Inverse Kurve = kurzfristige Zinsen höher als langfristige (meist 10 Jahre minus 3 Monate). Sie zeigte fast jede US-Rezession seit ca. 1960 an, mit einem Fehlsignal (1966/67), Vorlauf typischerweise 6–24 Monate [12][13]. Die Stichprobe umfasst aber nur 8–9 Rezessionen. Die Inversion von ca. Ende 2022 bis Ende 2024 (Tiefpunkt ca. −1,9 Prozentpunkte) blieb nach letztem Stand ohne NBER-Rezession (unsicher für Oktober 2026). Der „Near-Term Forward Spread“ gilt als weniger verzerrt [14]. Daten kostenlos: FRED T10Y3M [15].

**5. Kreditspreads warnen vor schwächerer Konjunktur** [mittel]
Kreditspread = Mehrzins von Unternehmensanleihen gegenüber Staatsanleihen. Die „Excess Bond Premium“ sagt Beschäftigung und Produktion über 1–4 Quartale voraus [16][18]. Sehr enge Spreads und Euphorie am Kreditmarkt gehen schwächerem Wachstum etwa zwei Jahre später voraus [17]. Für Aktien auf kurze Sicht ist das kaum belegt.

**6. Notenbanken: Nur die Überraschung zählt** [stark]
Eine unerwartete Fed-Zinssenkung um 0,25 Prozentpunkte ging mit ca. +1 % bei US-Aktien einher; erwartete Schritte sind eingepreist [19]. Pressekonferenz und Projektionen wirken oft stärker als der Zinsentscheid selbst, und eine überraschende Straffung kann Aktien sogar steigen lassen, wenn sie als gutes Konjunktursignal gelesen wird. Die Reaktion erfolgt in Sekunden bis Minuten.

**7. Aktien und Anleihen sichern sich nicht immer gegenseitig ab** [stark]
Bei hoher, unsicherer Inflation ist die Korrelation positiv, bei ruhiger Inflation negativ. 2000–2021 war eher die Ausnahme. 2022: S&P 500 ca. −18 %, US-Anleihen (Aggregate) ca. −13 % [22][23].

**8. Volatilität ist vorhersagbar, Renditen kaum** [mittel]
Regime-Modelle (z.B. „ruhiger Bullenmarkt“ vs. „nervöser Bärenmarkt“) beschreiben die Vergangenheit gut, bringen out-of-sample aber wenig, weil Regime erst spät erkannt werden [26]. Volatilitätsgesteuerte Portfolios [27] sind über 103 getestete Strategien out-of-sample nicht systematisch besser [28]. Nutzbar ist das für die Positionsgröße, nicht für die Richtung.

**9. Die 200-Tage-Linie ist ein langsamer Risikofilter** [mittel]
Ein 10-Monats-Filter auf US-Aktien lieferte ähnliche Rendite wie Kaufen-und-Halten bei kleineren Verlusten in großen Bärenmärkten [29]. Unter realistischen Annahmen ist der Vorteil kleiner und stammt aus wenigen Episoden [31]. 2020 gab es klassische Fehlsignale (raus nahe dem Tief, wieder rein nach der Erholung). Die Belege für Trendfolge über viele Märkte [30] lassen sich nicht direkt auf einen Einzelindex übertragen. **Für 4–5 Stunden oder einen Tag gibt es keinen Beleg, dass die Lage zur 200-Tage-Linie die Richtung vorhersagt.**

**10. Außerhalb der USA** [mittel]
In ca. 40 Ländern sind kurzfristige Zinsen robustere (negativ wirkende), aber schwache Prädiktoren. Bewertungskennzahlen sind dort nicht robust [32][33].

**11. Veröffentlichte Muster schrumpfen** [mittel]
Bei 97 US-Anomalien sanken die Renditen nach der Veröffentlichung um ca. 58 % [34]. Außerhalb der USA ist der Rückgang weniger eindeutig, und bei Makrogrößen ist ein Teil echte Risikoprämie. Als Faustregel gilt trotzdem: Effekt heute deutlich kleiner als im Paper.

## Mythen und Vorsicht

- **„CAPE hoch, also bald Crash, also raus.“** Widerlegt. Auf ein Jahr erklärt der CAPE fast nichts. Wer ab CAPE 25 (1996/97) oder 30 (2017/18) ausstieg, verpasste große Teile der Hausse. Bewertungs-Timing hat zuletzt gegenüber Kaufen-und-Halten enttäuscht; Empfehlung: höchstens kleine Abweichungen („sin a little“) [10].
- **„Fed-Modell“ (Gewinnrendite vs. Anleiherendite).** Vergleicht eine reale mit einer nominalen Größe und versagte als 10-Jahres-Prognose [11]. Eine Gegenstudie (Maio 2013) findet etwas Prognosekraft – daher: theoretisch fragwürdig, empirisch umstritten, allenfalls langfristig relevant.
- **„Zinskurve invertiert, also sofort verkaufen.“** Sie sagt Rezessionen, nicht den Zeitpunkt des Börsenhochs voraus [13][1]. Nach dem Tief im Oktober 2022 stiegen Aktien trotz Inversion stark (Belege für Aktien nach Inversion: schwach).
- **„Vor Fed-Sitzungen steigen Aktien.“** War 1994–2011 groß (ca. +0,49 % in 24 Stunden) [20], ist seit ca. 2015/16 verschwunden [21].
- **„Aktien schützen kurzfristig vor Inflation.“** Bei Inflationsschüben (Anstieg von unter ca. 2 % auf über 5 %) brachten US-Aktien seit 1926 ca. −7 % real p.a., Staatsanleihen ca. −3 %; Rohstoffe und Trendfolge waren positiv [24][25]. Nur 8 Episoden. Bei dauerhaft hoher, stabiler Inflation sieht es teils anders aus.
- **„Schmale Marktbreite / hohe Konzentration kündigt den Crash an.“** Unbelegt in beide Richtungen. Technische Regeln scheitern oft nach Korrektur für Data-Snooping (Durchprobieren tausender Regeln) [35]; ca. 4 % der US-Aktien erklären die gesamte Netto-Wertschöpfung seit 1926 [36]. Hohe Konzentration heißt Klumpenrisiko (Nasdaq 100, Nvidia, Apple), nicht Crash-Termin.

## Was das für Niko heißt

1. **Horizont beachten.** Makro, Bewertung und 200-Tage-Linie sind für 4–5 Stunden bzw. einen Tag kein Richtungssignal. Die ehrliche Erwartung ist eine Trefferquote nahe der Basisrate.
2. **Gegen Basislinien messen.** Aktienindizes schließen an ca. 52–54 % der Tage im Plus (unsicher), EUR/USD und Rohstoffe etwa 50 %. Vergleiche deine Trefferquote mit „steigt immer“ und „wie gestern“, nicht mit 50 %.
3. **Eine Woche beweist nichts.** 12 Märkte × ca. 5 Tage = ca. 60 Prognosen; Standardfehler ca. ±6–7 Prozentpunkte, 95 %-Spanne ca. ±12–13. 58 % sind von Münzwurf nicht unterscheidbar. S&P 500, Nasdaq 100, Nvidia, Apple, Tesla sowie BTC/ETH sind stark korreliert, die echte Stichprobe ist kleiner. Für ±5 Punkte braucht man rund 400 unabhängige Prognosen.
4. **Ereignistage markieren.** An Fed-, EZB-, US-CPI- und Arbeitsmarkttagen sowie bei Quartalszahlen (Berichtssaison läuft; SAP und Tesla berichten typischerweise um den 20.–23. Oktober, Termine prüfen) keine starken Richtungswetten. Entscheidend ist die Überraschung, nicht die Nachricht.
5. **News nicht überschätzen.** Öffentliche Nachrichten sind meist binnen Minuten eingepreist. Wer sie Stunden später liest, hat keinen Vorsprung (unsicher, keine eigene Quelle in dieser Recherche).
6. **Regeln einfrieren.** Das Regelwerk vor der Testwoche festschreiben und nicht ändern. Die 200-Tage-Linie als Monats-Risikofilter verstehen, getrennt von der Kurzfristprognose.
7. **Langfristig:** CAPE nur für Renditeerwartungen nutzen (hoher US-CAPE → niedrigere Erwartung), höchstens kleine Allokations-Tilts. Zinskurve und Kreditspreads monatlich als Thermometer lesen. In Stressphasen kleinere Positionen. Nicht blind auf Anleihen als Absicherung vertrauen.
8. **Abschläge einrechnen.** Gelesene Backtests etwa halbieren, dann Spreads, Gebühren und Abgeltungsteuer (26,375 % inkl. Soli, ggf. Kirchensteuer; Sparerpauschbetrag 1.000 €) abziehen.

## Offene Fragen

- Folgte auf die Inversion 2022–2024 bis Oktober 2026 doch eine Rezession? Wie stehen CAPE, DAX-Bewertung, High-Yield-Spreads, Excess Bond Premium und Aktien-Anleihen-Korrelation aktuell?
- EUR/USD: Laut Meese/Rogoff (1983) ist der Zufallspfad kurzfristig kaum zu schlagen – in dieser Recherche nicht als Quelle geprüft.
- Krypto: Makrovariablen haben für BTC/ETH keine etablierte Prognosekraft; Momentum-Befunde (Liu/Tsyvinski 2021) betreffen Wochen, nicht Stunden – ungeprüft.
- Gold und Brent: Kurzfristig dominieren OPEC+, Geopolitik und Futures-Rollen; der Realzins als Gold-Treiber ist seit ca. 2022 instabil – ungeprüft.
- Fällt ein großer Teil der Aktienprämie an Makro-Ankündigungstagen an (Savor/Wilson 2013), und gilt das nach Veröffentlichung noch? Gilt der FOMC-Zyklus-Effekt (Cieslak u.a. 2019) nach 2016 noch?
- Wie gut übertragen sich US-Befunde auf DAX und Eurozone (Bund-Kurve, iTraxx, EZB)? Internationale CAPE-Studien (z.B. Keimling 2016) wären relevanter; zudem ist der DAX ein Performanceindex mit Dividenden.
- Gibt es robuste Out-of-sample-Studien zu Marktbreite und Indexkonzentration?

## Quellen

1. Welch & Goyal (2008), RFS – https://doi.org/10.1093/rfs/hhm014
2. Goyal, Welch & Zafirov (2024), RFS – https://doi.org/10.1093/rfs/hhae044
3. Goyal, Welch & Zafirov, SSRN – https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3929119
4. Campbell & Thompson (2008), RFS – https://doi.org/10.1093/rfs/hhm055
5. Rapach, Strauss & Zhou (2010), RFS – https://doi.org/10.1093/rfs/hhp063
6. Campbell & Shiller (1998), JPM – https://doi.org/10.3905/jpm.24.2.11
7. Shiller, Online Data – http://www.econ.yale.edu/~shiller/data.htm
8. Asness (2012), An Old Friend, AQR – https://www.aqr.com/Insights/Research/White-Papers/An-Old-Friend-The-Stock-Markets-Shiller-PE
9. Boudoukh, Richardson & Whitelaw (2008), RFS – https://doi.org/10.1093/rfs/hhl042
10. Asness, Ilmanen & Maloney (2017), Market Timing: Sin a Little – https://www.aqr.com/Insights/Research/Journal-Article/Market-Timing-Sin-a-Little
11. Asness (2003), Fight the Fed Model, JPM – https://doi.org/10.3905/jpm.2003.319916
12. NY Fed, Yield Curve as a Leading Indicator – https://www.newyorkfed.org/research/capital_markets/ycfaq.html
13. Estrella & Mishkin (1998), REStat – https://doi.org/10.1162/003465398557320
14. Engstrom & Sharpe (2019), FAJ – https://doi.org/10.1080/0015198X.2019.1625617
15. FRED T10Y3M – https://fred.stlouisfed.org/series/T10Y3M
16. Gilchrist & Zakrajšek (2012), AER – https://doi.org/10.1257/aer.102.4.1692
17. López-Salido, Stein & Zakrajšek (2017), QJE – https://doi.org/10.1093/qje/qjx014
18. Favara u.a. (2016), FEDS Notes – https://www.federalreserve.gov/econres/notes/feds-notes/updating-the-recession-risk-and-the-excess-bond-premium-20161006.html
19. Bernanke & Kuttner (2005), JF – https://doi.org/10.1111/j.1540-6261.2005.00760.x
20. Lucca & Moench (2015), JF – https://doi.org/10.1111/jofi.12196
21. Kurov, Wolfe & Gilbert (2021), FRL – https://doi.org/10.1016/j.frl.2020.101781
22. Brixton u.a. (2023), AQR – https://www.aqr.com/Insights/Research/Journal-Article/A-Changing-Stock-Bond-Correlation-Drivers-and-Implications
23. Campbell, Pflueger & Viceira (2020), JPE – https://doi.org/10.1086/707766
24. Fama & Schwert (1977), JFE – https://doi.org/10.1016/0304-405X(77)90014-9
25. Neville u.a. (2021), SSRN – https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3813202
26. Ang & Timmermann (2012), ARFE – https://doi.org/10.1146/annurev-financial-110311-101808
27. Moreira & Muir (2017), JF – https://doi.org/10.1111/jofi.12513
28. Cederburg u.a. (2020), JFE – https://doi.org/10.1016/j.jfineco.2020.04.015
29. Faber (2007), SSRN – https://papers.ssrn.com/sol3/papers.cfm?abstract_id=962461
30. Hurst, Ooi & Pedersen (2017), AQR – https://www.aqr.com/Insights/Research/Journal-Article/A-Century-of-Evidence-on-Trend-Following-Investing
31. Zakamulin (2014), JAM – https://doi.org/10.1057/jam.2014.25
32. Ang & Bekaert (2007), RFS – https://doi.org/10.1093/rfs/hhl021
33. Hjalmarsson (2010), JFQA – https://doi.org/10.1017/S0022109009990469
34. McLean & Pontiff (2016), JF – https://doi.org/10.1111/jofi.12365
35. Sullivan, Timmermann & White (1999), JF – https://doi.org/10.1111/0022-1082.00163
36. Bessembinder (2018), JFE – https://doi.org/10.1016/j.jfineco.2018.06.004
