export default function SectionHeading({
  label,
  title,
  intro,
  align = "center",
  tone = "light",
}: {
  label?: string;
  title: string;
  intro?: string;
  align?: "center" | "left";
  tone?: "light" | "dark";
}) {
  const alignment =
    align === "center" ? "items-center text-center" : "items-start text-left";
  const dark = tone === "dark";
  return (
    <div className={`flex flex-col ${alignment} fade-up`}>
      {label && (
        <span
          className={`micro-label section-eyebrow mb-4 ${dark ? "section-eyebrow-dark" : ""}`}
        >
          {label}
        </span>
      )}
      <h2
        className={dark ? "text-cream-paper" : "text-botanical-ink"}
        style={{
          fontWeight: 600,
          fontSize: "clamp(28px, 4.8vw, 50px)",
          lineHeight: 1.05,
          maxWidth: "22ch",
        }}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={dark ? "text-cream-paper/70" : "text-botanical-ink/75"}
          style={{
            fontSize: "var(--text-body)",
            lineHeight: 1.65,
            maxWidth: "56ch",
            marginTop: "20px",
          }}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
