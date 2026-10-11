import { Banner } from "./banner";

// Type-test negatif (§6/§6b STYLE.md): tone union tertutup;
// tanpa style/sx/className passthrough, tanpa ...rest.
export function bannerContractChecks() {
  const okDefault = <Banner>isi</Banner>;
  const okTone = (
    <Banner tone="danger" id="a" aria-label="b">
      <span>isi</span>
    </Banner>
  );

  // @ts-expect-error — style passthrough haram (spanduk milik Banner)
  const noStyle = <Banner style={{ textAlign: "left" }}>isi</Banner>;
  // @ts-expect-error — sx passthrough haram
  const noSx = <Banner sx={{ p: 1 }}>isi</Banner>;
  // @ts-expect-error — className passthrough haram
  const noClassName = <Banner className="my-banner">isi</Banner>;
  // @ts-expect-error — tone bebas haram (union tertutup)
  const noRawTone = <Banner tone="info">isi</Banner>;
  // @ts-expect-error — prop tak dikenal tidak diteruskan ke DOM
  const noRest = <Banner title="x">isi</Banner>;

  return { okDefault, okTone, noStyle, noSx, noClassName, noRawTone, noRest };
}
