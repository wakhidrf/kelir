# Panduan Revisi Rencana Kerja (Plan.md) Untuk Ekspansi Tema & Font Baru

Dokumen ini berfungsi sebagai peta jalan (*blueprint* / rencana kerja) taktis saat Anda ingin menambahkan tema baru (`DESIGN.md`) atau font baru (`font.css` / CDN font) ke dalam submodul **Kelir**.

Ini merevisi konsep di dalam `Plan.md` bawaan agar proses ekspansi berjalan secara modular, konsisten, dan aman.

---

## 1. STRUKTUR ARSITEKTUR EKSPANSI (TEMA & FONT)

```
src/views/kelir/
├── fonts/
│   ├── product-sans.ts           # Definisikan objek font Product Sans
│   └── <nama-font-baru>.ts       # Berkas pendaftaran font baru (misal: jetbrains-mono.ts)
├── themes/
│   ├── neumorphism/
│   │   ├── DESIGN.md             # Tokens, aturan desain, & dokumentasi neumorphism
│   │   ├── button.tsx            # Implementasi visual tombol neumorphic
│   │   └── ...                   # Implementasi spesifik komponen neumorphic
│   └── <nama-tema-baru>/         # Folder Tema Baru (misal: glassmorphism/)
│       ├── DESIGN.md             # Tokens & aturan desain tema baru
│       ├── button.tsx            # Implementasi visual komponen tema baru
│       └── ...
```

---

## 2. PANDUAN LANGKAH: MENAMBAHKAN FONT BARU

Ketika Anda memiliki berkas `font.css` baru atau ingin memuat font eksternal dari CDN (misal: `https://fonts.cdnfonts.com/css/jetbrains-mono`), ikuti langkah-langkah berikut:

### Langkah 1: Buat Definisinya di dalam `src/views/kelir/fonts/`
Buat file baru bernama `src/views/kelir/fonts/<nama-font-baru>.ts` (misal: `jetbrains-mono.ts`). Definisikan spesifikasi font tersebut sesuai standar model Kelir:

```typescript
export const jetbrainsMono = {
  slug: "jetbrains-mono",
  family: "JetBrains Mono",
  fallback: "monospace",
  importUrl: "https://fonts.cdnfonts.com/css/jetbrains-mono", // URL cdnfonts yang valid
  cssVariable: "--kelir-font-active", // Variabel CSS global yang diatur oleh Provider
} as const;
```

### Langkah 2: Daftarkan di `src/views/kelir/types.ts`
Tambahkan slug font baru ke dalam tipe data global `Font`:
```typescript
export type Font = "product-sans" | "jetbrains-mono";
```

### Langkah 3: Daftarkan di `src/views/kelir/registry.ts`
Impor dan masukkan font baru tersebut ke dalam `fontRegistry`:
```typescript
import { jetbrainsMono } from "./fonts/jetbrains-mono";

export const fontRegistry = {
  "product-sans": productSans,
  "jetbrains-mono": jetbrainsMono,
} as const;
```

### Langkah 4: Perbarui Menu Pilihan di `src/views/kelir/KelirProvider.tsx`
Agar font baru tersebut muncul dalam elemen selektor switcher secara otomatis saat runtime, tambahkan ke dalam `fontsList`:
```typescript
const fontsList = React.useMemo(() => [
  { slug: "product-sans" as Font, family: "Product Sans" },
  { slug: "jetbrains-mono" as Font, family: "JetBrains Mono" },
], []);
```

---

## 3. PANDUAN LANGKAH: MENAMBAHKAN TEMA BARU

Misalnya Anda ingin menambahkan tema baru berbasis **Glassmorphism** dengan file tokens `DESIGN.md`:

### Langkah 1: Buat Folder Tema di `src/views/kelir/themes/`
Buat folder baru bernama `src/views/kelir/themes/glassmorphism/`.

### Langkah 2: Letakkan `DESIGN.md` & Buat Parser Tokens
1. Tulis `DESIGN.md` yang memuat YAML Frontmatter di bagian atas berisi nilai-nilai warna, radius, dan tipografi spesifik tema baru tersebut.
2. Buat file `tokens.ts` di dalam folder tema baru tersebut untuk mengekstrak data dari YAML tersebut menjadi objek JSON yang siap digunakan oleh komponen Anda.
   *(Contoh pemetaan token warna murni datar seperti warna primer, sekunder, latar belakang, teks, sudut membulat, dan bayangan).*

### Langkah 3: Implementasikan Komponen Spesifik Tema
Tulis implementasi UI komponen di dalam `themes/glassmorphism/` (misalnya `button.tsx`, `card.tsx`, dll) dengan memanfaatkan token-token yang telah didefinisikan sebelumnya. Komponen ini harus menerima properti standar yang ditentukan di dalam `src/views/kelir/types.ts`.

### Langkah 4: Daftarkan Tema di `src/views/kelir/types.ts`
Tambahkan slug tema baru Anda ke dalam tipe data global `Theme`:
```typescript
export type Theme = "neumorphism" | "glassmorphism";
```

### Langkah 5: Daftarkan Tema di `src/views/kelir/registry.ts`
Impor token tema baru Anda dan daftarkan ke dalam `themeRegistry`:
```typescript
import { tokens as glassmorphismTokens } from "./themes/glassmorphism/tokens";

export const themeRegistry = {
  neumorphism: {
    slug: "neumorphism",
    label: "Neumorphism",
    tokens: neumorphismTokens,
  },
  glassmorphism: {
    slug: "glassmorphism",
    label: "Glassmorphism",
    tokens: glassmorphismTokens,
  },
} as const;
```

### Langkah 6: Perbarui Daftar Tema di `src/views/kelir/KelirProvider.tsx`
Daftarkan tema tersebut di dalam `themesList` agar dideteksi oleh `KelirSwitcher`:
```typescript
const themesList = React.useMemo(() => [
  { slug: "neumorphism" as Theme, label: "Neumorphism" },
  { slug: "glassmorphism" as Theme, label: "Glassmorphism" },
], []);
```

### Langkah 7: Hubungkan Komponen Proxy di `src/views/kelir/components/`
Terakhir, hubungkan komponen proxy agar merender visual komponen yang sesuai ketika tema aktif terpilih.
Contoh pada `src/views/kelir/components/Button.tsx`:

```tsx
import { Button as NeumorphismButton } from "../themes/neumorphism/button";
import { Button as GlassmorphismButton } from "../themes/glassmorphism/button";

export function Button(props: ButtonProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismButton {...props} />;
  }
  if (theme === "glassmorphism") {
    return <GlassmorphismButton {...props} />;
  }

  return null;
}
```

---

## 4. PRINSIP UTAMA SAAT EKSPANSI
1. **Konsistensi API:** Pastikan setiap komponen tema baru mengimplementasikan properti (`Props`) yang sama dari `src/views/kelir/types.ts` agar tidak merusak kode pengonsumsi (*consumer-side*).
2. **Keamanan DOM Regex:** Saat memuat CDN Font dari luar, pastikan aturan regex aman Anda di `KelirProvider.tsx` (`CDN_FONT_REGEX`) diperbarui agar mendukung URL domain CDN baru jika Anda tidak menggunakan `cdnfonts.com`.
3. **No Barrel Policy:** Tetap pertahankan impor langsung (*direct-path loading*) tanpa membuat file index.ts untuk memelihara performa tree-shaking yang optimal.
