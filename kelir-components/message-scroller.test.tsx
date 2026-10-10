// @vitest-environment jsdom
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MessageScroller } from "./message-scroller";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";

describe("MessageScroller sealed (Gel.3c-9 §6b)", () => {
  it("menolak style/className via spread; gulir-atas picu onLoadMore", () => {
    const onLoadMore = vi.fn();
    const { container } = renderSealed(
      <MessageScroller
        maxHeight="200px"
        hasMore
        onLoadMore={onLoadMore}
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      >
        <p>Halo</p>
      </MessageScroller>,
    );
    const el = container.firstElementChild as HTMLElement;
    expectSealed(el);
    expect(el.style.maxHeight).toBe("200px");
    // Simulasi posisi gulir atas: scrollTop < 40 → muat lagi.
    Object.defineProperty(el, "scrollTop", { value: 0, configurable: true });
    fireEvent.scroll(el);
    expect(onLoadMore).toHaveBeenCalledWith();
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(
      <MessageScroller>
        <p>Halo</p>
      </MessageScroller>,
    );
    await expectNoAxeViolations(container);
  });
});
