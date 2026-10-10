import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";
import { Dialog } from "./dialog";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";

describe("Dialog sealed (§6b)", () => {
  it("paksa spread tak mengubah visual; Escape memicu onClose", () => {
    const onClose = vi.fn();
    const { container } = renderSealed(
      <Dialog
        open
        onClose={onClose}
        title="Hapus?"
        actions={<Button variant="destructive">Hapus</Button>}
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      >
        Yakin?
      </Dialog>,
    );
    const dialog = screen.getByRole("dialog");
    expectSealed(dialog);
    expect(screen.getByText("Hapus?")).toBeDefined();
    fireEvent.keyDown(dialog, { key: "Escape", code: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
    void container;
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(
      <Dialog open onClose={() => {}} title="Hapus?">
        Yakin?
      </Dialog>,
    );
    await expectNoAxeViolations(container);
  });

  it("focus-trap milik kit (P2 a11y): fokus masuk + Tab membungkus", () => {
    renderSealed(
      <Dialog
        open
        onClose={() => {}}
        title="Hapus?"
        actions={<Button variant="destructive">Hapus</Button>}
      >
        Yakin?
      </Dialog>,
    );
    // MUI Modal trap aktif default (kit tak menonaktifkan): fokus awal di
    // dalam dialog, dan Tab dari tombol terakhir membungkus ke dalam.
    const dialog = document.querySelector(".MuiDialog-root") as HTMLElement;
    expect(dialog.contains(document.activeElement)).toBe(true);
    const buttons = [...dialog.querySelectorAll("button")];
    const last = buttons[buttons.length - 1] as HTMLElement;
    last.focus();
    fireEvent.keyDown(last, { key: "Tab", code: "Tab" });
    expect(dialog.contains(document.activeElement)).toBe(true);
  });
});
