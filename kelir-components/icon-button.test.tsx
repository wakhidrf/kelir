import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { IconButton } from "./icon-button";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";

describe("IconButton sealed (§6b)", () => {
  it("paksa spread: visual tak berubah, aria-label wajib ada", () => {
    const onClick = vi.fn();
    const { container } = renderSealed(
      <IconButton
        icon={<span>i</span>}
        aria-label="Tutup"
        onClick={onClick}
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      />,
    );
    const el = screen.getByRole("button", { name: "Tutup" });
    expectSealed(el);
    fireEvent.click(el);
    expect(onClick).toHaveBeenCalledTimes(1);
    void container;
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(
      <IconButton icon={<span>i</span>} aria-label="Tutup" onClick={() => {}} />,
    );
    await expectNoAxeViolations(container);
  });

  it("size sm/lg mengatur padding + minWidth; default md = hari ini", () => {
    const { unmount: u1 } = renderSealed(
      <IconButton icon={<span>i</span>} aria-label="S" onClick={() => {}} size="sm" />,
    );
    const sm = screen.getByRole("button", { name: "S" });
    expect(sm.style.padding).toBe("6px");
    expect(sm.style.minWidth).toBe("32px");
    u1();
    const { unmount: u2 } = renderSealed(
      <IconButton icon={<span>i</span>} aria-label="L" onClick={() => {}} size="lg" />,
    );
    const lg = screen.getByRole("button", { name: "L" });
    expect(lg.style.padding).toBe("14px");
    expect(lg.style.minWidth).toBe("48px");
    u2();
    renderSealed(
      <IconButton icon={<span>i</span>} aria-label="M" onClick={() => {}} />,
    );
    const md = screen.getByRole("button", { name: "M" });
    expect(md.style.padding).toBe("10px");
    expect(md.style.minWidth).toBe("40px");
  });

  it("shape circle/square/rounded (default) via borderRadius inline", () => {
    const { unmount: u1 } = renderSealed(
      <IconButton icon={<span>i</span>} aria-label="A" onClick={() => {}} shape="circle" />,
    );
    expect(screen.getByRole("button", { name: "A" }).style.borderRadius).toBe("50%");
    u1();
    const { unmount: u2 } = renderSealed(
      <IconButton icon={<span>i</span>} aria-label="B" onClick={() => {}} shape="square" />,
    );
    expect(screen.getByRole("button", { name: "B" }).style.borderRadius).toBe("0px");
    u2();
    renderSealed(
      <IconButton icon={<span>i</span>} aria-label="C" onClick={() => {}} />,
    );
    expect(
      screen.getByRole("button", { name: "C" }).style.borderRadius,
    ).not.toBe("50%");
  });
});
