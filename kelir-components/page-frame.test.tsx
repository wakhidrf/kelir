// @vitest-environment jsdom
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageFrame } from "./page-frame";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";

describe("PageFrame sealed (§6b)", () => {
  it("akar: tepi halaman + lebar isi dari token layout.page", () => {
    const { container } = renderSealed(
      <PageFrame>
        <p>isi</p>
      </PageFrame>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.minHeight).toBe("100dvh");
    expect(root.style.paddingTop).toBe("96px");
    const shell = root.firstElementChild as HTMLElement;
    expect(shell.style.maxWidth).toBe("1200px");
    expect(shell.style.flexDirection).toBe("column");
  });

  it("slot: header (tengah) + main + footer (garis pemisah)", () => {
    renderSealed(
      <PageFrame header={<h1>Judul</h1>} footer={<p>kaki</p>}>
        <p>isi</p>
      </PageFrame>,
    );
    const header = screen.getByRole("banner");
    expect(header.style.textAlign).toBe("center");
    expect(screen.getByRole("main")).not.toBeNull();
    const footer = screen.getByRole("contentinfo");
    expect(footer.style.borderTop).toContain("1px solid");
  });

  it("tanpa slot: hanya main (perilaku minimal)", () => {
    renderSealed(
      <PageFrame>
        <p>isi</p>
      </PageFrame>,
    );
    expect(screen.queryByRole("banner")).toBeNull();
    expect(screen.queryByRole("contentinfo")).toBeNull();
    expect(screen.getByRole("main")).not.toBeNull();
  });

  it("menolak style/className yang dipaksa via spread", () => {
    const { container } = renderSealed(
      <PageFrame {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}>
        <p>isi</p>
      </PageFrame>,
    );
    expectSealed(container.firstElementChild as HTMLElement);
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(
      <PageFrame header={<h1>Kelir</h1>} footer={<p>MIT</p>}>
        <p>isi</p>
      </PageFrame>,
    );
    await expectNoAxeViolations(container);
  });
});
