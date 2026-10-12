const fs = require('fs');

let css = fs.readFileSync('public/mobile-style.css', 'utf8');

// Append CSS overrides to strictly remove the dark blue top space and round top corners
css += `
/* ========================================================
   STRICT BANNER FIX: NO TOP SPACE, ROUNDED TOP CORNERS
======================================================== */

/* Đẩy banner sát mí, không có margin top, cắt tối đa padding top */
.hero-wrap {
  margin: 0 !important; 
  padding: 5px 10px 15px !important; /* Cắt gần như sạch padding top */
  border-radius: 24px !important; /* Bo 4 góc (2 góc trên sẽ hiển thị dưới viền điện thoại) */
  min-height: unset !important;
  height: auto !important;
}

/* Đưa status lên ngang với viền trên */
.status-row {
  margin: 0 auto 0 !important; 
  position: relative !important;
  display: inline-block !important;
  font-size: 10px !important;
  padding: 2px 8px !important;
  top: 0 !important;
  left: 0 !important;
  transform: none !important;
  z-index: 10 !important;
}

/* Đưa tiêu đề "Đặng Năm Mystic" sát lên trên cùng (ngay dưới status) */
.hero-content h1 {
  margin-top: 2px !important;
  margin-bottom: 2px !important;
  font-size: 24px !important;
}

.hero-content p {
  margin-top: 0 !important;
  margin-bottom: 8px !important;
}

/* Đảm bảo hình ảnh nhân vật kéo sát lên để lấp khoảng trống */
.hero-img.hero-left, .hero-img.hero-right {
  height: 95% !important; /* Kéo cao lên một chút */
}

/* Khung tìm kiếm và nút bấm được bọc tròn liền mạch */
.hero-search {
  margin: 5px auto 0 !important;
}
`;

fs.writeFileSync('public/mobile-style.css', css);

// Bust cache
let mhtml = fs.readFileSync('public/mobile.html', 'utf8');
mhtml = mhtml.replace(/mobile-style\.css\?v=\d+/, 'mobile-style.css?v=' + Date.now());
fs.writeFileSync('public/mobile.html', mhtml);

console.log('Tuned banner to strictly remove top space and round corners');
