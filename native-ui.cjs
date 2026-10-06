const fs = require('fs');

let css = fs.readFileSync('public/mobile-style.css', 'utf8');

// We will replace the entire @media (max-width:900px) and @media (max-width:520px) blocks at the end with a clean native app design.
css = css.replace(/@media \(max-width:\s*900px\) \{[\s\S]*$/, '');
css = css.replace(/@media \(max-width:\s*520px\) \{[\s\S]*$/, '');

// Now append the clean Native App UI styles for mobile
css += `
/* ====================================================
   NATIVE APP REDESIGN FOR MOBILE (<= 768px)
==================================================== */
@media (max-width: 768px) {
  .app-shell {
    padding: 0 0 85px 0 !important;
  }
  
  /* Make the Hero a Native App Bar instead of a squished web banner */
  .hero {
    grid-template-columns: 1fr !important;
    min-height: auto !important;
    height: auto !important;
    border-radius: 0 0 24px 24px !important;
    padding: 20px 15px !important;
    background: linear-gradient(135deg, rgba(4,22,92,0.95), rgba(28,4,58,0.98)) !important;
    border: none !important;
    border-bottom: 1px solid rgba(0, 240, 255, 0.3) !important;
    box-shadow: 0 10px 30px rgba(0, 240, 255, 0.15) !important;
  }
  
  /* Hide the side images completely on mobile so it doesn't look broken */
  .hero-img {
    display: none !important;
  }
  
  .hero-content {
    padding: 0 !important;
    width: 100% !important;
  }
  
  .hero h1 {
    font-size: 32px !important;
    margin: 35px 0 5px 0 !important;
  }
  
  .hero p {
    font-size: 11px !important;
    letter-spacing: 1px !important;
  }
  
  .status-row {
    top: 15px !important;
    font-size: 11px !important;
    background: rgba(255,255,255,0.1) !important;
    padding: 6px 12px !important;
  }
  
  .hero-search {
    width: 100% !important;
    margin: 15px auto 10px !important;
    border-radius: 16px !important;
    padding: 4px 4px 4px 12px !important;
  }
  
  .hero-search input {
    font-size: 13px !important;
  }
  
  .hero-search button {
    font-size: 11px !important;
    padding: 10px 12px !important;
    border-radius: 12px !important;
  }
  
  /* Tab Rail Wrapper (Top tabs) */
  .tab-rail-wrap {
    margin: 15px 10px !important;
    border-radius: 18px !important;
    background: rgba(10, 20, 50, 0.6) !important;
    border: 1px solid rgba(216, 0, 255, 0.2) !important;
  }
  
  .scroll-arrow {
    background: transparent !important;
    font-size: 16px !important;
    padding: 10px !important;
  }
  
  .tab-rail button {
    min-width: 90px !important;
    padding: 8px !important;
    font-size: 12px !important;
    border-radius: 14px !important;
  }
  
  /* Main content area */
  .workspace {
    padding: 0 10px !important;
  }
  
  /* Native App Grid (2 columns, nice cards) */
  .home-grid {
    grid-template-columns: 1fr 1fr !important;
    gap: 12px !important;
  }
  
  .feature-card {
    min-height: 140px !important;
    padding: 16px !important;
    border-radius: 20px !important;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  
  .feature-card b {
    font-size: 32px !important;
    margin-bottom: 8px !important;
  }
  
  .feature-card h3 {
    font-size: 15px !important;
    line-height: 1.3 !important;
  }
  
  .feature-card p {
    font-size: 12px !important;
    line-height: 1.4 !important;
    opacity: 0.8;
  }
  
  /* Bottom Navigation - Native App Style */
  .bottom-nav {
    position: fixed !important;
    bottom: 0 !important;
    left: 0 !important;
    right: 0 !important;
    display: flex !important;
    justify-content: space-around !important;
    align-items: center !important;
    background: rgba(5, 10, 25, 0.95) !important;
    backdrop-filter: blur(20px) !important;
    border-top: 1px solid rgba(0, 240, 255, 0.2) !important;
    padding: 8px 5px 25px 5px !important; /* padding bottom for iOS safe area */
    border-radius: 24px 24px 0 0 !important;
    z-index: 1000 !important;
    box-shadow: 0 -5px 25px rgba(0,0,0,0.5) !important;
    overflow: visible !important;
  }
  
  .bottom-nav button {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    background: transparent !important;
    border: none !important;
    color: rgba(255,255,255,0.5) !important;
    padding: 6px !important;
    gap: 4px !important;
    width: 60px !important;
    box-shadow: none !important;
  }
  
  .bottom-nav button span {
    display: block !important; /* show icons again */
    font-size: 22px !important;
    filter: grayscale(100%) opacity(0.7);
    transition: all 0.3s ease;
  }
  
  .bottom-nav button small {
    display: block !important;
    font-size: 10px !important;
    font-weight: 600 !important;
    white-space: nowrap !important;
  }
  
  .bottom-nav button.active {
    background: transparent !important;
    color: #00f0ff !important;
    box-shadow: none !important;
  }
  
  .bottom-nav button.active span {
    filter: grayscale(0%) drop-shadow(0 0 8px rgba(0,240,255,0.8));
    transform: translateY(-2px);
  }
  
  /* Chat UI tweaks for mobile */
  .chat-box {
    height: calc(100vh - 280px) !important;
    border-radius: 20px !important;
  }
  .composer {
    position: fixed !important;
    bottom: 80px !important; /* above bottom nav */
    left: 0; right: 0;
    border-radius: 24px 24px 0 0 !important;
    background: rgba(10, 15, 35, 0.95) !important;
    padding: 12px 15px !important;
    backdrop-filter: blur(15px);
  }
}
`;

fs.writeFileSync('public/mobile-style.css', css);

// Fix JS: make sure "Trang chủ" uses the new App icon layout instead of hidden text layout
let js = fs.readFileSync('public/mobile-app.js', 'utf8');

// I will re-inject TABS into bottom nav just to be safe, with only 5 main tabs for a perfect native bottom nav!
// Native apps usually only have 4-5 tabs at the bottom. The rest are accessed from the "Home" grid.
js = js.replace(/<nav className="bottom-nav">\[\\s\\S\]*?<\/nav>/, 
  '<nav className="bottom-nav">{[TABS[0], TABS[7], TABS[8], TABS[11]].map(t => <button key={t.id} onClick={() => setTab(t.id)} className={tab===t.id?\'active\':\'\'}><span>{t.icon}</span><small>{t.label}</small></button>)}</nav>');

// ensure no 'Màn hình chính mobile'
js = js.replace(/<section className="premium-panel wide"><h2>📱 Màn hình chính mobile<\/h2>[\s\S]*?<\/section>/g, '');

fs.writeFileSync('public/mobile-app.js', js);
console.log("CSS and JS UI rules updated for Native App design");
