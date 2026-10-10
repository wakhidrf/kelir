// @vitest-environment jsdom
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./badge";
import { expectSealed, forceSpread, renderSealed } from "./sealed-test-helper";

describe("Badge sealed (Gel.3a §6b)", () => {
  it("menolak style/className yang dipaksa via spread", () => {
    const { container } = renderSealed(
      <Badge {...forceSpread({ children: "Online" })}>Online</Badge>,
    );
    const el = container.querySelector("span") as HTMLElement;
    expectSealed(el);
  });

  it("render teks status", () => {
    renderSealed(<Badge variant="destructive">Gagal</Badge>);
    expect(screen.getByText("Gagal")).toBeDefined();
  });
});
