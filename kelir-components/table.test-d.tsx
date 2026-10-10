import { Table } from "./table";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// Table: headers TEKS[] + rows sel[][].
export function tableContractChecks() {
  const ok = <Table headers={["Nama"]} rows={[["Rania"]]} />;

  // Generik ketat (P2): sel string mengalir ke rows.
  const typed = <Table<string> headers={["Nama"]} rows={[["Rania"]]} />;
  const noWrongCell = (
    <Table<string>
      headers={["Nama"]}
      // @ts-expect-error - sel number bukan string
      rows={[[1]]}
    />
  );

  const noNumberHeaders = (
    <Table
      // @ts-expect-error - headers number[] bukan kontrak Table
      headers={[1]}
      rows={[["Rania"]]}
    />
  );
  const noStyle = (
    <Table
      headers={["Nama"]}
      rows={[["Rania"]]}
      // @ts-expect-error - style milik kit
      style={{ margin: 4 }}
    />
  );
  return { ok, typed, noWrongCell, noNumberHeaders, noStyle };
}
