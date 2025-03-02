# 🤖 Telegram WhatsApp Sender Bot

Bot Telegram berbasis **Google Apps Script** yang memungkinkan pengguna mengirim pesan WhatsApp tanpa perlu menyimpan nomor terlebih dahulu.

## ✨ Fitur
✅ Kirim pesan WhatsApp langsung dari Telegram  
✅ Menerima input nomor dalam format **085xxxxxxxxxx** atau **+62xxxxxxxxxx**  
✅ Menghapus pesan otomatis setelah beberapa detik untuk menjaga kebersihan chat  

## 🚀 Cara Menggunakan Bot
1. **Ketikkan nomor WhatsApp** dalam format **085xxxxxxxxxx** atau **+62xxxxxxxxxx** di chat bot.  
2. Bot akan memberikan tombol yang langsung mengarahkan ke WhatsApp.  
3. Klik tombol tersebut untuk mulai mengirim pesan.  

## 🛠️ Cara Deploy di Google Apps Script
1. **Buat bot Telegram** melalui [@BotFather](https://t.me/BotFather) dan dapatkan `TOKEN_BOT`.  
2. **Buka** [Google Apps Script](https://script.google.com/) dan buat proyek baru.  
3. **Salin kode** dari file `Code.js` ke dalam proyek Google Apps Script.  
4. **Edit variabel berikut:**
   - `TOKEN` → Masukkan token bot Telegram Anda  
   - `WEB_APP_URL` → Gantilah dengan URL Web App yang di-deploy 
5. **Jalankan fungsi `setWebhook()`** untuk menghubungkan bot dengan Telegram.  
6. **Selesai!** Bot Anda siap digunakan.  

## 📜 Lisensi
Proyek ini menggunakan lisensi **MIT**, bebas digunakan dan dimodifikasi.
