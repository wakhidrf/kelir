<!-- kelir-doc: intro -->
# Project Kelir

Project Kelir adalah sistem desain multi-tema untuk Next.js dan TypeScript: satu rangkaian komponen aksesibel yang berubah wajah menjadi sebelas bahasa desain berbeda, sehingga Anda membangun antarmuka yang rapi dan konsisten tanpa menulis CSS.

## Kenapa memilih Kelir

- **Satu basis kode, sebelas tampilan.** Pindahkan seluruh aplikasi antar sebelas bahasa desain - glassmorphism, neumorphism, spatial UI, dan lainnya - dengan satu pilihan. Tanpa fork, tanpa komponen ganda.
- **Aksesibel sejak hari pertama.** Navigasi keyboard, focus trap, pengumuman pembaca layar, dan kontrol berlabel sudah tertanam di tiap komponen, jadi aksesibilitas tak perlu dirombak belakangan.
- **Tak ada yang perlu di-style manual.** Anda mengisi konten dan perilaku; warna, jarak, radius, bayangan, dan font datang dari tema aktif, sehingga antarmuka tetap konsisten saat aplikasi tumbuh.
- **Font yang tetap cepat.** Font tema di-host bersama kit dan hanya dipreload saat sebuah tema memakainya - tanpa CDN font pihak ketiga dan tanpa permintaan yang memblokir render pada kunjungan pertama.
- **Ramah statis.** Sajikan tema dari cookie untuk paint pertama yang dirender server, atau dari browser agar halaman publik tetap tersimpan di CDN.

## Pertanyaan umum

**Apakah saya perlu paham CSS?** Tidak. Anda memilih dari opsi tetap yang terdokumentasi - misalnya varian tombol - dan tema yang mengurus visualnya.

**Apakah cocok untuk aplikasi yang sudah ada?** Kelir dibangun untuk Next.js dengan TypeScript dan paling pas di proyek baru. Mulailah dengan menghapus UI kit lain, seperti Tailwind, agar keduanya tidak bentrok.

**Bisakah saya menambah branding sendiri?** Sebelas tema adalah set yang didukung. Anda bisa mengatur font merek dan dua warna merek tanpa menyentuh kode komponen.

## Dukung proyek ini

Project Kelir gratis dan sumber terbuka. Jika ia menghemat waktu Anda, boleh membelikan saya Ko-fi atau memberi bintang di GitHub - kedua tautannya ada di header situs.

<!-- kelir-doc: install -->

## Cara mulai

1. **Tambahkan kit ke proyek Anda** sebagai submodule Git di `src/views/kelir`.
2. **Bungkus aplikasi dengan provider** agar setiap komponen mengikuti tema aktif.
3. **Letakkan komponen di sebuah halaman** dan ganti tema untuk melihat seluruh aplikasi berubah wajah sekaligus.

## Untuk developer

### Persyaratan

Next.js dengan TypeScript, plus paket inti berikut:

```bash
npm install @emotion/react @emotion/styled @mui/material @mui/icons-material
```

### Tambahkan Kelir sebagai submodule

```bash
git submodule add https://github.com/wakhidrf/kelir.git src/views/kelir
git submodule update --init --recursive
```

Submodule dipatok ke commit yang Anda tambahkan. Tarik versi kit yang lebih baru nanti dengan `git submodule update --remote src/views/kelir`.

### Pasang provider

Taruh `KelirProvider` di root layout. Bawaannya tema bersifat server-driven: layout membaca cookie tema yang tersimpan dan menaruhnya di `<html>` sehingga paint pertama sudah bertema - tanpa flash, tanpa skrip klien, tanpa localStorage.

```tsx
// src/app/layout.tsx (Server Component)
import { cookies } from "next/headers";
import { KelirProvider } from "@/views/kelir/kelir-provider";
import { THEME_COOKIE } from "@/views/kelir/kelir-styles";
import type { Theme } from "@/views/kelir/kelir-types";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const stored = cookieStore.get(THEME_COOKIE)?.value;
  const theme: Theme = stored ? (stored as Theme) : "neumorphism";

  return (
    <html lang="id" data-kelir-theme={theme} suppressHydrationWarning>
      <body>
        <KelirProvider defaultTheme={theme}>{children}</KelirProvider>
      </body>
    </html>
  );
}
```

Simpan pilihan itu dengan Server Action yang menulis cookie:

```tsx
// src/controllers/theme-actions.ts
"use server";

import { cookies } from "next/headers";
import { THEME_COOKIE } from "@/views/kelir/kelir-styles";
import type { Theme } from "@/views/kelir/kelir-types";

export async function persistThemeCookie(theme: Theme) {
  const cookieStore = await cookies();
  cookieStore.set(THEME_COOKIE, theme, {
    path: "/",
    sameSite: "lax",
    maxAge: 31536000,
  });
}
```

**Halaman publik statis.** Saat root layout harus tetap statis (SSG/CDN) dan tak bisa membaca cookie, teruskan `themeMode="client"`. Tema lalu disimpan di browser dan diterapkan sebelum paint pertama oleh skrip inline kecil - tanpa cookie dan tanpa putaran server.

**Tanpa switcher, tanpa tema tersimpan.** Cookie tema hanya dipertahankan selama ada pemilih tema yang terpasang, sehingga origin bersama tak pernah membocorkan pilihan lama.

### Memakai komponen

Impor langsung dari kit dan tata letak dengan primitif kit, bukan `div` ber-style:

```tsx
import { Button } from "@/views/kelir/kelir-components/button";
import { Stack } from "@/views/kelir/kelir-components/stack";

export default function Contoh() {
  return (
    <Stack direction="row" gap="md">
      <Button variant="primary">Klik saya</Button>
    </Stack>
  );
}
```

### Aturan main

- Anda mengisi konten, opsi, data, dan handler; tema memiliki semua visual.
- Jangan pernah men-style dari luar - tanpa `style`/`sx`/`className`, tanpa warna atau ukuran mentah, tanpa `slotProps`.
- Teruskan hanya nilai yang tertera di kartu tiap komponen di Showcase; nilai yang Anda karang sendiri tak akan dirender.
- Tata letak dengan primitif kit (`Stack`, `Grid`, `Spacer`), bukan pembungkus biasa.

### Gerbang konsistensi

Kelir membawa pemeriksaan statis yang dijalankan dari proyek Anda dengan `npm run kelir`: guard kontrak, filter anti-slop, pemeriksaan adopsi, dan audit performa serta pengambilan data opsional. Tiap pemeriksaan mencetak tabel laporan yang sama dan mematok versi yang sudah pasti baik, jadi Anda selalu tahu aturan mana yang berjalan.

### Font per tema

Tiap bahasa desain membawa tipografinya sendiri, dan fontnya menyertai kit - bukan stylesheet pihak ketiga. Empat keluarga mencakup sebelas tema: JetBrains Mono sebagai wajah monospace di semua tema, plus Playfair Display, Poppins, dan Exo 2 sebagai wajah teks untuk masing-masing satu tema. Keempatnya berlisensi SIL Open Font License 1.1; teks lisensinya menyertai berkas di `fonts/LICENSE.md`.

---

<!-- kelir-doc: components -->
## Daftar Lengkap 86 Komponen Project Kelir

Project Kelir memiliki **86 komponen** yang dikelompokkan ke beberapa kategori utama agar mudah merancang antarmuka yang terstruktur dan konsisten.

### 1. Input & Formulir
Komponen yang menangkap interaksi pengguna dan input data dengan kontrol terintegrasi.

1. **Button**: Menampilkan tombol interaktif yang mengikuti tema aktif, dengan skala KitSize tertutup bersama (xs = aksi di dalam baris tabel; lg lega; xl..3xl degrade ke lg).
2. **Button Group**: Wadah untuk mengelompokkan tombol-tombol terkait dengan sudut membulat yang konsisten.
3. **Checkbox**: Pilihan biner dengan label dan visualisasi centang.
4. **Combobox**: Input teks auto-complete dengan daftar saran opsi.
5. **Date Picker**: Pemilih tanggal interaktif dalam kalender popover dengan navigasi month-grid dan year-list inline.
6. **Field**: Menggabungkan label, kontrol, dan teks bantuan untuk formulir yang aksesibel.
7. **Input**: Input teks dasar untuk formulir dengan styling terintegrasi.
8. **IconButton**: Tombol khusus ikon dengan label aksesibel yang wajib, dengan skala KitSize tertutup bersama (xs paling kecil, lg..3xl berbagi frame lg).
9. **Input Group**: Menggabungkan input teks dengan ikon tambahan atau tombol aksi di awal/akhir (prefix/suffix).
10. **Input OTP**: Input kata sandi sekali pakai dengan fungsi salin-tempel yang ramah pengguna.
11. **Label**: Label teks aksesibel yang terhubung langsung ke elemen kontrol input.
12. **Native Select**: Elemen select HTML native yang di-style sesuai bahasa desain Project Kelir.
13. **Radio Group**: Kumpulan opsi pilihan tunggal di mana hanya satu opsi yang bisa aktif.
14. **Select**: Menampilkan daftar pilihan interaktif yang dipicu tombol trigger. Membukanya tidak pernah menggeser layout halaman.
15. **Slider**: Kontrol seret horizontal untuk menentukan nilai dalam rentang tertentu.
16. **Switch**: Toggle biner dengan umpan balik visual transisi aktif yang jelas.
17. **Textarea**: Bidang input teks multi-baris yang bisa diubah ukurannya.
18. **Toggle**: Tombol biner dua-keadaan (on/off) untuk peralihan cepat.
19. **Toggle Group**: Wadah berisi beberapa tombol Toggle untuk pilihan tunggal atau ganda.
20. **Questionnaire**: Kuesioner multi-langkah dengan pertanyaan pilihan tunggal, pilihan ganda, isian bebas, dan yang bisa dilewati, lengkap dengan indikator progres dan layar selesai.

### 2. Tampilan Data
Komponen untuk menampilkan data statis, visualisasi, dan struktur pesan.

21. **Accordion**: Panel konten vertikal bertumpuk yang bisa diciutkan atau dikembangkan.
22. **Aspect Ratio**: Wadah yang menegakkan proporsi dimensi konten (seperti gambar atau video).
23. **Attachment**: Penampil lampiran file dengan metadata, status unggah, dan tombol hapus.
24. **Avatar**: Representasi visual profil pengguna sebagai gambar atau fallback teks inisial, dengan varian berbingkai untuk logo.
25. **Badge**: Label berwarna kecil untuk menandai status atau kategori.
26. **Bubble**: Gelembung pesan percakapan yang mendukung varian terkirim/diterima, reaksi, dan ciut-kembang.
27. **Calendar**: Kalender bulanan untuk navigasi hari dan pemilihan satu tanggal.
28. **Card**: Panel wadah informasi yang terdiri dari header, sub-header, badan, dan footer.
29. **Carousel**: Pemutar konten horizontal dengan efek swipe dan transisi mulus.
30. **Chart**: Visualisasi data grafis (Bar, Line, Area) yang dirender sebagai SVG milik kit dengan judul opsional.
31. **Code Block**: Blok kode dengan label bahasa dan tombol salin milik kit, lengkap dengan cadangan clipboard.
32. **Collapsible**: Panel konten lipat (ciut-kembang) untuk menyembunyikan atau menampilkan detail tambahan.
33. **Data Table**: Tabel data dengan paginasi dan judul opsional.
34. **Empty**: Visual status yang menarik untuk menandai saat data atau konten kosong.
35. **Hover Card**: Kartu pratinjau dengan konten tambahan yang muncul saat link di-hover.
36. **Item**: Komponen baris serbaguna untuk daftar, menyajikan media, judul, deskripsi, dan tombol aksi.
37. **Kbd**: Menampilkan pintasan keyboard dengan gaya tombol keyboard fisik yang estetis.
38. **List**: Daftar semantik dengan penanda, jarak, dan warna milik kit, dapat beralih antara bullet dan bernomor.
39. **Marker**: Penanda garis status, pemisah percakapan, atau pembagi garis berlabel di chat.
40. **Message**: Komponen baris pesan dalam riwayat chat lengkap dengan waktu kirim dan status.
41. **Message Scroller**: Wadah scroll chat cerdas yang menstabilkan posisi pesan baru dan memuat riwayat dengan mulus.
42. **Progress**: Indikator bilah progres linear untuk penyelesaian tugas.
43. **Quote**: Kutipan blok dengan batang aksen, latar, dan radius milik kit.
44. **Scroll Area**: Wadah dengan scrollbar kustom yang dioptimalkan untuk konsistensi lintas-browser.
45. **Separator**: Garis pembagi horizontal atau vertikal antar elemen konten dengan teks berlabel opsional.
46. **Table**: Struktur tabel dasar yang responsif untuk menyajikan data baris-kolom yang teratur, dengan `density?` (`default`|`compact`) untuk data banyak kolom yang padat.
47. **Tabs**: Navigasi konten berbasis tab untuk membagi informasi ke panel terpisah.
48. **Typography**: Styling teks khusus untuk heading, paragraf, dan label kecil demi konsistensi, dengan segmen inline berhias untuk satu heading.

### 3. Navigasi
Komponen yang memandu pergerakan pengguna saat menjelajahi aplikasi.

49. **Breadcrumb**: Jejak hierarki halaman aktif sebagai panduan untuk kembali.
50. **Command**: Dialog pencarian cepat gaya command-palette dan aksi perintah instan.
51. **Menubar**: Bilah menu horizontal persisten yang menyajikan daftar perintah cepat.
52. **Navigation Menu**: Kumpulan link navigasi utama aplikasi dengan indikator aktif.
53. **Pagination**: Kontrol pemisah halaman untuk data agar penjelajahan data bervolume besar lebih mudah.
54. **Sidebar**: Panel navigasi samping yang bisa dikustomisasi dengan header, badan menu, dan footer.

### 4. Umpan Balik & Overlay
Komponen untuk notifikasi status, dialog interupsi, dan panduan melayang.

55. **Alert**: Peringatan kontekstual untuk menarik perhatian pengguna (info, sukses, kritis).
56. **Alert Dialog**: Dialog modal interupsi kritis yang membutuhkan keputusan konfirmasi dari pengguna. Membukanya tidak pernah menggeser halaman latar.
57. **Context Menu**: Menu aksi melayang yang muncul saat pengguna klik kanan pada area tertentu.
58. **Dialog**: Jendela modal di atas layar utama untuk tugas terfokus. Membukanya tidak pernah menggeser halaman latar.
59. **Drawer**: Panel overlay yang meluncur dari tepi layar (biasanya bawah atau samping).
60. **Dropdown Menu**: Daftar aksi melayang yang dipicu dengan menekan tombol menu (`triggerVariant?` `text|button`, default `text`).
61. **Popover**: Balon informasi melayang dengan konten kaya yang dipicu saat elemen diklik.
62. **Sheet**: Ekstensi dialog geser-samping untuk menampilkan data pendukung.
63. **Spinner**: Indikator loading melingkar yang mulus.
64. **Toast**: Pesan notifikasi singkat yang muncul sementara di sudut layar.
65. **Toaster**: Antrean notifikasi global yang merender `Toast` untuk panggilan `useToast`, dengan urutan, durasi, live region, dan batas antrean milik kit.
66. **Tooltip**: Penjelasan teks mini yang muncul saat elemen di-hover.

### 5. Tata Letak
Komponen yang membentuk struktur dan penempatan elemen.

67. **Direction**: Provider konteks untuk arah baca teks (LTR - kiri ke kanan, atau RTL - kanan ke kiri).
68. **Grid**: Grid kolom responsif dengan union kolom dan gap tertutup.
69. **Resizable**: Panel tata letak yang ukurannya bisa diatur dinamis dengan pembagi seret.
70. **Skeleton**: Bingkai placeholder animasi redup-terang untuk elemen kosong sebagai visualisasi sebelum data selesai dimuat.
71. **Spacer**: Primitif whitespace gap-tetap dengan union ukuran tertutup.
72. **Stack**: Primitif tumpukan vertikal/horizontal dengan union gap, direction, align, dan justify tertutup, plus tinggi minimum satu layar dan pembalikan urutan di layar lebar.
73. **Container**: Primitif penampung lebar halaman dengan union maxWidth dan padding tertutup dari token layout.
74. **Image**: Primitif media netral dengan union height, fit, dan radius tertutup, mode fluid opsional dengan batas lebar px, dan tanpa shadow/border bawaan.
75. **FlexItem**: Primitif kontrol item flex pasangan Stack, dengan union boolean grow, shrink, dan clip tertutup, plus offset naik ber-token.
76. **Shell**: Primitif cangkang viewport app-shell dengan arah baris atau bertumpuk dari boolean tertutup.
77. **Content**: Satu-satunya area scroll app-shell dengan padding token responsif dan latar.
78. **TopBar**: Bar mobile app-shell yang menyejajarkan slot kiri dan kanan ujung-ke-ujung (`variant?` `raised|flat`, default `raised`; `flat` baris aksi transparan di dalam konten).
79. **Tile**: Primitif ubin ikon/logo dengan union tone dan size tertutup dari token.
80. **Banner**: Spanduk status tengah dengan union tone tertutup, teksnya mewarisi warna.
81. **Link**: Tautan teks sebaris dengan ikon milik kit, href wajib, dan target eksternal yang aman.
82. **LoadingOverlay**: Overlay pemuatan fullscreen yang menghalangi interaksi, dengan kartu tengah berdenyut milik kit, label status, teks kemajuan, dan slot media milik konsumen.
83. **TruncatedText**: Teks elipsis satu baris dengan batas lebar milik kit (`text` wajib, `maxWidth?` data px, teks penuh saat hover); `ContextMenu`/`DropdownMenu` mendapat `truncate?` untuk pemicu teks elipsis.
84. **Icon**: Pembungkus ikon dekoratif dengan warna (`tone`) dan ukuran dari token kit; tanpa `aria-label` ia tetap `aria-hidden` bagi pembaca layar.
85. **Positioned**: Slot bertitik tetap untuk pemicu sudut dan tepi (`anchor` dari token space, `visibility` mobile/desktop dari token 600px, `elevate` mati bila slot memuat pemicu sidebar sendiri).
86. **PageFrame**: Rangka halaman dokumen - tepi halaman, lebar isi, dan napas header/main/footer semuanya dari token `layout.page`, dengan slot `overlays` untuk pemicu bertitik tetap.

---

<!-- kelir-doc: themes -->
## Daftar Tema

Project Kelir menyediakan tema-tema berikut (satu bahasa desain `DESIGN.md` tiap
tema), bisa dipilih saat runtime via `KelirProvider`/`KelirSwitcher`. Daftar di
bawah sudah lengkap - pertahankan format `N. **theme-id**:` bila menambah tema.

1. **aurora-ui**: Gradien aurora mengalir di atas kanvas gelap.
2. **claymorphism**: Bentuk tanah liat yang chunky dan lembut dengan border membulat tebal.
3. **dimensional-layering**: Lapisan-lapisan translusen bertumpuk dengan pemisahan kedalaman.
4. **editorial-contemporaneo**: Tipografi dan garis aturan editorial-cetak kontemporer.
5. **edtech-plataforma**: Permukaan dan aksen platform edukasi yang ramah.
6. **futuristic-glassmorphism**: Panel kaca bernuansa neon dengan aksen cahaya.
7. **glassmorphism**: Translusensi kaca buram dengan backdrop blur.
8. **liquid-glass**: Highlight mengilap yang fluid di atas kaca bening.
9. **neumorphism**: Plastik extrusi lembut dengan cahaya/bayangan ganda.
10. **skeuomorphism**: Tekstur realistis yang meniru material fisik.
11. **spatial-ui**: Lapisan spasial berurutan-kedalaman dengan bayangan ambient.

---

## Lisensi

Dilisensikan di bawah [MIT License](LICENSE).