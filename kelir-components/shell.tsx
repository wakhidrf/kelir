import MuiBox from "@mui/material/Box";
import type { ShellProps } from "../kelir-kit/kit-layout-shell";

// Sealed admin app-shell viewport (P1b STYLE.md): `height:
// 100dvh, overflow: hidden` — sidebar + content side by side (row),
// or `stacked?` (column: TopBar + stacked content, default `false`).
// Pure layout: no color/border/shadow. MUI base (MuiBox) so it stays in the
// theme tree; visuals owned by the kit. No ...rest to the DOM and no style
// passthrough — outside the contract = violation.
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
