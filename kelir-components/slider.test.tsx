// @vitest-environment jsdom
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";
import { Slider } from "./slider";

describe("Slider sealed (Gel.3c-4 §6b)", () => {
  it("menolak style/className yang dipaksa via spread", () => {
    const { container } = renderSealed(
      <Slider {...forceSpread({ value: 60 })} value={60} />,
    );
    expectSealed(container.firstElementChild as HTMLElement);
  });

  it("onChange semantik number", () => {
    const onChange = vi.fn();
    renderSealed(<Slider value={60} onChange={onChange} aria-label="Volume" />);
    const slider = screen.getByRole("slider");
    fireEvent.change(slider, { target: { value: "70" } });
    expect(onChange).toHaveBeenCalledWith(70);
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(
      <Slider defaultValue={30} aria-label="Volume" />,
    );
    await expectNoAxeViolations(container);
  });
});
