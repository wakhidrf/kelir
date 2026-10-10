import { Marker } from "./marker";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// `intent` = makna (bukan warna); variant union tertutup.
export function markerContractChecks() {
  const ok = (
    <Marker variant="note" intent="success" id="m" aria-label="catatan">
      Berhasil disimpan
    </Marker>
  );
  const okAll = (
    <>
      <Marker variant="status" intent="primary">Aktif</Marker>
      <Marker variant="border" intent="warning">Perhatian</Marker>
      <Marker variant="separator" intent="secondary">Batas</Marker>
      <Marker variant="note" intent="error">Gagal</Marker>
    </>
  );

  // @ts-expect-error — style passthrough haram (warisan HTMLAttributes dibuang)
  const noStyle = <Marker style={{ margin: 4 }}>isi</Marker>;
  // @ts-expect-error — className passthrough haram
  const noClassName = <Marker className="my-marker">isi</Marker>;
  // @ts-expect-error — onClick haram (bukan komponen interaktif)
  const noOnClick = <Marker onClick={() => {}}>isi</Marker>;
  // @ts-expect-error — color lama haram (rename ke intent)
  const noColor = <Marker color="primary">isi</Marker>;
  // @ts-expect-error — intent bebas haram (union tertutup)
  const noRawIntent = <Marker intent="info">isi</Marker>;
  // @ts-expect-error — variant bebas haram (union tertutup)
  const noRawVariant = <Marker variant="badge">isi</Marker>;

  return { ok, okAll, noStyle, noClassName, noOnClick, noColor, noRawIntent, noRawVariant };
}
