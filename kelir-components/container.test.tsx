import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Container } from "./container";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";

describe("Container sealed (§6b)", () => {
  it("paksa spread tak mengubah penampung; isi tampil", () => {
    const { container } = renderSealed(
      <Container
        maxWidth="md"
        padding="lg"
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      >
        Isi
      </Container>,
    );
    expect(screen.getByText("Isi")).toBeDefined();
    const el = container.firstElementChild as HTMLElement;
    expectSealed(el);
    expect(el.style.maxWidth).toBe("768px");
    expect(el.style.marginLeft).toBe("auto");
    expect(el.style.marginRight).toBe("auto");
    expect(el.style.paddingLeft).not.toBe("");
  });

  it("default xl: token container + sidePadding milik kit", () => {
    const { container } = renderSealed(<Container>Isi</Container>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.maxWidth).toBe("1280px");
    expect(el.style.paddingLeft).toBe("1.5rem");
  });

  it("paddingBlock: napas vertikal token; default 0", () => {
    const { container } = renderSealed(
      <Container paddingBlock="xl">Isi</Container>,
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.paddingTop).toBe("1.5rem");
    expect(el.style.paddingBottom).toBe("1.5rem");
  });

  it("clip: potong isi meluap; default tanpa overflow", () => {
    const { container } = renderSealed(<Container clip>Isi</Container>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.overflow).toBe("hidden");
  });

  it("paddingBlockMd (#63): napas dasar + override @768px via sx", () => {
    renderSealed(
      <Container paddingBlock="md" paddingBlockMd="2xl">
        Isi
      </Container>,
    );
    // Blok responsif pindah ke sx (emotion), bukan inline.
    const css = Array.from(document.querySelectorAll("style"))
      .map((s) => s.textContent ?? "")
      .join("\n");
    expect(css).toMatch(/padding-top:\s*0\.75rem/);
    expect(css).toMatch(/@media \(min-width:\s*768px\)/);
    expect(css).toMatch(/padding-top:\s*2rem/);
  });

  it("tanpa clip: tanpa overflow (perilaku lama)", () => {
    const { container } = renderSealed(<Container>Isi</Container>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.overflow).toBe("");
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(
      <Container maxWidth="sm">Isi</Container>,
    );
    await expectNoAxeViolations(container);
  });
});
