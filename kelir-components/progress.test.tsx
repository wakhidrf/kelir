// @vitest-environment jsdom
import { describe, it } from "vitest";
import { Progress } from "./progress";
import { expectSealed, forceSpread, renderSealed } from "./sealed-test-helper";

describe("Progress sealed (Gel.3c-2 §6b)", () => {
  it("menolak style/className yang dipaksa via spread", () => {
    const { container } = renderSealed(
      <Progress {...forceSpread({ value: 65 })} value={65} />,
    );
    const el = container.querySelector('[role="progressbar"]') as HTMLElement;
    expectSealed(el);
  });

  it("render determinate + indeterminate", () => {
    renderSealed(<Progress value={85} />);
    renderSealed(<Progress variant="indeterminate" />);
  });
});
