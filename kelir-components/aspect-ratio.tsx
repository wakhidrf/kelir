import MuiBox from "@mui/material/Box";
import type { AspectRatioProps } from "../kelir-types";
import { css } from "../kelir-variants";

// Ambang ponsel kit (satu sumber: token layout.mobile 600px).
const MOBILE_QUERY = `@media (max-width: calc(${css.layout.breakpoints.mobile} - 0.02px))`;

// AspectRatio sealed (Gel.3c-6 STYLE.md §6): bingkai rasio milik kit,
// children slot media. `plain?` = tanpa permukaan kit (logo/ilustrasi);
// `maxWidth?` (px, semua lebar) + `maxWidthMobileVw?` (vw di bawah 600px)
// membatasi lebar bingkai - pengganti max-width kelas konsumen. Saat
// `maxWidthMobileVw` diisi, batas lebar pindah ke `sx` supaya media query
// bisa menang atas batas desktop (inline style selalu menang atas stylesheet).
// Tanpa style/sx/className dari konsumen.
export function AspectRatio({
  ratio = 16 / 9,
  children,
  plain = false,
  maxWidth,
  maxWidthMobileVw,
}: AspectRatioProps) {
  const responsive = maxWidthMobileVw !== undefined;
  return (
    <MuiBox
      sx={
        responsive
          ? {
              ...(maxWidth !== undefined ? { maxWidth } : null),
              [MOBILE_QUERY]: { maxWidth: `${maxWidthMobileVw}vw` },
            }
          : undefined
      }
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: `${ratio}`,
        ...(responsive || maxWidth === undefined ? null : { maxWidth }),
        ...(plain
          ? null
          : {
              backgroundColor: css.colors.surface,
              borderRadius: css.radius.card,
              boxShadow: css.shadows.convex,
              border: `1px solid ${css.border.light}`,
            }),
        overflow: "hidden",
      }}
    >
      <MuiBox style={{ position: "absolute", inset: 0 }}>{children}</MuiBox>
    </MuiBox>
  );
}
