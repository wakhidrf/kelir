// @vitest-environment jsdom
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Empty } from "./empty";
import { expectSealed, forceSpread, renderSealed } from "./sealed-test-helper";

describe("Empty sealed (Gel.3c §6b)", () => {
  it("menolak style/className yang dipaksa via spread", () => {
    const { container } = renderSealed(
      <Empty {...forceSpread({ title: "Kosong" })} />,
    );
    expectSealed(container.firstElementChild as HTMLElement);
  });

  it("render title + description", () => {
    renderSealed(<Empty title="No results" description="Coba lagi." />);
    expect(screen.getByText("No results")).toBeDefined();
    expect(screen.getByText("Coba lagi.")).toBeDefined();
  });
});
