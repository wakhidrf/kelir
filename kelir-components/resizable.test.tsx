// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { Resizable } from "./resizable";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";

describe("Resizable sealed (Gel.3c-10 §6b)", () => {
  it("menolak style/className yang dipaksa via spread", () => {
    const { container } = renderSealed(
      <Resizable
        panels={[<p key="a">Panel A</p>, <p key="b">Panel B</p>]}
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      />,
    );
    const el = container.firstElementChild as HTMLElement;
    expectSealed(el);
    expect(el.textContent).toContain("Panel A");
    expect(el.textContent).toContain("Panel B");
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(
      <Resizable panels={[<p key="a">Panel A</p>, <p key="b">Panel B</p>]} />,
    );
    await expectNoAxeViolations(container);
  });
});
