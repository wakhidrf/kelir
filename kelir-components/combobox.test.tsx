// @vitest-environment jsdom
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Combobox } from "./combobox";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";

describe("Combobox sealed (Gel.3c-11 §6b)", () => {
  it("paksa spread tak mengubah visual; pilih opsi kirim string", () => {
    const onChange = vi.fn();
    const { container } = renderSealed(
      <Combobox
        label="Framework"
        placeholder="Pilih framework"
        options={["React", "Vue"]}
        onChange={onChange}
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      />,
    );
    expectSealed(container.firstElementChild as HTMLElement);
    // Buka popup lalu pilih "Vue".
    fireEvent.mouseDown(screen.getByRole("combobox"));
    fireEvent.click(screen.getByText("Vue"));
    expect(onChange).toHaveBeenCalledWith("Vue");
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(
      <Combobox label="Framework" options={["React", "Vue"]} />,
    );
    await expectNoAxeViolations(container);
  });
});
