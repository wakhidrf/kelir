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
  it("truncate elipsis trigger teks + title teks penuh; menu tetap jalan", () => {
    const onClick = vi.fn();
    renderSealed(
      <DropdownMenu
        trigger="https://contoh.id/tautan/sangat/panjang"
        items={[{ label: "Buka", onClick }]}
        truncate
      />,
    );
    const trigger = screen.getByTitle("https://contoh.id/tautan/sangat/panjang");
    expect(trigger.style.textOverflow).toBe("ellipsis");
    fireEvent.click(trigger);
    fireEvent.click(screen.getByText("Buka"));
    expect(onClick).toHaveBeenCalledWith();
  });

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

  it("triggerVariant button: pemicu Button outline milik kit; klik tetap buka menu", () => {
    const onClick = vi.fn();
    renderSealed(
      <DropdownMenu
        trigger="Aksi"
        triggerVariant="button"
        items={[{ label: "Ubah", onClick }]}
      />,
    );
    const trigger = screen.getByText("Aksi").closest("button") as HTMLElement;
    // Button kit = MuiButton-root; outline = border 1.5px milik kit.
    expect(trigger.className).toMatch(/MuiButton-root/);
    expect(trigger.style.border).toContain("1.5px");
    fireEvent.click(screen.getByText("Aksi"));
    fireEvent.click(screen.getByText("Ubah"));
    expect(onClick).toHaveBeenCalledWith();
  });

  it("default text: pemicu tombol teks polos, bukan Button kit", () => {
    renderSealed(
      <DropdownMenu trigger="Aksi" items={[{ label: "Ubah" }]} />,
    );
    const trigger = screen.getByText("Aksi").closest("button") as HTMLElement;
    expect(trigger.className).not.toMatch(/MuiButton-root/);
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
