const fs = require('fs');

let css = fs.readFileSync('public/mobile-style.css', 'utf8');

// 1. Strip ALL existing .bottom-nav rules to prevent conflicts
css = css.replace(/\.bottom-nav\s*\{[^}]+\}/g, '');

// 2. Strip ALL existing .hero-img, .hero-left, .hero-right rules
css = css.replace(/\.hero-img\s*\{[^}]+\}/g, '');
css = css.replace(/\.hero-left(:after)?\s*\{[^}]+\}/g, '');
css = css.replace(/\.hero-right(:before)?\s*\{[^}]+\}/g, '');
css = css.replace(/\.hero-content\s*\{[^}]+\}/g, '');

// 3. Add clean rules at the end
css += `
/* --- CLEAN HERO BANNER --- */
.hero-wrap {
  position: relative !important;
  padding: 60px 14px 20px !important;
  background: linear-gradient(135deg, rgba(8,16,66,0.95), rgba(28,4,58,0.95)) !important;
  border-radius: 0 0 30px 30px !important;
  box-shadow: 0 10px 40px rgba(0,0,0,0.5) !important;
  overflow: hidden !important;
  min-height: 250px !important;
  height: auto !important;
}

.hero-img {
  display: block !important;
  position: absolute !important;
  bottom: 0 !important;
  z-index: 1 !important;
  pointer-events: none !important;
}

.hero-img.hero-left {
  left: -10px !important;
  width: 35% !important;
  max-width: 150px !important;
  opacity: 0.9 !important;
}

.hero-img.hero-right {
  right: -10px !important;
  width: 40% !important;
  max-width: 160px !important;
  opacity: 0.9 !important;
}

.hero-content {
  position: relative !important;
  z-index: 3 !important;
  text-align: center !important;
}

.hero-content h1 {
  font-size: 32px !important;
  margin: 10px 0 5px !important;
  line-height: 1.2 !important;
}

.hero-content p {
  font-size: 12px !important;
  margin-bottom: 15px !important;
}

/* --- CLEAN BOTTOM NAV --- */
.bottom-nav {
  position: fixed !important;
  z-index: 200 !important;
  left: 10px !important;
  right: 10px !important;
  bottom: 10px !important;
  height: 72px !important;
  border: 1px solid rgba(107, 173, 255, 0.35) !important;
  border-radius: 24px !important;
  background: rgba(8, 20, 49, 0.95) !important;
  backdrop-filter: blur(20px) !important;
  display: grid !important;
  grid-template-columns: 1fr 1fr 90px 1fr 1fr !important;
  align-items: center !important;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.5) !important;
  padding: 0 !important;
  overflow: visible !important;
}

.bottom-nav button {
  border: 0 !important;
  background: transparent !important;
  color: white !important;
  font-size: 21px !important;
  font-weight: 800 !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 4px !important;
  padding: 0 !important;
}

.bottom-nav button.active {
  color: #4ff !important;
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.5) !important;
}

.bottom-nav button span {
  font-size: 10px !important;
  font-weight: normal !important;
}

.bottom-nav .magic {
  width: 70px !important;
  height: 70px !important;
  margin-top: -30px !important;
  background: linear-gradient(135deg, #00f0ff, #aa00ff) !important;
  border-radius: 50% !important;
  color: white !important;
  font-size: 32px !important;
  box-shadow: 0 0 25px rgba(170, 0, 255, 0.6) !important;
  border: 3px solid rgba(255, 255, 255, 0.2) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  justify-self: center !important;
}
`;

fs.writeFileSync('public/mobile-style.css', css);

// Bust cache again
let mhtml = fs.readFileSync('public/mobile.html', 'utf8');
mhtml = mhtml.replace(/mobile-style\.css\?v=\d+/, 'mobile-style.css?v=' + Date.now());
fs.writeFileSync('public/mobile.html', mhtml);

console.log('Fixed CSS conflicts!');
