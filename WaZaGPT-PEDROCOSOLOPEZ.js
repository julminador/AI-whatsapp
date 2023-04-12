const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const { Configuration, OpenAIApi } = require("openai");


const configuration = new Configuration({
  apiKey: 'No les doy NADAAAA!!! poner el api key aca',
});

const openai = new OpenAIApi(configuration);

async function completion(pregunta){
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: pregunta,
      temperature: 0.7,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    return response.data.choices[0].text;
}

async function chatCompletion (mensaje){

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      max_tokens: 1024,
      messages: [{role: "user", content: mensaje}],
    });
    return (completion.data.choices[0].message.content);
}

const client = new Client({
    authStrategy: new LocalAuth({ clientId: "cliente-one" }),
    puppeteer: { headless: true },
    authTimeoutMs: 3600000,
    clientId: "cliente-one",
});

client.on('qr', (qr) => {
    console.log (qrcode.generate(qr,{small:true}))
    console.log('QR RECEIVED', qr);
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', msg => {
    if (msg.body.startsWith("/chatgpt ")){
        console.log("////////////////////////////////////");
        console.log(msg.body);
        console.log("////////////////////////////////////");
        chatCompletion(msg.body.substring(9)).then(respuesta =>  msg.reply(respuesta))
    }else if (msg.body.startsWith("/")){
        msg.reply('Recuerda que la forma de hacerme una pregunta es:\n\n/chatgpt escribe tu pregunta')
    }
});

client.initialize();