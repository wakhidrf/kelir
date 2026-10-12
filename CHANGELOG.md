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
| Stack alignment | Direction + gap only | `align?` (`start\|center\|end\|stretch`, default `stretch`) and `justify?` (`start\|center\|end\|space-between`, default `start`) — closed logical unions, no visual change by default |
| Typography truncation | DIY ellipsis wrappers | `truncate?` (default `false`): single-line ellipsis owned by the kit |
| Page width | DIY maxWidth wrappers | `Container` (`maxWidth?` `sm\|md\|lg\|xl`, `padding?` from layout space) — pure layout, no color/border/shadow |
| Logo/media images | Raw `<img>` with objectFit | `Image` (`src`, `alt?`, `height?`, `fit?` `contain\|cover`, `radius?`) — neutral, no shadow/border by default |
| Row wraps | DIY flex-wrap wrappers | `Stack wrap?` (default `false`) - wrapping rows/columns owned by the kit |
| Flex items | DIY `flex: 1` / `flexShrink: 0` / `overflow: hidden` wrappers | `FlexItem` (`grow?`, `shrink?`, `clip?` for flex-row truncation with `grow`) - closed booleans, no free numbers; default is a plain block |
| Page width, vertical | DIY vertical padding + overflow wrappers | `Container paddingBlock?` (`none\|sm\|md\|lg\|xl\|2xl`, default `none`) and `clip?` (default `false`) from the same space scale |
| App shell | Rewritten viewport shell per app | `Shell` (row or `stacked?`), `Content` (single scroll area, responsive padding, background), `TopBar` (`left?`/`right?`, surface) - pure layout, no custom color/border/shadow |
| Icon/logo tiles | DIY padded boxes | `Tile` (`tone?` `primary\|secondary\|plain`, `size?` `sm\|md\|lg` to kit-owned px; without size a flexible icon tile) |
| Status banners + card flags | DIY tinted banners, absolute strips | `Banner` (`tone?` `danger\|warn\|neutral`) with inheriting text; `Card flag?` (`danger\|warn`, absolute side strip, default none) |
| Long links, verification codes | DIY break-all / letter-spacing wrappers | `Typography breakAll?` (default `false`) and `tracking?` (`normal\|wide`, kit-owned 6px loose spacing) |
| Inline links | Raw `<a>` with `style=` | `Link` (`href` required, `children` text, `external?` for new-tab icon + target + rel) - textPrimary, no underline |
| Corner radius | - | Corners now follow per-role theme tokens (`button`/`card`/`surface`/`prominent`) - same look today, but each theme can shape them |
| Reliability | - | Every component is covered by type, runtime, and accessibility tests across all 11 themes; `Questionnaire` was split into 5 modules with identical props; stricter generics (`Chart`/`Table`/`Carousel`/`Resizable`) |
| Accessibility | Partial | Built in everywhere: Toast announcements, Dialog focus trap, focusable Tooltip/Popover triggers, Menu arrow keys, labeled inputs |
