// @vitest-environment jsdom
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Field } from "./field";
import { Input } from "./input";
import { expectSealed, forceSpread, renderSealed } from "./sealed-test-helper";

describe("Field sealed (Gel.3b §6b)", () => {
  it("menolak style/className yang dipaksa via spread", () => {
    const { container } = renderSealed(
      <Field {...forceSpread({ label: "Email" })}>
        <Input placeholder="x" />
      </Field>,
    );
    const el = container.querySelector(".MuiFormControl-root") as HTMLElement;
    expectSealed(el);
  });

  it("render label + helper milik kit (Typography sealed)", () => {
    renderSealed(
      <Field label="Email" helperText="Email valid">
        <Input placeholder="name@example.com" />
      </Field>,
    );
    expect(screen.getByText("Email")).toBeDefined();
    expect(screen.getByText("Email valid")).toBeDefined();
  });
});
