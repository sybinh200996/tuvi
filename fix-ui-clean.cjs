const fs = require('fs');

let css = fs.readFileSync('public/mobile-style-clean.css', 'utf8');

css += `
/* ========================================================
   CLEAN UI FIX: GOOGLE SEARCH, NO TOP GAP, CLEAN BANNER
======================================================== */

/* 1. Xóa sạch khoảng trống trên banner và bo góc dưới */
body {
  margin: 0 !important;
  padding: 0 !important;
}

.app-shell {
  padding-top: 0 !important;
  margin-top: 0 !important;
}

.hero-wrap {
  margin: 0 !important; /* Xóa khoảng trống thừa màu xanh đậm */
  padding: 30px 14px 20px !important; /* Padding vừa đủ để h1 không dính nóc */
  border-radius: 0 0 35px 35px !important; /* Bo góc mượt ở bên dưới, phía trên sát mí */
  background: linear-gradient(135deg, rgba(8,16,66,0.95), rgba(28,4,58,0.95)) !important;
  width: 100% !important; 
  box-sizing: border-box !important;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important;
  position: relative !important;
  overflow: hidden !important;
}

/* Kéo chữ và status về vị trí sạch sẽ */
.status-row {
  margin: 0 auto 10px !important;
  display: inline-block !important;
  padding: 4px 12px !important;
  background: rgba(0, 0, 0, 0.3) !important;
  border-radius: 999px !important;
  position: relative !important;
  z-index: 10 !important;
}

.hero-content {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
}

.hero-content h1 {
  margin-top: 0 !important;
  font-size: 28px !important;
  z-index: 10 !important;
  position: relative !important;
}

.hero-content p {
  margin-top: 4px !important;
  margin-bottom: 12px !important;
  z-index: 10 !important;
  position: relative !important;
}

/* 2. Ảnh nhân vật */
.hero-img.hero-left, .hero-img.hero-right {
  height: 100% !important;
  object-fit: cover !important;
  object-position: top !important;
  border-radius: 0 0 35px 35px !important;
  z-index: 1 !important;
}

/* 3. Bỏ viền màu hồng ở các tab trên banner */
.hero-actions.quick {
  position: relative !important;
  z-index: 10 !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  gap: 8px !important;
  margin-top: 5px !important;
  width: 100% !important;
}

.hero-actions.quick button {
  width: 60% !important;
  max-width: 160px !important;
  padding: 10px 15px !important;
  border-radius: 999px !important;
  background: rgba(255, 255, 255, 0.15) !important; /* Xám mờ sạch sẽ */
  border: 1px solid rgba(255, 255, 255, 0.2) !important; /* Viền xám trắng tinh tế, KHÔNG MÀU HỒNG */
  color: #fff !important;
  backdrop-filter: blur(8px) !important;
  font-size: 13px !important;
  font-weight: 500 !important;
  box-shadow: none !important; /* Xóa bóng neon */
}

/* 4. Khung tìm kiếm chuẩn Google (1 khối duy nhất, nền trắng/sáng) */
.hero-search.outside {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  width: 90% !important;
  max-width: 400px !important;
  margin: -25px auto 20px !important; /* Đẩy trồi lên đè vào mí dưới của banner một chút cho đẹp */
  padding: 4px 4px 4px 20px !important; /* Trái rộng, phải hẹp vì có nút */
  background: #ffffff !important; /* Nền trắng chuẩn Google */
  border-radius: 999px !important;
  border: none !important;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4) !important; /* Bóng đổ nhẹ để nổi bật */
  position: relative !important;
  z-index: 20 !important; /* Nổi lên trên banner */
}

.hero-search.outside input {
  flex: 1 !important;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 12px 0 !important;
  color: #333333 !important; /* Chữ tối trên nền trắng */
  font-size: 15px !important;
  outline: none !important;
}

.hero-search.outside input::placeholder {
  color: #888888 !important;
}

/* Nút AI phân tích (nằm gọn trong khung nhập, không có viền thừa) */
.hero-search.outside button {
  flex: 0 0 auto !important;
  padding: 12px 20px !important;
  border-radius: 999px !important;
  background: #f1f3f4 !important; /* Nút xám nhạt kiểu Google */
  color: #1a73e8 !important; /* Chữ xanh Google */
  font-size: 14px !important;
  font-weight: 700 !important;
  border: none !important;
  box-shadow: none !important;
  margin-left: 8px !important;
}
`;

fs.writeFileSync('public/mobile-style.css', css);

// Bust cache
let mhtml = fs.readFileSync('public/mobile.html', 'utf8');
mhtml = mhtml.replace(/mobile-style\.css\?v=\d+/, 'mobile-style.css?v=' + Date.now());
fs.writeFileSync('public/mobile.html', mhtml);

console.log('Applied final clean UI fix: Google search, removed pink borders, zero banner top margin');
