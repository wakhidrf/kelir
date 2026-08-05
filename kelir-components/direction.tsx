import type { DirectionProps } from "../kelir-types";

export function Direction({ dir, children, style, ...props }: DirectionProps) {
  return (
    <div
      {...props}
      dir={dir}
      style={{
        direction: dir,
        fontFamily: "inherit",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
