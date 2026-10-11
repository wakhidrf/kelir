// @vitest-environment jsdom
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Drawer } from "./drawer";
import { expectSealed, forceSpread, renderSealed } from "./sealed-test-helper";

describe("Drawer sealed (Gel.3c-5 §6b)", () => {
  it("paksa spread tak mengubah visual; Escape memicu onClose", () => {
    const onClose = vi.fn();
    renderSealed(
      <Drawer
        open
        onClose={onClose}
        title="Jadwal"
        {...forceSpread({})}
      >
        <p>Isi drawer</p>
      </Drawer>,
    );
    // Portal MUI: konten di document.body, bukan container.
    const drawer = document.querySelector(".MuiDrawer-root") as HTMLElement;
    expectSealed(drawer);
    expect(screen.getByText("Jadwal")).toBeDefined();
    fireEvent.keyDown(drawer, { key: "Escape", code: "Escape" });
    expect(onClose).toHaveBeenCalledWith();
  });

  it("paperHeight auto: paper bungkus isi (slotProps paper inline)", () => {
    renderSealed(
      <Drawer open onClose={() => {}} title="Menu" paperHeight="auto">
        <p>Isi</p>
      </Drawer>,
    );
    const paper = document.querySelector(
      ".MuiDrawer-paper",
    ) as HTMLElement | null;
    expect(paper?.style.height).toBe("auto");
    expect(paper?.style.marginTop).toBe("auto");
  });
});
