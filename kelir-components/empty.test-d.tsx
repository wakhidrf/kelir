import { Button } from "./button";
import { Empty } from "./empty";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// Empty title/description slot TEKS; action/icon slot ReactNode.
export function emptyContractChecks() {
  const ok = (
    <Empty
      title="No results found"
      description="Try adjusting your search."
      action={<Button variant="primary">Clear search</Button>}
    />
  );
  const okBare = <Empty />;

  // @ts-expect-error - title non-string bukan kontrak Empty
  const noNodeTitle = <Empty title={<b>Kosong</b>} />;
  // @ts-expect-error - description non-string bukan kontrak Empty
  const noNodeDesc = <Empty description={<i>desc</i>} />;
  // @ts-expect-error - style milik kit
  const noStyle = <Empty style={{ padding: "8px" }} />;
  return { ok, okBare, noNodeTitle, noNodeDesc, noStyle };
}
