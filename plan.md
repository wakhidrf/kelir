# Kelir — Plan

Kelir adalah tiruan shadcn/ui, tapi alih-alih satu design system dengan varian warna, setiap **tema** adalah rombakan UI total (layout, radius, shadow, spacing, tipografi, motion) — bukan sekadar palet warna. Ganti tema = ganti "kepribadian" UI sepenuhnya.

---

## 1. Rekomendasi Stack (fleksibel, Jules boleh sesuaikan)

- **Bahasa**: TypeScript
- **Base**: React library murni (tanpa lock ke Next.js/Vite).
- **Model distribusi**: **Git Submodule** — BUKAN npm package, BUKAN CLI ala shadcn. Repo `wakhidrf/kelir` di GitHub berisi source lengkap (`themes/`, `fonts/`, `kelir/`, `switcher.tsx`), dan konsumen menambahkannya langsung ke project mereka via `git submodule add https://github.com/wakhidrf/kelir <path>`. Lihat detail di §1.1.
- **Styling engine / base component library**: **MUI (`@mui/material`) + `@mui/icons-material`**, BUKAN CSS Modules/vanilla-extract mentah. Lihat detail integrasi di §1.3.
- **Build tool**: Tidak perlu build/bundle step untuk publish (karena bukan npm package) — source `.ts`/`.tsx` di-compile langsung oleh bundler project konsumen (Next.js/Vite dst), sama seperti kalau itu source code sendiri.
- **Font loading**: TIDAK di-bundle. Kelir cuma simpan referensi `@import url(...)` dari cdnfonts per font (lihat §6) dan inject ke `<head>` saat runtime, sehingga file font fisik di-fetch langsung oleh browser user dari CDN cdnfonts — bukan bagian dari repo Kelir. Ini yang bikin ukuran source tetap kecil walau tambah banyak font/tema.

Jules bebas ganti pilihan di atas, tapi disarankan tetap **framework-agnostic di level komponen inti**, supaya theme switching tidak terikat satu meta-framework.

---

## 1.3 Base Component Library: MUI

Semua komponen di tiap `themes/<tema>/*.tsx` dibangun di atas `@mui/material` (bukan HTML mentah), dan semua ikon pakai `@mui/icons-material` (seragam di semua tema, menimpa preferensi icon library apa pun yang disebut di `DESIGN.md` — sama perlakuannya kayak font di §3/§6, karena ini keputusan sistem-wide, bukan per-tema).

**Kenapa ini cocok dengan arsitektur Kelir:**
- MUI sudah punya sistem `createTheme()` dengan `palette.mode: "light" | "dark"` bawaan — pas banget disandingkan sama state `variant` di `KelirProvider`. Nggak perlu bikin light/dark switching dari nol.
- `createTheme()` juga punya `typography.fontFamily`, `shape.borderRadius`, `spacing`, dan `components` (buat override default style tiap MUI component secara global per tema) — ini semua bisa di-generate otomatis dari `tokens.ts` tiap tema.
- Karena tiap tema override `components` MUI secara berbeda-beda (lewat `theme.components.MuiButton.styleOverrides`, dst), "rombak total UI" tetap tercapai walau based di komponen yang sama (`Button` dari MUI), bukan HTML custom dari nol.

**Bagaimana ini terhubung ke `KelirProvider`:**

```tsx
// KelirProvider.tsx
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";

function KelirProvider({ children, defaultTheme, defaultVariant, defaultFont }: Props) {
  const { theme, variant, font, /* ...setters */ } = useKelirState(defaultTheme, defaultVariant, defaultFont);

  const muiTheme = useMemo(() => {
    const tokens = themeRegistry[theme].tokens; // dari tokens.ts tema aktif
    return createTheme({
      palette: {
        mode: variant,                           // "light" | "dark" — otomatis dari state variant
        primary: { main: tokens.colors[variant].primary },
        secondary: { main: tokens.colors[variant].secondary },
        // ...
      },
      typography: {
        fontFamily: "var(--kelir-font-active)",  // tetap ikut font independen (§6), BUKAN dari DESIGN.md
      },
      shape: { borderRadius: parseInt(tokens.rounded.sm) },
      components: tokens.muiOverrides,           // hasil generate dari section "Components" di DESIGN.md
    });
  }, [theme, variant]);

  return (
    <KelirContext.Provider value={{ theme, variant, font, /* ...setters */ }}>
      <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>
    </KelirContext.Provider>
  );
}
```

Catatan penting: **MUI juga punya komponen bernama `ThemeProvider`** — ini alasan kuat kenapa penamaan `KelirProvider` (bukan `ThemeProvider`) di Kelir itu tepat, supaya tidak collision/ambigu waktu keduanya dipakai bersamaan (seperti contoh di atas, `MuiThemeProvider` dipakai sebagai alias import).

**Konsekuensi ke §5 (kontrak komponen):** props interface tiap komponen (`ButtonProps`, dst) sebaiknya **extend props asli MUI** (`import { ButtonProps as MuiButtonProps } from "@mui/material/Button"`), supaya consumer dapat semua kapabilitas MUI standar (event handler, accessibility props, dst) plus custom props Kelir kalau ada. Implementasi internal tiap tema (`themes/<tema>/button.tsx`) pakai `styled(MuiButton)(...)` atau `sx` prop buat override visual sesuai `DESIGN.md` tema itu.

**Konsekuensi ke §3 (DESIGN.md):** section `components.*` di frontmatter YAML sebaiknya nantinya bisa dipetakan langsung jadi `theme.components.MuiButton.styleOverrides` dkk saat generate `tokens.ts` — ini kerjaan tambahan untuk resolver token-ke-MUI-theme yang perlu ditulis Jules.

---

## 1.1 Model Distribusi: Git Submodule

**Kenapa bukan npm package atau CLI shadcn:** npm package butuh publish + versioning + bundling terpisah (ribet untuk source yang isinya banyak tema sekaligus). CLI ala shadcn (copy 1 tema ke project) bikin runtime switching antar tema jadi tidak mungkin, karena cuma 1 tema yang ke-copy. Git submodule menyelesaikan dua-duanya: seluruh source (semua tema) langsung ada di dalam project konsumen sebagai folder biasa, jadi `switcher.tsx` bisa dynamic-import antar tema secara runtime TANPA perlu package terpisah.

**Cara konsumen pasang:**
```bash
git submodule add https://github.com/wakhidrf/kelir src/kelir
git submodule update --init --recursive
```

**Cara konsumen pakai** (import langsung per file, TIDAK ada barrel/entry file — lihat §1.2 kenapa):
```tsx
import { KelirProvider } from "../kelir/KelirProvider";
import { Button } from "../kelir/components/Button";
import { KelirSwitcher } from "../kelir/switcher";

<KelirProvider theme="brutalist" variant="dark" font="product-sans">
  <Button variant="primary">Klik</Button>
  <KelirSwitcher /> {/* taruh di navbar, sidebar, mana saja */}
</KelirProvider>
```

**Update tema:** konsumen tinggal `git submodule update --remote` untuk narik versi terbaru dari repo `wakhidrf/kelir` — tidak ada `npm update` atau versi package terpisah untuk dikelola.

**Konsekuensi desain:**
- Tidak perlu `package.json` dengan `name`/`exports` map untuk publish.
- **Tidak ada `index.ts` sebagai entry point** (lihat §1.2) — konsumen import tiap file langsung by path.
- Tidak perlu CLI (`npx kelir add ...`) sama sekali — semua tema otomatis ikut ter-clone lewat submodule, user tinggal pilih lewat prop di `KelirProvider`.
- Karena semua source ikut masuk ke repo konsumen, ukuran repo konsumen akan bertambah sesuai jumlah tema di Kelir (tapi tetap kecil karena font tidak dibundle — lihat §6).
- Konsumen yang cuma butuh 1-2 tema tetap dapat semua tema lewat submodule (tidak ada tree-shaking di level source), tapi bundler (Next.js/Vite) tetap bisa tree-shake di level akhir kalau proxy component pakai lazy-loading per tema (lihat §7) — jadi bundle JS akhir tetap cuma include tema yang benar-benar dipakai runtime.

---

## 1.2 Tanpa `index.ts` — Import Langsung Per Path

User secara eksplisit tidak mau ada file `index.ts` (barrel/re-export file) di mana pun dalam struktur Kelir — baik di root, di tiap folder tema, maupun di `kelir/`. Konsekuensinya:

- **Tidak ada satu pintu masuk** seperti `import { Button, Card, KelirProvider } from "kelir"`. Setiap hal diimpor dari file aslinya langsung, pakai path relatif (`./` atau `../`) sesuai lokasi submodule di-mount.
- Proxy component (§7) tetap ada di `components/<Nama>.tsx` satu file per komponen — ini yang diimpor konsumen, BUKAN file tema (`themes/<tema>/button.tsx`) yang cuma dipakai internal oleh proxy.
- `themes/<tema>/` juga tidak punya `index.ts` re-export lagi — proxy component di `components/` yang tahu cara resolve ke file tema yang tepat (lewat `registry.ts` + dynamic `import()` langsung ke path filenya, mis. `import(\`../themes/${theme}/button\`)`).
- Trade-off: konsumen butuh tahu path spesifik tiap yang mereka import (sedikit lebih verbose), tapi lebih eksplisit/predictable dan menghindari 1 file raksasa yang re-export semuanya (yang biasanya bikin bundler susah tree-shake dengan optimal).

---

## 2. Struktur Folder

```
Kelir/
├── themes/
│   └── <nama-tema>/                  # slug tema, contoh: "brutalist", "glass", "neumorphism"
│       ├── DESIGN.md                 # wajib pertama — spesifikasi desain tema ini
│       ├── changelog.txt             # wajib kedua — riwayat perubahan tema
│       ├── tokens.ts                 # design tokens tema (warna light+dark, radius, spacing, shadow, motion)
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── ... (komponen lain, 1 file per komponen — TANPA index.ts re-export)
│
├── fonts/
│   ├── product-sans.ts               # 1 file per font, lihat §6 — daftar font GLOBAL, tidak terikat tema manapun
│   └── plush-trial.ts
│
├── types.ts                          # kontrak/interface yang WAJIB dipatuhi tiap tema
├── registry.ts                       # daftar semua tema + daftar semua font yang terdaftar (auto atau manual)
├── KelirProvider.tsx                 # context provider: state tema + variant (light/dark) + font aktif
├── components/
│   ├── Button.tsx                    # proxy component — INI yang diimpor konsumen
│   ├── Card.tsx
│   └── ... (1 proxy per jenis komponen, resolve ke themes/<tema>/*.tsx saat runtime)
│
└── switcher.tsx                       # UI component siap-pasang: pilih tema + variant + font sekaligus
```

**Tidak ada wrapper folder tambahan** (bukan `core/`, bukan `kelir/` di dalam repo Kelir) — repo-nya sendiri sudah bernama Kelir (biasanya di-mount konsumen sebagai `src/kelir` via submodule), jadi isi yang "tidak terikat tema/font" cukup taruh langsung di root, sejajar `themes/` dan `fonts/`. Ini menghindari nesting ganda (`kelir/kelir/...`) yang membingungkan. **Tidak ada `index.ts` di mana pun** — lihat §1.2 untuk alasan & konsekuensinya.

### Aturan struktur `themes/<nama-tema>/`
Urutan wajib ada (sesuai permintaan): 
1. `DESIGN.md` — spek desain
2. `changelog.txt` — histori perubahan
3. baru file komponen (`button.tsx`, `card.tsx`, dst.)

---

## 3. Format `DESIGN.md` (kontrak resmi — WAJIB diikuti persis)

Ini adalah skema final yang Jules harus paham & auto-generate temanya begitu diberi file `DESIGN.md` bergaya ini (contoh nyata, sudah diverifikasi user):

```markdown
---
version: "alpha"
name: "Neumorphism"
description: "Neumorphic UI with soft 3D effects. Ideal for modern apps, dashboards..."
colors:
  light:
    primary: "#C8E0F4"
    secondary: "#F5E0E8"
    tertiary: "#E8E8E8"
  dark:
    primary: "#3A5A73"
    secondary: "#6B4A56"
    tertiary: "#2A2A2A"

typography:
  h1:
    fontFamily: -apple-system, sans-serif   # DIABAIKAN saat runtime — lihat catatan di bawah
    fontSize: 2.25rem
    fontWeight: 700
  body-md:
    fontFamily: -apple-system, sans-serif   # DIABAIKAN saat runtime
    fontSize: 1rem
    fontWeight: 400
  label-caps:
    fontFamily: -apple-system, sans-serif   # DIABAIKAN saat runtime
    fontSize: 0.75rem
    fontWeight: 500
rounded:
  sm: 14px
  md: 28px
  lg: 42px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: 12px
---
```

> **Penting soal `typography.*.fontFamily`**: field ini WAJIB tetap ditulis di `DESIGN.md` (untuk `fontSize`/`fontWeight`-nya, dan sebagai dokumentasi font "default" yang dibayangkan desainer tema), TAPI **nilainya diabaikan saat runtime**. Font aktual yang tampil ditentukan sepenuhnya oleh pilihan font di `KelirSwitcher` (§6 & §7), independen dari tema — user bisa pakai tema Neumorphism dengan font apapun yang terdaftar di `fonts/`, bukan cuma yang disebut di `DESIGN.md` ini.

> **Penting soal `colors`**: struktur WAJIB punya sub-key `light` dan `dark` (bukan flat seperti draft awal). Variant (light/dark) dipilih independen dari tema lewat `KelirSwitcher` — jadi 1 tema = 1 `DESIGN.md`, tapi tetap render 2 mode berbeda tergantung variant yang aktif. Kalau desainer tema belum sempat bikin palet dark, minimal isi `dark` dengan derivasi otomatis (mis. invert lightness) sebagai fallback sementara — catat ini di `changelog.txt`.

```markdown
## Overview
(deskripsi panjang, filosofi, konteks historis tema — bebas prosa)

## Colors
(daftar warna + peran masing-masing, boleh lebih detail dari frontmatter)

## Typography
(skala lengkap: Hero/Display, Body, UI Labels, Monospace, dst)

## Layout
(grid, spacing rhythm, breakpoint, z-index contract)

## Elevation & Depth
(shadow, motion/animation timing)

## Shapes
(corner radius base & scale)

## Components
(spesifikasi tiap komponen: button, card, input, navigation, skeleton, empty state, dst)

## Do's and Don'ts
(aturan eksplisit yang harus dipatuhi/dihindari saat generate komponen)

## Use Case
(target pemakaian tema ini)
```

### Cara Jules memproses `DESIGN.md` ini menjadi tema jalan:

1. **Parse frontmatter YAML** → ini sumber kebenaran mesin-baca, langsung dipetakan 1:1 ke `tokens.ts`:
   - `colors.light.*` dan `colors.dark.*` → 2 set CSS variables warna (`--color-primary` di-swap isinya tergantung variant aktif, bukan 2 variable terpisah — lihat §7 soal cara switcher apply ini)
   - `typography.*.fontSize` / `typography.*.fontWeight` → CSS variables tipografi per role (`--font-h1-size`, `--font-h1-weight`, dst) — perhatikan penamaan role bisa bervariasi antar tema (`h1`, `body-md`, `label-caps`, dst), jadi `tokens.ts` harus fleksibel/dynamic key, bukan fixed union. **`typography.*.fontFamily` TIDAK dipetakan ke tokens** — nilai ini diabaikan, font aktual datang dari pilihan di `KelirSwitcher` (lihat §6).
   - `rounded.*` → CSS variables radius (`--radius-sm`, `--radius-md`, `--radius-lg`)
   - `components.*` → default styling per komponen, termasuk referensi `{colors.primary}` / `{rounded.sm}` yang HARUS di-resolve (token reference resolver) ke nilai aslinya saat generate `tokens.ts` — resolve `{colors.primary}` ke variant yang lagi aktif (light atau dark).
2. **Body markdown** (setelah frontmatter kedua `---`) → dibaca Jules sebagai **spesifikasi kualitatif/prosa** untuk menentukan detail yang tidak ada di YAML: animasi (durasi & easing di "Elevation & Depth"), layout pattern ("Layout"), dan terutama section **"Do's and Don'ts"** yang jadi aturan keras saat Jules menulis komponen `.tsx`-nya (mis. "No pure black", "No `h-screen`", radius harus 12-16px, dst).
3. **Section "Components"** di body jadi spek detail per komponen (state hover/active/focus, variant) yang dipakai Jules untuk menulis `button.tsx`, `card.tsx`, `input.tsx` sesuai kontrak `types.ts` (lihat §5), tapi styling & markup internal ikut spek di sini.
4. **Section "Typography"** di body sering menyebut nama font non-system (mis. "JetBrains Mono" untuk monospace) — ini **cuma dokumentasi/rekomendasi desainer tema**, BUKAN yang dipakai runtime. Kalau Jules mau tema ini punya font "default" yang bagus dipilih user di switcher, pastikan font tsb sudah terdaftar di `fonts/` (§6) — tapi user tetap bebas ganti ke font lain lewat `KelirSwitcher` kapan saja.

Ringkasnya: **frontmatter → `tokens.ts` (mekanis)**, **body → aturan & detail komponen (interpretatif tapi harus dipatuhi ketat, terutama "Do's and Don'ts")**.

---

## 4. Format `changelog.txt`

Format sederhana, per-tema (bukan changelog global project):

```
## 1.1.0 - 2026-08-02
- Ubah radius card dari 4px ke 0px
- Tambah varian Button "ghost"

## 1.0.0 - 2026-07-15
- Rilis awal tema Brutalist
```

---

## 5. Kontrak Komponen (`types.ts`)

Supaya `switcher.tsx` bisa ganti tema tanpa breaking, semua tema harus mengimplementasikan interface/prop yang sama per komponen, walau tampilan & DOM internal boleh beda total. Contoh:

```ts
export interface ButtonProps {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
```

Tiap `themes/<tema>/button.tsx` wajib menerima props ini, tapi bebas total soal implementasi visual/markup di dalamnya (ini yang bikin "rombak total UI" bisa terjadi tanpa merusak API consumer).

### Batasan penting: kontrak cuma jamin "tidak crash", BUKAN "tetap kelihatan bagus"

Karena tiap tema bisa punya kebutuhan visual yang beda jauh (mis. tema neumorphic/glass butuh `icon`/`image` biar nggak keliatan kosong, sementara tema minimalis nggak butuh), switch tema bisa menghasilkan tampilan yang kelihatan "pincang" walau secara teknis tidak error. Ini trade-off yang melekat pada konsep "rombak total", tidak bisa dihilangkan 100%, tapi bisa dikurangi dengan aturan berikut:

- **Semua field non-esensial di kontrak props HARUS opsional** (`icon?`, `image?`, dst), bukan wajib. Tema yang butuh, pakai; tema yang nggak butuh, abaikan.
- **Tema WAJIB punya fallback/default graceful** kalau prop opsional tidak diisi (mis. `Card` neumorphic tanpa `image` → render placeholder/gradient generik, JANGAN biarkan layout bolong/pecah).
- **Lebih prioritaskan pola composition/slot** (`children`, `<Card.Header>`, dst) dibanding banyak prop spesifik-tema — biar struktur konten fleksibel ikut tema tanpa consumer perlu tahu detail per tema.
- **Testing di roadmap langkah 6** (2 tema yang sangat berbeda, §8) justru dirancang buat nemuin mismatch kayak gini lebih awal — kalau ternyata ada prop yang cuma "kepake" di 1 tema doang, itu sinyal kontraknya perlu direvisi (jadi lebih generic) atau prop itu dipindah jadi bagian dari `children`/slot.
- Dokumentasikan di `DESIGN.md` tiap tema (section "Components") kalau ada requirement visual spesifik tema itu, supaya predictable buat siapa pun yang nulis komponennya nanti.

---

## 6. Sistem Font (`fonts/<nama-font>.ts`) — Registry Global, Independen dari Tema

**Penting:** font di Kelir **tidak terikat ke tema manapun**. `fonts/` adalah daftar global semua font yang tersedia untuk dipilih user lewat `KelirSwitcher`, terlepas dari tema apa yang lagi aktif. `typography.fontFamily` di `DESIGN.md` (§3) cuma dokumentasi, diabaikan saat runtime.

**Kelir tidak men-scrape/mendownload file font fisik.** Cukup simpan URL `@import` dari cdnfonts, lalu inject sebagai `<link>` ke `<head>` saat font tsb dipilih. Browser pengguna yang fetch langsung dari CDN cdnfonts saat runtime — jadi ukuran source Kelir tetap kecil walau daftar font bertambah banyak (font fisik `.woff`/`.woff2` tidak pernah masuk repo Kelir, tetap di-host cdnfonts).

Format file:

```ts
// fonts/product-sans.ts
export const productSans = {
  slug: "product-sans",                // dipakai sebagai key registry & value di selector switcher
  family: "Product Sans",              // persis dari deklarasi font-family user
  fallback: "sans-serif",              // persis dari deklarasi font-family user
  importUrl: "https://fonts.cdnfonts.com/css/product-sans",
  cssVariable: "--kelir-font-active",  // SATU variable global, di-overwrite tiap ganti font (bukan 1 variable per font)
} as const;
```

**Input yang dibutuhkan Jules per font (cukup 2 baris, biasa langsung disalin dari halaman cdnfonts):**
1. `@import url('https://fonts.cdnfonts.com/css/product-sans');` → jadi `importUrl`
2. `font-family: 'Product Sans', sans-serif;` → dipecah jadi `family` dan `fallback`

Cara Jules memprosesnya:
- **Prioritaskan deklarasi `font-family` eksplisit** untuk `family` & `fallback` — jangan menebak dari slug URL kalau info ini sudah tersedia.
- Slug URL (`product-sans`) dipakai untuk penamaan file dan sebagai value unik di dropdown font `KelirSwitcher`.
- Daftarkan font baru ke `registry.ts` (daftar `fonts`) supaya otomatis muncul di pilihan `KelirSwitcher`.

Runtime (`KelirProvider` / `switcher.tsx`):
- CSS variable font **cuma ada 1 secara global** (`--kelir-font-active`), bukan 1 per font — karena hanya 1 font yang aktif dalam satu waktu (independen dari tema/variant). Semua komponen di semua tema referensikan `var(--kelir-font-active, <fallback tema>)` di `font-family`-nya.
- Saat user pilih font baru di switcher: inject `<link rel="stylesheet" href={importUrl}>` ke `<head>` (skip kalau sudah pernah di-inject sebelumnya), lalu `document.documentElement.style.setProperty("--kelir-font-active", \`'${family}', ${fallback}\`)`.
- Font aktif tidak reset saat ganti tema — cuma direset kalau user eksplisit ganti lewat switcher.

**Catatan legal**: cdnfonts men-host font pihak ketiga; Kelir hanya mereferensikan URL-nya (tidak redistribusi file). Sertakan disclaimer singkat di README bahwa font di-load dari CDN pihak ketiga "as-is".

---

## 7. `switcher.tsx` — Komponen UI, Bukan Cuma Logic

**Perubahan penting dari draft awal:** `switcher.tsx` (bukan `.ts` lagi) adalah **komponen React siap-pasang** yang bisa langsung ditaruh di navbar, sidebar, atau di mana pun konsumen mau — bukan cuma hook logic tanpa UI. Isinya 3 selector sekaligus:

1. **Tema** — dropdown/select daftar semua tema di `themes/`
2. **Variant** — toggle light/dark, independen dari tema (lihat §3)
3. **Font** — dropdown daftar semua font di `fonts/`, independen dari tema

```tsx
// switcher.tsx
import { useKelir } from "./KelirProvider";

export function KelirSwitcher() {
  const { theme, setTheme, variant, setVariant, font, setFont, themes, fonts } = useKelir();

  return (
    <div className="kelir-switcher">
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        {themes.map((t) => <option key={t.slug} value={t.slug}>{t.label}</option>)}
      </select>

      <button onClick={() => setVariant(variant === "light" ? "dark" : "light")}>
        {variant === "light" ? "☀️" : "🌙"}
      </button>

      <select value={font} onChange={(e) => setFont(e.target.value)}>
        {fonts.map((f) => <option key={f.slug} value={f.slug}>{f.family}</option>)}
      </select>
    </div>
  );
}
```

`KelirSwitcher` konsumsi state dari `KelirProvider` (context), jadi bisa ditaruh di mana saja di dalam tree asal masih di bawah `<KelirProvider>`. Styling default-nya minimal/unstyled (biar gampang di-override konsumen), atau ikut CSS variable tema aktif — ini keputusan Jules saat implementasi.

### `KelirProvider.tsx` — mengelola 3 state sekaligus

Tugasnya:
1. Ganti **seluruh implementasi komponen** sesuai `theme` — karena tiap tema punya file komponen sendiri di `themes/<tema>/`.
2. Ganti **palet warna** sesuai `variant` (light/dark) — resolve dari `colors.light`/`colors.dark` tema aktif.
3. Ganti **font** sesuai `font` — independen dari `theme`/`variant` (lihat §6).
4. Ganti **design tokens lain** (radius, spacing, shadow, motion) via CSS variables di root, ikut tema aktif.
5. Trigger re-render total tanpa reload halaman, untuk ketiga state di atas.

```tsx
// KelirProvider.tsx
import { themeRegistry, fontRegistry } from "./registry";

type Variant = "light" | "dark";

function useKelirState(initialTheme: string, initialVariant: Variant, initialFont: string) {
  const [theme, setTheme] = useState(initialTheme);
  const [variant, setVariant] = useState<Variant>(initialVariant);
  const [font, setFont] = useState(initialFont);

  useEffect(() => {
    const themeDef = themeRegistry[theme];
    applyTokensToRoot(themeDef.tokens, variant); // pakai colors[variant], bukan flat colors
  }, [theme, variant]);

  useEffect(() => {
    const fontDef = fontRegistry[font];
    loadFont(fontDef); // inject <link> + set --kelir-font-active (lihat §6)
  }, [font]);

  return { theme, setTheme, variant, setVariant, font, setFont };
}
```

Kunci desain: **komponen tidak di-import statis dari satu tema**. Proxy component di `components/Button.tsx` membaca `theme` dari context lalu resolve dinamis ke `themes/<tema>/button.tsx`:

```tsx
// components/Button.tsx
import { useKelir } from "../KelirProvider";
import { themeRegistry } from "../registry";

export function Button(props: ButtonProps) {
  const { theme } = useKelir();
  const Impl = React.lazy(() => themeRegistry[theme].components.button);
  return <Suspense fallback={null}><Impl {...props} /></Suspense>;
}
```

Pemakaian di app konsumen:

```tsx
import { KelirProvider } from "../kelir/KelirProvider";
import { Button } from "../kelir/components/Button";
import { KelirSwitcher } from "../kelir/switcher";

function App() {
  return (
    <KelirProvider defaultTheme="brutalist" defaultVariant="light" defaultFont="product-sans">
      <nav><KelirSwitcher /></nav>
      <Button variant="primary">Klik</Button>
    </KelirProvider>
  );
}
```

### `registry.ts`
Daftar tema DAN font, bisa manual atau auto-generate (script scan folder `themes/*/DESIGN.md` dan `fonts/*.ts` saat build untuk membentuk `registry.ts`, biar tidak perlu daftar manual tiap nambah tema/font).

---

## 8. Roadmap Implementasi (urutan disarankan untuk Jules)

1. **Fondasi**: `types.ts` (kontrak semua komponen, extend props MUI — lihat §1.3) + `registry.ts` (kosong dulu)
2. **1 tema referensi lengkap** (mis. `default`): `DESIGN.md` (dengan `colors.light` + `colors.dark`), `changelog.txt`, `tokens.ts` (termasuk resolver ke `theme.components.Mui*.styleOverrides`), minimal 3 komponen berbasis MUI (Button, Card, Input)
3. **`KelirProvider` + proxy component pattern** di `components/` (baru 1 tema, pastikan alurnya jalan — tanpa `index.ts`, import langsung per file)
4. **1 font referensi** di `fonts/` + logic load font independen (§6) → uji ganti font tanpa ganti tema
5. **`switcher.tsx`** dengan 3 selector (tema/variant/font), dukungan 1 tema dulu → uji ganti tokens, variant, dan font, re-render
6. **Tema kedua** yang SANGAT berbeda (mis. brutalist vs glassmorphism) untuk stress-test bahwa "rombak total" benar-benar bekerja, bukan cuma ganti warna — sekaligus pastikan variant light/dark & font tetap independen dari perbedaan ini
7. **Auto-registry**: script scan folder `themes/` dan `fonts/` untuk generate `registry.ts` otomatis
8. **Polish**: dokumentasi cara nambah tema baru, cara nambah font baru, cara konsumen pasang via `git submodule add`, contoh penempatan `<KelirSwitcher />` di navbar

---

## 9. Hal yang perlu diputuskan Jules saat eksekusi

- Apakah `tokens.ts` di-generate otomatis dari `DESIGN.md` (parsing markdown) atau ditulis manual terpisah?
- Strategi lazy-loading komponen per tema: dynamic `import()` per komponen, atau per tema (bundle semua komponen 1 tema jadi satu chunk)?
- Apakah butuh SSR-safety (Next.js) untuk font injection & CSS variable, atau cukup client-only dulu?
- Validasi lisensi font sebelum dipakai di production.
- Styling default `KelirSwitcher` — unstyled/minimal, atau ikut tema aktif juga?
- Persistensi pilihan user (tema/variant/font) — simpan di localStorage/cookie, atau reset tiap reload? (Catatan: kalau nanti pakai localStorage, ingat ini beda dari batasan artifact Claude — di project React biasa localStorage aman dipakai.)

## 10. Keputusan Final (sudah diputuskan user)

- **Distribusi**: Git submodule, BUKAN npm package, BUKAN CLI ala shadcn (lihat §1.1).
- **Tanpa `index.ts`**: tidak ada barrel/entry file di mana pun — semua import pakai path relatif langsung ke file aslinya (lihat §1.2).
- **Runtime switching**: WAJIB tetap ada — alasan utama kenapa submodule dipilih (semua tema ikut ter-clone, jadi bisa di-switch runtime tanpa CLI/package).
- **Dark mode = variant, BUKAN tema terpisah**: 1 tema (1 `DESIGN.md`) punya `colors.light` dan `colors.dark` sekaligus. Variant dipilih independen dari tema lewat `KelirSwitcher` (lihat §3, §7). *(Ini revisi dari keputusan default sebelumnya yang sempat menyarankan "tema terpisah".)*
- **Font independen dari tema**: font yang tampil ditentukan murni dari pilihan di `KelirSwitcher`, bukan dari `typography.fontFamily` di `DESIGN.md` (yang diabaikan saat runtime). Font adalah registry global (`fonts/`), lepas dari tema/variant apapun (lihat §6).
- **Switcher = komponen UI, bukan cuma logic**: `switcher.tsx` berisi 3 selector (tema, variant, font) sekaligus, tinggal ditaruh di navbar/sidebar/mana saja konsumen mau (lihat §7).
- **Base component library**: `@mui/material` + `@mui/icons-material` untuk semua komponen di semua tema (lihat §1.3). Icon library apa pun yang disebut di `DESIGN.md` (mis. Lucide/Heroicons) diabaikan — `@mui/icons-material` dipakai seragam, sama perlakuannya seperti font.
