// @vitest-environment jsdom
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Pagination } from "./pagination";
import {
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";

describe("Pagination sealed (Gel.3c-5 §6b)", () => {
  it("menolak style/className yang dipaksa via spread", () => {
    const { container } = renderSealed(
      <Pagination {...forceSpread({ count: 5 })} count={5} />,
    );
    expectSealed(container.firstElementChild as HTMLElement);
  });

  it("onChange semantik number", () => {
    const onChange = vi.fn();
    renderSealed(<Pagination count={5} page={1} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Go to page 3" }));
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(<Pagination count={5} page={1} />);
    await expectNoAxeViolations(container);
  });
});
