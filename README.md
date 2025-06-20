# 💳 Open Payment Portal

Portal web sederhana untuk mencatat transaksi pembayaran dengan tampilan menarik menggunakan Tailwind CSS. Dibuat untuk keperluan UAS Perancangan Web.

---

## 🎯 Fitur Utama

- 📄 Formulir pembayaran dengan pilihan produk dan metode
- 💸 Dukungan kode promo otomatis (contoh: `HAUS10`, `MINUM20`)
- 📊 Ringkasan transaksi: total, rata-rata, pendapatan
- 🧾 Riwayat transaksi disimpan di localStorage
- ✅ Popup pembayaran berhasil dengan suara, progress bar, dan cetak invoice
- 🌙 Dark mode toggle

---

## 🚀 Cara Menjalankan

1. **Download atau Clone Repository**
2. Buka `index.html` langsung di browser (tidak butuh server)
3. Isi form pembayaran dan klik `Proses Pembayaran`

---

## 🧠 Kode Promo Tersedia

| Kode     | Diskon   |
|----------|----------|
| `HAUS10` | 10%      |
| `MINUM20`| 20%      |

---

## 📁 Struktur File

```
├── index.html         # Halaman utama
├── script.js          # Logika transaksi, promo, popup
├── assets/
│   └── me.jpg         # Foto profil di header
└── README.md          # Dokumentasi proyek
```

---

## 🛠️ Teknologi Digunakan

- HTML5 + JavaScript
- Tailwind CSS CDN
- localStorage (untuk simpan transaksi)

---

## 📌 Catatan Tambahan

- Tidak butuh koneksi server atau database
- Pastikan file `script.js` dan `me.jpg` berada pada path yang sesuai
- Suara notifikasi dimuat dari URL online (Pixabay)

---

## 👨‍💻 Pengembang

**Nama:** Muhamad Rayhan  
**NIM:** 1124160206  
**Mata Kuliah:** Perancangan Web
