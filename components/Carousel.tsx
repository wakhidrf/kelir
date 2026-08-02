import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { CarouselProps } from "../types.js";
import { Carousel as NeumorphismCarousel } from "../themes/neumorphism/carousel.js";

export function Carousel(props: CarouselProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismCarousel {...props} />;
  }

  return null;
}
