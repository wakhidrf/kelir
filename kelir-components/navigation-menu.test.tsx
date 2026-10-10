// @vitest-environment jsdom
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NavigationMenu } from "./navigation-menu";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";

describe("NavigationMenu sealed (Gel.3c-9 §6b)", () => {
  it("paksa spread tak mengubah visual; onClick tanpa argumen", () => {
    const onClick = vi.fn();
    const { container } = renderSealed(
      <NavigationMenu
        items={[
          { label: "Dasbor", active: true },
          { label: "Pesanan", onClick },
        ]}
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      />,
    );
    expectSealed(container.firstElementChild as HTMLElement);
    fireEvent.click(screen.getByText("Pesanan"));
    expect(onClick).toHaveBeenCalledWith();
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(
      <NavigationMenu items={[{ label: "Dasbor", active: true }]} />,
    );
    await expectNoAxeViolations(container);
  });
});
