// @vitest-environment jsdom
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Input } from "./input";
import { InputGroup } from "./input-group";
import { expectSealed, forceSpread, renderSealed } from "./sealed-test-helper";

describe("InputGroup sealed (Gel.3c-3 §6b)", () => {
  it("menolak style/className yang dipaksa via spread", () => {
    const { container } = renderSealed(
      <InputGroup {...forceSpread({ prefix: "https://" })}>
        <Input placeholder="x" />
      </InputGroup>,
    );
    expectSealed(container.firstElementChild as HTMLElement);
  });

  it("render prefix/suffix teks milik kit + kontrol", () => {
    renderSealed(
      <InputGroup prefix="https://" suffix="✓">
        <Input placeholder="example.com" aria-label="Domain" />
      </InputGroup>,
    );
    expect(screen.getByText("https://")).toBeDefined();
    expect(screen.getByPlaceholderText("example.com")).toBeDefined();
  });
});
