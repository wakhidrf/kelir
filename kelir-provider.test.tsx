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

  it("brandFont + brandColors: kit memasang variabel identitas (dibersihkan)", () => {
    renderSealed(
      <KelirProvider
        defaultTheme="neumorphism"
        brandFont="'Vermin Vibes Out Of Ink'"
        brandColors={{ accent: "#F07850", ink: "#505078; color: red" }}
      >
        <span>app</span>
      </KelirProvider>,
    );
    const css = Array.from(document.querySelectorAll("style"))
      .map((s) => s.textContent ?? "")
      .join("\n");
    expect(css).toContain("--kelir-font-brand: 'Vermin Vibes Out Of Ink'");
    expect(css).toContain("--kelir-brand-accent: #F07850");
    expect(css).toContain("--kelir-brand-ink: #505078 color: red");
    expect(css).not.toContain("#505078; color");
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
