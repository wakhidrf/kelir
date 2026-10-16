// @vitest-environment jsdom
import { fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderToString } from "react-dom/server";
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
      <Sidebar {...forceSpread({ header: "Menu" })} aria-label="Navigasi">Item 1</Sidebar>,
    );
    expectSealed(container.firstElementChild as HTMLElement);
  });

  it("mode docked: landmark nav berisi header + isi + footer", () => {
    const { container } = renderSealed(
      <Sidebar mode="docked" header={<div>Menu</div>} footer={<div>v1</div>} aria-label="Navigasi">
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
    // Paritas overlay (fix #40): napas dalam sm milik kit (0.5rem = 8px).
    expect(nav.style.padding).toBe("0.5rem");
  });

  it("docked flush tepi layar: sudut sisi-layar nol + tanpa garis sisi-layar", () => {
    renderSealed(
      <Sidebar mode="docked" aria-label="Navigasi">
        <div>Item 1</div>
      </Sidebar>,
    );
    // Visual milik kit hidup di <style> emotion (sx), bukan inline.
    const css = Array.from(document.querySelectorAll("style"))
      .map((s) => s.textContent ?? "")
      .join("\n");
    expect(css).toMatch(/border-start-start-radius:\s*0/);
    expect(css).toMatch(/border-end-start-radius:\s*0/);
    expect(css).toMatch(/border-inline-start:\s*none/);
  });

  it("overlay mobile 3/4 layar (#58)", () => {
    renderSealed(
      <Sidebar mode="overlay" open aria-label="Navigasi">
        <div>Item 1</div>
      </Sidebar>,
    );
    const css = Array.from(document.querySelectorAll("style"))
      .map((s) => s.textContent ?? "")
      .join("\n");
    expect(css).toMatch(/75vw/);
  });

  it("mode auto: default docked SSR-aman (tanpa matchMedia = desktop)", () => {
    const { container } = renderSealed(
      <Sidebar mode="auto" aria-label="Navigasi">
        <div>Item 1</div>
      </Sidebar>,
    );
    expect(container.querySelector("nav")).not.toBeNull();
  });

  it("SSR: mode auto render docked (jamin cocok hidrasi klien-pertama)", () => {
    const html = renderToString(
      <Sidebar mode="auto" aria-label="Navigasi">
        <div>Item 1</div>
      </Sidebar>,
    );
    expect(html).toContain("<nav");
    expect(html).not.toContain("MuiDrawer-root");
  });

  it("mode overlay: Drawer + Escape memicu onOpenChange(false)", () => {    const onOpenChange = vi.fn();
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
        triggerVariant="chevron"
        onOpenChange={onOpenChange}
        aria-label="Navigasi"
      >
        <div>Item 1</div>
      </Sidebar>,
    );
    const trigger = document.querySelector(
      'button[aria-label="Buka Navigasi"]',
    ) as HTMLElement;
    fireEvent.click(trigger);
    expect(onOpenChange).toHaveBeenCalledWith(true);
    const drawer = document.querySelector(".MuiDrawer-root") as HTMLElement;
    expect(drawer.textContent).toContain("Item 1");
    await expectNoAxeViolations(drawer);
    // Toggle: IconButton tutup di tepi drawer (portal); klik lagi menutup.
    const closer = document.querySelector(
      'button[aria-label="Tutup Navigasi"]',
    ) as HTMLElement;
    fireEvent.click(closer);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
