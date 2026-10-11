import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./button";
import { Card } from "./card";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";

describe("Card sealed (§6b)", () => {
  it("paksa spread tak mengubah visual; slot teks/aksi tampil", () => {
    renderSealed(
      <Card
        title="Judul"
        subtitle="Sub"
        footer={<Button variant="primary">OK</Button>}
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      >
        Isi
      </Card>,
    );
    expect(screen.getByText("Judul")).toBeDefined();
    expect(screen.getByText("Isi")).toBeDefined();
    expect(screen.getByRole("button", { name: "OK" })).toBeDefined();
    // Root MuiCard = ancestor teratas dari judul
    let el = screen.getByText("Judul") as HTMLElement | null;
    while (el?.parentElement && !el.className.includes("MuiCard-root")) {
      el = el.parentElement;
    }
    expect(el).not.toBeNull();
    expectSealed(el as Element);
  });

  it("headerAlign=center: judul + subjudul rata tengah; default start", () => {
    renderSealed(
      <Card title="Judul" subtitle="Sub" headerAlign="center">
        Isi
      </Card>,
    );
    expect(screen.getByText("Judul").style.textAlign).toBe("center");
    expect(screen.getByText("Sub").style.textAlign).toBe("center");
  });

  it("tanpa headerAlign: judul tetap rata start (kiri di LTR, nol-ubah visual)", () => {
    renderSealed(<Card title="Judul">Isi</Card>);
    expect(screen.getByText("Judul").style.textAlign).toBe("start");
  });

  it("scrollable: kartu kolom flex + isi scroll internal; default tak berubah", () => {
    renderSealed(
      <Card title="Judul" scrollable>
        Isi scroll
      </Card>,
    );
    let root = screen.getByText("Judul") as HTMLElement | null;
    while (root?.parentElement && !root.className.includes("MuiCard-root")) {
      root = root.parentElement;
    }
    expect(root).not.toBeNull();
    expect(root?.style.display).toBe("flex");
    expect(root?.style.flexDirection).toBe("column");
    expect(root?.style.overflow).toBe("hidden");
    let content = screen.getByText("Isi scroll") as HTMLElement | null;
    while (
      content?.parentElement &&
      !content.className.includes("MuiCardContent-root")
    ) {
      content = content.parentElement;
    }
    expect(content).not.toBeNull();
    expect(content?.style.overflowY).toBe("auto");
    // flex:1 serialisasi JSDOM = "1 1 0%"; baca longhand yang bermakna.
    expect(content?.style.flexGrow).toBe("1");
  });

  it("tanpa scrollable: root bukan flex, isi tak scroll (nol-ubah visual)", () => {
    renderSealed(<Card title="Judul">Isi</Card>);
    let root = screen.getByText("Judul") as HTMLElement | null;
    while (root?.parentElement && !root.className.includes("MuiCard-root")) {
      root = root.parentElement;
    }
    expect(root?.style.display).not.toBe("flex");
    expect(root?.style.overflow).not.toBe("hidden");
  });

  it("flag: strip status absolut di sisi kartu; default tanpa strip", () => {
    renderSealed(
      <Card title="Judul" flag="danger">
        Isi strip
      </Card>,
    );
    let root = screen.getByText("Judul") as HTMLElement | null;
    while (root?.parentElement && !root.className.includes("MuiCard-root")) {
      root = root.parentElement;
    }
    expect(root).not.toBeNull();
    expect(root?.style.position).toBe("relative");
    const strip = root?.querySelector(
      '[aria-hidden="true"]',
    ) as HTMLElement | null;
    expect(strip).not.toBeNull();
    expect(strip?.style.position).toBe("absolute");
    expect(strip?.style.backgroundColor).not.toBe("");
  });

  it("tanpa flag: root tanpa position, tanpa strip (nol-ubah visual)", () => {
    renderSealed(<Card title="Judul">Isi</Card>);
    let root = screen.getByText("Judul") as HTMLElement | null;
    while (root?.parentElement && !root.className.includes("MuiCard-root")) {
      root = root.parentElement;
    }
    expect(root?.style.position).toBe("");
    expect(root?.querySelector('[aria-hidden="true"]')).toBeNull();
  });
});
