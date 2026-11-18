"use client";

import * as React from "react";
import { copyText } from "./code-block-clipboard";

// CodeBlock copy state (internal): copied flag with a 2s reset; the timer is
// cleared on unmount and before each new reset.
export function useCodeBlockCopy(code: string) {
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
        // Clipboard unavailable and fallback failed: leave the label as-is,
        // with no false confirmation.
      });
  };

  return { copied, handleCopy };
}