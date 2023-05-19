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
        // bot.sendMessage(chatId, `Кластер запушил ${text}`)

        if (text === "/start") {
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/1ee/7ff/1ee7ffd2-4a3e-385c-ab6b-f4c1137864c2/192/9.webp')
            return bot.sendMessage(chatId, `Добро пожаловать ${msg.from.first_name} (@${msg.from.username}) !`)
        }


        if (text === "/info") {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} и твой логин @${msg.from.username}`)
        }

        if (text === "/game") {
            return startGame(chatId)
            // if (randomNumber === text) {
            //     return bot.sendMessage(chatId, "Ахуеть ты пидРФЧМ говно силинкшот в могилу, угадал((((((")
            // } else if (randomNumber !== text) {
            //     return bot.sendMessage(chatId, "ЛОХ МИМО(((")
            // }
                
            
        }
        return bot.sendMessage(chatId, 'Ты даун, я не понимаю что ты несешь((())("ОП(')
    })

    bot.on("callback_query", async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id
        if (data === '/again') {
            return startGame(chatId )
        }

        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Ебатьа чтотоиотсчтоо ты отгадал цифру ${chats[chatId]}`, againOptions)
        } else { 
            return bot.sendMessage(chatId, `ЛОх тупой, не угадал, цифра была ${chats[chatId]}`, againOptions)
        } 
    })
}

start()