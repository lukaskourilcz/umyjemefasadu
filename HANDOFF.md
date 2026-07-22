# Předání modernizace webu

Aktualizováno: **22. 7. 2026**

Výchozí větev: `main`

Modernizace byla sloučená přes [PR #26](https://github.com/lukaskourilcz/umyjemefasadu/pull/26)
do `main` merge commitem `a88f8a9` dne 22. 7. 2026.

Tento soubor je výchozí bod pro dalšího agenta. Než začne měnit kód, musí si
přečíst také [`AGENTS.md`](AGENTS.md), [`CLAUDE.md`](CLAUDE.md),
[`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) a [`NEEDED.md`](NEEDED.md).

## Stav implementace

Kompletní audit a redesign veřejného webu i `/dev` je implementovaný na pracovní
větvi. Mezi hlavní dokončené části patří:

- jeden conversion-first hero bez scroll hijackingu, s telefonem, lokalitou a
  autentickým porovnáním před/po;
- mobilní porovnání dostupné přes pojmenované disclosure, které fotografie
  načte až po otevření;
- přepracované služby, postup, terénní média, ceník, objednávková cesta, FAQ,
  kontakt, patička a mobilní CTA;
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

Dosavadní logické commity této větve:

- `15bd5fe` — design systém a agentní instrukce;
- `9b50f98` — veřejná konverzní cesta;
- `c1e0b21` — zabezpečení a modernizace administrace;
- `e550d31` — výkon, média a přístupnost;
- `b3f7712` — automatické quality gates;
- `343f975` — finální auditní opravy, SSR, mobilní disclosure a bezpečnostní
  publikační brány;
- `9fd464f` — ověřený dokumentační handoff;
- `29d92f8` — GitHub Actions v7 bez deprecated runtime warningu.

## Poslední ověřené výsledky

Podrobný a reprodukovatelný záznam je v
[`docs/VALIDATION.md`](docs/VALIDATION.md). Poslední lokální produkční preview
mělo:

- mobilní Lighthouse medián: Performance 97, Accessibility 100, Best Practices
  100, SEO 100, LCP 1,74 s, CLS 0, 6 requestů a přibližně 115 KiB;
- desktop Lighthouse: 100/100/100/100, LCP 0,59 s;
- čistou hydrataci bez console warning/error;
- LocalBusiness a FAQPage JSON-LD odvozené ze stejného obsahu jako stránka;
- mobilní šířku bez overflow a výšku přibližně 9 531 px při 390 × 844.

Před předáním byly spuštěné `npm run format:check`, `npm run validate`,
`npm run test:e2e` a `npm audit --omit=dev`. Pokud následný commit změní kód,
musí agent spustit stejnou sadu znovu a skutečný výsledek zapsat do
`docs/VALIDATION.md`.

## Stav integrace a hostingu

- PR #26 je sloučený a GitHub workflow `Quality` pro merge commit prošlo.
- Vercel vytvořil úspěšný deployment, GitHub ho však označuje jako prostředí
  **Preview**, nikoli Production.
- Ověřený preview build je dostupný na adrese
  `https://umyjemefasadu-jzr804mc2-lukas-kourils-projects.vercel.app`.
- K 22. 7. 2026 doména `www.umyjemefasadu.cz` stále odpovídá ze serveru
  **Webnode** a `/dev` na ní vrací 404. Modernizace tedy ještě není na vlastní
  doméně veřejně aktivní.

## Co ještě zbývá

Repozitář neobsahuje produkční secrets ani přístup k provozním účtům. Následující
kroky proto musí dokončit majitel nebo agent s výslovným oprávněním a potřebnými
přístupy:

1. projít celý owner checklist v [`NEEDED.md`](NEEDED.md), zejména ceny a DPH,
   oblast působení, kontakty, technická tvrzení a právní text;
2. nastavit Vercel secrets, ověřit Resend doménu a odeslat reálnou testovací
   poptávku;
3. provést autentizovaný desktopový i mobilní smoke test celého `/dev`, včetně
   uploadu, zálohy, preview a bezpečného publish flow;
4. ve Vercelu nastavit produkční větev na `main`, přiřadit vlastní doménu,
   upravit DNS mimo Webnode a znovu ověřit canonical, `/dev` i formulář;
5. potvrdit, že `GITHUB_BRANCH=main`, aby publikace z administrace vytvářela
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
