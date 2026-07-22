import { describe, expect, it } from "vitest";
import { listItemTemplate } from "./Admin";
import { MEDIA_KEYS } from "./labels";

describe("admin editor schema helpers", () => {
  it("renders the process side clip as an upload", () => {
    expect(MEDIA_KEYS.has("sideVideo")).toBe(true);
  });

  it("keeps object shapes after a list is emptied", () => {
    expect(listItemTemplate(["services", "photoCards"])).toMatchObject({
      image: expect.any(String),
      alt: expect.any(String),
      title: expect.any(String),
      desc: expect.any(String),
    });
    expect(listItemTemplate(["references", "studies", 3, "facts"])).toEqual({
      label: "Rozsah",
      value: "1 250 m²",
    });
    expect(listItemTemplate(["stats", "items"])).toEqual({ value: "", label: "" });
  });
});
