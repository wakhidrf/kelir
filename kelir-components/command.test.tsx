// @vitest-environment jsdom
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Command } from "./command";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";

describe("Command sealed (Gel.3c-8 §6b)", () => {
  it("paksa spread tak mengubah visual; filter + onSelect jalan", () => {
    const onSelect = vi.fn();
    const { container } = renderSealed(
      <Command
        placeholder="Cari perintah"
        groups={[
          {
            heading: "Umum",
            items: [
              { label: "Buka Beranda", value: "buka", onSelect },
              { label: "Tutup", value: "tutup" },
            ],
          },
        ]}
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      />,
    );
    expectSealed(container.firstElementChild as HTMLElement);
    // Filter: ketik "buka" → item "Tutup" hilang.
    fireEvent.change(screen.getByPlaceholderText("Cari perintah"), {
      target: { value: "buka" },
    });
    expect(screen.queryByText("Tutup")).toBeNull();
    fireEvent.click(screen.getByText("Buka Beranda"));
    expect(onSelect).toHaveBeenCalledWith();
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(
      <Command groups={[{ heading: "Umum", items: [{ label: "Buka", value: "buka" }] }]} />,
    );
    await expectNoAxeViolations(container);
  });
});
