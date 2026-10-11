import { Content } from "./content";

// Type-test negatif (§6/§6b STYLE.md): padding milik kit;
// tanpa style/sx/className passthrough, tanpa ...rest.
export function contentContractChecks() {
  const okDefault = <Content>isi</Content>;
  const okCompact = (
    <Content compact id="a" aria-label="b">
      <span>isi</span>
    </Content>
  );

  // @ts-expect-error — style passthrough haram (padding milik Content)
  const noStyle = <Content style={{ padding: 8 }}>isi</Content>;
  // @ts-expect-error — sx passthrough haram
  const noSx = <Content sx={{ p: 1 }}>isi</Content>;
  // @ts-expect-error — className passthrough haram
  const noClassName = <Content className="my-main">isi</Content>;
  // @ts-expect-error — compact non-boolean haram
  const noRawCompact = <Content compact={1}>isi</Content>;
  // @ts-expect-error — prop tak dikenal tidak diteruskan ke DOM
  const noRest = <Content title="x">isi</Content>;

  return { okDefault, okCompact, noStyle, noSx, noClassName, noRawCompact, noRest };
}
