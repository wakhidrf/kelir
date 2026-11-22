# Changelog

## [7.0.0] - 2026-11-22

### Added
- You can pick from eleven design themes and re-skin the whole app at once, with no code changes.
- 86 ready-to-use components - buttons, forms, tables, dialogs, and layout - all follow the active theme automatically.
- Every component is accessible from the start: keyboard navigation, focus traps in dialogs, and screen-reader announcements.
- You can set your own brand font and two brand colors without touching component code.
- Theme fonts are hosted with the kit and loaded only when used, so the first visit is fast and calls no font CDN.
- You can copy a code block with one click and show a short notification across the app from a single line.
- Images are responsive and lazy by default, with a reserved box so the layout does not shift while they load.
- Public pages can stay static (cached on a CDN) while still showing the right theme, thanks to a browser-side theme mode.

### Improved
- Each component's values are now fixed, documented choices, so the look stays consistent and is hard to get wrong.
- Long text can be truncated with a clean ellipsis, and cards can scroll without shifting the header or footer.
- Responsive layout is now a component concern, so you no longer write your own media queries.
- Direction is now logical (start/end), so it reads correctly in both left-to-right and right-to-left text.

### Fixed
- The neumorphism theme now uses the system font its design calls for.
- Headings, quotes, and lists now sit neatly inside paragraph text.