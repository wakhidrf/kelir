import { Separator } from "./separator";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// Label teks + orientasi union tertutup.
export function separatorContractChecks() {
  const ok = <Separator label="atau" orientation="horizontal" id="s" />;
  const okBare = <Separator orientation="vertical" />;

  // @ts-expect-error — style passthrough haram
  const noStyle = <Separator style={{ margin: 4 }} />;
  // @ts-expect-error — sx passthrough haram
  const noSx = <Separator sx={{ my: 2 }} />;
  // @ts-expect-error — className passthrough haram
  const noClassName = <Separator className="my-separator" />;
  // @ts-expect-error — orientation bebas haram (union tertutup)
  const noRawOrientation = <Separator orientation="diagonal" />;
  // @ts-expect-error — variant MUI haram (gaya milik kit)
  const noVariant = <Separator variant="inset" />;
  // @ts-expect-error — prop tak dikenal tidak diteruskan ke DOM
  const noRest = <Separator title="x" />;

  return { ok, okBare, noStyle, noSx, noClassName, noRawOrientation, noVariant, noRest };
}
