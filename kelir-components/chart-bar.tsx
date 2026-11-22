import { css } from "../kelir-kit/kit-create-css";
import { getValue } from "./chart-utils";

const convexShadow = css.shadows.convex;
const seriesColors = [css.colors.primary, css.colors.secondary];

export function BarChart({ rows, seriesKeys, labels, maxValue }: {
  rows: Record<string, unknown>[];
  seriesKeys: string[];
  labels: string[];
  maxValue: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: css.layout.space.sm,
        height: "100%",
      }}
    >
      {rows.map((row, i) => (
        <div
          key={`bar-${labels[i]}`}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            gap: css.layout.space.xs,
            height: "100%",
          }}
        >
          {seriesKeys.map((key, s) => {
            const value = getValue(row, key);
            return (
              <div
                key={key}
                title={`${labels[i]}: ${value}`}
                style={{
                  width: "60%",
                  maxWidth: "24px",
                  height: `${(value / maxValue) * 100}%`,
                  minHeight: "2px",
                  borderRadius: "6px 6px 0 0",
                  backgroundColor: seriesColors[s % seriesColors.length],
                  boxShadow: convexShadow,
                  transition: `height ${css.motion.duration.hover} ${css.motion.easing.curve}`,
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}