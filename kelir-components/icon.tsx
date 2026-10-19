import MuiBox from "@mui/material/Box";
import type { IconProps } from "../kelir-types";
import { css } from "../kelir-variants";

const sizes = {
  sm: "1rem",
  md: "1.25rem",
  lg: "1.75rem",
} as const;

const intents = {
  inherit: "currentColor",
  primary: css.colors.textPrimary,
  secondary: css.colors.textSecondary,
  accent: css.colors.primary,
} as const;

// Pembungkus ikon sealed (P1c STYLE.md 6): warna + ukuran milik kit, konsumen
// hanya menyerahkan elemen ikonnya. `intent` union tertutup dari token warna;
// `size` union tertutup (SVG MUI dipaksa memakai `fontSize: inherit` supaya
// skala kit yang menang). Ikon tanpa `aria-label` dianggap dekoratif
// (`aria-hidden`) agar tak menambah kebisingan pembaca layar; label aksesibel
// tetap milik tombol/tautan induk. Tanpa ...rest ke DOM dan tanpa
// style/sx/className passthrough - di luar kontrak = pelanggaran.
export function Icon({
  children,
  intent = "inherit",
  size = "md",
  id,
  "aria-label": ariaLabel,
}: IconProps) {
  return (
    <MuiBox
      component="span"
      id={id}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      sx={{ "& .MuiSvgIcon-root": { fontSize: "inherit" } }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        color: intents[intent],
        fontSize: sizes[size],
        lineHeight: 1,
      }}
    >
      {children}
    </MuiBox>
  );
}
