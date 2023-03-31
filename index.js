import { Bot } from "grammy";
import config from "./config.js";
import { Configuration, OpenAIApi } from "openai";
import { chunkSubstr } from "./utils.js";

const configuration = new Configuration({
  apiKey: config.openaitoken,
});

const openai = new OpenAIApi(configuration);

// Create a bot object
const bot = new Bot(config.token_bot); // <-- place your bot token in this string

// Register listeners to handle messages

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

// Start the bot (using long polling)
bot.start();
