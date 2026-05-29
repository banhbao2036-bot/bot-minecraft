const mineflayer = require('mineflayer');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Giữ Web Server chạy trên Render
app.get('/', (req, res) => res.send('Bot Veanty đã vá lỗi di chuyển và chào hỏi!'));
app.listen(PORT, () => console.log(`Web server chạy tại cổng ${PORT}`));

const botOptions = {
    host: 'Veanty.aternos.me', 
    port: 34795,                 
    username: 'Bot_247',       
    auth: 'offline'            
};

const randomMessages = [
    "Anh em choi zui ze",
    "sever toan trai zinh gai dep",
    "chuc mn nghi he zui ze",
    "Co j cu alo admin t la helper",
    "Skibidi dep zai",
    "omggg"
];

console.log('--- KÍCH HOẠT BOT VÀ VÁ LỖI HỆ THỐNG ---');
let bot;
let supervisedPlayers = []; // Danh sách để theo dõi người chơi đang online

function createMinecraftBot() {
    bot = mineflayer.createBot(botOptions);

    bot.on('login', () => {
        console.log('==> Bot đã đăng nhập vào server!');
        supervisedPlayers = []; // Reset danh sách khi bot vào lại game
    });
    
    bot.on('spawn', () => {
        console.log('==> Bot_247 đã spawn thành công!');

        // ==========================================
        // 🛠️ SỬA LỖI 1: ÉP BOT PHẢI DI CHUYỂN & TỰ ĐỘNG LẤY BLOCK ĐỂ ĐẶT
        // ==========================================
        setInterval(async () => {
            if (!bot || !bot.entity) return;

            // Hành động 1: Ép bot di chuyển tiến lên rồi lùi lại để chống AFK (Không cần điều kiện block)
            bot.setControlState('forward', true);
            setTimeout(() => {
                if (bot && bot.entity) {
                    bot.setControlState('forward', false);
                    bot.setControlState('back', true); // Đi lùi lại vị trí cũ
                    setTimeout(() => {
                        if (bot && bot.entity) bot.setControlState('back', false);
                    }, 200);
                }
            }, 200);

            // Hành động 2: Tự tìm block trong hành trang để đặt
            // Tìm bất kỳ block nào trong túi đồ (loại trừ các món không phải block)
            const itemInInventory = bot.inventory.items().find(item => item.name.includes('stone') || item.name.includes('dirt') || item.name.includes('cobblestone') || item.name.includes('planks'));
            
            if (itemInInventory) {
                try {
                    // Ép bot phải cầm block đó lên tay
                    await bot.equip(itemInInventory, 'hand');
                    
                    // Tìm vị trí block dưới chân để đặt lên
                    const referenceBlock = bot.blockAt(bot.entity.position.offset(0, -1, 0));
                    if (referenceBlock) {
                        // Thử đặt block
                        await bot.placeBlock(referenceBlock, new mineflayer.vec3(0, 1, 0));
                    }
                } catch (err) {
                    // Bỏ qua lỗi nếu không đặt được block (vướng chân hoặc hết chỗ đặt)
                }
            }
        }, 2000); // Thực hiện liên tục mỗi 2 giây

        // ==========================================
        // 🛠️ SỬA LỖI 2: CHÀO CHÍNH XÁC 100% KHÔNG BỎ SÓT AI
        // ==========================================
        setInterval(() => {
            if (!bot || !bot.players) return;

            // Lấy danh sách tên tất cả người chơi hiện tại trong server
            const currentPlayers = Object.keys(bot.players);

            currentPlayers.forEach(username => {
                // Bỏ qua chính bản thân bot
                if (username === bot.username) return;

                // Nếu tên người này chưa có trong danh sách theo dõi của bot -> Nghĩa là họ mới vào!
                if (!supervisedPlayers.includes(username)) {
                    supervisedPlayers.push(username); // Thêm họ vào danh sách đã chào
                    
                    // Chat chào mừng ngay lập tức
                    bot.chat(`chao bn @${username} skibdi nha`);
                    console.log(`[👋 CHÀO MỪNG CHÍNH XÁC]: Đã chào người chơi mới: ${username}`);
                }
            });

            // Lọc lại danh sách: Nếu có ai đó đã thoát game, xóa tên họ ra để lần sau họ vào lại còn chào tiếp
            supervisedPlayers = supervisedPlayers.filter(username => currentPlayers.includes(username));

        }, 4000); // Quét danh sách người chơi mỗi 4 giây một lần

        // ==========================================
        // TÍNH NĂNG 3: CỨ 10 PHÚT CHAT NGẪU NHIÊN 1 LẦN
        // ==========================================
        setInterval(() => {
            if (bot && bot.entity) {
                const randomIndex = Math.floor(Math.random() * randomMessages.length);
                const message = randomMessages[randomIndex];
                bot.chat(message);
                console.log(`[👉 CHAT TỰ ĐỘNG]: Bot đã chat: "${message}"`);
            }
        }, 600000); // 10 phút

    });
    
    // Tự động kết nối lại khi bị thoát
    bot.on('end', () => {
        console.log('==> Mất kết nối! Đang thử vào lại sau 15 giây...');
        setTimeout(createMinecraftBot, 15000); 
    });

    bot.on('kicked', (reason) => console.log('==> Bị Kick. Lý do:', JSON.stringify(reason)));
    bot.on('error', (err) => console.log('==> Lỗi:', err.message));
}

createMinecraftBot();
