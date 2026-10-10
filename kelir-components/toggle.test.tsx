// @vitest-environment jsdom
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";
import { Toggle } from "./toggle";

describe("Toggle sealed (Gel.3c-2 §6b)", () => {
  it("menolak style/className yang dipaksa via spread", () => {
    const { container } = renderSealed(
      <Toggle {...forceSpread({ children: "Auto" })}>Auto</Toggle>,
    );
    const el = container.querySelector("button") as HTMLElement;
    expectSealed(el);
  });

  it("model pressed + aria-pressed milik kit", () => {
    const { container } = renderSealed(
      <Toggle pressed onPressedChange={() => {}}>
        Auto Save
      </Toggle>,
    );
    expect(screen.getByText("Auto Save")).toBeDefined();
    expect(
      (container.querySelector("button") as HTMLElement).getAttribute(
        "aria-pressed",
      ),
    ).toBe("true");
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(
      <Toggle pressed={false} onPressedChange={() => {}}>
        Auto Save
      </Toggle>,
    );
    await expectNoAxeViolations(container);
  });
});
