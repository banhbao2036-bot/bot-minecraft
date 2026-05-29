const mineflayer = require('mineflayer');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// 1. Tạo Web Server để Render không tắt bot
app.get('/', (req, res) => {
    res.send('Bot Veanty đang chạy online 24/7!');
});

app.listen(PORT, () => {
    console.log(`Web server đang mở tại cổng ${PORT}`);
});

// 2. Tách IP Server của bạn thành Host và Port đúng chuẩn Mineflayer
const botOptions = {
    host: 'Veanty.aternos.me', // Tên miền server từ ảnh của bạn
    port: 34795,               // Cổng (Port) tương ứng
    username: 'Bot_247',       // Tên của bot trong game
    auth: 'offline'            // Bắt buộc phải có vì server của bạn bật chế độ Crack
};

console.log('--- KÍCH HOẠT BOT VỚI IP: Veanty.aternos.me:34795 ---');
let bot;

function createMinecraftBot() {
    bot = mineflayer.createBot(botOptions);

    bot.on('login', () => console.log('==> CHÚC MỪNG: Bot đã đăng nhập vào server!'));
    
    bot.on('spawn', () => {
        console.log('==> THÀNH CÔNG: Bot_247 đã đứng trong game!');
        
        // Cứ mỗi 30 giây bot tự nhảy một cái để giảm tỷ lệ bị Aternos đá vì AFK
        setInterval(() => {
            if (bot && bot.entity) {
                bot.setControlState('jump', true);
                setTimeout(() => bot.setControlState('jump', false), 500);
            }
        }, 30000);
    });
    
    // Tự động kết nối lại nếu server Aternos bị tắt rồi bật lại
    bot.on('end', () => {
        console.log('==> Bot mất kết nối! Đang thử kết nối lại sau 15 giây...');
        setTimeout(createMinecraftBot, 15000); 
    });

    bot.on('kicked', (reason) => {
        console.log('==> Bot bị Kick khỏi server. Lý do:', JSON.stringify(reason));
    });
    
    bot.on('error', (err) => console.log('==> Gặp lỗi hệ thống:', err.message));
}

// Khởi chạy bot lần đầu tiên
createMinecraftBot();
