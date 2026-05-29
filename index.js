const mineflayer = require('mineflayer');
const express = require('express');

const botOptions = {
    host: 'marlin.aternos.host', 
    port: 34795,                  
    username: 'Bot_247'
    
    // 🌟 MẸO CHÍ MẠNG: Nếu Render vẫn báo Live mà Aternos trống trơn, 
    // hãy xóa 2 dấu gạch chéo // ở dòng dưới và điền đúng phiên bản server của bạn vào nhé!
    // version: '1.21.1' 
};

function thucThiBot() {
    console.log('--- KÍCH HOẠT BOT VỚI MINEFLAYER MỚI NHẤT ---');
    console.log(`=> Đang phát tín hiệu kết nối tới: ${botOptions.host}:${botOptions.port}`);
    
    const bot = mineflayer.createBot(botOptions);

    // Các sự kiện chính giữ nguyên từ code của bạn
    bot.on('login', () => console.log('==> CHÚC MỪNG: Đăng nhập thành công!'));
    bot.on('spawn', () => console.log('==> THÀNH CÔNG: Bot đã đứng trong game!'));
    
    // Cải tiến: Tự động kích hoạt hồi sinh khi gặp sự cố ngắt kết nối
    bot.on('kicked', (reason) => {
        console.log('==> Bị Kick:', JSON.stringify(reason));
        coCheHoiSinh();
    });
    
    bot.on('error', (err) => {
        console.log('==> Lỗi mạng:', err.message);
        coCheHoiSinh();
    });
}

// Hàm đếm ngược để tự động chạy lại từ đầu
function coCheHoiSinh() {
    console.log('⏳ Render sẽ tự động thử kết nối lại sau 15 giây...');
    setTimeout(() => {
        thucThiBot();
    }, 15000);
}

// Kích hoạt chạy Bot lần đầu tiên
thucThiBot();


// ==========================================
// 🚀 GIỮ NGUYÊN ĐOẠN WEB ĐỂ PHỤC VỤ RENDER:
// ==========================================
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Bot đang chạy nha Render ơi!'));
app.listen(port, () => console.log(`==> Đã mở cổng Web ${port} để nịnh Render thành công!`));
