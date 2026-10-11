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

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(<Image src="x.png" alt="Contoh" />);
    await expectNoAxeViolations(container);
  });
});
