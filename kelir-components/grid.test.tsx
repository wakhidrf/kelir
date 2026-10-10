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
});
