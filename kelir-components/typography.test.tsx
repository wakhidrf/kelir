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
});
