# Changelog — Kelir

## Kontrak v7 vs Sebelumnya

| Fitur / Aturan | Sebelum v7 | v7 |
|---|---|---|
| Primitif layout (`Stack`/`Grid`/`Spacer`) | Pembungkus polos ditoleransi (interim) | Pembungkus non-kit = error; `Stack gap?/direction?`, `Grid columns? 1\|2\|3\|4\|6\|12 + gap?`, `Spacer size?` (semua `xs\|sm\|md\|lg`) |
| Dimensi `Skeleton` | `width`/`height` dilarang seperti semua komponen | Pengecualian tercatat (bukan preseden); `animation` tetap union status tertutup (`pulse\|wave\|false`) |
| Union tertutup | Sebagian — `Grid`/`Typography`/`Input` masih terbuka | Dilengkapi: `Grid columns`, `Typography as/level`, `Input type/size` |
| Atribut `data-*` | Pintu belakang styling yang tak diatur | Allowlist `data-testid` saja, dijaga lint |
| `Sidebar` responsif | Tanpa prop mode/trigger/tinggi | `mode auto\|docked\|overlay` (default `auto`), `open?/defaultOpen?/onOpenChange?`, `trigger none\|hamburger\|chevron`, `overlayHeight full\|content`; overlay pakai-ulang `Drawer`; isi padding 8px, tab `<` 4px |
| Paper `Drawer` | Hanya full-height | `paperHeight full\|auto` (auto membungkus isi via `fit-content`, tanpa transform); sudut kanan ala card; `aria-label` juga di paper dialog |
| `Button` / `IconButton` | Tombol hanya rata tengah; shape tak diatur | `Button align center\|start`; `IconButton shape rounded\|circle\|square` (default `rounded`); trigger overlay = `primary` |
| Token radius | Skala mentah di tiap titik pakai | `css.radius.button/card/surface/prominent` + `css.control.radius`; 67 titik, nol-ubah visual |
| Aturan test | Di dalam STYLE.md | Pindah ke `KELIR-TESTING.md`; sealed = `test-d.tsx` + runtime spread-`any` + `axe` per komponen |
| `Questionnaire` | Satu file | 5 modul SRP, kontrak nol-ubah |
| Generik | Longgar | Ketat dengan default kompatibel (`Chart`/`Table`/`Carousel`/`Resizable`) |
| A11y milik kit | Ad-hoc | Terbukti per komponen: Toast live-region, Dialog trap, pemicu Tooltip/Popover fokusabel, panah Menu, input Command/Questionnaire berlabel |
| Screenshot regression | Belum ada | `kelir-shots.mjs` (CDP dep-free) + baseline 11 tema + `kelir:shots:check` |

## Riwayat

| Tanggal | Perubahan | Verifikasi |
|---|---|---|
| 2026-10-10 | Sidebar responsif + token radius peran (ISSUE-005/006); susulan `notched` (007), varian trigger (008), `paperHeight`/`align` (009), `IconButton shape` (010); overlay `min(..., 50vw)`; hidrasi: server + render pertama selalu docked | `tsc`; test 143/143; drift; guard 0 ERROR; status 69/69 |
| 2026-10-10 | Seluruh 69 kontrak sealed (Gel.2–Gel.3c-11 + P1b/P1d/P2); breaking: slot teks ke `string`, tanpa `cloneElement`, handler semantik tanpa event, Combobox pilih-satu, prop `MessageScroller maxHeight` | `tsc`; test 142/142; lint; build; guard; drift; shots 11/11 |
| 2026-09-29 | `Chart`/`DataTable` dukung `title?` (ISSUE-004) | `tsc`; cek browser manual terbuka |
| 2026-09-29 | `"use client"` di 20 komponen interaktif (ISSUE-003) | `tsc`; cek browser manual terbuka |
| 2026-09-28 | Scroll lock default mati di `Select`/`Dialog`/`AlertDialog` (ISSUE-001/002); `MenuProps`/`onOpen` konsumen digabung, bukan ditimpa | `tsc`; cek browser manual terbuka |
| 2026-09-19 | Fix anchor popover DatePicker + navigasi bulan/tahun inline | — |
| 2026-09-01 | `Select` menyetrip prop internal `notched` (warning atribut boolean React) | Test lolos; `tsc` |
