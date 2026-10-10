// @vitest-environment jsdom
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Collapsible } from "./collapsible";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";

describe("Collapsible sealed (Gel.3c-6 §6b)", () => {
  it("paksa spread tak mengubah visual; klik trigger kirim boolean", () => {
    const onOpenChange = vi.fn();
    const { container } = renderSealed(
      <Collapsible
        trigger="Detail"
        onOpenChange={onOpenChange}
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      >
        <p>Isi lipatan</p>
      </Collapsible>,
    );
    expectSealed(container.firstElementChild as HTMLElement);
    fireEvent.click(screen.getByText("Detail"));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(
      <Collapsible trigger="Detail">
        <p>Isi lipatan</p>
      </Collapsible>,
    );
    await expectNoAxeViolations(container);
  });
});
