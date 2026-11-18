import type { ChartProps } from "../kelir-types";
import { css } from "../kelir-variants";
import { getSeriesLabel, getValue } from "./chart-utils";
import { BarChart } from "./chart-bar";
import { LineChart } from "./chart-line";

const convexShadow = css.shadows.convex;
const neumorphicBg = css.colors.surface;
const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;

type ChartRow = Record<string, unknown>;

export function Chart<TDatum extends object = ChartRow>({
  data,
  categories,
  dataKey,
  type = "bar",
  title,
}: ChartProps<TDatum>) {
  const rows = data as ChartRow[];
  const first = rows[0] ?? {};
  const categoriesAreSeries =
    categories.length > 0 &&
    categories.every((c) => typeof first[c] === "number");

  const seriesKeys = categoriesAreSeries ? categories : [dataKey];
  const labels = rows.map((row, i) =>
    categoriesAreSeries ? getSeriesLabel(row, dataKey, "", i) : (categories[i] ?? String(i)),
  );
  const allValues = rows.flatMap((row) =>
    seriesKeys.map((key) => getValue(row, key)),
  );
  const maxValue = Math.max(1, ...allValues);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: css.layout.space.md,
        backgroundColor: neumorphicBg,
        borderRadius: css.radius.card,
        boxShadow: convexShadow,
        border: `1px solid ${css.border.light}`,
        padding: css.layout.space.lg,
        color: textPrimary,
        fontFamily: "inherit",
      }}
    >
      {title && (
        <div
          style={{
            fontWeight: 700,
            color: textPrimary,
            marginBottom: css.layout.space.sm,
            fontFamily: "inherit",
          }}
        >
          {title}
        </div>
      )}
      <div style={{ position: "relative", height: 180 }}>
        {type === "bar" ? (
          <BarChart rows={rows} seriesKeys={seriesKeys} labels={labels} maxValue={maxValue} />
        ) : (
          <LineChart rows={rows} seriesKeys={seriesKeys} maxValue={maxValue} type={type} />
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