const mineflayer = require('mineflayer');

const botOptions = {
    host: 'madtom.aternos.host', 
    port: 34795,                 
    username: 'Bot_247'
};

function createMyBot() {
    console.log('--- KÍCH HOẠT BOT TĂNG ĐỘNG 24/7 ---');
    const bot = mineflayer.createBot(botOptions);

    bot.on('login', () => console.log('==> Bot đã đăng nhập thành công!'));
    
    bot.on('spawn', () => {
        console.log('==> THÀNH CÔNG: Bot đã vào game và bắt đầu quậy!');
        
        // Xóa loop cũ nếu có để tránh trùng lặp khi hồi sinh lại
        if (bot.randomActionInterval) clearInterval(bot.randomActionInterval);
        
        // CỨ MỖI 5 GIÂY (5000ms) LÀM 1 HÀNH ĐỘNG NGẪU NHIÊN
        bot.randomActionInterval = setInterval(() => {
            const actions = ['jump', 'forward', 'back', 'swing', 'look', 'chat'];
            const randomAction = actions[Math.floor(Math.random() * actions.length)];
            
            // Xóa toàn bộ trạng thái di chuyển cũ để không bị chạy một mạch xuống vực
            bot.clearControlStates();

            // Sử dụng try...catch để bọc toàn bộ hành động, lỗi gì cũng không sợ sập code
            try {
                switch(randomAction) {
                    case 'jump':
                        bot.setControlState('jump', true);
                        setTimeout(() => {
                            try { bot.setControlState('jump', false); } catch(e) {}
                        }, 500);
                        break;
                        
                    case 'forward':
                        bot.setControlState('forward', true);
                        setTimeout(() => {
                            try { bot.setControlState('forward', false); } catch(e) {}
                        }, 1000); // Đi tới 1 giây
                        break;
                        
                    case 'back':
                        bot.setControlState('back', true);
                        setTimeout(() => {
                            try { bot.setControlState('back', false); } catch(e) {}
                        }, 1000); // Đi lùi 1 giây
                        break;
                        
                    case 'swing':
                        // Sửa lỗi swingHand chuẩn phiên bản mới và bọc an toàn
                        bot.swingHand(); 
                        break;
                        
                    case 'look':
                        // Xoay đầu nhìn sang hướng ngẫu nhiên
                        const yaw = Math.random() * Math.PI * 2;
                        const pitch = (Math.random() - 0.5) * Math.PI / 2;
                        bot.look(yaw, pitch);
                        break;
                        
                    case 'chat':
                        const messages = ['Ui da!', 'Server ngon quá nha', 'Treo game tí thôi', 'Halo mọi người'];
                        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
                        bot.chat(randomMsg);
                        break;
                }
            } catch (actionError) {
                console.log('=> Bỏ qua một hành động bị lỗi lỗi:', actionError.message);
            }
        }, 5000); 
    });

    // TỰ ĐỘNG KẾT NỐI LẠI KHI BỊ KICK HOẶC LỖI MẠNG (XỬ LÝ DỨT ĐIỂM ECONNRESET)
    bot.on('kicked', (reason) => {
        console.log('==> Bị Kick:', JSON.stringify(reason));
        handleReconnect();
    });

    bot.on('error', (err) => {
        console.log('==> Lỗi mạng:', err.message);
        handleReconnect();
    });

    function handleReconnect() {
        if (bot.randomActionInterval) clearInterval(bot.randomActionInterval);
        console.log('⏳ Render sẽ tự kết nối lại sau 15 giây...');
        setTimeout(() => createMyBot(), 15000);
    }
}

// Kích hoạt chạy hệ thống Bot
createMyBot();

// --- TẠO WEB CỔNG 3000 ĐỂ PHỤC VỤ UPTIMEROBOT VÀ RENDER ---
const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Bot Minecraft dang hoat dong 24/7 ngon lanh!'));
app.listen(process.env.PORT || 3000, () => console.log('Web ao phuc vu UptimeRobot da san sang tai port 3000'));
