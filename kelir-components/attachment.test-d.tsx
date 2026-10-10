import { Attachment } from "./attachment";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// Attachment: name TEKS; status union; progress angka; onRemove tanpa argumen.
export function attachmentContractChecks() {
  const ok = <Attachment name="laporan.pdf" size="2 MB" status="success" />;

  // @ts-expect-error - name node bukan kontrak Attachment
  const noNodeName = <Attachment name={<b>laporan.pdf</b>} />;
  const noBadStatus = (
    <Attachment
      name="laporan.pdf"
      // @ts-expect-error - status di luar union bukan kontrak Attachment
      status="pending"
    />
  );
  const noStringProgress = (
    <Attachment
      name="laporan.pdf"
      status="uploading"
      // @ts-expect-error - progress string bukan kontrak Attachment
      progress="70"
    />
  );
  const noEventRemove = (
    <Attachment
      name="laporan.pdf"
      // @ts-expect-error - onRemove event haram (tanpa argumen)
      onRemove={(_e: unknown, _x: unknown) => {}}
    />
  );
  const noStyle = (
    <Attachment
      name="laporan.pdf"
      // @ts-expect-error - style milik kit
      style={{ margin: 4 }}
    />
  );
  return {
    ok,
    noNodeName,
    noBadStatus,
    noStringProgress,
    noEventRemove,
    noStyle,
  };
}
