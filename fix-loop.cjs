const fs = require('fs');

let html = fs.readFileSync('public/index.html', 'utf8');

// The exact string to replace (ignoring variable whitespace)
html = html.replace(/if\s*\(isMobile\s*&&\s*!forceDesktop\s*&&\s*!location\.pathname\.endsWith\('\/mobile\.html'\)\)\s*\{\s*location\.replace\('mobile\.html'\);\s*\}/g, '// Infinite loop destroyed');

fs.writeFileSync('public/index.html', html);
console.log('Fixed index.html loop');
