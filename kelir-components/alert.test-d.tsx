import { Alert } from "./alert";

// Type-test negatif (Gel.2 §6/§6b): severity MAKNA wajib; title slot teks.
export function alertContractChecks() {
  const ok = (
    <Alert severity="warning" title="Perhatian" onClose={() => {}} id="a">
      Isi peringatan
    </Alert>
  );

  // @ts-expect-error — severity wajib
  const noSeverity = <Alert>isi</Alert>;
  // @ts-expect-error — severity bebas haram (union tertutup)
  const noRawSeverity = <Alert severity="critical">isi</Alert>;
  // @ts-expect-error — title non-string haram
  const noNodeTitle = <Alert severity="info" title={<span>x</span>}>isi</Alert>;
  // @ts-expect-error — style passthrough haram
  const noStyle = <Alert severity="info" style={{}}>isi</Alert>;
  // @ts-expect-error — sx passthrough haram
  const noSx = <Alert severity="info" sx={{}}>isi</Alert>;
  // @ts-expect-error — className passthrough haram
  const noClassName = <Alert severity="info" className="x">isi</Alert>;

  return { ok, noSeverity, noRawSeverity, noNodeTitle, noStyle, noSx, noClassName };
}
