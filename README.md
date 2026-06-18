# Umyjeme Fasádu — rebrand

Marketingový web pro firmu **Umyjeme Fasádu s.r.o.** (profesionální mytí a
čištění fasád, střech a dlažby), přepracovaný do vizuálního stylu
**Adaline — „botanical journal at dawn"**.

## Vizuální styl

Klidná, kontemplativní paleta v zemitých a šalvějových tónech: krémové plátno
(`#fbfdf6`), téměř černý lesní text (`#0a1d08`) a jediná sytá akční barva —
teplá hnědá `#4a3212`. Vlasové linky místo stínů, 20px „pill" rádiusy,
geometrická humanistická typografie (Inter jako náhrada za Akkurat) a
experimentální monospace (Fragment Mono) pro mikro-popisky. Web kotví ručně
malovaná SVG krajina (jezero v mlze, šalvějové kopce, osamělá lavička).

Designové tokeny jsou kompletně namapované v `src/index.css` (`@theme`).

## Tech stack

- **Vite 6** + **React 18** + **TypeScript**
- **Tailwind CSS v4** (`@tailwindcss/vite`, tokeny v `@theme`)
- Fonty z Google Fonts: **Inter** (náhrada za Akkurat), **Fragment Mono**
- Bez závislosti na externích obrázcích — krajina i ikony jsou inline SVG

## Vývoj

```bash
npm install
npm run dev         # vývojový server
npm run build       # typová kontrola + produkční build do dist/
npm run preview     # náhled produkčního buildu
npm run gen:assets  # vygeneruje raster assety (OG obrázek, PNG ikony) z SVG
```

## Logo a značkové assety

- **Živé logo** je vykreslené jako inline SVG v `src/components/Logo.tsx`
  (varianty `compact` a `full`) — díky tomu dědí web font a značkové barvy
  a zůstává ostré v každé velikosti.
- **Samostatný zdroj** loga je v `public/logo.svg`.
- **Raster assety** (`public/og-image.png`, `apple-touch-icon.png`,
  `favicon-32.png`) generuje `scripts/gen-assets.mjs` přes `npm run gen:assets`.
- **Meta tagy** pro náhled odkazu (Open Graph + Twitter) jsou v `index.html`.
  Po nasazení na ostrou doménu zkontrolujte absolutní URL u `og:image`.

### Nahrazení vlastním logem (z .eps)

`.eps` nelze použít přímo na webu — převeďte ho na **SVG**:

1. Otevřete `.eps` v Illustratoru/Inkscape, **text převeďte na křivky**
   (Type → Create Outlines) a exportujte jako **SVG**.
2. Nahraďte obsah `public/logo.svg` a (volitelně) vložte stejné cesty do
   `src/components/Logo.tsx`, nebo přepněte komponentu na
   `<img src="/logo.svg" />`, pokud nepotřebujete měnit barvy přes CSS.
3. Spusťte `npm run gen:assets`, aby se přegeneroval OG obrázek a ikony.

> Logo na webu je vektorová rekreace původní značky (střecha, růžový
> nápis, modrá voda, maskot Poseidona). Pro 100% shodu vložte vlastní
> SVG převedené z `.eps`.

## Struktura

```
src/
  App.tsx                 # skládá sekce + scroll-reveal
  index.css               # @theme tokeny + base/komponentní vrstvy
  components/
    Landscape.tsx         # signature malovaná SVG krajina (hero pozadí)
    Nav.tsx / Logo.tsx    # transparentní navigace, wordmark + slash mark
    Hero.tsx              # centrovaný headline nad krajinou
    TrustStrip.tsx        # pruh důvěry (mikro-popisek + hodnoty)
    Services.tsx          # karty služeb
    Process.tsx           # tři kroky postupu
    WhyUs.tsx             # 2sloupcový blok „proč my"
    Stats.tsx             # banding s čísly
    Contact.tsx           # kontaktní výzva (telefon, e-mail)
    Footer.tsx
```

## Kontaktní údaje (z původního webu)

- Telefon: +420 775 222 760
- E-mail: info@umyjemefasadu.cz

> Texty jsou převzaté a parafrázované z původního webu umyjemefasadu.cz a
> z veřejně dostupných informací o oboru; doladění copy je na zadavateli.
