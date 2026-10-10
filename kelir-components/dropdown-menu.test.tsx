// @vitest-environment jsdom
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DropdownMenu } from "./dropdown-menu";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";

describe("DropdownMenu sealed (Gel.3c-9 §6b)", () => {
  it("paksa spread tak mengubah visual; klik trigger buka menu + onClick jalan", () => {
    const onClick = vi.fn();
    const { container } = renderSealed(
      <DropdownMenu
        trigger="Aksi"
        items={[{ label: "Ubah", onClick }]}
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      />,
    );
    // Pemicu milik kit: tombol teks tanpa portal.
    expectSealed(container.firstElementChild as HTMLElement);
    fireEvent.click(screen.getByText("Aksi"));
    fireEvent.click(screen.getByText("Ubah"));
    expect(onClick).toHaveBeenCalledWith();
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(
      <DropdownMenu trigger="Aksi" items={[{ label: "Ubah" }]} />,
    );
    await expectNoAxeViolations(container);
  });

  it("panah bawah pindah fokus antar item menu (P2 a11y)", () => {
    renderSealed(
      <DropdownMenu trigger="Aksi" items={[{ label: "Ubah" }, { label: "Hapus" }]} />,
    );
    fireEvent.click(screen.getByText("Aksi"));
    const items = screen.getAllByRole("menuitem");
    (items[0] as HTMLElement).focus();
    fireEvent.keyDown(document.activeElement as Element, {
      key: "ArrowDown",
      code: "ArrowDown",
    });
    expect((document.activeElement as HTMLElement)?.textContent).toBe("Hapus");
  });
});
