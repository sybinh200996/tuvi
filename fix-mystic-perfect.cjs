const fs = require('fs');

let css = fs.readFileSync('public/style.css', 'utf8');

const updatedCss = `
/* ========================================================
   MYSTIC NIGHT THEME (MOBILE ONLY) - V3 (EXACT MATCH)
======================================================== */
@media (max-width: 900px) {
  /* 1. Global Background for Chat Route */
  html[data-route="chat"],
  body[data-route="chat"] {
    background: url('assets/chat-bg.jpg') center/cover no-repeat fixed !important;
    background-color: #070e23 !important; /* Fallback */
    color: #fff !important;
    height: 100vh !important;
    overflow: hidden !important;
  }
  
  /* HIDE everything else outside of Chat */
  body[data-route="chat"] .hero-section,
  body[data-route="chat"] .feature-tabs-wrap,
  body[data-route="chat"] .bottom-nav,
  body[data-route="chat"] .voice-status,
  body[data-route="chat"] .pro-upload,
  body[data-route="chat"] .chat-pro-sidebar,
  body[data-route="chat"] .chat-pro-head,
  body[data-route="chat"] .chat-head-actions,
  body[data-route="chat"] .chat-mobile-settings {
    display: none !important;
  }

  /* Make panels transparent */
  body[data-route="chat"] .app,
  body[data-route="chat"] .chat-pro-shell,
  body[data-route="chat"] .chat-pro-main,
  body[data-route="chat"] .pro-chat-log {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  body[data-route="chat"] .chat-pro-shell {
    height: 100vh !important;
    display: flex !important;
    flex-direction: column !important;
  }
  body[data-route="chat"] .chat-pro-main {
    flex: 1 !important;
    display: flex !important;
    flex-direction: column !important;
    height: 100vh !important;
  }

  /* 2. Mystic Mobile Header */
  .mobile-mystic-header {
    display: flex !important;
    justify-content: space-between !important;
    align-items: flex-start !important;
    padding: 20px 20px 5px !important;
    flex: 0 0 auto !important;
  }
  .mobile-mystic-header .menu-btn,
  .mobile-mystic-header .user-btn {
    background: transparent !important;
    border: none !important;
    color: #fff !important;
    font-size: 24px !important;
    padding: 10px !important;
  }
  .mobile-mystic-header .user-btn {
    font-size: 20px !important;
    border: 1px solid rgba(255,255,255,0.3) !important;
    border-radius: 50% !important;
    width: 36px !important;
    height: 36px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 0 !important;
  }
  .mobile-mystic-header .center-brand {
    text-align: center !important;
    margin-top: 5px !important;
  }
  .mobile-mystic-header .moon-logo {
    font-size: 22px !important;
    display: block !important;
    margin-bottom: 2px !important;
  }
  .mobile-mystic-header h2 {
    font-family: "Times New Roman", Times, serif !important;
    font-size: 24px !important;
    color: #f7d896 !important;
    font-weight: 500 !important;
    margin: 0 !important;
    letter-spacing: 1px !important;
  }
  .mobile-mystic-header p {
    color: #a3b8cc !important;
    font-size: 13px !important;
    margin: 4px 0 0 !important;
  }

  /* 3. Segmented Control Tabs */
  .mobile-mystic-tabs {
    display: flex !important;
    background: rgba(20, 25, 45, 0.4) !important;
    border: 1px solid rgba(255,255,255,0.15) !important;
    border-radius: 999px !important;
    padding: 5px !important;
    margin: 15px auto 10px !important;
    width: 90% !important;
    max-width: 380px !important;
    backdrop-filter: blur(10px) !important;
    flex: 0 0 auto !important;
  }
  .mobile-mystic-tabs button {
    flex: 1 !important;
    background: transparent !important;
    color: #a3b8cc !important;
    border: none !important;
    border-radius: 999px !important;
    padding: 12px 0 !important;
    font-size: 14px !important;
    font-weight: 500 !important;
  }
  .mobile-mystic-tabs button.active {
    background: linear-gradient(135deg, #fcebb6, #dca054) !important;
    color: #1a1a2e !important;
    font-weight: 700 !important;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3) !important;
  }

  /* 4. Chat Bubbles */
  body[data-route="chat"] .pro-chat-log {
    flex: 1 1 0 !important;
    padding: 10px 15px 120px !important;
    overflow-y: auto !important;
    scroll-behavior: smooth !important;
  }
  body[data-route="chat"] .pro-chat-log .msg {
    max-width: 82% !important;
    padding: 14px 18px !important;
    border-radius: 20px !important;
    font-size: 15px !important;
    line-height: 1.5 !important;
    backdrop-filter: blur(10px) !important;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2) !important;
    margin: 12px 0 !important;
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
    font-size: 12px !important;
    text-transform: uppercase !important;
    margin-bottom: 6px !important;
    display: flex !important;
    align-items: center !important;
    gap: 6px !important;
  }
  body[data-route="chat"] .pro-chat-log::after {
    content: '';
    display: block;
    clear: both;
    height: 10px;
  }

  /* 5. Input Bar */
  body[data-route="chat"] .pro-input {
    background: rgba(30, 32, 50, 0.95) !important;
    border: 1px solid rgba(255,255,255,0.1) !important;
    border-radius: 999px !important;
    padding: 6px 12px !important;
    margin: 0 !important;
    backdrop-filter: blur(15px) !important;
    display: flex !important;
    align-items: center !important;
    gap: 8px !important;
    position: fixed !important;
    bottom: 25px !important;
    left: 15px !important;
    right: 15px !important;
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
    font-size: 20px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 0 !important;
  }
  
  /* The Paperclip Icon inside pro-input (instead of ugly mic/stop buttons) */
  body[data-route="chat"] .pro-input::before {
    content: '📎';
    font-size: 20px;
    color: #a3b8cc;
    margin-left: 8px;
    margin-right: 4px;
    opacity: 0.8;
  }

  body[data-route="chat"] .pro-input .voice-btn,
  body[data-route="chat"] .pro-input .quick-voice-btn,
  body[data-route="chat"] .pro-input .quick-stop-btn {
    display: none !important; /* Hide extra ugly buttons, keep it super clean */
  }

  body[data-route="chat"] .pro-input .voice-btn {
    display: flex !important; /* Wait, user screenshot has a mic icon. Let's keep one */
    background: transparent !important;
    color: #a3b8cc !important;
    box-shadow: none !important;
  }
  body[data-route="chat"] .pro-input .voice-btn::before {
    content: '🎤' !important;
    font-size: 18px !important;
  }

  /* Send Button Gold */
  body[data-route="chat"] .pro-input #chatSendBtn {
    background: linear-gradient(135deg, #fcebb6, #dca054) !important;
    color: #1a1a2e !important;
    border-radius: 50% !important;
    width: 40px !important;
    height: 40px !important;
    min-width: 40px !important;
    display: flex !important;
  }
  body[data-route="chat"] .pro-input #chatSendBtn::before {
    content: '➤' !important;
    font-size: 18px !important;
  }
}
`;

// Remove the old injection block
css = css.replace(/\/\* ========================================================\n   MYSTIC NIGHT THEME.*?}\n}/s, '');

css += '\n' + updatedCss;
fs.writeFileSync('public/style.css', css);

// Ensure the dataset route updates on html element too so that `html[data-route="chat"]` works.
let appjs = fs.readFileSync('public/app.js', 'utf8');
if(!appjs.includes("document.documentElement.dataset.route=route;")) {
    appjs = appjs.replace("document.body.dataset.route=route;", "document.body.dataset.route=route;\n    document.documentElement.dataset.route=route;");
    fs.writeFileSync('public/app.js', appjs);
}

let sw = fs.readFileSync('public/service-worker.js', 'utf8');
sw = sw.replace(/v7-mystic-fixed/, 'v8-mystic-perfect');
fs.writeFileSync('public/service-worker.js', sw);

console.log('Mobile Mystic Theme Perfected');
