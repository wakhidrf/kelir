import { FlexItem } from "./flex-item";

// Type-test negatif (§6/§6b STYLE.md): `grow`/`shrink` boolean tertutup;
// tanpa style/sx/className passthrough, tanpa ...rest.
export function flexItemContractChecks() {
  const okDefault = <FlexItem>isi</FlexItem>;
  const okGrow = (
    <FlexItem grow shrink={false} id="a" aria-label="b">
      <span>isi</span>
    </FlexItem>
  );

  // @ts-expect-error — style passthrough haram (kontrol milik FlexItem)
  const noStyle = <FlexItem style={{ flex: 2 }}>isi</FlexItem>;
  // @ts-expect-error — sx passthrough haram
  const noSx = <FlexItem sx={{ flex: 1 }}>isi</FlexItem>;
  // @ts-expect-error — className passthrough haram
  const noClassName = <FlexItem className="my-grow">isi</FlexItem>;
  // @ts-expect-error — grow angka bebas haram (boolean saja)
  const noRawGrow = <FlexItem grow={2}>isi</FlexItem>;
  // @ts-expect-error — shrink non-boolean haram
  const noRawShrink = <FlexItem shrink="no">isi</FlexItem>;
  // @ts-expect-error — prop tak dikenal tidak diteruskan ke DOM
  const noRest = <FlexItem title="x">isi</FlexItem>;

  return { okDefault, okGrow, noStyle, noSx, noClassName, noRawGrow, noRawShrink, noRest };
}
