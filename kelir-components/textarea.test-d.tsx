import { Textarea } from "./textarea";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// Textarea onChange semantik (string, preseden Input); focus milik kit.
export function textareaContractChecks() {
  const ok = (
    <Textarea
      label="Message"
      placeholder="Type here..."
      value="hi"
      onChange={() => {}}
    />
  );
  const okBare = <Textarea rows={4} disabled />;

  const noEvent = (
    <Textarea
      // @ts-expect-error - onChange event haram (pakai string)
      onChange={(_e: unknown, _v: unknown) => {}}
    />
  );
  // @ts-expect-error - label non-string bukan kontrak Textarea
  const noNodeLabel = <Textarea label={<b>Pesan</b>} />;
  // @ts-expect-error - onFocus passthrough haram (focus milik kit)
  const noFocus = <Textarea onFocus={() => {}} />;
  // @ts-expect-error - style milik kit
  const noStyle = <Textarea style={{ margin: 4 }} />;
  return { ok, okBare, noEvent, noNodeLabel, noFocus, noStyle };
}
