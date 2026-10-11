import { Tile } from "./tile";

// Type-test negatif (§6/§6b STYLE.md): tone/size union tertutup;
// tanpa style/sx/className passthrough, tanpa ...rest.
export function tileContractChecks() {
  const okIcon = (
    <Tile id="a" aria-label="b">
      <span>ikon</span>
    </Tile>
  );
  const okLogo = (
    <Tile tone="plain" size="md">
      <span>logo</span>
    </Tile>
  );

  // @ts-expect-error — style passthrough haram (ubin milik Tile)
  const noStyle = <Tile style={{ padding: 4 }}>isi</Tile>;
  // @ts-expect-error — sx passthrough haram
  const noSx = <Tile sx={{ borderRadius: 2 }}>isi</Tile>;
  // @ts-expect-error — className passthrough haram
  const noClassName = <Tile className="my-tile">isi</Tile>;
  // @ts-expect-error — tone bebas haram (union tertutup)
  const noRawTone = <Tile tone="danger">isi</Tile>;
  // @ts-expect-error — size angka bebas haram (union tertutup)
  const noRawSize = <Tile size={48}>isi</Tile>;
  // @ts-expect-error — prop tak dikenal tidak diteruskan ke DOM
  const noRest = <Tile title="x">isi</Tile>;

  return { okIcon, okLogo, noStyle, noSx, noClassName, noRawTone, noRawSize, noRest };
}
