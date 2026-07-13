# K dořešení / ke kontrole (od klienta)

Seznam věcí, které je potřeba ještě ověřit nebo doplnit reálnými údaji.
Většinu z toho jde upravit přímo v administraci na `/dev`.

## Ke kontrole

- [ ] **Karta „Čištění dlažby a chodníků" — „žlutý text"**
  Klient chtěl smazat text, který byl v jeho dokumentu označen žlutě.
  Barvy jsme neměli k dispozici, takže text zůstal nezměněný:
  „Důkladné tlakové čištění dlažby, teras, chodníků a zámkové dlažby.
  Odstraníme zelený povlak, mech i zašlou špínu ze spár."
  → Potřeba potvrdit, která část se má odstranit (Sekce Služby v `/dev`).

## Reálná data k doplnění (sekce „Vybrané zakázky")

Zakázky jsou zatím ukázkové (placeholder). Klient doplní telefonicky /
v administraci reálné údaje:

- [ ] **Typ objektu** — změnit na to, co to doopravdy bylo.
- [ ] **Lokality** (města) — reálné.
- [ ] **Rozsah (m²)** — reálné plochy.
- [ ] **Popisy zakázek** — nahradit „lorem ipsum" skutečným textem.
- [ ] **Fotky** — nahradit ukázkové fotky reálnými.
- (Doba trvání byla dle přání odstraněna úplně.)

## Vypnuté sekce (lze zapnout v `/dev`)

- [ ] **Náš tým** — vypnuto. Zapnout přepínačem „Zobrazit sekci na webu"
  a doplnit reálnou fotku, jméno/roli a text.
- [ ] **Čísla / statistiky** (m² ploch, zakázky, města, praxe) — vypnuto,
  protože smyšlená čísla by u nové firmy uškodila. Zapnout, až budou
  reálná čísla za sezónu.

## Doporučení

- [ ] **Záruka 60 měsíců** — ověřit, že opravdu chcete deklarovat 5 let
  (dřív bylo 24 měsíců). Změna je v sekci „Proč my".
- [ ] **Strukturovaná data v `index.html`** (JSON-LD pro Google) obsahují
  starší znění FAQ a kontakty. Pro dokonalé SEO je vhodné je sladit s
  aktuálními texty (nemá vliv na to, co vidí návštěvník na stránce).
