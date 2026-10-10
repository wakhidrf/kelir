import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AlertDialog } from "./alert-dialog";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";

describe("AlertDialog sealed (Gel.2 §6b)", () => {
  it("paksa spread tak mengubah visual; confirm/cancel + Escape", () => {
    const onCancel = vi.fn();
    const onConfirm = vi.fn();
    const { container } = renderSealed(
      <AlertDialog
        open
        title="Hapus?"
        description="Yakin."
        cancelText="Batal"
        confirmText="Hapus"
        onCancel={onCancel}
        onConfirm={onConfirm}
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      />,
    );
    const dialog = screen.getByRole("dialog");
    expectSealed(dialog);
    fireEvent.click(screen.getByRole("button", { name: "Hapus" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("button", { name: "Batal" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(dialog, { key: "Escape", code: "Escape" });
    expect(onCancel).toHaveBeenCalledTimes(2);
    void container;
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(
      <AlertDialog open title="Hapus?" description="Yakin." />,
    );
    await expectNoAxeViolations(container);
  });
});
