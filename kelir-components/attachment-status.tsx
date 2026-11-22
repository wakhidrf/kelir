import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlined";
import type * as React from "react";
import { css } from "../kelir-kit/kit-create-css";

const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;

export const statusStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: css.layout.space.xs,
  fontSize: "11px",
  fontWeight: 600,
  flexShrink: 0,
};

export function AttachmentStatus({ status, progress }: {
  status: "idle" | "uploading" | "success" | "error";
  progress: number;
}) {
  const safeProgress = Math.min(100, Math.max(0, progress));

  if (status === "uploading") {
    return (
      <span style={{ ...statusStyle, color: textSecondary }}>
        Uploading {safeProgress}%
      </span>
    );
  }
  if (status === "success") {
    return (
      <span style={{ ...statusStyle, color: textPrimary }}>
        <CheckCircleIcon style={{ fontSize: 14 }} /> Saved
      </span>
    );
  }
  if (status === "error") {
    return (
      <span style={{ ...statusStyle, color: css.destructive }}>
        <ErrorOutlineIcon style={{ fontSize: 14 }} /> Failed
      </span>
    );
  }
  return null;
}

export function AttachmentProgress({ progress }: { progress: number }) {
  const safeProgress = Math.min(100, Math.max(0, progress));
  return (
    <div
      style={{
        marginTop: css.layout.space.sm,
        height: "6px",
        borderRadius: "999px",
        backgroundColor: css.track,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${safeProgress}%`,
          borderRadius: "999px",
          backgroundColor: css.colors.primary,
          transition: `width ${css.motion.duration.hover} ${css.motion.easing.curve}`,
        }}
      />
    </div>
  );
}