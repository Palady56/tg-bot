const TelegramApi = require("node-telegram-bot-api") 

const {gameOptions, againOptions} = require('./options.js')
const token = '6102909773:AAHo8Q42fD7SKNRWO-ISVZGB2mwYDocjRA8'

const bot =  new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Угадай загаданное мной число от 0 до 9`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, "Отгадывай", gameOptions)
}

const start = () => {
    bot.setMyCommands([
    {command: '/start', description: "Приветствие..."},
    {command: '/info', description: "Получить информацию..."},
    {command: '/game', description: "Играй угадай число..."},
])


    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id
        // bot.sendMessage(chatId, `Ты написал ${text}`)

        if (text === "/start") {
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/1ee/7ff/1ee7ffd2-4a3e-385c-ab6b-f4c1137864c2/192/9.webp')
            return bot.sendMessage(chatId, `Добро пожаловать ${msg.from.first_name} (@${msg.from.username}) !`)
        }


        if (text === "/info") {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} и твой логин @${msg.from.username}`)
        }

        if (text === "/game") {
            return startGame(chatId)
        }
        return bot.sendMessage(chatId, 'Не понимаю вас')
    })

    bot.on("callback_query", async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id
        if (data === '/again') {
            return startGame(chatId )
        }

        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Ты отгадал, число ${chats[chatId]}`, againOptions)
        } else { 
            return bot.sendMessage(chatId, `Не отгадал, число было ${chats[chatId]}`, againOptions)
        } 
    })
}

start()