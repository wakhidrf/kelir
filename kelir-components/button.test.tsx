import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";

describe("Button sealed (§6b)", () => {
  it("paksa spread style/className: visual kit tak berubah, perilaku jalan", () => {
    const onClick = vi.fn();
    const { container } = renderSealed(
      <Button
        variant="primary"
        onClick={onClick}
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      >
        Simpan
      </Button>,
    );
    const el = screen.getByRole("button", { name: "Simpan" });
    expectSealed(el);
    fireEvent.click(el);
    expect(onClick).toHaveBeenCalledTimes(1);
    void container;
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(
      <Button variant="primary" onClick={() => {}}>
        Simpan
      </Button>,
    );
    await expectNoAxeViolations(container);
  });

  it("align start meratakan isi ke kiri (nav full-width)", () => {
    renderSealed(
      <Button variant="ghost" align="start" onClick={() => {}}>
        Beranda
      </Button>,
    );
    const el = screen.getByRole("button", { name: "Beranda" });
    expect(el.style.justifyContent).toBe("flex-start");
  });

  it("align default tetap center", () => {
    renderSealed(
      <Button variant="ghost" onClick={() => {}}>
        Galeri
      </Button>,
    );
    const el = screen.getByRole("button", { name: "Galeri" });
    expect(el.style.justifyContent).toBe("center");
  });

  it("aria-label yang cocok dengan teks diteruskan (Label in Name)", () => {
    renderSealed(
      <Button variant="primary" onClick={() => {}} aria-label="Simpan draf">
        Simpan
      </Button>,
    );
    const el = screen.getByRole("button", { name: "Simpan draf" });
    expect(el.getAttribute("aria-label")).toBe("Simpan draf");
  });

  it("size sm/lg mengatur padding; default md = perilaku hari ini", () => {
    const { unmount: u1 } = renderSealed(
      <Button variant="primary" size="sm" onClick={() => {}}>
        Kecil
      </Button>,
    );
    expect(screen.getByRole("button", { name: "Kecil" }).style.padding).toBe(
      "6px 12px",
    );
    u1();
    const { unmount: u2 } = renderSealed(
      <Button variant="primary" size="lg" onClick={() => {}}>
        Besar
      </Button>,
    );
    expect(screen.getByRole("button", { name: "Besar" }).style.padding).toBe(
      "14px 28px",
    );
    u2();
    renderSealed(
      <Button variant="primary" onClick={() => {}}>
        Sedang
      </Button>,
    );
    expect(screen.getByRole("button", { name: "Sedang" }).style.padding).toBe(
      "10px 20px",
    );
  });
});
