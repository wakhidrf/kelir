import Divider from "@mui/material/Divider";
import MuiMenu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import * as React from "react";
import type { DropdownMenuProps } from "../kelir-types";
import { css } from "../kelir-variants";

const convexShadow = css.shadows.convex;
const neumorphicBg = css.colors.surface;
const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;

type TriggerElementProps = {
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
};

export function DropdownMenu({ trigger, items, ...props }: DropdownMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const triggerElement = React.isValidElement(trigger)
    ? (trigger as React.ReactElement<TriggerElementProps>)
    : undefined;

  const triggerNode = triggerElement
    ? React.cloneElement(triggerElement, {
        onClick: (event: React.MouseEvent<HTMLElement>) => {
          triggerElement.props.onClick?.(event);
          setAnchorEl(event.currentTarget);
        },
      })
    : trigger;

  return (
    <>
      {triggerNode}
      <MuiMenu
        {...props}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorEl={anchorEl}
        slotProps={{
          paper: {
            style: {
              backgroundColor: neumorphicBg,
              borderRadius: css.radius.sm,
              boxShadow: convexShadow,
              border: `1px solid ${css.border.light}`,
              fontFamily: "inherit",
              padding: "4px",
            },
          },
        }}
      >
        {items.map((item) => (
          <React.Fragment key={`dropdown-${item.label}`}>
            {item.divider && (
              <Divider
                style={{ backgroundColor: css.divider, margin: "4px 0" }}
              />
            )}
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                item.onClick?.();
              }}
              style={{
                color: textPrimary,
                fontSize: "14px",
                borderRadius: css.radius.sm,
                gap: "8px",
              }}
            >
              {item.icon && (
                <span style={{ color: textSecondary, display: "inline-flex" }}>
                  {item.icon}
                </span>
              )}
              {item.label}
            </MenuItem>
          </React.Fragment>
        ))}
      </MuiMenu>
    </>
  );
}
