import { Carousel } from "./carousel";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// Carousel: items slot[] + autoPlay/interval PERILAKU.
export function carouselContractChecks() {
  const ok = (
    <Carousel items={[<p key="1">Satu</p>, <p key="2">Dua</p>]} autoPlay />
  );

  // Generik ketat (P2): item string mengalir ke items.
  const typed = <Carousel<string> items={["Satu", "Dua"]} />;
  const noWrongItem = (
    // @ts-expect-error - item number bukan string
    <Carousel<string> items={["Satu", 2]} />
  );

  // @ts-expect-error - items string bukan kontrak Carousel (pakai array)
  const noStringItems = <Carousel items="satu" />;
  const noStringInterval = (
    <Carousel
      items={[<p key="1">Satu</p>]}
      // @ts-expect-error - interval string bukan kontrak Carousel
      interval="3000"
    />
  );
  const noStyle = (
    <Carousel
      items={[<p key="1">Satu</p>]}
      // @ts-expect-error - style milik kit
      style={{ margin: 4 }}
    />
  );
  return { ok, typed, noWrongItem, noStringItems, noStringInterval, noStyle };
}
