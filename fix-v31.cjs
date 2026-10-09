const fs = require('fs');

let css = fs.readFileSync('public/mobile-style.css', 'utf8');

// Xóa v30 cũ
css = css.replace(/\/\* ========================================================\s*FLAWLESS VERTICAL BANNER \(V30\)[\s\S]*?(?=\n\n|$)/, '');
css = css.replace(/\/\* ========================================================\s*FLAWLESS VERTICAL BANNER \(V30\)[\s\S]*?\}\s*\}/g, '');

const v31CSS = `
/* ========================================================
   V31 SUPER COMPACT BANNER & WIDE IMAGES
======================================================== */
@media (max-width: 900px) {
  /* ÉP CHIỀU CAO BANNER CỰC NGẮN */
  .hero {
    position: relative !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: flex-start !important;
    min-height: 145px !important; /* RÚT GỌN MẠNH MẼ */
    max-height: 145px !important;
    height: 145px !important;
    padding: 10px 5px 0 !important;
    border-radius: 0 0 20px 20px !important;
    overflow: hidden !important;
  }
  
  /* THU NHỎ NỘI DUNG Ở GIỮA ĐỂ VỪA VỚI BANNER NGẮN */
  .hero-content {
    position: relative !important;
    z-index: 10 !important;
    width: 100% !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    margin: 0 !important;
    transform: scale(0.85) !important; /* Cứu tinh giúp mọi thứ nhỏ lại */
    transform-origin: top center !important;
  }

  /* KÉO STATUS ROW VÀO ĐÚNG GIỮA */
  .status-row {
    position: relative !important;
    top: 0 !important;
    right: auto !important;
    left: auto !important;
    transform: none !important;
    margin: 0 auto 2px !important;
    padding: 2px 10px !important;
    display: inline-flex !important;
    font-size: 10px !important;
    background: rgba(0,0,0,0.5) !important;
  }

  .hero h1 {
    font-size: 22px !important;
    margin: 0 0 4px 0 !important;
    text-align: center !important;
  }
  .hero p {
    display: none !important;
  }

  /* TABS DỌC */
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

  /* HỘP THOẠI AI */
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

  /* MỞ RỘNG ẢNH NHƯ YÊU CẦU */
  .hero-img.hero-left, .hero-img.hero-right {
    position: absolute !important;
    height: 100% !important;
    width: 36% !important; /* Tăng độ rộng ảnh lên nhiều hơn (trước là 28%) */
    max-width: 36% !important;
    bottom: 0 !important;
    opacity: 0.9 !important;
    z-index: 1 !important;
  }
  .hero-img.hero-left { left: -10px !important; } /* Dịch một xíu ra mép */
  .hero-img.hero-right { right: -10px !important; }

  .hero-img.hero-left img, .hero-img.hero-right img {
    object-fit: cover !important; 
    object-position: top center !important; 
    width: 100% !important;
    height: 100% !important;
  }
}
`;

css += '\n' + v31CSS;
fs.writeFileSync('public/mobile-style.css', css);

let html = fs.readFileSync('public/mobile.html', 'utf8');
html = html.replace(/mobile-style\.css\?v=\d+/, 'mobile-style.css?v=' + Date.now());
fs.writeFileSync('public/mobile.html', html);

let sw = fs.readFileSync('public/service-worker.js', 'utf8');
sw = sw.replace(/v[0-9]+-[a-zA-Z0-9-]+/, 'v31-super-compact-' + Date.now());
fs.writeFileSync('public/service-worker.js', sw);

console.log('v31 applied: banner 145px, wider images (36%), scaled content.');
