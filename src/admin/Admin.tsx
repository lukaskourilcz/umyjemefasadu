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

const DRAFT_KEY = "uf_admin_draft";

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
    "video/webm": "webm",
    "video/mp4": "mp4",
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

function readFileAsDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

/** Photos are normalised in the browser so the admin stays within the
 * serverless request limit without asking the client to use an image editor. */
async function optimisePhoto(file: File): Promise<Blob> {
  if (file.type === "image/webp") return file;
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1920 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Fotografii se nepodařilo zpracovat.");
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.9),
  );
  if (!blob) throw new Error("Fotografii se nepodařilo zpracovat.");
  return blob;
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
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const has = Boolean(value);
  const video = has && isVideo(value);
  const isNew = isDataUrl(value);

  async function pick(file?: File) {
    if (!file) return;
    const allowed = new Set([
      "image/jpeg",
      "image/png",
      "image/webp",
      "video/webm",
      "video/mp4",
    ]);
    if (!allowed.has(file.type)) {
      setError("Vyberte JPG, PNG, WEBP, WEBM nebo MP4.");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setError("Zdrojový soubor je větší než 12 MB.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      const prepared = file.type.startsWith("image/") ? await optimisePhoto(file) : file;
      if (prepared.size > 2_700_000) {
        throw new Error(
          file.type.startsWith("video/")
            ? "Video je větší než 2,7 MB. Převeďte ho prosím na kratší WEBM."
            : "Obrázek je i po optimalizaci větší než 2,7 MB.",
        );
      }
      onChange(await readFileAsDataUrl(prepared));
    } catch (caught) {
      setError((caught as Error).message || "Soubor se nepodařilo zpracovat.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      style={{ ...s.mediaWrap, ...(dragging ? s.mediaWrapDragging : null) }}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); pick(e.dataTransfer.files?.[0]); }}
    >
      <div style={s.mediaPreview} onClick={() => ref.current?.click()}>
        {has ? (
          video ? (
            <video
              src={value}
              muted
              loop
              playsInline
              controls
              preload="metadata"
              style={s.mediaEl}
            />
          ) : (
            <img src={value} alt="" style={s.mediaEl} />
          )
        ) : (
          <span style={{ color: "#718096", fontSize: 13 }}>Přetáhněte soubor sem</span>
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
        <span style={s.mediaHint}>JPG a PNG automaticky převedeme do kvalitního WEBP · publikovaný soubor max. 2,7 MB</span>
        <span style={s.mediaMeta}>{isNew ? "Nový soubor — uloží se při publikaci" : value || "—"}</span>
        {error && <span style={s.mediaError}>{error}</span>}
        <input
          ref={ref}
          type="file"
          accept="image/jpeg,image/png,image/webp,video/webm,video/mp4"
          style={{ display: "none" }}
          onChange={(e) => pick(e.target.files?.[0])}
        />
      </div>
    </div>
  );
}

/* ------------------------------- Admin app -------------------------------- */

export default function Admin({ initialContent }: { initialContent: Content }) {
  const [auth, setAuth] = useState<"loading" | "locked" | "unlocked">("loading");
  const [baseCommitSha, setBaseCommitSha] = useState<string | null>(null);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [loginBusy, setLoginBusy] = useState(false);
  const narrow = useNarrow();

  const [content, setContent] = useState<Content>(() => {
    const draft = loadDraft(initialContent);
    return draft ?? clone(initialContent);
  });
  const [publishedContent, setPublishedContent] = useState<Content>(() =>
    clone(initialContent),
  );
  const [status, setStatus] = useState<{ kind: "idle" | "ok" | "err" | "busy"; msg: string }>({
    kind: "idle",
    msg: "",
  });
  const [open, setOpen] = useState<string>(SECTIONS[0].key);
  const [sectionQuery, setSectionQuery] = useState("");

  const dirty = useMemo(
    () => JSON.stringify(content) !== JSON.stringify(publishedContent),
    [content, publishedContent],
  );
  const visibleSections = useMemo(
    () => SECTIONS.filter((sec) => `${sec.title} ${sec.help ?? ""}`.toLowerCase().includes(sectionQuery.toLowerCase())),
    [sectionQuery],
  );

  function apply(path: Path, value: Json) {
    setContent((c) => {
      const next = setIn(c, path, value) as Content;
      saveDraft(next);
      return next;
    });
    setStatus({ kind: "idle", msg: "" });
  }

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/session", { credentials: "same-origin" })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (cancelled) return;
        if (response.ok && data.authenticated) {
          setBaseCommitSha(data.baseCommitSha || null);
          setAuth("unlocked");
        } else {
          setAuth("locked");
        }
      })
      .catch(() => !cancelled && setAuth("locked"));
    return () => {
      cancelled = true;
    };
  }, []);

  async function unlock(e: FormEvent) {
    e.preventDefault();
    setLoginBusy(true);
    setPwError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw.trim() }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Přihlášení selhalo.");
      setBaseCommitSha(data.baseCommitSha || null);
      setPw("");
      setAuth("unlocked");
    } catch (error) {
      setPwError((error as Error).message);
    } finally {
      setLoginBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", {
      method: "POST",
      credentials: "same-origin",
    }).catch(() => undefined);
    setAuth("locked");
    setBaseCommitSha(null);
  }

  async function publish() {
    if (!baseCommitSha) {
      setStatus({
        kind: "err",
        msg: "Nelze ověřit publikovanou verzi. Obnovte stránku a přihlaste se znovu.",
      });
      return;
    }
    setStatus({ kind: "busy", msg: "Ukládám a publikuji…" });
    const uploads: { path: string; dataUrl: string }[] = [];
    const out = externalizeMedia(clone(content), uploads) as Content;
    try {
      const res = await fetch("/api/save", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseCommitSha, content: out, uploads }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const details = Array.isArray(data?.details) ? ` ${data.details.join(" ")}` : "";
        throw new Error((data?.error || `Chyba serveru (${res.status})`) + details);
      }
      // Po publikaci pracujeme dál s cestami místo data URL a koncept se
      // váže k právě publikované verzi.
      draftBase = fingerprint(out);
      setContent(out);
      setPublishedContent(clone(out));
      setBaseCommitSha(data.commit);
      saveDraft(out);
      setStatus({
        kind: "ok",
        msg: "Uloženo. Web se během cca 1–2 minut sám aktualizuje.",
      });
    } catch (err) {
      if ((err as Error).message.includes("Přihlášení vypršelo")) setAuth("locked");
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
    const base = clone(publishedContent);
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

  if (auth === "loading") {
    return (
      <div style={s.gateWrap} role="status" aria-live="polite">
        <div style={s.gateCard}>
          <span style={s.adminEyebrow}>SPRÁVA WEBU</span>
          <h1 style={{ fontSize: 22, margin: 0 }}>Ověřuji přihlášení…</h1>
        </div>
      </div>
    );
  }

  if (auth === "locked") {
    return (
      <div style={s.gateWrap}>
        <form onSubmit={unlock} style={s.gateCard}>
          <span style={s.adminEyebrow}>UMYJEME FASÁDU</span>
          <h1 style={{ fontSize: 22, margin: 0 }}>Administrace webu</h1>
          <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>
            Zadejte heslo pro úpravu obsahu.
          </p>
          <input
            aria-label="Heslo do administrace"
            type="password"
            value={pw}
            autoFocus
            placeholder="Heslo"
            onChange={(e) => setPw(e.target.value)}
            style={s.input}
          />
          {pwError && (
            <span role="alert" style={{ color: "#b42318", fontSize: 13 }}>{pwError}</span>
          )}
          <button type="submit" style={s.btnPrimary} disabled={loginBusy}>
            {loginBusy ? "Ověřuji…" : "Vstoupit"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={s.appWrap}>
      <header style={s.topbar}>
        <div style={s.brandBlock}>
          <span style={s.brandMark}>UF</span>
          <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={s.adminEyebrow}>SPRÁVA WEBU</span>
          <strong style={{ fontSize: 18, letterSpacing: "-0.02em" }}>Umyjeme Fasádu</strong>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: 12, color: "#1ba5e0", textDecoration: "none", fontWeight: 600 }}
          >
            Zobrazit web ↗
          </a>
          </div>
        </div>
        <div style={s.actions}>
          <span style={{ ...s.dirtyBadge, ...(dirty ? s.dirtyBadgeActive : null) }}>
            {dirty ? "Neuložené změny" : "Vše uloženo"}
          </span>
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
          <button type="button" style={s.btnGhost} onClick={logout}>
            Odhlásit
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
          role={status.kind === "err" ? "alert" : "status"}
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
          {!narrow && (
            <div style={s.searchWrap}>
              <span style={s.searchIcon}>⌕</span>
              <input
                value={sectionQuery}
                onChange={(e) => setSectionQuery(e.target.value)}
                placeholder="Najít sekci…"
                aria-label="Najít sekci"
                style={s.searchInput}
              />
            </div>
          )}
          {visibleSections.map((sec, index) => (
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
              <span style={s.navNumber}>{String(index + 1).padStart(2, "0")}</span>
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
              <span style={s.sectionEyebrow}>UPRAVUJETE SEKCI</span>
              <h2 style={s.sectionTitle}>{sec.title}</h2>
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
    background: "radial-gradient(circle at 20% 10%, rgba(27,165,224,.18), transparent 35%), #101820",
    padding: 20,
    fontFamily: "Inter, system-ui, sans-serif",
  },
  gateCard: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
    background: "#fff",
    padding: 28,
    borderRadius: 14,
    width: "min(360px, 100%)",
    boxShadow: "0 24px 70px rgba(0,0,0,0.3)",
    border: "1px solid rgba(255,255,255,.2)",
  },
  appWrap: {
    minHeight: "100vh",
    background: "#fbfdfe",
    fontFamily: "Inter, system-ui, sans-serif",
    color: "#101820",
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
    padding: "14px 24px",
    background: "rgba(16,24,32,.97)",
    color: "#fff",
    borderBottom: "1px solid rgba(255,255,255,.1)",
    backdropFilter: "blur(12px)",
  },
  brandBlock: { display: "flex", alignItems: "center", gap: 12 },
  brandMark: {
    width: 42,
    height: 42,
    borderRadius: 12,
    display: "grid",
    placeItems: "center",
    background: "linear-gradient(135deg,#e6007e,#c10068)",
    color: "#fff",
    fontFamily: "Space Grotesk, sans-serif",
    fontWeight: 800,
    fontSize: 14,
  },
  adminEyebrow: { color: "#1ba5e0", fontSize: 10, letterSpacing: ".14em", fontFamily: "Fragment Mono, monospace" },
  actions: { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" },
  dirtyBadge: { padding: "6px 10px", borderRadius: 999, background: "rgba(255,255,255,.08)", color: "#94a3b8", fontSize: 11, fontWeight: 700 },
  dirtyBadgeActive: { background: "rgba(230,0,126,.15)", color: "#ff7fc5" },
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
    padding: 18,
    width: 274,
    flexShrink: 0,
    maxHeight: "calc(100vh - 61px)",
    overflowY: "auto",
    background: "#f5f8fa",
    borderRight: "1px solid #e2e9ee",
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
    background: "rgba(251,253,254,.96)",
    borderBottom: "1px solid #e2e8f0",
    WebkitOverflowScrolling: "touch",
  },
  navItem: {
    textAlign: "left",
    padding: "10px 12px",
    borderRadius: 10,
    border: "none",
    background: "transparent",
    color: "#42515d",
    fontSize: 14,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  navItemNarrow: {
    whiteSpace: "nowrap",
    flexShrink: 0,
    border: "1px solid #e2e8f0",
    borderRadius: 999,
    background: "#fff",
    marginTop: 0,
  },
  navItemActive: { background: "#101820", color: "#fff", fontWeight: 700, boxShadow: "0 7px 18px rgba(16,24,32,.13)" },
  navNumber: { fontFamily: "Fragment Mono, monospace", fontSize: 10, color: "#1ba5e0", minWidth: 18 },
  searchWrap: { position: "relative", marginBottom: 8 },
  searchIcon: { position: "absolute", left: 12, top: 8, color: "#80909d", fontSize: 18 },
  searchInput: { width: "100%", boxSizing: "border-box", border: "1px solid #d6e0e6", borderRadius: 10, padding: "10px 12px 10px 34px", background: "#fff", fontSize: 13, outline: "none" },
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
    padding: "38px 42px 100px",
    maxWidth: 900,
  },
  mainNarrow: { padding: "20px 16px 80px", maxWidth: "none" },
  sectionEyebrow: { color: "#1488c4", fontFamily: "Fragment Mono, monospace", fontSize: 11, letterSpacing: ".12em" },
  sectionTitle: { fontFamily: "Space Grotesk, Inter, sans-serif", fontSize: 30, lineHeight: 1.1, margin: "8px 0 6px", letterSpacing: "-0.03em" },
  fieldBlock: { display: "flex", flexDirection: "column", gap: 7, padding: "2px 0" },
  groupBlock: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    padding: 20,
    background: "#fff",
    borderRadius: 14,
    border: "1px solid #e2e9ee",
    boxShadow: "0 1px 0 rgba(16,24,32,.02)",
  },
  fieldLabel: { fontSize: 12, fontWeight: 750, color: "#42515d", letterSpacing: ".01em" },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #c4d0d8",
    fontSize: 14,
    fontFamily: "inherit",
    background: "#fff",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid #c4d0d8",
    fontSize: 14,
    fontFamily: "inherit",
    lineHeight: 1.5,
    resize: "vertical",
    background: "#fff",
    boxSizing: "border-box",
  },
  arrayItem: {
    padding: 16,
    background: "#fff",
    borderRadius: 12,
    border: "1px solid #e2e9ee",
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
    borderRadius: 10,
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
    background: "#d80076",
    color: "#fff",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
  btnGhost: {
    padding: "9px 14px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.25)",
    background: "transparent",
    color: "#fff",
    fontSize: 14,
    cursor: "pointer",
  },
  btnSmall: {
    padding: "7px 12px",
    borderRadius: 10,
    border: "1px solid #101820",
    background: "#101820",
    color: "#fff",
    fontSize: 13,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  mediaWrap: { display: "grid", gridTemplateColumns: "minmax(180px, 260px) minmax(0,1fr)", gap: 16, alignItems: "center", padding: 12, borderRadius: 12, border: "1px dashed #c4d0d8", background: "#f8fbfc", transition: "border-color .2s, background .2s" },
  mediaWrapDragging: { borderColor: "#1ba5e0", background: "#eaf7fd" },
  mediaPreview: {
    width: "100%",
    aspectRatio: "16 / 10",
    borderRadius: 10,
    overflow: "hidden",
    background: "#f1f5f9",
    border: "1px solid #e2e8f0",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
  },
  mediaEl: { width: "100%", height: "100%", objectFit: "cover" },
  mediaMeta: {
    fontSize: 12,
    color: "#94a3b8",
    wordBreak: "break-all",
    overflowWrap: "anywhere",
  },
  mediaHint: { fontSize: 11, color: "#718096", lineHeight: 1.45 },
  mediaError: { fontSize: 12, color: "#c53030", fontWeight: 600 },
};
