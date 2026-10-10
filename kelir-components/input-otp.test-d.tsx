import { InputOtp } from "./input-otp";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// InputOtp value/onChange(string) + length MAKNA.
export function inputOtpContractChecks() {
  const ok = <InputOtp value="1234" onChange={() => {}} length={4} />;

  // @ts-expect-error - value wajib
  const noValue = <InputOtp onChange={() => {}} />;
  // @ts-expect-error - onChange wajib
  const noOnChange = <InputOtp value="12" />;
  // @ts-expect-error - style milik kit
  const noStyle = <InputOtp value="1" onChange={() => {}} style={{ gap: "4px" }} />;
  return { ok, noValue, noOnChange, noStyle };
}
