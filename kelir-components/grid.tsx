import MuiBox from "@mui/material/Box";
import type { GridProps } from "../kelir-kit/kit-layout";
import { GridAside } from "./grid-aside";
import { autoFitCss, columnsCss, gaps, MD_QUERY } from "./grid-layout";

// Sealed layout primitive (P1b STYLE.md): closed-union columns (not arbitrary
// numbers) + spacing from css.layout tokens. `minItem` = auto-fit minimum item
// width from tokens (replaces columns*). `columnsSm`/`columnsMd` = column count
// at width >= 600px / >= 768px; when used, the base columns also move to
// `sx` (emotion) so the media query can win - still server-safe without hooks.
// MUI basis (MuiBox) for multi-platform; no visuals, no ...rest to DOM,
// no style passthrough.
export function Grid({
  children,
  columns = 2,
  columnsSm,
  columnsMd,
  minItem,
  gap = "md",
  template = "auto",
  asideWidth = "md",
  collapse = "lg",
  pinned = false,
  id,
  "aria-label": ariaLabel,
}: GridProps) {
  if (template === "aside") {
    return (
      <GridAside
        id={id}
        ariaLabel={ariaLabel}
        gap={gap}
        asideWidth={asideWidth}
        collapse={collapse}
        pinned={pinned}
      >
        {children}
      </GridAside>
    );
  }
  const responsive = columnsSm !== undefined || columnsMd !== undefined;
  const autoFit = minItem !== undefined;
  return (
    <MuiBox
      id={id}
      aria-label={ariaLabel}
      sx={
        responsive && !autoFit
          ? {
              gridTemplateColumns: columnsCss(columnsSm ?? columns),
              [MD_QUERY]: {
                gridTemplateColumns: columnsCss(
                  columnsMd ?? columnsSm ?? columns,
                ),
              },
            }
          : undefined
      }
      style={{
        display: "grid",
        ...(autoFit
          ? { gridTemplateColumns: autoFitCss(minItem) }
          : responsive
            ? null
            : { gridTemplateColumns: columnsCss(columns) }),
        gap: gaps[gap],
      }}
    >
      {children}
    </MuiBox>
  );
}
