import { Stack } from "./stack";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// children layout = ReactNode (boleh komponen Kelir apa pun); gap/direction
// union tertutup; tanpa style/sx/className/slot passthrough, tanpa ...rest.
export function stackContractChecks() {
  const okColumn = (
    <Stack gap="md" direction="column" id="a" aria-label="b">
      <span>isi</span>
    </Stack>
  );
  const okRow = (
    <Stack gap="xs" direction="row">
      teks
    </Stack>
  );
  const okAlign = (
    <Stack direction="row" align="center" justify="space-between">
      <span>baris</span>
    </Stack>
  );
  const okWrap = (
    <Stack direction="row" wrap justify="center">
      <span>baris</span>
    </Stack>
  );
  const okResponsive = (
    <Stack direction="column" directionMd="row" minHeight="lg" gap="md">
      <span>kolom di ponsel, baris di desktop</span>
    </Stack>
  );
  const okScreen = (
    <Stack minHeight="screen" align="center" justify="center">
      <span>satu layar penuh</span>
    </Stack>
  );
  const okReverse = (
    <Stack direction="column" directionMd="row" reverseMd>
      <span>balik urutan di desktop</span>
    </Stack>
  );

  // @ts-expect-error — style passthrough haram (layout milik Stack)
  const noStyle = <Stack style={{ marginTop: 8 }}>isi</Stack>;
  // @ts-expect-error — sx passthrough haram
  const noSx = <Stack sx={{ mt: 1 }}>isi</Stack>;
  // @ts-expect-error — className passthrough haram
  const noClassName = <Stack className="my-stack">isi</Stack>;
  // @ts-expect-error — gap angka bebas haram (union tertutup)
  const noRawGap = <Stack gap={24}>isi</Stack>;
  // @ts-expect-error — direction bebas haram (row|column saja)
  const noRawDirection = <Stack direction="row-reverse">isi</Stack>;
  // @ts-expect-error — directionMd bebas haram (row|column saja)
  const noRawDirectionMd = <Stack directionMd="row-reverse">isi</Stack>;
  // @ts-expect-error — minHeight bebas haram (union space tertutup)
  const noRawMinHeight = <Stack minHeight={65}>isi</Stack>;
  // @ts-expect-error — align bebas haram (start|center|end|stretch)
  const noRawAlign = <Stack align="baseline">isi</Stack>;
  // @ts-expect-error — justify bebas haram (start|center|end|space-between)
  const noRawJustify = <Stack justify="space-around">isi</Stack>;
  // @ts-expect-error — wrap non-boolean haram
  const noRawWrap = <Stack wrap="yes">isi</Stack>;
  // @ts-expect-error — reverseMd non-boolean haram
  const noRawReverseMd = <Stack reverseMd="yes">isi</Stack>;
  // @ts-expect-error — prop tak dikenal tidak diteruskan ke DOM
  const noRest = <Stack title="x">isi</Stack>;
  // NOTE: atribut data-* (mis. data-testid untuk test hook) DIIZINKAN oleh
  // tipe React 19 pada komponen kustom — ditoleransi karena tak berefek
  // visual; semua prop lain di luar kontrak ditolak (§6b STYLE.md).

  return { okColumn, okRow, okAlign, okWrap, okResponsive, okScreen, okReverse, noStyle, noSx, noClassName, noRawGap, noRawDirection, noRawDirectionMd, noRawMinHeight, noRawAlign, noRawJustify, noRawWrap, noRawReverseMd, noRest };
}
