// @vitest-environment jsdom
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Attachment } from "./attachment";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";

describe("Attachment sealed (Gel.3c-7 §6b)", () => {
  it("paksa spread tak mengubah visual; onRemove tanpa argumen", () => {
    const onRemove = vi.fn();
    const { container } = renderSealed(
      <Attachment
        name="laporan.pdf"
        size="2 MB"
        status="success"
        onRemove={onRemove}
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      />,
    );
    expectSealed(container.firstElementChild as HTMLElement);
    fireEvent.click(screen.getByRole("button", { name: "Delete laporan.pdf" }));
    expect(onRemove).toHaveBeenCalledWith();
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(
      <Attachment name="laporan.pdf" size="2 MB" status="uploading" progress={70} />,
    );
    await expectNoAxeViolations(container);
  });
});
