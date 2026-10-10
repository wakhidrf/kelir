// @vitest-environment jsdom
import { describe, it } from "vitest";
import { Button } from "./button";
import { ButtonGroup } from "./button-group";
import { expectSealed, forceSpread, renderSealed } from "./sealed-test-helper";

describe("ButtonGroup sealed (Gel.3b §6b)", () => {
  it("menolak style/className yang dipaksa via spread", () => {
    const { container } = renderSealed(
      <ButtonGroup {...forceSpread({})}>
        <Button variant="outline">Day</Button>
      </ButtonGroup>,
    );
    const el = container.querySelector(".MuiButtonGroup-root") as HTMLElement;
    expectSealed(el);
  });

  it("render grup tombol", () => {
    renderSealed(
      <ButtonGroup disabled>
        <Button variant="outline">Day</Button>
      </ButtonGroup>,
    );
  });
});
