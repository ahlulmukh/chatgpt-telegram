import { Bot } from "grammy";
import config from "./config.js";
import { Configuration, OpenAIApi } from "openai";
import { chunkSubstr } from "./utils.js";
const configuration = new Configuration({
  apiKey: config.openaitoken,
});
const openai = new OpenAIApi(configuration);
const bot = new Bot(config.token_bot);

bot.command("start", (ctx) =>
  ctx.reply(
    "Hai, saya adalah abot versi telegram, tanyakan apa saja kepada saya, saya akan menjawabnya :D. Model using chatGPT 3.5 Turbo"
  )
);
bot.command("help", (ctx) =>
  ctx.reply("Untuk cara menanyakan ke abot dengan cara mengetikan langsung")
);

await bot.api.setMyCommands([
  { command: "start", description: "Untuk Memulai Bot" },
  { command: "help", description: "Memberikan bantuan" },
]);

bot.on("message", async (ctx) => {
  const userMessage = {
    role: "user",
    content: ctx.message.text,
  };

  try {
    const { data } = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [userMessage],
    });

    const responseText = data.choices[0].message.content;
    const chunks = chunkSubstr(responseText, 4000);

    for (let chunk of chunks) {
      await ctx.reply(responseText);
    }
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
  }
});

bot.start();
console.log("Bot Started !");
