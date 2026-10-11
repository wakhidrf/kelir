# Changelog — Kelir

## 2026-10-10 — Sidebar responsif + token radius peran (ISSUE-005/006)

### Added
- **Sidebar responsif (ISSUE-005)**: `mode?: "auto"|"docked"|"overlay"` (default `auto`: docked ≥ 900px, overlay di bawahnya), `open?/defaultOpen?/onOpenChange?` untuk overlay; overlay pakai-ulang `Drawer` (trap/Escape/backdrop/`inert`/fokus kembali); docked `position: sticky + 100dvh` + landmark `<nav>`; lebar token `--sidebar-width` (default 260px), overlay `min(..., 85vw)`; area tengah `flex: 1; min-height: 0` (konsumen tak susun `ScrollArea` sendiri); `div` internal → `MuiBox`. `aria-label` tetap opsional (tak-breaking); `collapsed` ditunda.
- **Token radius peran (ISSUE-006)**: `css.radius.button/card/surface/prominent` (+ `css.control.radius` yang sudah ada); 67 titik beralih peran, default = nilai kini (nol-ubah visual); skala mentah hanya di definisi tema. Sisa skala: kontainer Questionnaire `lg` (disengaja, komentar `ISSUE-006` — faktor-ukuran susulan).

### Verification
- `tsc` bersih; `npm run test` 143/143 (70 file, +1 Sidebar overlay/Escape); `kelir:drift` OK; `kelir:guard` 0 ERROR; `kelir:status:check` 69/69.

### Fixed
- **ISSUE-007 — console error `notched` di Select**: MUI menyuntik `notched: true` ke elemen `input`, `MuiInputBase` meneruskannya ke `div`. Pembungkus internal `KelirSelectInput` (strip `notched`, teruskan ref) + runtime-test spy `console.error` (gagal di kode lama, lolos di baru).
- **ISSUE-010 — IconButton shape + trigger primary**: `IconButton shape?: "rounded"|"circle"|"square"` (default rounded, nol-ubah); pemicu Sidebar overlay jadi `primary`.
- **ISSUE-009 — nav ringkas + tombol rata kiri**: `Drawer paperHeight?: "full"|"auto"` (paper bungkus isi + tengah vertikal via margin auto — tanpa transform agar tak bentrok transisi Slide); `Button align?: "center"|"start"` (kolom ikon lurus di tombol full-width); Sidebar overlay teruskan sebagai `overlayHeight content`. Koreksi teori: `height:auto` + `top/bottom:0` meregang penuh (margin auto jadi nol) — harus `fit-content` (terbukti: paper 152px, top 346 tengah persis). Slider hantu tepi paper
(paper overflowY auto + pecahan 151.5 vs 150): paper mode content kini
`overflowY visible` — paper tak pernah scroll sendiri; scroll milik
ScrollArea dalam (prinsip: slider hanya di mode full).
- **ISSUE-008 — varian trigger + tinggi overlay Sidebar**: `trigger?: "none"|"hamburger"|"chevron"` (IconButton portal meluncur sinkron drawer; label Buka/Tutup); `overlayHeight?: "full"|"content"`. Drawer paper lengkung kanan ala card; overlay maksimal 50vw; teks panjang wrap. Isi overlay napas 16px dari tepi paper; tab `<` berjarak 8px dari tepi drawer. Koreksi hidrasi: `noSsr` MUI mengembalikan nilai asli saat render pertama → server + render pertama selalu docked, overlay setelah mount (terbukti `renderToString`). Bonus temuan axe: `aria-label` Drawer kini juga di paper `role=dialog` (sebelumnya hanya root → dialog tak bernama).
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
- **ISSUE-001 — Select menggeser layout halaman saat dibuka**: `Menu` MUI (berbasis Modal) menyalakan scroll lock secara default — `overflow: hidden` di `<body>` menghilangkan scrollbar vertikal dan seluruh halaman melompat ke samping. Fix: `Select` kini default `MenuProps.disableScrollLock` ke `true`. `MenuProps` konsumen (termasuk `slotProps.paper`/`list`) digabung dengan default internal alih-alih ditimpa, sehingga `disableScrollLock` dan styling menu tetap bisa dikontrol dari luar. Slot objek digabung per-key (style internal di bawah); slot callback `(ownerState) => props` diteruskan apa adanya.
- **Select menelan `onOpen` konsumen**: `onOpen` yang di-hardcode (pengukuran lebar menu) ditaruh setelah `{...props}`, diam-diam membuang handler konsumen. Fix: pengukuran internal jalan dulu, lalu `onOpen` konsumen dipanggil.
- **ISSUE-002 — Dialog/AlertDialog menggeser konten latar**: akar masalah scroll-lock yang sama. Fix: keduanya default `disableScrollLock` ke `true`; timpa dengan `disableScrollLock={false}` untuk mengembalikan scroll locking.

### Verification
- `tsc --noEmit` clean (submodule files typecheck via parent project)
- Biome melewati `src/views/kelir` via config — tidak ada sinyal lint untuk file-file ini
- Manual browser check masih terbuka: buka/tutup di halaman berscrollbar (Chrome + Firefox, 1280px + 390px), konfirmasi tanpa geser dan tanpa regresi visual

## 2026-09-19 — DatePicker: fix unopenable popover + inline month/year navigation

### Fixed
- **Popover DatePicker tak pernah terbuka**: `e.currentTarget` dibaca di dalam updater `setAnchorEl`. Karena `setViewDate()` dipanggil lebih dulu di handler yang sama, React melewati evaluasi eager dan menjalankan updater belakangan saat render, ketika `currentTarget` event sudah tak valid — anchor tetap `null`, sehingga klik trigger tak menampilkan kalender dan tanpa error. Fix: tangkap target secara sinkron (pola yang sama seperti `popover.tsx`).
- **Navigasi bulan/tahun inline**: label header (mis. "September ▾", "2026 ▾") membuka grid bulan 3×4 dan daftar tahun scrollable (tahun berjalan ± 30, auto-scroll ke tahun aktif) di dalam popover yang sama. Memilih opsi kembali ke tampilan hari. Panah langkah-bulan ‹ › tidak berubah. Sengaja inline alih-alih dropdown `Select` bersarang — menu bersarang (z-index `modal`) akan ter-render di bawah popover kalender (`modal + 1`) dan tak bisa diklik.

## 2026-09-01 — Fix: suppress 'notched' boolean attribute warning in Select

### Fixed
- **Komponen Select**: Destructure prop `notched` agar warning React 18+ tentang atribut boolean yang diteruskan ke elemen DOM native tidak muncul.

### Details
`Select` MUI dengan varian outlined secara internal memakai prop boolean `notched` untuk notch label. Saat `Select` Kelir men-spread semua prop (`...props`) ke `MuiSelect`, prop internal ini sampai ke elemen `<input>` native, sehingga React memberi warning:

```
Received `true` for a non-boolean attribute `notched`.
If you want to write it to the DOM, pass a string instead: notched="true" or notched={value.toString()}.
```

**Fix**: Destructure `notched` secara eksplisit di signature komponen agar dikonsumsi dan tidak diteruskan.

```tsx
// Before
export function Select({ options, style, ...props }: SelectProps) { ... }

// After
export function Select({ options, style, notched, ...props }: SelectProps) { ... }
```

### Verification
- Tidak ada lagi console warning saat memakai `Select` dengan varian outlined
- Semua test yang ada lolos
- Kompilasi TypeScript bersih
