"use client";

import MuiBox from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import type { ContentProps } from "../kelir-types";
import { css } from "../kelir-variants";

// Ambang internal kit (md MUI, sama dengan Sidebar); bukan angka konsumen.
const DESKTOP_QUERY = "(min-width: 900px)";

// Satu-satunya area scroll app-shell sealed (P1b STYLE.md): isi sisa ruang
// + scroll vertikal internal + padding responsif dari token (desktop lega,
// mobile rapat; `compact?` memaksa rapat, default `false`) + latar
// background. SSR-aman: noSsr + defaultMatches (server + render pertama =
// desktop, koreksi setelah mount — tanpa hydration mismatch, pola Sidebar).
// Tanpa ...rest ke DOM dan tanpa style passthrough.
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
