const fs = require('fs');

let css = fs.readFileSync('public/mobile-style.css', 'utf8');

css += `
/* --- FIX FEATURE CARDS TO SQUARE --- */
.feature-card {
  aspect-ratio: 1 / 1 !important;
  min-height: unset !important;
  height: auto !important;
  padding: 14px 12px !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: flex-start !important;
  text-align: left !important;
}

/* Adjust title and text spacing to fit perfectly inside the square */
.feature-card b {
  font-size: 28px !important;
  margin-bottom: 12px !important;
  display: block !important;
}

.feature-card h3 {
  font-size: 14px !important;
  margin-bottom: 6px !important;
  line-height: 1.25 !important;
}

.feature-card p {
  font-size: 11px !important;
  line-height: 1.35 !important;
  opacity: 0.8 !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  display: -webkit-box !important;
  -webkit-line-clamp: 3 !important;
  -webkit-box-orient: vertical !important;
}
`;

fs.writeFileSync('public/mobile-style.css', css);

// Bust cache again
let mhtml = fs.readFileSync('public/mobile.html', 'utf8');
mhtml = mhtml.replace(/mobile-style\.css\?v=\d+/, 'mobile-style.css?v=' + Date.now());
fs.writeFileSync('public/mobile.html', mhtml);

console.log('Fixed cards to square!');
