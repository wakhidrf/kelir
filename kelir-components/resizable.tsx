import * as React from "react";
import type { ResizableProps } from "../kelir-types";
import { css } from "../kelir-variants";

const neumorphicBg = css.colors.surface;
const concaveShadow = css.shadows.concave;

export function Resizable({
  panels,
  directions = "horizontal",
  ...props
}: ResizableProps) {
  const isVertical = directions === "vertical";
  const containerRef = React.useRef<HTMLDivElement>(null);
  const elementIdCache = React.useRef(new WeakMap<object, string>());
  const nextElementId = React.useRef(0);
  const [dragging, setDragging] = React.useState<number | null>(null);
  const [sizes, setSizes] = React.useState<number[]>(() =>
    panels.map(() => 100 / panels.length),
  );

  const getPanelKey = (panel: React.ReactNode): string => {
    if (React.isValidElement(panel)) {
      if (panel.key != null) return `kelir-${String(panel.key)}`;
      const cached = elementIdCache.current.get(panel);
      if (cached) return cached;
      const id = `kelir-panel-${nextElementId.current}`;
      nextElementId.current += 1;
      elementIdCache.current.set(panel, id);
      return id;
    }
    return `kelir-${typeof panel}`;
  };

  React.useEffect(() => {
    if (dragging === null) return;

    const handleMouseMove = (event: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const total = isVertical ? rect.height : rect.width;
      if (total <= 0) return;
      const cursor = isVertical
        ? event.clientY - rect.top
        : event.clientX - rect.left;
      const pct = Math.min(Math.max((cursor / total) * 100, 10), 90);

      setSizes((prev) => {
        const sumBefore = prev.slice(0, dragging).reduce((a, b) => a + b, 0);
        const sumAfter = prev.slice(dragging + 2).reduce((a, b) => a + b, 0);
        const next = [...prev];
        next[dragging] = Math.max(pct - sumBefore, 10);
        next[dragging + 1] = Math.max(100 - pct - sumAfter, 10);
        return next;
      });
    };

    const handleMouseUp = () => setDragging(null);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, isVertical]);

  const handleMouseDown = (index: number) => (event: React.MouseEvent) => {
    event.preventDefault();
    setDragging(index);
  };

  return (
    <div
      {...props}
      ref={containerRef}
      style={{
        display: "flex",
        flexDirection: isVertical ? "column" : "row",
        width: "100%",
        height: isVertical ? "360px" : undefined,
        userSelect: "none",
        fontFamily: "inherit",
        ...props.style,
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
                borderRadius: css.radius.sm,
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
