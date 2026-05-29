const mineflayer = require('mineflayer');

const botOptions = {
    host: 'madtom.aternos.host', 
    port: 34795,                 
    username: 'Bot_247' // Không thêm version, không thêm protocol, để Mineflayer mới tự lo
};

console.log('--- KÍCH HOẠT BOT VỚI MINEFLAYER MỚI NHẤT ---');
const bot = mineflayer.createBot(botOptions);

bot.on('login', () => console.log('==> CHÚC MỪNG: Đăng nhập thành công!'));
bot.on('spawn', () => console.log('==> THÀNH CÔNG: Bot đã đứng trong game!'));
bot.on('kicked', (reason) => console.log('==> Bị Kick:', JSON.stringify(reason)));
bot.on('error', (err) => console.log('==> Lỗi:', err.message));