import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import MuiBox from "@mui/material/Box";
import type { LinkProps } from "../kelir-types";
import { css } from "../kelir-variants";

// Sealed inline link (P1b STYLE.md): text + inline icon belong to the kit
// (`external?` → open-in-new icon + `target _blank` + `rel noopener`,
// default internal-link arrow icon). textPrimary color, no underline.
// `href` is required - without href use `Button variant="ghost"`. MUI basis
// (MuiBox = a + emotion + theme in tree) for multi-platform; visuals
// belong to the kit. No ...rest to DOM and no style passthrough - outside
// the contract = violation.
export function Link({
  children,
  href,
  external = false,
  icon = "auto",
  id,
  "aria-label": ariaLabel,
}: LinkProps) {
  const Icon = external ? OpenInNewIcon : ArrowForwardIcon;
  const showIcon = icon !== "none";
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
      {showIcon && <Icon sx={{ fontSize: "1em" }} />}
    </MuiBox>
  );
}
