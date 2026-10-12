const fs = require('fs');
let css = fs.readFileSync('public/mobile-style.css', 'utf8');

// Strip out the previous two appended blocks
css = css.replace(/\/\* ========================================================\s*REDUCE BANNER HEIGHT 1\/2[\s\S]*?\/\* ========================================================\s*BANNER ADJUSTMENTS: VERTICAL TABS & INLINE SEARCH BUTTON[\s\S]*?(?=\n\n|$)/, '');
// Strip them if they are separate
css = css.replace(/\/\* ========================================================\s*REDUCE BANNER HEIGHT 1\/2[\s\S]*?\}\s*\}/, '');
css = css.replace(/\/\* ========================================================\s*BANNER ADJUSTMENTS: VERTICAL TABS & INLINE SEARCH BUTTON[\s\S]*?\}\s*\}/, '');

const finalBannerCss = `
/* ========================================================
   ULTIMATE COMPACT VERTICAL BANNER (1/2 HEIGHT)
======================================================== */
@media (max-width: 900px) {
  /* Khung banner cực kỳ ngắn */
  .hero {
    min-height: auto !important;
    padding: 15px 10px 10px !important;
    border-radius: 0 0 20px 20px !important;
  }
  
  .hero-content {
    margin-top: 5px !important;
  }

  .hero h1 {
    font-size: 20px !important;
    margin: 0 0 2px 0 !important;
  }
  
  .hero p {
    font-size: 9px !important;
    margin: 0 0 5px 0 !important;
    line-height: 1 !important;
  }

  /* 4 Tab xếp hàng dọc ở giữa, khung rất gọn */
  .hero-actions.quick {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    gap: 4px !important; /* Rất sít nhau */
    margin: 5px auto !important;
    width: 100% !important;
  }
  
  .hero-actions.quick button {
    width: auto !important;
    min-width: 140px !important; /* Rút gọn khung tab cực kỳ hợp lý */
    max-width: 180px !important;
    padding: 6px 15px !important; /* Tab mỏng lại */
    font-size: 11px !important;
    line-height: 1.2 !important;
    border-radius: 99px !important;
  }

  /* Khung tìm kiếm tích hợp nút AI (Hộp thoại tìm kiếm) */
  .hero-search {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    position: relative !important;
    width: 85% !important;
    max-width: 280px !important;
    margin: 8px auto 0 !important;
    padding: 2px !important; /* Nhỏ gọn */
    background: rgba(0,8,40,0.85) !important;
    border: 1px solid rgba(91,225,255,0.4) !important;
    border-radius: 99px !important;
    box-shadow: inset 0 2px 10px rgba(0,0,0,0.5) !important;
  }
  
  .hero-search input {
    flex: 1 1 auto !important;
    background: transparent !important;
    border: none !important;
    margin: 0 !important;
    padding: 8px 12px !important;
    color: #dbfbff !important;
    font-size: 12px !important;
    width: 100% !important;
  }
  
  .hero-search button {
    flex: 0 0 auto !important;
    margin: 0 !important;
    padding: 8px 12px !important; /* Nút mỏng lại */
    border-radius: 99px !important;
    background: linear-gradient(135deg, rgba(16,227,255,0.9), rgba(18,78,214,0.9)) !important;
    border: none !important;
    color: #fff !important;
    font-weight: bold !important;
    font-size: 11px !important;
    white-space: nowrap !important;
    width: auto !important;
  }

  /* Căn chỉnh hình ảnh hai bên banner cho hợp lý (không che chữ) */
  .hero-img.hero-left, .hero-img.hero-right {
    height: 100% !important;
    max-height: 130px !important; /* Thu nhỏ ảnh */
    max-width: 22% !important; /* Ép mỏng để không chạm vào cột dọc giữa */
    object-fit: contain !important;
    object-position: bottom !important;
    bottom: 0 !important;
    opacity: 0.8 !important;
  }
}
`;

css += '\n' + finalBannerCss;
fs.writeFileSync('public/mobile-style.css', css);

let sw = fs.readFileSync('public/service-worker.js', 'utf8');
sw = sw.replace(/v[0-9]+-[a-zA-Z0-9-]+/, 'v23-banner-perfect');
fs.writeFileSync('public/service-worker.js', sw);

console.log('Banner perfectly shortened and aligned.');
