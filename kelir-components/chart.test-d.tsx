import { Chart } from "./chart";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// Chart: data baris + categories string[] + dataKey + type MAKNA + title TEKS.
export function chartContractChecks() {
  const ok = (
    <Chart
      data={[{ name: "Jan", sales: 4000 }]}
      categories={["sales"]}
      dataKey="name"
      type="bar"
      title="Penjualan"
    />
  );

  // Generik ketat (P2): datum bernama mengalir ke data.
  interface Sale {
    name: string;
    sales: number;
  }
  const typed = (
    <Chart<Sale>
      data={[{ name: "Jan", sales: 4000 }]}
      categories={["sales"]}
      dataKey="name"
    />
  );
  const noWrongDatum = (
    <Chart<Sale>
      // @ts-expect-error - datum tanpa name bukan Sale
      data={[{ sales: 4000 }]}
      categories={["sales"]}
      dataKey="name"
    />
  );

  const noBadType = (
    <Chart
      data={[{ name: "Jan", sales: 4000 }]}
      categories={["sales"]}
      dataKey="name"
      // @ts-expect-error - type di luar union bukan kontrak Chart
      type="pie"
    />
  );
  const noNodeTitle = (
    <Chart
      data={[{ name: "Jan", sales: 4000 }]}
      categories={["sales"]}
      dataKey="name"
      // @ts-expect-error - title node bukan kontrak Chart (pakai string)
      title={<b>Penjualan</b>}
    />
  );
  const noStyle = (
    <Chart
      data={[{ name: "Jan", sales: 4000 }]}
      categories={["sales"]}
      dataKey="name"
      // @ts-expect-error - style milik kit
      style={{ margin: 4 }}
    />
  );
  return { ok, typed, noWrongDatum, noBadType, noNodeTitle, noStyle };
}
