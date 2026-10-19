import { PageFrame } from "./page-frame";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
export function pageFrameContractChecks() {
  const ok = (
    <PageFrame
      header={<h1>Judul</h1>}
      footer={<p>kaki</p>}
      overlays={<span>pemicu</span>}
      id="halaman"
      aria-label="Halaman"
    >
      <p>isi</p>
    </PageFrame>
  );
  const okMinimal = (
    <PageFrame>
      <p>isi</p>
    </PageFrame>
  );
  // @ts-expect-error — style passthrough haram
  const noStyle = <PageFrame style={{ padding: 0 }}>isi</PageFrame>;
  // @ts-expect-error — className passthrough haram
  const noClassName = <PageFrame className="halaman">isi</PageFrame>;
  // @ts-expect-error — prop tak dikenal tidak diteruskan ke DOM
  const noRest = <PageFrame title="x">isi</PageFrame>;
  return { ok, okMinimal, noStyle, noClassName, noRest };
}
