const fs = require('fs');

let css = fs.readFileSync('public/style.css', 'utf8');

// We just need to fix the textarea CSS in V6
// Look for `height: 24px !important; /* Forced small initial height */`
css = css.replace('height: 24px !important; /* Forced small initial height */', 'min-height: 24px !important; height: auto;');

// Let's also remove `overflow-y: hidden !important;` so it can scroll if it gets too big
css = css.replace('overflow-y: hidden !important;', 'overflow-y: auto !important; max-height: 120px !important;');

fs.writeFileSync('public/style.css', css);

let sw = fs.readFileSync('public/service-worker.js', 'utf8');
sw = sw.replace(/v12-mystic-v6/, 'v13-mystic-final');
fs.writeFileSync('public/service-worker.js', sw);

console.log('Mobile Mystic Theme V7 (Input height fixed) Injected');
