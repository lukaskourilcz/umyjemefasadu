import SectionHeading from "./SectionHeading";
import { useContent } from "../content";

export default function Team() {
  const { heading, intro, image, imageAlt, members: MEMBERS } = useContent().team;
  return (
    <section id="tym" className="scroll-mt-24 py-20 md:py-28">
      <div className="container-page grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading align="left" title={heading} intro={intro} />
          <img
            src={image}
            alt={imageAlt}
            loading="lazy"
            className="mt-10 w-full max-w-[440px] rounded-[14px] border object-cover fade-up"
            style={{
              borderColor: "var(--color-eucalyptus)",
              aspectRatio: "4 / 3",
              objectPosition: "50% 72%",
            }}
          />
        </div>

        <ul
          className="flex flex-col border-t fade-up lg:mt-16"
          style={{ borderColor: "var(--color-eucalyptus)" }}
        >
          {MEMBERS.map((m) => (
            <li
              key={m.name}
              className="border-b py-7"
              style={{ borderColor: "var(--color-eucalyptus)" }}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-botanical-ink" style={{ fontSize: "20px", fontWeight: 700 }}>
                  {m.name}
                </h3>
                <span
                  className="font-fragment-mono text-forest-floor"
                  style={{ fontSize: "13px", letterSpacing: "0.02em" }}
                >
                  {m.exp}
                </span>
              </div>
              <div className="micro-label mt-1 text-botanical-ink/60">{m.role}</div>
              <p
                className="mt-3 max-w-[52ch] text-botanical-ink/75"
                style={{ fontSize: "15px", lineHeight: 1.6 }}
              >
                {m.bio}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
