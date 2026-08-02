import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { InputOtpProps } from "../types.js";
import { InputOtp as NeumorphismInputOtp } from "../themes/neumorphism/input-otp.js";

export function InputOtp(props: InputOtpProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismInputOtp {...props} />;
  }

  return null;
}
