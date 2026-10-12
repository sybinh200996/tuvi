const fs = require('fs');

let css = fs.readFileSync('public/mobile-style.css', 'utf8');

// Wipe all my recent appended blocks to start fresh
css = css.replace(/\/\* ========================================================\s*ULTIMATE COMPACT VERTICAL BANNER \(1\/2 HEIGHT\)[\s\S]*?(?=\n\n|$)/, '');
css = css.replace(/\/\* ========================================================\s*STATUS ROW CENTERING FIX[\s\S]*?(?=\n\n|$)/, '');
css = css.replace(/\/\* ========================================================\s*ULTIMATE COMPACT VERTICAL BANNER \(1\/2 HEIGHT\)[\s\S]*?\}\s*\}/g, '');
css = css.replace(/\/\* ========================================================\s*STATUS ROW CENTERING FIX[\s\S]*?\}\s*\}/g, '');

const finalMasterCSS = `
/* ========================================================
   MASTER MOBILE BANNER (COMPACT 1/2 HEIGHT)
======================================================== */
@media (max-width: 900px) {
  .hero {
    position: relative !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    min-height: 140px !important;
    height: auto !important;
    padding: 10px 5px !important;
    border-radius: 0 0 24px 24px !important;
    overflow: hidden !important;
  }
  
  .hero-content {
    position: relative !important;
    z-index: 10 !important;
    width: 100% !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    margin: 0 !important;
  }

  /* Status row (Server online) exactly in middle */
  .status-row {
    position: relative !important;
    left: auto !important;
    transform: none !important;
    margin: 0 auto 5px !important;
    padding: 3px 12px !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    font-size: 10px !important;
  }

  .hero h1 {
    font-size: 22px !important;
    margin: 0 0 2px 0 !important;
    text-align: center !important;
  }
  
  .hero p {
    font-size: 10px !important;
    margin: 0 0 5px 0 !important;
    line-height: 1 !important;
    text-align: center !important;
  }

  /* 4 Tab xếp hàng dọc ở giữa, khung rất gọn */
  .hero-actions.quick {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 4px !important;
    margin: 5px auto !important;
    width: 100% !important;
  }
  
  .hero-actions.quick button {
    width: auto !important;
    min-width: 130px !important;
    max-width: 160px !important;
    padding: 5px 12px !important;
    font-size: 11px !important;
    line-height: 1.2 !important;
    border-radius: 99px !important;
    margin: 0 !important;
  }

  /* Khung tìm kiếm tích hợp nút AI (Hộp thoại tìm kiếm) */
  .hero-search {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    position: relative !important;
    width: 90% !important;
    max-width: 280px !important;
    margin: 5px auto 0 !important;
    padding: 2px !important;
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
    padding: 6px 12px !important;
    color: #dbfbff !important;
    font-size: 12px !important;
    width: 100% !important;
    outline: none !important;
    box-shadow: none !important;
  }
  
  .hero-search button {
    flex: 0 0 auto !important;
    margin: 0 !important;
    padding: 6px 14px !important;
    border-radius: 99px !important;
    background: linear-gradient(135deg, rgba(16,227,255,0.9), rgba(18,78,214,0.9)) !important;
    border: none !important;
    color: #fff !important;
    font-weight: bold !important;
    font-size: 11px !important;
    white-space: nowrap !important;
    width: auto !important;
  }

  /* Ảnh nhân vật - Phải là absolute để không chiếm chỗ */
  .hero-img.hero-left, .hero-img.hero-right {
    position: absolute !important;
    height: 100% !important;
    max-height: 100% !important;
    width: auto !important;
    max-width: 25% !important;
    object-fit: contain !important;
    object-position: bottom !important;
    bottom: 0 !important;
    opacity: 0.6 !important;
    z-index: 1 !important;
  }
  
  .hero-img.hero-left {
    left: 0 !important;
  }
  .hero-img.hero-right {
    right: 0 !important;
  }
}
`;

css += '\n' + finalMasterCSS;
fs.writeFileSync('public/mobile-style.css', css);

// Bust Cache
let html = fs.readFileSync('public/mobile.html', 'utf8');
html = html.replace(/mobile-style\.css\?v=\d+/, `mobile-style.css?v=${Date.now()}`);
fs.writeFileSync('public/mobile.html', html);

let sw = fs.readFileSync('public/service-worker.js', 'utf8');
sw = sw.replace(/v[0-9]+-[a-zA-Z0-9-]+/, 'v25-banner-master');
fs.writeFileSync('public/service-worker.js', sw);

console.log('Master banner applied.');
