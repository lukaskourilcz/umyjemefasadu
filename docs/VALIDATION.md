# Záznam auditu a validace

Datum: **22. 7. 2026**

Větev: `codex/revert-visual-design`

Tento dokument eviduje, co bylo skutečně zkontrolováno při kompletním auditu a
modernizaci. Neověřené obchodní skutečnosti nejsou vydávané za výsledek testu;
jejich owner checklist je v [`../NEEDED.md`](../NEEDED.md).

## Aktuální vizuální rollback

Dne 22. 7. 2026 byl na pokyn majitele veřejný vzhled vrácený k baseline
`977343c`. Nejde o `git revert` celé modernizace: podepsaná admin session,
serverová validace, kontaktní API, SSR/předrender, obsahové brány, lazy média,
focus management a testovací infrastruktura zůstaly zachované.

Vrácené vizuální prvky:

- plovoucí logo v původní poloze a s původní mírnou průsvitností;
- sticky scrollové hero před/po s původním titulkem a štítky;
- ilustrovaný druhý hero, „Proč čistit“, „Rizika“ a původní bento služeb;
- Inter, Space Grotesk a Fragment Mono;
- původní pořadí sekcí bez samostatného pásu `FieldWork`.

Historické neověřené zdravotní a obchodní sliby se nevrátily. Mobilní disclosure
byly stabilizované tak, aby se jejich obsah po hydrataci skutečně zobrazil a
lazy video se po otevření znovu aktivovalo.

## Rozsah

Audit zahrnul:

- veřejnou konverzní cestu, české copy, autentická média a responzivní chování;
- klávesnici, focus, formulářové stavy, reduced motion a automatizované WCAG
  kontroly;
- obsahové schema, `/dev`, login/session, uploady a GitHub publishing;
- kontaktní API a Resend integraci na úrovni kódu a testů;
- SEO metadata, robots, sitemap, LocalBusiness a FAQ strukturovaná data;
- requesty, bundle, LCP, CLS, TBT a velikost médií;
- všechny Markdown soubory v repozitáři včetně samostatné dokumentace
  `telegram-claude-bridge/`.

Samostatný senior UX agent provedl read-only audit před implementací a druhý
read-only code/content audit po ní. Jeho browser backend při druhé kontrole
nebyl dostupný, takže finální renderový verdikt výslovně vycházel z měření a
render poznámek předaných lead agentem; code, content, admin a a11y kontrola
byly nezávislé.

## Modernizace na `main` před rollbackem (historie)

- Dvojitý 200vh scroll-hijacking hero byl nahrazen jedním hero s okamžitým H1,
  CTA, telefonem, lokalitou a autentickým sliderem před/po.
- Neověřené veřejné reference, statistiky a tým jsou vypnuté. Publikace je
  odmítnutá, dokud nejsou data úplná a majitel nepotvrdí pravost a souhlas.
- Služby používají autentická média; proces má klidnou časovou osu a menší
  lazy aktivované médium; práce v terénu je samostatný důkazní pás.
- Mobilní cesta byla zkrácená přibližně z 11 579 px na 9 531 px při šířce
  390 px. Hero porovnání je na úzkém mobilu dostupné na jedno klepnutí a jeho
  fotografie se načtou až po otevření. Objednávkové kroky jsou vertikální, aby
  jejich pořadí nebylo skryté za dalším horizontálním gestem.
- Formulář má custom validaci, focus na první chybu, oznámení sending/success,
  přímé API odeslání a viditelný telefon/e-mail.
- Admin přešel z klientského/defaultního hesla na podepsanou serverovou session;
  uploady, struktura obsahu i souběžná publikace se validují serverově.
- Externí font requesty byly odstraněné. Velká animovaná WebP byla zmenšená a
  média pod foldem se načítají až poblíž viewportu.
- Veřejná stránka i publikovaný obsah jsou předrenderované do HTML při buildu;
  React stránku hydratuje a `/content.json` zůstává fallback.

## Automatické kontroly

Reprodukce:

```bash
npm ci
npm run format:check
npm run validate
npx playwright install chromium
npm run test:e2e
npm audit --omit=dev
```

Poslední běh aktuální rollback větve měl:

- ESLint: 0 warnings;
- Vitest: 11/11 unit, component a security testů zelených;
- TypeScript + klientský Vite build + SSR předrenderování: úspěch;
- Playwright: 10 testů zelených, dva záměrné desktop skipy mobilních scénářů;
- axe: žádný `serious` ani `critical` nález na testovaných projektech;
- produkční dependency audit: 0 známých zranitelností.

GitHub workflow používá `actions/checkout@v7` a `actions/setup-node@v7`; tím
nepoužívá deprecated Node 20 runtime samotných Actions. Testovaný projekt dál
záměrně běží na Node.js 20.19 podle produkční konfigurace.

Testované scénáře zahrnují:

- H1, hlavní CTA a absenci horizontálního overflow;
- mobilní menu, přesun focusu, Escape a návrat focusu;
- mobilní dostupnost a klávesnicové ovládání range porovnání před/po;
- formulářovou validaci a focus na chybné pole;
- přítomnost `noindex` na `/dev`;
- přesné obsahové schema a zákaz nebezpečných odkazů;
- MIME, příponu, base64 a magické bajty uploadu;
- podepsanou session a shodu originu/protokolu;
- zákaz publikace neověřených důkazních sekcí;
- zachování typu položky po vyprázdnění seznamu v adminu.

## Render a responzivita po rollbacku

Automatický E2E běh používá desktopový a mobilní projekt. Ručně byly při
implementaci posouzené zejména tyto reprezentativní stavy:

- **390 × 844:** plovoucí logo, hero fotografie, H1 a nativní range porovnání
  jsou bez horizontálního overflow; spodní CTA zůstává dostupné;
- **390 × 844, služby:** disclosure je po načtení zavřené, po otevření zobrazí
  původní bento a aktivuje poster i WebM až v relevantním viewportu;
- **1440 × 1000:** H1 i nejdelší řádek zůstávají v hranicích 1440px viewportu,
  dokument má `scrollWidth === innerWidth`;
- **`/dev`:** login obrazovka je konzistentní s redesignem. Plný autentizovaný
  dashboard potřebuje po nastavení produkčních secrets ještě reálný mobilní
  smoke test.

Design systém vyžaduje kontrolu i na 320, 360, 1024, 1280 a 1920 px, v
844 × 390 landscape a při 200% zoomu pro každou budoucí zásadní UI změnu.

## Lighthouse a výkon — historické měření před rollbackem

Baseline před modernizací:

| Profil  | Performance | Accessibility | Best Practices | SEO |   LCP |   CLS |    TBT |
| ------- | ----------: | ------------: | -------------: | --: | ----: | ----: | -----: |
| Mobile  |          49 |            96 |            100 |   0 | 5,8 s | 0,879 | 220 ms |
| Desktop |          97 |            96 |            100 |   0 | 1,3 s | 0,001 |      — |

Finální produkční preview měření modernizovaného hero před vizuálním rollbackem:

| Profil         | Performance | Accessibility | Best Practices | SEO |    LCP |      CLS |    TBT |  Přenos | Requesty |
| -------------- | ----------: | ------------: | -------------: | --: | -----: | -------: | -----: | ------: | -------: |
| Mobile, medián |          97 |           100 |            100 | 100 | 1,74 s |        0 | 178 ms | 115 KiB |        6 |
| Desktop        |         100 |           100 |            100 | 100 | 0,59 s | 0,000006 |   0 ms | 969 KiB |       12 |

Mobilní hodnoty jsou medián tří samostatných Lighthouse běhů stejného
produkčního buildu. Jednotlivé výsledky byly Performance 94/99/97, LCP
1,81/1,74/1,71 s a TBT 243/14/178 ms. Interní cíl LCP ≤ 2,5 s je splněný.
Tyto hodnoty se po návratu scrollového hero nesmějí prezentovat jako aktuální
výkon. Současná verze přednačítá oba obrazy před/po i na mobilu a znovu používá
externí font request. Před produkčním nasazením je nutné Lighthouse zopakovat.

Největší animovaná média po optimalizaci:

- `tlakove-myti-postup.webp`: přibližně 1,7 MB;
- `tlakove-myti-akce.webp`: přibližně 1,6 MB.

Obě jsou pod foldem, mají rezervovaný poměr stran, aktivují source až poblíž
viewportu a při reduced motion používají statický stav.

## Bezpečnostní kontrola

Ověřeno v kódu a testech:

- žádné veřejné nebo výchozí admin heslo;
- fail-closed chování bez `ADMIN_PASSWORD`/`ADMIN_SESSION_SECRET`;
- 8hodinová podepsaná `HttpOnly`, `SameSite=Strict`, produkčně `Secure` session;
- same-origin kontrola mutací;
- limity těla, počtu i součtu souborů;
- allowlist media cest a typů, kontrola signatury;
- přesné schema bez neznámých polí a nebezpečných URL;
- ochrana proti tichému přepsání novějšího Git head;
- honeypot, čištění řídicích znaků, limity délek a timeout u kontaktu;
- bezpečnostní hlavičky, `noindex` a `no-store` pro `/dev`.

Best-effort rate limit žije v paměti jedné serverless instance. Trvalý
distribuovaný limiter/WAF je provozní doporučení, ne falešně deklarovaná hotová
ochrana; viz `NEEDED.md`.

## Otevřené externí závislosti

Repozitář nemůže sám potvrdit DNS, Vercel secrets, GitHub token, Resend doménu,
reálné doručení e-mailu, právní text ani obchodní fakta. Tyto body jsou
blokující pro ostrý provoz a jsou rozepsané v [`../NEEDED.md`](../NEEDED.md).

## Integrace a deployment

- [PR #26](https://github.com/lukaskourilcz/umyjemefasadu/pull/26) byl 22. 7.
  2026 sloučen do `main` merge commitem `a88f8a9`.
- GitHub workflow `Quality` prošlo na PR i následném pushi merge commitu do
  `main`. Druhý běh používá `actions/checkout@v7` a `actions/setup-node@v7`
  bez deprecated runtime anotace.
- Vercel deployment merge commitu dokončil build úspěšně, ale GitHub Deployment
  API ho eviduje jako prostředí **Preview**, nikoli Production.
- Preview URL vrátila HTTP 200, předrenderovaný H1, vložený obsah a správné
  bezpečnostní hlavičky; `/dev` vrátil HTTP 200 s `noindex`, `no-store` a
  `X-Robots-Tag`.
- `https://www.umyjemefasadu.cz/` při kontrole stále vracelo původní Webnode
  web a `/dev` HTTP 404. Ostrý DNS cutover proto není vydáván za dokončený;
  přesný owner krok je v `NEEDED.md`.
