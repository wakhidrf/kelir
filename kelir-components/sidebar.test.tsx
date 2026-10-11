// @vitest-environment jsdom
import { fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";
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
    // Area tengah bounded (ScrollArea maxHeight 100%) → scroll internal
    // hidup bila root bounded; jsdom tak punya layout, jadi assert wiring.
    const scrollers = Array.from(nav.querySelectorAll("div")).filter(
      (d) => (d as HTMLElement).style.maxHeight === "100%",
    );
    expect(scrollers.length).toBe(1);
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

  it("trigger chevron: klik membuka overlay tak-terkontrol + ramah SR", async () => {
    const onOpenChange = vi.fn();
    const { container } = renderSealed(
      <Sidebar
        mode="overlay"
        trigger="chevron"
        onOpenChange={onOpenChange}
        aria-label="Navigasi"
      >
        <div>Item 1</div>
      </Sidebar>,
    );
    const trigger = container.querySelector(
      'button[aria-label="Buka Navigasi"]',
    ) as HTMLElement;
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(trigger);
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    const drawer = document.querySelector(".MuiDrawer-root") as HTMLElement;
    expect(drawer.textContent).toContain("Item 1");
    await expectNoAxeViolations(drawer);
    // Toggle: pemicu tetap terlihat di atas backdrop dengan ikon tutup;
    // klik lagi menutup.
    const closer = container.querySelector(
      'button[aria-label="Tutup Navigasi"]',
    ) as HTMLElement;
    fireEvent.click(closer);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(closer.getAttribute("aria-expanded")).toBe("false");
  });
});
