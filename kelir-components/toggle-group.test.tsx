// @vitest-environment jsdom
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { expectSealed, forceSpread, renderSealed } from "./sealed-test-helper";
import { ToggleGroup } from "./toggle-group";

const OPTIONS = [
  { label: "Bold", value: "bold" },
  { label: "Italic", value: "italic" },
];

describe("ToggleGroup sealed (Gel.3c-2 §6b)", () => {
  it("menolak style/className yang dipaksa via spread", () => {
    const { container } = renderSealed(
      <ToggleGroup {...forceSpread({ options: OPTIONS })} options={OPTIONS} />,
    );
    expectSealed(container.firstElementChild as HTMLElement);
  });

  it("onChange semantik string (tanpa event)", () => {
    const onChange = vi.fn();
    renderSealed(
      <ToggleGroup options={OPTIONS} value="bold" onChange={onChange} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Italic" }));
    expect(onChange).toHaveBeenCalledWith("italic");
  });
  it("variant joined = pil menyatu, segmen terpilih tetap aktif", () => {
    renderSealed(
      <ToggleGroup
        options={OPTIONS}
        variant="joined"
        value="bold"
        onChange={() => {}}
      />,
    );
    const active = screen.getByRole("button", { name: "Bold" });
    const idle = screen.getByRole("button", { name: "Italic" });
    expect(active.getAttribute("aria-pressed")).toBe("true");
    expect(idle.getAttribute("aria-pressed")).toBe("false");
  });
});
