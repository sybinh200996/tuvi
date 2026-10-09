const fs = require('fs');

let css = fs.readFileSync('public/mobile-style.css', 'utf8');

// Cắt bỏ TẤT CẢ các khối CSS do Antigravity thêm vào từ trước đến nay
// Tìm vị trí của khối đầu tiên
const firstBlockIndex = css.indexOf('/* ========================================================');
if (firstBlockIndex !== -1) {
    css = css.substring(0, firstBlockIndex);
}

// Giờ thêm đúng 1 khối duy nhất, gọn gàng, chuẩn xác nhất
const finalCSS = `
/* ========================================================
   V35 FINAL - NO JUMBLE, PERFECT FEET & HIDDEN STATUS
======================================================== */
@media (max-width: 900px) {
  /* ÉP CHIỀU CAO BANNER SIÊU NGẮN (Không có padding top - giống y hệt V35) */
  .hero {
    position: relative !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: flex-start !important;
    min-height: 118px !important;
    max-height: 118px !important;
    height: 118px !important;
    padding: 0 5px 0 !important; 
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

  /* ẨN HOÀN TOÀN TAB SERVER ONLINE (như V35) */
  .status-row {
    display: none !important;
  }

  .hero h1 {
    font-size: 24px !important;
    margin: 5px 0 4px 0 !important; /* Đẩy h1 xuống một chút xíu so với mép */
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

  /* ẢNH FADE EDGES CỦA V35 */
  .hero-img.hero-left, .hero-img.hero-right {
    position: absolute !important;
    height: 100% !important;
    top: 0 !important; 
    bottom: 0 !important; 
    opacity: 0.9 !important;
    z-index: 1 !important;
  }
  
  .hero-img.hero-left { 
    left: 0 !important; 
    /* THU NHỎ width ảnh trái xuống 35% để thấy chân nhiều hơn khi object-fit cover */
    width: 35% !important; 
    max-width: 35% !important;
    -webkit-mask-image: linear-gradient(to right, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%) !important;
    mask-image: linear-gradient(to right, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%) !important;
  } 
  
  .hero-img.hero-right { 
    right: 0 !important; 
    width: 42% !important;
    max-width: 42% !important;
    -webkit-mask-image: linear-gradient(to left, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%) !important;
    mask-image: linear-gradient(to left, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%) !important;
  }

  /* ẢNH TRÁI: Dịch xuống để thấy chân */
  .hero-img.hero-left img {
    object-fit: cover !important; 
    object-position: bottom center !important; /* Chuyển trọng tâm xuống dưới để thấy chân */
    width: 100% !important;
    height: 100% !important;
  }

  .hero-img.hero-right img {
    object-fit: cover !important; 
    object-position: top center !important; 
    width: 100% !important;
    height: 100% !important;
  }
}
`;

css += '\n' + finalCSS;
fs.writeFileSync('public/mobile-style.css', css);

let html = fs.readFileSync('public/mobile.html', 'utf8');
html = html.replace(/mobile-style\.css\?v=\d+/, 'mobile-style.css?v=' + Date.now());
fs.writeFileSync('public/mobile.html', html);

let sw = fs.readFileSync('public/service-worker.js', 'utf8');
sw = sw.replace(/const CACHE = "[^"]+";/, 'const CACHE = "v39-clean-slate-' + Date.now() + '";');
fs.writeFileSync('public/service-worker.js', sw);

console.log('Clean slate V35 applied.');
