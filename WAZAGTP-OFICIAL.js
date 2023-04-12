const express = require('express')
const http = require('http')
const https = require('https');
const request = require('request');
const bodyParser = require('body-parser');
// const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const { Configuration, OpenAIApi } = require("openai");

const app = express()
const port = 3000

var token = "ParaQueMETASepaquiensoy";



// INICIO configuracion OpenAI

const configuration = new Configuration({
    apiKey: 'Esto es secreo, no les doy nadaaaa',
});

const openai = new OpenAIApi(configuration);

async function chatCompletion(mensaje, numero) {
    try {
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            max_tokens: 2048,
            messages: [{ role: "user", content: mensaje }],
        });

        return (completion.data.choices[0].message.content);
    } catch (error) {
        const now = new Date();
        fs.appendFileSync('/app/logsErrorOpenAI.txt', `\n========================ERROR==================================`);
        fs.appendFileSync('/app/logsErrorOpenAI.txt', `\nFecha: ${now.toLocaleString()}`);
        fs.appendFileSync('/app/logsErrorOpenAI.txt', `\n${error}`);
        fs.appendFileSync('/app/logsErrorOpenAI.txt', `\n========================ERROR==================================`);

        return ("Lo siento, ha ocurrido un error. Por favor, vuelve a intentarlo.\n\nRecuerda que no tengo conocimiento del contexto del chat, solo puedo responder a la última pregunta.");
    }

}

async function chatImagen(mensaje, from) {
    try {
        const response = await openai.createImage({
            prompt: mensaje,
            n: 1,
            size: "256x256",
        });

        const now = new Date();
        request(response.data.data[0].url).pipe(fs.createWriteStream(`/app/image/${now.getTime()}-${from}.png`)).on('close', () => {})

        return (response.data.data[0].url);
    } catch (error) {
        const now = new Date();
        if (error.response) {
            fs.appendFileSync('/app/logsErrorOpenAI.txt', `\n========================ERROR==================================`);
            fs.appendFileSync('/app/logsErrorOpenAI.txt', `\nFecha: ${now.toLocaleString()}`);
            fs.appendFileSync('/app/logsErrorOpenAI.txt', `\n${error.response.status}`);
            fs.appendFileSync('/app/logsErrorOpenAI.txt', `\n${error}`);
            fs.appendFileSync('/app/logsErrorOpenAI.txt', `\n========================ERROR==================================`);
            return ("https://wapi.axaviazel.dev/error-no-es-fracaso.png");

        } else {
            fs.appendFileSync('/app/logsErrorOpenAI.txt', `\n========================ERROR==================================`);
            fs.appendFileSync('/app/logsErrorOpenAI.txt', `\nFecha: ${now.toLocaleString()}`);
            fs.appendFileSync('/app/logsErrorOpenAI.txt', `\n${error}`);
            fs.appendFileSync('/app/logsErrorOpenAI.txt', `\n========================ERROR==================================`);
            return ("https://wapi.axaviazel.dev/error-no-es-fracaso.png");
        }
    }

}

// FIN configuracion OpenAI


// INICIO configuracion META

const optionsMensajeChat = {
    url: 'https://graph.facebook.com/v16.0/LineaSecreta/messages',
    headers: {
        'Authorization': 'SECRETO',
        'Content-Type': 'application/json'
    },
    json: {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": "",
        "type": "text",
        "text": {
            "preview_url": false,
            "body": ""
        }
    }
};

const optionsMensajeMultimediaImage = {
    url: 'https://graph.facebook.com/v16.0/LineaSecreta/messages',
    headers: {
        'Authorization': 'SECRETO',
        'Content-Type': 'application/json'
    },
    json: {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": "",
        "type": "image",
        "image": {
            "link": ""
        }
    }
};

// FIN configuracion META

//MID
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
// app.use(morgan('dev'));

// app.get('/', (req, res) => {

//     try {

//         const now = new Date();
//         console.log(`La hora actual es ${now.toLocaleTimeString()}.`);
//         console.log(req.headers);

//         res.status(200).json("OK")

//     } catch (error) {
//         console.log(error);
//     }
// })

app.get('/webhook', (req, res) => {

    try {

        if (req.query['hub.mode'] == 'subscribe' && req.query['hub.verify_token'] == token) {

            const now = new Date();
            console.log(`La hora actual es ${now.toLocaleTimeString()}.`);
            console.log(req.headers);

            res.status(200).send(req.query['hub.challenge'])
        }

    } catch (error) {
        console.log(error);
        const now = new Date();

        fs.appendFileSync('/app/logsErrorWebhookGet.txt', `\n========================ERROR==================================`);
        fs.appendFileSync('/app/logsErrorWebhookGet.txt', `\nFecha: ${now.toLocaleString()}`);
        fs.appendFileSync('/app/logsErrorWebhookGet.txt', `\n${error}`);
        fs.appendFileSync('/app/logsErrorWebhookGet.txt', `\n========================ERROR==================================`);
    }
})

app.post('/webhook', (req, res) => {

    try {

        res.sendStatus(200);

        if ("messages" in req.body.entry[0].changes[0].value) {
            const from = req.body.entry[0].changes[0].value.messages[0].from;

            if (req.body.entry[0].changes[0].value.messages[0].type == 'text') {
                const messageBody = req.body.entry[0].changes[0].value.messages[0].text.body;

                // if (messageBody.startsWith("/image ")) {

                //     chatImagen(messageBody.substring(7), from).then(respuesta => {

                //         optionsMensajeMultimediaImage.json.image.link = respuesta;
                //         optionsMensajeMultimediaImage.json.to = from;

                //         request.post(optionsMensajeMultimediaImage, function (error, response, body) {

                //             if (error) {
                //                 console.log("========================ERROR==================================");
                //                 console.log(error)
                //                 console.log("========================ERROR==================================");

                //                 const now = new Date();
                //                 fs.appendFileSync('/app/logsErrorRequestMeta.txt', `\n========================ERROR==================================`);
                //                 fs.appendFileSync('/app/logsErrorRequestMeta.txt', `\nFecha: ${now.toLocaleString()}`);
                //                 fs.appendFileSync('/app/logsErrorRequestMeta.txt', `\n${error}`);
                //                 fs.appendFileSync('/app/logsErrorRequestMeta.txt', `\n========================ERROR==================================`);

                //             } else {
                //                 const now = new Date();
                //                 fs.appendFileSync('/app/logs.txt', `\n-------------------------------------------------------------------`);
                //                 fs.appendFileSync('/app/logs.txt', `\nFecha: ${now.toLocaleString()}`);
                //                 fs.appendFileSync('/app/logs.txt', `\n${req.body.entry[0].changes[0].value.messages[0].from} pregunta : `);
                //                 fs.appendFileSync('/app/logs.txt', `\n${req.body.entry[0].changes[0].value.messages[0].text.body}`);
                //                 fs.appendFileSync('/app/logs.txt', `\nBOT responde : `);
                //                 fs.appendFileSync('/app/logs.txt', `\n${respuesta}`);
                //                 fs.appendFileSync('/app/logs.txt', `\n-------------------------------------------------------------------`);
                //             }
                //         });

                //     })

                // } else {

                    chatCompletion(messageBody).then(respuesta => {

                        if (respuesta.length > 4000) {
                            respuesta = respuesta.substring(0, 4000)
                        }

                        optionsMensajeChat.json.text.body = respuesta;
                        optionsMensajeChat.json.to = from;

                        request.post(optionsMensajeChat, function (error, response, body) {

                            if (error) {
                                console.log("========================ERROR==================================");
                                console.log(error)
                                console.log("========================ERROR==================================");

                                const now = new Date();
                                fs.appendFileSync('/app/logsErrorRequestMeta.txt', `\n========================ERROR==================================`);
                                fs.appendFileSync('/app/logsErrorRequestMeta.txt', `\nFecha: ${now.toLocaleString()}`);
                                fs.appendFileSync('/app/logsErrorRequestMeta.txt', `\n${error}`);
                                fs.appendFileSync('/app/logsErrorRequestMeta.txt', `\n========================ERROR==================================`);

                            } else {
                                const now = new Date();
                                fs.appendFileSync('/app/logs.txt', `\n-------------------------------------------------------------------`);
                                fs.appendFileSync('/app/logs.txt', `\nFecha: ${now.toLocaleString()}`);
                                fs.appendFileSync('/app/logs.txt', `\n${req.body.entry[0].changes[0].value.messages[0].from} pregunta : `);
                                fs.appendFileSync('/app/logs.txt', `\n${req.body.entry[0].changes[0].value.messages[0].text.body}`);
                                fs.appendFileSync('/app/logs.txt', `\nBOT responde : `);
                                fs.appendFileSync('/app/logs.txt', `\n${respuesta}`);
                                fs.appendFileSync('/app/logs.txt', `\n-------------------------------------------------------------------`);
                            }
                        });
                    })

                // }

            } else if (req.body.entry[0].changes[0].value.messages[0].type != 'reaction') {

                optionsMensajeChat.json.text.body = "Lo siento, solo puedo entender texto.\n\nRecuerda que no tengo conocimiento del contexto del chat, solo puedo responder a la última pregunta.";
                optionsMensajeChat.json.to = from;

                request.post(optionsMensajeChat, function (error, response, body) {

                    if (error) {
                        console.log("========================ERROR==================================");
                        console.log(error)
                        console.log("========================ERROR==================================");

                        const now = new Date();
                        fs.appendFileSync('/app/logsErrorRequestMeta.txt', `\n========================ERROR==================================`);
                        fs.appendFileSync('/app/logsErrorRequestMeta.txt', `\nFecha: ${now.toLocaleString()}`);
                        fs.appendFileSync('/app/logsErrorRequestMeta.txt', `\n${error}`);
                        fs.appendFileSync('/app/logsErrorRequestMeta.txt', `\n========================ERROR==================================`);

                    } else {
                        const now = new Date();
                        fs.appendFileSync('/app/logs.txt', `\n-------------------------------------------------------------------`);
                        fs.appendFileSync('/app/logs.txt', `\nFecha: ${now.toLocaleString()}`);
                        fs.appendFileSync('/app/logs.txt', `\n${req.body.entry[0].changes[0].value.messages[0].from} pregunta : `);
                        fs.appendFileSync('/app/logs.txt', `\nMultimedia`);
                        fs.appendFileSync('/app/logs.txt', `\nBOT responde : `);
                        fs.appendFileSync('/app/logs.txt', `\n${optionsMensajeChat.json.text.body}`);
                        fs.appendFileSync('/app/logs.txt', `\n-------------------------------------------------------------------`);
                    }
                });
            }
        }


    } catch (error) {
        console.log("========================ERROR==================================");
        console.log(error);
        console.log("========================ERROR==================================");

        const now = new Date();
        fs.appendFileSync('/app/logsErrorWebhookPost.txt', `\n========================ERROR==================================`);
        fs.appendFileSync('/app/logsErrorWebhookPost.txt', `\nFecha: ${now.toLocaleString()}`);
        fs.appendFileSync('/app/logsErrorWebhookPost.txt', `\n${error}`);
        fs.appendFileSync('/app/logsErrorWebhookPost.txt', `\n========================ERROR==================================`);
    }
})


const server = http.createServer(app)
server.listen(port, () => console.log(`Ejemplo de aplicación escuchando en el puerto ${port}!`))
