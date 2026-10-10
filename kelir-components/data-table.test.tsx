// @vitest-environment jsdom
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DataTable } from "./data-table";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";

describe("DataTable sealed (Gel.3c-11 §6b)", () => {
  it("menolak style/className via spread; paginasi jalan", () => {
    const { container } = renderSealed(
      <DataTable
        columns={[{ header: "Nama", accessorKey: "name" }]}
        data={[{ name: "Rania" }, { name: "Bima" }, { name: "Citra" }]}
        paginated
        rowsPerPage={2}
        title="Pengguna"
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      />,
    );
    expectSealed(container.firstElementChild as HTMLElement);
    // Halaman 1: 2 baris; Citra muncul setelah Next.
    expect(screen.queryByText("Citra")).toBeNull();
    fireEvent.click(screen.getByText("Next"));
    expect(screen.getByText("Citra")).toBeDefined();
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(
      <DataTable
        columns={[{ header: "Nama", accessorKey: "name" }]}
        data={[{ name: "Rania" }]}
      />,
    );
    await expectNoAxeViolations(container);
  });
});
