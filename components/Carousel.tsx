import * as React from "react";
import { useKelir } from "../KelirProvider";
import { CarouselProps } from "../types";
import { Carousel as NeumorphismCarousel } from "../themes/neumorphism/carousel";

export function Carousel(props: CarouselProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismCarousel {...props} />;
  }

  return null;
}
