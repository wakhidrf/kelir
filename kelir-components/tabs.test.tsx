// @vitest-environment jsdom
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";
import { Tabs } from "./tabs";

const ITEMS = [
  { label: "Overview", value: "a", content: "Isi a" },
  { label: "Security", value: "b", content: "Isi b" },
];

describe("Tabs sealed (Gel.3c-2 §6b)", () => {
  it("menolak style/className yang dipaksa via spread", () => {
    const { container } = renderSealed(
      <Tabs {...forceSpread({ items: ITEMS })} items={ITEMS} />,
    );
    expectSealed(container.firstElementChild as HTMLElement);
  });

  it("onChange semantik string + konten aktif", () => {
    const onChange = vi.fn();
    renderSealed(<Tabs items={ITEMS} defaultValue="a" onChange={onChange} />);
    expect(screen.getByText("Isi a")).toBeDefined();
    fireEvent.click(screen.getByRole("tab", { name: "Security" }));
    expect(onChange).toHaveBeenCalledWith("b");
    expect(screen.getByText("Isi b")).toBeDefined();
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(
      <Tabs items={ITEMS} defaultValue="a" />,
    );
    await expectNoAxeViolations(container);
  });
});
