# Administrace webu

Administrace na `/dev` slouží k úpravě veřejných textů, kontaktních údajů,
cen, pořadí položek, fotografií a krátkých videí. Je určená netechnickému
majiteli, ale publikace vždy prochází serverovou autentizací a validací.

Administrace nemá výchozí heslo. Přístupové údaje poskytne správce bezpečným
kanálem; heslo se nesmí zapisovat do tohoto repozitáře.

## Postup pro majitele

### 1. Přihlášení

Otevřete produkční adresu s `/dev`, například:

```text
https://www.umyjemefasadu.cz/dev
```

Po úspěšném přihlášení vznikne podepsaná serverová session platná nejvýše osm
hodin. Heslo ani session secret se neposílají do veřejného JavaScriptu.

### 2. Výběr sekce a úprava

Vlevo na počítači nebo vodorovně nahoře na telefonu jsou sekce ve stejném
pořadí jako na webu. Vyhledávání rychle najde například Služby, Ceník nebo
Kontakt.

- **Text:** upravte přímo v poli.
- **Barva:** použijte výběr barvy nebo bezpečný hex zápis `#rrggbb`.
- **Fotografie/video:** klikněte na náhled, použijte „Nahradit soubor“ nebo
  soubor přetáhněte.
- **Seznam:** položky lze přidat, smazat a přesunout šipkami.
- **Viditelnost:** reference, statistiky a tým zůstávají vypnuté, dokud nejsou
  doplněné skutečné údaje a zaškrtnuté potvrzení pravosti a souhlasu s
  publikací. Server neúplnou nebo nepotvrzenou sekci odmítne.

Změny se průběžně ukládají jako koncept do úložiště konkrétního prohlížeče. Po
vložení většího média se může kapacita prohlížeče vyčerpat. Administrace v tom
případě zobrazí trvalé varování: změna zůstane v otevřeném okně, ale před jeho
zavřením je potřeba publikovat nebo stáhnout zálohu.

### 3. Náhled a záloha

- **Náhled** otevře veřejný web s nepublikovanými změnami pouze v daném
  prohlížeči.
- **Stáhnout zálohu** uloží aktuální strukturu jako `content.json`.
- **Zahodit změny** vrátí poslední publikovanou verzi.
- **Obnovit původní texty** nahraje výchozí obsah do editoru; veřejně se projeví
  až po publikaci.

Náhled s velkým médiem může také překročit kapacitu prohlížeče. Administrace
chybu oznámí; bezpečný recovery krok je stáhnout zálohu nebo rovnou publikovat.

### 4. Publikace

Tlačítko **Uložit a publikovat**:

1. znovu ověří přihlášení a původ požadavku;
2. zkontroluje kompletní strukturu obsahu a všechna média;
3. ověří, že od otevření editoru nikdo nepublikoval novější verzi;
4. vytvoří neforce commit v nastavené GitHub větvi;
5. předá změnu automatickému Vercel deploymentu.

Pokud web mezitím změnil někdo jiný, publikace se zastaví. Koncept zůstane v
prohlížeči; nejdřív stáhněte zálohu, obnovte admin a změny vědomě porovnejte.

Aktualizace se obvykle projeví po dokončení Vercel buildu. Úspěšný commit není
totéž jako úspěšný deployment, proto při důležité změně zkontrolujte i Vercel.

## Média a limity

Podporované typy:

- fotografie: JPG, PNG, WebP;
- pohyb: WebM, MP4 a animovaný WebP.

JPG a PNG admin před uploadem převede na kvalitní WebP, zachová poměr stran a
omezí delší stranu na 1920 px. Již hotový WebP se nerekomprimuje, aby se
nezničila případná animace.

Aktuální limity jedné publikace:

- vstupní soubor v prohlížeči: nejvýše 12 MB;
- připravený jednotlivý soubor: nejvýše 2,7 MB;
- nejvýše 4 nové soubory najednou;
- nové soubory dohromady: nejvýše 2,9 MB;
- celé JSON tělo požadavku: nejvýše 4,2 MB.

Server nekontroluje jen příponu. Ověřuje MIME, base64, magické bajty, cestu a
skutečnou velikost. Větší video zkraťte a exportujte jako WebM; velký nebo
animovaný WebP optimalizujte před vložením.

## Jednorázové nastavení Vercelu

V **Project → Settings → Environment Variables** nastavte:

| Proměnná               | Účel                                              | Povinná          |
| ---------------------- | ------------------------------------------------- | ---------------- |
| `ADMIN_PASSWORD`       | unikátní silné heslo do `/dev`                    | ano              |
| `ADMIN_SESSION_SECRET` | náhodný secret, nejméně 32 znaků                  | ano              |
| `GITHUB_TOKEN`         | fine-grained token s Contents: Read and write     | ano              |
| `GITHUB_REPO`          | například `lukaskourilcz/umyjemefasadu`           | ano              |
| `GITHUB_BRANCH`        | produkční větev, výchozí `main`                   | ne               |
| `RESEND_API_KEY`       | odeslání poptávkového formuláře                   | ano pro formulář |
| `CONTACT_EMAIL`        | cílová schránka, fallback `info@umyjemefasadu.cz` | doporučeno       |
| `CONTACT_FROM`         | ověřený Resend odesílatel                         | doporučeno       |

Po změně proměnných vždy spusťte nový deployment. Produkční větev ve Vercelu a
`GITHUB_BRANCH` musí být stejná.

Bez `ADMIN_PASSWORD` nebo dostatečně dlouhého `ADMIN_SESSION_SECRET` vrátí
přihlášení chybu 503. Žádné záložní heslo neexistuje. Bez GitHub konfigurace se
lze přihlásit, ale nelze bezpečně publikovat. Bez `RESEND_API_KEY` formulář
vrátí řízenou chybu a návštěvník stále vidí telefon a e-mail.

### GitHub token

Použijte fine-grained personal access token omezený jen na tento repozitář:

1. GitHub → Settings → Developer settings → Fine-grained tokens.
2. Repository access → pouze `umyjemefasadu`.
3. Repository permissions → Contents: Read and write.
4. Token vložte pouze do Vercel Environment Variables.

Token, heslo ani session secret se nesmí objevit v Git historii, klientském
kódu, screenshotu ani ticketu.

## Bezpečnostní model

- Přihlášení používá timing-safe porovnání a podepsanou `HttpOnly`,
  `SameSite=Strict`, v produkci `Secure` cookie.
- Přihlášení, odhlášení i publikace kontrolují stejný origin a protokol.
- `/dev` má `noindex`, `noarchive` a `no-store` hlavičky.
- Obsah se validuje proti přesnému serverovému schématu; neznámá pole, skripty
  v odkazech a externí media cesty nejsou povolené.
- GitHub update používá očekávaný head a `force: false`.
- Přihlášení i kontakt mají best-effort rate limit jedné serverless instance.
  Pro vyšší provoz nebo cílený abuse je v `NEEDED.md` trvalý distribuovaný
  limiter/WAF.

## Jak data putují

1. Výchozí struktura je v `src/content/defaultContent.json` a typech
   `src/content/schema.ts`.
2. Publikovaná data jsou v `public/content.json`.
3. Build z dat předrenderuje veřejné HTML a vloží do něj i celý obsah;
   `/content.json` je jen runtime fallback.
4. `/dev` upraví stejnou strukturu a `/api/save` ji uloží spolu s médii do
   GitHubu.
5. Nový commit spustí Vercel build a aktualizuje HTML i strukturovaná data.

Při přidání pole je nutné změnit schema, default, publikovaný JSON, český label,
serverovou validaci a testy současně.

## Lokální vývoj a obnova

`npm run dev` spouští pouze Vite. Obrazovku `/dev` zobrazí, ale serverové login,
save a contact endpointy potřebují Vercel runtime a lokální necommitované
proměnné nebo nasazené preview prostředí.

Při problému s publikací:

1. stáhněte zálohu z adminu;
2. zkontrolujte Vercel Function Logs a deployment;
3. ověřte expiraci a oprávnění GitHub tokenu;
4. porovnejte `GITHUB_BRANCH` s produkční větví;
5. případně obnovte poslední správný `public/content.json` z Git historie novým
   reverzním commitem — nepřepisujte historii force pushem.

Před ostrým provozem proveďte checklist v [`../NEEDED.md`](../NEEDED.md).
