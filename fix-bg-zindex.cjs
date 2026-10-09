const fs = require('fs');

let css = fs.readFileSync('public/style.css', 'utf8');

// 1. Remove the ::before block entirely
css = css.replace(/body\[data-route="chat"\]::before\s*{[^}]+}/s, '/* Background moved to shell */');

// 2. Remove the solid background from html and body
css = css.replace(/background:\s*#070e23\s*!important;/g, 'background: transparent !important;');

// 3. Add the background image directly to .chat-pro-shell
css = css.replace(/body\[data-route="chat"\] \.chat-pro-shell\s*{([^}]+)}/s, (match, inner) => {
    return `body[data-route="chat"] .chat-pro-shell {\n  background: url('assets/chat-bg-highres.png') center/cover no-repeat !important;${inner}}`;
});

fs.writeFileSync('public/style.css', css);

let sw = fs.readFileSync('public/service-worker.js', 'utf8');
sw = sw.replace(/v14-mystic-no-clip/, 'v15-mystic-bg-fix');
fs.writeFileSync('public/service-worker.js', sw);

console.log('Background CSS fixed');
