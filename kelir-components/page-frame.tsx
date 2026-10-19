import MuiBox from "@mui/material/Box";
import type { PageFrameProps } from "../kelir-types";
import { css } from "../kelir-variants";

// Ambang ponsel kit (satu sumber: token layout.mobile 600px).
const MOBILE_MAX = `@media (max-width: calc(${css.layout.breakpoints.mobile} - 0.02px))`;

// Rangka halaman dokumen sealed (STYLE.md §6): tepi halaman + lebar isi +
// napas main/footer semuanya dari token layout.page. Slot `overlays` menerima
// pemicu bertitik tetap (Positioned), `header`/`footer` chrome tengah, dan
// `children` isi utama. Font aktif tema + warna teks kit melekat di akar.
// Tanpa ...rest ke DOM dan tanpa style passthrough.
export function PageFrame({
  children,
  header,
  footer,
  overlays,
  id,
  "aria-label": ariaLabel,
}: PageFrameProps) {
  const page = css.layout.page;
  return (
    <MuiBox
      id={id}
      aria-label={ariaLabel}
      sx={{
        [MOBILE_MAX]: {
          paddingLeft: page.paddingInlineMobile,
          paddingRight: page.paddingInlineMobile,
        },
      }}
      style={{
        position: "relative",
        minHeight: "100dvh",
        paddingTop: page.paddingTop,
        paddingLeft: page.paddingInline,
        paddingRight: page.paddingInline,
        paddingBottom: page.paddingBottom,
        backgroundColor: "transparent",
        fontFamily: "var(--kelir-font-active, sans-serif)",
        color: css.colors.textPrimary,
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      {overlays}
      <MuiBox
        style={{
          width: "100%",
          maxWidth: page.contentMax,
          marginLeft: "auto",
          marginRight: "auto",
          display: "flex",
          flexDirection: "column",
          gap: page.gap,
        }}
      >
        {header ? (
          <MuiBox
            component="header"
            sx={{ [MOBILE_MAX]: { gap: page.headerGapMobile } }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: page.headerGap,
            }}
          >
            {header}
          </MuiBox>
        ) : null}
        <MuiBox
          component="main"
          style={{
            minHeight: page.mainMinHeight,
            paddingTop: page.mainPaddingBlock,
            paddingBottom: page.mainPaddingBlock,
          }}
        >
          {children}
        </MuiBox>
        {footer ? (
          <MuiBox
            component="footer"
            style={{
              textAlign: "center",
              paddingTop: page.footerPaddingTop,
              borderTop: `1px solid ${css.border.light}`,
              color: css.colors.textSecondary,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: page.footerGap,
            }}
          >
            {footer}
          </MuiBox>
        ) : null}
      </MuiBox>
    </MuiBox>
  );
}
