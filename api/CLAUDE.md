# Pravidla pro API

- Produkce bez povinných secrets selže uzavřeně; žádná výchozí hesla.
- Admin používá serverově ověřenou HttpOnly, Secure, SameSite=Strict session,
  kontrolu Origin a CSRF odolné mutace.
- Omezujte velikost těla, uploadů a počet souborů; kontrolujte cestu, MIME,
  příponu, base64 a signaturu. Chyby jsou konzistentní a bez detailů provideru.
- Validujte kontaktní data, honeypot, metodu a Content-Type; počítejte s abuse.
- GitHub zápis musí ověřit aktuální head a nesmí force-přepsat novější commit.
- Čisté validátory exportujte pro unit testy, handler testujte s mockovanou sítí.
