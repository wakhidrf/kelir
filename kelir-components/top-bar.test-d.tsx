import { TopBar } from "./top-bar";

// Type-test negatif (§6/§6b STYLE.md): slot node milik kit;
// tanpa style/sx/className passthrough, tanpa ...rest.
export function topBarContractChecks() {
  const okBoth = (
    <TopBar left={<span>kiri</span>} right="kanan" id="a" aria-label="b" />
  );
  const okLeft = <TopBar left="saja" />;
  const okFlat = (
    <TopBar left="aksi" variant="flat" aria-label="baris aksi" />
  );

  // @ts-expect-error — variant di luar union tertutup raised|flat
  const noVariant = <TopBar left="aksi" variant="sunken" />;

  // @ts-expect-error — style passthrough haram (bar milik TopBar)
  const noStyle = <TopBar style={{ height: 48 }} />;
  // @ts-expect-error — sx passthrough haram
  const noSx = <TopBar sx={{ px: 1 }} />;
  // @ts-expect-error — className passthrough haram
  const noClassName = <TopBar className="my-bar" />;
  // @ts-expect-error — prop tak dikenal tidak diteruskan ke DOM
  const noRest = <TopBar title="x" />;

  return { okBoth, okLeft, okFlat, noVariant, noStyle, noSx, noClassName, noRest };
}
