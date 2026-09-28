# Kelir — Issue Notes

Catatan perbaikan komponen. Format per issue: ringkasan, penyebab,
langkah reproduksi, usulan perbaikan, workaround sementara.

---

## ISSUE-001 — Select menggeser layout halaman saat dibuka

**Status:** dilaporkan, belum diperbaiki
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
