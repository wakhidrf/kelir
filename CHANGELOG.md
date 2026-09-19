# Changelog — Kelir

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