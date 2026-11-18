"use client";

import MuiInputBase from "@mui/material/InputBase";
import { forwardRef } from "react";
import type { CSSProperties } from "react";

export const KelirSelectInput = forwardRef<
  HTMLDivElement,
  { notched?: unknown; style?: CSSProperties } & Record<string, unknown>
>(function KelirSelectInput(props, ref) {
  const { notched: _notched, ...rest } = props;
  return <MuiInputBase ref={ref} fullWidth {...rest} />;
});