import MuiPopover from "@mui/material/Popover";
import { useTheme } from "@mui/material/styles";
import * as React from "react";
import type { PopoverProps } from "../kelir-types";
import { css } from "../kelir-variants";

const convexShadow = css.shadows.convex;
const neumorphicBg = css.colors.surface;
const surfaceBlur = css.motion.blur.backdrop;
const textPrimary = css.colors.textPrimary;

type TriggerElementProps = {
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
};

export function Popover({ trigger, children, ...props }: PopoverProps) {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [internalOpen, setInternalOpen] = React.useState(false);

  const open = props.open ?? internalOpen;
  const popoverZIndex = useTheme().zIndex.modal + 1;

  React.useEffect(() => {
    if (props.open && wrapperRef.current) {
      setAnchorEl(wrapperRef.current);
    }
  }, [props.open]);

  const triggerElement = React.isValidElement(trigger)
    ? (trigger as React.ReactElement<TriggerElementProps>)
    : undefined;

  const triggerNode = triggerElement
    ? React.cloneElement(triggerElement, {
        onClick: (event: React.MouseEvent<HTMLElement>) => {
          triggerElement.props.onClick?.(event);
          setAnchorEl(event.currentTarget);
          setInternalOpen((value) => !value);
        },
      })
    : trigger;

  return (
    <div ref={wrapperRef} style={{ display: "inline-block" }}>
      {triggerNode}
      <MuiPopover
        {...props}
        open={open}
        anchorEl={anchorEl}
        style={{ ...props.style, zIndex: popoverZIndex }}
        onClose={(event, reason) => {
          setInternalOpen(false);
          props.onClose?.(event, reason);
        }}
        slotProps={{
          paper: {
            style: {
              backgroundColor: neumorphicBg,
              borderRadius: css.radius.sm,
              boxShadow: convexShadow,
              border: `1px solid ${css.border.light}`,
              backdropFilter: surfaceBlur,
              WebkitBackdropFilter: surfaceBlur,
              color: textPrimary,
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
