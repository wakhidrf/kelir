// @vitest-environment jsdom
import { describe, it } from "vitest";
import { expectSealed, forceSpread, renderSealed } from "./sealed-test-helper";
import { Sidebar } from "./sidebar";

describe("Sidebar sealed (Gel.3c §6b)", () => {
  it("menolak style/className yang dipaksa via spread", () => {
    const { container } = renderSealed(
      <Sidebar {...forceSpread({ header: "Menu" })}>Item 1</Sidebar>,
    );
    expectSealed(container.firstElementChild as HTMLElement);
  });

  it("render header + isi + footer", () => {
    renderSealed(
      <Sidebar header={<div>Menu</div>} footer={<div>v1</div>}>
        <div>Item 1</div>
      </Sidebar>,
    );
  });
});
