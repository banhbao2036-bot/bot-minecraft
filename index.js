const mineflayer = require('mineflayer');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// 1. Giữ Web Server chạy trên Render
app.get('/', (req, res) => {
    res.send('Bot Veanty thông minh đang online 24/7!');
});
app.listen(PORT, () => console.log(`Web server chạy tại cổng ${PORT}`));

// 2. Cấu hình Bot
const botOptions = {
    host: 'Veanty.aternos.me', 
    port: 34795,                 
    username: 'Bot_247',       
    auth: 'offline'            
};

// Danh sách các câu chat ngẫu nhiên chúc server / chúc player (mỗi 10 phút)
const randomMessages = [
    "Chúc toàn bộ anh em trong server chơi game vui vẻ nhé! 🎉",
    "Server Veanty đỉnh quá, chúc server ngày càng đông vui! 🚀",
    "Chúc các player một ngày săn kim cương ngập tràn hòm đồ!",
    "Anh em có cần phụ giúp gì cứ bảo Bot_247 một câu nha. 💪",
    "Hãy giữ sức khỏe và chơi game điều độ nhé mọi người ơi!",
    "Chúc mọi người một ngày tốt lành và không bị creeper nổ banh nhà! 🧨"
];

console.log('--- KÍCH HOẠT BOT THÔNG MINH ---');
let bot;

function createMinecraftBot() {
    bot = mineflayer.createBot(botOptions);

    bot.on('login', () => console.log('==> CHÚC MỪNG: Bot đã vào server!'));
    
    bot.on('spawn', () => {
        console.log('==> THÀNH CÔNG: Bot_247 đã sẵn sàng thực hiện nhiệm vụ!');

        // ==========================================
        // TÍNH NĂNG 1: CỨ 2 GIÂY DI CHUYỂN VÀ ĐẶT BLOCK (CHỐNG AFK)
        // ==========================================
        setInterval(() => {
            if (!bot || !bot.entity) return;

            // Cho bot đi tới 1 chút rồi dừng lại
            bot.setControlState('forward', true);
            setTimeout(() => {
                if (bot && bot.entity) bot.setControlState('forward', false);
            }, 200);

            // Thử đặt block dưới chân hoặc xung quanh nếu có block trong tay
            const blockInHand = bot.heldItem;
            if (blockInHand) {
                const referenceBlock = bot.blockAt(bot.entity.position.offset(0, -1, 0));
                if (referenceBlock) {
                    bot.placeBlock(referenceBlock, new mineflayer.vec3(0, 1, 0))
                       .catch(err => {
                           // Bỏ qua lỗi nếu không đặt được (ví dụ hết block hoặc vướng chân)
                       });
                }
            }
        }, 2000); // 2000ms = 2 giây

        // ==========================================
        // TÍNH NĂNG 2: CỨ 10 PHÚT CHAT NGẪU NHIÊN 1 LẦN
        // ==========================================
        setInterval(() => {
            if (bot && bot.entity) {
                const randomIndex = Math.floor(Math.random() * randomMessages.length);
                const message = randomMessages[randomIndex];
                bot.chat(message);
                console.log(`[👉 CHAT TỰ ĐỘNG]: Bot đã chat: "${message}"`);
            }
        }, 600000); // 600000ms = 10 phút

    });

    // ==========================================
    // TÍNH NĂNG 3: TỰ ĐỘNG CHÀO KHI CÓ NGƯỜI VÀO SERVER
    // ==========================================
    bot.on('playerJoined', (player) => {
        // Tránh trường hợp bot tự chào chính nó khi mới vào
        if (player.username !== bot.username) {
            // Đợi 2 giây sau khi người đó load xong địa hình thì mới chat chào
            setTimeout(() => {
                if (bot && bot.entity) {
                    bot.chat(`Chào mừng bạn @${player.username} đã tham gia vào server Veanty! Chúc bạn chơi game vui vẻ nha! ✨`);
                    console.log(`[👋 CHÀO MỪNG]: Đã chào người chơi: ${player.username}`);
                }
            }, 2000);
        }
    });
    
    // Tự động kết nối lại nếu bị out
    bot.on('end', () => {
        console.log('==> Mất kết nối! Đang thử vào lại sau 15 giây...');
        setTimeout(createMinecraftBot, 15000); 
    });

    bot.on('kicked', (reason) => console.log('==> Bị Kick. Lý do:', JSON.stringify(reason)));
    bot.on('error', (err) => console.log('==> Lỗi:', err.message));
}

// Chạy bot
createMinecraftBot();
