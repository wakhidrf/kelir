# Changelog — Kelir

## 2026-09-29 — "use client" untuk semua komponen interaktif (ISSUE-003)

### Fixed
- **ISSUE-003 — DataTable crash di Server Component**: `data-table.tsx` memakai `React.useState` untuk paginasi tanpa direktif `"use client"`, sehingga setiap Server Component yang merendernya langsung crash (`useState only works in Client Components`). Fix: direktif ditambahkan — plus audit Opsi B yang menemukan 19 file hook-pengguna lain juga belum berdirektif (tak satu pun file di `kelir-components` memilikinya). Total 20 file kini diawali `"use client";`: `bubble`, `calendar`, `carousel`, `collapsible`, `command`, `context-menu`, `data-table`, `date-picker`, `dropdown-menu`, `hover-card`, `input-otp`, `menubar`, `message-scroller`, `popover`, `questionnaire`, `resizable`, `select`, `tabs`, `textarea`, dan `kelir-switcher`.

### Verification
- `tsc --noEmit` clean (submodule files typecheck via parent project)
- Manual browser check masih terbuka: render `<DataTable paginated>` dari Server Component, konfirmasi tanpa error dan paginasi tetap berfungsi

## 2026-09-28 — Select/Dialog/AlertDialog: no more layout shift (scroll lock off by default)

### Fixed
- **ISSUE-001 — Select shifted page layout when opened**: MUI `Menu` (Modal-based) enabled scroll lock by default — `overflow: hidden` on `<body>` removed the vertical scrollbar and the whole page jumped sideways. Fix: `Select` now defaults `MenuProps.disableScrollLock` to `true`. Consumer `MenuProps` (including `slotProps.paper`/`list`) are merged with the internal defaults instead of being overwritten, so `disableScrollLock` and menu styling stay controllable from outside. Object slots merge key-by-key (internal style underneath); callback slots `(ownerState) => props` pass through untouched.
- **Select swallowed consumer `onOpen`**: the hardcoded `onOpen` (menu-width measurement) came after `{...props}`, silently dropping any consumer handler. Fix: internal measurement runs first, then the consumer's `onOpen` is called.
- **ISSUE-002 — Dialog/AlertDialog shifted background content**: same scroll-lock root cause. Fix: both default `disableScrollLock` to `true`; override with `disableScrollLock={false}` to restore scroll locking.

### Verification
- `tsc --noEmit` clean (submodule files typecheck via parent project)
- Biome skips `src/views/kelir` by config — no lint signal for these files
- Manual browser check still open: open/close on a scrollbar page (Chrome + Firefox, 1280px + 390px), confirm no shift and no visual regression

## 2026-09-19 — DatePicker: fix unopenable popover + inline month/year navigation

### Fixed
- **DatePicker popover never opened**: `e.currentTarget` was read inside the `setAnchorEl` updater. Because `setViewDate()` is called first in the same handler, React skips eager evaluation and runs the updater later during render, when the event's `currentTarget` is no longer valid — the anchor stayed `null`, so clicking the trigger showed no calendar and no error. Fix: capture the target synchronously (same pattern as `popover.tsx`).

### Added
- **Inline month/year navigation**: the header labels (e.g. "September ▾", "2026 ▾") toggle a 3×4 month grid and a scrollable year list (current year ± 30, auto-scrolled to the active year) inside the same popover. Selecting an option returns to the day view. The ‹ › month-stepping arrows are unchanged. Deliberately inline instead of nested `Select` dropdowns — a nested menu (z-index `modal`) would render beneath the calendar popover (`modal + 1`) and be unclickable.

## 2026-09-01 — Fix: suppress 'notched' boolean attribute warning in Select

### Fixed
- **Select component**: Destructure `notched` prop to prevent React 18+ warning about boolean attributes passed to native DOM elements.

### Details
MUI's `Select` with outlined variant internally uses a `notched` boolean prop for the label notch. When Kelir's `Select` spreads all props (`...props`) to `MuiSelect`, this internal prop reaches the native `<input>` element, causing React to warn:

```
Received `true` for a non-boolean attribute `notched`.
If you want to write it to the DOM, pass a string instead: notched="true" or notched={value.toString()}.
```

**Fix**: Explicitly destructure `notched` in the component signature so it's consumed and not forwarded.

```tsx
// Before
export function Select({ options, style, ...props }: SelectProps) { ... }

// After
export function Select({ options, style, notched, ...props }: SelectProps) { ... }
```

### Verification
- No more console warnings when using `Select` with outlined variant
- All existing tests pass
- TypeScript compilation clean