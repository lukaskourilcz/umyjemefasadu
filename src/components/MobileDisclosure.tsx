import { useEffect, useState } from "react";
import type { ReactNode } from "react";

export default function MobileDisclosure({ label, children }: { label: string; children: ReactNode }) {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  if (!mobile) return <>{children}</>;

  return (
    <details className="mobile-disclosure fade-up">
      <summary>
        <span>{label}</span>
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path d="M4 7 L9 12 L14 7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>
      <div className="mobile-disclosure-panel">{children}</div>
    </details>
  );
}
