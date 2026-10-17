// @vitest-environment jsdom
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar, avatarPx } from "./avatar";
import { expectSealed, forceSpread, renderSealed } from "./sealed-test-helper";

describe("Avatar sealed (Gel.3a §6b)", () => {
  it("menolak style/className yang dipaksa via spread", () => {
    const { container } = renderSealed(
      <Avatar {...forceSpread({ fallbackText: "WR" })} />,
    );
    const el = container.querySelector(".MuiAvatar-root") as HTMLElement;
    expectSealed(el);
  });

  it("render fallback + peta size MAKNA → px milik kit", () => {
    renderSealed(<Avatar fallbackText="WR" size="large" />);
    expect(screen.getByText("WR")).toBeDefined();
    expect(avatarPx("small")).toBe(32);
    expect(avatarPx("medium")).toBe(40);
    expect(avatarPx("large")).toBe(48);
    expect(avatarPx("xl")).toBe(96);
  });
});
