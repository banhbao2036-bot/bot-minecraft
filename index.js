const mineflayer = require('mineflayer');

// Cấu hình thông tin kết nối chính xác tới Aternos
const botOptions = {
    host: 'marlin.aternos.host', 
    port: 34795,                  
    username: 'Bot_247',
    skipValidation: true // Ép Mineflayer dùng đúng port này, bỏ qua tự động kiểm tra hệ thống
};

function createMyBot() {
    console.log('--- KÍCH HOẠT BOT TĂNG ĐỘNG 24/7 ---');
    console.log(`=> Đang tiến hành kết nối tới: ${botOptions.host}:${botOptions.port}`);
    
    // Khởi tạo bot
    const bot = mineflayer.createBot(botOptions);

    // Sự kiện khi Bot đăng nhập thành công vào mạng lưới server
    bot.on('login', () => {
        console.log('==> Bot đã đăng nhập thành công vào hệ thống mạng!');
    });
    
    // Sự kiện khi Bot chính thức xuất hiện (Spawn) trong thế giới game
    bot.on('spawn', () => {
        console.log('==> THÀNH CÔNG: Bot đã vào game và bắt đầu quậy!');
        
        // Dọn dẹp loop hành động cũ nếu có để tránh bị trùng lặp khi bot hồi sinh lại
        if (bot.randomActionInterval) clearInterval(bot.randomActionInterval);
        
        // VÒNG LẶP HÀNH ĐỘNG TĂNG ĐỘNG: Cứ mỗi 5 giây (5000ms) làm một hành động ngẫu nhiên
        bot.randomActionInterval = setInterval(() => {
            const actions = ['jump', 'forward', 'back', 'swing', 'look', 'chat'];
            const randomAction = actions[Math.floor(Math.random() * actions.length)];
            
            // Xóa toàn bộ trạng thái di chuyển trước đó để tránh bot đi thẳng một mạch xuống hồ
            bot.clearControlStates();

            // Bọc try...catch cho từng hành động để lỡ có lỗi địa hình bot cũng không bị sập code
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
                        }, 1000); // Đi thẳng 1 giây
                        break;
                        
                    case 'back':
                        bot.setControlState('back', true);
                        setTimeout(() => {
                            try { bot.setControlState('back', false); } catch(e) {}
                        }, 1000); // Đi lùi 1 giây
                        break;
                        
                    case 'swing':
                        bot.swingHand(); // Đấm tay ngẫu nhiên
                        break;
                        
                    case 'look':
                        // Xoay đầu nhìn ngẫu nhiên xung quanh cảnh đẹp hoa anh đào
                        const yaw = Math.random() * Math.PI * 2;
                        const pitch = (Math.random() - 0.5) * Math.PI / 2;
                        bot.look(yaw, pitch);
                        break;
                        
                    case 'chat':
                        const messages = ['Ui da!', 'Server ngon quá nha', 'Treo game tí thôi', 'Halo mọi người', 'View hoa anh đào đỉnh quá!'];
                        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
                        bot.chat(randomMsg);
                        break;
                }
            } catch (actionError) {
                console.log('=> Bỏ qua một hành động lỗi:', actionError.message);
            }
        }, 5000); 
    });

    // TỰ ĐỘNG HỒI SINH BẤT TỬ KHI BỊ KICK HOẶC LỖI MẠNG (XỬ LÝ DỨT ĐIỂM ECONNRESET)
    bot.on('kicked', (reason) => {
        console.log('==> Bot bị văng (Kicked):', JSON.stringify(reason));
        handleReconnect();
    });

    bot.on('error', (err) => {
        console.log('==> Lỗi kết nối mạng:', err.message);
        handleReconnect();
    });

    // Hàm xử lý đếm ngược kết nối lại một cách lì lợm
    function handleReconnect() {
        if (bot.randomActionInterval) clearInterval(bot.randomActionInterval);
        console.log('⏳ Render sẽ tự kết nối lại sau 15 giây...');
        setTimeout(() => createMyBot(), 15000);
    }
}

// Bật nguồn hệ thống Bot
createMyBot();

// --- TẠO WEB SERVER (CỔNG 3000) ĐỂ PHỤC VỤ UPTIMEROBOT VÀ RENDER ---
const express = require('express');
const app = express();
const webPort = process.env.PORT || 3000; // Render dùng cổng này nuôi web, không đá sang cổng Bot nữa

app.get('/', (req, res) => {
    res.send('Bot Minecraft đang hoạt động 24/7 ngon lành tại thung lũng hoa anh đào!');
});

app.listen(webPort, () => {
    console.log(`Web ảo phục vụ UptimeRobot đã sẵn sàng tại port ${webPort}`);
});
