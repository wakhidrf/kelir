import { css } from "../kelir-variants";
import { carouselDotStyle, carouselNavButtonStyle } from "./carousel-styles";

// Carousel navigation (internal): previous/next buttons over the slides.
interface CarouselNavProps {
  index: number;
  onGoTo: (target: number) => void;
}

export function CarouselNav({ index, onGoTo }: CarouselNavProps) {
  return (
    <>
      <button
        type="button"
        aria-label="Previous slide"
        onClick={() => onGoTo(index - 1)}
        style={{ ...carouselNavButtonStyle, left: "8px" }}
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={() => onGoTo(index + 1)}
        style={{ ...carouselNavButtonStyle, right: "8px", left: "auto" }}
      >
        ›
      </button>
    </>
  );
}

// Carousel pagination (internal): one dot per slide, active dot elongated.
interface CarouselDotsProps {
  index: number;
  count: number;
  onSelect: (index: number) => void;
}

export function CarouselDots({ index, count, onSelect }: CarouselDotsProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: css.layout.space.sm,
        marginTop: css.layout.space.md,
      }}
    >
      {Array.from({ length: count }, (_, slideIndex) => (
        <button
          key={`dot-${slideIndex}`}
          type="button"
          aria-label={`Go to slide ${slideIndex + 1}`}
          onClick={() => onSelect(slideIndex)}
          style={carouselDotStyle(slideIndex === index)}
        />
      ))}
    </div>
  );
}