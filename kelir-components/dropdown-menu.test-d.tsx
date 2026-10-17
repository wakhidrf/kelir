import { DropdownMenu } from "./dropdown-menu";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// DropdownMenu: trigger TEKS + triggerVariant? text|button + items DropdownMenuItem[].
export function dropdownMenuContractChecks() {
  const ok = (
    <DropdownMenu trigger="Aksi" items={[{ label: "Ubah" }]} />
  );
  const okButton = (
    <DropdownMenu
      trigger="Aksi"
      triggerVariant="button"
      items={[{ label: "Ubah" }]}
    />
  );
  const okTruncate = (
    <DropdownMenu
      trigger="Nama berkas yang sangat panjang"
      items={[{ label: "Ubah" }]}
      truncate
      maxWidth={200}
    />
  );

  const noNodeTrigger = (
    <DropdownMenu
      // @ts-expect-error - trigger node bukan kontrak DropdownMenu (pakai string)
      trigger={<button type="button">Aksi</button>}
      items={[{ label: "Ubah" }]}
    />
  );
  const noVariant = (
    <DropdownMenu
      trigger="Aksi"
      // @ts-expect-error - triggerVariant di luar union tertutup text|button
      triggerVariant="link"
      items={[{ label: "Ubah" }]}
    />
  );
  const noRawMaxWidth = (
    <DropdownMenu
      trigger="Aksi"
      items={[{ label: "Ubah" }]}
      // @ts-expect-error - maxWidth non-number haram (data px)
      maxWidth="200px"
    />
  );
  const noStyle = (
    <DropdownMenu
      trigger="Aksi"
      items={[{ label: "Ubah" }]}
      // @ts-expect-error - style milik kit
      style={{ margin: 4 }}
    />
  );
  return { ok, okButton, okTruncate, noNodeTrigger, noVariant, noRawMaxWidth, noStyle };
}
