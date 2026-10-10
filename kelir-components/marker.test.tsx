import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Marker } from "./marker";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";

describe("Marker sealed (§6b)", () => {
  it("paksa spread tak mengubah visual intent", () => {
    const { container } = renderSealed(
      <Marker
        variant="note"
        intent="success"
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      >
        OK
      </Marker>,
    );
    const root = container.firstElementChild as Element;
    expectSealed(root);
    expect(screen.getByText("OK")).toBeDefined();
  });
});
