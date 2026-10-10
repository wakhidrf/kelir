import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RadioGroup } from "./radio-group";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";

const OPTIONS = [
  { label: "A", value: "a" },
  { label: "B", value: "b" },
];

describe("RadioGroup sealed (Gel.2 §6b)", () => {
  it("spread tak mempan; pilih → onChange string", () => {
    const onChange = vi.fn();
    renderSealed(
      <RadioGroup
        options={OPTIONS}
        aria-label="pilihan"
        onChange={onChange}
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      />,
    );
    const group = screen.getByRole("radiogroup");
    expectSealed(group);
    fireEvent.click(screen.getByRole("radio", { name: "B" }));
    expect(onChange).toHaveBeenCalledWith("b");
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(
      <RadioGroup options={OPTIONS} aria-label="pilihan" onChange={() => {}} />,
    );
    await expectNoAxeViolations(container);
  });
});
