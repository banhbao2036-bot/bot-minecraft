const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

// CẤU HÌNH BOT
const botOptions = {
    host: 'Veanty.aternos.me', // Dùng địa chỉ chính thay vì Dyn IP
    port: 34795,              
    username: 'Bot_247',
    version: '1.21.11',        // BẮT BUỘC: Điền chính xác phiên bản server của bạn
    skipValidation: true 
};

function createMyBot() {
    console.log('--- KHỞI ĐỘNG HỆ THỐNG BOT ---');
    
    const bot = mineflayer.createBot(botOptions);

    bot.on('login', () => {
        console.log('==> Đã kết nối vào server!');
    });

    bot.on('spawn', () => {
        console.log('==> Bot đã xuất hiện trong thế giới.');
    });

    bot.on('end', (reason) => {
        console.log(`==> Bot bị ngắt kết nối: ${reason}. Đang thử lại sau 10s...`);
        setTimeout(createMyBot, 10000);
    });

    bot.on('error', (err) => {
        console.log('==> LỖI MẠNG:', err.message);
        // Nếu lỗi là do không thể kết nối tới server, code sẽ tự khởi động lại
    });
}

// KHỞI TẠO WEB SERVER ĐỂ RENDER KHÔNG BỊ TẮT
app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(process.env.PORT || 3000, () => console.log('Web server ready.'));

createMyBot();
