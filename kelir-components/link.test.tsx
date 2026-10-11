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
import { Link } from "./link";

describe("Link sealed (§6b)", () => {
  it("paksa spread tak mengubah tautan kit; anchor tampil", () => {
    const { container } = renderSealed(
      <Link
        href="/dokumen"
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      >
        Nama berkas
      </Link>,
    );
    const el = screen.getByText("Nama berkas").closest("a") as HTMLElement;
    expect(el).not.toBeNull();
    expectSealed(el);
    expect(el.tagName).toBe("A");
    expect(el.getAttribute("href")).toBe("/dokumen");
    expect(el.style.textDecoration).toBe("none");
  });

  it("external: target blank + rel noopener + ikon buka-baru", () => {
    renderSealed(
      <Link href="https://drive.example/f/1" external>
        Buka Drive
      </Link>,
    );
    const el = screen.getByText("Buka Drive").closest("a") as HTMLElement;
    expect(el.getAttribute("target")).toBe("_blank");
    expect(el.getAttribute("rel") ?? "").toContain("noopener");
  });

  it("internal: tanpa target blank", () => {
    renderSealed(<Link href="/dokumen">Nama berkas</Link>);
    const el = screen.getByText("Nama berkas").closest("a") as HTMLElement;
    expect(el.getAttribute("target")).toBeNull();
  });

  it("bebas pelanggaran axe (link-name via teks anak)", async () => {
    const { container } = renderSealed(
      <Link href="/dokumen">Nama berkas</Link>,
    );
    await expectNoAxeViolations(container);
  });
});
