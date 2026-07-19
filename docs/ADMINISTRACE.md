# Administrace webu (úprava textů a fotek)

Web má vlastní jednoduchou administraci, kde jde bez programování měnit
**všechny texty** a vyměnit **všechny fotky i videa/gify**.

---

## Pro majitele webu — jak upravovat obsah

### 1. Otevřete administraci

K adrese webu přidejte `/dev`, například:

```
https://www.umyjemefasadu.cz/dev
```

Zadejte heslo: **`fasada`**

### 2. Upravte, co potřebujete

Vlevo je seznam sekcí webu (Úvod, Služby, Ceník, Kontakt…). Klikněte na
sekci a upravte texty přímo v polích.

- **Texty** – stačí přepsat obsah pole.
- **Fotky a videa** – soubor můžete přetáhnout přímo na velký náhled nebo
  použít tlačítko **„Nahradit soubor"**. Nový obsah uvidíte okamžitě.
- Každý mediální blok přesně popisuje, kde se na webu používá (například
  „Fotka PŘED“, „Hlavní video služby“ nebo „Malé video vedle postupu“).
- **Přidat/ubrat položku** – u seznamů (služby, reference, ceník, dotazy…)
  použijte tlačítko **„+ Přidat další"**, šipky **↑ ↓** pro pořadí a **✕**
  pro smazání.

Změny se průběžně ukládají do prohlížeče, takže o rozdělanou práci
nepřijdete ani po zavření okna.

### 3. Podívejte se na náhled (nepovinné)

Tlačítko **„Náhled"** nahoře otevře web s vašimi zatím neuloženými změnami
(vidíte je jen vy). Nahoře svítí růžový proužek „Náhled neuložených změn".

### 4. Publikujte

Až budete spokojení, klikněte na **„Uložit a publikovat"**. Změny se uloží
a web se **sám během cca 1–2 minut** aktualizuje pro všechny návštěvníky.

### Užitečná tlačítka

- **Stáhnout zálohu** – uloží aktuální obsah jako soubor `content.json`
  (bezpečná záloha do počítače).
- **Zahodit změny** – zruší neuložené úpravy a vrátí poslední publikovanou
  verzi.
- **Obnovit původní texty** – vrátí úplně původní (tovární) obsah webu.
  Projeví se až po publikaci.

### Dobré vědět

- Maximální velikost jednoho souboru je **4 MB**. Větší fotku uložte jako
  WEBP/JPG a video jako WEBM/MP4 v rozumném rozlišení.
- Velká videa nahrávejte raději **po jednom** a poté publikujte.
- Fotky ideálně ve formátu **JPG/WEBP**, videa jako **WEBM/MP4**.

---

## Pro správce / technika — jednorázové nastavení (Vercel)

Administrace ukládá změny tak, že je zapíše (commitne) do GitHub repozitáře;
Vercel na to zareaguje automatickým nasazením. Nepotřebujete žádnou databázi.

Aby to fungovalo, nastavte na Vercelu **Environment Variables**
(Project → Settings → Environment Variables):

| Proměnná | Hodnota | Povinné |
|---|---|---|
| `GITHUB_TOKEN` | GitHub token s právem zápisu do repozitáře (viz níže) | ano |
| `GITHUB_REPO` | `lukaskourilcz/umyjemefasadu` | ano |
| `GITHUB_BRANCH` | větev, ze které se nasazuje produkce (obvykle `main`) | ne (výchozí `main`) |
| `ADMIN_PASSWORD` | heslo do administrace (výchozí `fasada`) | doporučeno změnit |

Po přidání proměnných spusťte nové nasazení (Redeploy), aby se načetly.

### Vytvoření `GITHUB_TOKEN`

Nejjednodušší je **Fine-grained personal access token**:

1. GitHub → Settings → Developer settings → **Fine-grained tokens** →
   *Generate new token*.
2. **Repository access**: Only select repositories → `umyjemefasadu`.
3. **Permissions** → Repository permissions → **Contents: Read and write**.
4. Vygenerovaný token vložte na Vercelu jako `GITHUB_TOKEN`.

> Token je uložený jen na serveru (ve Vercelu), nikdy se nedostane do
> prohlížeče ani do kódu webu.

### Bezpečnost

- Heslo `ADMIN_PASSWORD` doporučujeme změnit na silnější – kdokoli s heslem
  může měnit obsah webu.
- Serverová funkce `api/save.js` heslo ověřuje a povoluje zápis pouze do
  `public/content.json` a `public/media/` (ochrana proti neplatným cestám).

---

## Jak to funguje uvnitř (pro vývojáře)

- **Veškerý obsah** je v `public/content.json`. Web ho načítá za běhu.
- Výchozí/záložní obsah a typy jsou v `src/content/` (`defaultContent.json`,
  `schema.ts`). Komponenty čtou obsah přes `useContent()`.
- **Administrace** je na `/dev` (kód v `src/admin/`), načítá se jen tam
  (samostatný chunk, běžný web nezatěžuje).
- **Fotky/videa** jsou v `public/media/`. Nově nahrané soubory administrace
  odešle jako data a serverová funkce je uloží do `public/media/`.
- **Ukládání**: `api/save.js` (Vercel serverless) → commit do GitHubu →
  automatické nasazení.
- Routování `/dev` zajišťuje `vercel.json` (rewrite na `index.html`).
## Přímé odesílání poptávek

Kontaktní formulář odesílá poptávky přes serverovou funkci `/api/contact` a službu Resend. Ve Vercelu nastavte proměnnou `RESEND_API_KEY`. Volitelně lze nastavit `CONTACT_EMAIL` (výchozí je `info@umyjemefasadu.cz`) a `CONTACT_FROM` po ověření vlastní domény v Resendu.
