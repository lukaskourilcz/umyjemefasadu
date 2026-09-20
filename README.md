# Umyjeme Fasádu

Marketingový web pro firmu **Umyjeme Fasádu s.r.o.** — profesionální mytí a
čištění fasád, střech a dlažby.

## Vizuální styl

Čisté, světlé „cream" plátno (`#fbfdfe`) s téměř černým textem (`#101820`),
vlasovými linkami místo stínů a 20px „pill" rádiusy. Akcenty vycházejí přímo
ze značkového loga: **magenta `#e6007e`** jako jediná akční barva (CTA) a
**cyan `#1ba5e0`** jako sekundární „vodní" akcent. Sekce Rizika a objednávkový
postup běží na plné brandové růžové (stejná jako logo a CTA): nadpisy na nich
zůstávají téměř černé, všechen ostatní text je bílý, aby zůstal čitelný.
Typografie: **Inter** (humanistický bezpatkový základ) + **Fragment Mono**
pro mikro-popisky.
Hero kotví atmosférický SVG motiv vody v značkových tónech (vrstvená hladina,
pěna, kapky), který odkazuje na vodní prvek z loga.

Designové tokeny jsou kompletně namapované v `src/index.css` (`@theme`).

## Tech stack

- **Vite 6** + **React 18** + **TypeScript**
- **Tailwind CSS v4** (`@tailwindcss/vite`, tokeny v `@theme`)
- Fonty z Google Fonts: **Inter**, **Fragment Mono**
- Bez externích obrázků — motiv vody i ikony jsou inline SVG, logo je
  optimalizované SVG vložené přes Vite `?raw`

## Jazykové mutace (česky / německy)

Jazyk se pozná ze dvou věcí (`src/i18n.ts`), v tomhle pořadí:

1. **doména** — `waschenfassade.eu` (i s `www.`) běží vždy německy,
2. **cesta** — `/de` a cokoli pod ní běží německy na kterékoli doméně,
3. jinak čeština.

| Adresa | Jazyk | Obsah |
| --- | --- | --- |
| `www.umyjemefasadu.cz/` | čeština | `public/content.json` |
| `www.umyjemefasadu.cz/de` | němčina | `public/content.de.json` |
| `waschenfassade.eu/` | němčina | `public/content.de.json` |

Na německé doméně žije němčina v **kořeni** (`/`), na české pod `/de`. Cesta
`/de` zůstává i po spuštění německé domény jako záložní a testovací adresa.

Přepínač jazyků na webu **záměrně není** — návštěvník vidí jen tu mutaci,
přes kterou přišel. Všechny absolutní odkazy v hlavičce (canonical, `og:url`,
`og:image`) se skládají z domény, na které web právě běží, takže na německé
doméně ve zdrojáku nikde neprosvitne česká adresa.

Značky jsou dvě, obě se stejným maskotem: **Umyjeme Fasádu** (cs) a
**Waschen Fassade** (de). Obě jsou v konstantě `BRAND` v `src/i18n.ts`, odkud
se skládají titulky, `og:site_name` i `alt` u loga.

### Napojení německé domény — postup

1. **Koupit doménu** (držitelem musí být firma, ne jednatel ani dodavatel).
2. **Vercel → Settings → Domains** — přidat `waschenfassade.eu`
   i `www.waschenfassade.eu` do **stejného projektu**. Apex nastavit na
   „No Redirect", `www` na 301 přesměrování na apex.
3. **Poslat klientovi DNS hodnoty**, které Vercel zobrazí na kartě domény
   (`A` pro apex, `CNAME` pro `www`) — každý projekt má vlastní, nepoužívat
   hodnoty z cizího projektu. DNS zůstává u registrátora.
4. **Ověřit** — jakmile doména resolvuje, `waschenfassade.eu` musí sama od
   sebe ukázat německou verzi. V kódu se nemění nic; canonical a `og:url` se
   přepnou samy, protože se odvozují od aktuální domény.
5. **Teprve potom** přidat do `vercel.json` do pole `redirects` (pokud
   neexistuje, vytvořit ho vedle `rewrites`) přesměrování staré cesty, ať
   nevzniká duplicitní obsah:

   ```json
   "redirects": [
     {
       "source": "/de",
       "has": [{ "type": "host", "value": "www.umyjemefasadu.cz" }],
       "destination": "https://waschenfassade.eu/",
       "permanent": true
     },
     {
       "source": "/de/",
       "has": [{ "type": "host", "value": "www.umyjemefasadu.cz" }],
       "destination": "https://waschenfassade.eu/",
       "permanent": true
     }
   ]
   ```

   **Dřív ne** — dokud doména neresolvuje, tohle přesměrování by německou
   verzi úplně odřízlo. Administrace na `/de/dev` zůstane funkční i po něm.

### Co ještě chybí

- **Německá kresba loga** — `src/assets/logo.svg` (patička) a
  `/media/logo-nav.webp` (navigace) jsou pořád české. `alt` a titulky už
  německé jsou. Favicon je jen maskot, ten je pro obě značky stejný.
- **Německý OG obrázek** — `META.de.ogImage` v `src/i18n.ts` zatím ukazuje na
  sdílený `/og-image.png` s českým nápisem.
- **Meta tagy pro náhledy odkazů** — titulek, popisek a `og:` tagy se
  přepisují až v prohlížeči. Google to zvládne (renderuje JS), ale roboti
  Facebooku, LinkedInu a WhatsAppu ne — ti si přečtou české hodnoty přímo
  z `index.html`. Než se začne německý web sdílet na sítích, je potřeba
  generovat při buildu druhý soubor (`de.html`) s německou hlavičkou
  a poslat na něj německou doménu.
- **Ceny** v německé verzi jsou v Kč (CZK).

## Administrace obsahu (`/dev`, `/de/dev`)

Web má vestavěnou administraci pro úpravu **všech textů a fotek/videí** bez
programování — dostupná na adrese `/<web>/dev`, heslo `fasada`.

- Veškerý obsah je v `public/content.json` (česky) a `public/content.de.json`
  (německy); web ho čte za běhu (`useContent()`). Německé texty se upravují
  na `/de/dev`, české na `/dev` — hlavička administrace vždy ukazuje, která
  verze se právě edituje.
- Administrace (`src/admin/`) ukládá změny přes serverless funkci
  `api/save.js`, která je commitne do repozitáře → Vercel web sám znovu nasadí.
- Podrobný návod pro majitele i jednorázové nastavení Vercelu (proměnné
  `GITHUB_TOKEN`, `GITHUB_REPO`, `ADMIN_PASSWORD`) je v
  [`docs/ADMINISTRACE.md`](docs/ADMINISTRACE.md).

## Vývoj

```bash
npm install
npm run dev         # vývojový server
npm run build       # typová kontrola + produkční build do dist/
npm run preview     # náhled produkčního buildu
npm run gen:assets  # vygeneruje raster assety (OG obrázek, PNG ikony) z loga
```

## Logo a značkové assety

- **Živé logo** je optimalizované SVG v `src/components/logo.svg`, vložené do
  `src/components/Logo.tsx` přes `?raw`. Varianty `compact` (nav, patička) a
  `full` (hero) renderují stejnou kresbu v různé velikosti.
- **Samostatná kopie** loga je v `public/logo.svg`; originální export (CorelDRAW)
  je uchovaný v `public/logo-white.svg`.
- **Raster assety** (`public/og-image.png`, `apple-touch-icon.png`,
  `favicon-32.png`) generuje `scripts/gen-assets.mjs` z `public/logo.svg`
  přes `npm run gen:assets`.
- **Meta tagy + LocalBusiness JSON-LD** jsou v `index.html`. Po nasazení na
  ostrou doménu zkontrolujte absolutní URL u `og:image` a doplňte adresu/IČO.

## Struktura

```
src/
  App.tsx                 # skládá sekce + scroll-reveal
  i18n.ts                 # jazyk podle URL (/ = cs, /de = de) + texty rozhraní
  index.css               # @theme tokeny + base/komponentní vrstvy
  components/
    Landscape.tsx         # atmosférický SVG motiv vody (hero pozadí)
    Nav.tsx               # sticky navigace + mobilní menu (hamburger)
    Logo.tsx / logo.svg   # logo komponenta + optimalizovaná kresba
    Hero.tsx              # centrované logo + headline nad motivem vody
    TrustStrip.tsx        # pruh důvěry (mikro-popisek + hodnoty)
    Services.tsx          # karty služeb
    Process.tsx           # postup čištění (3 kroky + 2 metody)
    WhyUs.tsx             # 2sloupcový blok „proč my"
    Gallery.tsx           # reference — porovnání před / po (placeholdery)
    Stats.tsx             # banding s čísly
    OrderProcess.tsx      # jak objednat (4 kroky)
    Faq.tsx               # časté dotazy (<details>)
    Contact.tsx           # kontaktní výzva (telefon, e-mail)
    Footer.tsx
    CallBar.tsx           # sticky mobilní lišta s tlačítkem „Zavolat"
```

## Reference (před / po)

`Gallery.tsx` je připravená na reálné fotky. Vložte snímky do
`public/reference/` a v poli `ITEMS` doplňte cesty `before`/`after` —
placeholdery se automaticky nahradí porovnávacím posuvníkem.

## Kontaktní údaje

- Firma: UMYJEME FASÁDU s.r.o.
- Sídlo: Purkyňova 2869/4, 695 01 Hodonín
- IČO: 23770082
- Telefon: +420 775 222 760
- E-mail: info@umyjemefasadu.cz

Poptávkový formulář odesílá přímo přes `api/contact.js`. Na Vercelu vyžaduje
proměnnou `RESEND_API_KEY`; volitelně podporuje `CONTACT_EMAIL` a
`CONTACT_FROM`.

> Texty jsou parafrázované z původního webu a z veřejně dostupných informací
> o oboru; finální doladění copy je na zadavateli.
