"use client";

import * as React from "react";
import type { CarouselProps } from "../kelir-kit/kit-data-display-data";
import { css } from "../kelir-kit/kit-create-css";
import { CarouselDots, CarouselNav } from "./carousel-controls";

const convexShadow = css.shadows.convex;
const neumorphicBg = css.colors.surface;
const textPrimary = css.colors.textPrimary;

export function Carousel<TItem extends React.ReactNode = React.ReactNode>({
  items,
  autoPlay = false,
  interval = 3000,
}: CarouselProps<TItem>) {
  const [index, setIndex] = React.useState(0);
  const count = items.length;
  const slides = items.map((item, slideIndex) => ({ item, slideIndex }));

  React.useEffect(() => {
    if (!autoPlay || count < 2) return undefined;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, interval);
    return () => clearInterval(timer);
  }, [autoPlay, count, interval]);

  if (count === 0) return null;

  const goTo = (target: number) => setIndex(((target % count) + count) % count);

  return (
    <div
      style={{
        backgroundColor: neumorphicBg,
        borderRadius: css.radius.card,
        boxShadow: convexShadow,
        border: `1px solid ${css.border.light}`,
        padding: css.layout.space.lg,
        color: textPrimary,
        fontFamily: "inherit",
      }}
    >
      <div style={{ position: "relative" }}>
        {slides.map(({ item, slideIndex }) => (
          <div
            key={`slide-${slideIndex}`}
            style={{
              display: slideIndex === index ? "block" : "none",
            }}
          >
            {item}
          </div>
        ))}
        <CarouselNav index={index} onGoTo={goTo} />
      </div>
      {count > 1 && (
        <CarouselDots index={index} count={count} onSelect={setIndex} />
      )}
    </div>
  );
}
