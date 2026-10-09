const fs = require('fs');
const babel = require('@babel/core');

// 1. UPDATE MOBILE-APP.JS
let appJs = fs.readFileSync('public/mobile-app.js', 'utf8');

// The exact string to replace in Hero
const oldHeroContent = `<div className="hero-search"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")handleSearch()}} placeholder="Hỏi về tử vi, chỉ tay, tướng số, chiêm tinh..."/><button onClick={handleSearch}>✦ AI phân tích</button></div>
      <div className="hero-actions quick"><button onClick={() => setTab('horoscope')}>🔮 Tử vi hôm nay</button><button onClick={() => setTab('astrology')}>🪐 Cung hoàng đạo</button><button onClick={() => setTab('palm')}>✋ Xem chỉ tay</button><button onClick={() => setTab('face')}>🙂 Xem tướng</button></div>`;

const newHeroContent = `<div className="hero-actions quick">
        <button onClick={() => setTab('horoscope')}>🔮 Tử vi hôm nay</button>
        <button onClick={() => setTab('astrology')}>🪐 Cung hoàng đạo</button>
        <button onClick={() => setTab('palm')}>✋ Xem chỉ tay</button>
        <button onClick={() => setTab('face')}>🙂 Xem tướng</button>
      </div>
      <div className="hero-search">
        <input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")handleSearch()}} placeholder="Nhập câu hỏi tử vi..."/>
        <button onClick={handleSearch}>✦ AI phân tích</button>
      </div>`;

appJs = appJs.replace(oldHeroContent, newHeroContent);
fs.writeFileSync('public/mobile-app.js', appJs);

// 2. COMPILE MOBILE-APP.JS
babel.transformAsync(appJs, {
  presets: [['@babel/preset-react', { runtime: 'classic' }]]
}).then(res => {
  fs.writeFileSync('public/mobile-app.compiled.js', res.code);

  // 3. UPDATE MOBILE-STYLE.CSS
  let css = fs.readFileSync('public/mobile-style.css', 'utf8');

  // We want to update .hero-actions.quick to make the buttons smaller (rút ngắn lại)
  css = css.replace(/\.hero-actions\.quick\s*\{[^}]+\}/g, '');
  css = css.replace(/\.hero-actions\.quick button\s*\{[^}]+\}/g, '');
  css = css.replace(/\.hero-search\s*\{[^}]+\}/g, '');
  css = css.replace(/\.hero-search input\s*\{[^}]+\}/g, '');
  css = css.replace(/\.hero-search button\s*\{[^}]+\}/g, '');
  
  // Make images larger so they overlap the buttons
  css = css.replace(/max-width:\s*150px\s*!important;/g, 'max-width: 180px !important;');
  css = css.replace(/max-width:\s*160px\s*!important;/g, 'max-width: 180px !important;');
  css = css.replace(/width:\s*35%\s*!important;/g, 'width: 45% !important;');
  css = css.replace(/width:\s*40%\s*!important;/g, 'width: 45% !important;');

  css += `
/* --- MODERNIZED BANNER TABS & SEARCH --- */
.hero-actions.quick {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  gap: 6px !important;
  margin-top: 10px !important;
  width: 100% !important;
  z-index: 10 !important;
  position: relative !important;
}

.hero-actions.quick button {
  width: 50% !important; 
  max-width: 150px !important;
  padding: 8px 10px !important;
  border-radius: 999px !important;
  font-size: 12px !important;
  font-weight: 600 !important;
  text-align: center !important;
  background: rgba(3, 17, 67, 0.85) !important;
  border: 1px solid rgba(103, 235, 255, 0.6) !important;
  color: #eafdff !important;
  box-shadow: 0 4px 15px rgba(0, 191, 255, 0.3) !important;
  backdrop-filter: blur(10px) !important;
}

.hero-search {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  gap: 8px !important;
  width: 85% !important;
  max-width: 300px !important;
  margin: 15px auto 0 !important;
  z-index: 10 !important;
  position: relative !important;
}

.hero-search input {
  width: 100% !important;
  padding: 12px 15px !important;
  border-radius: 999px !important;
  border: 1px solid rgba(91,225,255,0.4) !important;
  background: rgba(0,8,40,0.7) !important;
  color: #dbfbff !important;
  font-size: 13px !important;
  text-align: center !important;
  box-shadow: inset 0 0 15px rgba(0,221,255,0.2) !important;
  backdrop-filter: blur(10px) !important;
}

.hero-search button {
  width: 70% !important;
  max-width: 200px !important;
  padding: 10px 15px !important;
  border-radius: 999px !important;
  font-size: 13px !important;
  font-weight: 700 !important;
  text-transform: uppercase !important;
  background: linear-gradient(135deg,#28e8ff,#61f4ff) !important;
  color: #002244 !important;
  box-shadow: 0 0 25px rgba(23,221,255,0.6) !important;
  border: none !important;
}
  `;

  fs.writeFileSync('public/mobile-style.css', css);

  // Bust cache
  let mhtml = fs.readFileSync('public/mobile.html', 'utf8');
  mhtml = mhtml.replace(/mobile-style\.css\?v=\d+/, 'mobile-style.css?v=' + Date.now());
  mhtml = mhtml.replace(/mobile-app\.compiled\.js\?v=\d+/, 'mobile-app.compiled.js?v=' + Date.now());
  fs.writeFileSync('public/mobile.html', mhtml);

  console.log('Fixed banner layout and search position!');
});
