const fs = require('fs');
const babel = require('@babel/core');

// 1. UPDATE MOBILE-APP.JS to move hero-search OUT of Hero and BELOW it
let appJs = fs.readFileSync('public/mobile-app.js', 'utf8');

// The Hero component currently returns <header className="hero-wrap">...</header>
// We need to change it to return <> <header className="hero-wrap">...</header> <div className="hero-search-outside">...</div> </>
// Let's just use regex to move the hero-search block out of hero-wrap
// In App component, Hero is rendered as <Hero setTab={setTab} />
// I will just modify Hero to wrap everything in a React.Fragment and put hero-search after header.

appJs = appJs.replace(
  /<header className="hero-wrap">([\s\S]*?)<div className="hero-search">([\s\S]*?)<\/div><\/header>/g,
  '<header className="hero-wrap">$1</header><div className="hero-search outside">$2</div>'
);

// Also need to make sure we return a Fragment
appJs = appJs.replace(/return\s*<header className="hero-wrap">/g, 'return <><header className="hero-wrap">');
// Close the fragment after the outside search
appJs = appJs.replace(/<\/div><\/header>/g, '</div></header>'); // just in case
appJs = appJs.replace(/<div className="hero-search outside">([\s\S]*?)<\/div>/g, '<div className="hero-search outside">$1</div></>');

// If the regex didn't catch the exact structure, let's do it safer:
// Find Hero component
let heroRegex = /function Hero\(\{ setTab \}\) \{[\s\S]*?return\s*\(?([\s\S]*?)\)?;\s*\}/;
let heroMatch = appJs.match(heroRegex);
if (heroMatch) {
  let heroBody = heroMatch[1];
  if (heroBody.includes('<div className="hero-search">')) {
     let searchRegex = /<div className="hero-search">[\s\S]*?<\/div>/;
     let searchBlock = heroBody.match(searchRegex)[0];
     let newHeroBody = heroBody.replace(searchBlock, '');
     // wrap in Fragment
     newHeroBody = `<>${newHeroBody.replace(/<\/header>$/, '')}</header>${searchBlock.replace('hero-search', 'hero-search outside')}</>`;
     appJs = appJs.replace(heroBody, newHeroBody);
  }
}

fs.writeFileSync('public/mobile-app.js', appJs);

// 2. COMPILE MOBILE-APP.JS
babel.transformAsync(appJs, {
  presets: [['@babel/preset-react', { runtime: 'classic' }]]
}).then(res => {
  fs.writeFileSync('public/mobile-app.compiled.js', res.code);

  // 3. UPDATE MOBILE-STYLE.CSS
  let css = fs.readFileSync('public/mobile-style.css', 'utf8');

  css += `
/* ========================================================
   RE-POSITION SEARCH BAR & BANNER CORNERS
======================================================== */

/* Đưa banner thành 1 khung nổi rõ ràng (card) để thấy rõ góc bo tròn */
.hero-wrap {
  margin: 12px 14px 0 !important; /* Lùi vào trong để bo tròn 4 góc */
  padding: 8px 14px 15px !important; /* Ép sát chữ Đặng Năm lên trên */
  border-radius: 28px !important; /* Bo tròn rõ rệt 4 góc */
  box-shadow: 0 10px 40px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,255,255,0.1) !important;
  border: 1px solid rgba(255,255,255,0.1) !important;
}

/* Đảm bảo hình ảnh hai bên khớp theo bo tròn */
.hero-img.hero-left, .hero-img.hero-right {
  height: 98% !important;
  border-radius: 28px !important; 
  opacity: 0.9 !important;
}

/* Chỉnh khoảng trống thừa màu xanh đậm bên trên chữ */
.status-row {
  margin: 0 auto 0 !important;
  padding: 4px 12px !important;
}
.hero-content h1 {
  margin-top: 0 !important; /* Hết sức ép sát */
  margin-bottom: 2px !important;
  font-size: 25px !important;
}

/* Khung tìm kiếm ở BÊN DƯỚI banner */
.hero-search.outside {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  width: auto !important;
  margin: 15px 14px 5px !important; /* Nằm dưới banner */
  padding: 4px 4px 4px 16px !important;
  background: rgba(8, 20, 50, 0.9) !important;
  border-radius: 999px !important;
  border: 1px solid rgba(91, 225, 255, 0.4) !important;
  box-shadow: 0 5px 20px rgba(0,0,0,0.4), inset 0 0 15px rgba(0, 221, 255, 0.1) !important;
  backdrop-filter: blur(10px) !important;
}

.hero-search.outside input {
  flex: 1 !important;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 10px 5px 10px 0 !important;
  color: #dbfbff !important;
  font-size: 13.5px !important;
}

.hero-search.outside input:focus {
  outline: none !important;
}

/* Nút AI phân tích (nằm gọn trong khung nhập) */
.hero-search.outside button {
  flex: 0 0 auto !important;
  padding: 10px 18px !important;
  border-radius: 999px !important;
  background: linear-gradient(135deg, #28e8ff, #61f4ff) !important;
  color: #002244 !important;
  font-size: 11.5px !important;
  font-weight: 800 !important;
  border: none !important;
  text-transform: uppercase !important;
  box-shadow: 0 0 15px rgba(23, 221, 255, 0.4) !important;
}

/* Ẩn các class hero-search bên trong banner nếu còn sót */
.hero-wrap .hero-search {
  display: none !important;
}
`;

  fs.writeFileSync('public/mobile-style.css', css);

  // Bust cache
  let mhtml = fs.readFileSync('public/mobile.html', 'utf8');
  mhtml = mhtml.replace(/mobile-style\.css\?v=\d+/, 'mobile-style.css?v=' + Date.now());
  mhtml = mhtml.replace(/mobile-app\.compiled\.js\?v=\d+/, 'mobile-app.compiled.js?v=' + Date.now());
  fs.writeFileSync('public/mobile.html', mhtml);

  console.log('Fixed banner styling: moved search outside, card-like banner');
});
