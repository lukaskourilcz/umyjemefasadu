export default function SectionHeading({
  label,
  title,
  intro,
  align = "center",
}: {
  label: string;
  title: string;
  intro?: string;
  align?: "center" | "left";
}) {
  const alignment = align === "center" ? "items-center text-center" : "items-start text-left";
  return (
    <div className={`flex flex-col ${alignment} fade-up`}>
      <span className="micro-label mb-4 text-botanical-ink/70">{label}</span>
      <h2
        className="font-akkurat text-botanical-ink"
        style={{
          fontWeight: 400,
          fontSize: "clamp(25px, 4.4vw, 47px)",
          lineHeight: 1.02,
          letterSpacing: "-1.4px",
          maxWidth: "20ch",
        }}
      >
        {title}
      </h2>
      {intro && (
        <p
          className="font-akkurat mt-5 text-botanical-ink/75"
          style={{
            fontSize: "18px",
            lineHeight: 1.67,
            letterSpacing: "-0.72px",
            maxWidth: "56ch",
          }}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
