import { Link } from "./link";

// Type-test negatif (§6/§6b STYLE.md): href wajib string;
// tanpa style/sx/className passthrough, tanpa ...rest.
export function linkContractChecks() {
  const okInternal = <Link href="/dokumen">Nama berkas</Link>;
  const okExternal = (
    <Link href="https://drive.example/f/1" external id="a" aria-label="b">
      <span>Buka Drive</span>
    </Link>
  );

  // @ts-expect-error — href wajib (tanpanya pakai Button ghost)
  const noHref = <Link>tanpa href</Link>;
  // @ts-expect-error — style passthrough haram (tautan milik Link)
  const noStyle = <Link href="/x" style={{ color: "red" }}>isi</Link>;
  // @ts-expect-error — sx passthrough haram
  const noSx = <Link href="/x" sx={{ px: 1 }}>isi</Link>;
  // @ts-expect-error — className passthrough haram
  const noClassName = <Link href="/x" className="my-link">isi</Link>;
  // @ts-expect-error — href non-string haram
  const noRawHref = <Link href={42}>isi</Link>;
  // @ts-expect-error — external non-boolean haram
  const noRawExternal = <Link href="/x" external="yes">isi</Link>;
  // @ts-expect-error — prop tak dikenal tidak diteruskan ke DOM
  const noRest = <Link href="/x" title="x">isi</Link>;

  return { okInternal, okExternal, noHref, noStyle, noSx, noClassName, noRawHref, noRawExternal, noRest };
}
