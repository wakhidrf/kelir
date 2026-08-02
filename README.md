# Kelir — Design System & Custom Themes

Kelir adalah sebuah design system berbasis **React** yang meniadakan model "satu palet warna diubah-ubah" demi menyajikan **rombak estetika total** di setiap tema (layout, radius, shadow, spacing, tipografi).

Project ini dibangun murni di atas **MUI (`@mui/material`) + `@mui/icons-material`** dan didistribusikan sebagai **Git Submodule** (bukan npm package maupun CLI).

---

## Fitur Utama

1. **Tema Neumorphism Lengkap:** Estetika 3D lembut tahun 2020 dengan efek timbul/tenggelam (*convex* & *concave*), shadow ganda presisi, dan sudut melingkar konsisten.
2. **Sistem Font Independen:** Memisahkan font dari tema melalui pemuatan dinamis cdnfonts secara langsung saat runtime. Dilengkapi proteksi regex untuk sanitisasi input font.
3. **Tanpa Barrel `index.ts`:** Menggunakan pola import jalur langsung (*direct path loading*) untuk menjamin *tree-shaking* yang maksimal.
4. **Proxy Component Pattern:** Menghubungkan consumer dengan file tema internal secara transparan, aman dari SSR crash.
5. **63 Komponen Siap Pakai:** Dari tombol, kartu, input, hingga komponen chat modern dan layout sidebar.

---

## Cara Instalasi via Git Submodule

Tambahkan Kelir ke folder project Anda sebagai submodule:

```bash
git submodule add https://github.com/wakhidrf/kelir src/kelir
git submodule update --init --recursive
```

---

## Cara Pemakaian

Bungkus aplikasi Anda menggunakan `KelirProvider` dan letakkan `KelirSwitcher` untuk mengubah tema & font secara langsung saat runtime:

```tsx
import * as React from "react";
import { KelirProvider } from "./kelir/KelirProvider.js";
import { KelirSwitcher } from "./kelir/switcher.js";
import { Button } from "./kelir/components/Button.js";
import { Card } from "./kelir/components/Card.js";

export function App() {
  return (
    <KelirProvider defaultTheme="neumorphism" defaultFont="product-sans">
      <div style={{ padding: "32px", background: "var(--color-background)" }}>
        <KelirSwitcher />

        <Card title="Selamat Datang" subtitle="Kelir Theme System">
          <p>Nikmati rombak visual total tanpa merusak API.</p>
          <Button variant="primary">Mulai Sekarang</Button>
        </Card>
      </div>
    </KelirProvider>
  );
}
```

---

## Pernyataan Hukum & Lisensi Font
Font di-load secara dinamis dari CDN pihak ketiga (cdnfonts) secara "as-is" dan tidak diredistribusikan secara fisik di dalam repositori ini. Penggunaan komersial font diserahkan kepada kebijakan lisensi masing-masing vendor font.
