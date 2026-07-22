import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Contact from "./Contact";
import { ContentProvider, defaultContent } from "../content";

function renderContact() {
  const content = structuredClone(defaultContent);
  content.contact.formEndpoint = "/api/contact";
  render(
    <ContentProvider value={content}>
      <Contact />
    </ContentProvider>,
  );
  return content;
}

describe("Contact", () => {
  it("announces inline validation errors and focuses the first invalid field", async () => {
    const user = userEvent.setup();
    const content = renderContact();
    await user.click(screen.getByRole("button", { name: content.contact.formSubmit }));
    expect(screen.getByText("Napište prosím své jméno.")).toBeVisible();
    expect(screen.getByText("Zadejte prosím platné telefonní číslo.")).toBeVisible();
    await waitFor(() => expect(screen.getByRole("textbox", { name: /Jméno/ })).toHaveFocus());
  });

  it("submits valid data and moves focus to the confirmation", async () => {
    const user = userEvent.setup();
    const content = renderContact();
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    await user.type(screen.getByLabelText(content.contact.formNameLabel), "Jan Novák");
    await user.type(screen.getByLabelText(content.contact.formPhoneLabel), "+420 777 123 456");
    await user.click(screen.getByRole("button", { name: content.contact.formSubmit }));

    const confirmation = await screen.findByRole("status");
    expect(confirmation).toHaveFocus();
    expect(fetchMock).toHaveBeenCalledOnce();
  });
});
