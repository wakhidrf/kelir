// @vitest-environment jsdom
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";
import { Textarea } from "./textarea";

describe("Textarea sealed (Gel.3c-3 §6b)", () => {
  it("menolak style/className yang dipaksa via spread", () => {
    const { container } = renderSealed(
      <Textarea {...forceSpread({ label: "Pesan" })} />,
    );
    expectSealed(container.querySelector("textarea") as HTMLElement);
  });

  it("onChange semantik string + label/helper milik kit", () => {
    const onChange = vi.fn();
    renderSealed(
      <Textarea
        label="Message"
        placeholder="Type here..."
        onChange={onChange}
        helperText="Maks 500 karakter"
        aria-label="Pesan"
      />,
    );
    const area = screen.getByRole("textbox", { name: "Pesan" });
    fireEvent.change(area, { target: { value: "halo" } });
    expect(onChange).toHaveBeenCalledWith("halo");
    expect(screen.getByText("Maks 500 karakter")).toBeDefined();
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(
      <Textarea label="Message" placeholder="Type here..." />,
    );
    await expectNoAxeViolations(container);
  });
});
