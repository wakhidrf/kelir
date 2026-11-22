"use client";

import * as React from "react";
import type { ResizableProps } from "../kelir-kit/kit-data-display-data";
import { css } from "../kelir-kit/kit-create-css";
import { useResizableDrag } from "./resizable-drag";
import { usePanelKey } from "./resizable-panel-key";

const neumorphicBg = css.colors.surface;
const concaveShadow = css.shadows.concave;

export function Resizable<TPanel extends React.ReactNode = React.ReactNode>({
  panels,
  directions = "horizontal",
}: ResizableProps<TPanel>) {
  const isVertical = directions === "vertical";
  const { containerRef, sizes, handleMouseDown } = useResizableDrag(
    panels.length,
    isVertical,
  );
  const getPanelKey = usePanelKey<TPanel>();

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        flexDirection: isVertical ? "column" : "row",
        width: "100%",
        height: isVertical ? "360px" : undefined,
        userSelect: "none",
        fontFamily: "inherit",
      }}
    >
      {panels.map((panel, index) => (
        <React.Fragment key={getPanelKey(panel)}>
          <div
            style={{
              flex: `${sizes[index] ?? 0} 1 0%`,
              overflow: "hidden",
            }}
          >
            {panel}
          </div>
          {index < panels.length - 1 && (
            <hr
              onMouseDown={handleMouseDown(index)}
              style={{
                flex: "0 0 10px",
                border: "none",
                margin: 0,
                cursor: isVertical ? "row-resize" : "col-resize",
                backgroundColor: neumorphicBg,
                boxShadow: concaveShadow,
                borderRadius: css.control.radius,
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
