const express = require('express');
const bodyParser = require('body-parser');
const { Telegraf } = require('telegraf');

const app = express();

const BOT_TOKEN = process.env.BOT_TOKEN; // Берем из переменной окружения
const bot = new Telegraf(BOT_TOKEN);
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Функция безопасного парсинга initData
function parseInitData(initData) {
    const params = new URLSearchParams(initData);
    const user = JSON.parse(params.get('user'));
    return user;
}

app.post('/start-timer', async (req, res) => {
    const { minutes, initData } = req.body;

    try {
        const user = parseInitData(initData);
        const userId = user.id;

        console.log(`Запуск таймера на ${minutes} минут для пользователя ${userId}`);

        setTimeout(async () => {
            try {
                await bot.telegram.sendMessage(userId, '⏰ Ваш таймер истёк!');
                console.log(`Сообщение отправлено пользователю ${userId}`);
            } catch (err) {
                console.error('Ошибка при отправке сообщения:', err);
            }
        }, minutes * 60 * 1000);

        res.sendStatus(200);
    } catch (err) {
        console.error('Ошибка при запуске таймера:', err);
        res.sendStatus(500);
    }
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});

bot.launch();
