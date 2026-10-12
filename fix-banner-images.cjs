const fs = require('fs');

let css = fs.readFileSync('public/mobile-style.css', 'utf8');

const imageFixCss = `
/* ========================================================
   FIX BANNER IMAGES CROPPING
======================================================== */
@media (max-width: 900px) {
  /* Mở rộng khung chứa ảnh ra một chút */
  .hero-img.hero-left, .hero-img.hero-right {
    max-height: 100% !important; 
    max-width: 32% !important; /* Mở rộng chiều ngang */
  }
  
  /* Bắt buộc ảnh bên trong hiển thị toàn vẹn (contain) thay vì bị cắt xén (cover) */
  .hero-img.hero-left img, .hero-img.hero-right img {
    object-fit: contain !important;
    object-position: bottom !important;
    width: 100% !important;
    height: 100% !important;
  }
}
`;

if (!css.includes('FIX BANNER IMAGES CROPPING')) {
  css += '\n' + imageFixCss;
  fs.writeFileSync('public/mobile-style.css', css);
  console.log('Fixed banner image cropping.');
}

// Bust Cache
let html = fs.readFileSync('public/mobile.html', 'utf8');
html = html.replace(/mobile-style\.css\?v=\d+/, 'mobile-style.css?v=' + Date.now());
fs.writeFileSync('public/mobile.html', html);

let sw = fs.readFileSync('public/service-worker.js', 'utf8');
sw = sw.replace(/v[0-9]+-[a-zA-Z0-9-]+/, 'v27-image-fix-' + Date.now());
fs.writeFileSync('public/service-worker.js', sw);

console.log('Cache busted.');
