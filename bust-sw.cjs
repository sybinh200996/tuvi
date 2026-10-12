const fs = require('fs');

let sw = fs.readFileSync('public/service-worker.js', 'utf8');
sw = sw.replace(/const CACHE = "[^"]+";/, 'const CACHE = "v32-super-compact-' + Date.now() + '";');
fs.writeFileSync('public/service-worker.js', sw);
console.log('SW Cache properly busted.');

let html = fs.readFileSync('public/mobile.html', 'utf8');
html = html.replace(/mobile-style\.css\?v=\d+/, 'mobile-style.css?v=' + Date.now());
fs.writeFileSync('public/mobile.html', html);
console.log('HTML Cache busted.');
