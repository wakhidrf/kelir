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
import { TopBar } from "./top-bar";

describe("TopBar sealed (§6b)", () => {
  it("paksa spread tak mengubah bar kit; slot tampil", () => {
    const { container } = renderSealed(
      <TopBar
        left="kiri"
        right="kanan"
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      />,
    );
    expect(screen.getByText("kiri")).toBeDefined();
    expect(screen.getByText("kanan")).toBeDefined();
    const el = container.firstElementChild as HTMLElement;
    expectSealed(el);
    expect(el.tagName).toBe("HEADER");
    expect(el.style.display).toBe("flex");
    expect(el.style.justifyContent).toBe("");
  });

  it("kanan menempel di tepi (margin auto); satu sisi tetap di tepinya", () => {
    renderSealed(<TopBar right="kanan" />);
    // Anak string langsung di kotak kanan — elemennya sendiri kotaknya.
    const rightBox = screen.getByText("kanan");
    expect(rightBox.style.marginLeft).toBe("auto");
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(
      <TopBar left="kiri" right="kanan" />,
    );
    await expectNoAxeViolations(container);
  });
});
