const fs = require('fs');

let css = fs.readFileSync('public/mobile-style.css', 'utf8');

css += `
/* ========================================================
   ULTRA-SHORT BANNER & TRUE INLINE SEARCH BAR
======================================================== */

/* 1. Ép banner cực kỳ ngắn */
.hero-wrap {
  padding: 10px 14px 20px !important; /* Cắt ngắn tối đa chiều cao (giảm 20px so với trước) */
  min-height: 150px !important;
}

.hero-content h1 {
  font-size: 24px !important; /* Chữ nhỏ lại một chút để vừa banner ngắn */
  margin-bottom: 0 !important;
}

.hero-content p {
  margin-bottom: 4px !important; /* Giảm khoảng cách chữ nhỏ */
  font-size: 11px !important;
}

.hero-actions.quick {
  margin-top: 0 !important;
  gap: 6px !important;
}

.hero-actions.quick button {
  padding: 6px 12px !important; /* Tab ngắn lại */
  font-size: 12px !important;
}

/* 2. Ép Thanh tìm kiếm và nút "AI Phân Tích" trên CÙNG 1 DÒNG (KHÔNG XUỐNG DÒNG) */
.hero-search.outside {
  display: flex !important;
  flex-direction: row !important;
  flex-wrap: nowrap !important; /* BẮT BUỘC KHÔNG CHO XUỐNG DÒNG */
  align-items: center !important;
  justify-content: space-between !important;
  background: #ffffff !important; 
  border-radius: 999px !important;
  padding: 4px 4px 4px 15px !important; /* Viền bao sát kịt nút bấm */
  height: 52px !important; /* Cố định 1 chiều cao duy nhất */
  margin: -15px auto 15px !important; /* Nằm ngàm vào banner */
  width: 92% !important;
  max-width: 450px !important;
}

.hero-search.outside input {
  flex: 1 1 auto !important;
  min-width: 0 !important; /* Bắt buộc để flex item không bị tràn ngang */
  height: 100% !important;
  background: transparent !important;
  border: none !important;
  padding: 0 10px 0 0 !important;
  margin: 0 !important;
  font-size: 14px !important;
  color: #333 !important;
  outline: none !important;
}

/* Nút bấm dính chặt vào mép phải bên trong ô trắng */
.hero-search.outside button {
  flex: 0 0 auto !important;
  height: 44px !important;
  padding: 0 16px !important;
  margin: 0 !important;
  border-radius: 999px !important;
  background: #1a73e8 !important; /* Nút xanh Google */
  color: #ffffff !important;
  border: none !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 12px !important;
  white-space: nowrap !important; /* Chữ trên nút không được xuống dòng */
}
`;

fs.writeFileSync('public/mobile-style.css', css);

// Bust cache
let mhtml = fs.readFileSync('public/mobile.html', 'utf8');
mhtml = mhtml.replace(/mobile-style\.css\?v=\d+/, 'mobile-style.css?v=' + Date.now());
fs.writeFileSync('public/mobile.html', mhtml);

console.log('Applied ultra short banner and forced inline nowrap search bar');
