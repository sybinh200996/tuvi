const fs = require('fs');

// 1. UPDATE index.html (Add CDN for marked and DOMPurify)
let html = fs.readFileSync('public/index.html', 'utf8');
const cdnScripts = `
    <!-- Premium Chat Upgrades -->
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/dompurify/dist/purify.min.js"></script>
`;
if (!html.includes('marked.min.js')) {
    html = html.replace('</head>', cdnScripts + '</head>');
    fs.writeFileSync('public/index.html', html);
    console.log('Injected marked.js and DOMPurify into index.html');
}

// 2. UPDATE app.js (Improve markdownish and add Copy button)
let appjs = fs.readFileSync('public/app.js', 'utf8');

// A function to replace markdownish
const newMarkdownish = `function markdownish(text=''){
    if (typeof marked !== 'undefined' && typeof DOMPurify !== 'undefined') {
      try {
        const rawHtml = marked.parse(text);
        return DOMPurify.sanitize(rawHtml);
      } catch(e) {
        console.error("Markdown parse error:", e);
      }
    }
    // Fallback if CDN fails
    text=String(text||'').replace(/\\n/g,'\\n').replace(/\\r/g,'');
    const inline=s=>escapeHtml(String(s||'')).replace(/\\*\\*(.+?)\\*\\*/g,'<strong>$1</strong>').replace(/_(.+?)_/g,'<em>$1</em>');
    let inList=false, out='';
    String(text||'').split('\\n').forEach(raw=>{
      const line=raw.trim();
      if(!line){ if(inList){out+='</ul>';inList=false} return; }
      if(line.startsWith('### ')){ if(inList){out+='</ul>';inList=false} out+='<h3>'+inline(line.slice(4))+'</h3>'; return; }
      if(line.startsWith('## ')){ if(inList){out+='</ul>';inList=false} out+='<h2>'+inline(line.slice(3))+'</h2>'; return; }
      if(line.startsWith('- ')){ if(!inList){out+='<ul>';inList=true} out+='<li>'+inline(line.slice(2))+'</li>'; return; }
      if(inList){out+='</ul>';inList=false}
      out+='<p>'+inline(line)+'</p>';
    });
    if(inList) out+='</ul>';
    return out;
  }
  
  window.copyText = function(btn) {
    const msgDiv = btn.closest('.msg');
    const content = msgDiv.innerText.replace('📋 Copy', '').replace('🤖 Đặng Năm AI', '').trim();
    navigator.clipboard.writeText(content).then(() => {
      const old = btn.innerHTML;
      btn.innerHTML = '✅ Đã chép';
      setTimeout(() => btn.innerHTML = old, 2000);
    });
  }`;

// Replace the old markdownish function
appjs = appjs.replace(/function markdownish.*?return out;\n  }/s, newMarkdownish);

// Inject Copy button into AI messages (line 598)
appjs = appjs.replace(
    /\$\('typing'\)\.outerHTML=`<div class="msg ai-msg"><span class="msg-role">🤖 Đặng Năm AI<\/span>\$\{markdownish\(text\)\}<\/div>`;/g,
    `$('typing').outerHTML=\`<div class="msg ai-msg fade-in"><div class="msg-header"><span class="msg-role">🤖 Đặng Năm AI</span><button class="copy-btn" onclick="copyText(this)">📋 Copy</button></div>\${markdownish(text)}</div>\`;`
);

fs.writeFileSync('public/app.js', appjs);
console.log('Upgraded app.js with marked.js and copy feature');

// 3. UPDATE style.css (Add animations and Markdown styling)
let css = fs.readFileSync('public/style.css', 'utf8');

const newCss = `
/* ========================================================
   PREMIUM CHAT FEATURES
======================================================== */
.fade-in {
  animation: fadeInMsg 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}
@keyframes fadeInMsg {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

.msg-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  padding-bottom: 6px;
}

.copy-btn {
  background: rgba(255,255,255,0.1) !important;
  border: 1px solid rgba(255,255,255,0.15) !important;
  color: #a3b8cc !important;
  border-radius: 12px !important;
  padding: 4px 10px !important;
  font-size: 11px !important;
  cursor: pointer !important;
  transition: all 0.2s !important;
}
.copy-btn:hover {
  background: rgba(255,255,255,0.2) !important;
  color: #fff !important;
}

/* Markdown Standard Styling within msg */
.msg ul, .msg ol {
  padding-left: 20px;
  margin: 10px 0;
}
.msg li {
  margin-bottom: 6px;
}
.msg p {
  margin: 8px 0;
}
.msg pre {
  background: rgba(0,0,0,0.4);
  padding: 12px;
  border-radius: 10px;
  overflow-x: auto;
  border: 1px solid rgba(255,255,255,0.1);
  font-family: monospace;
}
.msg code {
  background: rgba(255,255,255,0.15);
  padding: 2px 5px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 13px;
}
.msg table {
  width: 100%;
  border-collapse: collapse;
  margin: 10px 0;
}
.msg th, .msg td {
  border: 1px solid rgba(255,255,255,0.2);
  padding: 8px;
  text-align: left;
}
.msg th {
  background: rgba(255,255,255,0.1);
}
`;

if (!css.includes('PREMIUM CHAT FEATURES')) {
    css += '\n' + newCss;
    fs.writeFileSync('public/style.css', css);
    console.log('Injected premium CSS');
}

let sw = fs.readFileSync('public/service-worker.js', 'utf8');
sw = sw.replace(/v9-mystic-crisp/, 'v10-premium-chat');
fs.writeFileSync('public/service-worker.js', sw);
