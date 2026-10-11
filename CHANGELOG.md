## Changelog

| Feature / Rule | Before v7 | v7 |
|---|---|---|
| Page layout | You wrote your own wrappers | Use the kit's `Stack` (`gap`, `direction`), `Grid` (`columns` from a fixed set, `gap`), and `Spacer` (`size`) - plain `div` wrappers are no longer accepted |
| `Skeleton` size | No way to size a loading placeholder | `width`/`height` are allowed on `Skeleton` only; `animation` is `pulse\|wave\|false` |
| Prop values | Some props accepted anything | Fixed choice lists everywhere (`Grid columns`, `Typography as`/`level`, `Input type`/`size`, and more) - see `kelir-types.ts` |
| Test hooks | - | `data-testid` is the only `data-*` attribute you may use |
| `Sidebar` | Fixed sidebar, no options | `mode` (`auto` docks on desktop and overlays on mobile), `triggerVariant` (`none`/`hamburger`/`chevron`), `overlayHeight` (`full`/`auto`); `aria-label` required (nav landmark name) |
| `Drawer` | Always full-height | `height` (`full`, or `auto` to hug the content and center it); rounded card-like edge; a named dialog for screen readers |
| Buttons | Centered text only; free-form icon buttons | `Button align` (`center`/`start`/`end`); `IconButton shape` (`rounded`/`circle`/`square`), always with `aria-label` |
| `Sidebar` trigger prop | `trigger?` | `triggerVariant?` (same union; a button-style union, not a slot) |
| `Drawer` height prop | `paperHeight?` | `height?` (same `full\|auto`) |
| `Sidebar` overlay height | `full\|content` | `full\|auto` |
| `Sidebar` landmark name | `aria-label` optional | `aria-label` required |
| Alignment values | `left\|right` (Button, Card, Typography, Message, Bubble) | `start\|end` (logical values; identical in LTR, correct in RTL) |
| Card content | Fixed content area | Scrollable body via `scrollable?` (default `false`): content scrolls inside, header/footer stay fixed; outer height stays with the consumer |
| Corner radius | - | Corners now follow per-role theme tokens (`button`/`card`/`surface`/`prominent`) - same look today, but each theme can shape them |
| Reliability | - | Every component is covered by type, runtime, and accessibility tests across all 11 themes; `Questionnaire` was split into 5 modules with identical props; stricter generics (`Chart`/`Table`/`Carousel`/`Resizable`) |
| Accessibility | Partial | Built in everywhere: Toast announcements, Dialog focus trap, focusable Tooltip/Popover triggers, Menu arrow keys, labeled inputs |
