import { IconButton } from "./icon-button";
import type { IconButtonProps } from "../kelir-types";

// Type-test negatif (§6b STYLE.md): file .tsx agar JSX ter-parse (dipisah
// dari button.test-d.tsx — konvensi 1:1 agar generator status jujur).

// @ts-expect-error — aria-label wajib
const m = <IconButton icon={<span>x</span>} />;
// @ts-expect-error — className haram
const q: IconButtonProps = { icon: "x", "aria-label": "y", className: "" };
// @ts-expect-error — style haram
const s: IconButtonProps = { icon: "x", "aria-label": "y", style: {} };
// @ts-expect-error — JSX langsung dengan style ditolak
const j = <IconButton icon={<span>x</span>} aria-label="y" style={{}} />;

export { IconButton };
export type { IconButtonProps };
