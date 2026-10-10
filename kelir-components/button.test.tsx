import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";

describe("Button sealed (§6b)", () => {
  it("paksa spread style/className: visual kit tak berubah, perilaku jalan", () => {
    const onClick = vi.fn();
    const { container } = renderSealed(
      <Button
        variant="primary"
        onClick={onClick}
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      >
        Simpan
      </Button>,
    );
    const el = screen.getByRole("button", { name: "Simpan" });
    expectSealed(el);
    fireEvent.click(el);
    expect(onClick).toHaveBeenCalledTimes(1);
    void container;
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(
      <Button variant="primary" onClick={() => {}}>
        Simpan
      </Button>,
    );
    await expectNoAxeViolations(container);
  });
});
