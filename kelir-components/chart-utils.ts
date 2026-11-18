type ChartRow = Record<string, unknown>;

export function getSeriesLabel(
  row: ChartRow,
  dataKey: string,
  fallback: string,
  index: number,
) {
  const raw = row[dataKey];
  if (raw !== undefined && raw !== null && raw !== "") return String(raw);
  return fallback || String(index);
}

export function getValue(row: ChartRow, key: string) {
  return typeof row[key] === "number" ? (row[key] as number) : 0;
}