import { Avatar } from "./avatar";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// Avatar ISI (src/alt/fallbackText) + size MAKNA (small/medium/large → px kit).
export function avatarContractChecks() {
  const ok = <Avatar fallbackText="WR" />;
  const okSrc = <Avatar src="/a.png" alt="Foto" size="large" />;
  const okSmall = <Avatar fallbackText="JD" size="small" />;

  // @ts-expect-error - style (width/height/bg) milik kit
  const noStyle = <Avatar fallbackText="x" style={{ width: "48px" }} />;
  // @ts-expect-error - onClick bukan kontrak Avatar
  const noOnClick = <Avatar fallbackText="x" onClick={() => {}} />;
  // @ts-expect-error - size di luar union
  const noSize = <Avatar fallbackText="x" size="xl" />;
  return { ok, okSrc, okSmall, noStyle, noOnClick, noSize };
}
