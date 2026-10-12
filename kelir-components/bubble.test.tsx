// @vitest-environment jsdom
import { fireEvent, screen } from "@testing-library/react";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
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
  // Spy console.error ala select.test.tsx: peringatan key ganda React
  // (bila ada) tertangkap di sini, bukan lolos diam-diam ke konsol.
  const consoleErrors: string[] = [];
  beforeAll(() => {
    vi.spyOn(console, "error").mockImplementation((...args: unknown[]) => {
      consoleErrors.push(args.map((a) => String(a)).join(" "));
    });
  });
  afterAll(() => {
    vi.restoreAllMocks();
  });
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

  it("reaksi duplikat tampil dua-duanya tanpa peringatan key ganda", () => {
    consoleErrors.length = 0;
    renderSealed(
      <Bubble variant="received" reactions={["👍", "👍"]}>
        Setuju dua kali.
      </Bubble>,
    );
    expect(screen.getAllByText("👍")).toHaveLength(2);
    expect(
      consoleErrors.filter((m) => m.includes("same key")),
    ).toEqual([]);
  });
});
