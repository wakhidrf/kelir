// @vitest-environment jsdom
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NativeSelect } from "./native-select";
import {
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";

const OPTIONS = [
  { label: "Indonesia", value: "id" },
  { label: "English", value: "en" },
];

describe("NativeSelect sealed (Gel.3c-3 §6b)", () => {
  it("menolak style/className yang dipaksa via spread", () => {
    const { container } = renderSealed(
      <NativeSelect {...forceSpread({ options: OPTIONS })} options={OPTIONS} />,
    );
    expectSealed(container.querySelector("select") as HTMLElement);
  });

  it("onChange semantik string", () => {
    const onChange = vi.fn();
    renderSealed(
      <NativeSelect
        options={OPTIONS}
        value="id"
        onChange={onChange}
        label="Bahasa"
      />,
    );
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "en" },
    });
    expect(onChange).toHaveBeenCalledWith("en");
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(
      <NativeSelect options={OPTIONS} label="Bahasa" />,
    );
    await expectNoAxeViolations(container);
  });
});
