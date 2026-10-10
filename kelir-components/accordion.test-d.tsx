import { Accordion } from "./accordion";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// Accordion: summary/details slot TEKS; expanded TERKONTROL + onChange boolean.
export function accordionContractChecks() {
  const ok = <Accordion summary="Mulai" details="Masuk untuk memulai." />;

  // @ts-expect-error - summary node bukan kontrak Accordion
  const noNodeSummary = <Accordion summary={<b>Mulai</b>} details="Isi" />;
  // @ts-expect-error - details node bukan kontrak Accordion
  const noNodeDetails = <Accordion summary="Mulai" details={<p>Isi</p>} />;
  const noEventChange = (
    <Accordion
      summary="Mulai"
      details="Isi"
      // @ts-expect-error - onChange event MUI haram (pakai boolean)
      onChange={(_e: unknown, _x: unknown) => {}}
    />
  );
  const noStringExpanded = (
    <Accordion
      summary="Mulai"
      details="Isi"
      // @ts-expect-error - expanded non-boolean bukan kontrak Accordion
      expanded="true"
    />
  );
  const noStyle = (
    <Accordion
      summary="Mulai"
      details="Isi"
      // @ts-expect-error - style milik kit
      style={{ margin: 4 }}
    />
  );
  return {
    ok,
    noNodeSummary,
    noNodeDetails,
    noEventChange,
    noStringExpanded,
    noStyle,
  };
}
