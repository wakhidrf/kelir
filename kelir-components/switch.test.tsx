import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";
import { Switch } from "./switch";

describe("Switch sealed (Gel.2 §6b)", () => {
  it("spread tak mempan; klik → onChange boolean", () => {
    const onChange = vi.fn();
    renderSealed(
      <Switch
        aria-label="notif"
        onChange={onChange}
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      />,
    );
    const el = screen.getByRole("switch");
    expectSealed(el);
    fireEvent.click(el);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(
      <Switch aria-label="notif" onChange={() => {}} />,
    );
    await expectNoAxeViolations(container);
  });
});
