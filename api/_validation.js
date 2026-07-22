import { readFileSync } from "node:fs";

const defaultContent = JSON.parse(
  readFileSync(new URL("../src/content/defaultContent.json", import.meta.url), "utf8"),
);

const MEDIA_KEYS = new Set([
  "image",
  "beforeImage",
  "afterImage",
  "src",
  "video",
  "sideVideo",
  "videos",
]);

const EMPTY_ARRAY_TEMPLATES = new Map([
  ["services.tintCards", { title: "", desc: "" }],
  ["process.methods", { title: "", desc: "" }],
]);

const MIME_EXTENSIONS = {
  "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"],
  "image/webp": ["webp"],
  "video/webm": ["webm"],
  "video/mp4": ["mp4"],
};

function isPlainObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function pathName(path) {
  return path.filter((part) => typeof part === "string").join(".");
}

function leafName(path) {
  for (let i = path.length - 1; i >= 0; i -= 1) {
    if (typeof path[i] === "string") return path[i];
  }
  return "";
}

function validateString(value, path, errors) {
  const name = leafName(path);
  if (value.length > 8_000) errors.push(`${pathName(path)} je příliš dlouhé.`);
  if (value.includes("\0")) errors.push(`${pathName(path)} obsahuje nepovolené znaky.`);

  if (name === "href" && !/^#[a-z][a-z0-9-]{0,79}$/.test(value)) {
    errors.push(`${pathName(path)} musí být bezpečný odkaz na sekci.`);
  }
  if (name === "formEndpoint" && value !== "" && value !== "/api/contact") {
    errors.push("Kontaktní formulář může používat pouze /api/contact.");
  }
  if ((name === "primary" || name === "secondary") && !/^#[0-9a-f]{6}$/i.test(value)) {
    errors.push(`${pathName(path)} musí být barva ve formátu #rrggbb.`);
  }
  if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    errors.push("E-mail nemá platný formát.");
  }
  if (MEDIA_KEYS.has(name)) {
    if (!/^\/media\/[A-Za-z0-9._-]+\.(?:jpe?g|png|webp|webm|mp4)$/i.test(value)) {
      errors.push(`${pathName(path)} musí odkazovat na podporovaný soubor v /media/.`);
    }
  }
}

function validateAgainstTemplate(value, template, path, errors, depth = 0) {
  if (depth > 12) {
    errors.push(`${pathName(path)} je příliš hluboko vnořené.`);
    return;
  }

  if (Array.isArray(template)) {
    if (!Array.isArray(value)) {
      errors.push(`${pathName(path)} musí být seznam.`);
      return;
    }
    if (value.length > 50) errors.push(`${pathName(path)} má příliš mnoho položek.`);
    const fallback = EMPTY_ARRAY_TEMPLATES.get(pathName(path));
    const itemTemplate = template[0] ?? fallback;
    if (!itemTemplate && value.length > 0) {
      errors.push(`${pathName(path)} nepodporuje nové položky.`);
      return;
    }
    if (itemTemplate !== undefined) {
      value.forEach((item, index) =>
        validateAgainstTemplate(item, itemTemplate, [...path, index], errors, depth + 1),
      );
    }
    return;
  }

  if (isPlainObject(template)) {
    if (!isPlainObject(value)) {
      errors.push(`${pathName(path)} musí být objekt.`);
      return;
    }
    const expectedKeys = Object.keys(template);
    const actualKeys = Object.keys(value);
    for (const key of expectedKeys) {
      if (!Object.hasOwn(value, key)) errors.push(`${pathName([...path, key])} chybí.`);
    }
    for (const key of actualKeys) {
      if (!Object.hasOwn(template, key))
        errors.push(`${pathName([...path, key])} není povolené pole.`);
    }
    for (const key of expectedKeys) {
      if (Object.hasOwn(value, key)) {
        validateAgainstTemplate(value[key], template[key], [...path, key], errors, depth + 1);
      }
    }
    return;
  }

  if (typeof value !== typeof template) {
    errors.push(`${pathName(path)} má neplatný typ.`);
    return;
  }
  if (typeof value === "string") validateString(value, path, errors);
}

export function validateContent(content) {
  const errors = [];
  validateAgainstTemplate(content, defaultContent, [], errors);
  return { ok: errors.length === 0, errors: errors.slice(0, 12) };
}

function hasMagicBytes(buffer, mime) {
  if (mime === "image/jpeg")
    return buffer.length > 3 && buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]));
  if (mime === "image/png")
    return (
      buffer.length > 8 && buffer.subarray(0, 8).equals(Buffer.from("89504e470d0a1a0a", "hex"))
    );
  if (mime === "image/webp")
    return (
      buffer.length > 12 &&
      buffer.subarray(0, 4).toString() === "RIFF" &&
      buffer.subarray(8, 12).toString() === "WEBP"
    );
  if (mime === "video/webm")
    return buffer.length > 4 && buffer.subarray(0, 4).equals(Buffer.from("1a45dfa3", "hex"));
  if (mime === "video/mp4")
    return buffer.length > 12 && buffer.subarray(4, 8).toString() === "ftyp";
  return false;
}

export function validateUpload(upload, maxBytes = 2_700_000) {
  if (
    !isPlainObject(upload) ||
    typeof upload.path !== "string" ||
    typeof upload.dataUrl !== "string"
  ) {
    return { ok: false, error: "Neplatný nahraný soubor." };
  }
  const pathMatch = upload.path.match(/^\/media\/([A-Za-z0-9._-]+)\.([A-Za-z0-9]+)$/);
  const dataMatch = upload.dataUrl.match(/^data:([^;,]+);base64,([A-Za-z0-9+/]+={0,2})$/);
  if (!pathMatch || !dataMatch || !MIME_EXTENSIONS[dataMatch[1]]) {
    return { ok: false, error: "Nepodporovaný typ nebo název souboru." };
  }
  const mime = dataMatch[1];
  const extension = pathMatch[2].toLowerCase();
  if (!MIME_EXTENSIONS[mime].includes(extension)) {
    return { ok: false, error: "Přípona souboru neodpovídá jeho typu." };
  }
  if (dataMatch[2].length > Math.ceil(maxBytes / 3) * 4 + 4) {
    return { ok: false, error: "Soubor je příliš velký." };
  }
  const buffer = Buffer.from(dataMatch[2], "base64");
  if (buffer.length === 0 || buffer.length > maxBytes || !hasMagicBytes(buffer, mime)) {
    return { ok: false, error: "Obsah souboru neodpovídá povolenému formátu." };
  }
  const canonical = buffer.toString("base64").replace(/=+$/, "");
  if (canonical !== dataMatch[2].replace(/=+$/, "")) {
    return { ok: false, error: "Poškozená data souboru." };
  }
  return {
    ok: true,
    repoPath: `public/media/${pathMatch[1]}.${extension}`,
    base64: dataMatch[2],
    bytes: buffer.length,
  };
}
