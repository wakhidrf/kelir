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
  const okTruncate = (
    <Typography variant="body-md" truncate>
      satu baris
    </Typography>
  );
  const okBreak = (
    <Typography variant="body-sm" breakAll tracking="wide">
      HV-2026-000123456789
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
  const okVariantMd = (
    <Typography variant="h3" variantMd="h1">
      membesar di desktop
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
  const okTone = (
    <Typography variant="body-md" tone="secondary">
      pendukung
    </Typography>
  );
  const okFont = (
    <Typography variant="hero" as="h1" font="brand">
      Merek
    </Typography>
  );
  const okHeroStat = (
    <>
      <Typography variant="hero">judul besar</Typography>
      <Typography variant="stat">128</Typography>
    </>
  );
  const okVariantMobile = (
    <Typography variant="hero" variantMobile="hero-sm">
      Project Kelir
    </Typography>
  );
  const okBrandTone = (
    <Typography tone="brand-accent">PROJECT</Typography>
  );
  const okBrandInk = (
    <Typography tone="brand-ink" variant="hero-sm">
      KELIR
    </Typography>
  );
  const okSegments = (
    <Typography
      variant="h1"
      segments={[
        { text: "OTW" },
        { text: " Admin", tone: "muted", scale: "sm" },
        { break: true },
      ]}
    />
  );

  // @ts-expect-error — style passthrough haram
  const noStyle = <Typography style={{ color: "red" }}>teks</Typography>;
  // @ts-expect-error — sx passthrough haram
  const noSx = <Typography sx={{ color: "red" }}>teks</Typography>;
  // @ts-expect-error — className passthrough haram
  const noClassName = <Typography className="my-text">teks</Typography>;
  // @ts-expect-error — variant bebas haram (union tertutup)
  const noRawVariant = <Typography variant="h4">teks</Typography>;
  // @ts-expect-error — variantMd bebas haram (union tertutup)
  const noRawVariantMd = <Typography variantMd="h4">teks</Typography>;
  // @ts-expect-error — as bebas haram (elemen semantik tertutup)
  const noRawAs = <Typography as="section">teks</Typography>;
  // @ts-expect-error — level bebas haram (1-6)
  const noRawLevel = <Typography level={7}>teks</Typography>;
  // @ts-expect-error — align bebas haram (start/center/end/justify)
  const noRawAlign = <Typography align="middle">teks</Typography>;
  // @ts-expect-error — truncate non-boolean haram
  const noRawTruncate = <Typography truncate="yes">teks</Typography>;
  // @ts-expect-error — breakAll non-boolean haram
  const noRawBreakAll = <Typography breakAll="yes">teks</Typography>;
  // @ts-expect-error — tracking bebas haram (normal/wide)
  const noRawTracking = <Typography tracking="loose">teks</Typography>;
  // @ts-expect-error — tone segmen bebas haram (muted/primary)
  const noRawTone = <Typography segments={[{ text: "x", tone: "danger" }]} />;
  // @ts-expect-error — scale segmen bebas haram (sm/md)
  const noRawScale = <Typography segments={[{ text: "x", scale: "lg" }]} />;
  // @ts-expect-error — tone bebas haram (primary/secondary)
  const noRawToneProp = <Typography tone="danger">teks</Typography>;
  // @ts-expect-error — font bebas haram (text/brand)
  const noRawFont = <Typography font="serif">teks</Typography>;
  // @ts-expect-error — varian di luar skala kit haram
  const noRawHeroVariant = <Typography variant="giant">teks</Typography>;
  // @ts-expect-error — prop tak dikenal tidak diteruskan ke DOM
  // (data-* ditoleransi tipe React 19 sebagai test hook; lihat stack.test-d)
  const noRest = <Typography title="x">teks</Typography>;

  // @ts-expect-error — varian ponsel di luar kontrak haram
  const noRawVariantMobile = <Typography variantMobile="h4">teks</Typography>;
  // @ts-expect-error — tone merek bebas haram
  const noRawBrandTone = <Typography tone="brand">teks</Typography>;

  return {
    okVariantMobile,
    okBrandTone,
    okBrandInk,
    noRawVariantMobile,
    noRawBrandTone,
    okBody,
    okAlign,
    okStart,
    okTruncate,
    okBreak,
    okHeading,
    okSplit,
    okVariantMd,
    okAllVariants,
    okSegments,
    okTone,
    okFont,
    okHeroStat,
    noStyle,
    noSx,
    noClassName,
    noRawVariant,
    noRawVariantMd,
    noRawAs,
    noRawLevel,
    noRawAlign,
    noRawTruncate,
    noRawBreakAll,
    noRawTracking,
    noRawTone,
    noRawScale,
    noRawToneProp,
    noRawFont,
    noRawHeroVariant,
    noRest,
  };
}
