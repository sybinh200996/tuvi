const fs = require('fs');

// 1. Update CSS
let css = fs.readFileSync('public/mobile-style.css', 'utf8');
css += `
/* Neon Mystical Theme */
:root {
  --bg: #030612;
  --text: #e0e8ff;
  --brand: #00f0ff;
  --pink: #d800ff;
  --gold: #ffd36a;
  --line: rgba(0, 240, 255, 0.2);
}
body {
  background: radial-gradient(circle at 10% 20%, #080c2b 0%, #030612 100%) !important;
  color: var(--text);
}
.hero, .premium-panel, .feature-card {
  background: linear-gradient(135deg, rgba(8,16,66,0.8), rgba(28,4,58,0.8)) !important;
  border: 1px solid rgba(0,240,255,0.3) !important;
  box-shadow: 0 0 20px rgba(0,240,255,0.1), inset 0 0 15px rgba(216,0,255,0.1) !important;
  backdrop-filter: blur(10px);
}
.tab-rail {
  position: relative;
  scroll-snap-type: x mandatory;
}
/* Arrows for Top Tabs */
.tab-rail-wrap {
  position: relative;
}
.tab-rail-wrap::before, .tab-rail-wrap::after {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: #00f0ff;
  font-weight: bold;
  font-size: 18px;
  text-shadow: 0 0 10px #00f0ff;
  z-index: 10;
  pointer-events: none;
}
.tab-rail-wrap::before {
  content: "❮";
  left: 2px;
}
.tab-rail-wrap::after {
  content: "❯";
  right: 2px;
}
/* Bottom Nav style update */
.bottom-nav {
  background: rgba(5,10,30,0.9) !important;
  border: 1px solid rgba(216,0,255,0.3) !important;
  box-shadow: 0 0 25px rgba(216,0,255,0.2) !important;
  padding: 12px 10px !important;
}
.bottom-nav button span {
  display: none !important;
}
.bottom-nav button {
  padding: 8px 16px !important;
  font-size: 13px !important;
  white-space: nowrap;
  border-radius: 20px !important;
  color: #a4b3e6 !important;
}
.bottom-nav button.active {
  background: linear-gradient(90deg, #00f0ff, #d800ff) !important;
  color: #fff !important;
  box-shadow: 0 0 15px rgba(0,240,255,0.5) !important;
}
/* Home Grid 2 columns */
@media(max-width: 900px) {
  .home-grid {
    grid-template-columns: 1fr 1fr !important;
  }
}
`;
fs.writeFileSync('public/mobile-style.css', css);

// 2. Update JS
let js = fs.readFileSync('public/mobile-app.js', 'utf8');
js = js.replace('<TabRail tab={tab} setTab={setTab} />', '<div className="tab-rail-wrap"><TabRail tab={tab} setTab={setTab} /></div>');
js = js.replace(/const TABS = \[[\s\S]*?\];/, `const TABS = [
  { id: 'home', icon: '✨', label: 'Trang chủ' },
  { id: 'horoscope', icon: '🔮', label: 'Tử vi' },
  { id: 'palm', icon: '✋', label: 'Chỉ tay' },
  { id: 'face', icon: '👁️', label: 'Xem tướng' },
  { id: 'astrology', icon: '🌌', label: 'Chiêm tinh' },
  { id: 'love', icon: '💖', label: 'Tình duyên' },
  { id: 'numerology', icon: '🔢', label: 'Thần số học' },
  { id: 'chat', icon: '⚡', label: 'AI Chat' },
  { id: 'multi', icon: '🌌', label: 'Multi AI' },
  { id: 'fengshui', icon: '☯️', label: 'Phong thủy' },
  { id: 'tarot', icon: '🃏', label: 'Bói bài' },
  { id: 'settings', icon: '⚙️', label: 'AI Keys' }
];`);
fs.writeFileSync('public/mobile-app.js', js);
console.log("Done");
