import MuiBox from "@mui/material/Box";
import type { TopBarProps } from "../kelir-types";
import { css } from "../kelir-variants";

// Bar mobile app-shell sealed (P1b STYLE.md): slot `left?`/`right?`
// disejajarkan ujung-ke-ujung (sisi kosong = kotak kosong tak terlihat;
// satu sisi saja tetap menempel di tepinya); latar surface. Landmark
// header. Tanpa warna/border/shadow kustom. Tanpa ...rest ke DOM dan
// tanpa style passthrough — di luar kontrak = pelanggaran.
export function TopBar({
  left,
  right,
  id,
  "aria-label": ariaLabel,
}: TopBarProps) {
  return (
    <MuiBox
      component="header"
      id={id}
      aria-label={ariaLabel}
      style={{
        display: "flex",
        alignItems: "center",
        gap: css.layout.space.md,
        padding: `${css.layout.space.sm} ${css.layout.space.md}`,
        backgroundColor: css.colors.surface,
        fontFamily: "inherit",
      }}
    >
      <MuiBox
        style={{
          display: "flex",
          alignItems: "center",
          gap: css.layout.space.sm,
          minWidth: 0,
        }}
      >
        {left}
      </MuiBox>
      <MuiBox
        style={{
          display: "flex",
          alignItems: "center",
          gap: css.layout.space.sm,
          minWidth: 0,
          marginLeft: "auto",
        }}
      >
        {right}
      </MuiBox>
    </MuiBox>
  );
}
