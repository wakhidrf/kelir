import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";
import { Content } from "./content";

describe("Content sealed (§6b)", () => {
  it("paksa spread tak mengubah area scroll kit", () => {
    const { container } = renderSealed(
      <Content {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}>
        <span>a</span>
      </Content>,
    );
    const el = container.firstElementChild as HTMLElement;
    expectSealed(el);
    // flex:1 serialisasi JSDOM = "1 1 0%"; baca longhand yang bermakna.
    expect(el.style.flexGrow).toBe("1");
    expect(el.style.overflowY).toBe("auto");
  });

  it("satu-satunya area scroll: flex + min 0 + latar", () => {
    renderSealed(
      <Content>
        <span>a</span>
      </Content>,
    );
    const el = screen.getByText("a").parentElement as HTMLElement;
    expect(el.style.flexGrow).toBe("1");
    expect(el.style.minWidth).toBe("0px");
    expect(el.style.minHeight).toBe("0px");
    expect(el.style.overflowY).toBe("auto");
    expect(el.style.backgroundColor).not.toBe("");
  });

  it("compact: padding rapat milik kit", () => {
    renderSealed(
      <Content compact>
        <span>a</span>
      </Content>,
    );
    const el = screen.getByText("a").parentElement as HTMLElement;
    // space.sm (0.5rem) — sama dengan padding mobile.
    expect(el.style.padding).toBe("0.5rem");
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(<Content>isi</Content>);
    await expectNoAxeViolations(container);
  });
});
