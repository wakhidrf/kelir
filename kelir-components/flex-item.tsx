import MuiBox from "@mui/material/Box";
import type { FlexItemProps } from "../kelir-types";

// Kontrol item flex sealed (P1b STYLE.md): pasangan `Stack` (kontainer).
// `grow?` = isi sisa ruang (`flex: 1, minWidth: 0`, default `false`);
// `shrink={false}` = tolak penyusutan (`flexShrink: 0`, default susut
// normal); `clip?` = pemotong luapan (`overflow: hidden`, default `false`,
// properti dihilangkan penuh saat mati). Boolean tertutup, tanpa angka
// bebas. Default = blok biasa.
// Basis MUI (MuiBox) agar di tree tema; visual milik kit. Tanpa ...rest
// ke DOM dan tanpa style passthrough — di luar kontrak = pelanggaran.
export function FlexItem({
  children,
  grow = false,
  shrink = true,
  clip = false,
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
      }}
    >
      {children}
    </MuiBox>
  );
}
