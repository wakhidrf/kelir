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
});
