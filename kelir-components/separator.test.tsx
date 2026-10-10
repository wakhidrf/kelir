import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";
import { Separator } from "./separator";

describe("Separator sealed (§6b)", () => {
  it("paksa spread tak mengubah garis kit", () => {
    renderSealed(
      <Separator
        label="atau"
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      />,
    );
    const el = screen.getByRole("separator");
    expectSealed(el);
    expect(screen.getByText("atau")).toBeDefined();
  });
});
