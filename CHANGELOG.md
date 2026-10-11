# Changelog — Kelir

## v7 vs Before

| Feature / Rule | Before v7 | v7 |
|---|---|---|
| Page layout | You wrote your own wrappers | Use the kit's `Stack` (`gap`, `direction`), `Grid` (`columns` from a fixed set, `gap`), and `Spacer` (`size`) — plain `div` wrappers are no longer accepted |
| `Skeleton` size | No way to size a loading placeholder | `width`/`height` are allowed on `Skeleton` only; `animation` is `pulse\|wave\|false` |
| Prop values | Some props accepted anything | Fixed choice lists everywhere (`Grid columns`, `Typography as`/`level`, `Input type`/`size`, and more) — see `kelir-types.ts` |
| Test hooks | — | `data-testid` is the only `data-*` attribute you may use |
| `Sidebar` | Fixed sidebar, no options | `mode` (`auto` docks on desktop and overlays on mobile), `trigger` (`none`/`hamburger`/`chevron`), `overlayHeight` (`full`/`content`) |
| `Drawer` | Always full-height | `paperHeight` (`full`, or `auto` to hug the content and center it); rounded card-like edge; a named dialog for screen readers |
| Buttons | Centered text only; free-form icon buttons | `Button align` (`center`/`start`); `IconButton shape` (`rounded`/`circle`/`square`), always with `aria-label` |
| Corner radius | — | Corners now follow per-role theme tokens (`button`/`card`/`surface`/`prominent`) — same look today, but each theme can shape them |
| Reliability | — | Every component is covered by type, runtime, and accessibility tests across all 11 themes; `Questionnaire` was split into 5 modules with identical props; stricter generics (`Chart`/`Table`/`Carousel`/`Resizable`) |
| Accessibility | Partial | Built in everywhere: Toast announcements, Dialog focus trap, focusable Tooltip/Popover triggers, Menu arrow keys, labeled inputs |

## History

| Date | Change | What it means for you |
|---|---|---|
| 2026-10-10 | Responsive Sidebar + per-role radius tokens, plus follow-up fixes (`Select`, trigger variants, `Drawer` height, button alignment, `IconButton` shape) | Sidebars adapt to mobile on their own; everything else looks the same — no action needed |
| 2026-10-10 | All 69 component contracts locked. Breaking: text slots are now plain `string`, handlers carry no event objects, Combobox picks a single value, `MessageScroller` takes `maxHeight` | Check your custom render props and event arguments when upgrading |
| 2026-09-29 | `Chart` and `DataTable` accept an inline `title?` | You can drop the extra `<Card title>` wrapper |
| 2026-09-29 | All interactive components work inside Server Components | Import them anywhere; keep `"use client"` only in your own interactive files |
| 2026-09-28 | Opening `Select`/`Dialog`/`AlertDialog` no longer shifts the page layout | Nothing to do — this is default behavior now |
| 2026-09-19 | DatePicker opens reliably, with inline month/year picking | Nothing to do |
| 2026-09-01 | `Select` no longer logs a React warning | Nothing to do |
