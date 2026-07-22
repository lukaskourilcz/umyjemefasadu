import { createContext, useContext, type ReactNode } from "react";
import type { Content } from "./schema";
import { defaultContent } from "./defaultContent";

export type { Content } from "./schema";
export { defaultContent } from "./defaultContent";

/** Klíče v localStorage sdílené s administrací (náhled neuložených změn). */
export const PREVIEW_FLAG = "uf_preview";
export const PREVIEW_DATA = "uf_preview_content";

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
 * Načte živý obsah: výchozí data → přepis z `public/content.json` →
 * (volitelně) náhled neuložených změn z administrace.
 */
export async function loadContent(): Promise<Content> {
  let merged: Content = clone(defaultContent);
  let hasInlineContent = false;

  try {
    const inline = document.getElementById("initial-content")?.textContent;
    if (inline) {
      merged = mergeContent(JSON.parse(inline));
      hasInlineContent = true;
    }
  } catch {
    // Poškozený inline obsah nesmí zablokovat bezpečný síťový fallback.
  }

  if (!hasInlineContent) {
    try {
      const res = await fetch("/content.json", { cache: "no-cache" });
      if (res.ok) {
        merged = mergeContent(await res.json());
      }
    } catch {
      // Síť selhala — použijeme výchozí obsah (web se vždy zobrazí).
    }
  }

  // Náhled neuložených změn z administrace (jen v tomto prohlížeči).
  try {
    if (localStorage.getItem(PREVIEW_FLAG) === "1") {
      const draft = localStorage.getItem(PREVIEW_DATA);
      if (draft) merged = mergeContent(JSON.parse(draft));
    }
  } catch {
    // localStorage nedostupný — ignorujeme.
  }

  return merged;
}

const ContentContext = createContext<Content>(defaultContent);

export function ContentProvider({ value, children }: { value: Content; children: ReactNode }) {
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
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
    return localStorage.getItem(PREVIEW_FLAG) === "1";
  } catch {
    return false;
  }
}

/** Vypne náhled a znovu načte web s publikovaným obsahem. */
export function exitPreview(): void {
  try {
    localStorage.removeItem(PREVIEW_FLAG);
    localStorage.removeItem(PREVIEW_DATA);
  } catch {
    // ignore
  }
}
