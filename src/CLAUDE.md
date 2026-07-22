# Pravidla pro `src/`

- Veřejný obsah čtěte přes `useContent()`; nevkládejte obchodní údaje natvrdo.
- Znovu použijte existující komponentu/hook/helper nebo ji bezpečně zobecněte.
- Nové styly používají sémantické tokeny z `docs/DESIGN_SYSTEM.md`.
- Zachovejte strict TypeScript, sémantické HTML, focus a reduced-motion stav.
- Změny obsahu synchronizujte se schematem, defaulty, živým JSON a `/dev`.
- Admin zůstává dynamický import a nesmí zvětšit veřejný bundle.
