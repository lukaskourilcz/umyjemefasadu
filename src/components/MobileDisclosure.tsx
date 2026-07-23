import type { ReactNode } from "react";

/**
 * Dříve skládací panel na mobilu. Nyní vždy vykreslí obsah, aby mobilní verze
 * ukazovala úplně stejný obsah jako desktop (žádné „zobrazit více"). Ponecháno
 * jako tenký wrapper, ať se nemusí měnit volající místa — `label` zůstává v
 * typu kvůli zpětné kompatibilitě, ale už se nepoužívá.
 */
export default function MobileDisclosure({
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return <>{children}</>;
}
