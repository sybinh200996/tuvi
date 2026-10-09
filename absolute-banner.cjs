const fs = require('fs');

let css = fs.readFileSync('public/mobile-style.css', 'utf8');

// Wipe the previous master block
css = css.replace(/\/\* ========================================================\s*MASTER MOBILE BANNER[\s\S]*?(?=\n\n|$)/, '');
css = css.replace(/\/\* ========================================================\s*MASTER MOBILE BANNER[\s\S]*?\}\s*\}/g, '');

const absoluteFinalBanner = `
/* ========================================================
   ABSOLUTE FINAL BANNER (1/2 HEIGHT)
======================================================== */
@media (max-width: 900px) {
  /* Khung banner cứng 1/2 chiều cao */
  .hero {
    position: relative !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    min-height: 155px !important;
    height: auto !important;
    padding: 10px !important;
    border-radius: 0 0 20px 20px !important;
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

  /* Trạng thái server online chính giữa (nhỏ) */
  .status-row {
    position: relative !important;
    left: auto !important;
    transform: none !important;
    margin: 0 auto 4px !important;
    padding: 2px 10px !important;
    display: inline-flex !important;
    align-items: center !important;
    font-size: 9px !important;
    background: rgba(0,0,0,0.4) !important;
  }

  /* Tiêu đề ngắn gọn */
  .hero h1 {
    font-size: 22px !important;
    margin: 0 0 2px 0 !important;
    text-align: center !important;
  }
  
  /* Ẩn bớt p để tiết kiệm chiều cao */
  .hero p {
    display: none !important;
  }

  /* TABS trên banner: Dạng Lưới 2x2 để tiết kiệm 50% chiều cao so với hàng dọc */
  .hero-actions.quick {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    gap: 5px !important;
    margin: 4px auto !important;
    width: 85% !important;
    max-width: 280px !important;
  }
  
  .hero-actions.quick button {
    width: 100% !important;
    padding: 6px 5px !important;
    font-size: 10.5px !important;
    border-radius: 99px !important;
    margin: 0 !important;
    text-align: center !important;
  }

  /* Hộp thoại AI thu gọn vào form search */
  .hero-search {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    position: relative !important;
    width: 90% !important;
    max-width: 280px !important;
    margin: 6px auto 0 !important;
    padding: 2px !important;
    background: rgba(0,8,40,0.85) !important;
    border: 1px solid rgba(91,225,255,0.4) !important;
    border-radius: 99px !important;
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
  }
  
  .hero-search button {
    flex: 0 0 auto !important;
    margin: 0 !important;
    padding: 6px 12px !important;
    border-radius: 99px !important;
    background: linear-gradient(135deg, rgba(16,227,255,1), rgba(18,78,214,1)) !important;
    border: none !important;
    color: #fff !important;
    font-size: 10px !important;
    white-space: nowrap !important;
  }

  /* Hai hình 2 bên trượt xuống dưới cùng */
  .hero-img.hero-left, .hero-img.hero-right {
    position: absolute !important;
    height: 100% !important;
    max-height: 80% !important; /* Thu nhỏ mạnh */
    width: auto !important;
    max-width: 20% !important;
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

css += '\n' + absoluteFinalBanner;
fs.writeFileSync('public/mobile-style.css', css);

// Bust Cache again
let html = fs.readFileSync('public/mobile.html', 'utf8');
html = html.replace(/mobile-style\.css\?v=\d+/, `mobile-style.css?v=${Date.now()}`);
fs.writeFileSync('public/mobile.html', html);

let sw = fs.readFileSync('public/service-worker.js', 'utf8');
sw = sw.replace(/v[0-9]+-[a-zA-Z0-9-]+/, `v26-banner-final-${Date.now()}`);
fs.writeFileSync('public/service-worker.js', sw);

console.log('Absolute final banner applied.');
