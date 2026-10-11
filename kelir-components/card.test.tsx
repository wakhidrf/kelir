import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./button";
import { Card } from "./card";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";

describe("Card sealed (§6b)", () => {
  it("paksa spread tak mengubah visual; slot teks/aksi tampil", () => {
    renderSealed(
      <Card
        title="Judul"
        subtitle="Sub"
        footer={<Button variant="primary">OK</Button>}
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      >
        Isi
      </Card>,
    );
    expect(screen.getByText("Judul")).toBeDefined();
    expect(screen.getByText("Isi")).toBeDefined();
    expect(screen.getByRole("button", { name: "OK" })).toBeDefined();
    // Root MuiCard = ancestor teratas dari judul
    let el = screen.getByText("Judul") as HTMLElement | null;
    while (el?.parentElement && !el.className.includes("MuiCard-root")) {
      el = el.parentElement;
    }
    expect(el).not.toBeNull();
    expectSealed(el as Element);
  });

  it("headerAlign=center: judul + subjudul rata tengah; default kiri", () => {
    renderSealed(
      <Card title="Judul" subtitle="Sub" headerAlign="center">
        Isi
      </Card>,
    );
    expect(screen.getByText("Judul").style.textAlign).toBe("center");
    expect(screen.getByText("Sub").style.textAlign).toBe("center");
  });

  it("tanpa headerAlign: judul tetap rata kiri (nol-ubah visual)", () => {
    renderSealed(<Card title="Judul">Isi</Card>);
    expect(screen.getByText("Judul").style.textAlign).toBe("left");
  });
});
