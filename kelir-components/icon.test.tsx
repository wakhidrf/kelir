import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Icon } from "./icon";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";

describe("Icon sealed (6b)", () => {
  it("cetak ikon: ukuran + warna kit, dekoratif tanpa aria-label", () => {
    renderSealed(
      <Icon intent="primary" size="lg">
        <span>ikon</span>
      </Icon>,
    );
    const el = screen.getByText("ikon").parentElement as HTMLElement;
    expectSealed(el);
    expect(el.style.display).toBe("inline-flex");
    expect(el.style.fontSize).toBe("1.75rem");
    expect(el.style.color).toBeTruthy();
    expect(el.getAttribute("aria-hidden")).toBe("true");
  });

  it("label aksesibel menggantikan aria-hidden", () => {
    renderSealed(
      <Icon aria-label="Status aktif">
        <span>ikon</span>
      </Icon>,
    );
    const el = screen.getByLabelText("Status aktif");
    expect(el.getAttribute("aria-hidden")).toBeNull();
    expect(el.style.fontSize).toBe("1.25rem");
  });

  it("paksa spread tak mengubah warna kit", () => {
    renderSealed(
      <Icon intent="accent" {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}>
        <span>ikon</span>
      </Icon>,
    );
    const el = screen.getByText("ikon").parentElement as HTMLElement;
    expectSealed(el);
    expect(el.className).not.toContain(EVIL_CLASS);
  });
});
