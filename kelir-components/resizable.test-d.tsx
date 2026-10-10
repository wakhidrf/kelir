import { Resizable } from "./resizable";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// Resizable: panels slot[] + directions MAKNA.
export function resizableContractChecks() {
  const ok = (
    <Resizable panels={[<p key="a">A</p>, <p key="b">B</p>]} />
  );

  // Generik ketat (P2): panel string mengalir ke panels.
  const typed = <Resizable<string> panels={["A", "B"]} />;
  const noWrongPanel = (
    // @ts-expect-error - panel number bukan string
    <Resizable<string> panels={["A", 2]} />
  );

  const noBadDirections = (
    <Resizable
      panels={[<p key="a">A</p>]}
      // @ts-expect-error - directions di luar union bukan kontrak Resizable
      directions="diagonal"
    />
  );
  const noStyle = (
    <Resizable
      panels={[<p key="a">A</p>]}
      // @ts-expect-error - style milik kit
      style={{ margin: 4 }}
    />
  );
  return { ok, typed, noWrongPanel, noBadDirections, noStyle };
}
