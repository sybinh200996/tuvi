const fs = require('fs');
const { execSync } = require('child_process');

// 1. Update mobile.html to include marked and DOMPurify
let html = fs.readFileSync('public/mobile.html', 'utf8');
if (!html.includes('marked.min.js')) {
    html = html.replace('</head>', `
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/dompurify/dist/purify.min.js"></script>
</head>`);
    fs.writeFileSync('public/mobile.html', html);
    console.log('Added marked.js to mobile.html');
}

// 2. Modify mobile-app.js
let appJs = fs.readFileSync('public/mobile-app.js', 'utf8');

// Replace markdownLite
const newMarkdownLite = `function markdownLite(text = '') {
  try {
    if (typeof marked !== 'undefined' && typeof DOMPurify !== 'undefined') {
      return DOMPurify.sanitize(marked.parse(String(text)));
    }
  } catch(e) {}
  const safe = String(text)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return safe.replace(/\\n/g, '<br/>')
    .replace(/\\*\\*(.*?)\\*\\*/g, '<b>$1</b>')
    .replace(/\\*(.*?)\\*/g, '<i>$1</i>')
    .replace(/\`(.*?)\`/g, '<code>$1</code>')
    .replace(/###\\s*(.*)/g, '<h3>$1</h3>')
    .replace(/- \\*\\*(.*?)\\*\\*/g, '<li><b>$1</b></li>')
    .replace(/- (.*)/g, '<li>$1</li>');
}`;
appJs = appJs.replace(/function markdownLite[\s\S]*?\}\n/, newMarkdownLite + '\n');

// Update Chat UI in mobile-app.js to add Pill class and copy button
appJs = appJs.replace(
    `className="composer"><textarea`,
    `className="composer chat-pill-composer"><textarea`
);

// If missing copy button in bubble-body, it's actually already there: `<button onClick={()=>copy(m.text)}>Copy</button>`
// Let's change the Composer button from 'Gửi' to a nice icon
appJs = appJs.replace(
    `<button disabled={busy} onClick={()=>send()}>{busy?'⏳':'Gửi 🚀'}</button>`,
    `<button className="pill-send-btn" disabled={busy} onClick={()=>send()}>{busy?'⏳':'➤'}</button>`
);

fs.writeFileSync('public/mobile-app.js', appJs);
console.log('Updated mobile-app.js');

// 3. Compile React
console.log('Compiling React...');
try {
    execSync('npx babel public/mobile-app.js --out-file public/mobile-app.compiled.js --presets @babel/preset-react');
    console.log('React compiled successfully.');
} catch (e) {
    console.error('Babel compilation failed:', e.message);
}

// 4. Update CSS in mobile-style.css
let css = fs.readFileSync('public/mobile-style.css', 'utf8');

const additionalCss = `
/* ========================================================
   UPGRADED CHAT UI (PILL + CRISP BACKGROUND)
======================================================== */
.chat-layout {
    background: url('assets/chat-bg-highres.png') center/cover no-repeat !important;
    background-attachment: scroll !important;
    min-height: 100vh;
}

@media (max-width: 900px) {
    .chat-layout .chat-head {
        background: rgba(10, 15, 35, 0.8) !important;
        backdrop-filter: blur(10px);
    }
    
    .chat-layout .chat-box {
        background: transparent !important;
        height: calc(100vh - 190px) !important; /* Adjust for pill */
    }

    .chat-layout .bubble-body {
        backdrop-filter: blur(8px);
        box-shadow: 0 4px 15px rgba(0,0,0,0.2) !important;
    }
    
    /* PILL COMPOSER */
    .chat-layout .composer.chat-pill-composer {
        position: fixed !important;
        bottom: 85px !important; /* Above bottom nav */
        left: 15px !important;
        right: 15px !important;
        border-radius: 30px !important; /* Perfect Pill */
        background: rgba(30, 32, 50, 0.95) !important;
        border: 1px solid rgba(255,255,255,0.15) !important;
        padding: 6px 6px 6px 12px !important;
        backdrop-filter: blur(15px) !important;
        display: flex !important;
        flex-direction: row !important;
        align-items: flex-end !important;
        gap: 6px !important;
    }
    
    .chat-layout .composer.chat-pill-composer textarea {
        flex: 1 1 0% !important;
        background: transparent !important;
        border: none !important;
        color: #fff !important;
        padding: 6px 4px !important;
        height: auto !important;
        min-height: 24px !important;
        max-height: 120px !important;
        line-height: 24px !important;
        margin: 0 !important;
        font-size: 15px !important;
    }
    
    .chat-layout .composer.chat-pill-composer .pill-send-btn {
        background: linear-gradient(135deg, #fcebb6, #dca054) !important;
        color: #1a1a2e !important;
        border-radius: 50% !important;
        width: 36px !important;
        height: 36px !important;
        min-width: 36px !important;
        padding: 0 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-size: 16px !important;
    }
    
    /* Markdown enhancements inside chat */
    .chat-layout .bubble-body table { width: 100%; border-collapse: collapse; margin: 10px 0; }
    .chat-layout .bubble-body th, .chat-layout .bubble-body td { border: 1px solid rgba(255,255,255,0.2); padding: 8px; }
    .chat-layout .bubble-body th { background: rgba(255,255,255,0.1); }
}
`;

if (!css.includes('UPGRADED CHAT UI')) {
    css += '\n' + additionalCss;
    fs.writeFileSync('public/mobile-style.css', css);
    console.log('Updated mobile-style.css');
}

let sw = fs.readFileSync('public/service-worker.js', 'utf8');
sw = sw.replace(/v[0-9]+-[a-zA-Z0-9-]+/, 'v18-react-chat-upgrade');
fs.writeFileSync('public/service-worker.js', sw);
console.log('Busted cache.');
