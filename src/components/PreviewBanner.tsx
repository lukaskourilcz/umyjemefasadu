import { exitPreview, isPreview } from "../content";

/**
 * Proužek nahoře, který upozorní, že web zobrazuje NEULOŽENÝ náhled změn
 * z administrace (jen v tomto prohlížeči). Na živém webu se nikdy neukáže.
 */
export default function PreviewBanner() {
  if (!isPreview()) return null;

  return (
    <div
      className="sticky top-0 z-[60] flex items-center justify-center gap-3 px-4 py-2 text-center"
      style={{ backgroundColor: "#e6007e", color: "#fff", fontSize: "13px" }}
    >
      <span style={{ fontWeight: 700 }}>Náhled neuložených změn</span>
      <span style={{ opacity: 0.9 }}>Tento pohled vidíte jen vy.</span>
      <button
        type="button"
        onClick={() => {
          exitPreview();
          window.location.reload();
        }}
        className="rounded-full px-3 py-1"
        style={{
          backgroundColor: "rgba(255,255,255,0.2)",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Ukončit náhled
      </button>
    </div>
  );
}
