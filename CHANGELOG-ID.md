## Changelog

| Fitur / Aturan | Sebelum v7 | v7 |
|---|---|---|
| Tata letak halaman | Anda menulis pembungkus sendiri | Pakai `Stack` (`gap`, `direction`), `Grid` (`columns` dari daftar tetap, `gap`), dan `Spacer` (`size`) milik kit - pembungkus `div` polos tak lagi diterima |
| Ukuran `Skeleton` | Tak ada cara mengatur ukuran placeholder loading | `width`/`height` boleh hanya di `Skeleton`; `animation` adalah `pulse\|wave\|false` |
| Nilai prop | Sebagian prop menerima apa saja | Daftar pilihan tetap di mana-mana (`Grid columns`, `Typography as`/`level`, `Input type`/`size`, dan lainnya) - lihat `kelir-types.ts` |
| Test hook | - | `data-testid` satu-satunya atribut `data-*` yang boleh Anda pakai |
| `Sidebar` | Sidebar tetap, tanpa opsi | `mode` (`auto`: docked di desktop, overlay di mobile), `trigger` (`none`/`hamburger`/`chevron`), `overlayHeight` (`full`/`content`) |
| `Drawer` | Selalu full-height | `paperHeight` (`full`, atau `auto` yang membungkus isi dan menengahkannya); tepi kanan membulat ala card; dialog bernama untuk screen reader |
| Tombol | Teks hanya rata tengah; tombol ikon bebas bentuk | `Button align` (`center`/`start`); `IconButton shape` (`rounded`/`circle`/`square`), selalu dengan `aria-label` |
| Radius sudut | - | Sudut kini mengikuti token tema per peran (`button`/`card`/`surface`/`prominent`) - tampilan sama, tiap tema bisa membentuknya |
| Keandalan | - | Setiap komponen diliput test tipe, runtime, dan aksesibilitas di 11 tema; `Questionnaire` dipecah jadi 5 modul dengan prop identik; generik lebih ketat (`Chart`/`Table`/`Carousel`/`Resizable`) |
| Aksesibilitas | Sebagian | Built-in di mana-mana: pengumuman Toast, focus trap Dialog, pemicu Tooltip/Popover yang bisa difokus, tombol panah Menu, input berlabel |
