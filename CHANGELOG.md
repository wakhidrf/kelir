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
| Button sizes | One fixed size | `Button`/`IconButton size?` (`sm\|md\|lg`, default `md` = today): tighter/wider padding + ~18px/~28px icons for narrow drawers - closed union, no free numbers |
| Sidebar docked padding | Docked content flush to the frame | Docked now has the same sm inner padding as overlay (sealed consumers could not add it); overlay unchanged |
| Menu trigger affordance | Text-only trigger reads as a label | `DropdownMenu triggerVariant?` (`text\|button`, default `text`): `button` renders a kit outline Button trigger; behavior identical |
| App-shell bar variants | `TopBar` always a surface slab | `TopBar variant?` (`raised\|flat`, default `raised`): `raised` is now a proper Kelir surface (surface + bottom border + shadow); `flat` is a transparent in-content action row; layout identical |
| AI assistants | Agents read dozens of files to learn the contract | Experimental MCP server in `kelir-mcp/` (local stdio, read-only catalog; suggestions and checks planned next) |
| Loading overlay | DIY dim overlay from plain divs + tokens | `LoadingOverlay` (`open` required, `label?`/`progress?` text, `children?` media slot): kit-pulsed center card, kit-owned accessible name, no dismiss |
| Long table cells | DIY ellipsis wrappers that cannot pierce kit-owned menu triggers | `TruncatedText` (`text` required, `maxWidth?` px data, full text on hover) + `ContextMenu`/`DropdownMenu truncate?` (default `false`; text variant only, full text on hover) |
| Sidebar docked edges | Flush viewport edge keeps all four corners rounded + full border | Screen-side corners zeroed via logical props (RTL-safe) + no screen-side border; content side keeps the radius token |
| Sidebar mobile overlay | Overlay caps at half the screen | `min(SIDEBAR_WIDTH, 75vw)` - up to three-quarters of the screen |
| Large avatars | `Avatar size` topped out at large | `Avatar size?` gains `xl` (96px), matching the `Image`/`Tile` top size |
| Card overflow | Cards always clipped their edges | `Card overflow?` (`hidden\|visible`, default `hidden`); `scrollable` cards still clip so the body can scroll |
| Narrow menu triggers | Truncated triggers could look cramped or over-wide | `ContextMenu`/`DropdownMenu maxWidth?` (px data; applies to the truncated trigger) |
| Toast emphasis | Every toast looked the same | `Toast tone?` (`info\|success\|warning\|error`): a left-edge accent strip from kit/status tokens; without `tone` it stays neutral |
| Responsive layout | Per-breakpoint layout meant your own CSS or hooks | `Stack directionMd?`, `Container paddingBlockMd?`, `Typography variantMd?`: one kit breakpoint (768px) applied at `>=768px`, values from existing closed unions |
| Responsive images | Fluid hero/media needed a hand-rolled wrapper | `Image fluid?` (fills the container width, auto height) and `maxHeight?` (from the size scale) |
| Reserved space | Fixed-height areas for async/third-party content needed inline styles | `Stack minHeight?` from the space scale (`xs`..`4xl`), default none |
| AI assistants (suggest) | Agents still guessed which kit component fit | MCP `suggest` tool (v1.1): plain-language wish to ranked sealed candidates, with a contract reminder; catalog-only, never a self-assembled component |
| Kit consistency gates | The kit repo had no checks of its own | `STYLE.md`-dependent gates run from the host project and now fail with a clear message when run from a bare kit checkout; the kit runs a parse check in CI |
| Full-screen sections | One-screen heroes/interstitials needed hand-rolled viewport heights | `Stack minHeight?` gains `screen` (100dvh); pair with `Container` for a centered, width-capped column |
| Large + capped media | Media sizes topped out at 96px and fluid media could not be capped | `Image height?`/`maxHeight?` gain `2xl`..`7xl` (128..400px); `Image maxWidth?` caps fluid width in px data |
| Wide-screen order | Swapping child order per breakpoint needed your own CSS | `Stack reverseMd?` (default `false`): reverses child order at `>=768px`, on top of `directionMd ?? direction` |
| Inline decorated headings | Styled words inside one heading meant nested elements | `Typography segments?`: inline token-styled spans (muted/primary tone, small scale, line break) inside one heading element |
| Framed floating logos | A rounded framed logo over a card needed a hand-built box | `Avatar frame?` (surface fill + thick primary ring + padding) and `FlexItem offsetY?` (`sm\|md\|lg`, token-based upward pull) |
| AI slop filter | Agents shipped generic AI UI, copy, and comments, and the kit could not say no | MCP anti-slop filter (v1.2): a pinned, offline mirror of the anti-slop rulebook (`kelir://antislop` + per-skill), a deterministic `audit` tool, and anti-slop notes in `suggest` |
| Anti-slop gate | The filter only audited snippets an agent chose to submit; nothing failed a build | `scripts/kelir-slop.mjs` runs in the host CI (`npm run kelir:slop:strict`): it scans the host files that import Kelir plus the kit's own internals with the same pinned matchers as the MCP `audit` tool, prints `file:line` on every ERROR, and honours an explicit `kelir-allow: slop` on a line or the line above it |
| Anti-slop precision | Real product words and icon glyphs were flagged as shouting or as decorative emoji | Document names and technical tokens (`STYLE`, `README`, `CHANGELOG`, `LICENSE`, `CRLF`, `IDR`, and other standard acronyms) are no longer read as emphasis; the check glyphs `✓`/`✔` are treated as icons, not decoration |
| Code, quotes, and lists in prose | Fenced blocks, blockquotes, and lists meant DIY markup plus raw styles | `CodeBlock` (`code` required, `language?`, kit-owned copy button and clipboard fallback), `Quote` (kit-owned accent bar, surface, radius), and `List` (`items`, `ordered?`, kit-owned markers and spacing) |
| Compact segmented switches | The toggle group was one chunky row of raised buttons with 6px padding and 8px gaps | `ToggleGroup variant?` (`separated` default, unchanged; `joined` = one compact pill with flush, transparent idle segments and a primary active segment) |
