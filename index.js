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

bot.use(session({ initial: () => ({}) }));
bot.use(conversations());

async function greeting(conversation, ctx) {
  let chatId = ctx.msg.chat.id;
  let messageId = ctx.msg.message_id;
  let response, tempMessage;
  try {
    tempMessage = await ctx.api.sendMessage(chatId, WAITING_MSG, {
      reply_to_message_id: messageId,
    });
    const [parentId = null, tempId = null] = (
      messageIds.get(response) ?? ""
    ).split(",");
    response = parentId
      ? await api.sendMessage(
          text.replace(ctx.message.text.replace(), {
            parentMessageId: parentId,
          })
        )
      : await api.sendMessage(ctx.message.text.replace());
    console.log(response.id);
    console.log(
      `${new Date().toLocaleString()} -- AI response to <${
        ctx.message.text
      }>: ${response.text}`
    );
    await ctx.editMessageText(response.text, {
      parse_mode: "Markdown",
      chat_id: chatId,
      message_id: tempMessage.message_id,
    });
  } catch (err) {
    console.log("error bosku");
  }
}
bot.use(createConversation(greeting));
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
// bot.command("start", (ctx) =>
//   ctx.reply(
//     "Hai, saya adalah abot versi telegram, tanyakan apa saja kepada saya, saya akan menjawabnya :D. Model using chatGPT 3.5 Turbo"
//   )
// );
bot.command("help", (ctx) =>
  ctx.reply("Untuk cara menanyakan ke abot dengan cara mengetikan langsung")
);

await bot.api.setMyCommands([
  { command: "start", description: "Untuk Memulai Bot" },
  { command: "help", description: "Memberikan bantuan" },
]);

// bot.on("message", async (ctx) => {
//   const chatId = ctx.msg.chat.id;
//   const messageId = ctx.msg.message_id;
//   console.log(
//     `${new Date().toLocaleString()} -- Nomor Pesan ${messageId} Dari id: ${chatId}: dengan text ${
//       ctx.message.text
//     }`
//   );

// const [parentId = null, tempId = null] = (
//   messageIds.get(ctx.update.update_id) ?? ""
// ).split(",");

// let response, tempMessage;
// try {
//   tempMessage = await ctx.api.sendMessage(chatId, WAITING_MSG, {
//     reply_to_message_id: messageId,
//   });
//   console.log(bot.callbackQuery);
//   response = parentId
//     ? await api.sendMessage(ctx.message.text.replace(), {
//         parentMessageId: parentId,
//       })
//     : await api.sendMessage(ctx.message.text.replace());
//   console.log(
//     `${new Date().toLocaleString()} -- AI response to <${
//       ctx.message.text
//     }>: ${response.text}`
//   );
//   await ctx.editMessageText(response.text, {
//     parse_mode: "Markdown",
//     chat_id: chatId,
//     message_id: tempMessage.message_id,
//   });
// } catch (err) {
//   console.log("error bosku");
// }
// });

// bot.start({
//   allowed_updates: ["chat_member", "message"],
// });
