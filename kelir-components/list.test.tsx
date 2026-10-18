// @vitest-environment jsdom
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { List } from "./list";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";

describe("List sealed", () => {
  it("menolak style/className yang dipaksa via spread", () => {
    const { container } = renderSealed(
      <List
        items={["Pertama", "Kedua"]}
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      />,
    );
    expectSealed(container.firstElementChild as HTMLElement);
  });

  it("default = daftar bullet (ul) dengan satu li per butir", () => {
    renderSealed(<List items={["Pertama", "Kedua"]} />);
    const list = screen.getByRole("list");
    expect(list.tagName).toBe("UL");
    expect(list.querySelectorAll("li")).toHaveLength(2);
  });

  it("ordered = daftar bernomor (ol)", () => {
    renderSealed(<List items={["Pertama", "Kedua"]} ordered />);
    expect(screen.getByRole("list").tagName).toBe("OL");
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(
      <List items={["Pertama", "Kedua"]} ordered aria-label="Langkah" />,
    );
    await expectNoAxeViolations(container);
  });
});
