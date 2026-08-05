import MuiCollapse from "@mui/material/Collapse";
import * as React from "react";
import type { CollapsibleProps } from "../kelir-types";
import { css } from "../kelir-variants";

const textPrimary = css.colors.textPrimary;

type TriggerElementProps = {
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
};

export function Collapsible({
  trigger,
  children,
  defaultOpen = false,
  ...props
}: CollapsibleProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  const triggerElement = React.isValidElement(trigger)
    ? (trigger as React.ReactElement<TriggerElementProps>)
    : undefined;

  const triggerNode = triggerElement
    ? React.cloneElement(triggerElement, {
        onClick: (event: React.MouseEvent<HTMLElement>) => {
          triggerElement.props.onClick?.(event);
          setOpen((value) => !value);
        },
      })
    : trigger;

  return (
    <div
      {...props}
      style={{
        fontFamily: "inherit",
        color: textPrimary,
        ...props.style,
      }}
    >
      <div style={{ cursor: "pointer", display: "inline-block" }}>
        {triggerNode}
      </div>
      <MuiCollapse in={open}>{children}</MuiCollapse>
    </div>
  );
}
