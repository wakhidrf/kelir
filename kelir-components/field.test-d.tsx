import { Field } from "./field";
import { Input } from "./input";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// Field label/helperText slot TEKS; error MAKNA; fullWidth milik kit.
export function fieldContractChecks() {
  const ok = (
    <Field label="Email" helperText="Email valid" error={false}>
      <Input placeholder="name@example.com" />
    </Field>
  );
  const okBare = (
    <Field label="Nama">
      <Input placeholder="Nama lengkap" />
    </Field>
  );

  // @ts-expect-error - label non-string bukan kontrak Field
  const noNodeLabel = <Field label={<b>Email</b>} />;
  // @ts-expect-error - helperText non-string bukan kontrak Field
  const noNodeHelper = <Field helperText={<i>bantuan</i>} />;
  // @ts-expect-error - style milik kit
  const noStyle = <Field label="x" style={{ margin: 4 }} />;
  // @ts-expect-error - fullWidth milik kit (hardcode true)
  const noFullWidth = <Field label="x" fullWidth={false} />;
  return { ok, okBare, noNodeLabel, noNodeHelper, noStyle, noFullWidth };
}
