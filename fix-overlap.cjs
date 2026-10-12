const fs = require('fs');

// 1. Update index.html
let html = fs.readFileSync('public/index.html', 'utf8');

// Inject the mystic mobile header into the chat page
const mysticHeader = `
            <div class="mobile-mystic-header">
              <button class="icon-btn menu-btn" onclick="toggleMenu(true)">☰</button>
              <div class="center-brand">
                <span class="moon-logo">🌙</span>
                <h2>Đặng Năm AI</h2>
                <p>AI Chat</p>
              </div>
              <button class="icon-btn user-btn">👤</button>
            </div>
            <div class="mobile-mystic-tabs">
              <button onclick="routeTo('deep')">✨ Tử vi</button>
              <button onclick="routeTo('love')">🤍 Tình duyên</button>
              <button class="active">💬 Chat AI</button>
            </div>
`;

if (!html.includes('mobile-mystic-header')) {
    html = html.replace('<div class="chat-pro-main">', '<div class="chat-pro-main">' + mysticHeader);
    fs.writeFileSync('public/index.html', html);
    console.log('Injected mobile-mystic-header into index.html');
}

// 2. Update style.css
let css = fs.readFileSync('public/style.css', 'utf8');

const updatedCss = `
/* ========================================================
   MYSTIC NIGHT THEME (MOBILE ONLY) - V2 (FIXED OVERLAP)
======================================================== */
@media (max-width: 900px) {
  /* 1. Global Background for Chat Route */
  body[data-route="chat"] {
    background: url('assets/chat-bg.jpg') center/cover no-repeat fixed !important;
    color: #fff !important;
  }
  
  /* HIDE the default dashboard banner (hero-section) when in Chat */
  body[data-route="chat"] .hero-section {
    display: none !important;
  }

  /* Make all panels transparent so background shows through */
  body[data-route="chat"] .app,
  body[data-route="chat"] .chat-pro-shell,
  body[data-route="chat"] .chat-pro-main,
  body[data-route="chat"] .chat-pro-sidebar,
  body[data-route="chat"] .pro-chat-log {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
  }

  /* Hide messy desktop header actions and sidebars */
  body[data-route="chat"] .chat-pro-sidebar,
  body[data-route="chat"] .chat-pro-head,
  body[data-route="chat"] .chat-head-actions,
  body[data-route="chat"] .chat-mobile-settings {
    display: none !important;
  }

  /* 2. Mystic Mobile Header */
  .mobile-mystic-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 15px 20px 5px;
  }
  .mobile-mystic-header .menu-btn,
  .mobile-mystic-header .user-btn {
    background: transparent;
    border: none;
    color: #fff;
    font-size: 24px;
    padding: 10px;
  }
  .mobile-mystic-header .user-btn {
    font-size: 20px;
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }
  .mobile-mystic-header .center-brand {
    text-align: center;
    margin-top: 5px;
  }
  .mobile-mystic-header .moon-logo {
    font-size: 22px;
    display: block;
    margin-bottom: 2px;
  }
  .mobile-mystic-header h2 {
    font-family: "Times New Roman", Times, serif;
    font-size: 24px;
    color: #f7d896;
    font-weight: 500;
    margin: 0;
    letter-spacing: 1px;
  }
  .mobile-mystic-header p {
    color: #a3b8cc;
    font-size: 13px;
    margin: 4px 0 0;
  }

  /* 3. Segmented Control Tabs */
  .mobile-mystic-tabs {
    display: flex;
    background: rgba(20, 25, 45, 0.4);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 999px;
    padding: 5px;
    margin: 15px auto 25px;
    max-width: 90%;
    backdrop-filter: blur(10px);
  }
  .mobile-mystic-tabs button {
    flex: 1;
    background: transparent;
    color: #a3b8cc;
    border: none;
    border-radius: 999px;
    padding: 10px 0;
    font-size: 13px;
    font-weight: 500;
  }
  .mobile-mystic-tabs button.active {
    background: linear-gradient(135deg, #fcebb6, #dca054);
    color: #1a1a2e;
    font-weight: 700;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  }

  /* 4. Chat Bubbles */
  body[data-route="chat"] .pro-chat-log {
    height: calc(100vh - 280px) !important;
    padding: 0 15px !important;
    overflow-y: auto !important;
  }
  body[data-route="chat"] .pro-chat-log .msg {
    max-width: 82% !important;
    padding: 12px 18px !important;
    border-radius: 20px !important;
    font-size: 15px !important;
    line-height: 1.5 !important;
    backdrop-filter: blur(10px) !important;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2) !important;
    margin: 10px 0 !important;
  }
  body[data-route="chat"] .pro-chat-log .msg.me {
    background: rgba(73, 76, 110, 0.85) !important;
    border: 1px solid rgba(255,255,255,0.08) !important;
    border-bottom-right-radius: 4px !important;
    color: #fff !important;
    float: right !important;
    clear: both !important;
  }
  body[data-route="chat"] .pro-chat-log .msg:not(.me) {
    background: rgba(30, 32, 50, 0.85) !important;
    border: 1px solid rgba(247, 216, 150, 0.15) !important;
    border-bottom-left-radius: 4px !important;
    color: #e2e8f0 !important;
    float: left !important;
    clear: both !important;
  }
  body[data-route="chat"] .msg-role {
    color: #dca054 !important;
    font-size: 11px !important;
    text-transform: uppercase !important;
    margin-bottom: 6px !important;
    display: flex !important;
    align-items: center !important;
    gap: 6px !important;
  }
  
  /* Fix scroll float issue */
  body[data-route="chat"] .pro-chat-log::after {
    content: '';
    display: block;
    clear: both;
    height: 10px;
  }

  /* 5. Input Bar */
  body[data-route="chat"] .pro-input {
    background: rgba(30, 32, 50, 0.85) !important;
    border: 1px solid rgba(255,255,255,0.1) !important;
    border-radius: 999px !important;
    padding: 5px 15px !important;
    margin: 10px 15px 25px !important;
    backdrop-filter: blur(15px) !important;
    display: flex !important;
    align-items: center !important;
    gap: 8px !important;
    position: fixed !important;
    bottom: 0 !important;
    left: 0 !important;
    right: 0 !important;
    width: auto !important;
    z-index: 100 !important;
  }
  body[data-route="chat"] .pro-input textarea {
    flex: 1 !important;
    background: transparent !important;
    border: none !important;
    color: #fff !important;
    font-size: 15px !important;
    padding: 12px 0 !important;
    min-height: 20px !important;
    max-height: 80px !important;
    box-shadow: none !important;
    outline: none !important;
  }
  body[data-route="chat"] .pro-input textarea::placeholder {
    color: #7a8c9e !important;
  }
  body[data-route="chat"] .pro-input button,
  body[data-route="chat"] .pro-input label.upload-btn {
    background: transparent !important;
    border: none !important;
    color: #a3b8cc !important;
    box-shadow: none !important;
    width: 36px !important;
    height: 36px !important;
    font-size: 18px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  /* Send Button Gold */
  body[data-route="chat"] .pro-input #chatSendBtn {
    background: linear-gradient(135deg, #fcebb6, #dca054) !important;
    color: #1a1a2e !important;
    border-radius: 50% !important;
    width: 40px !important;
    height: 40px !important;
  }
  body[data-route="chat"] .pro-input #chatSendBtn::before {
    content: '➤' !important;
    font-size: 18px !important;
  }

  /* Hide Bottom Nav on Chat to match screenshot */
  body[data-route="chat"] .bottom-nav {
    display: none !important;
  }
}
/* Hide the mystic header on desktop */
@media (min-width: 901px) {
  .mobile-mystic-header,
  .mobile-mystic-tabs {
    display: none !important;
  }
}
`;

// Remove the old injection
css = css.replace(/\/\* ========================================================\n   MYSTIC NIGHT THEME.*?}\n}/s, '');

css += '\n' + updatedCss;
fs.writeFileSync('public/style.css', css);

let sw = fs.readFileSync('public/service-worker.js', 'utf8');
sw = sw.replace(/v6-mystic-theme/, 'v7-mystic-fixed');
fs.writeFileSync('public/service-worker.js', sw);

console.log('Mobile Mystic Theme Fixed');
