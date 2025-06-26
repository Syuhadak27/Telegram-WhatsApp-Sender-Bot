import { BOT_TOKEN, CHANNEL_ID, IMAGE_URL, API_URL } from './config.js';

function getBilingual(idText, enText) {
  return `${idText}\n\n━━━━━━━━━━━━━━\n\n${enText}`;
}

async function handleRequest(request) {
  const url = new URL(request.url);

  if (url.pathname === '/setwebhook') {
    const webhookURL = url.origin;
    const res = await fetch(`${API_URL}/setWebhook?url=${webhookURL}`);
    return new Response(await res.text());
  }

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

    if (CHANNEL_ID) {
      const caption = `👤 User: ${username}\n📝 Pesan: ${text}\n🕒 Waktu: ${now}`;
      if (IMAGE_URL) {
        await sendPhoto(CHANNEL_ID, IMAGE_URL, caption);
      } else {
        await sendMessage(CHANNEL_ID, caption);
      }
    }

    if (text.startsWith('/start')) {
      const welcomeText = getBilingual(
        `🔥 Selamat datang, <b>${fullName}</b> (${username})! 🔥
🚀 <b>Siap untuk mengirim pesan WhatsApp tanpa ribet?</b>
Cukup masukkan nomor telepon dalam format berikut:

✅ 085XXXXXXXXXX (format biasa)
✅ +6285XXXXXXXXXX (dengan kode negara)

💡 <b>Mau lihat kode sumbernya? Klik tombol di bawah!</b>`,
        `🔥 Welcome, <b>${fullName}</b> (${username})! 🔥
🚀 <b>Ready to send WhatsApp messages without saving contacts?</b>
Just enter the phone number in the following format:

✅ 085XXXXXXXXXX (normal format)
✅ +6285XXXXXXXXXX (with country code)

💡 <b>Want to see the source code? Click the button below!</b>`
      );

      await sendMessage(
        chatId,
        welcomeText,
        '📜 Source Code',
        'https://github.com/Syuhadak27/Telegram-WhatsApp-Sender-Bot',
        true
      );
      await deleteMessage(chatId, msgId);
      return new Response('ok');
    }

    const cleaned = text.replace(/[^+\d]/g, '');
    if (/^\+?\d{9,15}$/.test(cleaned)) {
      const waLink = `https://wa.me/${cleaned.replace(/^0/, '62')}`;
      const label = cleaned.replace(/^0/, '62');

      await sendButton(chatId,
        getBilingual(
          `✅ Oke! Sekarang anda bisa mengirim pesan via WhatsApp tanpa menyimpan nomor. Klik tombol di bawah.`,
          `✅ Great! Now you can send a WhatsApp message without saving the number. Click the button below.`
        ),
        waLink,
        `📲 ${label}`
      );

      await deleteMessageAfter(chatId, msgId, 4);
    } else {
      const errorRes = await sendMessage(chatId,
        getBilingual('⚠️ Masukkan nomor saja.', '⚠️ Numbers only, please.')
      );
      const botMsgId = errorRes.result.message_id;
      await deleteMessageAfterPair(chatId, msgId, botMsgId, 4);
    }

    return new Response('ok');
  }

  return new Response('OK');
}

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

  return await res.json();
}

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

async function deleteMessage(chatId, msgId) {
  await fetch(`${API_URL}/deleteMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, message_id: msgId })
  });
}

async function deleteMessageAfter(chatId, msgId, seconds) {
  await new Promise(resolve => setTimeout(resolve, seconds * 1000));
  await deleteMessage(chatId, msgId);
}

async function deleteMessageAfterPair(chatId, userMsgId, botMsgId, seconds) {
  await new Promise(resolve => setTimeout(resolve, seconds * 1000));
  await deleteMessage(chatId, userMsgId);
  await deleteMessage(chatId, botMsgId);
}

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
