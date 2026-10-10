import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Checkbox } from "./checkbox";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";

describe("Checkbox sealed (Gel.2 §6b)", () => {
  it("spread tak mempan; klik → onChange boolean", () => {
    const onChange = vi.fn();
    renderSealed(
      <Checkbox
        label="Setuju"
        onChange={onChange}
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      />,
    );
    const el = screen.getByRole("checkbox", { name: "Setuju" });
    expectSealed(el);
    fireEvent.click(el);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(
      <Checkbox label="Setuju" onChange={() => {}} />,
    );
    await expectNoAxeViolations(container);
  });
});
