# Changelog — Kelir

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