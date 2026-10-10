import { Command } from "./command";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// Command: placeholder TEKS + groups CommandGroup[].
export function commandContractChecks() {
  const ok = (
    <Command
      placeholder="Cari"
      groups={[{ heading: "Umum", items: [{ label: "Buka", value: "buka" }] }]}
    />
  );

  const noBadGroup = (
    <Command
      groups={[
        {
          heading: "Umum",
          items: [
            // @ts-expect-error - item tanpa value bukan kontrak CommandItem
            {
              label: "Buka",
            },
          ],
        },
      ]}
    />
  );
  const noStyle = (
    <Command
      groups={[{ heading: "Umum", items: [{ label: "Buka", value: "buka" }] }]}
      // @ts-expect-error - style milik kit
      style={{ margin: 4 }}
    />
  );
  return { ok, noBadGroup, noStyle };
}
