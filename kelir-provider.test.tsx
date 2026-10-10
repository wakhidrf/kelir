import { fireEvent, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { KelirProvider, useKelir } from "./kelir-provider";
import { renderSealed } from "./kelir-components/sealed-test-helper";

function ThemeProbe() {
  const { theme, setTheme } = useKelir();
  return (
    <button type="button" onClick={() => setTheme("aurora-ui")}>
      tema-{theme}
    </button>
  );
}

describe("KelirProvider (§3c)", () => {
  it("menerapkan defaultTheme ke atribut dokumen + anak tampil", () => {
    renderSealed(
      <KelirProvider defaultTheme="neumorphism">
        <ThemeProbe />
      </KelirProvider>,
    );
    expect(document.documentElement.getAttribute("data-kelir-theme")).toBe(
      "neumorphism",
    );
    expect(screen.getByRole("button", { name: "tema-neumorphism" })).toBeDefined();
  });

  it("setTheme via context mengganti tema runtime (bukan via props)", () => {
    renderSealed(
      <KelirProvider defaultTheme="neumorphism">
        <ThemeProbe />
      </KelirProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "tema-neumorphism" }));
    expect(document.documentElement.getAttribute("data-kelir-theme")).toBe(
      "aurora-ui",
    );
    expect(screen.getByRole("button", { name: "tema-aurora-ui" })).toBeDefined();
  });
});
