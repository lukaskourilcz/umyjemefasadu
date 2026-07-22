# Záznam auditu a validace

Datum: **22. 7. 2026**

Větev: `codex/full-site-modernization`

Tento dokument eviduje, co bylo skutečně zkontrolováno při kompletním auditu a
modernizaci. Neověřené obchodní skutečnosti nejsou vydávané za výsledek testu;
jejich owner checklist je v [`../NEEDED.md`](../NEEDED.md).

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

## Hlavní změny oproti baseline

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

Poslední úplný běh před finálním commitem musí mít:

- ESLint: 0 warnings;
- Vitest: 11/11 unit, component a security testů zelených;
- TypeScript + klientský Vite build + SSR předrenderování: úspěch;
- Playwright: 10 testů zelených, dva záměrné desktop skipy mobilních scénářů;
- axe: žádný `serious` ani `critical` nález na testovaných projektech;
- produkční dependency audit: 0 známých zranitelností.

Testované scénáře zahrnují:

- H1, hlavní CTA, telefon a absenci horizontálního overflow;
- mobilní menu, přesun focusu, Escape a návrat focusu;
- mobilní otevření porovnání před/po a dostupnost range ovládání;
- formulářovou validaci a focus na chybné pole;
- přítomnost `noindex` na `/dev`;
- přesné obsahové schema a zákaz nebezpečných odkazů;
- MIME, příponu, base64 a magické bajty uploadu;
- podepsanou session a shodu originu/protokolu;
- zákaz publikace neověřených důkazních sekcí;
- zachování typu položky po vyprázdnění seznamu v adminu.

## Render a responzivita

Automatický E2E běh používá desktopový a mobilní projekt. Ručně byly při
implementaci posouzené zejména tyto reprezentativní stavy:

- **390 × 844:** nabídka, CTA, telefon, lokalita a tlačítko porovnání jsou v
  prvním viewportu; logo má horní mezeru a nemění velikost při skrolování;
- **768 × 1024:** bez vodorovného overflow a bez kolizí hero/navigace;
- **1440 × 900:** textový blok přibližně x 144–623 a porovnání x 686–1296;
  kompozice je vyvážená;
- **`/dev`:** login obrazovka je konzistentní s redesignem. Plný autentizovaný
  dashboard potřebuje po nastavení produkčních secrets ještě reálný mobilní
  smoke test.

Design systém vyžaduje kontrolu i na 320, 360, 1024, 1280 a 1920 px, v
844 × 390 landscape a při 200% zoomu pro každou budoucí zásadní UI změnu.

## Lighthouse a výkon

Baseline před modernizací:

| Profil  | Performance | Accessibility | Best Practices | SEO |   LCP |   CLS |    TBT |
| ------- | ----------: | ------------: | -------------: | --: | ----: | ----: | -----: |
| Mobile  |          49 |            96 |            100 |   0 | 5,8 s | 0,879 | 220 ms |
| Desktop |          97 |            96 |            100 |   0 | 1,3 s | 0,001 |      — |

Finální produkční preview měření:

| Profil         | Performance | Accessibility | Best Practices | SEO |    LCP |      CLS |    TBT |  Přenos | Requesty |
| -------------- | ----------: | ------------: | -------------: | --: | -----: | -------: | -----: | ------: | -------: |
| Mobile, medián |          97 |           100 |            100 | 100 | 1,74 s |        0 | 178 ms | 115 KiB |        6 |
| Desktop        |         100 |           100 |            100 | 100 | 0,59 s | 0,000006 |   0 ms | 969 KiB |       12 |

Mobilní hodnoty jsou medián tří samostatných Lighthouse běhů stejného
produkčního buildu. Jednotlivé výsledky byly Performance 94/99/97, LCP
1,81/1,74/1,71 s a TBT 243/14/178 ms. Interní cíl LCP ≤ 2,5 s je splněný.
Desktopové porovnání před/po se načítá ihned; na úzkém mobilu je dostupné přes
pojmenované disclosure a oba obrazy se stáhnou až po jeho otevření. Proto se
liší přenesená data mezi profily.

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
