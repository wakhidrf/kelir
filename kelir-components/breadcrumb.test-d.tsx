import { Breadcrumb } from "./breadcrumb";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// Breadcrumb items label TEKS; active eksplisit (tanpa magis item-terakhir).
export function breadcrumbContractChecks() {
  const ok = (
    <Breadcrumb
      items={[
        { label: "Dashboard", href: "#" },
        { label: "Current", active: true },
      ]}
    />
  );

  // @ts-expect-error - label non-string bukan kontrak Breadcrumb
  const noNodeLabel = <Breadcrumb items={[{ label: <b>Home</b> }]} />;
  const noStyle = (
    <Breadcrumb
      items={[{ label: "A" }]}
      // @ts-expect-error - style milik kit
      style={{ fontSize: "12px" }}
    />
  );
  return { ok, noNodeLabel, noStyle };
}
