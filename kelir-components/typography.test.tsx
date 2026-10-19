import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";
import { Typography } from "./typography";

describe("Typography sealed (§6b)", () => {
  it("paksa spread tak mengubah skala kit; hierarki dokumen benar", () => {
    renderSealed(
      <Typography
        variant="h1"
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      >
        Judul
      </Typography>,
    );
    const el = screen.getByRole("heading", { level: 1, name: "Judul" });
    expectSealed(el);
  });

  it("as/level: tampil body, outline setara heading 2", () => {
    renderSealed(
      <Typography variant="body-md" as="p" level={2}>
        Tubuh
      </Typography>,
    );
    const el = screen.getByRole("heading", { level: 2, name: "Tubuh" });
    expect(el.tagName).toBe("P");
  });

  it("align=center: teks rata tengah; default rata start", () => {
    renderSealed(
      <Typography variant="body-md" align="center">
        Tengah
      </Typography>,
    );
    expect(screen.getByText("Tengah").style.textAlign).toBe("center");
  });

  it("tanpa align: textAlign tetap start (kiri di LTR, nol-ubah visual)", () => {
    renderSealed(<Typography variant="body-md">Kiri</Typography>);
    expect(screen.getByText("Kiri").style.textAlign).toBe("start");
  });

  it("truncate: elipsis satu-baris milik kit; default mati penuh", () => {
    renderSealed(
      <Typography variant="body-md" truncate>
        Panjang
      </Typography>,
    );
    const el = screen.getByText("Panjang");
    expect(el.style.whiteSpace).toBe("nowrap");
    expect(el.style.overflow).toBe("hidden");
    expect(el.style.textOverflow).toBe("ellipsis");
  });

  it("tanpa truncate: properti elipsis tak dirender", () => {
    renderSealed(<Typography variant="body-md">Biasa</Typography>);
    const el = screen.getByText("Biasa");
    expect(el.style.whiteSpace).toBe("");
    expect(el.style.textOverflow).toBe("");
  });

  it("breakAll: pecah kata panjang; default mati", () => {
    renderSealed(
      <Typography variant="body-sm" breakAll>
        HV-2026-000123456789
      </Typography>,
    );
    expect(screen.getByText("HV-2026-000123456789").style.wordBreak).toBe(
      "break-all",
    );
  });

  it("tanpa breakAll: wordBreak tak dirender (perilaku lama)", () => {
    renderSealed(<Typography variant="body-sm">Biasa</Typography>);
    expect(screen.getByText("Biasa").style.wordBreak).toBe("");
  });

  it("tracking=wide: spasi huruf milik kit; default bawaan varian", () => {
    renderSealed(
      <Typography variant="body-md" tracking="wide">
        482 913
      </Typography>,
    );
    expect(screen.getByText("482 913").style.letterSpacing).toBe("6px");
  });

  it("tanpa tracking: letterSpacing bawaan varian (label-caps 1px)", () => {
    renderSealed(<Typography variant="label-caps">Kode</Typography>);
    expect(screen.getByText("Kode").style.letterSpacing).toBe("1px");
  });

  it("variantMd (#66): varian dasar + override @768px via sx", () => {
    renderSealed(
      <Typography variant="h3" variantMd="h1">
        Membesar
      </Typography>,
    );
    // Varian responsif hidup di sx (emotion), bukan inline.
    const css = Array.from(document.querySelectorAll("style"))
      .map((s) => s.textContent ?? "")
      .join("\n");
    expect(css).toMatch(/@media \(min-width:\s*768px\)/);
  });

  it("segments (#77): teks inline berhias dalam satu elemen heading", () => {
    renderSealed(
      <Typography
        variant="h1"
        segments={[
          { text: "OTW" },
          { text: " Admin", tone: "muted", scale: "sm" },
          { break: true },
          { text: "Panel" },
        ]}
      />,
    );
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.textContent).toBe("OTW AdminPanel");
    expect(heading.querySelector("br")).not.toBeNull();
    const spans = heading.querySelectorAll("span");
    expect(spans.length).toBe(3);
    expect(spans[0].style.color).toBe("");
    expect(spans[1].style.fontSize).toBe("0.55em");
    expect(spans[1].style.fontWeight).toBe("500");
    expect(spans[1].style.color).not.toBe("");
  });

  it("tone=secondary: warna teks pendukung dari token", () => {
    renderSealed(
      <Typography variant="body-md" tone="secondary">
        Pendukung
      </Typography>,
    );
    const el = screen.getByText("Pendukung");
    expect(el.style.color).toContain("--color-text-secondary");
  });

  it("tanpa tone: warna varian tetap (perilaku lama)", () => {
    renderSealed(<Typography variant="body-md">Biasa</Typography>);
    const el = screen.getByText("Biasa");
    expect(el.style.color).toContain("--color-text-primary");
  });

  it("font=brand: keluarga teks memakai variabel merek kit", () => {
    renderSealed(
      <Typography variant="hero" as="h1" font="brand">
        Merek
      </Typography>,
    );
    const el = screen.getByRole("heading", { level: 1, name: "Merek" });
    expect(el.style.fontFamily).toContain("--kelir-font-brand");
  });

  it("hero/stat: ukuran dari token skala kit", () => {
    renderSealed(
      <>
        <Typography variant="hero">Besar</Typography>
        <Typography variant="stat">128</Typography>
      </>,
    );
    expect(screen.getByText("Besar").style.fontSize).toContain("type-hero");
    expect(screen.getByText("128").style.fontSize).toContain("type-stat");
  });

  it("tanpa segments: children dirender (perilaku lama)", () => {
    renderSealed(<Typography variant="body-md">Teks biasa</Typography>);
    expect(screen.getByText("Teks biasa").tagName).toBe("P");
  });
});
