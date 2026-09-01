import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import type { Content } from "./schema";
import { defaultContent } from "./defaultContent";
import { contentFile, LOCALE, type Locale } from "../i18n";

export type { Content } from "./schema";
export { defaultContent } from "./defaultContent";

/**
 * Klíče v localStorage sdílené s administrací (náhled neuložených změn).
 * Každá jazyková mutace má vlastní klíče, aby se náhledy nepřepisovaly.
 */
const PREVIEW_FLAG_BASE = "uf_preview";
const PREVIEW_DATA_BASE = "uf_preview_content";

export function previewKeys(locale: Locale = LOCALE): {
  flag: string;
  data: string;
} {
  const suffix = locale === "cs" ? "" : `_${locale}`;
  return { flag: PREVIEW_FLAG_BASE + suffix, data: PREVIEW_DATA_BASE + suffix };
}

type Json = unknown;

/**
 * Hloubkové sloučení: objekty se spojují po klíčích, pole a primitivní hodnoty
 * se přepisují (takže úprava seznamu v administraci nahradí celý seznam).
 * Chybějící klíče v override doplní hodnoty z base — díky tomu funguje web
 * i po přidání nového pole do kódu, které ještě není v uloženém content.json.
 */
function deepMerge<T extends Json>(base: T, override: Json): T {
  if (
    base &&
    typeof base === "object" &&
    !Array.isArray(base) &&
    override &&
    typeof override === "object" &&
    !Array.isArray(override)
  ) {
    const out: Record<string, Json> = { ...(base as Record<string, Json>) };
    for (const key of Object.keys(override as Record<string, Json>)) {
      out[key] = deepMerge(
        (base as Record<string, Json>)[key],
        (override as Record<string, Json>)[key],
      );
    }
    return out as T;
  }
  // Pole i primitivní hodnoty: použij override, pokud existuje.
  return (override === undefined ? base : (override as T)) as T;
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

/** Sloučí uložený/odeslaný obsah nad výchozí strukturou. */
export function mergeContent(override: Json): Content {
  return deepMerge(clone(defaultContent), override);
}

/**
 * Načte živý obsah dané jazykové mutace: výchozí data → přepis z
 * `public/content.json` (resp. `content.de.json`) → (volitelně) náhled
 * neuložených změn z administrace.
 *
 * Chybějící klíče v jazykové mutaci doplní český výchozí obsah, takže nově
 * přidané pole nikdy nerozbije web — jen se do doplnění zobrazí česky.
 */
export async function loadContent(locale: Locale = LOCALE): Promise<Content> {
  let merged: Content = clone(defaultContent);

  try {
    const res = await fetch(`${contentFile(locale)}?v=${Date.now()}`, {
      cache: "no-store",
    });
    if (res.ok) {
      merged = mergeContent(await res.json());
    }
  } catch {
    // Síť selhala — použijeme výchozí obsah (web se vždy zobrazí).
  }

  // Náhled neuložených změn z administrace (jen v tomto prohlížeči).
  const keys = previewKeys(locale);
  try {
    if (localStorage.getItem(keys.flag) === "1") {
      const draft = localStorage.getItem(keys.data);
      if (draft) merged = mergeContent(JSON.parse(draft));
    }
  } catch {
    // localStorage nedostupný — ignorujeme.
  }

  return merged;
}

const ContentContext = createContext<Content>(defaultContent);

export function ContentProvider({
  value,
  children,
}: {
  value: Content;
  children: ReactNode;
}) {
  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
}

/** Přístup k obsahu webu kdekoli v komponentách. */
export function useContent(): Content {
  return useContext(ContentContext);
}

/** Odvozené kontaktní odkazy z telefonu/e-mailu. */
export function phoneHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function emailHref(email: string): string {
  return `mailto:${email}`;
}

/** Je zapnutý režim náhledu neuložených změn? */
export function isPreview(): boolean {
  try {
    return localStorage.getItem(previewKeys().flag) === "1";
  } catch {
    return false;
  }
}

/** Vypne náhled a znovu načte web s publikovaným obsahem. */
export function exitPreview(): void {
  try {
    const keys = previewKeys();
    localStorage.removeItem(keys.flag);
    localStorage.removeItem(keys.data);
  } catch {
    // ignore
  }
}
