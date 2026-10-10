name: "kelir-request"
description: "Minta prop/varian di luar kontrak paten (§5 STYLE.md)"
title: "[kelir-request] "
labels: ["kelir-request"]
body:
  - type: markdown
    attributes:
      value: |
        Kontrak Kelir **paten**: hanya ISI + MAKNA + PERILAKU (§5 `STYLE.md`).
        Gaya mentah (`style`/`sx`/`className`/hex-px) **tidak** dilayani —
        baca §6 dulu. Isi form ini agar pemilik tabel memutuskan.
  - type: input
    id: komponen
    attributes:
      label: "Komponen (§5 No)"
      placeholder: "mis. Select (no 48)"
    validations:
      required: true
  - type: textarea
    id: kebutuhan
    attributes:
      label: "Kebutuhan (ISI/MAKNA/PERILAKU, bukan visual)"
      description: "Contoh baik: `size?: 'xl'` untuk sel tabel padat. Contoh ditolak: `style={{margin: 4}}`."
      placeholder: "prop/varian yang diminta + alasan makna/perilaku"
    validations:
      required: true
  - type: textarea
    id: workaround
    attributes:
      label: "Workaround konsumen saat ini"
      description: "Bagaimana kebutuhan dipenuhi hari ini tanpa ubah kit?"
    validations:
      required: false
  - type: dropdown
    id: urgensi
    attributes:
      label: "Urgensi"
      options: ["rendah — tunggu batch", "sedang — butuh sprint ini", "tinggi — blocker rilis"]
    validations:
      required: true
