# Design systém Umyjeme Fasádu

Tento dokument je jediný zdroj pravdy pro veřejný web i administraci. Změny
rozhraní se posuzují podle obchodního cíle: **zvýšit počet kvalifikovaných
poptávek a telefonátů bez oslabení důvěryhodnosti značky**.

Veřejná kompozice je na výslovný pokyn majitele založená na vizuálním baseline
`977343c`: plovoucí logo, scrollové hero před/po, ilustrovaný druhý hero a
editorial/bento sekce. Bezpečnostní, obsahová, přístupnostní a administrační
pravidla z modernizace zůstávají závazná.

## 1. Značka, publikum a záměr

- Značka má působit profesionálně, technicky kompetentně, bezpečně, poctivě,
  lokálně a snadno dostupně.
- Primární publikum: majitelé rodinných a bytových domů. Sekundární publikum:
  správci SVJ, provozovatelé komerčních objektů a obce.
- Cílový pocit: „Rozumějí povrchům, nepoškodí můj majetek, ukazují skutečnou
  práci a vím, jak získat přesnou nabídku.“
- Autentické fotografie a ověřitelné údaje mají přednost před dekorací a
  marketingovými superlativy.

## 2. Principy

1. Hlavní služba a kontakt musí být zřejmé v prvním viewportu; na mobilu je
   kontakt trvale dostupný ve spodní liště.
2. Jeden hlavní krok: **Domluvit prohlídku**. Sekundární krok: zavolat.
3. Důkaz před tvrzením: výsledek práce, postup a technika jsou přesvědčivější
   než čísla, certifikáty nebo recenze bez ověřeného zdroje.
4. Výrazný úvod, klidné obsahové sekce: jasné nadpisy, čitelné texty a
   konzistentní rytmus.
5. Magenta označuje akci, cyan technický nebo informační akcent.
6. Pohyb nesmí zdržovat obsah ani ovládání.
7. Mobil není zmenšený desktop. Kontakt zůstává vždy dostupný; delší podpůrné
   vysvětlení a přehled služeb lze zkrátit pojmenovaným disclosure.

## 3. Barvy a sémantické tokeny

Canonical tokeny jsou v `src/index.css`:

| Role             | Token                    | Výchozí hodnota |
| ---------------- | ------------------------ | --------------- |
| Akce             | `--color-action`         | `#d80076`       |
| Akce hover       | `--color-action-hover`   | `#b80064`       |
| Technický akcent | `--color-accent`         | `#087eaf`       |
| Hlavní text      | `--color-text`           | `#101820`       |
| Tlumený text     | `--color-text-muted`     | `#4b5a64`       |
| Inverzní text    | `--color-text-inverse`   | `#fbfdfe`       |
| Pozadí           | `--color-canvas`         | `#fbfdfe`       |
| Jemná plocha     | `--color-surface`        | `#eef4f8`       |
| Tmavá plocha     | `--color-surface-strong` | `#101820`       |
| Ohraničení       | `--color-border`         | `#cbd6dd`       |
| Jemné ohraničení | `--color-border-subtle`  | `#e2e9ee`       |
| Chyba            | `--color-error`          | `#b42318`       |
| Úspěch           | `--color-success`        | `#067647`       |

Starší názvy `warm-loam`, `forest-floor`, `botanical-ink`, `sage-mist`,
`lichen`, `moss-veil` a `eucalyptus` jsou dočasná kompatibilní vrstva. Nový
kód je nesmí zavádět. Barvy upravitelné v `/dev` smí měnit pouze akční a
akcentovou roli. Bílé písmo na akční barvě musí mít kontrast alespoň 4,5 : 1.

## 4. Typografie

- Běžný text používá Inter, nadpisy Space Grotesk a technické mikro-popisky
  Fragment Mono. Fonty se načítají přes Google Fonts a vždy mají systémové
  fallbacky deklarované v `src/index.css`.
- Nadpisy odlišuje váha, měřítko, řádkování a střídmý tracking. Velký hero
  titulek je jediná povolená výrazně display/uppercase výjimka.
- Technické mikro-popisky používají Fragment Mono pouze pro čísla kroku,
  štítky a drobná metadata.
  Nikdy pro odstavce.
- Fluidní role: display `clamp(2.25rem, 6vw, 5.25rem)`, H1
  `clamp(2rem, 4.5vw, 4rem)`, H2 `clamp(1.75rem, 3vw, 3rem)`, H3
  `clamp(1.125rem, 1.2vw, 1.375rem)`, text `clamp(1rem, .35vw + .92rem, 1.125rem)`.
- H1/H2: řádkování 1,02–1,15; běžný text 1,6–1,7; popisky nejméně 1,4.
- Odstavce maximálně 62 znaků (`62ch`), formulářové a podpůrné texty 48–56ch.
- České jednoznakové předložky se nesmí řešit ručními `&nbsp;` v editovatelném
  obsahu. Upřednostnit přirozené zalomení a dostatečnou šířku.

## 5. Prostor, kontejnery a mřížka

- Základní krok: 4 px. Povolené rozestupy: 4, 8, 12, 16, 24, 32, 48, 64,
  80, 96 a 120 px.
- Hlavní kontejner: maximálně 1200 px; textový kontejner 760 px.
- Okraje: 20 px malé telefony, 24 px telefony/tablety, 32–48 px desktop.
- Sekce: 64–80 px mobil, 96–120 px desktop. Sousedící témata lze spojit a
  použít menší mezeru; prázdný prostor nesmí prodlužovat stránku bez významu.
- Breakpointy jsou obsahové: přibližně 640, 768, 1024 a 1200 px. Rozvržení
  se musí kontrolovat i těsně před a po každém z nich.
- Desktop: 12 sloupců; běžné obsahové kompozice 5/7 nebo 6/6. Mobil: jeden
  sloupec; horizontální posuv jen pro zjevně posuvnou galerii.

## 6. Tvar, hranice, stín a ikony

- Ovládací prvky 10–12 px, karty a velká média 12–16 px. Plné kapsle pouze pro
  skutečné tagy, ne jako výchozí tvar každého prvku.
- Karty oddělovat převážně vlasovou linkou a plochou. Povolen je jeden jemný
  stín pro plovoucí navigaci/logo; dekorativní vícevrstvé stíny jsou zakázané.
- Ikony jsou jednoduché linkové SVG, tloušťka 1,5–1,75 px, bez emoji a bez
  generických knihoven pro několik málo symbolů.

## 7. Fotografie a video

- Používat pouze autentická média z reálné práce. AI generované „důkazy",
  falešné reference a nesouvisející stock fotografie jsou zakázané.
- Hlavní důkaz má být ostrý, přirozeně barevný a s jasným předmětem.
- Páry před/po musí zobrazovat stejný objekt, podobný úhel a srovnatelný výřez.
  Pokud pár není autenticky spárovaný, nesmí být označen jako před/po.
- Standardní poměry: hero 16:9 až 4:3, obsahová fotografie 4:3, vertikální
  záběr 4:5. `object-position` se nastavuje vědomě.
- Obrázky pod prvním viewportem: WebP/JPEG, `loading="lazy"`, rozměry nebo
  `aspect-ratio`, smysluplný alt. Hero: přednačtené z HTML a bez lazy loadingu.
- Krátká videa: WebM/MP4, bez zvuku, `playsInline`, metadata nebo `none`, poster,
  přehrávání pouze ve viewportu. Animovaný WebP je přípustný pro malé důkazní
  karty, ale musí být lazy a pod praktickým rozpočtem.
- Rozpočet: hero obraz do 250 kB, běžný obraz do 220 kB, krátké video do 2,5 MB;
  výjimka musí být zdokumentována jako kompromis.

## 8. Pohyb

- Standardní trvání 150–250 ms, komplexní přechod nejvýše 400 ms.
- Easing `cubic-bezier(.2,.8,.2,1)`. Hero smí používat sticky scrollový reveal
  v rámci 160vh a ilustrované pozadí smí mít jemný parallax. Kód nesmí
  zachytávat kolečko, blokovat běžný scroll ani vyžadovat drag k pokračování.
- `prefers-reduced-motion: reduce` vypíná transformace, automatické rotace a
  autoplay; hero se změní na statické vyvážené porovnání.

## 9. Stavy a přístupnost

- Cíl WCAG 2.2 AA. Text 4,5 : 1, velký text 3 : 1, UI a focus 3 : 1.
- Interaktivní cíl zpravidla nejméně 44 × 44 CSS px.
- Focus je vždy viditelný, nesmí být zakryt sticky navigací nebo mobilní lištou.
- Hover není jediný nositel informace. Pressed stav vizuálně reaguje bez
  posunu layoutu. Disabled snižuje kontrast, ale zůstává čitelný.
- Loading používá text a `aria-live`; success a error mají ikonu, text a
  další krok. Chyba se nesděluje jen barvou.
- Formulář zachovává data po opravitelné chybě, označuje neplatná pole a
  propojuje chyby pomocí `aria-describedby`.
- `forced-colors` nesmí odstranit hranice ani focus. Automatická animace se
  nesmí rozběhnout při reduced motion.

## 10. Komponenty

### Navigace

Sticky řádek 72–80 px, průhledný jen nad hero s dostatečným kontrastem. Logo
smí vizuálně přesahovat, ale nesmí překrýt odkazy. Mobilní menu je dialogový
panel s uzamčením pozadí, řízením focusu, Escape a návratem focusu spouštěči.

### Tlačítka a odkazy

- Primární: magenta, konkrétní sloveso (`Domluvit prohlídku`).
- Sekundární: tmavý/transparentní s jasnou hranicí (`Zavolat 775 222 760`).
- Textový odkaz jen pro terciární navigaci. `Zjistit více` se nepoužívá, pokud
  lze pojmenovat cíl.

### Nadpis sekce a indikátory důvěry

Eyebrow je krátký a informační. H2 shrnuje užitek, úvod maximálně dvě věty.
Indikátor důvěry smí obsahovat pouze ověřený fakt; neověřený se skryje a zapíše
do `NEEDED.md`.

### Služby a důkaz

Jedna hlavní služba může mít velké autentické médium; další služby používají
jednoduché řádky/karty. Karta nesmí předstírat případovou studii bez ověřených
údajů. Důkazní galerie uvádí jen to, co je skutečně vidět.

### Porovnání před/po

Oba autentické obrazy se přednačítají z HTML. Na desktopu jejich odhalení
ovládá běžný postup stránky přes sticky scrollový track; na mobilu nativní
range se jménem, hodnotou a klávesnicovým ovládáním. Pohybový reduced-motion
stav používá statický dělicí poměr. Porovnání nesmí vytvořit horizontální
overflow ani zakrýt spodní mobilní CTA.

### Postup, ceník, FAQ

- Postup: 3–4 očíslované kroky, bez dekorativních samostatných karet navíc.
- Ceník: jasná služba, jednotka, „od“ a vysvětlení proměnných. Ceny a DPH musí
  být vlastníkem potvrzené.
- FAQ: nativní `details/summary`, minimálně 48 px, odpověď čitelná bez pohybu.

### Formulář

Minimum: jméno, telefon, stručný popis. Každé pole má viditelný label,
autocomplete, typ a inline validaci. Honeypot je skryt mimo asistivní
technologie. Submit stav je oznamovaný. Vždy je viditelná telefonní alternativa.

### Patička a mobilní CTA

Patička uvádí název, sídlo, IČO, telefon, e-mail a ochranu osobních údajů.
Název, sídlo a IČO musí být dodané majitelem; kontakty musí být potvrzené v
`NEEDED.md`. Mobilní CTA má safe-area padding, nezakrývá poslední pole ani
právní odkazy a obsahuje maximálně dvě konkrétní akce.

## 11. Responzivní chování

- Kontrolní šířky: 320, 360, 390, 768, 1024, 1280, 1440 a 1920 px; navíc
  844 × 390 landscape a zoom 200 %.
- Na 320 px nesmí vzniknout horizontální scroll, oříznutý nadpis ani tlačítko.
- Nabídka, cena a kontakt nesmí být na mobilu skryté. Delší vysvětlení ochrany,
  rizik a přehled jednotlivých služeb mohou být v samostatných jasně
  pojmenovaných disclosure; po otevření musí být obsah okamžitě viditelný a
  média se smějí aktivovat až v relevantním viewportu.
- Sticky prvky nesmí překrýt ovládání; spodní padding stránky respektuje jejich
  skutečnou výšku a `env(safe-area-inset-bottom)`.

## 12. Český obsah a mikrocopy

- Konzistentní vykání s malým `v` uprostřed věty. Krátké věty, aktivní slovesa,
  konkrétní povrch a další krok.
- Nepoužívat neověřené absolutní výrazy (`vždy`, `bez poškození`, `na dlouhé
roky`, `zaručeně`) ani zdravotní diagnózy bez zdroje.
- Rozsahy zapisovat `5–10 let`, cenu `95 Kč/m²`, čas `8.00–17.00` nebo jednotně
  podle zvolené redakční normy. Pomlčka `–`, ne spojovník.
- CTA: `Domluvit prohlídku`, `Získat přesnou nabídku`, `Zavolat`.
- Faktuální přísliby (záruka, pojištění, dojezd, odezva, ceny, životnost) musí
  být potvrzené v `NEEDED.md` nebo skryté.

## 13. Povolené a zakázané vzory

Povolené: autentické velké fotografie, klidné plochy, vlasové linky, jednoduché
seznamy, jeden dominantní CTA, nativní ovládání, jemný technický detail.

Zakázané: glassmorphism mimo hero štítky a podklad titulku, nadbytečné
gradienty, card-grid pro každý odstavec, SaaS dashboard estetika na veřejném
webu, odpočty, umělá urgence, autoplay karusely, zachytávání nebo blokování
scrollu, falešná čísla/recenze/zakázky, AI důkazní média, nečitelný cyan text,
plošné pill tvary a animace bez informačního účelu.

## 14. Definice souladu

Změna je v souladu jen pokud:

1. používá sémantické tokeny nebo zdokumentovanou kompatibilní vrstvu;
2. funguje na kontrolních šířkách, při 200% zoomu a s klávesnicí;
3. má odpovídající focus, loading, error a reduced-motion stav;
4. nezavádí neověřené tvrzení ani falešný důkaz;
5. zachovává editovatelnost přes `public/content.json` a `/dev`;
6. splní build, lint, testy a relevantní E2E/a11y kontrolu;
7. respektuje mediální a výkonnostní rozpočet nebo dokumentuje výjimku;
8. zkracuje nebo zpřesňuje cestu ke kvalifikované poptávce.
