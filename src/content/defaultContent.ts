import type { Content } from "./schema";
import data from "./defaultContent.json";

/**
 * Výchozí obsah webu (data v `defaultContent.json`). Slouží jako:
 *  1) záložní data, kdyby se `public/content.json` nepodařilo načíst,
 *  2) výchozí hodnoty pro administraci (tlačítko „Obnovit původní").
 *
 * `public/content.json` startuje jako přesná kopie tohoto souboru; administrace
 * pak přepisuje `content.json`, tento soubor zůstává beze změny.
 */
export const defaultContent = data as Content;
