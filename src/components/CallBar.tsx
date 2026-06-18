import { useEffect, useState } from "react";

/**
 * Sticky mobile action bar — phone is the primary conversion path, so it
 * stays one tap away. Appears only on small screens, and only after the user
 * scrolls past the hero so it never covers the hero's own CTAs.
 */
export default function CallBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 md:hidden"
      style={{
        transform: show ? "translateY(0)" : "translateY(120%)",
        transition: "transform 0.3s ease",
        paddingBottom: "env(safe-area-inset-bottom)",
        backgroundColor: "rgba(251,253,254,0.92)",
        backdropFilter: "blur(10px)",
        borderTop: "1px solid var(--color-lichen)",
      }}
    >
      <div className="flex items-center gap-3 p-3">
        <a
          href="tel:+420775222760"
          className="btn-primary flex-1"
          aria-label="Zavolat na +420 775 222 760"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path
              d="M3 3 C 3 9, 7 13, 13 13 L13 10.5 L10 9.5 L8.5 11 C 7 10, 6 9, 5 7.5 L6.5 6 L5.5 3 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>
          Zavolat
        </a>
        <a href="#kontakt" className="btn-ghost flex-1">
          Poptávka
        </a>
      </div>
    </div>
  );
}
