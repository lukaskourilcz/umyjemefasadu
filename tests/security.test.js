// @vitest-environment node
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { createSessionCookie, hasValidSession, isSameOrigin } from "../api/_security.js";
import { validateContent, validateUpload } from "../api/_validation.js";

const publishedContent = JSON.parse(readFileSync("./public/content.json", "utf8"));

describe("content publication validation", () => {
  it("accepts the published schema", () => {
    expect(validateContent(publishedContent)).toEqual({ ok: true, errors: [] });
  });

  it("rejects executable links and missing required data", () => {
    const malicious = structuredClone(publishedContent);
    malicious.nav.links[0].href = "javascript:alert(1)";
    delete malicious.contact.heading;
    const result = validateContent(malicious);
    expect(result.ok).toBe(false);
    expect(result.errors.join(" ")).toMatch(/bezpečný odkaz|contact\.heading/);
  });

  it("does not publish unverified proof sections", () => {
    for (const [section, flag] of [
      ["stats", "visible"],
      ["team", "visible"],
      ["references", "visible"],
    ]) {
      const content = structuredClone(publishedContent);
      content[section][flag] = true;
      expect(validateContent(content).ok).toBe(false);
    }

    const content = structuredClone(publishedContent);
    content.whyUs.quotesVisible = true;
    expect(validateContent(content).ok).toBe(false);
  });

  it("checks upload MIME, extension and magic bytes", () => {
    const png = Buffer.from("89504e470d0a1a0a00000000", "hex");
    const dataUrl = `data:image/png;base64,${png.toString("base64")}`;
    expect(validateUpload({ path: "/media/test.png", dataUrl }).ok).toBe(true);
    expect(validateUpload({ path: "/media/test.webp", dataUrl }).ok).toBe(false);
    expect(
      validateUpload({
        path: "/media/test.png",
        dataUrl: `data:image/png;base64,${Buffer.from("not png").toString("base64")}`,
      }).ok,
    ).toBe(false);
  });
});

describe("admin session and origin checks", () => {
  it("accepts a valid signed cookie and rejects a different secret", () => {
    const secret = "s".repeat(40);
    const request = {
      headers: {
        host: "admin.example",
        origin: "https://admin.example",
        "x-forwarded-proto": "https",
      },
    };
    const cookie = createSessionCookie(secret, request);
    request.headers.cookie = cookie.split(";")[0];
    expect(hasValidSession(request, secret)).toBe(true);
    expect(hasValidSession(request, "x".repeat(40))).toBe(false);
  });

  it("requires the expected host and protocol", () => {
    const request = {
      headers: {
        host: "admin.example",
        origin: "http://admin.example",
        "x-forwarded-proto": "https",
      },
    };
    expect(isSameOrigin(request)).toBe(false);
    request.headers.origin = "https://attacker.example";
    expect(isSameOrigin(request)).toBe(false);
    request.headers.origin = "https://admin.example";
    expect(isSameOrigin(request)).toBe(true);
  });
});
