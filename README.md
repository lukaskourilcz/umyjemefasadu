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
npm run dev      # vývojový server
npm run build    # typová kontrola + produkční build do dist/
npm run preview  # náhled produkčního buildu
```

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
