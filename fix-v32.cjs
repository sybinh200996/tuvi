const fs = require('fs');
let css = fs.readFileSync('public/mobile-style.css', 'utf8');

// Wipe old v31
css = css.replace(/\/\* ========================================================\s*V31 SUPER COMPACT BANNER[\s\S]*?(?=\n\n|$)/, '');
css = css.replace(/\/\* ========================================================\s*V31 SUPER COMPACT BANNER[\s\S]*?\}\s*\}/g, '');

const v32CSS = `
/* ========================================================
   V32 - BIG IMAGES & ABSOLUTE CENTER STATUS
======================================================== */
@media (max-width: 900px) {
  .hero {
    position: relative !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: flex-start !important;
    min-height: 145px !important;
    max-height: 145px !important;
    height: 145px !important;
    padding: 25px 5px 0 !important; /* Thêm padding top để nhường chỗ cho status-row */
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
    transform: scale(0.85) !important;
    transform-origin: top center !important;
  }

  /* ÉP STATUS ROW RA GIỮA TUYỆT ĐỐI */
  .status-row {
    position: absolute !important;
    top: 5px !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    right: auto !important;
    margin: 0 !important;
    padding: 3px 12px !important;
    display: inline-flex !important;
    font-size: 10px !important;
    background: rgba(0,0,0,0.6) !important;
    z-index: 20 !important; /* Luôn nổi lên trên */
    border-radius: 99px !important;
    width: auto !important;
    white-space: nowrap !important;
  }

  .hero h1 {
    font-size: 22px !important;
    margin: 0 0 4px 0 !important;
    text-align: center !important;
  }
  .hero p {
    display: none !important;
  }

  .hero-actions.quick {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 3px !important;
    margin: 0 auto !important;
    width: 100% !important;
  }
  
  .hero-actions.quick button {
    width: 120px !important;
    padding: 3px 8px !important;
    font-size: 10px !important;
    border-radius: 99px !important;
    margin: 0 !important;
    text-align: center !important;
  }

  .hero-search {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    position: relative !important;
    width: 90% !important;
    max-width: 250px !important;
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
    padding: 4px 10px !important;
    color: #dbfbff !important;
    font-size: 12px !important;
    width: 100% !important;
  }
  
  .hero-search button {
    flex: 0 0 auto !important;
    margin: 0 !important;
    padding: 4px 10px !important;
    border-radius: 99px !important;
    background: linear-gradient(135deg, rgba(16,227,255,1), rgba(18,78,214,1)) !important;
    border: none !important;
    color: #fff !important;
    font-size: 11px !important;
  }

  /* PHÓNG TO ẢNH VỪA VỚI BANNER */
  .hero-img.hero-left, .hero-img.hero-right {
    position: absolute !important;
    height: 100% !important;
    width: 42% !important; /* PHÓNG RẤT TO */
    max-width: 42% !important;
    top: 0 !important; /* Trải dài từ trên */
    bottom: 0 !important; /* Xuống dưới */
    opacity: 0.9 !important;
    z-index: 1 !important;
  }
  .hero-img.hero-left { left: 0 !important; } 
  .hero-img.hero-right { right: 0 !important; }

  .hero-img.hero-left img, .hero-img.hero-right img {
    object-fit: cover !important; /* Lấp đầy */
    object-position: top center !important; 
    width: 100% !important;
    height: 100% !important;
  }
}
`;

css += '\n' + v32CSS;
fs.writeFileSync('public/mobile-style.css', css);

let html = fs.readFileSync('public/mobile.html', 'utf8');
html = html.replace(/mobile-style\.css\?v=\d+/, 'mobile-style.css?v=' + Date.now());
fs.writeFileSync('public/mobile.html', html);

let sw = fs.readFileSync('public/service-worker.js', 'utf8');
sw = sw.replace(/const CACHE = "[^"]+";/, 'const CACHE = "v33-big-images-' + Date.now() + '";');
fs.writeFileSync('public/service-worker.js', sw);

console.log('v32 CSS applied: absolute center status, huge images.');
