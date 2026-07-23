# Historický UX audit před redesignem

> **Archivováno 22. 7. 2026.** Tento soubor popisoval starou verzi webu a není
> návodem pro aktuální implementaci. Na pozdější výslovný pokyn majitele byl
> vzhled vrácený k baseline `977343c`, takže scrollové hero, fonty a část
> kompozice jsou znovu aktuální. Bezpečnostní a obsahové závěry auditu však
> zůstaly implementované; přesný stav popisuje `HANDOFF.md`.

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

## Stav po modernizaci a vizuálním rollbacku

- Scrollové hero, ilustrovaný druhý hero a původní bento služeb jsou záměrně
  zpět. Porovnání používá na mobilu nativní klávesnicově ovladatelný range a
  běžný scroll stránky se nezachytává.
- Mobilní stránku zkracují pojmenované disclosure pro podpůrný obsah a služby;
  poptávka a telefon zůstávají ve spodní liště stále dostupné.
- Neověřené reference, statistiky, tým a citace jsou vypnuté a server je bez
  výslovného potvrzení pravosti nepublikuje.
- Formulář je přímý, validovaný a má telefonní i e-mailový fallback.
- Inter, Space Grotesk a Fragment Mono jsou kvůli požadovanému původnímu
  vzhledu znovu externě načítané. Animovaná média pod foldem se dál aktivují
  pouze v relevantním viewportu a respektují reduced motion.
- `/dev` používá serverovou session, přesné schema, upload validaci a ochranu
  proti přepsání novější publikace.

Původní detailní návrhy byly z archivu odstraněné, protože odkazovaly na již
neexistující rozvržení a při další práci by byly zavádějící. Historii změn lze
dohledat v Git historii tohoto souboru.
