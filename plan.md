# Rencana Implementasi Kelir (plan-step.md)

Sebagai Senior Developer, Senior Security Engineer, dan Senior UI/UX Engineer, berikut adalah rencana langkah demi langkah untuk merancang dan membangun Kelir sesuai dengan `plan.md` (yang disederhanakan tanpa varian), `Part 1/DESIGN.md`, `Part 1/FONT.css`, dan seluruh komponen yang terdaftar di `daftar-komponen.txt`.

*Catatan Sesuai Arahan User:* **Varian tema (light/dark variant) tidak usah dibuat.** Kita cukup fokus pada penerapan **Tema** (Neumorphism) dan **Font** (Product Sans) saja.

---

## Perspektif Arsitektur & Keamanan (Senior Developer & Security Engineer)
1. **Model Submodul Tanpa `index.ts`:** Distribusi murni via Git Submodule. Setiap komponen diimpor langsung dari path-nya tanpa barrel file (`index.ts`) guna optimalisasi tree-shaking dan meminimalkan overhead loading modul.
2. **Keamanan Injeksi Font (Sanitisasi):** Font di-load secara dinamis dari CDN cdnfonts. Kami menerapkan validasi URL yang ketat (regex URL cdnfonts yang aman) sebelum menyisipkan elemen `<link>` ke `<head>` untuk mencegah eksploitasi XSS berbasis DOM.
3. **Pemuatan Komponen Dinamis yang Aman (Safe Dynamic Imports):** Komponen di-render menggunakan `React.lazy` secara dinamis. Path penyusunan tema akan dibatasi dan divalidasi dengan whitelist (hanya nama tema terdaftar) guna mencegah serangan Directory Traversal/Arbitrary Code Execution saat pemuatan modul.
4. **SSR-Safety:** Memastikan deteksi lingkungan runtime (`typeof window !== 'undefined'`) saat memanipulasi DOM atau memanggil `localStorage` agar kompatibel dengan Next.js / framework SSR.

## Perspektif Visual & Aksesibilitas (Senior UI/UX Engineer)
1. **Desain Neumorphism yang Presisi:** Mengikuti manual visual dari `DESIGN.md` (efek timbul/tenggelam, shadow ganda: -5px -5px 15px, 5px 5px 15px dengan blend warna latar belakang).
2. **Transisi Fisik & Taktil:** Menyediakan transisi visual yang halus (durasi 150ms-300ms, ease-out) untuk transisi tombol dari convex/embossed ke concave/debossed/pressed.

---

## Langkah-Langkah Eksekusi Detail

### Tahap 1: Inisialisasi Fondasi & Kontrak Tipe (`types.ts`)
- [ ] Membuat file `types.ts` di root directory.
- [ ] Mendefinisikan kontrak interface (`Props`) untuk seluruh 61 komponen dari `daftar-komponen.txt`. Semua interface ini akan meng-extend komponen MUI yang sesuai (misal: `ButtonProps` meng-extend `MuiButtonProps` dari `@mui/material/Button`) agar mempertahankan API standar MUI.
- [ ] Menentukan tipe global untuk `Theme` dan `Font`. (Tanpa tipe `Variant` / Mode).

### Tahap 2: Manajemen Font Global (`fonts/`)
- [ ] Mengonversi data dari `Part 1/FONT.css` menjadi modul font global pertama di `fonts/product-sans.ts`.
- [ ] Membuat struktur standar properti font sesuai §6 di `plan.md`.
- [ ] Menyediakan skrip utilitas untuk melakukan injeksi font secara aman ke dokumen.

### Tahap 3: Generator Tokens & Integrasi MUI Theme (`themes/neumorphism/`)
- [ ] Membuat folder `themes/neumorphism/` dan menyalin `DESIGN.md` (Part 1) serta membuat file `changelog.txt`.
- [ ] Menulis modul parser/resolver di `themes/neumorphism/tokens.ts` yang mengonversi frontmatter YAML di `DESIGN.md` menjadi design tokens siap pakai.
- [ ] Menggunakan data warna flat murni dari `DESIGN.md` (tanpa membuat varian light/dark).
- [ ] Menyusun pemetaan dari tokens tersebut ke properti override global MUI (`theme.components.Mui*.styleOverrides`).

### Tahap 4: State Management & Theme Context (`KelirProvider.tsx`)
- [ ] Membangun context provider utama `KelirProvider.tsx` yang mengelola state `theme` dan `font` aktif. (Tanpa state `variant`/light-dark).
- [ ] Menghubungkan provider dengan `MuiThemeProvider` untuk menyalurkan tema MUI yang dinamis.
- [ ] Menerapkan fungsionalitas persistensi state (opsional via `localStorage` yang aman dari SSR crash).

### Tahap 5: Komponen Switcher UI (`switcher.tsx`)
- [ ] Mengembangkan komponen `KelirSwitcher` yang unstyled/minimalis, berisi 2 select control saja (Tema dan Font) untuk manipulasi langsung secara runtime.
- [ ] Memastikan `KelirSwitcher` dapat diletakkan di mana saja dalam pohon aplikasi React di bawah `KelirProvider`.

### Tahap 6: Proxy Components & Dynamic Registry (`components/` & `registry.ts`)
- [ ] Membuat `registry.ts` yang mendaftarkan tema `neumorphism` dan font `product-sans`.
- [ ] Mengembangkan folder `components/` yang berisi proxy component untuk masing-masing 61 komponen (misal, `components/Button.tsx`).
- [ ] Mengimplementasikan `React.lazy` + `Suspense` di dalam proxy component untuk me-resolve komponen tema aktif secara dinamis.

### Tahap 7: Implementasi Komponen Tema Neumorphism (61 Komponen)
- [ ] Membuat implementasi spesifik Neumorphic berbasis MUI untuk masing-masing komponen di dalam `themes/neumorphism/`.
- [ ] Komponen prioritas pertama: `button.tsx`, `card.tsx`, `input.tsx` (sesuai rekomendasi roadmap §8).
- [ ] Melanjutkan implementasi seluruh komponen lainnya dari `accordion.tsx` hingga `typography.tsx` (total 61 komponen).
- [ ] Memastikan setiap komponen mematuhi aturan visual "Do's and Don'ts" dari `DESIGN.md` (misal: tanpa emoji di UI, tanpa pure black `#000000`, efek shadow neumorphic, sudut membulat konsisten 12-16px, efek press 150ms).

### Tahap 8: Skrip Registrasi Otomatis (Auto-Registry Generator)
- [ ] Menulis skrip pembantu (misal, `scripts/generate-registry.ts` atau utilitas build) yang memindai direktori `themes/` dan `fonts/` guna memperbarui `registry.ts` secara dinamis.

### Tahap 9: Verifikasi, Keamanan & Refleksi Pre-Commit
- [ ] Melakukan analisis keamanan terhadap penanganan parameter input dan URL font (mencegah manipulasi prototipe / CSRF / XSS).
- [ ] Menjalankan verifikasi fungsionalitas switching runtime (uji coba ganti tema dan perubahan font secara simultan).
- [ ] Menjalankan pre-commit check untuk memvalidasi linting dan konsistensi tipe TypeScript.

---

Rencana ini siap dieksekusi untuk menghasilkan library komponen berbasis tema yang modular, aman, dan memiliki performa serta estetika tinggi.
