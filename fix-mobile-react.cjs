const fs = require('fs');
const babel = require('@babel/core');

// 1. Update mobile-app.js
let appJs = fs.readFileSync('public/mobile-app.js', 'utf8');

// A. Fix TabRail: remove scroll arrows
appJs = appJs.replace(
`<div className="scroll-arrow left">❮</div>
    <nav className="tab-rail">
      {TABS.map(t => <button key={t.id} className={tab === t.id ? 'active' : ''} onClick={() => setTab(t.id)}><span>{t.icon}</span>{t.label}</button>)}
    </nav>
    <div className="scroll-arrow right">❯</div>`,
`<nav className="tab-rail">
      {TABS.map(t => <button key={t.id} className={tab === t.id ? 'active' : ''} onClick={() => setTab(t.id)}><span>{t.icon}</span>{t.label}</button>)}
    </nav>`
);

// B. Change Bottom Nav to exactly match desktop
appJs = appJs.replace(
`<nav className="bottom-nav">{TABS.map(t => <button key={t.id} onClick={() => setTab(t.id)} className={tab===t.id?'active':''}><span>{t.icon}</span><small>{t.label}</small></button>)}</nav>`,
`<nav className="bottom-nav">
      <button onClick={() => setTab('home')} className={tab==='home'?'active':''}>⌂<span>Trang chủ</span></button>
      <button onClick={() => alert('Tính năng Lịch sử đang phát triển!')} className={tab==='history'?'active':''}>▣<span>Lịch sử</span></button>
      <button className="magic" onClick={() => setTab('chat')}>✦</button>
      <button onClick={() => setTab('chat')} className={tab==='chat'?'active':''}>☻<span>AI Chat</span></button>
      <button onClick={() => setTab('settings')} className={tab==='settings'?'active':''}>♙<span>Tài khoản</span></button>
    </nav>`
);

// Remove "Đổi bài" in banner, and move "Cung Hoàng Đạo" to top? The user said: "tab 'Cung Hoàng Đạo' ở banner đưa lên trên tab 'Tử Vi Hôm Nay'."
// Let's look at Hero Component:
appJs = appJs.replace(
`<div className="hero-actions quick"><button onClick={() => setTab('astrology')}>🪐 Cung hoàng đạo</button><button onClick={() => setTab('horoscope')}>🔮 Tử vi hôm nay</button><button onClick={() => setTab('palm')}>✋ Xem chỉ tay</button><button onClick={() => setTab('face')}>🙂 Xem tướng</button></div>`,
`<div className="hero-actions quick"><button onClick={() => setTab('horoscope')}>🔮 Tử vi hôm nay</button><button onClick={() => setTab('astrology')}>🪐 Cung hoàng đạo</button><button onClick={() => setTab('palm')}>✋ Xem chỉ tay</button><button onClick={() => setTab('face')}>🙂 Xem tướng</button></div>`
);

fs.writeFileSync('public/mobile-app.js', appJs);

// 2. Recompile mobile-app.js
babel.transformAsync(appJs, {
  presets: [
    ['@babel/preset-react', { runtime: 'classic' }]
  ]
}).then(res => {
  fs.writeFileSync('public/mobile-app.compiled.js', res.code);
  
  // 3. Update mobile-style.css
  let css = fs.readFileSync('public/mobile-style.css', 'utf8');
  
  // Remove purple frame around tab-rail-wrap
  css = css.replace(/\.tab-rail-wrap\s*\{[^}]*\}/, 
  `.tab-rail-wrap {
    margin: 10px 0;
    padding: 0;
    background: transparent;
    border: none;
    box-shadow: none;
  }`);
  
  // Make home-grid 2 columns!
  css = css.replace(/\.home-grid\s*\{[^}]*\}/,
  `.home-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    padding: 0 10px 100px;
  }`);
  
  // Shrink Hero banner to 2/3
  css = css.replace(/\.hero-wrap\s*\{[^}]*\}/,
  `.hero-wrap {
    position: relative;
    padding: 60px 14px 20px;
    background: linear-gradient(135deg, rgba(8,16,66,0.95), rgba(28,4,58,0.95));
    border-radius: 0 0 30px 30px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    overflow: hidden;
    min-height: 40vh;
  }`);

  css += `
  /* Show banner images properly */
  .hero-img.hero-left {
    position: absolute;
    left: -10px;
    bottom: 0;
    width: 35%;
    max-width: 150px;
    z-index: 1;
    opacity: 0.9;
  }
  .hero-img.hero-right {
    position: absolute;
    right: -10px;
    bottom: 0;
    width: 35%;
    max-width: 150px;
    z-index: 1;
    opacity: 0.9;
  }
  .hero-content {
    position: relative;
    z-index: 3;
  }

  /* Bottom Nav like web desktop */
  .bottom-nav {
    position: fixed;
    z-index: 200;
    left: 50%;
    bottom: 10px;
    transform: translateX(-50%);
    width: min(1160px, calc(100% - 22px));
    height: 72px;
    border: 1px solid rgba(107, 173, 255, 0.35);
    border-radius: 24px;
    background: rgba(8, 20, 49, 0.82);
    backdrop-filter: blur(20px);
    display: grid;
    grid-template-columns: 1fr 1fr 90px 1fr 1fr;
    align-items: center;
    box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.32);
    padding: 0;
  }
  .bottom-nav button {
    border: 0;
    background: transparent;
    color: white;
    font-size: 21px;
    font-weight: 800;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
  }
  .bottom-nav button.active {
    color: #4ff;
    text-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
  }
  .bottom-nav button span {
    font-size: 11px;
    font-weight: normal;
  }
  .bottom-nav .magic {
    width: 76px;
    height: 76px;
    margin-top: -32px;
    background: linear-gradient(135deg, #00f0ff, #aa00ff);
    border-radius: 50%;
    color: white;
    font-size: 36px;
    box-shadow: 0 0 25px rgba(170, 0, 255, 0.6);
    border: 3px solid rgba(255, 255, 255, 0.2);
    justify-self: center;
  }
  `;
  
  fs.writeFileSync('public/mobile-style.css', css);
  
  // Also bump the cache string in mobile.html
  let mhtml = fs.readFileSync('public/mobile.html', 'utf8');
  mhtml = mhtml.replace(/mobile-app\.compiled\.js\?v=\d+/, 'mobile-app.compiled.js?v=' + Date.now());
  mhtml = mhtml.replace(/mobile-style\.css\?v=\d+/, 'mobile-style.css?v=' + Date.now());
  fs.writeFileSync('public/mobile.html', mhtml);

  console.log("React app updated perfectly!");
});
