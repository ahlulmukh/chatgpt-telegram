import { Bot, MemorySessionStorage, session } from "grammy";
import { chatMembers } from "@grammyjs/chat-members";
import { conversations, createConversation } from "@grammyjs/conversations";
import config from "./config.js";
const bot = new Bot(config.token_bot);
import { ChatGPTAPI } from "chatgpt";
const api = new ChatGPTAPI({ apiKey: config.openaitoken });
const adapter = new MemorySessionStorage();
const WAITING_MSG = "I am organizing my thoughts, please wait a moment.";
const messageIds = new Map();

bot.on("message", async (ctx) => {
  const chatId = ctx.msg.chat.id;
  const messageId = ctx.msg.message_id;
  console.log(
    `${new Date().toLocaleString()} -- Nomor Pesan ${messageId} Dari id: ${chatId}: dengan text ${
      ctx.message.text
    }`
  );
  await ctx.conversation.enter("greeting");
});

bot.start();
