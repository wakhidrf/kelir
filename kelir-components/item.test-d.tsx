import { Avatar } from "./avatar";
import { Button } from "./button";
import { Item } from "./item";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// Item title/description slot TEKS; media/action slot sealed.
export function itemContractChecks() {
  const ok = (
    <Item
      title="Headphones"
      description="Noise cancelling"
      media={<Avatar fallbackText="W" />}
      action={<Button variant="outline">Detail</Button>}
    />
  );

  // @ts-expect-error - title non-string bukan kontrak Item
  const noNodeTitle = <Item title={<b>Tebal</b>} />;
  // @ts-expect-error - description non-string bukan kontrak Item
  const noNodeDesc = <Item title="x" description={<i>Miring</i>} />;
  // @ts-expect-error - style milik kit
  const noStyle = <Item title="x" style={{ margin: 4 }} />;
  return { ok, noNodeTitle, noNodeDesc, noStyle };
}
