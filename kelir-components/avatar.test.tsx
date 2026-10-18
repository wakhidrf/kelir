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
    expect(avatarPx("2xl")).toBe(128);
    expect(avatarPx("3xl")).toBe(160);
  });

  it("frame (#78): ring 4px tebal + latar surface; default ring 2px", () => {
    const { container: framed } = renderSealed(
      <Avatar fallbackText="K" frame />,
    );
    const framedCss = Array.from(
      framed.ownerDocument.querySelectorAll("style"),
    )
      .map((s) => s.textContent ?? "")
      .join("\n");
    expect(framedCss).toMatch(/border:\s*4px solid/);

    const { container: plain } = renderSealed(<Avatar fallbackText="K" />);
    const plainCss = Array.from(
      plain.ownerDocument.querySelectorAll("style"),
    )
      .map((s) => s.textContent ?? "")
      .join("\n");
    expect(plainCss).toMatch(/border:\s*2px solid/);
  });
});
