import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Grid } from "./grid";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";

describe("Grid sealed (§6b)", () => {
  it("paksa spread tak mengubah kolom kit", () => {
    renderSealed(
      <Grid
        columns={3}
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      >
        <span>g</span>
      </Grid>,
    );
    const el = screen.getByText("g").parentElement as HTMLElement;
    expectSealed(el);
    expect(el.style.display).toBe("grid");
    expect(el.style.gridTemplateColumns).toContain("repeat(3");
  });
  it("columnsMd: kolom dasar pindah ke sx (media query kit)", () => {
    renderSealed(
      <Grid columns={1} columnsMd={3}>
        <span>g</span>
      </Grid>,
    );
    const el = screen.getByText("g").parentElement as HTMLElement;
    expect(el.style.gridTemplateColumns).toBe("");
    const css = Array.from(document.querySelectorAll("style"))
      .map((s) => s.textContent ?? "")
      .join("\n");
    expect(css).toMatch(/@media \(min-width:\s*768px\)/);
    expect(css).toMatch(/repeat\(3/);
  });

  it("minItem: auto-fit lebar minimum dari token (inline)", () => {
    renderSealed(
      <Grid minItem="sm">
        <span>g</span>
      </Grid>,
    );
    const el = screen.getByText("g").parentElement as HTMLElement;
    expect(el.style.gridTemplateColumns).toContain("auto-fit");
    expect(el.style.gridTemplateColumns).toContain("minmax(200px");
  });

  it("tanpa titik henti: kolom tetap inline (perilaku lama)", () => {
    renderSealed(
      <Grid columns={4}>
        <span>h</span>
      </Grid>,
    );
    const el = screen.getByText("h").parentElement as HTMLElement;
    expect(el.style.gridTemplateColumns).toContain("repeat(4");
  });
});
