import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";
import { LoadingOverlay } from "./loading-overlay";

describe("LoadingOverlay sealed (§6b)", () => {
  it("tertutup tak merender apa-apa; terbuka menampilkan label + progres + media", () => {
    const { unmount } = renderSealed(<LoadingOverlay open={false} />);
    expect(screen.queryByRole("dialog")).toBeNull();
    unmount();
    renderSealed(
      <LoadingOverlay
        open
        label="Memuat"
        progress="3/9"
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      >
        {"animasi"}
      </LoadingOverlay>,
    );
    const dialog = screen.getByRole("dialog");
    expectSealed(dialog);
    expect(screen.getByText("Memuat")).toBeDefined();
    expect(screen.getByText("3/9")).toBeDefined();
    expect(screen.getByText("animasi")).toBeDefined();
  });

  it("kartu berdenyut milik kit + backdrop menghalangi + nama aksesibel turunan", () => {
    renderSealed(<LoadingOverlay open label="Memuat" progress="3/9" />);
    const paper = document.querySelector(".MuiDialog-paper") as HTMLElement;
    expect(paper.style.animation).toContain("kelir-loading-pulse");
    expect(document.querySelector(".MuiBackdrop-root")).not.toBeNull();
    expect(screen.getByRole("dialog", { name: "Memuat" })).toBeDefined();
  });

  it("Escape tak menutup (pemuatan tak bisa di-dismiss)", () => {
    renderSealed(<LoadingOverlay open label="Memuat" />);
    const dialog = screen.getByRole("dialog");
    fireEvent.keyDown(dialog, { key: "Escape", code: "Escape" });
    expect(screen.getByRole("dialog")).toBeDefined();
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(
      <LoadingOverlay open label="Memuat" progress="3/9">
        {"animasi"}
      </LoadingOverlay>,
    );
    await expectNoAxeViolations(container);
  });
});
