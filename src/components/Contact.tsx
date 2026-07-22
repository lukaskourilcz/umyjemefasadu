import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { CheckIcon } from "./icons";
import { useContent, phoneHref, emailHref } from "../content";

type Status = "idle" | "sending" | "sent" | "error";
type Errors = Partial<Record<"name" | "phone", string>>;

function buildMailto(data: FormData, email: string, subject: string) {
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
  const [errors, setErrors] = useState<Errors>({});
  const sentRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "sent") sentRef.current?.focus();
  }, [status]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const nextErrors: Errors = {};
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();

    if (name.length < 2) nextErrors.name = "Napište prosím své jméno.";
    if (phone.replace(/\D/g, "").length < 9) {
      nextErrors.phone = "Zadejte prosím platné telefonní číslo.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      window.requestAnimationFrame(() =>
        (nextErrors.name ? nameRef.current : phoneRef.current)?.focus(),
      );
      return;
    }

    if (!FORM_ENDPOINT) {
      window.location.href = buildMailto(
        data,
        business.email,
        contact.mailtoSubject,
      );
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data.entries())),
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
              <div
                ref={sentRef}
                role="status"
                tabIndex={-1}
                className="flex flex-col items-start justify-center gap-4 outline-none"
              >
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
              <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
                <div hidden aria-hidden="true">
                  <label htmlFor="contact-website">Web</label>
                  <input id="contact-website" type="text" name="website" tabIndex={-1} autoComplete="off" />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label htmlFor="contact-name" className="flex flex-col gap-1.5">
                    <span className="micro-label text-cream-paper/60">
                      {contact.formNameLabel}
                    </span>
                    <input
                      ref={nameRef}
                      id="contact-name"
                      type="text"
                      name="name"
                      autoComplete="name"
                      placeholder={contact.formNamePlaceholder}
                      className="input-dark"
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "contact-name-error" : undefined}
                      onChange={() => errors.name && setErrors((current) => ({ ...current, name: undefined }))}
                    />
                    {errors.name && (
                      <span id="contact-name-error" className="text-sm text-white" role="alert">
                        {errors.name}
                      </span>
                    )}
                  </label>
                  <label htmlFor="contact-phone" className="flex flex-col gap-1.5">
                    <span className="micro-label text-cream-paper/60">
                      {contact.formPhoneLabel}
                    </span>
                    <input
                      ref={phoneRef}
                      id="contact-phone"
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder={contact.formPhonePlaceholder}
                      className="input-dark"
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={errors.phone ? "contact-phone-error" : undefined}
                      onChange={() => errors.phone && setErrors((current) => ({ ...current, phone: undefined }))}
                    />
                    {errors.phone && (
                      <span id="contact-phone-error" className="text-sm text-white" role="alert">
                        {errors.phone}
                      </span>
                    )}
                  </label>
                </div>
                <label htmlFor="contact-message" className="flex flex-col gap-1.5">
                  <span className="micro-label text-cream-paper/60">
                    {contact.formMessageLabel}
                  </span>
                  <textarea
                    id="contact-message"
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
                  {status === "sending" ? contact.formSending : contact.formSubmit}
                </button>
                {status === "error" && (
                  <p role="alert" className="text-cream-paper" style={{ fontSize: "14px" }}>
                    {contact.formError}{" "}
                    <a href={emailLink} className="underline">
                      {business.email}
                    </a>
                  </p>
                )}
                <p className="text-cream-paper/50" style={{ fontSize: "13px" }}>
                  {contact.consent}
                  {!FORM_ENDPOINT && ` ${contact.mailtoNote}`}
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
