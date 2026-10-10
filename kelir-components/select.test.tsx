import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Select } from "./select";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";

const OPTIONS = [
  { label: "Kentang", value: "kentang" },
  { label: "Bayam", value: "bayam" },
];

describe("Select sealed (§6b)", () => {
  it("paksa spread tak mengubah visual; pilih opsi → onChange string", () => {
    const onChange = vi.fn();
    renderSealed(
      <Select
        options={OPTIONS}
        onChange={onChange}
        label="Sayur"
        placeholder="Pilih"
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      />,
    );
    const combo = screen.getByRole("combobox");
    expectSealed(combo);
    fireEvent.mouseDown(combo);
    fireEvent.click(screen.getByRole("option", { name: "Bayam" }));
    expect(onChange).toHaveBeenCalledWith("bayam");
  });

  it("bebas pelanggaran axe (tertutup)", async () => {
    const { container } = renderSealed(
      <Select options={OPTIONS} aria-label="sayur" onChange={() => {}} />,
    );
    await expectNoAxeViolations(container);
  });
});
