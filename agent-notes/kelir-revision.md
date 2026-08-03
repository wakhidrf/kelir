# Panduan Revisi Teknis Untuk Submodul Kelir (src/views/kelir)

Dokumen ini menjelaskan perbaikan krusial yang perlu dilakukan secara langsung di dalam repositori submodule **Kelir** agar dapat dikompilasi dengan sukses pada Next.js (baik menggunakan Turbopack maupun Webpack default) tanpa memerlukan penyesuaian/konfigurasi tambahan dari luar.

---

## REVISI 1: Perbaikan Masalah Kompilasi TypeScript pada Komponen Breadcrumb

### Gejala Masalah (Error)
Saat proses kompilasi TypeScript (`tsc` atau `next build`), muncul kesalahan berikut:
```
Property 'children' does not exist on type 'BreadcrumbProps'
```

### Penyebab Masalah
1. Di file `src/views/kelir/types.ts`, tipe `BreadcrumbProps` mengekstensi `Omit<MuiBreadcrumbsProps, "children">`:
   ```typescript
   export interface BreadcrumbProps extends Omit<MuiBreadcrumbsProps, "children"> {
     items: { label: React.ReactNode; href?: string; active?: boolean }[];
   }
   ```
2. Namun, di dalam berkas implementasi `src/views/kelir/themes/neumorphism/breadcrumb.tsx` baris ke-30, komponen merender `props.children`:
   ```tsx
   {props.children || "Neumorphic design system component."}
   ```
   Hal ini menyebabkan bentrokan tipe karena `children` telah dihapus secara eksplisit dari tipe `BreadcrumbProps`.

### Solusi Perbaikan
Ubah file `src/views/kelir/types.ts` pada bagian deklarasi `BreadcrumbProps` menjadi:
```typescript
// Hilangkan Omit "children" agar komponen dapat menyokong properti children secara legal
export interface BreadcrumbProps extends MuiBreadcrumbsProps {
  items: { label: React.ReactNode; href?: string; active?: boolean }[];
}
```

---

## REVISI 2: Perbaikan Masalah Resolusi Impor Lokal (Ekstensi `.js`)

### Gejala Masalah (Error)
Saat menjalankan `next dev` atau `next build`, bundler (terutama Turbopack) melayangkan pesan kesalahan kegagalan resolusi modul:
```
Module not found: Can't resolve './KelirProvider.js'
```

### Penyebab Masalah
Seluruh file di dalam folder Kelir melakukan impor lokal menggunakan ekstensi `.js` secara eksplisit, misalnya:
- `import { useKelir } from "./KelirProvider.js";` di `switcher.tsx`
- `import { fontRegistry } from "./registry.js";` di `KelirProvider.tsx`
- `import { Button as NeumorphismButton } from "../themes/neumorphism/button.js";` di `components/Button.tsx`

Pada runtime bundler (seperti Next.js), bundler mencoba mencari berkas fisik `.js` yang tidak pernah ada di dalam disk (karena file tersebut bermigrasi dari `.ts` atau `.tsx` yang belum terkompilasi secara fisik ke JS di dalam struktur Next.js).

### Solusi Perbaikan
Hapus semua ekstensi `.js` dari string pencarian impor (*extensionless imports*) di seluruh file di dalam `src/views/kelir/`. Berikut adalah peta perbaikan berkas-berkas utama:

1. **Pada `src/views/kelir/KelirProvider.tsx`:**
   - Ubah `import { Theme, Font, KelirContextValue } from "./types.js";` menjadi:
     ```typescript
     import { Theme, Font, KelirContextValue } from "./types";
     ```
   - Ubah `import { themeRegistry, fontRegistry } from "./registry.js";` menjadi:
     ```typescript
     import { themeRegistry, fontRegistry } from "./registry";
     ```

2. **Pada `src/views/kelir/switcher.tsx`:**
   - Ubah `import { useKelir } from "./KelirProvider.js";` menjadi:
     ```typescript
     import { useKelir } from "./KelirProvider";
     ```
   - Ubah `import { Theme, Font, KelirContextValue } from "./types.js";` (jika ada) menjadi tanpa `.js`.

3. **Pada `src/views/kelir/registry.ts`:**
   - Ubah `import { tokens as neumorphismTokens } from "./themes/neumorphism/tokens.js";` menjadi:
     ```typescript
     import { tokens as neumorphismTokens } from "./themes/neumorphism/tokens";
     ```
   - Ubah `import { productSans } from "./fonts/product-sans.js";` menjadi:
     ```typescript
     import { productSans } from "./fonts/product-sans";
     ```

4. **Pada semua berkas proxy di dalam `src/views/kelir/components/`:**
   Contoh untuk `src/views/kelir/components/Button.tsx`:
   - Ubah `import { useKelir } from "../KelirProvider.js";` menjadi:
     ```typescript
     import { useKelir } from "../KelirProvider";
     ```
   - Ubah `import { ButtonProps } from "../types.js";` menjadi:
     ```typescript
     import { ButtonProps } from "../types";
     ```
   - Ubah `import { Button as NeumorphismButton } from "../themes/neumorphism/button.js";` menjadi:
     ```typescript
     import { Button as NeumorphismButton } from "../themes/neumorphism/button";
     ```
   *(Terapkan penghapusan `.js` yang sama di semua berkas komponen lainnya di folder `src/views/kelir/components/`)*

Dengan mengadopsi standar impor tanpa ekstensi, submodul Kelir akan menjadi pustaka komponen (*component library*) yang sangat portabel dan kompatibel sepenuhnya dengan seluruh konfigurasi Next.js standar.
