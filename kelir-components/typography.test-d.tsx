import { Typography } from "./typography";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// `variant` = visual (union tertutup); `as`/`level` = dokumen;
// `align` = perataan teks (union tertutup).
export function typographyContractChecks() {
  const okBody = <Typography variant="body-md">teks</Typography>;
  const okAlign = (
    <Typography variant="body-md" align="center">
      tengah
    </Typography>
  );
  const okStart = (
    <Typography variant="body-md" align="start">
      awal
    </Typography>
  );
  const okHeading = (
    <Typography variant="h1" as="h1" id="t" aria-label="judul">
      Judul
    </Typography>
  );
  const okSplit = (
    <Typography variant="h2" as="p" level={2}>
      terlihat body, outline h2
    </Typography>
  );
  const okAllVariants = (
    <>
      <Typography variant="h3">h3</Typography>
      <Typography variant="body-sm">kecil</Typography>
      <Typography variant="caption">keterangan</Typography>
      <Typography variant="label-caps">label</Typography>
    </>
  );

  // @ts-expect-error — style passthrough haram
  const noStyle = <Typography style={{ color: "red" }}>teks</Typography>;
  // @ts-expect-error — sx passthrough haram
  const noSx = <Typography sx={{ color: "red" }}>teks</Typography>;
  // @ts-expect-error — className passthrough haram
  const noClassName = <Typography className="my-text">teks</Typography>;
  // @ts-expect-error — variant bebas haram (union tertutup)
  const noRawVariant = <Typography variant="h4">teks</Typography>;
  // @ts-expect-error — as bebas haram (elemen semantik tertutup)
  const noRawAs = <Typography as="section">teks</Typography>;
  // @ts-expect-error — level bebas haram (1-6)
  const noRawLevel = <Typography level={7}>teks</Typography>;
  // @ts-expect-error — align bebas haram (start/center/end/justify)
  const noRawAlign = <Typography align="middle">teks</Typography>;
  // @ts-expect-error — prop tak dikenal tidak diteruskan ke DOM
  // (data-* ditoleransi tipe React 19 sebagai test hook; lihat stack.test-d)
  const noRest = <Typography title="x">teks</Typography>;

  return {
    okBody,
    okAlign,
    okStart,
    okHeading,
    okSplit,
    okAllVariants,
    noStyle,
    noSx,
    noClassName,
    noRawVariant,
    noRawAs,
    noRawLevel,
    noRawAlign,
    noRest,
  };
}
