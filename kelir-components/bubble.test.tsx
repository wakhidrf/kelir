// @vitest-environment jsdom
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Bubble } from "./bubble";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";

describe("Bubble sealed (Gel.3c-7 §6b)", () => {
  it("paksa spread tak mengubah visual; collapsible melipat isi", () => {
    const { container } = renderSealed(
      <Bubble
        variant="sent"
        collapsible
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      >
        Siap dikirim.
      </Bubble>,
    );
    expectSealed(container.firstElementChild as HTMLElement);
    const toggle = screen.getByRole("button");
    fireEvent.click(toggle);
    expect(screen.queryByText("Siap dikirim.")).toBeNull();
    fireEvent.click(toggle);
    expect(screen.getByText("Siap dikirim.")).toBeDefined();
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(
      <Bubble variant="received" reactions={["👍"]}>
        Baik, terima kasih.
      </Bubble>,
    );
    await expectNoAxeViolations(container);
  });
});
