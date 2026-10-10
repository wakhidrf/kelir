import { Kbd } from "./kbd";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// Kbd children WAJIB string (teks tombol).
export function kbdContractChecks() {
  const ok = <Kbd>Ctrl</Kbd>;

  // @ts-expect-error - children non-string bukan kontrak Kbd
  const noNode = <Kbd>{<b>Ctrl</b>}</Kbd>;
  // @ts-expect-error - style milik kit
  const noStyle = <Kbd style={{ fontSize: "14px" }}>x</Kbd>;
  return { ok, noNode, noStyle };
}
