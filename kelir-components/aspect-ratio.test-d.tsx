import { AspectRatio } from "./aspect-ratio";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// AspectRatio: ratio angka + children slot media.
export function aspectRatioContractChecks() {
  const ok = (
    <AspectRatio ratio={16 / 9}>
      <img src="x.jpg" alt="x" />
    </AspectRatio>
  );

  const noStringRatio = (
    <AspectRatio
      // @ts-expect-error - ratio string bukan kontrak AspectRatio
      ratio="16/9"
    >
      <img src="x.jpg" alt="x" />
    </AspectRatio>
  );
  const noStyle = (
    <AspectRatio
      // @ts-expect-error - style milik kit
      style={{ margin: 4 }}
    >
      <img src="x.jpg" alt="x" />
    </AspectRatio>
  );
  const noClassName = (
    <AspectRatio
      // @ts-expect-error - className milik kit
      className="lebar"
    >
      <img src="x.jpg" alt="x" />
    </AspectRatio>
  );
  return { ok, noStringRatio, noStyle, noClassName };
}
