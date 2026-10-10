// @vitest-environment jsdom
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Menubar } from "./menubar";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";

describe("Menubar sealed (Gel.3c-9 §6b)", () => {
  it("paksa spread tak mengubah visual; klik menu buka item + onClick jalan", () => {
    const onClick = vi.fn();
    const { container } = renderSealed(
      <Menubar
        menus={[{ trigger: "Berkas", items: [{ label: "Buka", onClick }] }]}
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      />,
    );
    expectSealed(container.firstElementChild as HTMLElement);
    fireEvent.click(screen.getByText("Berkas"));
    fireEvent.click(screen.getByText("Buka"));
    expect(onClick).toHaveBeenCalledWith();
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(
      <Menubar menus={[{ trigger: "Berkas", items: [{ label: "Buka" }] }]} />,
    );
    await expectNoAxeViolations(container);
  });

  it("panah bawah pindah fokus antar item menu (P2 a11y)", () => {
    renderSealed(
      <Menubar
        menus={[{ trigger: "Berkas", items: [{ label: "Buka" }, { label: "Tutup" }] }]}
      />,
    );
    fireEvent.click(screen.getByText("Berkas"));
    const items = screen.getAllByRole("menuitem");
    (items[0] as HTMLElement).focus();
    fireEvent.keyDown(document.activeElement as Element, {
      key: "ArrowDown",
      code: "ArrowDown",
    });
    expect((document.activeElement as HTMLElement)?.textContent).toBe("Tutup");
  });
});
