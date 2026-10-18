import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";
import { Stack } from "./stack";

describe("Stack sealed (§6b)", () => {
  it("paksa spread tak mengubah flex/gap kit", () => {
    renderSealed(
      <Stack
        gap="sm"
        direction="row"
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      >
        <span>a</span>
      </Stack>,
    );
    const el = screen.getByText("a").parentElement as HTMLElement;
    expectSealed(el);
    expect(el.style.display).toBe("flex");
    expect(el.style.flexDirection).toBe("row");
    expect(el.style.gap).not.toBe("");
  });

  it("align/justify: perataan flex milik kit; default nol-ubah", () => {
    renderSealed(
      <Stack direction="row" align="center" justify="space-between">
        <span>a</span>
      </Stack>,
    );
    const el = screen.getByText("a").parentElement as HTMLElement;
    expect(el.style.alignItems).toBe("center");
    expect(el.style.justifyContent).toBe("space-between");
  });

  it("tanpa align/justify: stretch/start (perilaku lama)", () => {
    renderSealed(
      <Stack>
        <span>b</span>
      </Stack>,
    );
    const el = screen.getByText("b").parentElement as HTMLElement;
    expect(el.style.alignItems).toBe("stretch");
    expect(el.style.justifyContent).toBe("start");
  });

  it("wrap: flex-wrap milik kit; default properti hilang", () => {
    renderSealed(
      <Stack direction="row" wrap>
        <span>a</span>
      </Stack>,
    );
    const el = screen.getByText("a").parentElement as HTMLElement;
    expect(el.style.flexWrap).toBe("wrap");
  });

  it("tanpa wrap: tanpa flex-wrap (perilaku lama)", () => {
    renderSealed(
      <Stack direction="row">
        <span>b</span>
      </Stack>,
    );
    const el = screen.getByText("b").parentElement as HTMLElement;
    expect(el.style.flexWrap).toBe("");
  });

  it("minHeight (#70): ruang tetap dari token space; default hilang", () => {
    renderSealed(
      <Stack minHeight="lg">
        <span>a</span>
      </Stack>,
    );
    const el = screen.getByText("a").parentElement as HTMLElement;
    expect(el.style.minHeight).toBe("1rem");
  });

  it("tanpa minHeight: properti tak dirender (perilaku lama)", () => {
    renderSealed(
      <Stack>
        <span>b</span>
      </Stack>,
    );
    const el = screen.getByText("b").parentElement as HTMLElement;
    expect(el.style.minHeight).toBe("");
  });

  it("minHeight=screen (#74): satu layar penuh (100dvh)", () => {
    renderSealed(
      <Stack minHeight="screen">
        <span>a</span>
      </Stack>,
    );
    const el = screen.getByText("a").parentElement as HTMLElement;
    expect(el.style.minHeight).toBe("100dvh");
  });

  it("directionMd (#61): arah dasar + override @768px via sx", () => {
    renderSealed(
      <Stack direction="column" directionMd="row">
        <span>a</span>
      </Stack>,
    );
    const el = screen.getByText("a").parentElement as HTMLElement;
    // Saat directionMd diisi, arah pindah ke sx (emotion), bukan inline.
    expect(el.style.flexDirection).toBe("");
    const css = Array.from(document.querySelectorAll("style"))
      .map((s) => s.textContent ?? "")
      .join("\n");
    expect(css).toMatch(/@media \(min-width:\s*768px\)/);
    expect(css).toMatch(/flex-direction:\s*row/);
  });

  it("tanpa directionMd: arah tetap inline (perilaku lama)", () => {
    renderSealed(
      <Stack direction="row">
        <span>b</span>
      </Stack>,
    );
    const el = screen.getByText("b").parentElement as HTMLElement;
    expect(el.style.flexDirection).toBe("row");
  });

  it("reverseMd (#76): balik urutan anak @768px via sx", () => {
    renderSealed(
      <Stack direction="column" reverseMd>
        <span>a</span>
      </Stack>,
    );
    const el = screen.getByText("a").parentElement as HTMLElement;
    expect(el.style.flexDirection).toBe("");
    const css = Array.from(document.querySelectorAll("style"))
      .map((s) => s.textContent ?? "")
      .join("\n");
    expect(css).toMatch(/@media \(min-width:\s*768px\)/);
    expect(css).toMatch(/flex-direction:\s*column-reverse/);
  });

  it("reverseMd + directionMd (#76): balik arah desktop, dasar tetap", () => {
    renderSealed(
      <Stack direction="column" directionMd="row" reverseMd>
        <span>b</span>
      </Stack>,
    );
    const el = screen.getByText("b").parentElement as HTMLElement;
    expect(el.style.flexDirection).toBe("");
    const css = Array.from(document.querySelectorAll("style"))
      .map((s) => s.textContent ?? "")
      .join("\n");
    expect(css).toMatch(/flex-direction:\s*row-reverse/);
  });
});
