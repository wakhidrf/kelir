import { css } from "../kelir-kit/kit-create-css";
import { getValue } from "./chart-utils";

const seriesColors = [css.colors.primary, css.colors.secondary];

export function LineChart({ rows, seriesKeys, maxValue, type }: {
  rows: Record<string, unknown>[];
  seriesKeys: string[];
  maxValue: number;
  type: string;
}) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 100 50"
      preserveAspectRatio="none"
      style={{ display: "block", overflow: "visible" }}
    >
      <title>Data chart</title>
      {seriesKeys.map((key, s) => {
        const color = seriesColors[s % seriesColors.length];
        const points = rows
          .map((row, i) => {
            const value = getValue(row, key);
            const x = rows.length === 1 ? 50 : (i / (rows.length - 1)) * 100;
            const y = 50 - (value / maxValue) * 45;
            return `${x},${y}`;
          })
          .join(" ");
        const areaPoints =
          rows.length === 1 ? `50,50 ${points} 50,50` : `0,50 ${points} 100,50`;
        return (
          <g key={key}>
            {type === "area" && (
              <polygon points={areaPoints} fill={color} opacity={0.25} />
            )}
            <polyline
              points={points}
              fill="none"
              stroke={color}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        );
      })}
    </svg>
  );
}