// @vitest-environment jsdom
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Chart } from "./chart";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";

describe("Chart sealed (Gel.3c-11 §6b)", () => {
  it("menolak style/className yang dipaksa via spread", () => {
    const { container } = renderSealed(
      <Chart
        data={[{ name: "Jan", sales: 4000 }]}
        categories={["sales"]}
        dataKey="name"
        type="bar"
        title="Penjualan"
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      />,
    );
    expectSealed(container.firstElementChild as HTMLElement);
    expect(screen.getByText("Penjualan")).toBeDefined();
    expect(screen.getByText("Jan")).toBeDefined();
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(
      <Chart
        data={[{ name: "Jan", sales: 4000 }]}
        categories={["sales"]}
        dataKey="name"
        type="line"
      />,
    );
    await expectNoAxeViolations(container);
  });
});
