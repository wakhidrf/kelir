import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";
import { FlexItem } from "./flex-item";

describe("FlexItem sealed (§6b)", () => {
  it("paksa spread tak mengubah kontrol flex kit", () => {
    renderSealed(
      <FlexItem
        grow
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      >
        <span>a</span>
      </FlexItem>,
    );
    const el = screen.getByText("a").parentElement as HTMLElement;
    expectSealed(el);
    // flex:1 serialisasi JSDOM = "1 1 0%"; baca longhand yang bermakna.
    expect(el.style.flexGrow).toBe("1");
  });

  it("grow: isi sisa ruang; default mati", () => {
    renderSealed(
      <FlexItem grow>
        <span>a</span>
      </FlexItem>,
    );
    const el = screen.getByText("a").parentElement as HTMLElement;
    expect(el.style.flexGrow).toBe("1");
    // jsdom menormalkan 0 → 0px (bukan string kosong).
    expect(el.style.minWidth).toBe("0px");
  });

  it("shrink={false}: tolak penyusutan; default susut normal", () => {
    renderSealed(
      <FlexItem shrink={false}>
        <span>a</span>
      </FlexItem>,
    );
    const el = screen.getByText("a").parentElement as HTMLElement;
    expect(el.style.flexShrink).toBe("0");
  });

  it("clip: potong luapan; default mati (properti dihilangkan)", () => {
    renderSealed(
      <FlexItem clip>
        <span>a</span>
      </FlexItem>,
    );
    const el = screen.getByText("a").parentElement as HTMLElement;
    expect(el.style.overflow).toBe("hidden");
  });

  it("default: blok biasa tanpa prop flex", () => {
    renderSealed(
      <FlexItem>
        <span>b</span>
      </FlexItem>,
    );
    const el = screen.getByText("b").parentElement as HTMLElement;
    expect(el.style.flex).toBe("");
    expect(el.style.minWidth).toBe("");
    expect(el.style.flexShrink).toBe("");
    expect(el.style.overflow).toBe("");
  });
});
