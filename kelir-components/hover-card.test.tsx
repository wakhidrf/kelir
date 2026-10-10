// @vitest-environment jsdom
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HoverCard } from "./hover-card";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";

describe("HoverCard sealed (Gel.3c-7 §6b)", () => {
  it("paksa spread tak mengubah visual; hover buka kartu", () => {
    const { container } = renderSealed(
      <HoverCard
        trigger={<span>Rania</span>}
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      >
        <p>Profil Rania</p>
      </HoverCard>,
    );
    expectSealed(container.firstElementChild as HTMLElement);
    fireEvent.mouseEnter(screen.getByText("Rania"));
    expect(screen.getByText("Profil Rania")).toBeDefined();
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(
      <HoverCard trigger={<span>Rania</span>}>
        <p>Profil Rania</p>
      </HoverCard>,
    );
    await expectNoAxeViolations(container);
  });
});
