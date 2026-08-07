import { Fragment } from "react";
import type { ChartProps } from "../kelir-types";
import { css } from "../kelir-variants";

const convexShadow = css.shadows.convex;
const neumorphicBg = css.colors.surface;
const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;
const seriesColors = [css.colors.primary, css.colors.secondary];

type ChartRow = Record<string, unknown>;

function getSeriesLabel(
  row: ChartRow,
  dataKey: string,
  fallback: string,
  index: number,
) {
  const raw = row[dataKey];
  if (raw !== undefined && raw !== null && raw !== "") return String(raw);
  return fallback || String(index);
}

function getValue(row: ChartRow, key: string) {
  return typeof row[key] === "number" ? (row[key] as number) : 0;
}

export function Chart({
  data,
  categories,
  dataKey,
  type = "bar",
  ...props
}: ChartProps) {
  const rows = data as ChartRow[];
  const first = rows[0] ?? {};
  const categoriesAreSeries =
    categories.length > 0 &&
    categories.every((c) => typeof first[c] === "number");

  const seriesKeys = categoriesAreSeries ? categories : [dataKey];
  const labels = rows.map((row, i) =>
    categoriesAreSeries
      ? getSeriesLabel(row, dataKey, "", i)
      : (categories[i] ?? String(i)),
  );
  const allValues = rows.flatMap((row) =>
    seriesKeys.map((key) => getValue(row, key)),
  );
  const maxValue = Math.max(1, ...allValues);

  const plotHeight = 180;

  return (
    <div
      {...props}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: css.layout.space.md,
        backgroundColor: neumorphicBg,
        borderRadius: css.radius.sm,
        boxShadow: convexShadow,
        border: `1px solid ${css.border.light}`,
        padding: css.layout.space.lg,
        color: textPrimary,
        fontFamily: "inherit",
        ...props.style,
      }}
    >
      <div style={{ position: "relative", height: plotHeight }}>
        {type === "bar" ? (
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
        ) : (
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 50"
            preserveAspectRatio="none"
            style={{ display: "block", overflow: "visible" }}
          >
            <title>Grafik data</title>
            {seriesKeys.map((key, s) => {
              const color = seriesColors[s % seriesColors.length];
              const points = rows
                .map((row, i) => {
                  const value = getValue(row, key);
                  const x =
                    rows.length === 1 ? 50 : (i / (rows.length - 1)) * 100;
                  const y = 50 - (value / maxValue) * 45;
                  return `${x},${y}`;
                })
                .join(" ");
              const areaPoints =
                rows.length === 1
                  ? `50,50 ${points} 50,50`
                  : `0,50 ${points} 100,50`;
              return (
                <Fragment key={key}>
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
                </Fragment>
              );
            })}
          </svg>
        )}
      </div>
      <div style={{ display: "flex", gap: css.layout.space.sm }}>
        {labels.map((label) => (
          <div
            key={`label-${String(label)}`}
            style={{
              flex: 1,
              textAlign: "center",
              fontSize: "11px",
              color: textSecondary,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
