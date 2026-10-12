// @vitest-environment jsdom
import { screen } from "@testing-library/react";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { Badge } from "./badge";
import { Button } from "./button";
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
  // Spy console.error ala select.test.tsx: peringatan key ganda React
  // (bila ada) tertangkap di sini, bukan lolos diam-diam ke konsol.
  const consoleErrors: string[] = [];
  beforeAll(() => {
    vi.spyOn(console, "error").mockImplementation((...args: unknown[]) => {
      consoleErrors.push(args.map((a) => String(a)).join(" "));
    });
  });
  afterAll(() => {
    vi.restoreAllMocks();
  });
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

  it("sel ReactNode tampil semua tanpa peringatan key ganda", () => {
    consoleErrors.length = 0;
    renderSealed(
      <Table
        headers={["Status", "Tindakan"]}
        rows={[
          [<Badge>Aktif</Badge>, <Button>Aksi</Button>],
          [<Badge>Nonaktif</Badge>, <Button>Aksi</Button>],
        ]}
      />,
    );
    expect(screen.getByText("Aktif")).toBeDefined();
    expect(screen.getAllByText("Aksi")).toHaveLength(2);
    expect(consoleErrors.filter((m) => m.includes("same key"))).toEqual([]);
  });
});
