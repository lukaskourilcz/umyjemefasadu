# Předání po návratu původního vizuálu

Aktualizováno: **22. 7. 2026**

Pracovní větev: `codex/revert-visual-design`

Větev vychází z `main` na commitu `56f3dca`. Uživatel následně požádal
vrátit design k poslední verzi před změnami z 22. 7. 2026, tedy k vizuálnímu
baseline `977343c`, ale zachovat nové funkce a zabezpečení.

Tento soubor je výchozí bod pro dalšího agenta. Než začne měnit kód, musí si
přečíst také [`AGENTS.md`](AGENTS.md), [`CLAUDE.md`](CLAUDE.md),
[`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) a [`NEEDED.md`](NEEDED.md).

## Stav implementace

Veřejná vizuální vrstva byla vrácená, zatímco modernizované funkční vrstvy
zůstaly zachované. Aktuálně platí:

- původní scrollové hero s autentickým porovnáním, výrazným titulkem a
  štítky před/po je zpět; na mobilu porovnání ovládá klávesnicově dostupný
  nativní range;
- za hero znovu následuje ilustrovaná nabídka, trust strip, „Proč čistit“,
  „Rizika“, původní bento služeb a původní pořadí dalších sekcí;
- plovoucí logo se při scrollu nezmenšuje, pouze se vrací jeho původní poloha a
  mírná průsvitnost;
- mobilní podpůrné bloky používají původní disclosure. Je opravená hydratační
  chyba, kvůli které se rozbalený obsah mohl stát neviditelný; video služby se
  po otevření znovu lazy aktivuje;
- neověřené zdravotní, časové a životnostní sliby z historického copy se
  nevrátily. Sekce používají věcný text a reference/statistiky/tým zůstávají
  vypnuté;
- zabezpečená administrace bez klientského nebo výchozího hesla, s podepsanou
  session, validací uploadů, konceptem, zálohou a ochranou proti přepsání
  novější GitHub publikace;
- serverová validace, která nedovolí zveřejnit neúplné nebo nepotvrzené
  reference, statistiky, tým, citace ani záruku;
- přímý kontaktní endpoint přes Resend, honeypot, validace, timeout a
  best-effort rate limit;
- předrenderované veřejné HTML, hydratace Reactu, dynamický admin, odložená
  média a synchronní LocalBusiness/FAQ strukturovaná data;
- lint, unit/component/security testy, Playwright, axe, CI a dokumentovaný
  design systém.

Samostatný pás `FieldWork` zůstává v kódu a administraci, ale není součástí
vrácené veřejné kompozice, stejně jako nebyl v baseline `977343c`.

Historické logické commity modernizace:

- `15bd5fe` — design systém a agentní instrukce;
- `9b50f98` — veřejná konverzní cesta;
- `c1e0b21` — zabezpečení a modernizace administrace;
- `e550d31` — výkon, média a přístupnost;
- `b3f7712` — automatické quality gates;
- `343f975` — finální auditní opravy, SSR, mobilní disclosure a bezpečnostní
  publikační brány;
- `9fd464f` — ověřený dokumentační handoff;
- `29d92f8` — GitHub Actions v7 bez deprecated runtime warningu.

## Historie modernizace

Výše uvedené commity `15bd5fe` až `29d92f8` a merge PR #26 zůstávají v
historii. Bezpečnostní, admin, SSR, API, testovací a validační části z nich jsou
nadále aktivní. Veřejná komponentová kompozice a typografie jsou nyní vědomě
vrácené k `977343c`.

## Poslední ověřené výsledky

Podrobný záznam je v [`docs/VALIDATION.md`](docs/VALIDATION.md). Na aktuální
větvi po rollbacku prošlo:

- `npm run validate`: lint bez warnings, 11/11 Vitest testů a klientský +
  SSR build s předrenderováním;
- `npm run test:e2e`: 10 scénářů zelených a dva záměrné desktop skipy
  mobilních scénářů;
- axe: žádný serious ani critical nález;
- lokální vizuální kontrola 1440 × 1000 a 390 × 844 bez horizontálního
  overflow; mobilní disclosure i lazy video byly ověřené po otevření.

Staré Lighthouse výsledky redesignu (97 mobil / 100 desktop) už po návratu
scrollového hero nelze vydávat za aktuální. Před produkčním deploymentem je
potřeba měření zopakovat.

## Stav integrace a hostingu

- `main` na `56f3dca` obsahuje sloučenou modernizaci a její dokumentační
  doplnění.
- Vizuální rollback je zatím pouze na pracovní větvi a nebyl v tomto handoffu
  vydáván za nasazený.
- Poslední ověřený Vercel build modernizace byl Preview. K 22. 7. 2026 doména
  `www.umyjemefasadu.cz` stále odpovídala z Webnode a `/dev` vracelo 404.

## Co ještě zbývá

Repozitář neobsahuje produkční secrets ani přístup k provozním účtům. Následující
kroky proto musí dokončit majitel nebo agent s výslovným oprávněním a potřebnými
přístupy:

1. projít celý owner checklist v [`NEEDED.md`](NEEDED.md), zejména ceny a DPH,
   oblast působení, kontakty, technická tvrzení a právní text;
2. nastavit Vercel secrets, ověřit Resend doménu a odeslat reálnou testovací
   poptávku;
3. po schválení otevřít PR a sloučit rollback větev do `main`; teprve potom
   ověřit nový Vercel deployment;
4. provést autentizovaný desktopový i mobilní smoke test celého `/dev`, včetně
   uploadu, zálohy, preview a bezpečného publish flow;
5. ve Vercelu nastavit produkční větev na `main`, přiřadit vlastní doménu,
   upravit DNS mimo Webnode a znovu ověřit canonical, `/dev` i formulář;
6. potvrdit, že `GITHUB_BRANCH=main`, aby publikace z administrace vytvářela
   commity ve stejné větvi, ze které Vercel nasazuje produkci.

Neověřené reference, statistiky, tým a citace musí zůstat vypnuté. Dočasná
distribuovaná ochrana proti abuse a monitoring jsou dále vedené v `NEEDED.md`;
nelze je označit za hotové jen na základě lokálního buildu.

## Rychlá orientace

- produkt a příkazy: [`README.md`](README.md);
- pravidla značky a UI: [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md);
- práce s `/dev`: [`docs/ADMINISTRACE.md`](docs/ADMINISTRACE.md);
- výsledky auditu a testů: [`docs/VALIDATION.md`](docs/VALIDATION.md);
- owner a externí blokery: [`NEEDED.md`](NEEDED.md);
- historický pre-redesign audit: [`fable-suggestions.md`](fable-suggestions.md).

`telegram-claude-bridge/` je samostatný pomocný projekt a není součástí webového
buildu ani Vercel deploymentu.
