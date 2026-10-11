# Changelog — Kelir

## 2026-10-10 — Sidebar responsif + token radius peran (ISSUE-005/006)

### Added
- **Sidebar responsif (ISSUE-005)**: `mode?: "auto"|"docked"|"overlay"` (default `auto`: docked ≥ 900px, overlay di bawahnya), `open?/defaultOpen?/onOpenChange?` untuk overlay; overlay pakai-ulang `Drawer` (trap/Escape/backdrop/`inert`/fokus kembali); docked `position: sticky + 100dvh` + landmark `<nav>`; lebar token `--sidebar-width` (default 260px), overlay `min(..., 85vw)`; area tengah `flex: 1; min-height: 0` (konsumen tak susun `ScrollArea` sendiri); `div` internal → `MuiBox`. `aria-label` tetap opsional (tak-breaking); `collapsed` ditunda.
- **Token radius peran (ISSUE-006)**: `css.radius.button/card/surface/prominent` (+ `css.control.radius` yang sudah ada); 67 titik beralih peran, default = nilai kini (nol-ubah visual); skala mentah hanya di definisi tema. Sisa skala: kontainer Questionnaire `lg` (disengaja, komentar `ISSUE-006` — faktor-ukuran susulan).

### Verification
- `tsc` bersih; `npm run test` 143/143 (70 file, +1 Sidebar overlay/Escape); `kelir:drift` OK; `kelir:guard` 0 ERROR; `kelir:status:check` 69/69.

### Fixed
- **ISSUE-007 — console error `notched` di Select**: MUI menyuntik `notched: true` ke elemen `input`, `MuiInputBase` meneruskannya ke `div`. Pembungkus internal `KelirSelectInput` (strip `notched`, teruskan ref) + runtime-test spy `console.error` (gagal di kode lama, lolos di baru).
- **ISSUE-009 — nav ringkas + tombol rata kiri**: `Drawer paperHeight?: "full"|"auto"` (paper bungkus isi + tengah vertikal via margin auto — tanpa transform agar tak bentrok transisi Slide); `Button align?: "center"|"start"` (kolom ikon lurus di tombol full-width); Sidebar overlay teruskan sebagai `overlayHeight content`. Koreksi teori: `height:auto` + `top/bottom:0` meregang penuh (margin auto jadi nol) — harus `fit-content` (terbukti: paper 152px, top 346 tengah persis). Slider hantu tepi paper
(paper overflowY auto + pecahan 151.5 vs 150): paper mode content kini
`overflowY visible` — paper tak pernah scroll sendiri; scroll milik
ScrollArea dalam (prinsip: slider hanya di mode full).
- **ISSUE-008 — varian trigger + tinggi overlay Sidebar**: `trigger?: "none"|"hamburger"|"chevron"` (IconButton portal meluncur sinkron drawer; label Buka/Tutup); `overlayHeight?: "full"|"content"`. Drawer paper lengkung kanan ala card; overlay maksimal 50vw; teks panjang wrap. Bonus temuan axe: `aria-label` Drawer kini juga di paper `role=dialog` (sebelumnya hanya root → dialog tak bernama).
- **ISSUE-005 susulan — daftar terpotong**: root docked `height: 100dvh` + `flexShrink: 0` memotong isi di parent bounded; area tengah tak scroll (ScrollArea unbounded). Root kini `height: 100%` + `maxHeight: 100dvh`, tengah `ScrollArea maxHeight="100%"` (scroll internal bila bounded, tumbuh bila tidak).

## 2026-10-10 — Kontrak paten 69/69 sealed (epik Gel.2–Gel.3c-11 + P1b/P1d/P2)

### Added
- **Seluruh 69 kontrak sealed**: semua `*Props` di `kelir-types.ts` eksplisit (tanpa warisan MUI/HTML); tiap komponen punya `*.test-d.tsx` (JSX + `@ts-expect-error` di baris prop) + `*.test.tsx` (paksa spread via `any` + `axe`) — pola §6b STYLE.md.
- **Generik ketat (P2)**: `Chart<TDatum extends object>`, `Table<TCell>`, `Carousel<TItem>`, `Resizable<TPanel>` — default kompatibel, inferensi jalan.
- **A11y milik kit (P2)**: Toast `role=status` + `aria-live=polite`; Dialog focus-trap terbukti; Tooltip/Popover pemicu fokusabel; Menu ArrowDown; Command input + Questionnaire textarea `aria-label`.
- **Screenshot regression (P1d)**: `scripts/kelir-shots.mjs` dep-free (Chrome/Edge via CDP) + baseline 11 tema di `__shots__/`.
- **Showcase 64→68**: demo Grid, IconButton, Spacer, Stack; README Complete List + counter disinkronkan.

### Changed (breaking, sadar)
- Slot teks turun ke `string`; pemicu render-sendiri (tanpa `cloneElement`); `onChange/onClose/onRemove` semantik tanpa event (adaptor zero-arg milik kit); Combobox pilih-satu; `MessageScroller.style.maxHeight` → prop `maxHeight`.
- **Questionnaire dipecah (P2)**: orkestrasi + 5 modul SRP (`model/progress/item/nav/complete`); kontrak publik nol-ubah.

### Verification
- `tsc` bersih; `npm run test` 142/142 (70 file); `lint` (Biome) bersih; `build` OK; `kelir:guard` 0 ERROR; `kelir:drift` OK (69 §5 vs 85 interface); `kelir:status:check` OK (69/69 sealed); `kelir:shots:check` OK (11 tema identik baseline).

## 2026-09-29 — Chart/DataTable dukung prop title (ISSUE-004)

### Fixed
- **ISSUE-004 — Chart & DataTable tak mendukung judul di dalam card**: keduanya me-render bingkai card sendiri tetapi tak menerima prop judul, sehingga konsumen terpaksa membungkus dengan `<Card title>` (bingkai ganda). Fix: `title?: React.ReactNode` (opsional, backward-compatible) pada `ChartProps` dan `DataTableProps`, dirender sebagai heading di dalam frame masing-masing (`fontWeight: 700`, `color: textPrimary`, `marginBottom: space.sm`; DataTable sejajar padding sel 16px). Tanpa `title`, tampilan sama persis (render kondisional, tanpa elemen tambahan). Catatan tipe: `title: string` bawaan (`HTMLAttributes`/`MuiTableProps`, atribut tooltip) di-`Omit` agar tak bentrok dengan `ReactNode` — preseden sama seperti `DialogProps`/`CardProps`.

### Verification
- `tsc --noEmit` clean (submodule files typecheck via parent project)
- Manual browser check masih terbuka: `<Chart title="...">` / `<DataTable title="...">` tampil di dalam bingkai; tanpa `title` tak ada perubahan visual

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