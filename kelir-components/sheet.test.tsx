// @vitest-environment jsdom
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { expectSealed, forceSpread, renderSealed } from "./sealed-test-helper";
import { Sheet } from "./sheet";

describe("Sheet sealed (Gel.3c-5 §6b)", () => {
  it("menolak style/className yang dipaksa via spread", () => {
    renderSealed(
      <Sheet open title="Detail" onClose={() => {}} {...forceSpread({})}>
        <p>Isi sheet</p>
      </Sheet>,
    );
    // Portal MUI: konten di document.body, bukan container.
    const sheet = document.querySelector(".MuiDrawer-root") as HTMLElement;
    expectSealed(sheet);
    expect(screen.getByText("Detail")).toBeDefined();
  });
});
