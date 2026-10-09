const fs = require('fs');
let css = fs.readFileSync('public/mobile-style.css', 'utf8');

// Xóa tất cả các khối lỗi trước đây
css = css.replace(/\/\* ========================================================\s*ABSOLUTE FINAL BANNER[\s\S]*?(?=\n\n|$)/, '');
css = css.replace(/\/\* ========================================================\s*FIX BANNER IMAGES CROPPING[\s\S]*?(?=\n\n|$)/, '');
css = css.replace(/\/\* ========================================================\s*ABSOLUTE FINAL BANNER[\s\S]*?\}\s*\}/g, '');
css = css.replace(/\/\* ========================================================\s*FIX BANNER IMAGES CROPPING[\s\S]*?\}\s*\}/g, '');

const finalVerticalCSS = `
/* ========================================================
   TRUE VERTICAL TABS & COVER IMAGES (1/2 HEIGHT BANNER)
======================================================== */
@media (max-width: 900px) {
  /* Khóa cứng chiều cao banner để không bị kéo giãn */
  .hero {
    position: relative !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    min-height: 180px !important;
    max-height: 180px !important;
    height: 180px !important;
    padding: 5px !important;
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
    transform: scale(0.95) !important; /* Thu nhỏ nhẹ toàn bộ nội dung để vừa vặn */
  }

  /* Status row */
  .status-row {
    position: relative !important;
    left: auto !important;
    transform: none !important;
    margin: 0 auto 2px !important;
    padding: 2px 10px !important;
    display: inline-flex !important;
    font-size: 9px !important;
    background: rgba(0,0,0,0.4) !important;
  }

  .hero h1 {
    font-size: 20px !important;
    margin: 0 0 2px 0 !important;
    text-align: center !important;
  }
  .hero p {
    display: none !important; /* Ẩn đi để tiết kiệm chỗ */
  }

  /* Sắp xếp các tab thành HÀNG DỌC ở giữa */
  .hero-actions.quick {
    display: flex !important;
    flex-direction: column !important; /* Hàng dọc như yêu cầu */
    align-items: center !important;
    justify-content: center !important;
    gap: 4px !important;
    margin: 2px auto !important;
    width: 100% !important;
  }
  
  .hero-actions.quick button {
    width: 140px !important; /* Đều nhau */
    padding: 4px 10px !important; /* Rất mỏng */
    font-size: 10px !important;
    border-radius: 99px !important;
    margin: 0 !important;
    text-align: center !important;
    box-shadow: none !important;
  }

  /* Hộp thoại AI thu gọn vào form search */
  .hero-search {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    position: relative !important;
    width: 90% !important;
    max-width: 240px !important;
    margin: 4px auto 0 !important;
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
    font-size: 11px !important;
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
    font-size: 10px !important;
  }

  /* Hai hình 2 bên: KHỚP hoàn toàn vào banner, không bị xén lẹm, không bị kéo giãn */
  .hero-img.hero-left, .hero-img.hero-right {
    position: absolute !important;
    height: 100% !important;
    width: 28% !important; /* Mở rộng thêm để không bị lẹm */
    bottom: 0 !important;
    opacity: 0.8 !important;
    z-index: 1 !important;
  }
  .hero-img.hero-left { left: 0 !important; }
  .hero-img.hero-right { right: 0 !important; }

  /* Đảm bảo ảnh cover vừa vặn, giữ khuôn mặt ở trên cùng */
  .hero-img.hero-left img, .hero-img.hero-right img {
    object-fit: cover !important; 
    object-position: top center !important; 
    width: 100% !important;
    height: 100% !important;
  }
}
`;

css += '\n' + finalVerticalCSS;
fs.writeFileSync('public/mobile-style.css', css);

let html = fs.readFileSync('public/mobile.html', 'utf8');
html = html.replace(/mobile-style\.css\?v=\d+/, 'mobile-style.css?v=' + Date.now());
fs.writeFileSync('public/mobile.html', html);

let sw = fs.readFileSync('public/service-worker.js', 'utf8');
sw = sw.replace(/v[0-9]+-[a-zA-Z0-9-]+/, 'v28-vertical-hero-' + Date.now());
fs.writeFileSync('public/service-worker.js', sw);

console.log('Fixed vertical layout and images.');
