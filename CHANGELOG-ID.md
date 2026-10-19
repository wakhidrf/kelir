## Changelog

| Fitur / Aturan | Sebelum v7 | v7 |
|---|---|---|
| Tata letak halaman | Anda menulis pembungkus sendiri | Pakai `Stack` (`gap`, `direction`), `Grid` (`columns` dari daftar tetap, `gap`), dan `Spacer` (`size`) milik kit - pembungkus `div` polos tak lagi diterima |
| Ukuran `Skeleton` | Tak ada cara mengatur ukuran placeholder loading | `width`/`height` boleh hanya di `Skeleton`; `animation` adalah `pulse\|wave\|false` |
| Nilai prop | Sebagian prop menerima apa saja | Daftar pilihan tetap di mana-mana (`Grid columns`, `Typography as`/`level`, `Input type`/`size`, dan lainnya) - lihat `kelir-types.ts` |
| Test hook | - | `data-testid` satu-satunya atribut `data-*` yang boleh Anda pakai |
| `Sidebar` | Sidebar tetap, tanpa opsi | `mode` (`auto`: docked di desktop, overlay di mobile), `triggerVariant` (`none`/`hamburger`/`chevron`), `overlayHeight` (`full`/`auto`); `aria-label` wajib (nama landmark nav) |
| `Drawer` | Selalu full-height | `height` (`full`, atau `auto` yang membungkus isi dan menengahkannya); tepi kanan membulat ala card; dialog bernama untuk screen reader |
| Tombol | Teks hanya rata tengah; tombol ikon bebas bentuk | `Button align` (`center`/`start`/`end`); `IconButton shape` (`rounded`/`circle`/`square`), selalu dengan `aria-label` |
| Prop trigger `Sidebar` | `trigger?` | `triggerVariant?` (union sama; union gaya tombol, bukan slot) |
| Prop tinggi `Drawer` | `paperHeight?` | `height?` (`full\|auto` sama) |
| Tinggi overlay `Sidebar` | `full\|content` | `full\|auto` |
| Nama landmark `Sidebar` | `aria-label` opsional | `aria-label` wajib |
| Nilai alignment | `left\|right` (Button, Card, Typography, Message, Bubble) | `start\|end` (nilai logis; sama di LTR, benar di RTL) |
| Isi Card | Area isi tetap | Badan scroll via `scrollable?` (default `false`): isi scroll di dalam, header/footer tetap; tinggi luar tetap milik konsumen |
| Perataan Stack | Hanya direction + gap | `align?` (`start\|center\|end\|stretch`, default `stretch`) dan `justify?` (`start\|center\|end\|space-between`, default `start`) - union logis tertutup, tanpa ubah visual bila default |
| Elipsis Typography | Pembungkus ellipsis sendiri | `truncate?` (default `false`): elipsis satu-baris milik kit |
| Lebar halaman | Pembungkus maxWidth sendiri | `Container` (`maxWidth?` `sm\|md\|lg\|xl`, `padding?` dari space layout) - murni layout, tanpa warna/border/shadow |
| Gambar logo/media | `<img>` mentah dengan objectFit | `Image` (`src`, `alt?`, `height?`, `fit?` `contain\|cover`, `radius?`) - netral, tanpa shadow/border bawaan |
| Bungkus baris | Pembungkus flex-wrap sendiri | `Stack wrap?` (default `false`) - baris/kolom membungkus milik kit |
| Item flex | Pembungkus `flex: 1` / `flexShrink: 0` / `overflow: hidden` sendiri | `FlexItem` (`grow?`, `shrink?`, `clip?` untuk truncasi baris flex bersama `grow`) - boolean tertutup, tanpa angka bebas; default blok biasa |
| Lebar halaman, vertikal | Pembungkus padding vertikal + overflow sendiri | `Container paddingBlock?` (`none\|sm\|md\|lg\|xl\|2xl`, default `none`) dan `clip?` (default `false`) dari skala space yang sama |
| Cangkang aplikasi | Cangkang viewport ditulis ulang tiap app | `Shell` (baris atau `stacked?`), `Content` (satu area scroll, padding responsif, latar), `TopBar` (`left?`/`right?`, surface) - murni layout, tanpa warna/border/shadow kustom |
| Ubin ikon/logo | Kotak padding sendiri | `Tile` (`tone?` `primary\|secondary\|plain`, `size?` `sm\|md\|lg` ke px milik kit; tanpa size ubin-ikon fleksibel) |
| Spanduk status + flag kartu | Spanduk tinta dan strip sendiri | `Banner` (`tone?` `danger\|warn\|neutral`) dengan teks mewarisi warna; `Card flag?` (`danger\|warn`, strip sisi absolut, default tanpa strip) |
| Tautan panjang, kode verifikasi | Pembungkus break-all / letter-spacing sendiri | `Typography breakAll?` (default `false`) dan `tracking?` (`normal\|wide`, spasi renggang 6px milik kit) |
| Tautan sebaris | `<a>` mentah dengan `style=` | `Link` (`href` wajib, `children` teks, `external?` untuk ikon tab-baru + target + rel) - textPrimary, tanpa underline |
| Radius sudut | - | Sudut kini mengikuti token tema per peran (`button`/`card`/`surface`/`prominent`) - tampilan sama, tiap tema bisa membentuknya |
| Keandalan | - | Setiap komponen diliput test tipe, runtime, dan aksesibilitas di 11 tema; `Questionnaire` dipecah jadi 5 modul dengan prop identik; generik lebih ketat (`Chart`/`Table`/`Carousel`/`Resizable`) |
| Aksesibilitas | Sebagian | Built-in di mana-mana: pengumuman Toast, focus trap Dialog, pemicu Tooltip/Popover yang bisa difokus, tombol panah Menu, input berlabel |
| Ukuran tombol | Satu ukuran tetap | `Button`/`IconButton size?` (`sm\|md\|lg`, default `md` = hari ini): padding rapat/lega + ikon ~18px/~28px untuk drawer sempit - union tertutup, tanpa angka bebas |
| Padding docked Sidebar | Isi docked menempel ke bingkai | Docked kini punya napas dalam sm yang sama dengan overlay (konsumen sealed tak bisa menambahkannya); overlay tak berubah |
| Affordance pemicu menu | Pemicu teks-only terbaca seperti label | `DropdownMenu triggerVariant?` (`text\|button`, default `text`): `button` merender pemicu Button outline milik kit; perilaku identik |
| Varian bar app-shell | `TopBar` selalu lempeng surface | `TopBar variant?` (`raised\|flat`, default `raised`): `raised` kini surface Kelir penuh (surface + border bawah + shadow); `flat` baris aksi transparan di dalam konten; layout identik |
| Asisten AI | Agen membaca puluhan file untuk memahami kontrak | Server MCP eksperimental di `kelir-mcp/` (stdio lokal, katalog baca-saja; saran dan pemeriksaan menyusul) |
| Overlay pemuatan | Overlay redup rakitan div polos + token | `LoadingOverlay` (`open` wajib, `label?`/`progress?` teks, `children?` slot media): kartu berdenyut milik kit, nama aksesibel milik kit, tanpa dismiss |
| Sel tabel panjang | Pembungkus elipsis rakitan yang tak menembus pemicu menu milik kit | `TruncatedText` (`text` wajib, `maxWidth?` data px, teks penuh saat hover) + `ContextMenu`/`DropdownMenu truncate?` (default `false`; hanya varian teks, teks penuh saat hover) |
| Tepi docked Sidebar | Tepi viewport flush tetap rounded keempat sudut + border penuh | Sudut sisi-layar dinolkan via logical props (aman RTL) + tanpa border sisi-layar; sisi-konten tetap token radius |
| Overlay mobile Sidebar | Overlay mentok separuh layar | `min(SIDEBAR_WIDTH, 75vw)` - hingga tiga perempat layar |
| Avatar besar | `Avatar size` mentok di large | `Avatar size?` bertambah `xl` (96px), sejajar ukuran teratas `Image`/`Tile` |
| Overflow kartu | Kartu selalu memotong tepinya | `Card overflow?` (`hidden\|visible`, default `hidden`); kartu `scrollable` tetap memotong agar isi bisa scroll |
| Pemicu menu sempit | Pemicu terpotong bisa terlihat sesak atau terlalu lebar | `ContextMenu`/`DropdownMenu maxWidth?` (data px; berlaku pada pemicu yang di-truncate) |
| Penekanan Toast | Setiap toast tampak sama | `Toast tone?` (`info\|success\|warning\|error`): strip aksen sisi kiri dari token kit/status; tanpa `tone` tetap netral |
| Layout responsif | Layout per-breakpoint butuh CSS/hook sendiri | `Stack directionMd?`, `Container paddingBlockMd?`, `Typography variantMd?`: satu breakpoint kit (768px) diterapkan di `>=768px`, nilai dari union yang sudah tertutup |
| Gambar responsif | Media hero/fluid butuh pembungkus rakitan | `Image fluid?` (isi lebar wadah, tinggi auto) dan `maxHeight?` (dari skala ukuran) |
| Ruang terpesan | Area tinggi tetap untuk konten async/pihak ketiga butuh style inline | `Stack minHeight?` dari skala space (`xs`..`4xl`), default tanpa |
| Asisten AI (suggest) | Agen tetap menebak komponen kit yang cocok | Tool MCP `suggest` (v1.1): keinginan bahasa alami → kandidat sealed berperingkat, dengan pengingat kontrak; hanya dari katalog, tak pernah rakitan sendiri |
| Gerbang konsistensi kit | Repo kit tak punya pemeriksaan sendiri | Gerbang yang butuh `STYLE.md` jalan dari proyek induk dan kini gagal dengan pesan jelas bila dijalankan dari checkout kit tanpa induk; kit menjalankan parse-check di CI |
| Seksi satu layar | Hero/interstitial satu layar butuh tinggi viewport rakitan | `Stack minHeight?` bertambah `screen` (100dvh); padukan dengan `Container` untuk kolom terpusat berlebar terbatas |
| Media besar + terbatas | Ukuran media mentok 96px dan media fluid tak bisa dibatasi | `Image height?`/`maxHeight?` bertambah `2xl`..`7xl` (128..400px); `Image maxWidth?` membatasi lebar fluid dalam px |
| Urutan di layar lebar | Menukar urutan anak per breakpoint butuh CSS sendiri | `Stack reverseMd?` (default `false`): membalik urutan anak pada `>=768px`, di atas `directionMd ?? direction` |
| Heading berhias inline | Kata bergaya dalam satu heading butuh elemen bertingkat | `Typography segments?`: span inline ber-token (tone muted/primary, skala kecil, pindah baris) dalam satu elemen heading |
| Logo berbingkai mengambang | Logo bulat berbingkai di atas kartu butuh kotak rakitan | `Avatar frame?` (latar surface + ring primary tebal + padding) dan `FlexItem offsetY?` (`sm\|md\|lg`, tarik naik ber-token) |
| Filter AI slop | Agen mengirim UI, copy, dan komentar AI generik, dan kit tak bisa menolak | Filter anti-slop MCP (v1.2): mirror offline terpin dari rulebook anti-slop (`kelir://antislop` + per-skill), tool `audit` deterministik, dan catatan anti-slop di `suggest` |
| Gerbang anti-slop | Filter hanya mengaudit cuplikan yang dikirim agen; tak ada yang menggagalkan build | `scripts/kelir-slop.mjs` berjalan di CI repo induk (`npm run kelir:slop:strict`): memindai berkas induk yang mengimpor Kelir plus internal kit memakai matcher terpin yang sama dengan tool `audit` MCP, mencetak `file:baris` pada tiap ERROR, dan menghormati `kelir-allow: slop` eksplisit di satu baris atau baris di atasnya |
| Presisi anti-slop | Kata produk nyata dan glif ikon ikut tertandai sebagai teriak atau emoji hiasan | Nama dokumen dan token teknis (`STYLE`, `README`, `CHANGELOG`, `LICENSE`, `CRLF`, `IDR`, dan akronim standar lain) tak lagi dibaca sebagai penekanan; glif centang `✓`/`✔` diperlakukan sebagai ikon, bukan hiasan |
| Kode, kutipan, dan daftar dalam prosa | Blok kode, kutipan, dan daftar berarti markup rakitan plus gaya mentah | `CodeBlock` (`code` wajib, `language?`, tombol salin dan cadangan clipboard milik kit), `Quote` (batang aksen, latar, radius milik kit), dan `List` (`items`, `ordered?`, penanda dan jarak milik kit) |
| Sakelar segmented rapat | Grup toggle berupa satu baris tombol raised berpad 6px dan berjarak 8px (terlihat berat) | `ToggleGroup variant?` (`separated` bawaan, nol-ubah; `joined` = satu pil rapat menyatu, segmen non-aktif transparan, segmen aktif primary) |
| Pembungkus ikon + layout responsif | Konsumen membungkus ikon sendiri dan mewarnainya lewat kelas CSS miliknya, dan tiap grid harus menyimpan media query sendiri | `Icon` (`children`, `intent?`, `size?`) plus `Grid columnsSm?`/`columnsMd?` and `Stack gapMd?` |
| Chrome halaman + font merek | Tiap halaman menyusun chrome-nya sendiri (tepi, lebar isi, header/footer) plus media query, titik henti, dan font merek buatan sendiri | `PageFrame` (akar + header/main/footer/overlays dari token `layout.page` baru), `Positioned` (slot sudut/tepi tetap dengan `visibility` dari token 600px), `Typography` dapat varian `hero`/`stat` plus `tone?` dan `font?` (`brand` lewat `KelirProvider brandFont?`), `Grid minItem?` (auto-fit dari token, tanpa media query konsumen), `AspectRatio plain?` |
