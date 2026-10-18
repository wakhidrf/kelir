import { Avatar } from "./avatar";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// Avatar ISI (src/alt/fallbackText) + size MAKNA (small..3xl → px kit) + frame.
export function avatarContractChecks() {
  const ok = <Avatar fallbackText="WR" />;
  const okSrc = <Avatar src="/a.png" alt="Foto" size="large" />;
  const okSmall = <Avatar fallbackText="JD" size="small" />;
  const okXl = <Avatar fallbackText="JD" size="xl" />;
  const okFrame = <Avatar src="/maskot.png" alt="Maskot" size="2xl" frame />;
  const ok3xl = <Avatar fallbackText="JD" size="3xl" />;

  // @ts-expect-error - style (width/height/bg) milik kit
  const noStyle = <Avatar fallbackText="x" style={{ width: "48px" }} />;
  // @ts-expect-error - onClick bukan kontrak Avatar
  const noOnClick = <Avatar fallbackText="x" onClick={() => {}} />;
  // @ts-expect-error - size di luar union
  const noSize = <Avatar fallbackText="x" size="huge" />;
  // @ts-expect-error - frame non-boolean haram
  const noRawFrame = <Avatar fallbackText="x" frame="yes" />;
  return { ok, okSrc, okSmall, okXl, okFrame, ok3xl, noStyle, noOnClick, noSize, noRawFrame };
}
