# K dořešení / ke kontrole (od klienta)

Seznam věcí, které je potřeba ještě ověřit nebo doplnit reálnými údaji.
Většinu z toho jde upravit přímo v administraci na `/dev`.

---

## Úkoly

Každý úkol má jednořádkové „proč" a skóre důležitosti `[imp:N]` (5 = nejvyšší).
Podrobnosti jsou v sekcích níže.

- [ ] **Nahradit ukázkové fotky v „Vybrané zakázky" reálnými** — placeholder fotky u nové firmy působí nedůvěryhodně. `[imp:3]` `[owner:me]`
- [ ] **Potvrdit, která část textu v sekci Služby se má odstranit** — klient chtěl smazat žlutě označený text, barvy jsme neměli. `[imp:2]` `[owner:me]`
- [ ] **Zapnout vypnuté sekce, až budou reálná data** — smyšlená čísla a reference by nové firmě spíš uškodily. `[imp:2]` `[owner:me]`
- [ ] **Sladit starší znění FAQ a kontaktů s aktuálními texty** — kvůli SEO; nemá vliv na to, co vidí návštěvník. `[imp:2]` `[owner:ai]`

---

## Podrobnosti

### Sekce Služby — text ke kontrole

Klient chtěl smazat text, který byl v jeho dokumentu označen žlutě.
Barvy jsme neměli k dispozici, takže text zůstal nezměněný:
„Důkladné tlakové čištění dlažby, teras, chodníků a zámkové dlažby.
Odstraníme zelený povlak, mech i zašlou špínu ze spár."
→ Potřeba potvrdit, která část se má odstranit (sekce Služby v `/dev`).

### Vybrané zakázky — reálná data

Zakázky jsou zatím ukázkové (placeholder). Klient doplní telefonicky /
v administraci reálné údaje — hlavně **fotky** nahradit reálnými.
(Doba trvání byla dle přání odstraněna úplně.)

### Vypnuté sekce (lze zapnout v `/dev`)

Reference (fotka, jméno/role, text) a čísla za sezónu jsou vypnuté, protože
smyšlená čísla by u nové firmy uškodila. Zapnout, až budou reálná čísla za sezónu.

### Doporučení — SEO

Údaj se změnil (dřív bylo 24 měsíců) — změna je v sekci „Proč my".
Starší znění FAQ a kontaktů je pro dokonalé SEO vhodné sladit s aktuálními
texty (nemá vliv na to, co vidí návštěvník na stránce).
