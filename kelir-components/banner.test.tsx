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
import { Banner } from "./banner";

describe("Banner sealed (§6b)", () => {
  it("paksa spread tak mengubah spanduk kit", () => {
    const { container } = renderSealed(
      <Banner {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}>
        <span>a</span>
      </Banner>,
    );
    const el = container.firstElementChild as HTMLElement;
    expectSealed(el);
    expect(el.style.textAlign).toBe("center");
    expect(el.style.backgroundColor).not.toBe("");
  });

  it("teks anak mewarisi warna (tanpa override di dalam)", () => {
    renderSealed(
      <Banner tone="danger">
        <span>a</span>
      </Banner>,
    );
    const el = screen.getByText("a").parentElement as HTMLElement;
    expect(el.style.color).not.toBe("");
    expect(screen.getByText("a").getAttribute("style") ?? "").not.toContain(
      "color",
    );
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(<Banner>isi</Banner>);
    await expectNoAxeViolations(container);
  });
});
