import AttachFileIcon from "@mui/icons-material/AttachFile";
import type * as React from "react";
import type { AttachmentProps } from "../kelir-types";
import { css } from "../kelir-variants";
import { AttachmentStatus, AttachmentProgress } from "./attachment-status";
import { AttachmentFileInfo, AttachmentRemoveButton } from "./attachment-info";

const convexShadow = css.shadows.convex;
const concaveShadow = css.shadows.concave;
const neumorphicBg = css.colors.surface;
const textPrimary = css.colors.textPrimary;

export function Attachment({
  name,
  size,
  type,
  url,
  status = "idle",
  progress = 0,
  onRemove,
}: AttachmentProps) {
  const nameNode = url ? (
    <a href={url} style={{ textDecoration: "none", color: "inherit" }}>
      {name}
    </a>
  ) : (
    name
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: css.layout.space.md,
        backgroundColor: neumorphicBg,
        borderRadius: css.radius.card,
        boxShadow: convexShadow,
        border: `1px solid ${css.border.light}`,
        padding: `${css.layout.space.md} ${css.layout.space.lg}`,
        color: textPrimary,
        fontFamily: "inherit",
        fontSize: "14px",
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
          borderRadius: css.control.radius,
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
            gap: css.layout.space.sm,
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
          {status !== "idle" && (
            <AttachmentStatus status={status} progress={progress} />
          )}
        </div>
        <AttachmentFileInfo size={size} type={type} />
        {status === "uploading" && <AttachmentProgress progress={progress} />}
      </div>
      {onRemove && <AttachmentRemoveButton name={name} onRemove={onRemove} />}
    </div>
  );
}