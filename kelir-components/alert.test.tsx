import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Alert } from "./alert";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";

describe("Alert sealed (Gel.2 §6b)", () => {
  it("paksa spread tak mengubah visual; tutup memicu onClose", () => {
    const onClose = vi.fn();
    renderSealed(
      <Alert
        severity="error"
        title="Gagal"
        onClose={onClose}
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      >
        Isi
      </Alert>,
    );
    const el = screen.getByRole("alert");
    expectSealed(el);
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(
      <Alert severity="info" title="Info">
        Isi
      </Alert>,
    );
    await expectNoAxeViolations(container);
  });
});
