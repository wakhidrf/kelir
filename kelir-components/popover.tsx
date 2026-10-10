"use client";

import MuiPopover from "@mui/material/Popover";
import { useTheme } from "@mui/material/styles";
import * as React from "react";
import type { PopoverProps } from "../kelir-types";
import { css } from "../kelir-variants";

type TriggerElementProps = {
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
};

export function Popover({
  trigger,
  children,
  open: openProp,
  onClose,
  id,
  "aria-label": ariaLabel,
}: PopoverProps) {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [internalOpen, setInternalOpen] = React.useState(false);

  const open = openProp ?? internalOpen;
  const popoverZIndex = useTheme().zIndex.modal + 1;

  // TerkONTROL penuh: tanpa klik trigger tak ada anchor — jangkar ke wrapper.
  React.useEffect(() => {
    if (openProp && wrapperRef.current) {
      setAnchorEl(wrapperRef.current);
    }
  }, [openProp]);

  const close = () => {
    if (openProp === undefined) setInternalOpen(false);
    onClose?.();
  };

  const triggerElement = React.isValidElement(trigger)
    ? (trigger as React.ReactElement<TriggerElementProps>)
    : undefined;

  const triggerNode = triggerElement
    ? React.cloneElement(triggerElement, {
        onClick: (event: React.MouseEvent<HTMLElement>) => {
          triggerElement.props.onClick?.(event);
          setAnchorEl(event.currentTarget);
          if (openProp === undefined) setInternalOpen((value) => !value);
        },
      })
    : trigger;

  return (
    <div ref={wrapperRef} style={{ display: "inline-block" }}>
      {triggerNode}
      <MuiPopover
        open={open}
        anchorEl={anchorEl}
        onClose={close}
        id={id}
        aria-label={ariaLabel}
        style={{ zIndex: popoverZIndex }}
        slotProps={{
          paper: {
            style: {
              backgroundColor: css.colors.surface,
              borderRadius: css.radius.surface,
              boxShadow: css.shadows.convex,
              border: `1px solid ${css.border.light}`,
              backdropFilter: css.motion.blur.backdrop,
              WebkitBackdropFilter: css.motion.blur.backdrop,
              color: css.colors.textPrimary,
              fontFamily: "inherit",
            },
          },
        }}
      >
        {children}
      </MuiPopover>
    </div>
  );
}
