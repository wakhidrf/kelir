import { DataTable } from "./data-table";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// DataTable: columns DataTableColumn[] + data baris + title TEKS.
export function dataTableContractChecks() {
  const ok = (
    <DataTable
      columns={[{ header: "Nama", accessorKey: "name" }]}
      data={[{ name: "Rania" }]}
      title="Pengguna"
    />
  );

  const noBadColumn = (
    <DataTable
      columns={[
        // @ts-expect-error - kolom tanpa accessorKey bukan kontrak DataTableColumn
        {
          header: "Nama",
        },
      ]}
      data={[{ name: "Rania" }]}
    />
  );
  const noNodeTitle = (
    <DataTable
      columns={[{ header: "Nama", accessorKey: "name" }]}
      data={[{ name: "Rania" }]}
      // @ts-expect-error - title node bukan kontrak DataTable (pakai string)
      title={<b>Pengguna</b>}
    />
  );
  const noStyle = (
    <DataTable
      columns={[{ header: "Nama", accessorKey: "name" }]}
      data={[{ name: "Rania" }]}
      // @ts-expect-error - style milik kit
      style={{ margin: 4 }}
    />
  );
  return { ok, noBadColumn, noNodeTitle, noStyle };
}
