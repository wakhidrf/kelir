import { Container } from "./container";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// children = ReactNode; maxWidth/padding union tertutup dari token;
// tanpa style/sx/className, tanpa ...rest.
export function containerContractChecks() {
  const okDefault = (
    <Container id="a" aria-label="b">
      <span>isi</span>
    </Container>
  );
  const okSized = (
    <Container maxWidth="md" padding="lg">
      teks
    </Container>
  );
  const okBlock = (
    <Container paddingBlock="xl" clip>
      teks
    </Container>
  );
  const okBlockMd = (
    <Container paddingBlock="md" paddingBlockMd="2xl">
      teks
    </Container>
  );

  // @ts-expect-error — style passthrough haram (lebar milik Container)
  const noStyle = <Container style={{ maxWidth: 100 }}>isi</Container>;
  // @ts-expect-error — sx passthrough haram
  const noSx = <Container sx={{ p: 1 }}>isi</Container>;
  // @ts-expect-error — className passthrough haram
  const noClassName = <Container className="my-wrap">isi</Container>;
  // @ts-expect-error — maxWidth bebas haram (union tertutup)
  const noRawMax = <Container maxWidth="1200px">isi</Container>;
  // @ts-expect-error — padding bebas haram (union tertutup)
  const noRawPad = <Container padding="32px">isi</Container>;
  // @ts-expect-error — paddingBlock bebas haram (union tertutup)
  const noRawBlock = <Container paddingBlock="24px">isi</Container>;
  // @ts-expect-error — paddingBlockMd bebas haram (union tertutup)
  const noRawBlockMd = <Container paddingBlockMd="24px">isi</Container>;
  // @ts-expect-error — clip non-boolean haram
  const noRawClip = <Container clip="yes">isi</Container>;
  // @ts-expect-error — prop tak dikenal tidak diteruskan ke DOM
  const noRest = <Container title="x">isi</Container>;

  return { okDefault, okSized, okBlock, okBlockMd, noStyle, noSx, noClassName, noRawMax, noRawPad, noRawBlock, noRawBlockMd, noRawClip, noRest };
}
