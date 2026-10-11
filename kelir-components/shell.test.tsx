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
import { Shell } from "./shell";

describe("Shell sealed (§6b)", () => {
  it("paksa spread tak mengubah cangkang viewport kit", () => {
    const { container } = renderSealed(
      <Shell {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}>
        <span>a</span>
      </Shell>,
    );
    const el = container.firstElementChild as HTMLElement;
    expectSealed(el);
    expect(el.style.display).toBe("flex");
    expect(el.style.height).toBe("100dvh");
    expect(el.style.overflow).toBe("hidden");
  });

  it("default baris (sidebar + konten); stacked = kolom", () => {
    renderSealed(
      <Shell>
        <span>a</span>
      </Shell>,
    );
    const el = screen.getByText("a").parentElement as HTMLElement;
    expect(el.style.flexDirection).toBe("row");
  });

  it("stacked: arah kolom", () => {
    renderSealed(
      <Shell stacked>
        <span>a</span>
      </Shell>,
    );
    const el = screen.getByText("a").parentElement as HTMLElement;
    expect(el.style.flexDirection).toBe("column");
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(
      <Shell>
        <span>a</span>
      </Shell>,
    );
    await expectNoAxeViolations(container);
  });
});
