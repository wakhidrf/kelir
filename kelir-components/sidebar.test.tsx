// @vitest-environment jsdom
import { fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { expectSealed, forceSpread, renderSealed } from "./sealed-test-helper";
import { Sidebar } from "./sidebar";

describe("Sidebar sealed + responsif (ISSUE-005 §6b)", () => {
  it("menolak style/className yang dipaksa via spread", () => {
    const { container } = renderSealed(
      <Sidebar {...forceSpread({ header: "Menu" })}>Item 1</Sidebar>,
    );
    expectSealed(container.firstElementChild as HTMLElement);
  });

  it("mode docked: landmark nav berisi header + isi + footer", () => {
    const { container } = renderSealed(
      <Sidebar mode="docked" header={<div>Menu</div>} footer={<div>v1</div>}>
        <div>Item 1</div>
      </Sidebar>,
    );
    const nav = container.querySelector("nav") as HTMLElement;
    expect(nav.textContent).toContain("Menu");
    expect(nav.textContent).toContain("Item 1");
    expect(nav.textContent).toContain("v1");
  });

  it("mode overlay: Drawer + Escape memicu onOpenChange(false)", () => {
    const onOpenChange = vi.fn();
    renderSealed(
      <Sidebar mode="overlay" open onOpenChange={onOpenChange} aria-label="Navigasi">
        <div>Item 1</div>
      </Sidebar>,
    );
    // Portal MUI: Drawer di document.body, bukan container.
    const drawer = document.querySelector(".MuiDrawer-root") as HTMLElement;
    expect(drawer.textContent).toContain("Item 1");
    fireEvent.keyDown(drawer, { key: "Escape", code: "Escape" });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
