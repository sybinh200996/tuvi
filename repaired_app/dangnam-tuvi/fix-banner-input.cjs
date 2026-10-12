const fs = require('fs');

let css = fs.readFileSync('public/mobile-style.css', 'utf8');

// Append CSS overrides to the bottom
css += `
/* ========================================================
   RE-TWEAK BANNER: ROUNDED TOP, LESS TOP SPACE, INLINE BUTTON
======================================================== */

/* 1. Bỏ màu xanh đậm phía trên, bo tròn 2 góc trên */
.hero-wrap {
  margin: 10px 10px 0 !important; /* Tạo khoảng hở tí xíu để thấy độ bo tròn */
  padding: 15px 14px 15px !important; /* Cắt hoàn toàn khoảng đệm trên */
  border-radius: 24px !important; /* Bo tròn cả 4 góc (hoặc ít nhất 2 góc trên) */
}

/* 2. Sắp xếp lại trạng thái và Title do cắt chiều cao */
.status-row {
  position: relative !important; /* Không dùng absolute nữa để nó chiếm không gian chuẩn xác */
  top: 0 !important;
  left: 0 !important;
  transform: none !important;
  display: inline-block !important;
  margin: 0 auto 5px !important; /* Căn giữa và đẩy Title xuống 5px */
}

.hero-content {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
}

.hero-content h1 {
  margin-top: 5px !important; /* Vừa khít, không bị đè */
  font-size: 26px !important;
}

/* 3. Nút AI Phân tích nằm TRONG khung nhập */
.hero-search {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  width: 95% !important;
  max-width: 400px !important;
  margin: 10px auto 0 !important;
  padding: 4px 4px 4px 15px !important; /* Đệm trái cho chữ, đệm phải/trên/dưới bao nút */
  background: rgba(0, 8, 40, 0.75) !important;
  border-radius: 999px !important; /* Khung tròn 2 đầu */
  border: 1px solid rgba(91, 225, 255, 0.4) !important;
  box-shadow: inset 0 0 15px rgba(0, 221, 255, 0.2) !important;
  backdrop-filter: blur(10px) !important;
  gap: 0 !important; /* Xoá khoảng cách rời rạc */
}

.hero-search input {
  flex: 1 !important;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 8px 5px 8px 0 !important;
  color: #dbfbff !important;
  font-size: 13px !important;
  text-align: left !important;
}

.hero-search input:focus {
  outline: none !important;
}

.hero-search button {
  flex: 0 0 auto !important;
  padding: 10px 18px !important;
  border-radius: 999px !important;
  background: linear-gradient(135deg, #28e8ff, #61f4ff) !important;
  color: #002244 !important;
  font-size: 11px !important;
  font-weight: 700 !important;
  border: none !important;
  margin: 0 !important;
}
`;

fs.writeFileSync('public/mobile-style.css', css);

// Bust cache
let mhtml = fs.readFileSync('public/mobile.html', 'utf8');
mhtml = mhtml.replace(/mobile-style\.css\?v=\d+/, 'mobile-style.css?v=' + Date.now());
fs.writeFileSync('public/mobile.html', mhtml);

console.log('Fixed banner styling: rounded top, inline search button, no top space');
