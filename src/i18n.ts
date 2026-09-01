/**
 * Jazykové mutace webu.
 *
 * Web běží na jediné adrese a jazyk se pozná z URL:
 *   - `/` (a cokoli mimo `/de`)  → čeština, obsah z `public/content.json`
 *   - `/de` a cokoli pod ním     → němčina, obsah z `public/content.de.json`
 *
 * Přepínač jazyků na webu záměrně NENÍ — návštěvník vidí jen tu mutaci,
 * přes kterou přišel. Až bude web dostupný i na německé doméně, stačí ji
 * nasměrovat (rewrite) na `/de` a nic dalšího se měnit nemusí.
 *
 * V tomto souboru žijí i texty, které nejsou v `content.json` (popisky sekcí,
 * `aria-label`y, hlavičkové meta tagy) — obsahové texty patří do content.json.
 */

export type Locale = "cs" | "de";

/** Cesty, na kterých web běží německy. */
const DE_SEGMENT = "de";

/** Jazyk podle cesty v URL. První segment `/de` = němčina, jinak čeština. */
export function detectLocale(pathname: string): Locale {
  const first = pathname.replace(/^\/+/, "").split("/")[0]?.toLowerCase();
  return first === DE_SEGMENT ? "de" : "cs";
}

/** Jazyk aktuálního zobrazení — určí se jednou při načtení stránky. */
export const LOCALE: Locale =
  typeof window === "undefined" ? "cs" : detectLocale(window.location.pathname);

/** Prefix cesty dané mutace: "" pro češtinu, "/de" pro němčinu. */
export function localePrefix(locale: Locale = LOCALE): string {
  return locale === "de" ? `/${DE_SEGMENT}` : "";
}

/** Domovská stránka dané mutace ("/" nebo "/de"). */
export function localeHome(locale: Locale = LOCALE): string {
  return localePrefix(locale) || "/";
}

/** Soubor s obsahem dané mutace (leží v `public/`). */
export function contentFile(locale: Locale = LOCALE): string {
  return locale === "de" ? "/content.de.json" : "/content.json";
}

/** Cesta k souboru v repozitáři — používá administrace při publikaci. */
export function contentRepoPath(locale: Locale = LOCALE): string {
  return `public${contentFile(locale)}`;
}

/** Cesta bez jazykového prefixu (např. „/de/dev" → „/dev"). */
export function stripLocale(pathname: string): string {
  const prefix = localePrefix(detectLocale(pathname));
  return prefix ? pathname.slice(prefix.length) || "/" : pathname;
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
    logoHome: "Umyjeme Fasádu, zur Startseite",
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

type DocumentMeta = {
  htmlLang: string;
  title: string;
  description: string;
  ogLocale: string;
  ogTitle: string;
  ogDescription: string;
  ogImageAlt: string;
  twitterTitle: string;
  twitterDescription: string;
  canonical: string;
  /** Popis firmy ve strukturovaných datech LocalBusiness. */
  businessDescription: string;
  areaServed: string;
  knowsAbout: string[];
};

const SITE = "https://www.umyjemefasadu.cz";

const DOCUMENT_META: Record<Locale, DocumentMeta> = {
  cs: {
    htmlLang: "cs",
    title: "Umyjeme Fasádu | profesionální mytí fasád, střech a dlažby",
    description:
      "Profesionální tlakové mytí a čištění fasád, střech a dlažby. Bez drahé rekonstrukce, s nezávaznou nabídkou zdarma.",
    ogLocale: "cs_CZ",
    ogTitle: "Umyjeme Fasádu | profesionální mytí fasád, střech a dlažby",
    ogDescription:
      "Profesionální mytí a čištění fasád, střech a dlažby. Tlakové mytí, nanoimpregnace a férový přístup. Nezávazná nabídka zdarma.",
    ogImageAlt: "Umyjeme Fasádu | profesionální mytí fasád, střech a dlažby",
    twitterTitle: "Umyjeme Fasádu | profesionální mytí fasád, střech a dlažby",
    twitterDescription:
      "Profesionální mytí a čištění fasád, střech a dlažby. Nezávazná nabídka zdarma.",
    canonical: `${SITE}/`,
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
    title: "Umyjeme Fasádu | professionelle Fassaden-, Dach- und Pflasterreinigung",
    description:
      "Professionelle Hochdruckreinigung von Fassaden, Dächern und Pflaster. Ohne teure Sanierung, mit kostenlosem und unverbindlichem Angebot.",
    ogLocale: "de_DE",
    ogTitle:
      "Umyjeme Fasádu | professionelle Fassaden-, Dach- und Pflasterreinigung",
    ogDescription:
      "Professionelle Reinigung von Fassaden, Dächern und Pflaster. Hochdruckreinigung, Nanoimprägnierung und ein fairer Umgang. Kostenloses Angebot.",
    ogImageAlt:
      "Umyjeme Fasádu | professionelle Fassaden-, Dach- und Pflasterreinigung",
    twitterTitle:
      "Umyjeme Fasádu | professionelle Fassaden-, Dach- und Pflasterreinigung",
    twitterDescription:
      "Professionelle Reinigung von Fassaden, Dächern und Pflaster. Kostenloses und unverbindliches Angebot.",
    canonical: `${SITE}/de`,
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
