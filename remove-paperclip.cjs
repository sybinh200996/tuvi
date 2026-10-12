const fs = require('fs');

let css = fs.readFileSync('public/style.css', 'utf8');

// Find the paperclip block and remove it
const paperclipRegex = /\/\* The Paperclip Icon.*?\n\s*body\[data-route="chat"\] \.pro-input::before\s*{[^}]+}/s;
css = css.replace(paperclipRegex, '/* Removed Paperclip Icon as requested */\n  body[data-route="chat"] .pro-input::before { display: none !important; }');

fs.writeFileSync('public/style.css', css);

let sw = fs.readFileSync('public/service-worker.js', 'utf8');
sw = sw.replace(/v13-mystic-final/, 'v14-mystic-no-clip');
fs.writeFileSync('public/service-worker.js', sw);

console.log('Paperclip removed');
