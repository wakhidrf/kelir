// @vitest-environment jsdom
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Carousel } from "./carousel";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";

describe("Carousel sealed (Gel.3c-10 §6b)", () => {
  it("paksa spread tak mengubah visual; navigasi ganti slide", () => {
    const { container } = renderSealed(
      <Carousel
        items={[<p key="1">Satu</p>, <p key="2">Dua</p>]}
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      />,
    );
    expectSealed(container.firstElementChild as HTMLElement);
    fireEvent.click(screen.getByRole("button", { name: "Next slide" }));
    // Slide aktif display:block, non-aktif display:none (tanpa jest-dom).
    const slideDua = screen.getByText("Dua").parentElement as HTMLElement;
    const slideSatu = screen.getByText("Satu").parentElement as HTMLElement;
    expect(slideDua.style.display).toBe("block");
    expect(slideSatu.style.display).toBe("none");
    fireEvent.click(screen.getByRole("button", { name: "Previous slide" }));
    expect(slideSatu.style.display).toBe("block");
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(
      <Carousel items={[<p key="1">Satu</p>, <p key="2">Dua</p>]} />,
    );
    await expectNoAxeViolations(container);
  });
});
