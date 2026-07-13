import { useEffect, useMemo, useRef, useState } from "react";
import type {
  CSSProperties,
  Dispatch,
  FormEvent,
  SetStateAction,
} from "react";
import type { Content } from "../content";
import {
  defaultContent,
  PREVIEW_DATA,
  PREVIEW_FLAG,
} from "../content";
import {
  SECTIONS,
  labelFor,
  MEDIA_KEYS,
  isMediaArrayKey,
  COLOR_KEYS,
} from "./labels";

const ADMIN_PW = "fasada";
const DRAFT_KEY = "uf_admin_draft";
const UNLOCK_KEY = "uf_admin_unlocked";

type Json = unknown;
type Path = (string | number)[];

/* ----------------------------- pomocné funkce ----------------------------- */

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

/** Nastaví hodnotu na dané cestě (immutabilně). */
function setIn(root: Json, path: Path, value: Json): Json {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  if (Array.isArray(root)) {
    const copy = root.slice();
    copy[head as number] = setIn(copy[head as number], rest, value);
    return copy;
  }
  const obj = { ...(root as Record<string, Json>) };
  obj[head as string] = setIn(obj[head as string], rest, value);
  return obj;
}

function isDataUrl(v: unknown): v is string {
  return typeof v === "string" && v.startsWith("data:");
}

function isVideo(src: string): boolean {
  return /^data:video/.test(src) || /\.(webm|mp4|mov|m4v)(\?|$)/i.test(src);
}

function extFromDataUrl(dataUrl: string): string {
  const mime = dataUrl.slice(5, dataUrl.indexOf(";"));
  const map: Record<string, string> = {
    "image/webp": "webp",
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/gif": "gif",
    "image/svg+xml": "svg",
    "video/webm": "webm",
    "video/mp4": "mp4",
    "video/quicktime": "mov",
  };
  return map[mime] ?? "bin";
}

/** Nahradí nahrané soubory (data URL) cestami a posbírá je k odeslání. */
function externalizeMedia(node: Json, uploads: { path: string; dataUrl: string }[]): Json {
  if (Array.isArray(node)) {
    return node.map((n) => externalizeMedia(n, uploads));
  }
  if (node && typeof node === "object") {
    const out: Record<string, Json> = {};
    for (const [k, v] of Object.entries(node as Record<string, Json>)) {
      out[k] = externalizeMedia(v, uploads);
    }
    return out;
  }
  if (isDataUrl(node)) {
    const ext = extFromDataUrl(node);
    // Deterministický, ale unikátní název: pořadí + délka + přípona.
    const name = `upload-${Date.now().toString(36)}-${uploads.length}.${ext}`;
    const path = `/media/${name}`;
    uploads.push({ path, dataUrl: node });
    return path;
  }
  return node;
}

/** Krátký otisk obsahu — koncept se váže ke konkrétní publikované verzi. */
function fingerprint(value: unknown): string {
  const s = JSON.stringify(value);
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return String(h);
}

// Otisk aktuálně publikované verze; nastavuje se při načtení administrace
// a po každé publikaci.
let draftBase = "";

function saveDraft(content: Content) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ base: draftBase, content }));
    return true;
  } catch {
    return false; // nejspíš překročena kapacita (velká videa)
  }
}

/**
 * Načte rozpracovaný koncept — ale jen pokud vznikl nad AKTUÁLNĚ publikovanou
 * verzí obsahu. Zastaralý koncept (např. z okna otevřeného před poslední
 * publikací) se zahodí; jinak by „Uložit a publikovat" tiše vrátilo na web
 * už smazaný nebo přepsaný obsah.
 */
function loadDraft(initial: Content): Content | null {
  draftBase = fingerprint(initial);
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { base?: string; content?: Content };
    if (!parsed || typeof parsed !== "object" || parsed.base !== draftBase) {
      localStorage.removeItem(DRAFT_KEY);
      return null;
    }
    return parsed.content ?? null;
  } catch {
    return null;
  }
}

function download(filename: string, text: string) {
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* ------------------------------- UI prvky --------------------------------- */

/** Úzká obrazovka (telefon)? Administrace se pak skládá pod sebe. */
function useNarrow(breakpoint = 860): boolean {
  const [narrow, setNarrow] = useState(
    () => window.matchMedia(`(max-width: ${breakpoint}px)`).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const onChange = () => setNarrow(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [breakpoint]);
  return narrow;
}

/** Výběr barvy: nativní color picker + hex hodnota vedle. */
function ColorInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const valid = /^#[0-9a-fA-F]{6}$/.test(value);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <input
        type="color"
        value={valid ? value : "#000000"}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: 44,
          height: 36,
          padding: 2,
          border: "1px solid #cbd5e1",
          borderRadius: 8,
          background: "#fff",
          cursor: "pointer",
        }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.trim())}
        spellCheck={false}
        style={{ ...s.input, width: 110 }}
      />
      {!valid && (
        <span style={{ color: "#dc2626", fontSize: 12 }}>
          Zadejte barvu jako #rrggbb
        </span>
      )}
    </div>
  );
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

function MediaInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const has = Boolean(value);
  const video = has && isVideo(value);
  const isNew = isDataUrl(value);

  async function pick(file?: File) {
    if (!file) return;
    setBusy(true);
    try {
      onChange(await readFileAsDataUrl(file));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={s.mediaWrap}>
      <div style={s.mediaPreview}>
        {has ? (
          video ? (
            <video
              src={value}
              muted
              loop
              playsInline
              autoPlay
              style={s.mediaEl}
            />
          ) : (
            <img src={value} alt="" style={s.mediaEl} />
          )
        ) : (
          <span style={{ color: "#94a3b8", fontSize: 13 }}>bez souboru</span>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
        <button
          type="button"
          style={s.btnSmall}
          disabled={busy}
          onClick={() => ref.current?.click()}
        >
          {busy ? "Nahrávám…" : has ? "Nahradit soubor" : "Nahrát soubor"}
        </button>
        <span style={s.mediaMeta}>
          {isNew ? "nový soubor (uloží se při publikaci)" : value || "—"}
        </span>
        <input
          ref={ref}
          type="file"
          accept="image/*,video/*"
          style={{ display: "none" }}
          onChange={(e) => pick(e.target.files?.[0])}
        />
      </div>
    </div>
  );
}

/* ------------------------------- Admin app -------------------------------- */

export default function Admin({ initialContent }: { initialContent: Content }) {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem(UNLOCK_KEY) === "1",
  );
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);
  const narrow = useNarrow();

  const [content, setContent] = useState<Content>(() => {
    const draft = loadDraft(initialContent);
    return draft ?? clone(initialContent);
  });
  const [status, setStatus] = useState<{ kind: "idle" | "ok" | "err" | "busy"; msg: string }>({
    kind: "idle",
    msg: "",
  });
  const [open, setOpen] = useState<string>(SECTIONS[0].key);

  const dirty = useMemo(
    () => JSON.stringify(content) !== JSON.stringify(initialContent),
    [content, initialContent],
  );

  function apply(path: Path, value: Json) {
    setContent((c) => {
      const next = setIn(c, path, value) as Content;
      saveDraft(next);
      return next;
    });
    setStatus({ kind: "idle", msg: "" });
  }

  function unlock(e: FormEvent) {
    e.preventDefault();
    // Tolerujeme mezery/nové řádky navíc (časté při kopírování hesla).
    if (pw.trim() === ADMIN_PW) {
      sessionStorage.setItem(UNLOCK_KEY, "1");
      setUnlocked(true);
      setPwError(false);
    } else {
      setPwError(true);
    }
  }

  async function publish() {
    setStatus({ kind: "busy", msg: "Ukládám a publikuji…" });
    const uploads: { path: string; dataUrl: string }[] = [];
    const out = externalizeMedia(clone(content), uploads) as Content;
    try {
      const res = await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw.trim() || ADMIN_PW, content: out, uploads }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || `Chyba serveru (${res.status})`);
      }
      // Po publikaci pracujeme dál s cestami místo data URL a koncept se
      // váže k právě publikované verzi.
      draftBase = fingerprint(out);
      setContent(out);
      saveDraft(out);
      setStatus({
        kind: "ok",
        msg: "Uloženo. Web se během cca 1–2 minut sám aktualizuje.",
      });
    } catch (err) {
      setStatus({
        kind: "err",
        msg:
          (err as Error).message +
          " — zkontrolujte nastavení (GITHUB_TOKEN, GITHUB_REPO) nebo velikost souborů.",
      });
    }
  }

  function preview() {
    try {
      localStorage.setItem(PREVIEW_DATA, JSON.stringify(content));
      localStorage.setItem(PREVIEW_FLAG, "1");
      window.open("/", "_blank");
    } catch {
      setStatus({
        kind: "err",
        msg: "Náhled se nepodařilo uložit (příliš velká videa). Publikaci to nebrání.",
      });
    }
  }

  function discard() {
    if (!confirm("Zahodit všechny neuložené změny a vrátit se k publikované verzi?")) return;
    const base = clone(initialContent);
    setContent(base);
    saveDraft(base);
    setStatus({ kind: "idle", msg: "" });
  }

  function resetOriginal() {
    if (!confirm("Obnovit VŠECHNY texty i fotky na původní (tovární) obsah? Změny se projeví až po publikaci.")) return;
    const base = clone(defaultContent);
    setContent(base);
    saveDraft(base);
    setStatus({ kind: "idle", msg: "" });
  }

  if (!unlocked) {
    return (
      <div style={s.gateWrap}>
        <form onSubmit={unlock} style={s.gateCard}>
          <h1 style={{ fontSize: 22, margin: 0 }}>Administrace webu</h1>
          <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>
            Zadejte heslo pro úpravu obsahu.
          </p>
          <input
            type="password"
            value={pw}
            autoFocus
            placeholder="Heslo"
            onChange={(e) => setPw(e.target.value)}
            style={s.input}
          />
          {pwError && (
            <span style={{ color: "#dc2626", fontSize: 13 }}>Nesprávné heslo.</span>
          )}
          <button type="submit" style={s.btnPrimary}>
            Vstoupit
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={s.appWrap}>
      <header style={s.topbar}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <strong style={{ fontSize: 16 }}>Administrace obsahu</strong>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: 12, color: "#93c5fd", textDecoration: "underline" }}
          >
            Zobrazit web ↗
          </a>
        </div>
        <div style={s.actions}>
          <button type="button" style={s.btnGhost} onClick={preview}>
            Náhled
          </button>
          <button
            type="button"
            style={s.btnGhost}
            onClick={() => download("content.json", JSON.stringify(content, null, 2))}
          >
            Stáhnout zálohu
          </button>
          <button type="button" style={s.btnGhost} onClick={discard} disabled={!dirty}>
            Zahodit změny
          </button>
          <button
            type="button"
            style={s.btnPrimary}
            onClick={publish}
            disabled={status.kind === "busy"}
          >
            {status.kind === "busy" ? "Ukládám…" : "Uložit a publikovat"}
          </button>
        </div>
      </header>

      {status.msg && (
        <div
          style={{
            ...s.banner,
            background:
              status.kind === "ok" ? "#052e16" : status.kind === "err" ? "#450a0a" : "#0c1a2e",
            color:
              status.kind === "ok" ? "#86efac" : status.kind === "err" ? "#fca5a5" : "#93c5fd",
          }}
        >
          {status.msg}
        </div>
      )}

      {/* Na telefonu se seznam sekcí položí vodorovně nad obsah (posouvá se
          prstem), na počítači zůstává jako boční sloupec. */}
      <div style={{ ...s.body, ...(narrow ? s.bodyNarrow : null) }}>
        <nav style={{ ...s.sidebar, ...(narrow ? s.sidebarNarrow : null) }}>
          {SECTIONS.map((sec) => (
            <button
              key={sec.key}
              type="button"
              onClick={() => setOpen(sec.key)}
              style={{
                ...s.navItem,
                ...(narrow ? s.navItemNarrow : null),
                ...(open === sec.key ? s.navItemActive : null),
              }}
            >
              {sec.title}
            </button>
          ))}
          <button
            type="button"
            style={{ ...s.navReset, ...(narrow ? s.navItemNarrow : null) }}
            onClick={resetOriginal}
          >
            Obnovit původní texty
          </button>
        </nav>

        <main style={{ ...s.main, ...(narrow ? s.mainNarrow : null) }}>
          {SECTIONS.filter((sec) => sec.key === open).map((sec) => (
            <section key={sec.key}>
              <h2 style={{ fontSize: 20, margin: "0 0 4px" }}>{sec.title}</h2>
              {sec.help && (
                <p style={{ color: "#64748b", fontSize: 13, margin: "0 0 20px" }}>
                  {sec.help}
                </p>
              )}
              {renderObject(
                (content as unknown as Record<string, Json>)[sec.key],
                [sec.key],
                apply,
                setContent,
                saveDraft,
              )}
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}

/* --------------------------- rekurzivní render ---------------------------- */

type Apply = (path: Path, value: Json) => void;
type SetContent = Dispatch<SetStateAction<Content>>;
type SaveDraft = (c: Content) => boolean;

function isMediaField(keyName: string): boolean {
  return MEDIA_KEYS.has(keyName);
}

function renderNode(
  value: Json,
  path: Path,
  keyName: string,
  apply: Apply,
  setContent: SetContent,
  saveDraft: SaveDraft,
): JSX.Element {
  if (Array.isArray(value)) {
    return renderArray(value, path, keyName, apply, setContent, saveDraft);
  }
  if (value && typeof value === "object") {
    return renderObject(value, path, apply, setContent, saveDraft);
  }
  if (typeof value === "boolean") {
    return (
      <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => apply(path, e.target.checked)}
          style={{ width: 18, height: 18 }}
        />
        <span style={{ fontSize: 14, color: "#334155" }}>
          {value ? "Zapnuto (zobrazuje se)" : "Vypnuto (skryto)"}
        </span>
      </label>
    );
  }
  const str = typeof value === "string" ? value : String(value ?? "");
  if (isMediaField(keyName)) {
    return <MediaInput value={str} onChange={(v) => apply(path, v)} />;
  }
  if (COLOR_KEYS.has(keyName)) {
    return <ColorInput value={str} onChange={(v) => apply(path, v)} />;
  }
  const long = str.length > 55 || /\n/.test(str);
  return long ? (
    <textarea
      value={str}
      onChange={(e) => apply(path, e.target.value)}
      style={s.textarea}
      rows={Math.min(8, Math.max(2, Math.ceil(str.length / 60)))}
    />
  ) : (
    <input
      type="text"
      value={str}
      onChange={(e) => apply(path, e.target.value)}
      style={s.input}
    />
  );
}

function renderObject(
  value: Json,
  path: Path,
  apply: Apply,
  setContent: SetContent,
  saveDraft: SaveDraft,
): JSX.Element {
  const entries = Object.entries((value ?? {}) as Record<string, Json>);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {entries.map(([k, v]) => {
        const nested = v && typeof v === "object";
        return (
          <div key={k} style={nested ? s.groupBlock : s.fieldBlock}>
            <label style={s.fieldLabel}>{labelFor(k)}</label>
            {renderNode(v, [...path, k], k, apply, setContent, saveDraft)}
          </div>
        );
      })}
    </div>
  );
}

function moveItem(
  path: Path,
  from: number,
  to: number,
  setContent: SetContent,
  saveDraft: SaveDraft,
) {
  setContent((c) => {
    const arr = getIn(c, path) as Json[];
    if (to < 0 || to >= arr.length) return c;
    const copy = arr.slice();
    const [it] = copy.splice(from, 1);
    copy.splice(to, 0, it);
    const next = setIn(c, path, copy) as Content;
    saveDraft(next);
    return next;
  });
}

function getIn(root: Json, path: Path): Json {
  return path.reduce<Json>((acc, k) => (acc as Record<string, Json>)?.[k as string], root);
}

function renderArray(
  value: Json[],
  path: Path,
  keyName: string,
  apply: Apply,
  setContent: SetContent,
  saveDraft: SaveDraft,
): JSX.Element {
  const isObjectList = value.some((v) => v && typeof v === "object");
  const mediaList = isMediaArrayKey(keyName);

  function mutate(fn: (arr: Json[]) => Json[]) {
    setContent((c) => {
      const arr = getIn(c, path) as Json[];
      const next = setIn(c, path, fn(arr.slice())) as Content;
      saveDraft(next);
      return next;
    });
  }

  function addItem() {
    mutate((arr) => {
      const template =
        arr.length > 0 ? clone(arr[arr.length - 1]) : isObjectList ? {} : "";
      return [...arr, template];
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {value.map((item, i) => (
        <div key={i} style={s.arrayItem}>
          <div style={s.arrayItemHead}>
            <span style={s.arrayItemTitle}>
              {isObjectList ? `Položka ${i + 1}` : ""}
            </span>
            <div style={{ display: "flex", gap: 4 }}>
              <button
                type="button"
                style={s.iconBtn}
                title="Nahoru"
                onClick={() => moveItem(path, i, i - 1, setContent, saveDraft)}
              >
                ↑
              </button>
              <button
                type="button"
                style={s.iconBtn}
                title="Dolů"
                onClick={() => moveItem(path, i, i + 1, setContent, saveDraft)}
              >
                ↓
              </button>
              <button
                type="button"
                style={{ ...s.iconBtn, color: "#dc2626" }}
                title="Smazat"
                onClick={() => {
                  if (confirm("Smazat tuto položku?"))
                    mutate((arr) => arr.filter((_, j) => j !== i));
                }}
              >
                ✕
              </button>
            </div>
          </div>
          {mediaList ? (
            <MediaInput
              value={typeof item === "string" ? item : ""}
              onChange={(v) => apply([...path, i], v)}
            />
          ) : (
            renderNode(item, [...path, i], keyName === "images" ? "" : keyName, apply, setContent, saveDraft)
          )}
        </div>
      ))}
      <button type="button" style={s.btnAdd} onClick={addItem}>
        + Přidat další
      </button>
    </div>
  );
}

/* --------------------------------- styly ---------------------------------- */

const s: Record<string, CSSProperties> = {
  gateWrap: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    background: "#0f172a",
    padding: 20,
    fontFamily: "Inter, system-ui, sans-serif",
  },
  gateCard: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
    background: "#fff",
    padding: 28,
    borderRadius: 16,
    width: "min(360px, 100%)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
  },
  appWrap: {
    minHeight: "100vh",
    background: "#f1f5f9",
    fontFamily: "Inter, system-ui, sans-serif",
    color: "#0f172a",
  },
  topbar: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    flexWrap: "wrap",
    padding: "12px 20px",
    background: "#0f172a",
    color: "#fff",
  },
  actions: { display: "flex", gap: 8, flexWrap: "wrap" },
  banner: { padding: "10px 20px", fontSize: 14 },
  body: { display: "flex", alignItems: "flex-start", gap: 0 },
  bodyNarrow: { flexDirection: "column", alignItems: "stretch" },
  sidebar: {
    position: "sticky",
    top: 61,
    alignSelf: "flex-start",
    display: "flex",
    flexDirection: "column",
    gap: 2,
    padding: 12,
    width: 240,
    flexShrink: 0,
    maxHeight: "calc(100vh - 61px)",
    overflowY: "auto",
  },
  sidebarNarrow: {
    position: "sticky",
    top: 0,
    zIndex: 5,
    alignSelf: "stretch",
    flexDirection: "row",
    width: "100%",
    maxHeight: "none",
    overflowY: "visible",
    overflowX: "auto",
    padding: "10px 12px",
    background: "#f1f5f9",
    borderBottom: "1px solid #e2e8f0",
    WebkitOverflowScrolling: "touch",
  },
  navItem: {
    textAlign: "left",
    padding: "9px 12px",
    borderRadius: 8,
    border: "none",
    background: "transparent",
    color: "#334155",
    fontSize: 14,
    cursor: "pointer",
  },
  navItemNarrow: {
    whiteSpace: "nowrap",
    flexShrink: 0,
    border: "1px solid #e2e8f0",
    borderRadius: 999,
    background: "#fff",
    marginTop: 0,
  },
  navItemActive: { background: "#0f172a", color: "#fff", fontWeight: 600 },
  navReset: {
    marginTop: 14,
    textAlign: "left",
    padding: "9px 12px",
    borderRadius: 8,
    border: "1px dashed #cbd5e1",
    background: "transparent",
    color: "#64748b",
    fontSize: 13,
    cursor: "pointer",
  },
  main: {
    flex: 1,
    minWidth: 0,
    padding: "24px 28px 80px",
    maxWidth: 760,
  },
  mainNarrow: { padding: "20px 16px 80px", maxWidth: "none" },
  fieldBlock: { display: "flex", flexDirection: "column", gap: 6 },
  groupBlock: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    padding: 16,
    background: "#fff",
    borderRadius: 12,
    border: "1px solid #e2e8f0",
  },
  fieldLabel: { fontSize: 13, fontWeight: 600, color: "#475569" },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #cbd5e1",
    fontSize: 14,
    fontFamily: "inherit",
    background: "#fff",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #cbd5e1",
    fontSize: 14,
    fontFamily: "inherit",
    lineHeight: 1.5,
    resize: "vertical",
    background: "#fff",
    boxSizing: "border-box",
  },
  arrayItem: {
    padding: 14,
    background: "#fff",
    borderRadius: 12,
    border: "1px solid #e2e8f0",
  },
  arrayItemHead: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    minHeight: 24,
  },
  arrayItemTitle: { fontSize: 12, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" },
  iconBtn: {
    width: 26,
    height: 26,
    borderRadius: 6,
    border: "1px solid #e2e8f0",
    background: "#f8fafc",
    cursor: "pointer",
    fontSize: 13,
    lineHeight: 1,
    color: "#475569",
  },
  btnAdd: {
    alignSelf: "flex-start",
    padding: "8px 14px",
    borderRadius: 8,
    border: "1px dashed #94a3b8",
    background: "transparent",
    color: "#475569",
    fontSize: 13,
    cursor: "pointer",
  },
  btnPrimary: {
    padding: "10px 16px",
    borderRadius: 8,
    border: "none",
    background: "#e6007e",
    color: "#fff",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  btnGhost: {
    padding: "9px 14px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.25)",
    background: "transparent",
    color: "#fff",
    fontSize: 14,
    cursor: "pointer",
  },
  btnSmall: {
    padding: "7px 12px",
    borderRadius: 7,
    border: "1px solid #cbd5e1",
    background: "#f8fafc",
    color: "#0f172a",
    fontSize: 13,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  mediaWrap: { display: "flex", gap: 12, alignItems: "flex-start" },
  mediaPreview: {
    width: 120,
    height: 84,
    flexShrink: 0,
    borderRadius: 8,
    overflow: "hidden",
    background: "#f1f5f9",
    border: "1px solid #e2e8f0",
    display: "grid",
    placeItems: "center",
  },
  mediaEl: { width: "100%", height: "100%", objectFit: "cover" },
  mediaMeta: {
    fontSize: 12,
    color: "#94a3b8",
    wordBreak: "break-all",
    overflowWrap: "anywhere",
  },
};
