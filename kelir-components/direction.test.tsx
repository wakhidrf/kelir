// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { Direction } from "./direction";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";

describe("Direction sealed (Gel.3c-6 §6b)", () => {
  it("menolak style/className yang dipaksa via spread", () => {
    const { container } = renderSealed(
      <Direction dir="rtl" {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}>
        <p>Isi</p>
      </Direction>,
    );
    const el = container.firstElementChild as HTMLElement;
    expectSealed(el);
    expect(el.getAttribute("dir")).toBe("rtl");
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(
      <Direction dir="ltr">
        <p>Isi</p>
      </Direction>,
    );
    await expectNoAxeViolations(container);
  });
});
