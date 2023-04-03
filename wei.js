import config from "./config.js";
import { ChatGPTAPI } from "chatgpt";
const api = new ChatGPTAPI({ apiKey: config.openaitoken });

// send a message and wait for the response
let res = await api.sendMessage("What is OpenAI?");
console.log(res.text);

console.log(res);
// send a follow-up
res = await api.sendMessage("Can you expand on that?", {
  parentMessageId: res.id,
});
console.log(res.text);
console.log(res);

// send another follow-up
res = await api.sendMessage("What were we talking about?", {
  parentMessageId: res.id,
});
console.log(res);
console.log(res.text);
