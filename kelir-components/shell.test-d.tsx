import { Content } from "./content";
import { Shell } from "./shell";

// Type-test negatif (§6/§6b STYLE.md): arah + boolean milik kit;
// tanpa style/sx/className passthrough, tanpa ...rest.
export function shellContractChecks() {
  const okRow = (
    <Shell id="a" aria-label="b">
      <span>sidebar</span>
      <Content>isi</Content>
    </Shell>
  );
  const okStacked = (
    <Shell stacked>
      <span>bar</span>
    </Shell>
  );

  // @ts-expect-error — style passthrough haram (arah milik Shell)
  const noStyle = <Shell style={{ height: 100 }}>isi</Shell>;
  // @ts-expect-error — sx passthrough haram
  const noSx = <Shell sx={{ height: "100dvh" }}>isi</Shell>;
  // @ts-expect-error — className passthrough haram
  const noClassName = <Shell className="my-shell">isi</Shell>;
  // @ts-expect-error — stacked non-boolean haram
  const noRawStacked = <Shell stacked="yes">isi</Shell>;
  // @ts-expect-error — prop tak dikenal tidak diteruskan ke DOM
  const noRest = <Shell title="x">isi</Shell>;

  return { okRow, okStacked, noStyle, noSx, noClassName, noRawStacked, noRest };
}
