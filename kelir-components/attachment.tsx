import AttachFileIcon from "@mui/icons-material/AttachFile";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlined";
import type * as React from "react";
import type { AttachmentProps } from "../kelir-types";
import { css } from "../kelir-variants";

const convexShadow = css.shadows.convex;
const concaveShadow = css.shadows.concave;
const neumorphicBg = css.colors.surface;
const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;

export function Attachment({
  name,
  size,
  type,
  url,
  status = "idle",
  progress = 0,
  onRemove,
  ...props
}: AttachmentProps) {
  const nameNode = url ? (
    <a href={url} style={{ textDecoration: "none", color: "inherit" }}>
      {name}
    </a>
  ) : (
    name
  );

  const statusStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "11px",
    fontWeight: 600,
    flexShrink: 0,
  };

  return (
    <div
      {...props}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        backgroundColor: neumorphicBg,
        borderRadius: css.radius.sm,
        boxShadow: convexShadow,
        border: `1px solid ${css.border.light}`,
        padding: "12px 16px",
        color: textPrimary,
        fontFamily: "inherit",
        fontSize: "14px",
        ...props.style,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "40px",
          height: "40px",
          flexShrink: 0,
          borderRadius: css.radius.sm,
          backgroundColor: css.colors.primary,
          color: css.on.primary,
          boxShadow: concaveShadow,
        }}
      >
        <AttachFileIcon style={{ fontSize: 20 }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              fontWeight: 600,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {nameNode}
          </span>
          {status === "uploading" && (
            <span style={{ ...statusStyle, color: css.colors.primary }}>
              Uploading {Math.min(100, Math.max(0, progress))}%
            </span>
          )}
          {status === "success" && (
            <span style={{ ...statusStyle, color: css.colors.primary }}>
              <CheckCircleIcon style={{ fontSize: 14 }} /> Saved
            </span>
          )}
          {status === "error" && (
            <span style={{ ...statusStyle, color: css.destructive }}>
              <ErrorOutlineIcon style={{ fontSize: 14 }} /> Failed
            </span>
          )}
        </div>
        <div
          style={{
            color: textSecondary,
            fontSize: "12px",
            marginTop: "2px",
          }}
        >
          {[size, type].filter(Boolean).join(" • ") || "Attached file"}
        </div>
        {status === "uploading" && (
          <div
            style={{
              marginTop: "8px",
              height: "6px",
              borderRadius: "999px",
              backgroundColor: css.track,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${Math.min(100, Math.max(0, progress))}%`,
                borderRadius: "999px",
                backgroundColor: css.colors.primary,
                transition: "width 200ms ease-out",
              }}
            />
          </div>
        )}
      </div>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Delete ${name}`}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "28px",
            height: "28px",
            flexShrink: 0,
            border: `1px solid ${css.border.light}`,
            borderRadius: css.radius.sm,
            backgroundColor: neumorphicBg,
            color: textSecondary,
            cursor: "pointer",
            boxShadow: convexShadow,
            transition: "all 150ms ease-out",
          }}
        >
          <CloseIcon style={{ fontSize: 16 }} />
        </button>
      )}
    </div>
  );
}
