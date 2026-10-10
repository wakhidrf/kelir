// @vitest-environment jsdom
import { describe, it } from "vitest";
import { Label } from "./label";
import { expectSealed, forceSpread, renderSealed } from "./sealed-test-helper";

describe("Label sealed (Gel.3c §6b)", () => {
  it("menolak style/className yang dipaksa via spread", () => {
    const { container } = renderSealed(
      <Label {...forceSpread({ children: "Email" })}>Email</Label>,
    );
    expectSealed(container.firstElementChild as HTMLElement);
  });

  it("render label + asosiasi htmlFor", () => {
    const { container } = renderSealed(<Label htmlFor="email">Email</Label>);
    const el = container.querySelector("label") as HTMLElement;
    if (el.getAttribute("for") !== "email") {
      throw new Error("htmlFor tak sampai ke label");
    }
  });
});
