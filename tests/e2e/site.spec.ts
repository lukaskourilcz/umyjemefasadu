import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("critical conversion path is visible without horizontal overflow", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Poskytneme");
  await expect(
    page.locator("main").getByRole("link", { name: "Domluvit prohlídku", exact: true }).first(),
  ).toBeVisible();
  await expect(page.locator("#kontakt")).toBeAttached();
  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(dimensions.scrollWidth).toBe(dimensions.clientWidth);
});

test("mobile menu is keyboard operable", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes("mobile"), "Mobile-only navigation behavior");
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Otevřít menu" });
  await toggle.click();
  await expect(
    page.locator("#mobile-menu").getByRole("link", { name: "Proč čistit" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
});

test("mobile comparison slider remains keyboard operable", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes("mobile"), "Mobile-only comparison behavior");
  await page.goto("/");
  const slider = page.getByRole("slider", { name: "Porovnání fasády před a po" });
  await expect(slider).toBeVisible();
  await slider.focus();
  await page.keyboard.press("ArrowUp");
  await expect(slider).toHaveValue("51");
});

test("contact form exposes clear validation", async ({ page }) => {
  await page.goto("/#kontakt");
  await page.getByRole("button", { name: "Odeslat poptávku" }).click();
  await expect(page.getByText("Napište prosím své jméno.")).toBeVisible();
  await expect(page.getByRole("textbox", { name: /Jméno/ })).toBeFocused();
});

test("rendered page has no serious or critical axe violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  const blocking = results.violations.filter((violation) =>
    ["serious", "critical"].includes(violation.impact || ""),
  );
  expect(blocking, blocking.map((item) => `${item.id}: ${item.help}`).join("\n")).toEqual([]);
});

test("admin route declares itself private to search engines", async ({ page }) => {
  await page.goto("/dev");
  await expect(page.getByRole("heading", { name: "Administrace webu" })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});
