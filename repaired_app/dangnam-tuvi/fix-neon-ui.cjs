const fs = require('fs');

let css = fs.readFileSync('public/mobile-style.css', 'utf8');

css += `
/* ========================================================
   NEON UI, RECTANGLE CARDS, GOOGLE-STYLE SEARCH
======================================================== */

/* 1. Thanh tìm kiếm chuẩn Google (1 khung duy nhất) */
.hero-search.outside {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  background: rgba(5, 12, 35, 0.85) !important;
  border: 1px solid #00f0ff !important; /* Viền Neon xanh */
  box-shadow: 0 0 12px rgba(0, 240, 255, 0.4), inset 0 0 8px rgba(0, 240, 255, 0.2) !important;
  border-radius: 999px !important;
  padding: 3px 3px 3px 18px !important; /* Đệm gọn gàng */
  margin: 15px 14px 10px !important;
}

.hero-search.outside input {
  flex: 1 !important;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 10px 0 !important;
  color: #fff !important;
  font-size: 14px !important;
}

/* Nút AI Phân tích trở thành chữ chìm/icon nằm trong ô nhập */
.hero-search.outside button {
  flex: 0 0 auto !important;
  background: transparent !important;
  color: #00f0ff !important;
  border: none !important;
  box-shadow: none !important;
  padding: 10px 15px !important;
  font-size: 13px !important;
  font-weight: bold !important;
  text-transform: uppercase !important;
  border-left: 1px solid rgba(0, 240, 255, 0.3) !important; /* Vạch chia nhỏ giống Google Mic/Lens */
  border-radius: 0 !important;
}

/* 2. Thẻ chức năng: Hình chữ nhật & Neon */
.feature-card {
  aspect-ratio: 1.4 / 1 !important; /* Chuyển từ hình vuông thành hình chữ nhật ngang */
  border: 1px solid #00f0ff !important; /* Viền Neon */
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.2), inset 0 0 10px rgba(0, 240, 255, 0.1) !important;
  padding: 12px !important;
}

/* Thu hẹp khoảng cách các dòng chữ trong thẻ */
.feature-card b {
  margin-bottom: 4px !important; /* Cũ là 12px */
  font-size: 26px !important;
}

.feature-card h3 {
  margin-bottom: 2px !important; /* Cũ là 6px */
  font-size: 13.5px !important;
}

.feature-card p {
  margin-top: 0 !important;
  line-height: 1.25 !important;
}

/* 3. Tab Banner cũng có viền Neon */
.hero-actions.quick button {
  border: 1px solid #ff00ff !important; /* Neon tím/hồng cho nổi bật */
  box-shadow: 0 0 10px rgba(255, 0, 255, 0.4) !important;
  background: rgba(28, 4, 58, 0.6) !important;
}
`;

fs.writeFileSync('public/mobile-style.css', css);

// Bust cache
let mhtml = fs.readFileSync('public/mobile.html', 'utf8');
mhtml = mhtml.replace(/mobile-style\.css\?v=\d+/, 'mobile-style.css?v=' + Date.now());
fs.writeFileSync('public/mobile.html', mhtml);

console.log('Applied Google search style, rectangle cards, tight text spacing, and neon borders.');
