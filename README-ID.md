<!-- kelir-doc: intro -->
# Kelir

## Asal-Usul Nama & Konsep

Nama **Project Kelir** diambil dari pertunjukan wayang kulit tradisional — *kelir* adalah layar kain yang dipakai sebagai panggung wayang kulit. Filosofi ini menggambarkan Project Kelir sebagai sebuah "layar" yang mampu menampilkan berbagai wajah desain (tema) yang berbeda di atas satu rangkaian komponen yang sama.

Project Kelir mengintegrasikan berbagai file **`DESIGN.md`** — masing-masing mewakili bahasa desainnya sendiri — menjadi satu sistem desain multi-tema yang koheren. Setiap bahasa desain didefinisikan terpisah dalam filenya masing-masing, lalu disatukan dalam satu arsitektur sehingga mudah dipilih atau diganti.

## Keterbatasan Saat Ini

Project Kelir saat ini terbatas untuk proyek **Next.js dengan TypeScript**. Sebelum mengintegrasikan Project Kelir, proyek juga perlu dibersihkan dari UI/UX lain yang sudah terpasang, seperti Tailwind CSS.

## Tipografi Per Tema

Selain multi-tema, setiap bahasa desain dari DESIGN.md membawa tipografinya sendiri. Font UI dan font monospace otomatis dipasangkan dengan tema, sehingga semua komponen selaras dengan identitas desain tanpa konfigurasi tambahan.

---

<!-- kelir-doc: install -->
## Panduan Integrasi & Instalasi

### 1. Menyiapkan Dependensi yang Dibutuhkan

Pastikan proyek Anda memiliki dependensi inti berikut:

```json
{
  "dependencies": {
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.1",
    "@mui/icons-material": "^9.4.0",
    "@mui/material": "^9.4.0",
    "next": "16.3.6",
    "react": "19.3.0",
    "react-dom": "19.3.0"
  }
}
```

Pasang semua dependensi Project Kelir sekaligus dengan satu perintah:

```bash
npm install \
  @emotion/react@^11.14.0 \
  @emotion/styled@^11.14.1 \
  @mui/material@^9.4.0 \
  @mui/icons-material@^9.4.0 \
  react@19.3.0 \
  react-dom@19.3.0
```

### 2. Menambahkan Project Kelir sebagai Git Submodule

Project Kelir didistribusikan sebagai Git submodule. Tambahkan (dan inisialisasi
dependensinya sendiri bila ada) ke direktori `src/views/kelir`:

```bash
git submodule add https://github.com/wakhidrf/kelir.git src/views/kelir
git submodule update --init --recursive
```

Submodule disematkan pada commit tertentu (versi saat Anda menambahkannya). Untuk
menarik commit yang lebih baru dari repo nanti:

```bash
git submodule update --remote src/views/kelir
```

### 3. Memasang Provider Utama (`KelirProvider`)

Taruh `KelirProvider` di `layout.tsx`. Tema bersifat **server-driven**: layout root
membaca cookie tema yang tersimpan (bila ada) dan menaruh `data-kelir-theme`
langsung di `<html>`, sehingga HTML SSR pertama sudah bertema — tanpa flash,
tanpa skrip inline klien, tanpa localStorage. `setTheme` menerapkan tema seketika
di klien (atribut) dan menyimpannya kembali lewat Server Action yang mengatur
cookie, sehingga respons SSR berikutnya sudah membawa tema yang tersimpan.

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
    <html lang="en" data-kelir-theme={theme} suppressHydrationWarning>
      <body>
        {/* Optional safety gate; inert while data-kelir-ready="true" (see
            kelir-styles "hideBeforeReadyCss"). */}
        <KelirProvider defaultTheme={theme}>{children}</KelirProvider>
      </body>
    </html>
  );
}
```

```tsx
// src/controllers/theme-actions.ts (Server Action — sets the cookie)
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

```tsx
// src/controllers/theme-actions.ts (Server Action — removes the cookie)
"use server";

import { cookies } from "next/headers";
import { THEME_COOKIE } from "@/views/kelir/kelir-styles";

export async function deleteThemeCookie() {
  const cookieStore = await cookies();
  cookieStore.set(THEME_COOKIE, "", {
    path: "/",
    sameSite: "lax",
    maxAge: 0,
  });
}
```

```tsx
// src/app/page.tsx (Client Component)
"use client";

import { KelirSwitcher } from "@/views/kelir/kelir-switcher";

export default function Home() {
  // Render the switcher when you want interactive, persisted theme switching.
  // setTheme applies the theme immediately and persists via the theme cookie.
  return <KelirSwitcher />;
}
```

```tsx
// src/app/page.tsx (Client Component) — programmatic access
"use client";

import { useKelir } from "@/views/kelir/kelir-provider";

export default function Home() {
  const { theme, setTheme } = useKelir();
  return <div>{/* your app */}</div>;
}
```

> **Persistensi tema.** Layout root menyajikan tema tersimpan dari
> `THEME_COOKIE` (`kelir_theme`), dan `setTheme` milik `KelirProvider` menyimpan
> cookie tersebut lewat Server Action. Tanpa env key dan tanpa localStorage — HTML
> SSR-nya sendiri sudah bertema, sehingga tidak ada flash ke default server saat
> muat atau refresh.
>
> **Tanpa switcher = tanpa tema tersimpan.** `KelirSwitcher` (atau picker apa pun)
> memanggil `registerSwitcher`/`unregisterSwitcher` lewat `useKelir()`. Selama salah
> satunya terpasang, `setTheme` menyimpan ke cookie. Jika halaman **tidak** memiliki
> switcher terpasang, provider menghapus cookie tema dan `setTheme` menjadi transien —
> origin bersama (mis. `localhost:3000` yang dipakai beberapa proyek) tidak pernah
> menyimpan pilihan tema yang bocor. Server tetap menyajikan tema cookie bila cookie
> basi masih ada, tetapi cookie itu dihapus begitu halaman tanpa switcher terhidrasi.
>
> **Tanpa persistensi** (mis. situs yang mengutamakan statis): teruskan tema default
> tetap ke `KelirProvider` dan lewati cookie; `setTheme` kemudian hanya menerapkan
> tema untuk sesi berjalan tanpa menyimpan. Cookie hanya dibaca bila layout ikut
> serta.

### 4. Cara Mengimpor Komponen

Impor komponen Project Kelir langsung dari `src/views/kelir/kelir-components` seperti contoh berikut:

```tsx
import { Button } from "@/views/kelir/kelir-components/button";
import { Switch } from "@/views/kelir/kelir-components/switch";
import { Badge } from "@/views/kelir/kelir-components/badge";

export default function MyComponent() {
  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Button variant="primary">Click Me</Button>
      <Switch label="Enable Feature" checked={true} />
      <Badge variant="secondary">New Info</Badge>
    </div>
  );
}
```

---

<!-- kelir-doc: components -->
## Daftar Lengkap 68 Komponen Project Kelir

Project Kelir memiliki **68 komponen** yang dikelompokkan ke beberapa kategori utama agar mudah merancang antarmuka yang terstruktur dan konsisten.

### 1. Input & Formulir
Komponen yang menangkap interaksi pengguna dan input data dengan kontrol terintegrasi.

1. **Button**: Menampilkan tombol interaktif yang mengikuti tema aktif.
2. **Button Group**: Wadah untuk mengelompokkan tombol-tombol terkait dengan sudut membulat yang konsisten.
3. **Checkbox**: Pilihan biner dengan label dan visualisasi centang.
4. **Combobox**: Input teks auto-complete dengan daftar saran opsi.
5. **Date Picker**: Pemilih tanggal interaktif dalam kalender popover dengan navigasi month-grid dan year-list inline.
6. **Field**: Menggabungkan label, kontrol, dan teks bantuan untuk formulir yang aksesibel.
7. **Input**: Input teks dasar untuk formulir dengan styling terintegrasi.
8. **IconButton**: Tombol khusus ikon dengan label aksesibel yang wajib.
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
24. **Avatar**: Representasi visual profil pengguna sebagai gambar atau fallback teks inisial.
25. **Badge**: Label berwarna kecil untuk menandai status atau kategori.
26. **Bubble**: Gelembung pesan percakapan yang mendukung varian terkirim/diterima, reaksi, dan ciut-kembang.
27. **Calendar**: Kalender bulanan untuk navigasi hari dan pemilihan satu tanggal.
28. **Card**: Panel wadah informasi yang terdiri dari header, sub-header, badan, dan footer.
29. **Carousel**: Pemutar konten horizontal dengan efek swipe dan transisi mulus.
30. **Chart**: Visualisasi data grafis (Bar, Line, Area) yang dirender sebagai SVG milik kit dengan judul opsional.
31. **Collapsible**: Panel konten lipat (ciut-kembang) untuk menyembunyikan atau menampilkan detail tambahan.
32. **Data Table**: Tabel data dengan paginasi dan judul opsional.
33. **Empty**: Visual status yang menarik untuk menandai saat data atau konten kosong.
34. **Hover Card**: Kartu pratinjau dengan konten tambahan yang muncul saat link di-hover.
35. **Item**: Komponen baris serbaguna untuk daftar, menyajikan media, judul, deskripsi, dan tombol aksi.
36. **Kbd**: Menampilkan pintasan keyboard dengan gaya tombol keyboard fisik yang estetis.
37. **Marker**: Penanda garis status, pemisah percakapan, atau pembagi garis berlabel di chat.
38. **Message**: Komponen baris pesan dalam riwayat chat lengkap dengan waktu kirim dan status.
39. **Message Scroller**: Wadah scroll chat cerdas yang menstabilkan posisi pesan baru dan memuat riwayat dengan mulus.
40. **Progress**: Indikator bilah progres linear untuk penyelesaian tugas.
41. **Scroll Area**: Wadah dengan scrollbar kustom yang dioptimalkan untuk konsistensi lintas-browser.
42. **Separator**: Garis pembagi horizontal atau vertikal antar elemen konten dengan teks berlabel opsional.
43. **Table**: Struktur tabel dasar yang responsif untuk menyajikan data baris-kolom yang teratur.
44. **Tabs**: Navigasi konten berbasis tab untuk membagi informasi ke panel terpisah.
45. **Typography**: Styling teks khusus untuk heading, paragraf, dan label kecil demi konsistensi.

### 3. Navigasi
Komponen yang memandu pergerakan pengguna saat menjelajahi aplikasi.

46. **Breadcrumb**: Jejak hierarki halaman aktif sebagai panduan untuk kembali.
47. **Command**: Dialog pencarian cepat gaya command-palette dan aksi perintah instan.
48. **Menubar**: Bilah menu horizontal persisten yang menyajikan daftar perintah cepat.
49. **Navigation Menu**: Kumpulan link navigasi utama aplikasi dengan indikator aktif.
50. **Pagination**: Kontrol pemisah halaman untuk data agar penjelajahan data bervolume besar lebih mudah.
51. **Sidebar**: Panel navigasi samping yang bisa dikustomisasi dengan header, badan menu, dan footer.

### 4. Umpan Balik & Overlay
Komponen untuk notifikasi status, dialog interupsi, dan panduan melayang.

52. **Alert**: Peringatan kontekstual untuk menarik perhatian pengguna (info, sukses, kritis).
53. **Alert Dialog**: Dialog modal interupsi kritis yang membutuhkan keputusan konfirmasi dari pengguna. Membukanya tidak pernah menggeser halaman latar.
54. **Context Menu**: Menu aksi melayang yang muncul saat pengguna klik kanan pada area tertentu.
55. **Dialog**: Jendela modal di atas layar utama untuk tugas terfokus. Membukanya tidak pernah menggeser halaman latar.
56. **Drawer**: Panel overlay yang meluncur dari tepi layar (biasanya bawah atau samping).
57. **Dropdown Menu**: Daftar aksi melayang yang dipicu dengan menekan tombol menu.
58. **Popover**: Balon informasi melayang dengan konten kaya yang dipicu saat elemen diklik.
59. **Sheet**: Ekstensi dialog geser-samping untuk menampilkan data pendukung.
60. **Spinner**: Indikator loading melingkar yang mulus.
61. **Toast**: Pesan notifikasi singkat yang muncul sementara di sudut layar.
62. **Tooltip**: Penjelasan teks mini yang muncul saat elemen di-hover.

### 5. Tata Letak
Komponen yang membentuk struktur dan penempatan elemen.

63. **Direction**: Provider konteks untuk arah baca teks (LTR - kiri ke kanan, atau RTL - kanan ke kiri).
64. **Grid**: Grid kolom responsif dengan union kolom dan gap tertutup.
65. **Resizable**: Panel tata letak yang ukurannya bisa diatur dinamis dengan pembagi seret.
66. **Skeleton**: Bingkai placeholder animasi redup-terang untuk elemen kosong sebagai visualisasi sebelum data selesai dimuat.
67. **Spacer**: Primitif whitespace gap-tetap dengan union ukuran tertutup.
68. **Stack**: Primitif tumpukan vertikal/horizontal dengan union gap dan direction tertutup.

---

<!-- kelir-doc: themes -->
## Daftar Tema

Project Kelir menyediakan tema-tema berikut (satu bahasa desain `DESIGN.md` tiap
tema), bisa dipilih saat runtime via `KelirProvider`/`KelirSwitcher`. Entri di
bawah adalah single source of truth untuk hitungan tema (diparse konsumen —
pertahankan format `N. **theme-id**:`).

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
