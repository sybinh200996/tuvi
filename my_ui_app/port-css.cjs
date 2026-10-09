const fs = require('fs');

let css = fs.readFileSync('public/style.css', 'utf8');

css += `
/* ========================================================
   NAM44 MOBILE UI FIXES (PORTED TO INDEX.HTML)
   - Ultra short banner
   - Inline Google search bar
   - No pink borders
======================================================== */
@media (max-width: 768px) {
  /* 1. Ép banner cực kỳ ngắn */
  .hero-section {
    padding: 10px 14px 20px !important; 
    min-height: 150px !important;
    height: auto !important;
    border-radius: 0 0 28px 28px !important;
  }

  .hero-center {
    max-width: 100% !important;
    margin: 0 !important;
    padding-top: 10px !important;
  }

  .hero-center h1 {
    font-size: 24px !important; 
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  }

  .hero-center p {
    margin-bottom: 4px !important; 
    font-size: 11px !important;
  }

  /* 2. Bỏ viền màu hồng ở các tab trên banner */
  .quick-row {
    gap: 6px !important;
    margin-top: 5px !important;
  }

  .quick-row button {
    padding: 6px 12px !important; 
    font-size: 12px !important;
    background: rgba(255, 255, 255, 0.15) !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    box-shadow: none !important;
    color: #fff !important;
  }

  /* 3. Khung tìm kiếm chuẩn Google (CÙNG DÒNG) */
  .search-shell {
    display: flex !important;
    flex-direction: row !important;
    flex-wrap: nowrap !important; /* BẮT BUỘC KHÔNG CHO XUỐNG DÒNG */
    align-items: center !important;
    justify-content: space-between !important;
    background: #ffffff !important; 
    border-radius: 999px !important;
    padding: 4px 4px 4px 15px !important; 
    height: 52px !important; 
    margin: -15px auto 15px !important; 
    width: 92% !important;
    max-width: 450px !important;
    position: relative !important;
    z-index: 20 !important;
    border: none !important;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4) !important;
  }

  .search-shell input {
    flex: 1 1 auto !important;
    min-width: 0 !important;
    height: 100% !important;
    background: transparent !important;
    border: none !important;
    padding: 0 10px 0 0 !important;
    margin: 0 !important;
    font-size: 14px !important;
    color: #333 !important;
  }

  .search-shell input::placeholder {
    color: #888 !important;
  }

  .search-shell button {
    flex: 0 0 auto !important;
    height: 44px !important;
    padding: 0 16px !important;
    margin: 0 !important;
    border-radius: 999px !important;
    background: #1a73e8 !important;
    color: #ffffff !important;
    border: none !important;
    font-size: 12px !important;
    white-space: nowrap !important;
    width: auto !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
}
`;

fs.writeFileSync('public/style.css', css);

// Bust cache on index.html
html = fs.readFileSync('public/index.html', 'utf8');
html = html.replace(/style\.css\?v=\d+/, 'style.css?v=' + Date.now());
fs.writeFileSync('public/index.html', html);

console.log('Applied mobile UI fixes to style.css');
