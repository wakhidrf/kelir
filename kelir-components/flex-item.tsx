import MuiBox from "@mui/material/Box";
import type { FlexItemProps } from "../kelir-kit/kit-layout-shell";
import { css } from "../kelir-kit/kit-create-css";

// Negative space token to pull up so elements stack at the top edge.
const offsets = {
  sm: `-${css.layout.space.sm}`,
  md: `-${css.layout.space.lg}`,
  lg: `-${css.layout.space.xl}`,
} as const;

// Sealed flex item control (P1b STYLE.md): pair of `Stack` (container).
// `grow?` = fill remaining space (`flex: 1, minWidth: 0`, default `false`);
// `shrink={false}` = refuse shrinking (`flexShrink: 0`, normal shrink by
// default); `clip?` = overflow cutter (`overflow: hidden`, default `false`,
// property fully removed when off); `offsetY?` = pull up (negative top
// margin from sm/md/lg space tokens) to stack elements at the top
// edge. Closed set of booleans, no free numbers. Default = plain block.
// MUI-based (MuiBox) so it's in the theme tree; visuals owned by the kit. No
// ...rest to the DOM and no style passthrough - out of contract = violation.
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
