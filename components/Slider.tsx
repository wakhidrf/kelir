import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { SliderProps } from "../types.js";
import { Slider as NeumorphismSlider } from "../themes/neumorphism/slider.js";

export function Slider(props: SliderProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismSlider {...props} />;
  }

  return null;
}
