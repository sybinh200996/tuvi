const fs = require('fs');

// 1. Bust CSS cache in mobile.html
let html = fs.readFileSync('public/mobile.html', 'utf8');
html = html.replace(/mobile-style\.css\?v=\d+/, `mobile-style.css?v=${Date.now()}`);
fs.writeFileSync('public/mobile.html', html);
console.log('Busted CSS cache in mobile.html');

// 2. Add specific fix for .status-row centering
let css = fs.readFileSync('public/mobile-style.css', 'utf8');
const statusRowFix = `
/* ========================================================
   STATUS ROW CENTERING FIX
======================================================== */
@media (max-width: 900px) {
  .hero {
    position: relative !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
  }
  .status-row {
    position: relative !important;
    left: auto !important;
    transform: none !important;
    margin: 0 auto 5px !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: max-content !important;
  }
  .hero-content {
    width: 100% !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
  }
}
`;

if (!css.includes('STATUS ROW CENTERING FIX')) {
  css += '\n' + statusRowFix;
  fs.writeFileSync('public/mobile-style.css', css);
  console.log('Added status row fix.');
}

// 3. Update Service Worker Cache Variable
let sw = fs.readFileSync('public/service-worker.js', 'utf8');
sw = sw.replace(/v[0-9]+-[a-zA-Z0-9-]+/, 'v24-banner-cache-busted');
fs.writeFileSync('public/service-worker.js', sw);
console.log('Updated service worker cache.');
