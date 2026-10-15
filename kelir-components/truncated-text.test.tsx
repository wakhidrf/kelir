// @vitest-environment jsdom
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";
import { TruncatedText } from "./truncated-text";

const LONG = "https://contoh.id/tautan/sangat/panjang/yang/harus/terpotong";

describe("TruncatedText sealed (#56)", () => {
  it("satu baris elipsis + title = teks penuh; maxWidth data jadi gaya", () => {
    const { container } = renderSealed(
      <TruncatedText
        text={LONG}
        maxWidth={200}
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      />,
    );
    const el = screen.getByTitle(LONG);
    expect(el.tagName).toBe("SPAN");
    expect(el.style.whiteSpace).toBe("nowrap");
    expect(el.style.overflow).toBe("hidden");
    expect(el.style.textOverflow).toBe("ellipsis");
    expect(el.style.maxWidth).toBe("200px");
    expectSealed(container.firstElementChild as HTMLElement);
  });

  it("tanpa maxWidth selebar wadah; aria-label terus", () => {
    renderSealed(<TruncatedText text={LONG} aria-label="Tautan tujuan" />);
    const el = screen.getByTitle(LONG);
    expect(el.style.maxWidth).toBe("100%");
    expect(el.getAttribute("aria-label")).toBe("Tautan tujuan");
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(
      <TruncatedText text={LONG} maxWidth={200} />,
    );
    await expectNoAxeViolations(container);
  });
});
