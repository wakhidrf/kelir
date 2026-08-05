import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import * as React from "react";
import type { MenubarProps } from "../kelir-types";
import { css } from "../kelir-variants";

const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;

export function Menubar({ menus, style, ...props }: MenubarProps) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const openMenu = (event: React.MouseEvent<HTMLElement>, index: number) => {
    setAnchorEl(event.currentTarget);
    setOpenIndex(index);
  };

  const closeMenu = () => {
    setAnchorEl(null);
    setOpenIndex(null);
  };

  return (
    <div
      {...props}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        padding: "6px 10px",
        borderRadius: css.radius.sm,
        backgroundColor: css.colors.surface,
        boxShadow: css.shadows.convex,
        border: `1px solid ${css.border.light}`,
        fontFamily: "inherit",
        ...style,
      }}
    >
      {menus.map((menu, index) => (
        <React.Fragment key={menu.trigger}>
          <button
            type="button"
            onClick={(e) =>
              openIndex === index ? closeMenu() : openMenu(e, index)
            }
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
              padding: "6px 12px",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: 600,
              color: openIndex === index ? css.on.primary : textSecondary,
              backgroundColor:
                openIndex === index ? css.colors.primary : "transparent",
              boxShadow: openIndex === index ? css.shadows.concave : "none",
              fontFamily: "inherit",
            }}
          >
            {menu.trigger}
          </button>
          <Menu
            open={openIndex === index}
            anchorEl={anchorEl}
            onClose={closeMenu}
            slotProps={{
              list: { sx: { py: 1 } },
              paper: {
                style: {
                  backgroundColor: css.colors.surface,
                  borderRadius: css.radius.sm,
                  boxShadow: css.shadows.convex,
                  border: `1px solid ${css.border.light}`,
                  color: textPrimary,
                },
              },
            }}
          >
            {menu.items.map((item) => (
              <MenuItem
                key={item.label}
                onClick={() => {
                  item.onClick?.();
                  closeMenu();
                }}
                style={{ fontFamily: "inherit", fontSize: "14px" }}
              >
                {item.label}
              </MenuItem>
            ))}
          </Menu>
        </React.Fragment>
      ))}
    </div>
  );
}
