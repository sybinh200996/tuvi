const fs = require('fs');

let css = fs.readFileSync('public/mobile-style.css', 'utf8');

// Strip old .hero-actions.quick if any
css = css.replace(/\.hero-actions\.quick\s*\{[^}]+\}/g, '');

// Adjust the CSS
css += `
/* --- FIX HERO ACTIONS (VERTICAL STACK) --- */
.hero-actions.quick {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  gap: 8px !important;
  margin-top: 15px !important;
  width: 100% !important;
  z-index: 5 !important;
  position: relative !important;
}

.hero-actions.quick button {
  width: 70% !important;
  max-width: 250px !important;
  padding: 10px 15px !important;
  border-radius: 999px !important;
  font-size: 13px !important;
  text-align: center !important;
  background: rgba(3, 17, 67, 0.7) !important;
  border: 1px solid rgba(103, 235, 255, 0.4) !important;
  color: #eafdff !important;
  box-shadow: 0 0 15px rgba(0, 191, 255, 0.2) !important;
}

/* --- FIX HERO IMAGES TO FIT BANNER --- */
.hero-img.hero-left, .hero-img.hero-right {
  position: absolute !important;
  bottom: 0 !important;
  height: 90% !important; /* Fit within the banner's height */
  width: auto !important; /* Keep aspect ratio */
  max-width: 35% !important;
  object-fit: contain !important;
  object-position: bottom !important;
  z-index: 1 !important;
  opacity: 0.85 !important;
}

.hero-img.hero-left {
  left: 0 !important;
}

.hero-img.hero-right {
  right: 0 !important;
}
`;

fs.writeFileSync('public/mobile-style.css', css);

// Bust cache again
let mhtml = fs.readFileSync('public/mobile.html', 'utf8');
mhtml = mhtml.replace(/mobile-style\.css\?v=\d+/, 'mobile-style.css?v=' + Date.now());
fs.writeFileSync('public/mobile.html', mhtml);

console.log('Fixed banner tabs and images!');
