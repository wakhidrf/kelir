import { Button } from "./button";
import type { ButtonProps } from "../kelir-types";

// Type-test negatif (§6b STYLE.md): file .tsx agar JSX ter-parse.
// Kasus spread TIDAK di-type-test (direktif unused = error) — ditutup
// runtime-test, bukan type-test.

// @ts-expect-error — style haram
const s: ButtonProps = { children: "x", style: {} };
// @ts-expect-error — sx haram
const x: ButtonProps = { children: "x", sx: {} };
// @ts-expect-error — className haram
const c: ButtonProps = { children: "x", className: "" };
// @ts-expect-error — slotProps haram
const p: ButtonProps = { children: "x", slotProps: {} };
// @ts-expect-error — classes haram
const k: ButtonProps = { children: "x", classes: {} };
// @ts-expect-error — JSX langsung dengan style ditolak
const j = <Button style={{}}>x</Button>;
// @ts-expect-error — children non-string ditolak (kontrak: string + slot ikon)
const n = <Button>{42}</Button>;

export { Button };
export type { ButtonProps };
