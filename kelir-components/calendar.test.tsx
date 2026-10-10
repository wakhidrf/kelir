// @vitest-environment jsdom
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Calendar } from "./calendar";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";

describe("Calendar sealed (Gel.3c-8 §6b)", () => {
  it("paksa spread tak mengubah visual; klik tanggal kirim Date", () => {
    const onChange = vi.fn();
    const { container } = renderSealed(
      <Calendar
        value={new Date(2026, 9, 10)}
        onChange={onChange}
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      />,
    );
    expectSealed(container.firstElementChild as HTMLElement);
    fireEvent.click(screen.getByText("15"));
    expect(onChange).toHaveBeenCalledTimes(1);
    const sent = onChange.mock.calls[0][0] as Date;
    expect(sent instanceof Date).toBe(true);
    expect(sent.getDate()).toBe(15);
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(
      <Calendar value={new Date(2026, 9, 10)} />,
    );
    await expectNoAxeViolations(container);
  });
});
