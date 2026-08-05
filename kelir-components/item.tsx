import MuiListItem from "@mui/material/ListItem";
import MuiListItemAvatar from "@mui/material/ListItemAvatar";
import MuiListItemText from "@mui/material/ListItemText";
import type { ItemProps } from "../kelir-types";
import { css } from "../kelir-variants";

const convexShadow = css.shadows.convex;
const neumorphicBg = css.colors.surface;
const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;

export function Item({
  title,
  description,
  media,
  action,
  ...props
}: ItemProps) {
  return (
    <MuiListItem
      {...props}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 16px",
        borderRadius: css.radius.sm,
        backgroundColor: neumorphicBg,
        border: `1px solid ${css.border.light}`,
        boxShadow: convexShadow,
        fontFamily: "inherit",
        ...props.style,
      }}
    >
      {media && <MuiListItemAvatar>{media}</MuiListItemAvatar>}
      <MuiListItemText
        primary={title}
        secondary={description}
        slotProps={{
          primary: {
            style: {
              color: textPrimary,
              fontWeight: 600,
              fontSize: "14px",
              fontFamily: "inherit",
            },
          },
          secondary: {
            style: {
              color: textSecondary,
              fontSize: "13px",
              fontFamily: "inherit",
            },
          },
        }}
      />
      {action && (
        <div style={{ flexShrink: 0, marginLeft: "12px" }}>{action}</div>
      )}
    </MuiListItem>
  );
}
