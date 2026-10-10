import { MessageScroller } from "./message-scroller";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// MessageScroller: children slot + onLoadMore/hasMore/maxHeight PERILAKU.
export function messageScrollerContractChecks() {
  const ok = (
    <MessageScroller maxHeight="200px">
      <p>Hai</p>
    </MessageScroller>
  );

  const noEventLoadMore = (
    <MessageScroller
      // @ts-expect-error - onLoadMore event haram (tanpa argumen)
      onLoadMore={(_e: unknown, _x: unknown) => {}}
    >
      <p>Hai</p>
    </MessageScroller>
  );
  const noStyle = (
    <MessageScroller
      // @ts-expect-error - style milik kit
      style={{ padding: 12 }}
    >
      <p>Hai</p>
    </MessageScroller>
  );
  const noClassName = (
    <MessageScroller
      // @ts-expect-error - className milik kit
      className="gulir"
    >
      <p>Hai</p>
    </MessageScroller>
  );
  return { ok, noEventLoadMore, noStyle, noClassName };
}
