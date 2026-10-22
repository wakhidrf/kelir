import { describe, expect, it } from "vitest";
import { Image, imagePx } from "./image";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";

describe("Image sealed (§6b)", () => {
  it("peta height MAKNA ke px milik kit", () => {
    expect(imagePx("xs")).toBe(24);
    expect(imagePx("sm")).toBe(32);
    expect(imagePx("md")).toBe(48);
    expect(imagePx("lg")).toBe(64);
    expect(imagePx("xl")).toBe(96);
    expect(imagePx("2xl")).toBe(128);
    expect(imagePx("3xl")).toBe(160);
    expect(imagePx("4xl")).toBe(200);
    expect(imagePx("5xl")).toBe(256);
    expect(imagePx("6xl")).toBe(320);
    expect(imagePx("7xl")).toBe(400);
  });

  it("paksa spread tak mengubah visual; alt selalu atribut", () => {
    const { container } = renderSealed(
      <Image
        src="logo.png"
        alt="Logo"
        height="lg"
        fit="cover"
        radius="md"
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      />,
    );
    const el = container.querySelector("img") as HTMLElement;
    expect(el).not.toBeNull();
    expectSealed(el);
    expect(el.getAttribute("src")).toBe("logo.png");
    expect(el.getAttribute("alt")).toBe("Logo");
    expect(el.style.height).toBe("64px");
    expect(el.style.objectFit).toBe("cover");
    expect(el.style.borderRadius).not.toBe("");
  });

  it("tanpa alt: atribut tetap ada (string kosong, lolos axe)", () => {
    const { container } = renderSealed(<Image src="x.png" />);
    const el = container.querySelector("img") as HTMLElement;
    expect(el.getAttribute("alt")).toBe("");
  });

  it("default md/contain/none (nol-ubah visual)", () => {
    const { container } = renderSealed(<Image src="x.png" alt="x" />);
    const el = container.querySelector("img") as HTMLElement;
    expect(el.style.height).toBe("48px");
    expect(el.style.objectFit).toBe("contain");
    // "0" serialisasi JSDOM = "0px"; baca nilai yang dirender.
    expect(el.style.borderRadius).toBe("0px");
  });

  it("fluid + maxHeight (#69/#67): isi lebar wadah, tinggi auto, dibatasi", () => {
    const { container } = renderSealed(
      <Image src="hero.jpg" alt="Hero" fluid maxHeight="lg" />,
    );
    const el = container.querySelector("img") as HTMLElement;
    expect(el.style.width).toBe("100%");
    expect(el.style.height).toBe("auto");
    expect(el.style.maxHeight).toBe("64px");
  });

  it("maxWidth (#75): batasi lebar px saat fluid; default 100%", () => {
    const { container: capped } = renderSealed(
      <Image src="hero.jpg" alt="Hero" fluid maxWidth={240} />,
    );
    expect((capped.querySelector("img") as HTMLElement).style.maxWidth).toBe(
      "240px",
    );

    const { container: plain } = renderSealed(<Image src="x.png" alt="x" />);
    expect((plain.querySelector("img") as HTMLElement).style.maxWidth).toBe(
      "100%",
    );
  });

  it("fill/priority/sizes: isi wadah ber-posisi + muat awal", () => {
    const { container } = renderSealed(
      <Image
        src="logo.webp"
        alt="Kelir"
        fill
        priority
        sizes="(max-width: 420px) 100vw, 200px"
      />,
    );
    const el = container.querySelector("img") as HTMLElement;
    expect(el.style.position).toBe("absolute");
    expect(el.style.width).toBe("100%");
    expect(el.style.height).toBe("100%");
    expect(el.getAttribute("sizes")).toBe("(max-width: 420px) 100vw, 200px");
    expect(el.getAttribute("loading")).toBe("eager");
    expect(el.getAttribute("fetchpriority")).toBe("high");
  });

  it("tanpa fill/priority: perilaku lama (nol-ubah)", () => {
    const { container } = renderSealed(<Image src="x.png" alt="x" />);
    const el = container.querySelector("img") as HTMLElement;
    expect(el.style.position).toBe("");
    expect(el.getAttribute("loading")).toBeNull();
  });

  it("tanpa fluid/maxHeight: perilaku lama (nol-ubah)", () => {
    const { container } = renderSealed(
      <Image src="x.png" alt="x" height="sm" />,
    );
    const el = container.querySelector("img") as HTMLElement;
    expect(el.style.width).toBe("auto");
    expect(el.style.height).toBe("32px");
    expect(el.style.maxHeight).toBe("");
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(<Image src="x.png" alt="Contoh" />);
    await expectNoAxeViolations(container);
  });
});
