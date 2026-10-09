const fs = require('fs');

let css = fs.readFileSync('public/style.css', 'utf8');

const injection = `
/* ========================================================
   MYSTIC NIGHT THEME (MOBILE ONLY)
======================================================== */
@media (max-width: 900px) {
  /* 1. Global Background for Chat Route */
  body[data-route="chat"] {
    background: url('assets/chat-bg.jpg') center/cover no-repeat fixed !important;
    color: #fff !important;
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
  }

  /* 2. Top Bar Styling (Gold text, centered) */
  body[data-route="chat"] .chat-pro-head {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    text-align: center !important;
    margin-bottom: 20px !important;
  }
  body[data-route="chat"] .chat-pro-head h2 {
    font-family: "Times New Roman", Times, serif !important; /* Elegant serif */
    font-size: 26px !important;
    color: #f7d896 !important; /* Gold */
    font-weight: 500 !important;
    letter-spacing: 1px !important;
    margin: 0 !important;
    text-shadow: 0 2px 10px rgba(0,0,0,0.8) !important;
  }
  body[data-route="chat"] .chat-pro-head p {
    color: #a3b8cc !important;
    font-size: 13px !important;
    margin-top: 4px !important;
  }

  /* Hide messy header actions */
  body[data-route="chat"] .chat-head-actions {
    display: none !important;
  }
  body[data-route="chat"] .chat-mobile-settings {
    display: none !important;
  }

  /* 3. Segmented Control Tabs (Tử vi | Tình duyên | Chat AI) */
  body[data-route="chat"] .chat-mode-tabs {
    display: flex !important;
    background: rgba(20, 25, 45, 0.6) !important;
    border: 1px solid rgba(255,255,255,0.1) !important;
    border-radius: 999px !important;
    padding: 4px !important;
    margin: 0 auto 20px !important;
    max-width: 340px !important;
    backdrop-filter: blur(10px) !important;
  }
  body[data-route="chat"] .chat-mode-tabs button {
    flex: 1 !important;
    background: transparent !important;
    color: #a3b8cc !important;
    border: none !important;
    border-radius: 999px !important;
    padding: 10px 0 !important;
    font-size: 14px !important;
    font-weight: 500 !important;
  }
  /* Active tab: Gold pill */
  body[data-route="chat"] .chat-mode-tabs button.active {
    background: linear-gradient(135deg, #fcebb6, #dca054) !important;
    color: #1a1a2e !important;
    font-weight: 700 !important;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3) !important;
  }

  /* 4. Chat Bubbles */
  body[data-route="chat"] .pro-chat-log {
    padding: 0 14px !important;
  }
  body[data-route="chat"] .pro-chat-log .msg {
    max-width: 85% !important;
    padding: 12px 16px !important;
    border-radius: 20px !important;
    font-size: 15px !important;
    line-height: 1.5 !important;
    backdrop-filter: blur(10px) !important;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2) !important;
  }
  body[data-route="chat"] .pro-chat-log .msg.me {
    background: rgba(65, 70, 100, 0.85) !important; /* Grey/Purple */
    border: 1px solid rgba(255,255,255,0.08) !important;
    border-bottom-right-radius: 4px !important;
    color: #fff !important;
  }
  body[data-route="chat"] .pro-chat-log .msg:not(.me) {
    background: rgba(22, 26, 45, 0.85) !important; /* Dark Navy */
    border: 1px solid rgba(247, 216, 150, 0.15) !important; /* Subtle Gold border */
    border-bottom-left-radius: 4px !important;
    color: #e2e8f0 !important;
  }
  body[data-route="chat"] .msg-role {
    color: #dca054 !important; /* Gold role text */
  }

  /* 5. Input Bar */
  body[data-route="chat"] .pro-input {
    background: rgba(22, 26, 45, 0.85) !important;
    border: 1px solid rgba(255,255,255,0.1) !important;
    border-radius: 999px !important;
    padding: 6px 12px !important;
    margin: 10px 14px 20px !important;
    backdrop-filter: blur(15px) !important;
    display: flex !important;
    align-items: center !important;
    gap: 8px !important;
  }
  body[data-route="chat"] .pro-input textarea {
    background: transparent !important;
    border: none !important;
    color: #fff !important;
    font-size: 15px !important;
    padding: 10px 0 !important;
    min-height: 20px !important;
    max-height: 100px !important;
    box-shadow: none !important;
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
`;

css += '\n' + injection;
fs.writeFileSync('public/style.css', css);

let sw = fs.readFileSync('public/service-worker.js', 'utf8');
sw = sw.replace(/v5-ui-merged/, 'v6-mystic-theme');
fs.writeFileSync('public/service-worker.js', sw);

console.log('Mobile Mystic Theme Injected');
