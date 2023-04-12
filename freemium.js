const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const axios = require("axios");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

async function chatCompletion(mensaje) {
  console.log('Entro');
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    max_tokens: 2048,
    messages: [{ role: "user", content: mensaje }],
  });
  console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
  console.log(response.data.choices);
  console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
  return response.data.choices[0].message.content;
}

const client = new Client({
  authStrategy: new LocalAuth({ clientId: "cliente-one" }),
  puppeteer: { headless: true },
  authTimeoutMs: 3600000,
  clientId: "cliente-one",
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true })
});

client.on("ready", () => {
  console.info("Client is ready!");
});

client.on("message", async (msg) => {
  if (msg.from !== '573152909024@c.us') return; // unique number for test

  if (msg.body.startsWith("/chatgpt ")) {
    console.log("////////////////////////////////////");
    console.log(msg.body);
    console.log("////////////////////////////////////");
    const respuesta = await chatCompletion(msg.body.substring(9));
    msg.reply(respuesta);
  } else {
    msg.reply('Si? Ah bueno!')
  }
});

client.initialize();
