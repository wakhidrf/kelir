// @vitest-environment jsdom
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { InputOtp } from "./input-otp";
import {
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";

describe("InputOtp sealed (Gel.3c-3 §6b)", () => {
  it("menolak style/className yang dipaksa via spread", () => {
    const { container } = renderSealed(
      <InputOtp {...forceSpread({ value: "", onChange: () => {} })} value="" onChange={() => {}} />,
    );
    expectSealed(container.firstElementChild as HTMLElement);
  });

  it("ketik digit → onChange string gabungan", () => {
    const onChange = vi.fn();
    renderSealed(<InputOtp value="" onChange={onChange} length={4} />);
    fireEvent.change(screen.getByLabelText("OTP digit 1"), {
      target: { value: "7" },
    });
    expect(onChange).toHaveBeenCalledWith("7");
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(
      <InputOtp value="12" onChange={() => {}} />,
    );
    await expectNoAxeViolations(container);
  });
});
