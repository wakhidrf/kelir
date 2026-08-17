import MuiInputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import MuiSelect from "@mui/material/Select";
import { useRef, useState } from "react";
import type { SelectProps } from "../kelir-types";
import { css, scrollbarClass } from "../kelir-variants";

const convexShadow = css.shadows.convex;
const concaveShadow = css.shadows.concave;
const neumorphicBg = css.colors.surface;
const surfaceBlur = css.motion.blur.backdrop;
const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;

export function Select({ options, style, ...props }: SelectProps) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [menuWidth, setMenuWidth] = useState<number | undefined>(undefined);

  // Scrollbar bertema, persis seperti .kelir-scrollbar (lihat scrollbarCss).
  // Dipasang langsung via sx agar menempel pada elemen yang benar-benar
  // melakukan scroll (paper/list), tidak bergantung pada className yang
  // mungkin tidak sampai ke kontainer scroll MUI.
  const menuScrollbarSx = {
    scrollbarWidth: "thin",
    scrollbarColor: `color-mix(in srgb, ${css.colors.textSecondary} 45%, transparent) ${css.track}`,
    "&::-webkit-scrollbar": { width: 10, height: 10 },
    "&::-webkit-scrollbar-track": {
      background: css.track,
      borderRadius: css.radius.sm,
    },
    "&::-webkit-scrollbar-thumb": {
      background: `color-mix(in srgb, ${css.colors.textSecondary} 45%, transparent)`,
      border: "2px solid transparent",
      backgroundClip: "padding-box",
      borderRadius: css.radius.sm,
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: css.colors.primary,
      border: "2px solid transparent",
      backgroundClip: "padding-box",
    },
  };

  return (
    <MuiSelect
      ref={anchorRef as never}
      {...props}
      input={
        <MuiInputBase
          fullWidth
          style={{
            backgroundColor: neumorphicBg,
            borderRadius: css.radius.sm,
            boxShadow: concaveShadow,
            border: `1px solid ${css.border.light}`,
            backdropFilter: surfaceBlur,
            WebkitBackdropFilter: surfaceBlur,
            color: textPrimary,
            fontFamily: "inherit",
            fontSize: "14px",
            ...style,
          }}
        />
      }
      sx={{
        "& .MuiSelect-select": {
          padding: "10px 36px 10px 14px",
        },
        "& .MuiSelect-icon": {
          color: textSecondary,
          right: css.layout.space.sm,
        },
        "&.Mui-focused": {
          borderColor: css.colors.primary,
          "& .MuiInputBase-root": {
            borderColor: css.colors.primary,
          },
        },
        "&:focus-visible": {
          outline: `${css.focusRing.width} solid ${css.focusRing.color}`,
          outlineOffset: css.focusRing.offset,
        },
      }}
      onOpen={() => {
        if (anchorRef.current) {
          setMenuWidth(anchorRef.current.getBoundingClientRect().width);
        }
      }}
      MenuProps={{
        slotProps: {
          paper: {
            className: scrollbarClass,
            sx: menuScrollbarSx,
            style: {
              backgroundColor: neumorphicBg,
              borderRadius: css.radius.sm,
              boxShadow: convexShadow,
              border: `1px solid ${css.border.light}`,
              backdropFilter: surfaceBlur,
              WebkitBackdropFilter: surfaceBlur,
              marginTop: css.layout.space.sm,
              width: menuWidth ? `${menuWidth}px` : undefined,
              maxHeight: "min(60vh, 360px)",
              overflowY: "auto",
            },
          },
          list: {
            className: scrollbarClass,
            sx: menuScrollbarSx,
            style: {
              width: "100%",
            },
          },
        },
      }}
    >
      {options.map((option) => (
        <MenuItem
          key={option.value}
          value={option.value}
          style={{
            color: textPrimary,
            fontFamily: "inherit",
            fontSize: "14px",
            whiteSpace: "normal",
            wordBreak: "break-word",
            overflowWrap: "anywhere",
            lineHeight: 1.4,
          }}
          sx={{
            whiteSpace: "normal",
            "&.Mui-selected": {
              backgroundColor: css.colors.primary,
              color: css.on.primary,
            },
            "&.Mui-selected:hover": {
              backgroundColor: css.colors.primary,
              color: css.on.primary,
            },
            "&:hover": {
              backgroundColor: css.colors.primary,
              color: css.on.primary,
              opacity: 0.9,
            },
          }}
        >
          {option.label}
        </MenuItem>
      ))}
    </MuiSelect>
  );
}
