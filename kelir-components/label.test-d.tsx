import { Label } from "./label";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// Label children teks + htmlFor asosiasi MAKNA.
export function labelContractChecks() {
  const ok = <Label>Email Address</Label>;
  const okFor = <Label htmlFor="email">Email</Label>;

  // @ts-expect-error - children non-string bukan kontrak Label
  const noNode = <Label>{<b>Email</b>}</Label>;
  // @ts-expect-error - style milik kit
  const noStyle = <Label style={{ fontWeight: 700 }}>x</Label>;
  return { ok, okFor, noNode, noStyle };
}
