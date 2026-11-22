"use client";

import MuiBox from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import type { ContentProps } from "../kelir-kit/kit-layout-shell";
import { css } from "../kelir-kit/kit-create-css";

// Kit internal breakpoint (MUI md, same as Sidebar); not a consumer number.
const DESKTOP_QUERY = "(min-width: 900px)";

// The only sealed app-shell scroll area (P1b STYLE.md): fills the remaining
// space + internal vertical scroll + responsive padding from tokens (roomy on
// desktop, tight on mobile; `compact?` forces tight, default `false`) +
// background. SSR-safe: noSsr + defaultMatches (server + first render =
// desktop, correct after mount - no hydration mismatch, Sidebar pattern).
// No ...rest to the DOM and no style passthrough.
export function Content({
  children,
  compact = false,
  id,
  "aria-label": ariaLabel,
}: ContentProps) {
  const isDesktop = useMediaQuery(DESKTOP_QUERY, {
    defaultMatches: true,
    noSsr: true,
  });
  const padding =
    compact || !isDesktop ? css.layout.space.sm : css.layout.space.lg;
  return (
    <MuiBox
      id={id}
      aria-label={ariaLabel}
      style={{
        flex: 1,
        minWidth: 0,
        minHeight: 0,
        overflowY: "auto",
        padding,
        backgroundColor: css.colors.background,
      }}
    >
      {children}
    </MuiBox>
  );
}
