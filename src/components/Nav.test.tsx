import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import Nav from "./Nav";
import { ContentProvider, defaultContent } from "../content";

describe("Nav", () => {
  it("keeps closed mobile links out of the focus order and restores focus on Escape", async () => {
    const user = userEvent.setup();
    render(
      <ContentProvider value={defaultContent}>
        <Nav />
      </ContentProvider>,
    );

    const toggle = screen.getByRole("button", { name: "Otevřít menu" });
    expect(document.getElementById("mobile-menu")).not.toBeInTheDocument();
    await user.click(toggle);
    const panel = document.getElementById("mobile-menu");
    expect(panel).toBeInTheDocument();
    expect(
      within(panel!).getByRole("link", { name: defaultContent.nav.links[0].label }),
    ).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(toggle).toHaveFocus();
    expect(document.getElementById("mobile-menu")).not.toBeInTheDocument();
  });
});
