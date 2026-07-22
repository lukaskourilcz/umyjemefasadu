# Pravidla pro administraci

- `/dev` musí zůstat srozumitelný netechnickému majiteli a kompletně ovladatelný
  klávesnicí.
- Nikdy nekontrolujte ani neuchovávejte produkční heslo v klientu. Autorizaci
  potvrzuje server pomocí bezpečné HttpOnly session.
- Upload před odesláním omezuje typ, počet a velikost; server vše znovu ověří.
- Zachovejte draft, preview, backup a GitHub publishing workflow.
- Nová editovatelná pole potřebují český label/help a odpovídající schema test.
