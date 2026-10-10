// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { ScrollArea } from "./scroll-area";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";

describe("ScrollArea sealed (Gel.3c-7 §6b)", () => {
  it("menolak style/className yang dipaksa via spread", () => {
    const { container } = renderSealed(
      <ScrollArea maxHeight={120} {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}>
        <p>Isi panjang</p>
      </ScrollArea>,
    );
    const el = container.firstElementChild as HTMLElement;
    expectSealed(el);
    expect(el.style.maxHeight).toBe("120px");
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(
      <ScrollArea maxHeight="120px">
        <p>Isi panjang</p>
      </ScrollArea>,
    );
    await expectNoAxeViolations(container);
  });
});
