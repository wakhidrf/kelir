import { Spacer } from "./spacer";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// Ukuran union tertutup dari token; tanpa children/style/className.
export function spacerContractChecks() {
  const ok = <Spacer size="sm" id="s" />;

  // @ts-expect-error — style passthrough haram
  const noStyle = <Spacer style={{ height: 30 }} />;
  // @ts-expect-error — className passthrough haram
  const noClassName = <Spacer className="my-spacer" />;
  // @ts-expect-error — size angka bebas haram (union tertutup)
  const noRawSize = <Spacer size={32} />;
  // @ts-expect-error — children haram (Spacer presentasional)
  const noChildren = <Spacer>isi</Spacer>;

  return { ok, noStyle, noClassName, noRawSize, noChildren };
}
