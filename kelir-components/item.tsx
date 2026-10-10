import MuiBox from "@mui/material/Box";
import MuiListItem from "@mui/material/ListItem";
import MuiListItemAvatar from "@mui/material/ListItemAvatar";
import MuiListItemText from "@mui/material/ListItemText";
import type { ItemProps } from "../kelir-types";
import { css } from "../kelir-variants";

export function Item({
  title,
  description,
  media,
  action,
  id,
  "aria-label": ariaLabel,
}: ItemProps) {
  return (
    <MuiListItem
      id={id}
      aria-label={ariaLabel}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: css.layout.space.md,
        padding: `${css.layout.space.md} ${css.layout.space.lg}`,
        borderRadius: css.radius.sm,
        backgroundColor: css.colors.surface,
        border: `1px solid ${css.border.light}`,
        boxShadow: css.shadows.convex,
        fontFamily: "inherit",
      }}
    >
      {media && <MuiListItemAvatar>{media}</MuiListItemAvatar>}
      <MuiListItemText
        primary={title}
        secondary={description}
        slotProps={{
          primary: {
            style: {
              color: css.colors.textPrimary,
              fontWeight: 600,
              fontSize: "14px",
              fontFamily: "inherit",
            },
          },
          secondary: {
            style: {
              color: css.colors.textSecondary,
              fontSize: "13px",
              fontFamily: "inherit",
            },
          },
        }}
      />
      {action && (
        <MuiBox sx={{ flexShrink: 0, marginLeft: css.layout.space.md }}>
          {action}
        </MuiBox>
      )}
    </MuiListItem>
  );
}
