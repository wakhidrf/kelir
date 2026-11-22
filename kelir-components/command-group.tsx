import type { CommandGroup } from "../kelir-kit/kit-navigation-chrome";
import { css } from "../kelir-kit/kit-create-css";

const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;

// Command group list (internal): heading + selectable items owned by the kit.
interface CommandGroupItemsProps {
  group: CommandGroup;
}

export function CommandGroupItems({ group }: CommandGroupItemsProps) {
  return (
    <div style={{ marginBottom: "6px" }}>
      <div
        style={{
          fontSize: "11px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "1px",
          color: textSecondary,
          padding: `${css.layout.space.sm} 10px ${css.layout.space.xs}`,
        }}
      >
        {group.heading}
      </div>
      {group.items.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => item.onSelect?.()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            width: "100%",
            border: "none",
            background: "none",
            cursor: "pointer",
            textAlign: "left",
            padding: "9px 10px",
            borderRadius: css.radius.button,
            fontSize: "14px",
            color: textPrimary,
            fontFamily: "inherit",
            transition: `all ${css.motion.duration.hover} ${css.motion.easing.curve}`,
          }}
        >
          {item.icon && (
            <span style={{ color: css.colors.primary }}>{item.icon}</span>
          )}
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}