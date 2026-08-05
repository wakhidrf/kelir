import * as React from "react";
import type { CarouselProps } from "../kelir-types";
import { css } from "../kelir-variants";

const convexShadow = css.shadows.convex;
const neumorphicBg = css.colors.surface;
const textPrimary = css.colors.textPrimary;

const navButtonStyles: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "32px",
  height: "32px",
  border: `1px solid ${css.border.light}`,
  borderRadius: "999px",
  backgroundColor: neumorphicBg,
  color: textPrimary,
  boxShadow: convexShadow,
  cursor: "pointer",
  fontFamily: "inherit",
  fontSize: "18px",
  transition: "all 150ms ease-out",
};

export function Carousel({
  items,
  autoPlay = false,
  interval = 3000,
  ...props
}: CarouselProps) {
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
      {...props}
      style={{
        backgroundColor: neumorphicBg,
        borderRadius: css.radius.sm,
        boxShadow: convexShadow,
        border: `1px solid ${css.border.light}`,
        padding: "16px",
        color: textPrimary,
        fontFamily: "inherit",
        ...props.style,
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
        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => goTo(index - 1)}
          style={{ ...navButtonStyles, left: "8px" }}
        >
          ‹
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => goTo(index + 1)}
          style={{ ...navButtonStyles, right: "8px", left: "auto" }}
        >
          ›
        </button>
      </div>
      {count > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "8px",
            marginTop: "12px",
          }}
        >
          {slides.map(({ slideIndex }) => (
            <button
              key={`dot-${slideIndex}`}
              type="button"
              aria-label={`Ke slide ${slideIndex + 1}`}
              onClick={() => setIndex(slideIndex)}
              style={{
                width: slideIndex === index ? "20px" : "8px",
                height: "8px",
                padding: 0,
                border: "none",
                borderRadius: "999px",
                backgroundColor:
                  slideIndex === index ? css.colors.primary : css.track,
                boxShadow: slideIndex === index ? convexShadow : "none",
                cursor: "pointer",
                transition: "all 200ms ease-out",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
