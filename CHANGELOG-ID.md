# Changelog

## [7.0.0] - 2026-11-22

### Baru
- Anda bisa memilih dari sebelas tema desain dan mengganti wajah seluruh aplikasi sekaligus tanpa mengubah kode.
- Tersedia 86 komponen siap pakai - tombol, formulir, tabel, dialog, hingga tata letak - yang otomatis mengikuti tema aktif.
- Setiap komponen sudah aksesibel sejak awal: navigasi keyboard, focus trap pada dialog, dan pengumuman pembaca layar.
- Anda bisa memasang font merek dan dua warna merek tanpa menyentuh kode komponen.
- Font tema di-host sendiri dan hanya dimuat saat dipakai, sehingga kunjungan pertama cepat dan tak memanggil CDN font.
- Anda bisa menyalin blok kode dengan satu klik dan menampilkan notifikasi singkat ke seluruh aplikasi lewat satu baris.
- Gambar kini responsif dan lazy secara bawaan, dengan kotak yang sudah dicadangkan agar layout tidak bergeser saat dimuat.
- Halaman publik bisa tetap statis (tersimpan di CDN) sambil menampilkan tema yang benar, berkat mode tema di sisi browser.

### Ditingkatkan
- Nilai tiap komponen kini berupa pilihan tetap yang terdokumentasi, jadi tampilannya konsisten dan tak mudah salah pilih.
- Teks panjang bisa dipotong dengan elipsis rapi, dan kartu bisa dibuat scroll tanpa menggeser header/footer.
- Tata letak responsif kini cukup lewat komponen, tanpa menulis media query sendiri.
- Arah kini logis (start/end), sehingga benar baik pada teks kiri-ke-kanan maupun kanan-ke-kiri.

### Diperbaiki
- Font tema neumorphism kini memakai system font sesuai desainnya.
- Judul, kutipan, dan daftar kini tampil rapi di dalam teks paragraf.