import { Image } from "./image";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// src wajib; height/fit/radius union tertutup; tanpa style/sx/className,
// tanpa ...rest.
export function imageContractChecks() {
  const okMin = <Image src="logo.png" alt="Logo" />;
  const okFull = (
    <Image
      src="foto.jpg"
      alt="Foto"
      height="lg"
      fit="cover"
      radius="md"
      id="i"
      aria-label="gambar"
    />
  );
  const okFluid = (
    <Image src="hero.jpg" alt="Hero" fluid maxHeight="lg" />
  );
  const okCapped = (
    <Image src="hero.jpg" alt="Hero" fluid maxWidth={240} height="4xl" />
  );

  // @ts-expect-error — style passthrough haram (visual milik Image)
  const noStyle = <Image src="a.png" style={{ width: 10 }} />;
  // @ts-expect-error — sx passthrough haram
  const noSx = <Image src="a.png" sx={{ width: 10 }} />;
  // @ts-expect-error — className passthrough haram
  const noClassName = <Image src="a.png" className="my-img" />;
  // @ts-expect-error — height bebas haram (union tertutup)
  const noRawHeight = <Image src="a.png" height={44} />;
  // @ts-expect-error — fluid non-boolean haram
  const noRawFluid = <Image src="a.png" fluid="yes" />;
  // @ts-expect-error — maxHeight bebas haram (union tertutup)
  const noRawMaxHeight = <Image src="a.png" maxHeight={120} />;
  // @ts-expect-error — maxWidth harus angka px (bukan string)
  const noRawMaxWidth = <Image src="a.png" maxWidth="240px" />;
  // @ts-expect-error — fit bebas haram (contain|cover)
  const noRawFit = <Image src="a.png" fit="fill" />;
  // @ts-expect-error — radius bebas haram (none|sm|md|lg)
  const noRawRadius = <Image src="a.png" radius="xl" />;
  // @ts-expect-error — src wajib
  const noSrc = <Image alt="tanpa sumber" />;
  // @ts-expect-error — prop tak dikenal tidak diteruskan ke DOM
  const noRest = <Image src="a.png" title="x" />;

  return { okMin, okFull, okFluid, okCapped, noStyle, noSx, noClassName, noRawHeight, noRawFluid, noRawMaxHeight, noRawMaxWidth, noRawFit, noRawRadius, noSrc, noRest };
}
