import { Icon } from "./icon";

// Type-test negatif (6/6b STYLE.md): JSX langsung + nilai literal.
// Hanya union tertutup yang boleh: `intent` dari token warna, `size` dari
// skala kit; elemen ikon diserahkan lewat `children`.
export function iconContractChecks() {
  const ok = (
    <Icon intent="primary" size="lg" id="i" aria-label="Status">
      <span>ikon</span>
    </Icon>
  );

  const okDefault = (
    <Icon>
      <span>ikon</span>
    </Icon>
  );

  // @ts-expect-error — style passthrough haram
  const noStyle = <Icon style={{ color: "red" }}>ikon</Icon>;
  // @ts-expect-error — className passthrough haram
  const noClassName = <Icon className="my-icon">ikon</Icon>;
  // @ts-expect-error — ukuran string bebas haram (union tertutup)
  const noRawSize = <Icon size="12px">ikon</Icon>;
  // @ts-expect-error — warna mentah haram (pakai intent)
  const noRawColor = <Icon color="red">ikon</Icon>;
  // @ts-expect-error — intent di luar union haram
  const noUnknownIntent = <Icon intent="danger">ikon</Icon>;
  // @ts-expect-error — prop tak dikenal tidak diteruskan ke DOM
  const noRest = <Icon title="x">ikon</Icon>;

  return {
    ok,
    okDefault,
    noStyle,
    noClassName,
    noRawSize,
    noRawColor,
    noUnknownIntent,
    noRest,
  };
}
