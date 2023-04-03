import TelegramBot from "node-telegram-bot-api";
import { ChatGPTAPI } from "chatgpt";
import config from "./config.js";

const bot = new TelegramBot(config.token_bot, { polling: true });
const api = new ChatGPTAPI({ apiKey: config.openaitoken });
const retry = 3;
const timeout = 10 * 60 * 1000;
const hapusPesan = "Data berhasil dihapus";
const WaitMSG = "Bentar, bot sedang mengetikannya";
const ErrMSG = "Mohon Maaf Lagi Error ";
const messageIds = new Map();

bot.on(
  "text",
  async ({ text, chat: { id: chatId }, message_id: messageId }) => {
    console.log(
      `${new Date().toLocaleString()} Menerima pesan dari : ${chatId}: ${text}`
    );
    await MulaiChat({ text, chatId, messageId });
  }
);

async function MulaiChat({ text, chatId, messageId }, retryCount = 0) {
  if (text === "/reset") {
    messageIds.delete(chatId);
    await bot.sendMessage(chatId, CLEARED_MSG);
    return;
  }

  const [parentId = null, tempId = null] = (messageIds.get(chatId) ?? "").split(
    ","
  );
  console.log(parentId);

  let response, tempMessage;
  try {
    tempMessage = await bot.sendMessage(chatId, WaitMSG, {
      reply_to_message_id: messageId,
    });
    response = parentId
      ? await api.sendMessage(text.replace(), {
          parentMessageId: parentId,
        })
      : await api.sendMessage(text.replace());
    console.log(
      `${new Date().toLocaleString()} Respone Bot <${text}>: ${response.text}`
    );
    await bot.editMessageText(response.text, {
      parse_mode: "Markdown",
      chat_id: chatId,
      message_id: tempMessage.message_id,
    });
  } catch (err) {
    console.error(
      `${new Date().toLocaleString()} Error Respone Bot <${text}>: ${
        err.message
      }`
    );
    if (retryCount < retry) {
      console.log(
        `${new Date().toLocaleString()} -- Sedang Mencoba ulang <${text}>`
      );
      handleMessage({ text, chatId, messageId }, retryCount + 1);
      return;
    } else {
      console.error(
        `${new Date().toLocaleString()} -- Gagal mendapatkan data ai ${RETRY_COUNT} percobaan.`
      );
      await bot.sendMessage(chatId, ErrMSG, {
        reply_to_message_id: messageId,
      });
      return;
    }
  }

  const newMsgId = `${response.id},${tempMessage.message_id}`;
  messageIds.set(chatId, newMsgId);

  setTimeout(() => {
    messageIds.delete(chatId);
  }, timeout);
}
console.log(`${new Date().toLocaleString()} Bot Berhasil Dijalankan`);
