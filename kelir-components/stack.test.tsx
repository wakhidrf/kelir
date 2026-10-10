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
});
