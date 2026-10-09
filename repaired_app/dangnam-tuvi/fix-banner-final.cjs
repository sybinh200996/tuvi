const fs = require('fs');

let css = fs.readFileSync('public/mobile-style.css', 'utf8');

// We will just append the overriding CSS for the banner to the very bottom to ensure it wins.
css += `
/* ========================================================
   FIX BANNER HEIGHT, STATUS POSITION, TAB SIZE, AI SEARCH 
======================================================== */

/* 1. Tweak hero banner height & status row to prevent overlapping */
.hero-wrap {
  padding: 35px 14px 15px !important; /* Reduced top padding */
  min-height: unset !important;
  height: auto !important;
}

.status-row {
  position: absolute !important;
  top: 10px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  z-index: 10 !important;
  white-space: nowrap !important;
  background: rgba(0, 0, 0, 0.3) !important;
  padding: 4px 10px !important;
  border-radius: 12px !important;
  backdrop-filter: blur(5px) !important;
}

.hero-content h1 {
  margin-top: 35px !important; /* Push title down so status-row has room */
  font-size: 28px !important;
}

/* 2. Rút ngắn các tab ở giữa, làm mờ (glassmorphism) */
.hero-actions.quick button {
  padding: 6px 12px !important; /* Thu ngắn chiều cao (ít padding hơn) */
  width: 55% !important; 
  max-width: 140px !important;
  background: rgba(255, 255, 255, 0.15) !important; /* Làm mờ, trong suốt */
  backdrop-filter: blur(10px) !important;
  border: 1px solid rgba(255, 255, 255, 0.25) !important;
  color: #fff !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2) !important;
  font-size: 11px !important;
}

/* 3. Đưa AI phân tích lên cùng một dòng với ô tìm kiếm */
.hero-search {
  display: flex !important;
  flex-direction: row !important; /* Đưa lên 1 dòng */
  align-items: stretch !important;
  justify-content: center !important;
  gap: 6px !important;
  width: 95% !important;
  max-width: 400px !important;
  margin: 12px auto 0 !important;
}

.hero-search input {
  flex: 1 !important;
  width: auto !important;
  padding: 8px 12px !important;
  font-size: 12px !important;
}

.hero-search button {
  flex: 0 0 auto !important;
  width: auto !important;
  padding: 8px 12px !important;
  white-space: nowrap !important;
  font-size: 11px !important;
  border-radius: 999px !important;
}
`;

fs.writeFileSync('public/mobile-style.css', css);

// Bust cache
let mhtml = fs.readFileSync('public/mobile.html', 'utf8');
mhtml = mhtml.replace(/mobile-style\.css\?v=\d+/, 'mobile-style.css?v=' + Date.now());
fs.writeFileSync('public/mobile.html', mhtml);

console.log('Fixed banner height, status row, tab blur, and AI search inline!');
