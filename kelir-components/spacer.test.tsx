import { describe, expect, it } from "vitest";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";
import { Spacer } from "./spacer";

describe("Spacer sealed (§6b)", () => {
  it("presentasional + ukuran token, paksa spread tak mempan", () => {
    const { container } = renderSealed(
      <Spacer
        size="lg"
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      />,
    );
    const el = container.firstElementChild as HTMLElement;
    expectSealed(el);
    expect(el.getAttribute("aria-hidden")).toBe("true");
    expect(el.style.height).not.toBe("");
  });
});
