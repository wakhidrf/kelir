import type { DirectionProps } from "../kelir-types";

// Direction sealed (Gel.3c-6 STYLE.md §6): dir MAKNA; visual inherit milik kit.
export function Direction({ dir, children }: DirectionProps) {
  return (
    <div dir={dir} style={{ direction: dir, fontFamily: "inherit" }}>
      {children}
    </div>
  );
}
