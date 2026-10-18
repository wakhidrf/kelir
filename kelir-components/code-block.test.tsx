// @vitest-environment jsdom
import { screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CodeBlock } from "./code-block";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("CodeBlock sealed", () => {
  it("menolak style/className yang dipaksa via spread", () => {
    const { container } = renderSealed(
      <CodeBlock
        code="const a = 1;"
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      />,
    );
    expectSealed(container.firstElementChild as HTMLElement);
  });

  it("render kode dalam pre/code + label bahasa, default 'code'", () => {
    const { container } = renderSealed(<CodeBlock code="const a = 1;" />);
    const pre = container.querySelector("pre");
    expect(pre?.textContent).toBe("const a = 1;");
    expect(pre?.querySelector("code")).not.toBeNull();
    expect(screen.getByText("code")).toBeDefined();
  });

  it("label bahasa dipakai apa adanya", () => {
    renderSealed(<CodeBlock code="let b = 2;" language="tsx" />);
    expect(screen.getByText("tsx")).toBeDefined();
  });

  it("tombol salin menyalin kode lalu menampilkan label terkonfirmasi", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });
    renderSealed(
      <CodeBlock
        code="const a = 1;"
        copyLabel="Copy"
        copiedLabel="Copied"
      />,
    );
    const button = screen.getByRole("button", { name: "Copy" });
    button.click();
    expect(writeText).toHaveBeenCalledWith("const a = 1;");
    expect(await screen.findByRole("button", { name: "Copied" })).toBeDefined();
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(
      <CodeBlock code="const a = 1;" language="ts" aria-label="Contoh kode" />,
    );
    await expectNoAxeViolations(container);
  });
});
