import { useState } from "react";
import type { FormEvent } from "react";
import { CheckIcon } from "./icons";
import { useContent, phoneHref, emailHref } from "../content";

type Status = "idle" | "sending" | "sent" | "error";

function buildMailto(data: FormData, email: string) {
  const subject = "Poptávka z webu umyjemefasadu.cz";
  const body = [
    `Jméno: ${data.get("name") ?? ""}`,
    `Telefon: ${data.get("phone") ?? ""}`,
    "",
    `${data.get("message") ?? ""}`,
  ].join("\n");
  return `${emailHref(email)}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
}

export default function Contact() {
  const { business, contact } = useContent();
  const PROMISES = contact.promises;
  const AREAS = contact.areas;
  const FORM_ENDPOINT = contact.formEndpoint;
  const emailLink = emailHref(business.email);
  const phoneLink = phoneHref(business.phone);
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    if (!FORM_ENDPOINT) {
      window.location.href = buildMailto(data, business.email);
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (!res.ok) throw new Error(`form endpoint ${res.status}`);
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="kontakt" className="scroll-mt-24 py-20 md:py-28">
      <div className="container-page">
        {/* The page's closing dark moment - grounds the layout and makes the
            conversion point unmissable. */}
        <div
          className="fade-up overflow-hidden rounded-[12px] px-6 py-10 sm:px-8 md:p-14"
          style={{ backgroundColor: "var(--color-botanical-ink)" }}
        >
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-14">
            <div className="flex flex-col items-start">
              <h2
                className="text-cream-paper"
                style={{
                  fontWeight: 500,
                  fontSize: "clamp(26px, 4vw, 40px)",
                  lineHeight: 1.08,
                  maxWidth: "18ch",
                }}
              >
                {contact.heading}
              </h2>
              <p
                className="mt-5 text-cream-paper/70"
                style={{ fontSize: "var(--text-body)", lineHeight: 1.65, maxWidth: "44ch" }}
              >
                {contact.body}
              </p>

              <ul className="mt-7 flex flex-col gap-2.5">
                {PROMISES.map((p) => (
                  <li key={p} className="flex items-center gap-2.5">
                    <CheckIcon size={16} color="var(--color-forest-floor)" />
                    <span className="text-cream-paper/85" style={{ fontSize: "15px" }}>
                      {p}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-7">
                <span className="micro-label text-cream-paper/50">
                  {contact.areasLabel}
                </span>
                <p
                  className="font-fragment-mono mt-2 text-cream-paper/80"
                  style={{ fontSize: "14px", letterSpacing: "0.02em" }}
                >
                  {AREAS.join(" · ")}
                </p>
              </div>

              <div className="mt-9 flex flex-col gap-4">
                <a href={phoneLink} className="group flex flex-col">
                  <span className="micro-label text-cream-paper/50">
                    {contact.phoneLabel}
                  </span>
                  <span
                    className="font-bold text-cream-paper transition-colors group-hover:text-forest-floor"
                    style={{ fontSize: "clamp(20px, 3vw, 26px)" }}
                  >
                    {business.phone}
                  </span>
                  <span
                    className="font-fragment-mono text-cream-paper/50"
                    style={{ fontSize: "12px", letterSpacing: "0.02em" }}
                  >
                    {contact.hours}
                  </span>
                </a>
                <a href={emailLink} className="group flex flex-col">
                  <span className="micro-label text-cream-paper/50">
                    {contact.emailLabel}
                  </span>
                  <span
                    className="font-bold text-cream-paper transition-colors group-hover:text-forest-floor"
                    style={{ fontSize: "clamp(17px, 2.4vw, 22px)" }}
                  >
                    {business.email}
                  </span>
                </a>
              </div>
            </div>

            {status === "sent" ? (
              <div className="flex flex-col items-start justify-center gap-4">
                <CheckIcon size={32} color="var(--color-forest-floor)" />
                <h3
                  className="text-cream-paper"
                  style={{ fontSize: "24px", fontWeight: 700 }}
                >
                  {contact.sentTitle}
                </h3>
                <p
                  className="text-cream-paper/70"
                  style={{ fontSize: "16px", lineHeight: 1.6, maxWidth: "40ch" }}
                >
                  {contact.sentBody}{" "}
                  <a href={phoneLink} className="underline text-cream-paper">
                    {business.phone}
                  </a>
                </p>
              </div>
            ) : (
              <form className="flex flex-col gap-4" onSubmit={onSubmit}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5">
                    <span className="micro-label text-cream-paper/60">
                      {contact.formNameLabel}
                    </span>
                    <input
                      type="text"
                      name="name"
                      required
                      autoComplete="name"
                      placeholder="Jan Novák"
                      className="input-dark"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="micro-label text-cream-paper/60">
                      {contact.formPhoneLabel}
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      required
                      autoComplete="tel"
                      placeholder="+420 …"
                      className="input-dark"
                    />
                  </label>
                </div>
                <label className="flex flex-col gap-1.5">
                  <span className="micro-label text-cream-paper/60">
                    {contact.formMessageLabel}
                  </span>
                  <textarea
                    name="message"
                    rows={5}
                    placeholder={contact.formMessagePlaceholder}
                    className="input-dark resize-y"
                  />
                </label>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="btn-primary mt-2 w-full disabled:opacity-60 sm:w-auto"
                >
                  {status === "sending" ? "Odesílám…" : contact.formSubmit}
                </button>
                {status === "error" && (
                  <p className="text-cream-paper" style={{ fontSize: "14px" }}>
                    Odeslání se nepovedlo. Zkuste to prosím znovu, nebo nám
                    napište na{" "}
                    <a href={emailLink} className="underline">
                      {business.email}
                    </a>
                    .
                  </p>
                )}
                <p className="text-cream-paper/50" style={{ fontSize: "13px" }}>
                  {contact.consent}
                  {!FORM_ENDPOINT &&
                    " Formulář otevře váš e-mail s předvyplněnou zprávou; žádná data se neukládají."}
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
