import { AspectRatio } from "./aspect-ratio";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// AspectRatio: ratio angka + children slot media.
export function aspectRatioContractChecks() {
  const ok = (
    <AspectRatio ratio={16 / 9}>
      <img src="x.jpg" alt="x" />
    </AspectRatio>
  );

  const okPlain = (
    <AspectRatio ratio={1620 / 1643} plain>
      <img src="x.png" alt="Logo" />
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
  const noRawPlain = (
    <AspectRatio
      // @ts-expect-error - plain boolean, bukan string
      plain="yes"
    >
      <img src="x.jpg" alt="x" />
    </AspectRatio>
  );
  const okCapped = (
    <AspectRatio ratio={1620 / 1643} plain maxWidth={200} maxWidthMobileVw={34}>
      <span>logo</span>
    </AspectRatio>
  );
  // @ts-expect-error — maxWidth angka px saja
  const noRawMaxWidth = <AspectRatio maxWidth="200px">x</AspectRatio>;
  // @ts-expect-error — maxWidthMobileVw angka saja
  const noRawMaxWidthMobileVw = <AspectRatio maxWidthMobileVw="34">x</AspectRatio>;

  return { ok, okPlain, okCapped, noRawMaxWidth, noRawMaxWidthMobileVw, noStringRatio, noStyle, noClassName, noRawPlain };
}
