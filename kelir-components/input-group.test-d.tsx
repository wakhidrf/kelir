import { Input } from "./input";
import { InputGroup } from "./input-group";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// InputGroup prefix/suffix slot TEKS; children kontrol.
export function inputGroupContractChecks() {
  const ok = (
    <InputGroup prefix="https://" suffix="✓">
      <Input placeholder="example.com" />
    </InputGroup>
  );

  const noNodePrefix = (
    <InputGroup
      // @ts-expect-error - prefix non-string bukan kontrak InputGroup
      prefix={<span>https://</span>}
    >
      <Input placeholder="x" />
    </InputGroup>
  );
  const noStyle = (
    <InputGroup
      // @ts-expect-error - style milik kit
      style={{ margin: 4 }}
    >
      <Input placeholder="x" />
    </InputGroup>
  );
  return { ok, noNodePrefix, noStyle };
}
