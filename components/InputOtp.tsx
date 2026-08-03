import * as React from "react";
import { useKelir } from "../KelirProvider";
import { InputOtpProps } from "../types";
import { InputOtp as NeumorphismInputOtp } from "../themes/neumorphism/input-otp";

export function InputOtp(props: InputOtpProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismInputOtp {...props} />;
  }

  return null;
}
