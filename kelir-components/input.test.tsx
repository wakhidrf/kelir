import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Input } from "./input";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";

describe("Input sealed (§6b)", () => {
  it("paksa spread tak mengubah visual; onChange menerima string", () => {
    const onChange = vi.fn();
    renderSealed(
      <Input
        placeholder="nama"
        onChange={onChange}
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      />,
    );
    const el = screen.getByPlaceholderText("nama");
    expectSealed(el);
    fireEvent.change(el, { target: { value: "budi" } });
    expect(onChange).toHaveBeenCalledWith("budi");
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(
      <Input aria-label="nama" onChange={() => {}} />,
    );
    await expectNoAxeViolations(container);
  });
});
