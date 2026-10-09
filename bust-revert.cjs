const fs = require('fs');

let sw = fs.readFileSync('public/service-worker.js', 'utf8');
sw = sw.replace(/const CACHE = "[^"]+";/, 'const CACHE = "v44-revert-to-first-dangnam2k4-' + Date.now() + '";');
fs.writeFileSync('public/service-worker.js', sw);

let html = fs.readFileSync('public/mobile.html', 'utf8');
html = html.replace(/mobile-style\.css\?v=\d+/, 'mobile-style.css?v=' + Date.now());
fs.writeFileSync('public/mobile.html', html);

console.log('SW and HTML Cache busted for revert.');
