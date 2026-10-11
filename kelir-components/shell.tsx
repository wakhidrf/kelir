import MuiBox from "@mui/material/Box";
import type { ShellProps } from "../kelir-types";

// Cangkang viewport app-shell admin sealed (P1b STYLE.md): `height:
// 100dvh, overflow: hidden` — sidebar + konten berdampingan (baris),
// atau `stacked?` (kolom: TopBar + konten bertumpuk, default `false`).
// Murni layout: tanpa warna/border/shadow. Basis MUI (MuiBox) agar di
// tree tema; visual milik kit. Tanpa ...rest ke DOM dan tanpa style
// passthrough — di luar kontrak = pelanggaran.
export function Shell({
  children,
  stacked = false,
  id,
  "aria-label": ariaLabel,
}: ShellProps) {
  return (
    <MuiBox
      id={id}
      aria-label={ariaLabel}
      style={{
        display: "flex",
        flexDirection: stacked ? "column" : "row",
        height: "100dvh",
        overflow: "hidden",
      }}
    >
      {children}
    </MuiBox>
  );
}
