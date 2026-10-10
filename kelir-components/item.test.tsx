// @vitest-environment jsdom
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar } from "./avatar";
import { Button } from "./button";
import { Item } from "./item";
import { expectSealed, forceSpread, renderSealed } from "./sealed-test-helper";

describe("Item sealed (Gel.3c-5 §6b)", () => {
  it("menolak style/className yang dipaksa via spread", () => {
    const { container } = renderSealed(
      <Item {...forceSpread({ title: "x" })} title="x" />,
    );
    expectSealed(container.firstElementChild as HTMLElement);
  });

  it("komposisi sealed (Avatar + Button) tanpa visual konsumen", () => {
    renderSealed(
      <Item
        title="Headphones"
        description="Noise cancelling"
        media={<Avatar fallbackText="W" />}
        action={<Button variant="outline">Detail</Button>}
      />,
    );
    expect(screen.getByText("Headphones")).toBeDefined();
    expect(screen.getByText("Noise cancelling")).toBeDefined();
    expect(screen.getByText("W")).toBeDefined();
  });
});
