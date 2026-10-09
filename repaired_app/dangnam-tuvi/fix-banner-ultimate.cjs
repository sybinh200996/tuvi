const fs = require('fs');

let css = fs.readFileSync('public/mobile-style.css', 'utf8');

// I will completely nuke any existing margin/padding for hero-wrap and append a brutal override
css += `
/* ========================================================
   ULTIMATE BANNER TOP FIX (NO MARGIN, MAX ROUNDED)
======================================================== */
body {
  margin: 0 !important;
  padding: 0 !important;
}

.app-shell {
  padding-top: 0 !important;
  margin-top: 0 !important;
}

.hero-wrap {
  margin: 0 !important; /* Xoá sổ TẤT CẢ khoảng hở bên ngoài */
  padding-top: 2px !important; /* Ép sát padding bên trong lên cực hạn */
  padding-bottom: 15px !important;
  border-radius: 30px !important; /* Bo tròn cả 4 góc (phía trên và dưới) */
  width: 100% !important; 
  box-sizing: border-box !important;
}

/* Kéo chữ và status sát kịch trần */
.status-row {
  margin-top: 0 !important;
  padding-top: 2px !important;
  padding-bottom: 2px !important;
}

.hero-content h1 {
  margin-top: 0 !important;
  padding-top: 0 !important;
}

.hero-img.hero-left, .hero-img.hero-right {
  height: 98% !important;
  border-radius: 30px !important;
}
`;

fs.writeFileSync('public/mobile-style.css', css);

// Bust cache
let mhtml = fs.readFileSync('public/mobile.html', 'utf8');
mhtml = mhtml.replace(/mobile-style\.css\?v=\d+/, 'mobile-style.css?v=' + Date.now());
fs.writeFileSync('public/mobile.html', mhtml);

console.log('Force removed ALL top margin/padding and applied heavy border-radius');
