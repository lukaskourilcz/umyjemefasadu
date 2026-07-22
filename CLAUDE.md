# Pokyny pro práci v repozitáři

## Produkt

Umyjeme Fasádu je český lead-generation web pro profesionální čištění fasád,
střech, dlažeb a dalších venkovních povrchů. Hlavní cíl je získat více
kvalifikovaných poptávek a telefonátů. Důvěra, bezpečnost, srozumitelnost a
autentické důkazy mají přednost před vizuální novostí.

## Architektura

- `src/components/`: veřejné React komponenty.
- `src/content/`: TypeScript schema, výchozí obsah a loader.
- `public/content.json`: publikovaný obsah vložený do předrenderovaného HTML;
  samostatný request slouží jen jako runtime fallback.
- `src/admin/`: lazy-loaded administrace na `/dev`.
- `api/`: Vercel funkce pro přihlášení/publikování a kontakt.
- `public/media/`: lokální autentická média.
- `docs/DESIGN_SYSTEM.md`: závazný vizuální a obsahový standard.

## Příkazy

Používejte skripty z `package.json`: instalace `npm ci`, vývoj `npm run dev`,
formát `npm run format:check`, lint `npm run lint`, typy `npm run check:types`,
unit testy `npm test`, build `npm run build`, E2E `npm run test:e2e` a úplná
kontrola `npm run validate`. Pokud skript zatím neexistuje, nepředstírejte jeho
výsledek; přidejte jej pouze s odpovídající konfigurací.

## Pravidla

- Před změnou prohledejte existující komponenty, hooky, helpery, typy a tokeny.
- Nový UI kód používá sémantické tokeny z design systému. Staré botanické názvy
  jsou pouze kompatibilní vrstva.
- Sdílený vzor rozšiřte nebo refaktorujte; nekopírujte varianty bez důvodu.
- Cíl je WCAG 2.2 AA, ovládání klávesnicí, touch target okolo 44 px, 200% zoom,
  reflow bez horizontálního scrollu a poctivý `prefers-reduced-motion`.
- Kontrolujte 320, 360, 390, 768, 1024, 1280, 1440, 1920 px a 844×390.
- Veřejný JS nesmí obsahovat administrátorské heslo ani secret. Server bez
  povinných secrets selže uzavřeně. Validujte a omezujte vstupy i uploady.
- Nevymýšlejte reference, čísla, zákazníky, certifikace, pojištění, záruky,
  lokality, ceny ani fotografie před/po. Neověřená data skrýt a přidat jako
  `[owner:me]` do `NEEDED.md`.
- Změna schema vyžaduje synchronní změnu `schema.ts`, `defaultContent.json`,
  `public/content.json`, administrace a testů.
- Zachovejte `/dev` lazy-loaded mimo veřejný bundle a GitHub publishing flow.
- Média: autentická, lokální, s alt textem a rozměrovou rezervací. Dodržujte
  rozpočty v design systému; videa mimo viewport nepřehrávat.
- Po UI změně proveďte reálnou browser kontrolu; po API změně testujte chybné,
  hraniční i autorizované vstupy. Neoslabujte TS/lint/a11y pravidla kvůli green.
- Commitujte logické, funkční milníky. Před commitem zkontrolujte celý diff,
  testy, build, debug soubory, secrets a dokumentaci.
