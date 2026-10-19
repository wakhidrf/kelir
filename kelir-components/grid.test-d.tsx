import { Grid } from "./grid";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// Kolom union tertutup (bukan angka bebas); gap dari token.
export function gridContractChecks() {
  const ok = (
    <Grid columns={3} gap="lg" id="g" aria-label="h">
      <span>a</span>
      <span>b</span>
    </Grid>
  );

  const okResponsive = (
    <Grid columns={1} columnsSm={3} columnsMd={6} gap="sm">
      <span>a</span>
      <span>b</span>
    </Grid>
  );
  // @ts-expect-error — kolom ponsel angka bebas haram (union tertutup)
  const noRawColumnsSm = <Grid columnsSm={5}>isi</Grid>;
  // @ts-expect-error — kolom desktop angka bebas haram (union tertutup)
  const noRawColumnsMd = <Grid columnsMd={7}>isi</Grid>;
  // @ts-expect-error — kolomSm string bebas haram
  const noStringColumnsSm = <Grid columnsSm="3">isi</Grid>;

  // @ts-expect-error — style passthrough haram
  const noStyle = <Grid style={{ margin: 4 }}>isi</Grid>;
  // @ts-expect-error — className passthrough haram
  const noClassName = <Grid className="my-grid">isi</Grid>;
  // @ts-expect-error — kolom angka bebas haram (union tertutup)
  const noRawColumns = <Grid columns={5}>isi</Grid>;
  // @ts-expect-error — gap string bebas haram
  const noRawGap = <Grid gap="12px">isi</Grid>;
  // @ts-expect-error — prop tak dikenal tidak diteruskan ke DOM
  const noRest = <Grid title="x">isi</Grid>;

  return { ok, okResponsive, noRawColumnsSm, noRawColumnsMd, noStringColumnsSm, noStyle, noClassName, noRawColumns, noRawGap, noRest };
}
