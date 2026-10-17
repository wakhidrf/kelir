import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";
import { Toast } from "./toast";

describe("Toast sealed (Gel.2 §6b)", () => {
  it("spread tak mempan; aksi + tutup memicu onClose", () => {
    const onClose = vi.fn();
    const onUndo = vi.fn();
    renderSealed(
      <Toast
        message="Tersimpan"
        open
        onClose={onClose}
        autoHideDuration={100000}
        actionButton={
          <Button variant="ghost" onClick={onUndo}>
            Urungkan
          </Button>
        }
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      />,
    );
    expect(screen.getByText("Tersimpan")).toBeDefined();
    const content = screen.getByText("Tersimpan").closest("div");
    expectSealed(content as Element);
    fireEvent.click(screen.getByRole("button", { name: "Urungkan" }));
    expect(onUndo).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(screen.getByText("Tersimpan"), { key: "Escape", code: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });

  it("pesan = live region sopan (P2 a11y): diumumkan tanpa curi fokus", () => {
    renderSealed(
      <Toast message="Tersimpan" open onClose={() => {}} autoHideDuration={100000} />,
    );
    const msg = screen.getByText("Tersimpan");
    expect(msg.getAttribute("role")).toBe("status");
    expect(msg.getAttribute("aria-live")).toBe("polite");
  });

  it("tone (#60): aksen strip sisi kiri dari token; tanpa tone netral", () => {
    const { unmount } = renderSealed(
      <Toast message="Gagal" tone="error" open onClose={() => {}} autoHideDuration={100000} />,
    );
    const accent = document.querySelector(".MuiSnackbarContent-root") as HTMLElement;
    expect(accent.style.borderLeft).toMatch(/^4px solid/);
    unmount();
    renderSealed(
      <Toast message="Info" open onClose={() => {}} autoHideDuration={100000} />,
    );
    const plain = document.querySelector(".MuiSnackbarContent-root") as HTMLElement;
    expect(plain.style.borderLeft).toBe("");
  });
});
