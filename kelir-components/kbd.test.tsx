// @vitest-environment jsdom
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Kbd } from "./kbd";
import { expectSealed, forceSpread, renderSealed } from "./sealed-test-helper";

describe("Kbd sealed (Gel.3c §6b)", () => {
  it("menolak style/className yang dipaksa via spread", () => {
    const { container } = renderSealed(
      <Kbd {...forceSpread({ children: "Ctrl" })}>Ctrl</Kbd>,
    );
    expectSealed(container.querySelector("kbd") as HTMLElement);
  });

  it("render elemen kbd semantik", () => {
    renderSealed(<Kbd>Ctrl</Kbd>);
    expect(screen.getByText("Ctrl").tagName).toBe("KBD");
  });
});
