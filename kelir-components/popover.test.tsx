// @vitest-environment jsdom
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";
import { Popover } from "./popover";
import { expectSealed, forceSpread, renderSealed } from "./sealed-test-helper";

describe("Popover sealed (Gel.3c-4 §6b)", () => {
  it("menolak style/className yang dipaksa via spread", () => {
    const { container } = renderSealed(
      <Popover
        {...forceSpread({ trigger: "x" })}
        trigger={<Button variant="outline">Open</Button>}
      >
        <div>Isi</div>
      </Popover>,
    );
    expectSealed(container.firstElementChild as HTMLElement);
  });

  it("klik trigger → buka; Escape → onClose tanpa event", () => {
    const onClose = vi.fn();
    renderSealed(
      <Popover
        trigger={<Button variant="outline">Open Settings</Button>}
        onClose={onClose}
      >
        <div>Isi popover</div>
      </Popover>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Open Settings" }));
    const body = screen.getByText("Isi popover");
    expect(body).toBeDefined();
    fireEvent.keyDown(body, { key: "Escape" });
    expect(onClose).toHaveBeenCalledWith();
  });

  it("pemicu fokusabel + panah navigasi menu (P2 a11y)", () => {
    renderSealed(
      <Popover trigger={<Button variant="outline">Open Settings</Button>}>
        <div>Isi popover</div>
      </Popover>,
    );
    const trigger = screen.getByRole("button", { name: "Open Settings" });
    (trigger as HTMLElement).focus();
    expect(document.activeElement).toBe(trigger);
  });
});
