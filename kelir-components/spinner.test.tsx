import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";
import { Spinner } from "./spinner";

describe("Spinner sealed (§6b)", () => {
  it("paksa spread tak mengubah warna/ukuran kit", () => {
    renderSealed(
      <Spinner
        size="large"
        aria-label="memuat"
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      />,
    );
    const el = screen.getByRole("progressbar");
    expectSealed(el);
  });
});
