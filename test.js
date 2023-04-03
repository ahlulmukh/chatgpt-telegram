import config from "./config.js";
import { ChatGPTAPI } from "chatgpt";
const api = new ChatGPTAPI({ apiKey: config.openaitoken });

// send a message and wait for the response
let res = await api.sendMessage("Apa itu flowchart");
console.log(res.text);
console.log(res.id);

// send a follow-up
res = await api.sendMessage("apakah perlu?", {
  parentMessageId: res.id,
});
console.log(res.text);
console.log(res.id);

// send another follow-up
res = await api.sendMessage("oke terima kasih", {
  parentMessageId: res.id,
});
console.log(res.text);
console.log(res.id);
