// kelir-report.mjs - shared console table reporter for the Kelir gates.
//
// Uniform output across the six gates (kelir-alias, kelir-bury, kelir-split,
// kelir-guard, kelir-hunt, kelir-slop) so every run reads the same way
// (issue #114). Each gate builds normalized rows:
//   { level, location, rule, message, suggestion }
// and calls printReport with its counts + scope metrics.

const ANSI = /\x1b\[[0-9;]*m/g;
export const RESET = "\x1b[0m";
export const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";

const plain = (s) => String(s).replace(ANSI, "");
const pad = (s, w) => s + " ".repeat(Math.max(0, w - plain(s).length));
const oneLine = (s) => String(s).replace(/\s+/g, " ").trim();

function renderTable(columns, rows, emptyText) {
  const widths = columns.map((c) =>
    Math.max(
      plain(c.label).length,
      ...rows.map((r) => plain(String(r[c.key] ?? "")).length),
    ),
  );
  const divider = widths.map((w) => "-".repeat(w)).join("-+-");
  console.log(columns.map((c, i) => pad(c.label, widths[i])).join(" | "));
  console.log(DIM + divider + RESET);
  if (rows.length === 0) {
    console.log(DIM + (emptyText ?? "(none)") + RESET);
    return;
  }
  for (const row of rows) {
    console.log(
      columns
        .map((c, i) => pad(oneLine(row[c.key] ?? ""), widths[i]))
        .join(" | "),
    );
  }
}

const LEVEL_COLOR = { ERROR: RED, WARN: YELLOW, ALLOW: CYAN };

export function printTable(columns, rows, emptyText) {
  renderTable(columns, rows, emptyText);
}

export function printReport({
  gate,
  version,
  status,
  counts,
  rows,
  columns,
  scope,
  emptyText,
}) {
  console.log(BOLD + `${gate} v${version}` + RESET);
  console.log("");

  // FIXED only appears when a gate actually rewrote something (--fix), so the
  // header stays identical for every other run.
  renderTable(
    [
      { key: "gate", label: "GATE" },
      { key: "status", label: "STATUS" },
      { key: "errors", label: "ERRORS" },
      { key: "warnings", label: "WARNINGS" },
      { key: "allowed", label: "ALLOWED" },
      ...(counts.fixed ? [{ key: "fixed", label: "FIXED" }] : []),
    ],
    [
      {
        gate,
        status:
          status === "OK" ? GREEN + "OK" + RESET : RED + String(status) + RESET,
        errors: counts.error ?? 0,
        warnings: counts.warn ?? 0,
        allowed: counts.allow ?? 0,
        fixed: counts.fixed ?? 0,
      },
    ],
  );

  console.log("");
  console.log(BOLD + "FINDINGS" + RESET);
  renderTable(
    columns ?? [
      { key: "level", label: "LEVEL" },
      { key: "location", label: "LOCATION" },
      { key: "rule", label: "RULE" },
      { key: "message", label: "MESSAGE" },
      { key: "suggestion", label: "SUGGESTION" },
    ],
    rows.map((row) => {
      const color = LEVEL_COLOR[row.level];
      return color ? { ...row, level: color + row.level + RESET } : row;
    }),
    emptyText ?? "(none)",
  );

  if (scope && Object.keys(scope).length > 0) {
    console.log("");
    console.log(BOLD + "SCOPE" + RESET);
    renderTable(
      [
        { key: "label", label: "METRIC" },
        { key: "value", label: "VALUE" },
      ],
      Object.entries(scope).map(([label, value]) => ({ label, value })),
    );
  }
}