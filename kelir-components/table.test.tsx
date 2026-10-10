// @vitest-environment jsdom
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Table } from "./table";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";

describe("Table sealed (Gel.3c-10 §6b)", () => {
  it("menolak style/className yang dipaksa via spread", () => {
    const { container } = renderSealed(
      <Table
        headers={["Nama", "Status"]}
        rows={[["Rania", "Aktif"]]}
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      />,
    );
    expectSealed(container.firstElementChild as HTMLElement);
    expect(screen.getByText("Nama")).toBeDefined();
    expect(screen.getByText("Rania")).toBeDefined();
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(
      <Table headers={["Nama"]} rows={[["Rania"]]} />,
    );
    await expectNoAxeViolations(container);
  });
});
