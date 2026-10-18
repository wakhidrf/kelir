// @vitest-environment jsdom
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Quote } from "./quote";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";

describe("Quote sealed", () => {
  it("menolak style/className yang dipaksa via spread", () => {
    const { container } = renderSealed(
      <Quote {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}>
        Kutipan.
      </Quote>,
    );
    expectSealed(container.firstElementChild as HTMLElement);
  });

  it("render elemen blockquote semantik", () => {
    renderSealed(<Quote>Kutipan.</Quote>);
    expect(screen.getByText("Kutipan.").closest("blockquote")?.tagName).toBe(
      "BLOCKQUOTE",
    );
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(
      <Quote aria-label="Kutipan pilihan">Kutipan.</Quote>,
    );
    await expectNoAxeViolations(container);
  });
});
