import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import MuiBox from "@mui/material/Box";
import type { LinkProps } from "../kelir-types";
import { css } from "../kelir-variants";

// Tautan sebaris sealed (P1b STYLE.md): teks + ikon segaris milik kit
// (`external?` → ikon buka-baru + `target _blank` + `rel noopener`,
// default ikon panah tautan internal). Warna textPrimary, tanpa underline.
// `href` wajib — tanpa href pakai `Button variant="ghost"`. Basis MUI
// (MuiBox = a + emotion + tema di tree) untuk multi-platform; visual
// milik kit. Tanpa ...rest ke DOM dan tanpa style passthrough — di luar
// kontrak = pelanggaran.
export function Link({
  children,
  href,
  external = false,
  id,
  "aria-label": ariaLabel,
}: LinkProps) {
  const Icon = external ? OpenInNewIcon : ArrowForwardIcon;
  return (
    <MuiBox
      component="a"
      href={href}
      id={id}
      aria-label={ariaLabel}
      {...(external
        ? ({ target: "_blank", rel: "noopener noreferrer" } as const)
        : null)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: css.layout.space.xs,
        color: css.colors.textPrimary,
        textDecoration: "none",
        fontFamily: "inherit",
      }}
    >
      {children}
      <Icon sx={{ fontSize: "1em" }} />
    </MuiBox>
  );
}
