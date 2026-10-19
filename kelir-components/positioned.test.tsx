// @vitest-environment jsdom
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Positioned } from "./positioned";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";

describe("Positioned sealed (§6b)", () => {
  it("anchor top-start: tetap di sudut atas-kiri, di atas konten", () => {
    renderSealed(
      <Positioned anchor="top-start">
        <span>pemicu</span>
      </Positioned>,
    );
    const el = screen.getByText("pemicu").parentElement as HTMLElement;
    expect(el.style.position).toBe("fixed");
    expect(el.style.top).toBe("1rem");
    expect(el.style.left).toBe("1rem");
    expect(el.style.zIndex).toBe("200");
  });

  it("anchor center-start + elevate=false: tanpa z-index (tak menjebak drawer)", () => {
    renderSealed(
      <Positioned anchor="center-start" elevate={false}>
        <span>geser</span>
      </Positioned>,
    );
    const el = screen.getByText("geser").parentElement as HTMLElement;
    expect(el.style.top).toContain("calc(50%");
    expect(el.style.transform).toBe("");
    expect(el.style.zIndex).toBe("");
  });

  it("visibility=desktop: disembunyikan di bawah 600px (media query kit)", () => {
    renderSealed(
      <Positioned anchor="top-center" visibility="desktop">
        <span>nav</span>
      </Positioned>,
    );
    const css = Array.from(document.querySelectorAll("style"))
      .map((s) => s.textContent ?? "")
      .join("\n");
    expect(css).toContain("@media (max-width: calc(600px - 0.02px))");
  });

  it("menolak style/className yang dipaksa via spread", () => {
    const { container } = renderSealed(
      <Positioned {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}>
        <span>pemicu</span>
      </Positioned>,
    );
    expectSealed(container.firstElementChild as HTMLElement);
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(
      <Positioned anchor="top-end" aria-label="penukar bahasa">
        <button type="button">ID</button>
      </Positioned>,
    );
    await expectNoAxeViolations(container);
  });
});
