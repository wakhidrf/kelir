import { Pagination } from "./pagination";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// Pagination count wajib; onChange semantik (number).
export function paginationContractChecks() {
  const ok = <Pagination count={5} page={1} onChange={() => {}} />;
  const okDefault = <Pagination count={10} defaultPage={2} />;

  // @ts-expect-error - count wajib
  const noCount = <Pagination page={1} />;
  const noEvent = (
    <Pagination
      count={5}
      // @ts-expect-error - onChange event MUI haram (pakai number)
      onChange={(_e: unknown, _p: unknown) => {}}
    />
  );
  const noSize = (
    <Pagination
      count={5}
      // @ts-expect-error - size MUI milik kit (small)
      size="large"
    />
  );
  // @ts-expect-error - style milik kit
  const noStyle = <Pagination count={5} style={{ margin: 4 }} />;
  return { ok, okDefault, noCount, noEvent, noSize, noStyle };
}
