# Kelir — Issue Notes

Catatan perbaikan komponen. Format per issue: ringkasan, penyebab,
langkah reproduksi, usulan perbaikan, workaround sementara.

---

## ISSUE-001 — Select menggeser layout halaman saat dibuka

**Status:** diperbaiki (2026-09-28, Opsi A)
**Perbaikan:** `Select` kini menerima `MenuProps` konsumen dan
menggabungkannya dengan default internal; `disableScrollLock` default
`true` sehingga menu terbuka tanpa mengunci scroll body. `onOpen`
konsumen yang sebelumnya tertimpa default internal kini ikut dipanggil
(setelah pengukuran lebar menu).
**Komponen:** `kelir-components/select.tsx` (`Select`)
**Dilaporkan dari:** FEB Mart Unisla — kontrol urutan katalog
(2026-09-28)

### Ringkasan

Setiap kali dropdown `Select` dibuka (klik), seluruh halaman bergeser
secara horizontal sesaat — konten di bawah kontrol ikut bergerak. Efeknya
terlihat jelas di halaman panjang (ada scrollbar vertikal). Komponen
`NativeSelect` tidak menunjukkan gejala ini.

### Penyebab

1. `Select` memakai MUI `Select` + `Menu` (berbasis `Modal`). Default MUI
   `Modal` mengaktifkan **scroll lock**: saat menu terbuka, `overflow:
   hidden` dipasang ke `<body>` sehingga scrollbar vertikal halaman
   hilang. Lebar viewport efektif bertambah selebar scrollbar (~15px)
   dan seluruh konten bergeser ke kanan. Saat menu ditutup, scrollbar
   kembali dan konten bergeser balik. Inilah "gerak" yang terlihat —
   bukan perubahan lebar kontrolnya sendiri.
2. `Select` mem-hardcode `MenuProps={{ slotProps: ... }}` **setelah**
   `{...props}`, sehingga konsumen tidak bisa meneruskan
   `disableScrollLock` (atau penyesuaian `MenuProps` lain) dari luar.
   Tidak ada jalan keluar tanpa mengubah kode Kelir.
3. `onOpen` memanggil `setMenuWidth` (mengukur anchor untuk lebar menu)
   yang memicu render ulang — tidak menyebabkan geser, tapi membuat
   perilaku buka-tutup lebih berat dari yang perlu.

### Langkah reproduksi

1. Render `Select` dengan 2–3 opsi di halaman yang lebih tinggi dari
   viewport (scrollbar vertikal terlihat).
2. Pastikan tidak ada `MenuProps`/`disableScrollLock` yang bisa
   diteruskan (tertimpa default di dalam komponen).
3. Klik `Select` untuk membuka menu → amati konten halaman bergeser
   horizontal; tutup menu → bergeser kembali.
4. Bandingkan dengan `NativeSelect` pada kondisi sama: tidak bergeser
   (dropdown native tidak mengunci scroll body).

### Usulan perbaikan

Pilih salah satu (atau kombinasi):

**Opsi A (disarankan) — teruskan `MenuProps` konsumen.**
Gabungkan `MenuProps` dari props dengan default internal, bukan
menimpanya:

```tsx
export function Select({
  options,
  style,
  notched,
  MenuProps,
  ...props
}: SelectProps) {
  // ...
  return (
    <MuiSelect
      {...props}
      // ...
      MenuProps={{
        disableScrollLock: true, // default baru: jangan kunci scroll
        ...MenuProps, // konsumen tetap bisa override
        slotProps: {
          paper: { /* ...default... */ },
          list: { /* ...default... */ },
          ...MenuProps?.slotProps,
        },
      }}
    >
```

Catatan tradeoff `disableScrollLock: true`: halaman tetap bisa di-scroll
saat menu terbuka (menu MUI mengikuti via fixed positioning, jadi secara
visual tetap menempel pada anchor). Untuk menu pendek (2–10 opsi) ini
dapat diterima dan menghilangkan geser sepenuhnya. Bila diinginkan
perilaku kunci-scroll, konsumen tinggal meneruskan
`MenuProps={{ disableScrollLock: false }}`.

**Opsi B — render menu dalam portal non-modal.**
Ganti strategi overlay ke `Popper` (seperti `Autocomplete` tanpa modal)
sehingga tidak ada scroll lock sama sekali. Perubahan lebih besar;
cocok bila Opsi A dinilai mengubah perilaku default terlalu jauh.

**Opsi C — dokumentasikan batasan.**
Bila perbaikan ditunda, tambahkan catatan di README bagian `Select`:
dropdown mengunci scroll body (perilaku bawaan MUI Modal) dan dapat
menggeser layout di halaman berscrollbar; sarankan `NativeSelect`
atau kontrol segmented untuk kasus sensitif-geser.

### Kriteria selesai

- [ ] `Select` dapat dibuka/ditutup tanpa konten halaman bergeser
      (uji di halaman berscrollbar, Chrome + Firefox, desktop 1280px
      dan mobile 390px).
- [ ] Konsumen bisa mengontrol perilaku lewat `MenuProps`
      (minimal `disableScrollLock`).
- [ ] Tidak ada regresi visual: lebar menu tetap mengikuti anchor
      (`menuWidth`), gaya paper/list tidak berubah.
- [ ] `tsc` + `biome check` + build storybook/contoh (bila ada) hijau.

### Workaround sementara (dipakai downstream)

FEB Mart Unisla mengganti kontrol urutan katalog dari `Select` menjadi
segmented toggle dua tombol (`Terlaris | Terbaru`, `fieldset` + tombol
`flex: 1` dalam wadah 200px). Tanpa overlay → tanpa scroll lock → tanpa
geser. Lihat `catalog-sections.tsx` di repo konsumen.

---

## ISSUE-002 — Dialog menggeser konten belakang di halaman berscrollbar

**Status:** diperbaiki (2026-09-28, Opsi A)
**Perbaikan:** `Dialog` dan `AlertDialog` kini default
`disableScrollLock: true`; konsumen tetap bisa override lewat prop
`disableScrollLock` (mis. `disableScrollLock={false}` bila ingin
kunci-scroll).
**Komponen:** `kelir-components/dialog.tsx` (`Dialog`);
pola sama di `kelir-components/alert-dialog.tsx` (`AlertDialog`)
**Dilaporkan dari:** FEB Mart Unisla — dialog "Tambah produk"
(`product-list-view.tsx:89`) (2026-09-28)

### Ringkasan

Setiap kali `Dialog` dibuka di halaman yang lebih tinggi dari viewport
(ada scrollbar vertikal — mis. halaman produk: tabel + metrik), seluruh
konten di belakang popup bergeser horizontal sesaat. Di halaman pendek
tanpa scrollbar (mis. dialog "Tambah admin") gejala tidak terlihat,
sehingga mudah dikira kedua dialog itu komponen berbeda — padahal
keduanya memakai Kelir `Dialog` yang sama persis.

### Penyebab

Satu akar dengan ISSUE-001: MUI `Modal` mengaktifkan **scroll lock**
secara default. Saat dialog terbuka, `overflow: hidden` dipasang ke
`<body>` → scrollbar vertikal hilang → lebar konten efektif bertambah
selebar scrollbar dan seluruh halaman bergeser ke kanan. Saat dialog
ditutup, scrollbar kembali dan konten bergeser balik.

Kabar baiknya (beda dari ISSUE-001): `Dialog` menyebar `{...props}`
**sebelum** `slotProps` yang di-hardcode, dan `disableScrollLock`
adalah prop top-level `Modal` (bukan bagian `slotProps`) — sehingga
konsumen MASIH bisa meneruskan `disableScrollLock` dari luar tanpa
mengubah kode Kelir. Yang belum ada hanyalah default yang aman.

### Langkah reproduksi

1. Render `Dialog` (atau `AlertDialog`) di halaman yang lebih tinggi
   dari viewport (scrollbar vertikal terlihat).
2. Buka dialog → amati konten belakang bergeser horizontal ke kanan;
   tutup dialog → bergeser kembali.
3. Bandingkan pada halaman pendek tanpa scrollbar: tidak ada geser
   (bukan karena komponen beda, melainkan karena tidak ada scrollbar
   yang hilang).

### Usulan perbaikan

**Opsi A (disarankan) — default `disableScrollLock: true`.**
Tambahkan default di `Dialog` (dan `AlertDialog` yang polanya sama),
konsumen tetap bisa override:

```tsx
export function Dialog({ title, actions, disableScrollLock = true, children, ...props }: DialogProps) {
  return (
    <MuiDialog disableScrollLock={disableScrollLock} {...props} /* ... */>
```

Tradeoff sama seperti ISSUE-001 Opsi A: halaman belakang tetap bisa
di-scroll saat dialog terbuka. Untuk dialog form pendek ini dapat
diterima dan menghilangkan geser sepenuhnya.

**Opsi B — dokumentasikan batasan.**
Bila perbaikan ditunda, tambahkan catatan di README bagian `Dialog` /
`Alert Dialog`: popup mengunci scroll body (bawaan MUI Modal) dan
dapat menggeser layout di halaman berscrollbar; sarankan
`disableScrollLock` untuk kasus sensitif-geser.

### Kriteria selesai

- [ ] `Dialog` dan `AlertDialog` dapat dibuka/ditutup tanpa konten
      belakang bergeser (uji di halaman berscrollbar, Chrome +
      Firefox, desktop 1280px dan mobile 390px).
- [ ] Konsumen bisa mengontrol perilaku lewat prop `disableScrollLock`.
- [ ] Tidak ada regresi visual: gaya paper, radius, border, posisi
      tengah tidak berubah.
- [ ] `tsc` + `biome check` + build storybook/contoh (bila ada) hijau.

### Workaround sementara (dipakai downstream)

Teruskan `disableScrollLock` dari konsumen (didukung tipe
`DialogProps extends MuiDialogProps`, tanpa ubah kode Kelir):

```tsx
<Dialog open={createOpen} onClose={...} title="Tambah produk" disableScrollLock>
```

---

## ISSUE-003 — DataTable crash di Server Component (tanpa "use client")

**Status:** dilaporkan, belum diperbaiki
**Komponen:** `kelir-components/data-table.tsx` (`DataTable`)
**Dilaporkan dari:** FEB Mart Unisla — `SellerMetricsView`
(halaman `/developer/produk`, `/admin/produk`, `/seller`) (2026-09-28)

### Ringkasan

`DataTable` memakai `React.useState` untuk paginasi
(`data-table.tsx:22`) tetapi file tidak berdirektif `"use client"`.
Akibatnya setiap Server Component yang merendernya langsung crash
saat runtime:

```
useState only works in Client Components. Add the "use client"
directive at the top of the file to use it.
at DataTable (kelir-components/data-table.tsx:22:41)
```

### Langkah reproduksi

1. Render `<DataTable data={...} paginated />` dari Server Component
   (tanpa batas client di antaranya).
2. Buka halaman → runtime TypeError di atas (Next.js 16 + Turbopack).

### Usulan perbaikan

**Opsi A (disarankan) — tambah `"use client"` di `data-table.tsx`.**
Satu baris; komponen memang interaktif (state halaman + tombol
navigasi) sehingga batas client sudah semestinya di komponen itu
sendiri, bukan dibebankan ke tiap konsumen.

**Opsi B — audit komponen interaktif lain.** Kandidat yang memakai
hook (`useState`/`useEffect`/dsb.): `calendar`, `carousel`,
`collapsible`, `command`, `date-picker`, `hover-card`,
`message-scroller`, `popover`, `questionnaire`, `resizable`,
`bubble`, `textarea` — pastikan yang interaktif semuanya
berdirektif client (perhatikan varian kutip: `'use client'` vs
`"use client"`).

### Kriteria selesai

- [ ] `<DataTable>` dapat dirender dari Server Component tanpa error.
- [ ] Paginasi tetap berfungsi (pindah halaman tidak me-reset).
- [ ] `tsc` + `biome check` + build storybook/contoh (bila ada) hijau.

### Workaround sementara (dipakai downstream)

FEB Mart Unisla memberi `"use client"` pada pembungkusnya
(`views/seller-metrics-view.tsx`) — props yang dilewatkan hanya data
serializable dari server page, jadi aman. Lihat file tersebut di
repo konsumen.

## ISSUE-004 — Chart & DataTable tak mendukung judul di dalam card

**Status:** dilaporkan, belum diperbaiki
**Komponen:** `kelir-components/chart.tsx` (`Chart`),
`kelir-components/data-table.tsx` (`DataTable`)
**Dilaporkan dari:** FEB Mart Unisla — `SellerMetricsView`
(halaman `/seller`, `/admin`, `/developer`) (2026-09-29)

### Ringkasan

`Chart` dan `DataTable` masing-masing me-render bingkai card sendiri
(surface + border + radius + convex shadow), tetapi tak satu pun
menerima prop judul (`ChartProps` di `kelir-types.ts:163`,
`DataTableProps` di `kelir-types.ts:213`). Konsumen yang butuh judul
seksi terpaksa membungkus dengan `<Card title>` sehingga terjadi
card di dalam card (bingkai ganda).

### Langkah reproduksi

1. Render `<Chart data={...} />` atau `<DataTable data={...} />`
   dengan judul seksi, mis. `<Card title="Tren klik harian">`.
2. Hasil: bingkai `Chart`/`DataTable` tampil di dalam bingkai `Card`
   luar — dua lapis border/shadow.

### Usulan perbaikan

Tambah `title?: React.ReactNode` (opsional, backward-compatible)
pada `ChartProps` dan `DataTableProps`, lalu render heading di dalam
frame masing-masing dengan gaya setara judul `Card`
(`fontWeight: 700`, `color: textPrimary`, `marginBottom: space.sm`).
Konsumen cukup menulis `<Chart title="..." />` /
`<DataTable title="..." />` tanpa `<Card>` pembungkus.

### Kriteria selesai

- [ ] `<Chart title="...">` dan `<DataTable title="...">`
      merender judul di dalam bingkai card sendiri.
- [ ] Tanpa `title`, tampilan sama persis seperti sekarang
      (tidak ada elemen tambahan).
- [ ] `tsc` + `biome check` + build storybook/contoh (bila ada) hijau.

### Workaround sementara (dipakai downstream)

FEB Mart Unisla melepas `<Card>` pembungkus dan memakai heading
polos `SectionTitle` (h2, 16px, 700) di luar komponen —
judul di luar card, bukan di dalam. Lihat
`views/seller-metrics-view.tsx` di repo konsumen.
