const RESEND_URL = "https://api.resend.com/emails";

function clean(value, max) {
  return String(value ?? "").replace(/[<>]/g, "").trim().slice(0, max);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Použijte POST." });
    return;
  }

  const payload = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});

  // Invisible honeypot: bots usually fill it, people never see it.
  if (payload.website) {
    res.status(200).json({ ok: true });
    return;
  }

  const name = clean(payload.name, 100);
  const phone = clean(payload.phone, 40);
  const message = clean(payload.message, 3000);

  if (name.length < 2 || phone.replace(/\D/g, "").length < 9) {
    res.status(400).json({ error: "Doplňte prosím jméno a platné telefonní číslo." });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: "Odesílání formuláře zatím není nakonfigurováno." });
    return;
  }

  const recipient = process.env.CONTACT_EMAIL || "info@umyjemefasadu.cz";
  const sender = process.env.CONTACT_FROM || "Umyjeme Fasádu <onboarding@resend.dev>";
  const text = [
    "Nová poptávka z webu umyjemefasadu.cz",
    "",
    `Jméno: ${name}`,
    `Telefon: ${phone}`,
    "",
    "Požadavek:",
    message || "Neuvedeno",
  ].join("\n");

  try {
    const response = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: sender,
        to: [recipient],
        subject: `Nová poptávka – ${name}`,
        text,
        reply_to: recipient,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("Resend contact error", response.status, detail.slice(0, 500));
      throw new Error("Email provider rejected the request");
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Contact form error", error);
    res.status(502).json({ error: "Poptávku se nepodařilo odeslat." });
  }
}
