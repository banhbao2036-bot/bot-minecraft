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
        
        if (bot.randomActionInterval) clearInterval(bot.randomActionInterval);
        
        bot.randomActionInterval = setInterval(() => {
            const actions = ['jump', 'forward', 'back', 'swing', 'look', 'chat'];
            const randomAction = actions[Math.floor(Math.random() * actions.length)];
            
            bot.clearControlStates();

            switch(randomAction) {
                case 'jump':
                    bot.setControlState('jump', true);
                    setTimeout(() => bot.setControlState('jump', false), 500);
                    break;
                case 'forward':
                    bot.setControlState('forward', true);
                    setTimeout(() => bot.setControlState('forward', false), 1000);
                    break;
                case 'back':
                    bot.setControlState('back', true);
                    setTimeout(() => bot.setControlState('back', false), 1000);
                    break;
                case 'swing':
                    bot.swingHand('right');
                    break;
                case 'look':
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
        }, 5000); 
    });

    // TỰ KẾT NỐI LẠI NẾU BỊ SERVER ĐÁ HOẶC LỖI MẠNG (XỬ LÝ DỨT ĐIỂM ECONNRESET)
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

createMyBot();

// --- TẠO WEB CỔNG 3000 ĐỂ RENDER ĐỌC ĐƯỢC ---
const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Bot dang chay nha!'));
app.listen(process.env.PORT || 3000, () => console.log('Web ao phuc vu UptimeRobot da san sang tai port 3000'));
