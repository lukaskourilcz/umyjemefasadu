/**
 * Jazykové mutace webu.
 *
 * Jazyk se pozná ze dvou věcí, v tomhle pořadí:
 *   1. doména — `waschenfassade.eu` (i s `www.`) běží vždy německy,
 *   2. cesta  — `/de` a cokoli pod ní běží německy na kterékoli doméně,
 *   3. jinak  — čeština.
 *
 * Na německé doméně žije němčina v kořeni (`/`), na české pod `/de`; cesta
 * `/de` zůstává i po spuštění německé domény jako záložní a testovací adresa.
 *
 * Přepínač jazyků na webu záměrně NENÍ — návštěvník vidí jen tu mutaci,
 * přes kterou přišel.
 *
 * V tomto souboru žijí i texty, které nejsou v `content.json` (popisky sekcí,
 * `aria-label`y, hlavičkové meta tagy) — obsahové texty patří do content.json.
 */

export type Locale = "cs" | "de";

/** Cesta, na které web běží německy i na české doméně. */
const DE_SEGMENT = "de";

/**
 * Domény, na kterých web běží německy bez ohledu na cestu. Varianta s `www.`
 * se doplňuje sama. Až přibude další německá doména, stačí ji přidat sem.
 */
const DE_HOSTS = ["waschenfassade.eu"];

/** Produkční adresa české verze — záloha, když není k dispozici `window`. */
const FALLBACK_ORIGIN = "https://www.umyjemefasadu.cz";

function isGermanHost(hostname: string): boolean {
  return DE_HOSTS.includes(hostname.toLowerCase().replace(/^www\./, ""));
}

/** Jazyk podle domény a cesty. */
export function detectLocale(hostname: string, pathname: string): Locale {
  if (isGermanHost(hostname)) return "de";
  const first = pathname.replace(/^\/+/, "").split("/")[0]?.toLowerCase();
  return first === DE_SEGMENT ? "de" : "cs";
}

/** Běžíme na německé doméně? (Rozhoduje, jestli má němčina prefix `/de`.) */
const ON_DE_HOST =
  typeof window !== "undefined" && isGermanHost(window.location.hostname);

/** Jazyk aktuálního zobrazení — určí se jednou při načtení stránky. */
export const LOCALE: Locale =
  typeof window === "undefined"
    ? "cs"
    : detectLocale(window.location.hostname, window.location.pathname);

/**
 * Adresa, na které web právě běží. Všechny absolutní odkazy (canonical,
 * og:url, og:image) se odvozují od ní, aby na německé doméně nikde
 * neprosvitla česká — návštěvník nemá poznat, že existuje česká verze.
 */
export const ORIGIN =
  typeof window === "undefined" ? FALLBACK_ORIGIN : window.location.origin;

/**
 * Prefix cesty dané mutace. Na německé doméně je němčina v kořeni, takže
 * prefix je prázdný; na české doméně žije pod `/de`.
 */
export function localePrefix(locale: Locale = LOCALE): string {
  if (locale !== "de" || ON_DE_HOST) return "";
  return `/${DE_SEGMENT}`;
}

/** Domovská stránka dané mutace ("/" nebo "/de"). */
export function localeHome(locale: Locale = LOCALE): string {
  return localePrefix(locale) || "/";
}

/** Kanonická adresa aktuální stránky (canonical, og:url, LocalBusiness). */
export function canonicalUrl(locale: Locale = LOCALE): string {
  return `${ORIGIN}${localeHome(locale)}`;
}

/** Absolutní adresa souboru z `public/` na aktuální doméně. */
export function assetUrl(path: string): string {
  return `${ORIGIN}${path}`;
}

/** Soubor s obsahem dané mutace (leží v `public/`). */
export function contentFile(locale: Locale = LOCALE): string {
  return locale === "de" ? "/content.de.json" : "/content.json";
}

/** Cesta k souboru v repozitáři — používá administrace při publikaci. */
export function contentRepoPath(locale: Locale = LOCALE): string {
  return `public${contentFile(locale)}`;
}

/**
 * Cesta bez jazykového prefixu (např. „/de/dev" → „/dev"). Prefix odstraní
 * na kterékoli doméně, takže administrace odpovídá na `/dev` i `/de/dev`.
 */
export function stripLocale(pathname: string): string {
  return pathname.replace(new RegExp(`^/${DE_SEGMENT}(?=/|$)`, "i"), "") || "/";
}

/* ---------------------------- texty rozhraní ---------------------------- */

type UiStrings = {
  /** Popisky nad nadpisy sekcí. */
  labelRisks: string;
  labelServices: string;
  labelProcess: string;
  labelReferences: string;
  labelFaq: string;
  /** Mikropopisek u tlačítka v sekci Rizika. */
  freeInspection: string;
  /** Skryté popisky pro čtečky obrazovky a ovládání. */
  logoHome: string;
  footerNav: string;
  close: string;
  openMenu: string;
  closeMenu: string;
  callAria: string;
  compareAria: string;
  altBefore: string;
  altAfter: string;
  /** Popisky polí v e-mailu, který otevře formulář bez serveru. */
  mailName: string;
  mailPhone: string;
  /** Popisky faktů u referencí, podle kterých se vybírá ikona. */
  factArea: string[];
  factDuration: string[];
};

const UI_STRINGS: Record<Locale, UiStrings> = {
  cs: {
    labelRisks: "Rizika",
    labelServices: "Naše služby",
    labelProcess: "Náš postup",
    labelReferences: "Reference",
    labelFaq: "FAQ",
    freeInspection: "Prohlídka zdarma",
    logoHome: "Umyjeme Fasádu, domů",
    footerNav: "Patička",
    close: "Zavřít",
    openMenu: "Otevřít menu",
    closeMenu: "Zavřít menu",
    callAria: "Zavolat na",
    compareAria: "Porovnání fasády před vyčištěním a po vyčištění",
    altBefore: "Fasáda před čištěním",
    altAfter: "Fasáda po čištění",
    mailName: "Jméno",
    mailPhone: "Telefon",
    factArea: ["rozsah", "plocha", "m²"],
    factDuration: ["doba", "dní", "den"],
  },
  de: {
    labelRisks: "Risiken",
    labelServices: "Unsere Leistungen",
    labelProcess: "Unser Ablauf",
    labelReferences: "Referenzen",
    labelFaq: "FAQ",
    freeInspection: "Kostenlose Besichtigung",
    logoHome: "Waschen Fassade, zur Startseite",
    footerNav: "Fußzeile",
    close: "Schließen",
    openMenu: "Menü öffnen",
    closeMenu: "Menü schließen",
    callAria: "Anrufen unter",
    compareAria: "Vergleich der Fassade vor und nach der Reinigung",
    altBefore: "Fassade vor der Reinigung",
    altAfter: "Fassade nach der Reinigung",
    mailName: "Name",
    mailPhone: "Telefon",
    factArea: ["umfang", "fläche", "m²"],
    factDuration: ["dauer", "tage", "tag"],
  },
};

/** Texty rozhraní pro aktuální jazyk. */
export const UI: UiStrings = UI_STRINGS[LOCALE];

/* ------------------------- meta tagy v hlavičce ------------------------- */

/**
 * Značka pro každou mutaci. Česky „Umyjeme Fasádu", německy „Waschen Fassade"
 * — obě mají stejného maskota, liší se jen nápis v logu. Odtud se skládají
 * titulky, og:site_name i `alt` u loga, aby to bylo na jednom místě.
 */
const BRAND: Record<Locale, string> = {
  cs: "Umyjeme Fasádu",
  de: "Waschen Fassade",
};

type DocumentMeta = {
  htmlLang: string;
  /** Jméno značky — og:site_name, titulky, alt loga. */
  siteName: string;
  title: string;
  description: string;
  ogLocale: string;
  ogTitle: string;
  ogDescription: string;
  ogImageAlt: string;
  twitterTitle: string;
  twitterDescription: string;
  /** Obrázek pro náhledy odkazů, relativně ke kořeni webu. */
  ogImage: string;
  /** Popis firmy ve strukturovaných datech LocalBusiness. */
  businessDescription: string;
  areaServed: string;
  knowsAbout: string[];
};

const CS_TITLE = `${BRAND.cs} | profesionální mytí fasád, střech a dlažby`;
const DE_TITLE = `${BRAND.de} | professionelle Fassaden-, Dach- und Pflasterreinigung`;

const DOCUMENT_META: Record<Locale, DocumentMeta> = {
  cs: {
    htmlLang: "cs",
    siteName: BRAND.cs,
    title: CS_TITLE,
    description:
      "Profesionální tlakové mytí a čištění fasád, střech a dlažby. Bez drahé rekonstrukce, s nezávaznou nabídkou zdarma.",
    ogLocale: "cs_CZ",
    ogTitle: CS_TITLE,
    ogDescription:
      "Profesionální mytí a čištění fasád, střech a dlažby. Tlakové mytí, nanoimpregnace a férový přístup. Nezávazná nabídka zdarma.",
    ogImageAlt: CS_TITLE,
    twitterTitle: CS_TITLE,
    twitterDescription:
      "Profesionální mytí a čištění fasád, střech a dlažby. Nezávazná nabídka zdarma.",
    ogImage: "/og-image.png",
    businessDescription:
      "Profesionální tlakové mytí a čištění fasád, střech a dlažby. Nezávazná nabídka zdarma.",
    areaServed: "Hodonín, Jihomoravský kraj a okolí do 100 km",
    knowsAbout: [
      "mytí fasád",
      "čištění střech",
      "čištění dlažby",
      "odstranění graffiti",
      "nanoimpregnace",
    ],
  },
  de: {
    htmlLang: "de",
    siteName: BRAND.de,
    title: DE_TITLE,
    description:
      "Professionelle Hochdruckreinigung von Fassaden, Dächern und Pflaster. Ohne teure Sanierung, mit kostenlosem und unverbindlichem Angebot.",
    ogLocale: "de_DE",
    ogTitle: DE_TITLE,
    ogDescription:
      "Professionelle Reinigung von Fassaden, Dächern und Pflaster. Hochdruckreinigung, Nanoimprägnierung und ein fairer Umgang. Kostenloses Angebot.",
    ogImageAlt: DE_TITLE,
    twitterTitle: DE_TITLE,
    twitterDescription:
      "Professionelle Reinigung von Fassaden, Dächern und Pflaster. Kostenloses und unverbindliches Angebot.",
    ogImage: "/og-image.de.png",
    businessDescription:
      "Professionelle Hochdruckreinigung von Fassaden, Dächern und Pflaster. Kostenloses und unverbindliches Angebot.",
    areaServed: "Hodonín, Südmähren und Umgebung im Umkreis von 100 km",
    knowsAbout: [
      "Fassadenreinigung",
      "Dachreinigung",
      "Pflasterreinigung",
      "Graffitientfernung",
      "Nanoimprägnierung",
    ],
  },
};

/** Meta tagy pro aktuální jazyk. */
export const META: DocumentMeta = DOCUMENT_META[LOCALE];

/** Jméno značky pro aktuální jazyk. */
export const BRAND_NAME = META.siteName;
