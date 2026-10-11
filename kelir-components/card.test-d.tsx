import { Button } from "./button";
import { Card } from "./card";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// Slot teks = string; slot aksi/isi = ReactNode (komponen Kelir).
export function cardContractChecks() {
  const okFull = (
    <Card
      title="Judul"
      subtitle="Subjudul"
      headerActions={<Button variant="ghost">Aksi</Button>}
      footer={<Button variant="primary">Simpan</Button>}
      id="c"
      aria-label="kartu"
    >
      Isi kartu
    </Card>
  );
  const okBare = <Card>Isi saja</Card>;
  const okCentered = (
    <Card title="Judul" subtitle="Sub" headerAlign="center">
      Isi rata tengah
    </Card>
  );
  const okEnd = (
    <Card title="Judul" subtitle="Sub" headerAlign="end">
      Isi rata akhir
    </Card>
  );
  const okScrollable = (
    <Card title="Judul" scrollable>
      Isi scroll internal
    </Card>
  );
  const okFlag = (
    <Card title="Judul" flag="warn">
      Isi berstrip status
    </Card>
  );

  // @ts-expect-error — style passthrough haram
  const noStyle = <Card style={{ margin: 8 }}>isi</Card>;
  // @ts-expect-error — sx passthrough haram
  const noSx = <Card sx={{ m: 1 }}>isi</Card>;
  // @ts-expect-error — className passthrough haram
  const noClassName = <Card className="my-card">isi</Card>;
  // @ts-expect-error — title non-string haram (slot teks = string)
  const noNodeTitle = <Card title={<span>Judul</span>}>isi</Card>;
  // @ts-expect-error — headerAlign bebas haram (start/center/end)
  const noRawAlign = <Card title="x" headerAlign="middle">isi</Card>;
  // @ts-expect-error — scrollable non-boolean haram
  const noRawScrollable = <Card title="x" scrollable="yes">isi</Card>;
  // @ts-expect-error — flag bebas haram (danger/warn)
  const noRawFlag = <Card title="x" flag="info">isi</Card>;
  // @ts-expect-error — prop tak dikenal tidak diteruskan ke DOM
  const noRest = <Card title="x" onClick={() => {}}>isi</Card>;

  return {
    okFull,
    okBare,
    okCentered,
    okEnd,
    okScrollable,
    okFlag,
    noStyle,
    noSx,
    noClassName,
    noNodeTitle,
    noRawAlign,
    noRawScrollable,
    noRawFlag,
    noRest,
  };
}
