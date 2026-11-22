import MuiBox from "@mui/material/Box";
import type { PageFrameProps } from "../kelir-kit/kit-layout-shell";
import { css } from "../kelir-kit/kit-create-css";
import { PageFrameBody } from "./page-frame-body";
import { MOBILE_MAX, page } from "./page-frame-tokens";

// Sealed document page frame (STYLE.md §6): page edges + content width +
// main/footer breathing room all come from layout.page tokens. The `overlays`
// slot receives fixed-dot triggers (Positioned), `header`/`footer` center chrome,
// and `children` the main content. The active theme font + kit text colors attach
// at the root. No ...rest to DOM and no style passthrough.
export function PageFrame({
  children,
  header,
  footer,
  overlays,
  id,
  "aria-label": ariaLabel,
}: PageFrameProps) {
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
      <PageFrameBody header={header} footer={footer}>
        {children}
      </PageFrameBody>
    </MuiBox>
  );
}
