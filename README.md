
---

# 🤖 Telegram WhatsApp Sender Bot (Cloudflare Worker)

Bot Telegram ini memungkinkan pengguna mengirim pesan ke WhatsApp **tanpa perlu menyimpan nomor**, cukup dengan memasukkan nomor di chat. Bot dibangun menggunakan **JavaScript di Cloudflare Workers**, ringan, cepat, dan tanpa server!

---

## 🚀 Fitur Utama

- 🔗 Kirim tautan WhatsApp otomatis dari nomor telepon
- 🔍 Validasi input nomor dengan pembersihan karakter
- ❌ Hapus pesan user dan pesan bot setelah 4 detik
- 📸 Kirim log ke channel Telegram dengan gambar dan informasi pengguna
- 🎉 Respon personal saat pengguna kirim `/start`
- 🔘 Tampilkan tombol link WA atau ke repository GitHub
- 🌐 Bisa di-deploy langsung ke Cloudflare Workers

---

## 📦 Cara Deploy (Cloudflare Workers)

1. Buka https://dash.cloudflare.com
2. Masuk ke menu **Workers & Pages** > `Create Worker`
3. Hapus kode default dan **salin seluruh script bot** ke editor
4. Klik tombol **Save and Deploy**
5. Catat URL endpoint dari Worker, contoh:

https://your-bot-name.username.workers.dev

---

## 🔧 Cara Set Webhook

Setelah bot ter-deploy, kunjungi URL berikut untuk mengaktifkan webhook:

https://your-bot-name.username.workers.dev/setwebhook

Pastikan:
- Bot sudah dibuat via [BotFather](https://t.me/BotFather)
- Token dan URL webhook sesuai dengan bot kamu

---

## 🧑‍💻 Contoh Penggunaan Bot

1. Kirim `/start`  
   🔸 Bot akan menyapa kamu dengan nama + tombol "Lihat Source Code"

2. Kirim nomor seperti:
   - `0857xxxxxxx`
   - `+62857xxxxxxx`
   - `+1xxxxxxxxxxx` (internasional)

   🔸 Bot akan balas tombol WhatsApp → Klik untuk langsung chat

3. Kirim teks biasa (bukan nomor)  
   🔸 Bot akan balas “Masukkan nomor saja” lalu hapus otomatis

---

## 🖼 Log ke Channel

Setiap pesan nomor valid akan dikirim ke channel Telegram (dengan gambar + info):
- Username
- Isi pesan
- Waktu
- Gambar thumbnail

> Pastikan bot adalah **admin** di channel dengan izin "Post Messages"

---

## 🛠 Konfigurasi Manual

Edit variabel berikut di script bot:

```js
const BOT_TOKEN = 'your-telegram-bot-token';
const CHANNEL_ID = '@your_channel_username';
const IMAGE_URL = 'https://yourdomain.com/image.jpg';

❤️ Credit

Dibuat oleh @Syuhadak27 menggunakan Cloudflare Workers dan Telegram Bot API.

---
