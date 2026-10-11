# Changelog — Kelir

## v7 Contract vs Before

| Feature / Rule | Before v7 | v7 |
|---|---|---|
| Layout primitives (`Stack`/`Grid`/`Spacer`) | Plain wrappers tolerated (interim) | Plain non-kit wrapper = error; `Stack gap?/direction?`, `Grid columns? 1\|2\|3\|4\|6\|12 + gap?`, `Spacer size?` (all `xs\|sm\|md\|lg`) |
| `Skeleton` dimensions | `width`/`height` banned like every component | Recorded exception (not a precedent); `animation` stays a closed status union (`pulse\|wave\|false`) |
| Closed unions | Partial — `Grid`/`Typography`/`Input` still open | Completed: `Grid columns`, `Typography as/level`, `Input type/size` |
| `data-*` attributes | Unregulated styling backdoor | Allowlist `data-testid` only, lint-enforced |
| `Sidebar` responsive | No mode/trigger/height props | `mode auto\|docked\|overlay` (default `auto`), `open?/defaultOpen?/onOpenChange?`, `trigger none\|hamburger\|chevron`, `overlayHeight full\|content`; overlay reuses `Drawer`; content padding 8px, `<` tab 4px |
| `Drawer` paper | Full-height only | `paperHeight full\|auto` (auto wraps content via `fit-content`, no transform); card-like right corners; `aria-label` also on the dialog paper |
| `Button` / `IconButton` | Center-only buttons; shape unregulated | `Button align center\|start`; `IconButton shape rounded\|circle\|square` (default `rounded`); overlay trigger is `primary` |
| Radius tokens | Raw scale at every call site | `css.radius.button/card/surface/prominent` + `css.control.radius`; 67 call sites, zero visual change |
| Test rules | Inside STYLE.md | Moved to `KELIR-TESTING.md`; sealed = `test-d.tsx` + runtime spread-`any` + `axe` per component |
| `Questionnaire` | Single file | 5 SRP modules, zero contract change |
| Generics | Loose | Strict with compatible defaults (`Chart`/`Table`/`Carousel`/`Resizable`) |
| Kit-owned a11y | Ad-hoc | Proven per component: Toast live-region, Dialog trap, focusable Tooltip/Popover triggers, Menu arrows, labeled Command/Questionnaire inputs |
| Screenshot regression | None | `kelir-shots.mjs` (dep-free CDP) + 11-theme baselines + `kelir:shots:check` |

## History

| Date | Change | Verification |
|---|---|---|
| 2026-10-10 | Sidebar responsive + role radius tokens (ISSUE-005/006); follow-ups `notched` (007), trigger variants (008), `paperHeight`/`align` (009), `IconButton shape` (010); overlay `min(..., 50vw)`; hydration: server + first render always docked | `tsc`; test 143/143; drift; guard 0 ERROR; status 69/69 |
| 2026-10-10 | All 69 contracts sealed (Gel.2–Gel.3c-11 + P1b/P1d/P2); breaking: text slots to `string`, no `cloneElement`, semantic event-free handlers, single-pick Combobox, `MessageScroller maxHeight` prop | `tsc`; test 142/142; lint; build; guard; drift; shots 11/11 |
| 2026-09-29 | `Chart`/`DataTable` support `title?` (ISSUE-004) | `tsc`; manual browser check open |
| 2026-09-29 | `"use client"` on all 20 interactive components (ISSUE-003) | `tsc`; manual browser check open |
| 2026-09-28 | Scroll lock off by default on `Select`/`Dialog`/`AlertDialog` (ISSUE-001/002); consumer `MenuProps`/`onOpen` merged, not overwritten | `tsc`; manual browser check open |
| 2026-09-19 | DatePicker popover anchor fix + inline month/year navigation | — |
| 2026-09-01 | `Select` strips internal `notched` prop (React boolean-attribute warning) | Tests pass; `tsc` |
