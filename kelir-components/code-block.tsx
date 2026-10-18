"use client";

import MuiBox from "@mui/material/Box";
import * as React from "react";
import type { CodeBlockProps } from "../kelir-types";
import { css } from "../kelir-variants";
import { Button } from "./button";

// Blok kode sealed (P2 STYLE.md 6): label bahasa, tombol salin, dan perilaku
// clipboard milik kit; konsumen hanya memasok teks kode + label. Basis MUI
// (MuiBox = pre + emotion + tema di tree). Tanpa ...rest ke DOM, tanpa
// style/sx/className passthrough.
function copyText(codeText: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard
      .writeText(codeText)
      .catch(() => fallbackCopy(codeText));
  }
  return fallbackCopy(codeText);
}

// Cadangan saat clipboard API ditolak/tak ada: textarea sementara di luar
// aliran dokumen, tanpa jejak visual maupun fokus yang berpindah.
function fallbackCopy(codeText: string): Promise<void> {
  const textarea = document.createElement("textarea");
  textarea.value = codeText;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const ok = document.execCommand("copy");
  textarea.remove();
  return ok ? Promise.resolve() : Promise.reject(new Error("copy denied"));
}

export function CodeBlock({
  code,
  language,
  copyLabel = "Copy",
  copiedLabel = "Copied",
  id,
  "aria-label": ariaLabel,
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const handleCopy = () => {
    copyText(code)
      .then(() => {
        setCopied(true);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        // Clipboard tak tersedia dan cadangan gagal: label dibiarkan apa
        // adanya, tanpa konfirmasi palsu.
      });
  };

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
