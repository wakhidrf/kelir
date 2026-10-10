// @vitest-environment jsdom
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Accordion } from "./accordion";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";

describe("Accordion sealed (Gel.3c-6 §6b)", () => {
  it("paksa spread tak mengubah visual; onChange kirim boolean", () => {
    const onChange = vi.fn();
    const { container } = renderSealed(
      <Accordion
        summary="Mulai"
        details="Masuk untuk memulai."
        onChange={onChange}
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      />,
    );
    expectSealed(container.firstElementChild as HTMLElement);
    fireEvent.click(screen.getByText("Mulai"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(
      <Accordion summary="Mulai" details="Masuk untuk memulai." />,
    );
    await expectNoAxeViolations(container);
  });
});
