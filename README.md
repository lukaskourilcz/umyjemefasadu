# Umyjeme Fasádu

Produkční lead-generation web společnosti **UMYJEME FASÁDU s.r.o.** pro
profesionální čištění fasád, střech, dlažby a dalších venkovních povrchů.
Hlavním cílem webu je přivést návštěvníka k nezávazné prohlídce nebo telefonu
a přitom působit věcně, důvěryhodně a lokálně.

## Aktuální řešení

- Úvod okamžitě vysvětluje nabídku, ukazuje autentické porovnání před/po a
  nabízí poptávku i telefon bez vynuceného skrolování.
- Veřejná stránka používá pouze skutečná lokální média. Neověřené reference,
  statistiky a tým jsou připravené v obsahu, ale zůstávají vypnuté.
- Mobilní verze zachovává všechny důležité informace, zkracuje dlouhé seznamy
  pomocí zřetelných horizontálních kolekcí a velké hero porovnání zpřístupní na
  jedno klepnutí bez počátečního stahování obou fotografií.
- Kontaktní formulář odesílá poptávku přes serverovou funkci a Resend.
- Správa textů a médií je dostupná na `/dev`; publikace vytvoří bezpečný commit
  do GitHubu a následný Vercel deployment.
- Veřejný obsah, admin i API mají automatické lint, unit, E2E a accessibility
  kontroly. Naměřené výsledky jsou v [`docs/VALIDATION.md`](docs/VALIDATION.md).

Designová a obsahová pravidla jsou v
[`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md). Neověřené obchodní údaje a
externí kroky jsou vedené v [`NEEDED.md`](NEEDED.md). Aktuální stav pracovní
větve a přesné pokračování pro dalšího agenta shrnuje
[`HANDOFF.md`](HANDOFF.md).

## Technologie

- Vite 6, React 18 a strict TypeScript
- Tailwind CSS v4 a sémantické tokeny v `src/index.css`
- systémové sans-serif a monospace fonty bez externího font requestu
- Vercel serverless funkce v `api/`
- Vitest, Testing Library, Playwright a axe
- ESLint, Prettier a GitHub Actions

## Architektura

```text
api/
  admin/                 přihlášení, ověření session a odhlášení
  contact.js             přímé odeslání poptávky přes Resend
  save.js                validovaná publikace obsahu do GitHubu
src/
  admin/                 lazy-loaded editor na /dev
  components/            sekce veřejného webu
  content/               typy, defaulty, loader a ContentContext
  hooks/                 sdílené UI a media hooky
public/
  content.json           publikovaný editovatelný obsah
  media/                 autentické fotografie, videa a animované WebP
tests/
  e2e/                   konverzní, responzivní a a11y scénáře
docs/
  ADMINISTRACE.md        návod pro majitele a správce
  DESIGN_SYSTEM.md       závazná vizuální pravidla
  VALIDATION.md          reprodukovatelný záznam auditu a měření
```

Build veřejnou stránku předrenderuje do hotového HTML a vloží do ní také
`public/content.json`. Nadpis, nabídka i hero jsou proto dostupné bez čekání na
JavaScript nebo další JSON request; React následně HTML hydratuje. Síťové
načtení `/content.json` zůstává pouze jako fallback. `/dev` předrenderovaný
obsah odstraní a admin načte dynamickým importem, takže nezvětšuje hlavní
veřejný bundle.

### Veřejná cesta

Pořadí hlavních částí je: navigace → nabídka a porovnání před/po → ověřené body
důvěry → služby → postup → práce v terénu → proč my → ceník → objednání → FAQ →
kontakt → patička. Volitelné sekce `stats`, `team` a `references` se vykreslí jen
při `visible: true` a po doplnění skutečných údajů.

## Lokální vývoj

Používejte Node.js 20; CI běží na 20.19.

```bash
npm ci
npm run dev
```

Samotný Vite server obslouží veřejné UI a statický náhled `/dev`, nikoli Vercel
serverless API. Přihlášení, publikaci a skutečné odeslání formuláře testujte v
prostředí Vercel se správně nastavenými proměnnými.

### Kontrolní příkazy

```bash
npm run check:types     # TypeScript bez emitování
npm run lint            # ESLint, nulová tolerance warnings
npm run format:check    # kontrola Prettier formátu
npm test                # Vitest unit/component/security testy
npm run test:coverage   # Vitest s coverage
npm run build           # typy + klientský/SSR build + předrenderování HTML
npm run test:e2e        # Playwright + axe, vyžaduje Chromium
npm run validate        # lint + unit testy + build
npm run preview         # náhled posledního buildu
```

Před prvním E2E během nainstalujte prohlížeč:

```bash
npx playwright install chromium
```

CI na pull requestu a na `main` spouští lint, unit testy, build a E2E.

## Obsah a administrace

Administrace na `/dev` nemá žádné výchozí heslo. Bez serverových secrets selže
uzavřeně. Přihlašovací session je podepsaná, `HttpOnly`, `SameSite=Strict` a v
produkci `Secure`. Podrobný postup, limity médií, recovery a přesný seznam
proměnných jsou v [`docs/ADMINISTRACE.md`](docs/ADMINISTRACE.md).

Povinné pro publikování:

- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET` — náhodná hodnota dlouhá alespoň 32 znaků
- `GITHUB_TOKEN`
- `GITHUB_REPO`
- volitelně `GITHUB_BRANCH` — výchozí `main`

Povinné pro kontaktní formulář:

- `RESEND_API_KEY`
- doporučeně `CONTACT_EMAIL` a `CONTACT_FROM`

Hodnoty patří pouze do Vercel Environment Variables nebo lokálního necommitovaného
souboru. Nikdy je nevkládejte do klientského kódu ani dokumentace.

## Média a značka

- Plné logo s postavou se používá jako stabilně velký plovoucí prvek navigace a
  jako značka v patičce.
- Navigace používá optimalizovaný průhledný WebP; logo se při skrolování
  nezmenšuje.
- Hero fotografie jsou optimalizované WebP, přednačtené z HTML a nejsou lazy.
- Větší animovaná média pod prvním viewportem se aktivují až poblíž viewportu a
  při `prefers-reduced-motion` se zobrazí statický snímek.
- Nové JPG/PNG fotografie admin před uploadem převede na WebP a omezí delší
  stranu na 1920 px.

## Produkce

Projekt je určený pro Vercel. Produkční větev musí odpovídat `GITHUB_BRANCH`,
protože každý publish z `/dev` vytvoří na této větvi nový commit. Vercel pak musí
mít automatické nasazení z téže větve. Přesměrování DNS a skutečné doručení
formuláře je nutné ověřit po nasazení; viz [`NEEDED.md`](NEEDED.md).

Aktuální stav integrace, preview deploymentu a přechodu vlastní domény je v
[`HANDOFF.md`](HANDOFF.md). Úspěšný Vercel preview build se nesmí zaměňovat za
ostrý provoz na `www.umyjemefasadu.cz`.

`telegram-claude-bridge/` je samostatný pomocný projekt s vlastní dokumentací a
není součástí buildu ani deploymentu webu.

## Používané firemní údaje

Název, sídlo a IČO dodal majitel. Telefon a e-mail jsou převzaté z dosavadního
webu a před ostrým provozem čekají na potvrzení podle [`NEEDED.md`](NEEDED.md).

- **Firma:** UMYJEME FASÁDU s.r.o.
- **Sídlo:** Purkyňova 2869/4, 695 01 Hodonín
- **IČO:** 23770082
- **Telefon:** +420 775 222 760
- **E-mail:** info@umyjemefasadu.cz
