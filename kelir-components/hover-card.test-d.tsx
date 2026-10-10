import { HoverCard } from "./hover-card";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// HoverCard: trigger slot jangkar + children slot isi.
export function hoverCardContractChecks() {
  const ok = (
    <HoverCard trigger={<span>Rania</span>}>
      <p>Profil</p>
    </HoverCard>
  );

  const noStringTrigger = (
    <HoverCard
      // @ts-expect-error - trigger string bukan kontrak HoverCard (butuh elemen jangkar)
      trigger="Rania"
    >
      <p>Profil</p>
    </HoverCard>
  );
  const noStyle = (
    <HoverCard
      trigger={<span>Rania</span>}
      // @ts-expect-error - style milik kit
      style={{ margin: 4 }}
    >
      <p>Profil</p>
    </HoverCard>
  );
  return { ok, noStringTrigger, noStyle };
}
