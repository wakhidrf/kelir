// @vitest-environment jsdom
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Breadcrumb } from "./breadcrumb";
import { expectSealed, forceSpread, renderSealed } from "./sealed-test-helper";

const ITEMS = [
  { label: "Dashboard", href: "#" },
  { label: "Current", active: true },
];

describe("Breadcrumb sealed (Gel.3c-4 §6b)", () => {
  it("menolak style/className yang dipaksa via spread", () => {
    const { container } = renderSealed(
      <Breadcrumb {...forceSpread({ items: ITEMS })} items={ITEMS} />,
    );
    expectSealed(container.firstElementChild as HTMLElement);
  });

  it("render jejak + item aktif eksplisit", () => {
    renderSealed(<Breadcrumb items={ITEMS} />);
    expect(screen.getByText("Dashboard")).toBeDefined();
    expect(screen.getByText("Current")).toBeDefined();
  });
});
