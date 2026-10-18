import MuiBox from "@mui/material/Box";
import type { ListProps } from "../kelir-types";
import { css } from "../kelir-variants";

// Daftar semantik sealed (P2 STYLE.md 6): penanda, jarak, dan warna milik kit.
// Basis MUI (MuiBox = ul/ol + emotion + tema di tree) untuk multi-platform.
// Tanpa ...rest ke DOM, tanpa style/sx/className passthrough konsumen.
export function List({
  items,
  ordered = false,
  id,
  "aria-label": ariaLabel,
}: ListProps) {
  return (
    <MuiBox
      component={ordered ? "ol" : "ul"}
      id={id}
      aria-label={ariaLabel}
      sx={{
        margin: 0,
        paddingLeft: css.layout.space.lg,
        listStyleType: ordered ? "decimal" : "disc",
        color: css.colors.textPrimary,
        fontFamily: "inherit",
        fontSize: "var(--type-body, 1rem)",
        lineHeight: "var(--type-lineheight-body, 1.6)",
      }}
    >
      {items.map((item, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: butir statis dari isi.
        <MuiBox
          component="li"
          key={`item-${index}`}
          sx={{ marginBottom: css.layout.space.xs }}
        >
          {item}
        </MuiBox>
      ))}
    </MuiBox>
  );
}
