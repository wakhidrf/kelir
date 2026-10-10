// @vitest-environment jsdom
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ContextMenu } from "./context-menu";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";

describe("ContextMenu sealed (Gel.3c-8 §6b)", () => {
  it("paksa spread tak mengubah visual; klik-kanan buka menu + onClick jalan", () => {
    const onClick = vi.fn();
    const { container } = renderSealed(
      <ContextMenu
        trigger="Klik kanan di sini"
        menuItems={[{ label: "Ganti", onClick }]}
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      />,
    );
    expectSealed(container.firstElementChild as HTMLElement);
    fireEvent.contextMenu(screen.getByText("Klik kanan di sini"));
    fireEvent.click(screen.getByText("Ganti"));
    expect(onClick).toHaveBeenCalledWith();
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(
      <ContextMenu trigger="Klik kanan di sini" menuItems={[{ label: "Ganti" }]} />,
    );
    await expectNoAxeViolations(container);
  });
});
