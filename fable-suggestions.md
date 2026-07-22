# Historický UX audit před redesignem

> **Archivováno 22. 7. 2026.** Tento soubor popisoval starou verzi webu a není
> návodem pro aktuální implementaci. Původní komponenty, line numbers, fonty,
> scrollovací hero a placeholdery už neodpovídají repozitáři.

Aktuální zdroje pravdy:

- [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) — vizuální, responzivní,
  obsahová a accessibility pravidla;
- [`docs/VALIDATION.md`](docs/VALIDATION.md) — audit, měření a testy provedené
  po redesignu;
- [`NEEDED.md`](NEEDED.md) — pouze skutečně otevřené owner úkoly;
- [`docs/ADMINISTRACE.md`](docs/ADMINISTRACE.md) — aktuální `/dev`, security a
  publishing workflow.

## Co původní audit odhalil

Starší web měl několik opakujících se problémů:

1. dvě hero sekce a scroll hijacking odsouvaly nabídku i CTA;
2. téměř každá sekce používala stejný card-grid, pastelový gradient a
   nadbytečné reveal animace;
3. veřejně se mohly objevit placeholdery, falešné statistiky a nespárované
   fotografie před/po;
4. mobilní uživatel procházel dlouhou stránku a těžká autoplay média ještě před
   hlavním sdělením;
5. kontakt byl slabý a chyběla přímá formulářová cesta;
6. typografie, logo, favicon, právní údaje a admin neodpovídaly profesionální
   službě ani bezpečnému provozu.

## Stav po modernizaci

- Jeden conversion-first hero nyní obsahuje H1, stručnou nabídku, telefon,
  lokalitu a autentický, klávesnicí ovladatelný slider před/po; na úzkém mobilu
  je porovnání dostupné přes jasně pojmenované tlačítko.
- Služby, postup, terénní důkaz, ceník, objednání, FAQ a kontakt mají odlišnou,
  ale jednotnou informační hierarchii.
- Mobilní stránka je kratší; sekvenční postup objednání je znovu vertikální a
  zásadní obchodní informace nejsou schované v disclosure.
- Neověřené reference, statistiky, tým a citace jsou vypnuté a server je bez
  výslovného potvrzení pravosti nepublikuje.
- Formulář je přímý, validovaný a má telefonní i e-mailový fallback.
- Externí fonty a zbytečné prvotní media requesty byly odstraněné; animovaná
  média pod foldem se aktivují až poblíž viewportu a respektují reduced motion.
- `/dev` používá serverovou session, přesné schema, upload validaci a ochranu
  proti přepsání novější publikace.

Původní detailní návrhy byly z archivu odstraněné, protože odkazovaly na již
neexistující rozvržení a při další práci by byly zavádějící. Historii změn lze
dohledat v Git historii tohoto souboru.
