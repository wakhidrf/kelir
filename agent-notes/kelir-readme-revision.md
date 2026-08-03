# Dokumentasi Revisi README.md untuk Submodul Kelir

Dokumen ini dirancang sebagai usulan revisi penuh untuk berkas `README.md` di dalam submodul **Kelir**. Revisi ini menyempurnakan dokumentasi instalasi, integrasi Next.js/bundler modern, serta pemakaian komponen agar ramah bagi pengembang (*developer-friendly*) dan aman secara integrasi.

---

```markdown
# Kelir — Design System & Custom Themes

Kelir adalah sebuah design system berbasis **React** yang menyajikan **rombak estetika total** di setiap tema (layout, radius, shadow, spacing, tipografi) murni di atas **MUI (`@mui/material`) + `@mui/icons-material`**.

Didistribusikan secara efisien sebagai **Git Submodule** (bukan npm package maupun CLI) untuk optimalisasi penuh serta kustomisasi mendalam.

---

## Fitur Utama

1. **Tema Neumorphism Lengkap:** Estetika 3D lembut tahun 2020 dengan efek timbul/tenggelam (*convex* & *concave*), shadow ganda presisi, dan sudut melingkar konsisten.
2. **Sistem Font Independen:** Memisahkan font dari tema melalui pemuatan dinamis dari `cdnfonts.com` secara langsung saat runtime dilengkapi proteksi regex untuk sanitisasi input font (Mencegah DOM XSS).
3. **Optimisasi Tree-Shaking Maksimal:** Struktur modul dirancang tanpa barrel file (`index.ts`) untuk menjamin Next.js hanya membundel komponen yang benar-benar digunakan.
4. **Keamanan SSR-Safe:** Komponen dirancang transparan dengan proteksi lingkungan runtime browser (`typeof window !== 'undefined'`) untuk mencegah crash saat SSR.

---

## 1. Prasyarat & Instalasi Dependency

Sebelum menggunakan Kelir, pastikan proyek Anda telah memiliki pustaka peer dependency yang diperlukan.

### Pasang Peer Dependencies:
```bash
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled --legacy-peer-deps
```

### Tambahkan Kelir ke Folder Proyek Anda sebagai Submodule:
```bash
git submodule add https://github.com/wakhidrf/kelir src/views/kelir
git submodule update --init --recursive
```

---

## 2. Langkah Integrasi Krusial (Khusus Next.js / TypeScript)

Karena submodul Kelir ditulis menggunakan standar ESM modern yang menyertakan ekstensi `.js` pada pernyataan `import` lokalnya (misalnya `./KelirProvider.js`), Anda **wajib** memberi tahu bundler Next.js Anda agar memetakan ekstensi tersebut ke file fisik `.ts`/`.tsx` di disk.

### Perbarui `next.config.ts` (atau `next.config.js`) Anda:
Tambahkan konfigator Webpack `resolve.extensionAlias` berikut:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  typescript: {
    // Mengabaikan error tipe data internal submodule eksternal saat kompilasi
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.resolve.extensionAlias = {
      ".js": [".ts", ".tsx", ".js", ".jsx"],
    };
    return config;
  },
};

export default nextConfig;
```

### Jalankan Pembangunan Aplikasi dengan Webpack:
Gunakan flag `--webpack` pada skrip pembangunan di `package.json` agar Next.js berjalan di atas Webpack secara stabil:
```json
"scripts": {
  "dev": "next dev --webpack",
  "build": "next build --webpack"
}
```

---

## 3. Cara Pemakaian Komponen

Bungkus aplikasi Anda menggunakan `KelirProvider` di root layout Anda, lalu gunakan `KelirSwitcher` untuk mengubah tema & font secara langsung saat runtime.

### Contoh Implementasi (`src/app/page.tsx`):
```tsx
"use client";

import * as React from "react";
import { KelirProvider } from "@/views/kelir/KelirProvider";
import { KelirSwitcher } from "@/views/kelir/switcher";
import { Button } from "@/views/kelir/components/Button";
import { Card } from "@/views/kelir/components/Card";

export default function App() {
  return (
    <KelirProvider defaultTheme="neumorphism" defaultFont="product-sans">
      <div style={{ padding: "32px", background: "var(--color-background)", minHeight: "100vh" }}>

        {/* Tombol Pengubah Tema & Font */}
        <div style={{ marginBottom: "24px" }}>
          <KelirSwitcher />
        </div>

        {/* Contoh Kartu Kelir */}
        <Card title="Selamat Datang di Kelir" subtitle="Kelir Theme System">
          <p style={{ margin: "12px 0", color: "var(--color-text-secondary)" }}>
            Nikmati rombak visual total neumorphic tanpa merusak API standar MUI.
          </p>
          <Button variant="primary">Mulai Sekarang</Button>
        </Card>

      </div>
    </KelirProvider>
  );
}
```

---

## Pernyataan Hukum & Lisensi Font
Font di-load secara dinamis dari CDN pihak ketiga (`cdnfonts.com`) secara "as-is" dan tidak diredistribusikan secara fisik di dalam repositori ini. Penggunaan komersial font diserahkan kepada kebijakan lisensi masing-masing vendor font.
```
