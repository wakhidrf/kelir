"use client";

import * as React from "react";

type ResizableDrag = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  sizes: number[];
  handleMouseDown: (index: number) => (event: React.MouseEvent) => void;
};

export function useResizableDrag(
  panelCount: number,
  isVertical: boolean,
): ResizableDrag {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = React.useState<number | null>(null);
  const [sizes, setSizes] = React.useState<number[]>(() =>
    Array.from({ length: panelCount }, () => 100 / panelCount),
  );

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

  return { containerRef, sizes, handleMouseDown };
}