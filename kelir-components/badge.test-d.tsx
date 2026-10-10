import { Badge } from "./badge";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// Badge children WAJIB string (label status); variant MAKNA (default primary).
export function badgeContractChecks() {
  const ok = <Badge variant="primary">Online</Badge>;
  const okOutline = <Badge variant="outline">Draft</Badge>;
  const okDefault = <Badge>Baru</Badge>;

  // @ts-expect-error - children non-string (slot aksi) bukan kontrak Badge
  const noNode = <Badge>{<button type="button">x</button>}</Badge>;
  // @ts-expect-error - style milik kit
  const noStyle = <Badge style={{ color: "red" }}>x</Badge>;
  // @ts-expect-error - sx milik kit
  const noSx = <Badge sx={{ color: "red" }}>x</Badge>;
  // @ts-expect-error - className milik kit
  const noClassName = <Badge className="milik-saya">x</Badge>;
  // @ts-expect-error - variant di luar union
  const noVariant = <Badge variant="info">x</Badge>;
  return { ok, okOutline, okDefault, noNode, noStyle, noSx, noClassName, noVariant };
}
