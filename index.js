const mineflayer = require('mineflayer');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Tạo một web server cơ bản để Render không tắt bot
app.get('/', (req, res) => {
    res.send('Bot đang chạy online!');
});

app.listen(PORT, () => {
    console.log(`Web server đang chạy trên cổng ${PORT}`);
});

// Cấu hình Bot Minecraft
const botOptions = {
    host: 'marlin.aternos.host', 
    port: 34795,                 
    username: 'Bot_247'
};

console.log('--- KÍCH HOẠT BOT VỚI MINEFLAYER MỚI NHẤT ---');
let bot;

function createMinecraftBot() {
    bot = mineflayer.createBot(botOptions);

    bot.on('login', () => console.log('==> CHÚC MỪNG: Đăng nhập thành công!'));
    bot.on('spawn', () => console.log('==> THÀNH CÔNG: Bot đã đứng trong game!'));
    
    // Tự động kết nối lại nếu bị mất kết nối hoặc bị kick
    bot.on('end', () => {
        console.log('==> Bot mất kết nối! Đang kết nối lại sau 10 giây...');
        setTimeout(createMinecraftBot, 10000); 
    });

    bot.on('kicked', (reason) => {
        console.log('==> Bị Kick:', JSON.stringify(reason));
    });
    
    bot.on('error', (err) => console.log('==> Lỗi:', err.message));
}

// Chạy bot
createMinecraftBot();
