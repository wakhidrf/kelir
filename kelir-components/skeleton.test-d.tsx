import { Skeleton } from "./skeleton";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// Skeleton variant + DIMENSI (width/height data layout) + animation PERILAKU.
export function skeletonContractChecks() {
  const ok = <Skeleton variant="text" width="60%" height={20} />;
  const okCircular = <Skeleton variant="circular" width={48} height={48} />;
  const okStill = <Skeleton animation={false} />;

  // @ts-expect-error - style milik kit
  const noStyle = <Skeleton style={{ backgroundColor: "red" }} />;
  // @ts-expect-error - variant di luar union
  const noVariant = <Skeleton variant="dot" />;
  // @ts-expect-error - animation string bebas
  const noAnimation = <Skeleton animation="spin" />;
  return { ok, okCircular, okStill, noStyle, noVariant, noAnimation };
}
