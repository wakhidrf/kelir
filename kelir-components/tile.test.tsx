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
import { Tile } from "./tile";

describe("Tile sealed (§6b)", () => {
  it("paksa spread tak mengubah ubin kit", () => {
    const { container } = renderSealed(
      <Tile {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}>
        <span>a</span>
      </Tile>,
    );
    const el = container.firstElementChild as HTMLElement;
    expectSealed(el);
    expect(el.style.display).toBe("inline-flex");
    expect(el.style.backgroundColor).not.toBe("");
  });

  it("default ubin-ikon fleksibel (padding token, tanpa ukuran-tetap)", () => {
    renderSealed(
      <Tile>
        <span>a</span>
      </Tile>,
    );
    const el = screen.getByText("a").parentElement as HTMLElement;
    expect(el.style.padding).not.toBe("");
    expect(el.style.width).toBe("");
  });

  it("size: kotak ukuran-tetap milik kit (md 48px)", () => {
    renderSealed(
      <Tile tone="plain" size="md">
        <span>a</span>
      </Tile>,
    );
    const el = screen.getByText("a").parentElement as HTMLElement;
    expect(el.style.width).toBe("48px");
    expect(el.style.height).toBe("48px");
    expect(el.style.overflow).toBe("hidden");
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(<Tile>isi</Tile>);
    await expectNoAxeViolations(container);
  });
});
