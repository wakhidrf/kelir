import { Positioned } from "./positioned";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
export function positionedContractChecks() {
  const ok = (
    <Positioned anchor="top-end" visibility="desktop" aria-label="penukar tema">
      <span>tema</span>
    </Positioned>
  );
  const okDefaults = (
    <Positioned>
      <span>tema</span>
    </Positioned>
  );
  const okMobile = (
    <Positioned
      anchor="center-start"
      visibility="mobile"
      elevate={false}
      id="nav-mobile"
    >
      <span>nav</span>
    </Positioned>
  );
  const okBottom = (
    <Positioned anchor="bottom-end" visibility="always">
      <span>gulir-ke-atas</span>
    </Positioned>
  );
  // @ts-expect-error — anchor di luar kontrak haram
  const noRawAnchor = <Positioned anchor="top-middle">isi</Positioned>;
  // @ts-expect-error — visibility bebas haram (always/mobile/desktop)
  const noRawVisibility = <Positioned visibility="tablet">isi</Positioned>;
  // @ts-expect-error — elevate non-boolean haram
  const noRawElevate = <Positioned elevate="yes">isi</Positioned>;
  // @ts-expect-error — style passthrough haram
  const noStyle = <Positioned style={{ top: 0 }}>isi</Positioned>;
  // @ts-expect-error — className passthrough haram
  const noClassName = <Positioned className="corner">isi</Positioned>;
  return {
    ok,
    okDefaults,
    okMobile,
    okBottom,
    noRawAnchor,
    noRawVisibility,
    noRawElevate,
    noStyle,
    noClassName,
  };
}
