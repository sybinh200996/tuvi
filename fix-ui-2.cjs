const fs = require('fs');

// 1. Fix JS: mobile-app.js
let js = fs.readFileSync('public/mobile-app.js', 'utf8');

// Remove Tarot button from Hero, and swap Cung Hoàng Đạo & Tử Vi
js = js.replace(
  /<button onClick=\{\(\) => setTab\('horoscope'\)\}>🔮 Tử vi hôm nay<\/button><button onClick=\{\(\) => setTab\('astrology'\)\}>🪐 Cung hoàng đạo<\/button><button onClick=\{\(\) => setTab\('palm'\)\}>✋ Xem chỉ tay<\/button><button onClick=\{\(\) => setTab\('face'\)\}>🙂 Xem tướng<\/button><button onClick=\{\(\) => setTab\('tarot'\)\}>🃏 Đổi bài<\/button>/g,
  `<button onClick={() => setTab('astrology')}>🪐 Cung hoàng đạo</button><button onClick={() => setTab('horoscope')}>🔮 Tử vi hôm nay</button><button onClick={() => setTab('palm')}>✋ Xem chỉ tay</button><button onClick={() => setTab('face')}>🙂 Xem tướng</button>`
);

// Remove the Màn hình chính mobile explanation block
js = js.replace(/<section className="premium-panel wide"><h2>📱 Màn hình chính mobile<\/h2>[\s\S]*?<\/section>/, '');

// Enhance TabRail to have explicit arrows
js = js.replace(
  /<div className="tab-rail-wrap"><TabRail tab=\{tab\} setTab=\{setTab\} \/><\/div>/g,
  '<TabRail tab={tab} setTab={setTab} />' // undo previous wrapper in App component
);
// Now redefine TabRail component
js = js.replace(
  /function TabRail\(\{ tab, setTab \}\) \{[\s\S]*?return <nav className="tab-rail">[\s\S]*?<\/nav>;\s*\}/,
  `function TabRail({ tab, setTab }) {
  return <div className="tab-rail-wrap">
    <div className="scroll-arrow left">❮</div>
    <nav className="tab-rail">
      {TABS.map(t => <button key={t.id} className={tab === t.id ? 'active' : ''} onClick={() => setTab(t.id)}><span>{t.icon}</span>{t.label}</button>)}
    </nav>
    <div className="scroll-arrow right">❯</div>
  </div>;
}`
);

fs.writeFileSync('public/mobile-app.js', js);

// 2. Fix CSS: mobile-style.css
let css = fs.readFileSync('public/mobile-style.css', 'utf8');

// Add the arrow styles
css += `
/* Banner size fixes */
@media (max-width: 900px) {
  .hero {
    min-height: 140px !important;
    height: 140px !important;
    grid-template-columns: 32% 1fr 32% !important;
    border-radius: 20px !important;
    overflow: hidden !important;
  }
  .hero-img {
    height: 100% !important;
    min-height: 140px !important;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
  }
  .hero-img img {
    height: 100% !important;
    width: auto !important;
    max-width: 100% !important;
    object-fit: contain !important;
    object-position: center !important;
  }
}
@media (max-width: 520px) {
  .hero {
    min-height: 125px !important;
    height: 125px !important;
    grid-template-columns: 35% 1fr 35% !important;
  }
  .hero-img {
    min-height: 125px !important;
  }
  .hero h1 {
    font-size: 20px !important;
  }
}

/* Explicit Tab Arrows */
.tab-rail-wrap {
  position: relative;
  display: flex;
  align-items: center;
  margin: 10px auto;
  border-radius: 24px;
  background: rgba(2,10,39,0.55);
  border: 1px solid rgba(95,227,255,0.20);
}
.scroll-arrow {
  color: #00f0ff;
  font-size: 18px;
  font-weight: bold;
  padding: 10px 12px;
  cursor: pointer;
  z-index: 5;
  background: rgba(0,0,0,0.4);
  text-shadow: 0 0 10px #00f0ff;
}
.scroll-arrow.left { border-radius: 24px 0 0 24px; }
.scroll-arrow.right { border-radius: 0 24px 24px 0; }
.tab-rail-wrap .tab-rail {
  margin: 0 !important;
  border: none !important;
  border-radius: 0 !important;
  background: transparent !important;
  flex: 1;
  padding: 10px 4px !important;
}
/* hide old ::before ::after */
.tab-rail-wrap::before, .tab-rail-wrap::after { display: none !important; }
`;

fs.writeFileSync('public/mobile-style.css', css);
console.log("Done");
