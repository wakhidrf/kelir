// @vitest-environment jsdom
import { describe, it } from "vitest";
import { expectSealed, forceSpread, renderSealed } from "./sealed-test-helper";
import { Skeleton } from "./skeleton";

describe("Skeleton sealed (Gel.3a §6b)", () => {
  it("menolak style/className yang dipaksa via spread", () => {
    const { container } = renderSealed(<Skeleton {...forceSpread({})} />);
    const el = container.querySelector(".MuiSkeleton-root") as HTMLElement;
    expectSealed(el);
  });

  it("render varian + dimensi tanpa visual milik konsumen", () => {
    renderSealed(<Skeleton variant="circular" width={48} height={48} />);
  });
});
