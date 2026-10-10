// @vitest-environment jsdom
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar } from "./avatar";
import { Message } from "./message";
import { expectSealed, forceSpread, renderSealed } from "./sealed-test-helper";

describe("Message sealed (Gel.3b §6b)", () => {
  it("menolak style/className yang dipaksa via spread", () => {
    const { container } = renderSealed(
      <Message
        {...forceSpread({ sender: "Admin", text: "Halo" })}
      />,
    );
    expectSealed(container.firstElementChild as HTMLElement);
  });

  it("render sender + teks + avatar", () => {
    renderSealed(
      <Message
        avatar={<Avatar fallbackText="AK" />}
        sender="Admin Kelir"
        time="10:15"
        text="Selamat datang!"
        align="right"
      />,
    );
    expect(screen.getByText("Admin Kelir")).toBeDefined();
    expect(screen.getByText("Selamat datang!")).toBeDefined();
    expect(screen.getByText("AK")).toBeDefined();
  });
});
