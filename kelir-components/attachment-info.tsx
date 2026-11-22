import CloseIcon from "@mui/icons-material/Close";
import type * as React from "react";
import { css } from "../kelir-kit/kit-create-css";

const textSecondary = css.colors.textSecondary;

export function AttachmentFileInfo({ size, type }: {
  size: string | number | undefined;
  type: string | undefined;
}) {
  const info = [size, type].filter(Boolean).join(" • ") || "Attached file";
  return (
    <div
      style={{
        color: textSecondary,
        fontSize: "12px",
        marginTop: "2px",
      }}
    >
      {info}
    </div>
  );
}

export function AttachmentRemoveButton({ name, onRemove }: {
  name: string;
  onRemove: () => void;
}) {
  const convexShadow = css.shadows.convex;
  const neumorphicBg = css.colors.surface;
  const textSecondary = css.colors.textSecondary;

  return (
    <button
      type="button"
      onClick={() => onRemove()}
      aria-label={`Delete ${name}`}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "28px",
        height: "28px",
        flexShrink: 0,
        border: `1px solid ${css.border.light}`,
        borderRadius: css.radius.button,
        backgroundColor: neumorphicBg,
        color: textSecondary,
        cursor: "pointer",
        boxShadow: convexShadow,
        transition: `all ${css.motion.duration.hover} ${css.motion.easing.curve}`,
      }}
    >
      <CloseIcon style={{ fontSize: 16 }} />
    </button>
  );
}