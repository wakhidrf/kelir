// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { AspectRatio } from "./aspect-ratio";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";

describe("AspectRatio sealed (Gel.3c-6 §6b)", () => {
  it("menolak style/className yang dipaksa via spread", () => {
    const { container } = renderSealed(
      <AspectRatio ratio={16 / 9} {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}>
        <img src="x.jpg" alt="Contoh" />
      </AspectRatio>,
    );
    expectSealed(container.firstElementChild as HTMLElement);
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(
      <AspectRatio ratio={1}>
        <img src="x.jpg" alt="Contoh" />
      </AspectRatio>,
    );
    await expectNoAxeViolations(container);
  });
});
