// @vitest-environment jsdom
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./button";
import { expectSealed, forceSpread, renderSealed } from "./sealed-test-helper";
import { Tooltip } from "./tooltip";

describe("Tooltip sealed (Gel.3c-4 §6b)", () => {
  it("menolak style/className yang dipaksa via spread", () => {
    const { container } = renderSealed(
      <Tooltip {...forceSpread({ title: "Info" })} title="Info">
        <Button variant="secondary">Hover</Button>
      </Tooltip>,
    );
    expectSealed(container.firstElementChild as HTMLElement);
  });

  it("render pemicu + arrow milik kit", () => {
    renderSealed(
      <Tooltip title="Detail tambahan">
        <Button variant="secondary">Hover Me</Button>
      </Tooltip>,
    );
  });

  it("pemicu fokusabel (P2 a11y): keyboard buka tooltip via MUI", () => {
    // jsdom tak mensintesis :focus-visible MUI, jadi buka-tooltip tak bisa
    // diobservasi; yang dibuktikan kit: pemicu elemen fokusabel natif
    // (tombol) sehingga keyboard sampai ke sana di browser nyata.
    renderSealed(
      <Tooltip title="Detail tambahan">
        <Button variant="secondary">Hover Me</Button>
      </Tooltip>,
    );
    const trigger = screen.getByRole("button", { name: "Hover Me" });
    (trigger as HTMLElement).focus();
    expect(document.activeElement).toBe(trigger);
    expect((trigger as HTMLElement).tabIndex).not.toBe(-1);
  });
});
