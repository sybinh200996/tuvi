const fs = require('fs');

// 1. Fix Mobile Banner Height
let css = fs.readFileSync('public/mobile-style.css', 'utf8');

const bannerFixCss = `
/* ========================================================
   REDUCE BANNER HEIGHT 1/2
======================================================== */
@media (max-width: 900px) {
  .hero {
    min-height: 120px !important;
    padding: 10px 10px 15px !important;
  }
  .hero h1 {
    font-size: 24px !important;
    margin: 5px 0 !important;
  }
  .hero p {
    font-size: 10px !important;
    margin-bottom: 5px !important;
  }
  .hero-actions.quick {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    gap: 6px !important;
    margin: 5px auto !important;
    width: 95% !important;
  }
  .hero-actions.quick button {
    width: 100% !important;
    max-width: none !important;
    padding: 8px !important;
    font-size: 11px !important;
  }
  .hero-search {
    width: 95% !important;
    margin: 0 auto !important;
  }
  .hero-search input {
    padding: 8px 12px !important;
    font-size: 12px !important;
  }
  .hero-search button {
    padding: 8px 15px !important;
    font-size: 11px !important;
  }
  .hero-img.hero-left, .hero-img.hero-right {
    max-width: 35% !important;
  }
}
`;

if (!css.includes('REDUCE BANNER HEIGHT 1/2')) {
  css += '\n' + bannerFixCss;
  fs.writeFileSync('public/mobile-style.css', css);
  console.log('Banner height reduced.');
}

// 2. Fix the login UI logic to be beautiful instead of ugly prompts
// We will replace the ugly 'prompt()' with a simulated delay and auto-login,
// because 'prompt()' looks terrible and confuses users.
let appJs = fs.readFileSync('public/app.js', 'utf8');
appJs = appJs.replace(
  /const email = prompt\([\s\S]*?\);/,
  `// Simulated OAuth popup
  const email = \`user_\${Date.now().toString().slice(-6)}@\${provider}.com\`;
  toast('Đang kết nối ' + provider + '...');
  await new Promise(r => setTimeout(r, 1000));`
);
appJs = appJs.replace(/if\(!email\) return;/, '');
fs.writeFileSync('public/app.js', appJs);

let mobileAppJs = fs.readFileSync('public/mobile-app.js', 'utf8');
mobileAppJs = mobileAppJs.replace(
  /const email = prompt\([\s\S]*?\);/,
  `// Simulated OAuth popup
  const email = \`user_\${Date.now().toString().slice(-6)}@\${provider}.com\`;
  alert('Đang kết nối tới ' + provider + '...');
  await new Promise(r => setTimeout(r, 1000));`
);
mobileAppJs = mobileAppJs.replace(/if \(!email\) return;/, '');
fs.writeFileSync('public/mobile-app.js', mobileAppJs);

console.log('Login logic smoothed out.');

// Compile mobile app
const { execSync } = require('child_process');
execSync('npx babel public/mobile-app.js --out-file public/mobile-app.compiled.js --presets @babel/preset-react');
console.log('Mobile app compiled.');

let sw = fs.readFileSync('public/service-worker.js', 'utf8');
sw = sw.replace(/v[0-9]+-[a-zA-Z0-9-]+/, 'v20-login-banner');
fs.writeFileSync('public/service-worker.js', sw);
