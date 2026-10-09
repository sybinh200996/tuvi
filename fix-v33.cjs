const fs = require('fs');
let css = fs.readFileSync('public/mobile-style.css', 'utf8');

// Wipe old v32
css = css.replace(/\/\* ========================================================\s*V32 - BIG IMAGES[\s\S]*?(?=\n\n|$)/, '');
css = css.replace(/\/\* ========================================================\s*V32 - BIG IMAGES[\s\S]*?\}\s*\}/g, '');

const v33CSS = `
/* ========================================================
   V33 - BLENDED IMAGES, NO TOP GAP, TEXT ONLY STATUS
======================================================== */
@media (max-width: 900px) {
  /* Xóa khoảng trống màu xanh dương đậm ở trên, thu gọn chiều cao */
  .hero {
    position: relative !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    min-height: 125px !important; /* Rút gọn triệt để do bỏ gap trên */
    max-height: 125px !important;
    height: 125px !important;
    padding: 0 5px 0 !important; /* Bỏ hoàn toàn khoảng trống trên cùng */
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
    transform-origin: center center !important;
  }

  /* XÓA TAB SERVER ONLINE VÀ CHỈ LÀM CHỮ TRÊN GÓC PHẢI */
  .status-row {
    position: absolute !important;
    top: 5px !important;
    right: 10px !important;
    left: auto !important;
    transform: none !important;
    margin: 0 !important;
    padding: 0 !important;
    display: inline-flex !important;
    font-size: 9px !important;
    background: transparent !important; /* Xóa nền tab */
    border: none !important; /* Xóa viền */
    box-shadow: none !important;
    color: rgba(255,255,255,0.7) !important;
    z-index: 20 !important;
  }
  
  /* Ẩn phần chip rườm rà, chỉ giữ lại chấm xanh và chữ Server Online */
  .status-row .chip {
    display: none !important;
  }

  .hero h1 {
    font-size: 24px !important;
    margin: 0 0 4px 0 !important;
    text-align: center !important;
  }
  .hero p {
    display: none !important;
  }

  /* TABS NGẮN GỌN */
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

  /* ẢNH GIỮ KÍCH THƯỚC TO VÀ LÀM MỜ VIỀN TRONG */
  .hero-img.hero-left, .hero-img.hero-right {
    position: absolute !important;
    height: 100% !important;
    width: 42% !important; 
    max-width: 42% !important;
    top: 0 !important; 
    bottom: 0 !important; 
    opacity: 0.9 !important;
    z-index: 1 !important;
  }
  
  /* LÀM MỜ VIỀN BÊN PHẢI CỦA ẢNH TRÁI ĐỂ HÒA VÀO NỀN */
  .hero-img.hero-left { 
    left: 0 !important; 
    -webkit-mask-image: linear-gradient(to right, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%) !important;
    mask-image: linear-gradient(to right, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%) !important;
  } 
  
  /* LÀM MỜ VIỀN BÊN TRÁI CỦA ẢNH PHẢI ĐỂ HÒA VÀO NỀN */
  .hero-img.hero-right { 
    right: 0 !important; 
    -webkit-mask-image: linear-gradient(to left, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%) !important;
    mask-image: linear-gradient(to left, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%) !important;
  }

  .hero-img.hero-left img, .hero-img.hero-right img {
    object-fit: cover !important; 
    object-position: top center !important; 
    width: 100% !important;
    height: 100% !important;
  }
}
`;

css += '\n' + v33CSS;
fs.writeFileSync('public/mobile-style.css', css);

let html = fs.readFileSync('public/mobile.html', 'utf8');
html = html.replace(/mobile-style\.css\?v=\d+/, 'mobile-style.css?v=' + Date.now());
fs.writeFileSync('public/mobile.html', html);

let sw = fs.readFileSync('public/service-worker.js', 'utf8');
sw = sw.replace(/const CACHE = "[^"]+";/, 'const CACHE = "v34-fade-images-' + Date.now() + '";');
fs.writeFileSync('public/service-worker.js', sw);

console.log('v33 CSS applied: faded edges, no top gap, text status right.');
