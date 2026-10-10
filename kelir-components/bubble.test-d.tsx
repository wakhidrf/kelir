import { Bubble } from "./bubble";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// Bubble: variant/align MAKNA; reactions string[]; children slot isi.
export function bubbleContractChecks() {
  const ok = <Bubble variant="sent">Siap dikirim.</Bubble>;

  const noBadVariant = (
    <Bubble
      // @ts-expect-error - variant di luar union bukan kontrak Bubble
      variant="system"
    >
      Isi
    </Bubble>
  );
  const noBadAlign = (
    <Bubble
      // @ts-expect-error - align di luar union bukan kontrak Bubble
      align="center"
    >
      Isi
    </Bubble>
  );
  const noNumberReactions = (
    <Bubble
      // @ts-expect-error - reactions number[] bukan kontrak Bubble
      reactions={[1, 2]}
    >
      Isi
    </Bubble>
  );
  const noStyle = (
    <Bubble
      // @ts-expect-error - style milik kit
      style={{ margin: 4 }}
    >
      Isi
    </Bubble>
  );
  return { ok, noBadVariant, noBadAlign, noNumberReactions, noStyle };
}
