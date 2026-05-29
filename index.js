const mineflayer = require('mineflayer');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Bot Veanty đã hạn chế chào hỏi (Random)!'));
app.listen(PORT, () => console.log(`Web server chạy tại cổng ${PORT}`));

const botOptions = {
    host: 'Veanty.aternos.me', 
    port: 34795,                 
    username: 'Bot_247',       
    auth: 'offline'            
};

const randomMessages = [
   "Anh em choi zui ze", "sever toan trai zinh gai dep", "chuc mn nghi he zui ze", "Co j cu alo admin t la helper", "Skibidi dep zai", "omggg"
];

console.log('--- KÍCH HOẠT BOT: CHẾ ĐỘ CHÀO NGẪU NHIÊN HẠN CHẾ ---');
let bot;
let supervisedPlayers = []; 

function createMinecraftBot() {
    bot = mineflayer.createBot(botOptions);

    bot.on('login', () => {
        console.log('==> Bot đã vào server!');
        supervisedPlayers = []; 
    });
    
    bot.on('spawn', () => {
        console.log('==> Bot_247 đã sẵn sàng!');

        // ==========================================
        // 1. DI CHUYỂN VÀ ĐẶT BLOCK (GIỮ NGUYÊN)
        // ==========================================
        setInterval(async () => {
            if (!bot || !bot.entity) return;

            bot.setControlState('forward', true);
            setTimeout(() => {
                if (bot && bot.entity) {
                    bot.setControlState('forward', false);
                    bot.setControlState('back', true);
                    setTimeout(() => {
                        if (bot && bot.entity) bot.setControlState('back', false);
                    }, 200);
                }
            }, 200);

            const itemInInventory = bot.inventory.items().find(item => 
                item.name.includes('stone') || item.name.includes('dirt') || 
                item.name.includes('cobblestone') || item.name.includes('planks')
            );
            
            if (itemInInventory) {
                try {
                    await bot.equip(itemInInventory, 'hand');
                    const referenceBlock = bot.blockAt(bot.entity.position.offset(0, -1, 0));
                    if (referenceBlock) {
                        await bot.placeBlock(referenceBlock, new mineflayer.vec3(0, 1, 0));
                    }
                } catch (err) {}
            }
        }, 2000); 

        // ==========================================
        // 2. 🛠️ CƠ CHẾ CHÀO NGẪU NHIÊN (TỶ LỆ 35%)
        // ==========================================
        setInterval(() => {
            if (!bot || !bot.players) return;

            const currentPlayers = Object.keys(bot.players);

            currentPlayers.forEach(username => {
                if (username === bot.username) return;

                // Phát hiện người chơi mới vào
                if (!supervisedPlayers.includes(username)) {
                    supervisedPlayers.push(username); // Lưu tên lại để không quét trùng
                    
                    // QUAY XỔ SỐ: Chỉ có 35% cơ hội được chào (Trung bình 3-4 người vào thì chào 1-2 người)
                    const tiLeChao = Math.random(); // Trả về số từ 0 đến 1
                    if (tiLeChao < 0.35) { 
                        // Thỏa mãn tỉ lệ -> Tiến hành chào
                        setTimeout(() => {
                            if (bot && bot.entity) {
                                bot.chat(`chao mem @${username} nhem`);
                                console.log(`[🎲 HÊN XUI - ĐÃ CHÀO]: Tỷ lệ trúng, đã chào: ${username}`);
                            }
                        }, 3000); // Chờ 3 giây sau khi vào rồi mới chào cho giống người thật
                    } else {
                        // Tỷ lệ xịt -> Im lặng bơ luôn
                        console.log(`[🎲 HÊN XUI - BƠ LUÔN]: Tỷ lệ xịt, bot quyết định im lặng với: ${username}`);
                    }
                }
            });

            // Nếu họ out game thì xóa khỏi danh sách để lần sau vào lại còn quay số tiếp
            supervisedPlayers = supervisedPlayers.filter(username => currentPlayers.includes(username));

        }, 4000); 

        // ==========================================
        // 3. CHAT TỰ ĐỘNG MỖI 10 PHÚT (GIỮ NGUYÊN)
        // ==========================================
        setInterval(() => {
            if (bot && bot.entity) {
                const randomIndex = Math.floor(Math.random() * randomMessages.length);
                const message = randomMessages[randomIndex];
                bot.chat(message);
                console.log(`[👉 CHAT TỰ ĐỘNG]: Bot đã chat: "${message}"`);
            }
        }, 600000); 

    });
    
    bot.on('end', () => {
        console.log('==> Mất kết nối! Đang thử vào lại sau 15 giây...');
        setTimeout(createMinecraftBot, 15000); 
    });

    bot.on('kicked', (reason) => console.log('==> Bị Kick. Lý do:', JSON.stringify(reason)));
    bot.on('error', (err) => console.log('==> Lỗi:', err.message));
}

createMinecraftBot();
