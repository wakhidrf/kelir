import * as React from "react";
import { useKelir } from "../KelirProvider";
import { SliderProps } from "../types";
import { Slider as NeumorphismSlider } from "../themes/neumorphism/slider";

export function Slider(props: SliderProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismSlider {...props} />;
  }

  return null;
}
