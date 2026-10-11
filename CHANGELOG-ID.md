# Changelog — Kelir

## v7 vs Sebelumnya

| Fitur / Aturan | Sebelum v7 | v7 |
|---|---|---|
| Tata letak halaman | Anda menulis pembungkus sendiri | Pakai `Stack` (`gap`, `direction`), `Grid` (`columns` dari daftar tetap, `gap`), dan `Spacer` (`size`) milik kit — pembungkus `div` polos tak lagi diterima |
| Ukuran `Skeleton` | Tak ada cara mengatur ukuran placeholder loading | `width`/`height` boleh hanya di `Skeleton`; `animation` adalah `pulse\|wave\|false` |
| Nilai prop | Sebagian prop menerima apa saja | Daftar pilihan tetap di mana-mana (`Grid columns`, `Typography as`/`level`, `Input type`/`size`, dan lainnya) — lihat `kelir-types.ts` |
| Test hook | — | `data-testid` satu-satunya atribut `data-*` yang boleh Anda pakai |
| `Sidebar` | Sidebar tetap, tanpa opsi | `mode` (`auto`: docked di desktop, overlay di mobile), `trigger` (`none`/`hamburger`/`chevron`), `overlayHeight` (`full`/`content`) |
| `Drawer` | Selalu full-height | `paperHeight` (`full`, atau `auto` yang membungkus isi dan menengahkannya); tepi kanan membulat ala card; dialog bernama untuk screen reader |
| Tombol | Teks hanya rata tengah; tombol ikon bebas bentuk | `Button align` (`center`/`start`); `IconButton shape` (`rounded`/`circle`/`square`), selalu dengan `aria-label` |
| Radius sudut | — | Sudut kini mengikuti token tema per peran (`button`/`card`/`surface`/`prominent`) — tampilan sama, tiap tema bisa membentuknya |
| Keandalan | — | Setiap komponen diliput test tipe, runtime, dan aksesibilitas di 11 tema; `Questionnaire` dipecah jadi 5 modul dengan prop identik; generik lebih ketat (`Chart`/`Table`/`Carousel`/`Resizable`) |
| Aksesibilitas | Sebagian | Built-in di mana-mana: pengumuman Toast, focus trap Dialog, pemicu Tooltip/Popover yang bisa difokus, tombol panah Menu, input berlabel |

## Riwayat

| Tanggal | Perubahan | Artinya bagi Anda |
|---|---|---|
| 2026-10-10 | Sidebar responsif + token radius per peran, plus perbaikan susulan (`Select`, varian trigger, tinggi `Drawer`, perataan tombol, `shape` `IconButton`) | Sidebar menyesuaikan mobile sendiri; sisanya tampil sama — tanpa tindakan |
| 2026-10-10 | Seluruh 69 kontrak komponen dikunci. Breaking: slot teks kini `string` polos, handler tanpa objek event, Combobox pilih satu nilai, `MessageScroller` menerima `maxHeight` | Periksa render prop kustom dan argumen event Anda saat upgrade |
| 2026-09-29 | `Chart` dan `DataTable` menerima `title?` inline | Bungkus `<Card title>` ekstra bisa dilepas |
| 2026-09-29 | Semua komponen interaktif jalan di dalam Server Component | Impor di mana saja; `"use client"` cukup di file interaktif Anda sendiri |
| 2026-09-28 | Membuka `Select`/`Dialog`/`AlertDialog` tak lagi menggeser layout halaman | Tanpa tindakan — kini perilaku default |
| 2026-09-19 | DatePicker terbuka andal, dengan pilih bulan/tahun inline | Tanpa tindakan |
| 2026-09-01 | `Select` tak lagi mencetak warning React | Tanpa tindakan |
