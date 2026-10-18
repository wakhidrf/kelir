import MuiBox from "@mui/material/Box";
import type { FlexItemProps } from "../kelir-types";
import { css } from "../kelir-variants";

// Tarik naik dari token space (negatif) agar elemen menumpuk di tepi atas.
const offsets = {
  sm: `-${css.layout.space.sm}`,
  md: `-${css.layout.space.lg}`,
  lg: `-${css.layout.space.xl}`,
} as const;

// Kontrol item flex sealed (P1b STYLE.md): pasangan `Stack` (kontainer).
// `grow?` = isi sisa ruang (`flex: 1, minWidth: 0`, default `false`);
// `shrink={false}` = tolak penyusutan (`flexShrink: 0`, default susut
// normal); `clip?` = pemotong luapan (`overflow: hidden`, default `false`,
// properti dihilangkan penuh saat mati); `offsetY?` = tarik naik (margin
// atas negatif dari token space sm/md/lg) untuk menumpuk elemen di tepi
// atas. Boolean tertutup, tanpa angka bebas. Default = blok biasa.
// Basis MUI (MuiBox) agar di tree tema; visual milik kit. Tanpa ...rest
// ke DOM dan tanpa style passthrough — di luar kontrak = pelanggaran.
export function FlexItem({
  children,
  grow = false,
  shrink = true,
  clip = false,
  offsetY,
  id,
  "aria-label": ariaLabel,
}: FlexItemProps) {
  return (
    <MuiBox
      id={id}
      aria-label={ariaLabel}
      style={{
        ...(grow ? ({ flex: 1, minWidth: 0 } as const) : null),
        ...(shrink ? null : ({ flexShrink: 0 } as const)),
        ...(clip ? ({ overflow: "hidden" } as const) : null),
        ...(offsetY ? ({ marginTop: offsets[offsetY] } as const) : null),
      }}
    >
      {children}
    </MuiBox>
  );
}
