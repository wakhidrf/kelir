import MuiSlider from "@mui/material/Slider";
import type { SliderProps } from "../kelir-types";
import { css } from "../kelir-variants";

const convexShadow = css.shadows.convex;
const neumorphicBg = css.colors.surface;

export function Slider({ ...props }: SliderProps) {
  return (
    <MuiSlider
      {...props}
      style={{
        color: css.colors.primary,
        ...props.style,
      }}
      sx={{
        "& .MuiSlider-thumb": {
          backgroundColor: neumorphicBg,
          boxShadow: convexShadow,
          border: `2px solid ${css.colors.primary}`,
        },
        "& .MuiSlider-rail": {
          backgroundColor: css.track,
        },
      }}
    />
  );
}
