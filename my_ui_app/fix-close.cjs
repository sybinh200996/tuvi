const fs = require('fs');

// Fix X button in style.css
let css = fs.readFileSync('public/style.css', 'utf8');
css = css.replace('.close-modal {', '.close-modal {\n  z-index: 1000;\n  position: absolute;');
fs.writeFileSync('public/style.css', css);

// Fix index.html cache busting
let html = fs.readFileSync('public/index.html', 'utf8');
html = html.replace(/style\.css\?v=\d+/, 'style.css?v=' + Date.now());
fs.writeFileSync('public/index.html', html);

// Fix mobile.html cache busting again just in case
let mhtml = fs.readFileSync('public/mobile.html', 'utf8');
mhtml = mhtml.replace(/mobile-app\.compiled\.js\?v=\d+/, 'mobile-app.compiled.js?v=' + Date.now());
fs.writeFileSync('public/mobile.html', mhtml);
