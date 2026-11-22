"use client";

import MuiBox from "@mui/material/Box";
import type { CodeBlockProps } from "../kelir-kit/kit-data-display-text";
import { css } from "../kelir-kit/kit-create-css";
import { Button } from "./button";
import { useCodeBlockCopy } from "./code-block-copy";

// Code block sealed (P2 STYLE.md 6): language label, copy button, and
// clipboard behavior owned by the kit; consumers only supply code text + label.
// MUI-based (MuiBox = pre + emotion + theme in the tree). No ...rest to the
// DOM, no style/sx/className passthrough.
export function CodeBlock({
  code,
  language,
  copyLabel = "Copy",
  copiedLabel = "Copied",
  id,
  "aria-label": ariaLabel,
}: CodeBlockProps) {
  const { copied, handleCopy } = useCodeBlockCopy(code);

  return (
    <MuiBox
      id={id}
      aria-label={ariaLabel}
      sx={{
        borderRadius: css.radius.card,
        border: `1px solid ${css.border.light}`,
        backgroundColor: css.colors.baseBackground,
        boxShadow: css.shadows.concave,
        overflow: "hidden",
        fontFamily: "var(--kelir-font-mono, monospace)",
      }}
    >
      <MuiBox
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: css.layout.space.md,
          padding: `${css.layout.space.sm} ${css.layout.space.lg}`,
          borderBottom: `1px solid ${css.divider}`,
        }}
      >
        <MuiBox
          component="span"
          sx={{
            color: css.colors.textSecondary,
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          {language || "code"}
        </MuiBox>
        <Button variant="ghost" size="sm" onClick={handleCopy}>
          {copied ? copiedLabel : copyLabel}
        </Button>
      </MuiBox>
      <MuiBox
        component="pre"
        sx={{
          margin: 0,
          padding: css.layout.space.lg,
          overflowX: "auto",
          color: css.colors.textPrimary,
          fontSize: "0.8125rem",
          lineHeight: 1.5,
          whiteSpace: "pre-wrap",
          overflowWrap: "anywhere",
        }}
      >
        <code>{code}</code>
      </MuiBox>
    </MuiBox>
  );
}
