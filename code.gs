var TOKEN = 'TELEGRAM BOT TOKEN'; 
var WEB_APP_URL = 'URL HASIL DEPLOY'; 
var url = 'https://api.telegram.org/bot' + TOKEN + '/';

function doPost(e) {
  var contents = JSON.parse(e.postData.contents);

  if (contents.message) {
    var chatId = contents.message.chat.id;
    var messageId = contents.message.message_id;
    var userName = contents.message.from.username || contents.message.from.first_name || contents.message.from.last_name || "Unknown";
    var text = contents.message.text;

    if (text === '/start') {
      var response = sendText(chatId, 'Masukkan nomor telepon WhatsApp yang dimaksud dengan format biasa (085xxxxxxxxxx) atau dengan kode negara (+6285xxxxxxxxxx)');
      var responseId = JSON.parse(response.getContentText()).result.message_id;
      Utilities.sleep(4000);
      deleteMessage(chatId, responseId);
    } else if (text.match(/^0\d+$/)) {
      var phoneNumber = '62' + text.substring(1);
      var newText = 'Oke sekarang anda bisa mengirim pesan via whatsapp tanpa save nomor dengan klik tombol berikut:';
      var buttonText = phoneNumber
      var buttonUrl = 'https://api.whatsapp.com/send?phone=' + phoneNumber;
      sendMessage(chatId, newText, buttonText, buttonUrl);
      Utilities.sleep(2000);
      deleteMessage(chatId, messageId);
    } else if (text.match(/^\+\d{1,3}\d+$/)) {
      var phoneNumber = text;
      var newText = 'Oke sekarang anda bisa mengirim pesan via whatsapp tanpa save nomor dengan klik tombol berikut:';
      var buttonText = phoneNumber
      var buttonUrl = 'https://api.whatsapp.com/send?phone=' + phoneNumber;
      sendMessage(chatId, newText, buttonText, buttonUrl);
      Utilities.sleep(2000);
      deleteMessage(chatId, messageId);
    } else {
      var response = sendText(chatId, 'Maaf salah, Masukkan nomor telepon WhatsApp yang dimaksud dengan format biasa (085xxxxxxxxxx) atau dengan kode negara (+6285xxxxxxxxxx)');
      var responseId = JSON.parse(response.getContentText()).result.message_id;
      Utilities.sleep(2000);
      deleteMessage(chatId, responseId);
      deleteMessage(chatId, messageId);
    }
  }
}

function sendText(chatId, text) {
  var payload = {
    'chat_id': chatId,
    'text': text
  };

  var options = {
    'method': 'post',
    'payload': JSON.stringify(payload),
    'contentType': 'application/json'
  };

  return UrlFetchApp.fetch(url + 'sendMessage', options);
}

function sendMessage(chatId, text, buttonText, buttonUrl) {
  var payload = {
    'chat_id': chatId,
    'text': text,
    'reply_markup': JSON.stringify({
      'inline_keyboard': [
        [{
          'text': buttonText,
          'url': buttonUrl
        }]
      ]
    })
  };

  var options = {
    'method': 'post',
    'payload': JSON.stringify(payload),
    'contentType': 'application/json'
  };

  UrlFetchApp.fetch(url + 'sendMessage', options);
}

function deleteMessage(chatId, messageId) {
  var payload = {
    'chat_id': chatId,
    'message_id': messageId
  };

  var options = {
    'method': 'post',
    'payload': JSON.stringify(payload),
    'contentType': 'application/json'
  };

  UrlFetchApp.fetch(url + 'deleteMessage', options);
}


function setWebhook() {
  var response = UrlFetchApp.fetch(url + 'setWebhook?url=' + WEB_APP_URL);
  Logger.log(response.getContentText());
}
