const BOT_TOKEN = 'TOKEN BOT TWLEGRAM';
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;
const CHANNEL_ID = '@USERNAME CHANNEL';
const IMAGE_URL = 'https://www.imgtr.ee/images/2025/06/24/RZ5w.th.jpeg';

async function handleRequest(request) {
  const url = new URL(request.url);

  // ✅ Set Webhook via URL
  if (url.pathname === '/setwebhook') {
    const webhookURL = url.origin;
    const res = await fetch(`${API_URL}/setWebhook?url=${webhookURL}`);
    return new Response(await res.text());
  }

  // ✅ Handle pesan masuk dari Telegram
  if (request.method === 'POST') {
    const contents = await request.json();
    if (!contents.message) return new Response('ok');

    const msg = contents.message;
    const chatId = msg.chat.id;
    const msgId = msg.message_id;
    const text = msg.text || '';
    const firstName = msg.from.first_name || "";
    const lastName = msg.from.last_name || "";
    const fullName = (firstName + " " + lastName).trim();
    const username = msg.from.username ? "@" + msg.from.username : "(tidak ada username)";
    const now = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

    // ✅ /start command
    if (text.startsWith('/start')) {
      const welcomeText = `🔥 Selamat datang, <b>${fullName}</b> (${username})! 🔥\n\n` +
        `🚀 <b>Siap untuk mengirim pesan WhatsApp tanpa ribet?</b> Cukup masukkan nomor telepon dalam format berikut:\n\n` +
        `✅ 085XXXXXXXXXX (format biasa)\n` +
        `✅ +6285XXXXXXXXXX (dengan kode negara)\n\n` +
        `💡 <b>Mau lihat kode sumbernya? Klik tombol di bawah!</b>`;

      const buttonText = '📜 Lihat Source Code';
      const buttonUrl = 'https://github.com/Syuhadak27/Telegram-WhatsApp-Sender-Bot';

      await sendMessage(chatId, welcomeText, buttonText, buttonUrl, true);
      await deleteMessage(chatId, msgId);
      return new Response('ok');
    }

    // ✅ Jika input nomor valid
    const cleaned = text.replace(/[^+\d]/g, '');
    if (/^\+?\d{9,15}$/.test(cleaned)) {
      const waLink = `https://wa.me/${cleaned.replace(/^0/, '62')}`;
      const label = cleaned.replace(/^0/, '62');

      await sendButton(chatId,
        `Oke sekarang anda bisa mengirim pesan via WhatsApp tanpa simpan nomor dengan klik tombol berikut:`,
        waLink,
        `📲 ${label}`
      );

      await deleteMessageAfter(chatId, msgId, 4);

      const caption = `👤 User: ${username}\n📝 Pesan: ${text}\n🕒 Waktu: ${now}`;
      await sendPhoto(CHANNEL_ID, IMAGE_URL, caption);
    } else {
      // ✅ Jika bukan nomor, balas error lalu hapus dua pesan
      const errorRes = await sendMessage(chatId, 'Masukkan nomor saja.');
      const botMsgId = errorRes.result.message_id;

      await deleteMessageAfterPair(chatId, msgId, botMsgId, 4);
    }

    return new Response('ok');
  }

  return new Response('OK');
}

// ✅ Kirim pesan biasa dengan optional tombol
async function sendMessage(chatId, text, buttonText = null, buttonUrl = null, parseHTML = false) {
  const body = {
    chat_id: chatId,
    text: text,
    ...(parseHTML && { parse_mode: "HTML" })
  };

  if (buttonText && buttonUrl) {
    body.reply_markup = {
      inline_keyboard: [[{ text: buttonText, url: buttonUrl }]]
    };
  }

  const res = await fetch(`${API_URL}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  });

  return await res.json(); // Untuk ambil message_id
}

// ✅ Kirim tombol ke WA
async function sendButton(chatId, text, url, buttonLabel) {
  await fetch(`${API_URL}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      reply_markup: {
        inline_keyboard: [[{ text: buttonLabel, url }]]
      }
    })
  });
}

// ✅ Hapus pesan
async function deleteMessage(chatId, msgId) {
  await fetch(`${API_URL}/deleteMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, message_id: msgId })
  });
}

// ✅ Hapus 1 pesan setelah delay
async function deleteMessageAfter(chatId, msgId, seconds) {
  await new Promise(resolve => setTimeout(resolve, seconds * 1000));
  await deleteMessage(chatId, msgId);
}

// ✅ Hapus 2 pesan (user dan bot)
async function deleteMessageAfterPair(chatId, userMsgId, botMsgId, seconds) {
  await new Promise(resolve => setTimeout(resolve, seconds * 1000));
  await deleteMessage(chatId, userMsgId);
  await deleteMessage(chatId, botMsgId);
}

// ✅ Kirim foto ke channel
async function sendPhoto(chatId, photoUrl, caption) {
  await fetch(`${API_URL}/sendPhoto`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      photo: photoUrl,
      caption: caption
    })
  });
}

export default {
  fetch: handleRequest
};
