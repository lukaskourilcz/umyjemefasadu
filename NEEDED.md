# K dořešení před ostrým provozem

Tento soubor je jediný seznam skutečností, které nelze bezpečně rozhodnout jen
z repozitáře. `[owner:me]` znamená rozhodnutí, údaj nebo externí nastavení od
majitele. `[owner:ai]` znamená technický úkol v repozitáři. Důležitost je
`[imp:1–5]`, kde 5 je blokující.

Nevyřešený bod se nesmí na webu nahradit domněnkou. Neověřená sekce zůstane
skrytá.

## Nutné před produkčním publikováním

- [ ] **Nastavit a bezpečně uložit produkční secrets** — bez nich se nelze
      přihlásit do `/dev`, publikovat ani odeslat formulář. Nastavit
      `ADMIN_PASSWORD`, náhodný `ADMIN_SESSION_SECRET` (nejméně 32 znaků),
      `GITHUB_TOKEN`, `GITHUB_REPO`, `RESEND_API_KEY`, `CONTACT_EMAIL` a
      `CONTACT_FROM`; po nastavení spustit nový deployment. `[imp:5]` `[owner:me]`
- [ ] **Ověřit celý produkční publish flow** — přihlášení do `/dev`, změna
      testovacího textu, commit do správné `GITHUB_BRANCH`, Vercel deployment a
      bezpečné vrácení testovací změny. `[imp:5]` `[owner:me]`
- [ ] **Ověřit doručení kontaktního formuláře** — v Resendu ověřit odesílací
      doménu, nastavit `CONTACT_FROM`, poslat reálnou testovací poptávku a potvrdit,
      že dorazí na `CONTACT_EMAIL` i mimo spam. `[imp:5]` `[owner:me]`
- [ ] **Ověřit produkční doménu a DNS** — `umyjemefasadu.cz` i
      `www.umyjemefasadu.cz` musí směřovat na aktuální Vercel projekt, mít HTTPS a
      jednu kanonickou variantu. Poté zkontrolovat canonical, Open Graph, sitemap a
      formulář přímo na ostré doméně. Kontrola 22. 7. 2026 zjistila, že `www`
      stále obsluhuje Webnode a `/dev` vrací 404. Vercel deployment merge commitu
      je úspěšný, ale v GitHubu vedený jako **Preview**; nejdřív nastavte ve Vercelu
      produkční větev `main`, přiřaďte doménu a upravte DNS. `[imp:5]` `[owner:me]`
- [ ] **Právně schválit ochranu osobních údajů** — potvrdit správce údajů,
      účel, právní titul, příjemce Resend, dobu uchování a kontaktní údaje. Aktuální
      text je věcný technický základ, ne právní stanovisko. `[imp:5]` `[owner:me]`

## Obchodní údaje k potvrzení

- [ ] **Potvrdit ceny, jednotky a DPH** — projít každý řádek ceníku v `/dev`,
      ověřit, zda jsou částky „od“, zda jsou s/bez DPH a co ovlivňuje výslednou cenu.
      Do potvrzení jsou uvedené jako orientační. `[imp:5]` `[owner:me]`
- [ ] **Potvrdit rozsah oblasti působení** — web používá Hodonín a aktuální
      oblasti z kontaktní sekce. Neuvádět dojezd v kilometrech ani další kraje bez
      provozního potvrzení. `[imp:4]` `[owner:me]`
- [ ] **Rozhodnout, zda je prohlídka a nabídka bezplatná** — aktuální veřejný
      web bezplatnost neslibuje. Pokud se má tvrzení vrátit do CTA nebo textu,
      musí platit pro všechny relevantní poptávky. `[imp:4]` `[owner:me]`
- [ ] **Potvrdit technické formulace** — schválit veřejné texty o regulovaném
      tlaku, volbě trysek, přípravcích a impregnaci. Záruky, konkrétní životnost,
      pojištění, rychlost odezvy a ekologické certifikace se nesmí přidat bez
      ověřitelného podkladu. `[imp:4]` `[owner:me]`
- [ ] **Potvrdit provozní kontakty** — název, sídlo a IČO dodal majitel; před
      spuštěním ještě ověřit telefon, e-mail a provozní dobu. `[imp:4]`
      `[owner:me]`

## Obsah čekající na autentické podklady

- [ ] **Doplnit ověřené reference a realizace** — dodat skutečné názvy/lokality,
      rozsah, stejné páry fotografií před/po a souhlas s publikací. Sekce
      `references` je do té doby vypnutá. `[imp:3]` `[owner:me]`
- [ ] **Doplnit reálná čísla za sezónu** — statistiky nezapínat bez doložených
      hodnot a období. Sekce `stats` je vypnutá. `[imp:2]` `[owner:me]`
- [ ] **Doplnit tým** — skutečná fotografie, jména, role a souhlas členů. Sekce
      `team` je vypnutá. `[imp:2]` `[owner:me]`
- [ ] **Doplnit zákaznické citace** — použít pouze ověřené citace se souhlasem a
      přiměřenou identifikací. `quotesVisible` zůstává vypnuté. `[imp:2]`
      `[owner:me]`
- [ ] **Potvrdit text služby čištění dlažby** — dřívější požadavek odkazoval na
      „žlutě označený text“, ale barevný zdroj nebyl dostupný. Přesné znění lze
      upravit v `/dev` → Služby. `[imp:2]` `[owner:me]`

## Doporučené provozní posílení

- [ ] **Přidat trvalý distribuovaný rate limit** — současná ochrana přihlášení a
      formuláře je best-effort limit v paměti jedné serverless instance. Pro vyšší
      provoz nebo opakovaný abuse použít externí store/WAF. `[imp:3]` `[owner:me]`
- [ ] **Nastavit monitoring formuláře a deploymentů** — upozornění na chyby
      Resendu, neúspěšné Vercel buildy a opakované 4xx/5xx usnadní rychlou reakci.
      `[imp:2]` `[owner:me]`

## Dokončeno v repozitáři

- [x] Na výslovný pokyn majitele vrátit veřejný vizuál k baseline `977343c`:
      scrollové porovnání, ilustrovaný druhý hero, edukační sekce, původní
      typografii a bento služeb. Funkční modernizace zůstala zachovaná.
      `[owner:ai]`
- [x] Při návratu vizuálu neobnovit neověřené zdravotní, životnostní, časové
      ani bezplatné přísliby. Reference, statistiky, tým a citace zůstávají
      vypnuté do doložení. `[owner:ai]`
- [x] Zachovat mobilní zkrácení pomocí pojmenovaných disclosure, klávesnicové
      ovládání porovnání, focus management navigace, validaci formuláře a
      reduced-motion stavy; opravit neviditelný obsah disclosure po hydrataci.
      `[owner:ai]`
- [x] Zabezpečit `/dev` serverovou session, same-origin kontrolou, validací
      schématu, uploadů a souběžných publikací. `[owner:ai]`
- [x] Zachovat optimalizaci a lazy aktivaci médií, vložení obsahu do prvního
      HTML, robots, sitemap a strukturovaná data. Původní Inter, Space Grotesk a
      Fragment Mono jsou kvůli požadovanému vizuálu znovu externě načítané.
      `[owner:ai]`
- [x] Přidat lint, unit/security/component testy, Playwright, axe, build gate a
      CI. `[owner:ai]`
- [x] Sladit README, administrátorský návod, design systém, validační záznam a
      agentní instrukce se skutečnou implementací. `[owner:ai]`
- [x] Pushnout auditní větev, nechat projít GitHub CI a Vercel preview a sloučit
      PR #26 do `main` merge commitem `a88f8a9`. `[owner:ai]`
