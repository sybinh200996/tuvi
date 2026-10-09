const fs = require('fs');

let css = fs.readFileSync('public/style.css', 'utf8');

const updatedCss = `
/* ========================================================
   MYSTIC NIGHT THEME (MOBILE ONLY) - V4 (CRISP BG + FIX BUTTONS)
======================================================== */
@media (max-width: 900px) {
  /* 1. Global Background (REMOVED FIXED TO PREVENT BLUR ON MOBILE) */
  html[data-route="chat"],
  body[data-route="chat"] {
    background: url('assets/chat-bg.jpg') center/cover no-repeat !important; /* No 'fixed' */
    background-color: #070e23 !important;
    color: #fff !important;
    height: 100dvh !important;
    width: 100vw !important;
    overflow: hidden !important;
    position: fixed !important;
    top: 0; left: 0;
  }
  
  /* HIDE everything else outside of Chat */
  body[data-route="chat"] .hero-section,
  body[data-route="chat"] .feature-tabs-wrap,
  body[data-route="chat"] .bottom-nav,
  body[data-route="chat"] .voice-status,
  body[data-route="chat"] .chat-pro-sidebar,
  body[data-route="chat"] .chat-pro-head,
  body[data-route="chat"] .chat-head-actions,
  body[data-route="chat"] .chat-mobile-settings {
    display: none !important;
  }

  /* Transparent panels */
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
    height: 100dvh !important;
    display: flex !important;
    flex-direction: column !important;
  }
  body[data-route="chat"] .chat-pro-main {
    flex: 1 !important;
    display: flex !important;
    flex-direction: column !important;
    height: 100dvh !important;
    padding-bottom: 20px !important;
  }

  /* 2. Mystic Mobile Header */
  .mobile-mystic-header {
    display: flex !important;
    justify-content: space-between !important;
    align-items: flex-start !important;
    padding: 15px 20px 0px !important;
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
    margin-top: 5px !important;
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
    padding: 10px 0 !important;
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
    padding: 10px 15px 10px !important;
    overflow-y: auto !important;
    scroll-behavior: smooth !important;
    -webkit-overflow-scrolling: touch !important;
  }
  body[data-route="chat"] .pro-chat-log .msg {
    max-width: 85% !important;
    padding: 14px 18px !important;
    border-radius: 20px !important;
    font-size: 15px !important;
    line-height: 1.5 !important;
    backdrop-filter: blur(10px) !important;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2) !important;
    margin: 8px 0 !important;
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
    height: 5px;
  }

  /* 5. Upload Bar (Floating above input pill) */
  body[data-route="chat"] .pro-upload {
    flex: 0 0 auto !important;
    display: flex !important;
    gap: 10px !important;
    padding: 0 15px 5px !important;
    margin: 0 !important;
    overflow-x: auto !important;
    scrollbar-width: none !important;
  }
  body[data-route="chat"] .pro-upload::-webkit-scrollbar {
    display: none !important;
  }
  body[data-route="chat"] .pro-upload .upload-chip,
  body[data-route="chat"] .pro-upload .clear-attachments {
    background: rgba(30, 32, 50, 0.8) !important;
    border: 1px solid rgba(255,255,255,0.2) !important;
    border-radius: 999px !important;
    padding: 6px 12px !important;
    color: #a3b8cc !important;
    font-size: 12px !important;
    white-space: nowrap !important;
    backdrop-filter: blur(10px) !important;
  }

  /* 6. Input Bar Pill */
  body[data-route="chat"] .pro-input {
    flex: 0 0 auto !important;
    background: rgba(30, 32, 50, 0.85) !important;
    border: 1px solid rgba(255,255,255,0.15) !important;
    border-radius: 999px !important;
    padding: 6px 12px !important;
    margin: 0 15px 15px !important;
    backdrop-filter: blur(15px) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    gap: 8px !important;
    position: relative !important;
  }
  
  body[data-route="chat"] .pro-input textarea {
    flex: 1 1 auto !important;
    background: transparent !important;
    border: none !important;
    color: #fff !important;
    font-size: 15px !important;
    padding: 10px 0 !important;
    min-height: 20px !important;
    max-height: 80px !important;
    box-shadow: none !important;
    outline: none !important;
    margin: 0 !important;
  }
  body[data-route="chat"] .pro-input textarea::placeholder {
    color: #7a8c9e !important;
  }

  /* Reset all buttons inside pro-input */
  body[data-route="chat"] .pro-input button {
    flex: 0 0 auto !important;
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
    padding: 0 !important;
    margin: 0 !important;
  }
  
  /* Hide unwanted buttons (keep mic and send) */
  body[data-route="chat"] .pro-input .quick-voice-btn,
  body[data-route="chat"] .pro-input .quick-stop-btn {
    display: none !important; 
  }

  /* Mic Button styling */
  body[data-route="chat"] .pro-input .voice-btn {
    font-size: 0 !important; /* Hide original icon text */
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
    font-size: 0 !important; /* Hide text */
  }
  body[data-route="chat"] .pro-input #chatSendBtn::before {
    content: '➤' !important;
    font-size: 18px !important;
  }
}
`;

// Remove the old injection block (V3)
css = css.replace(/\/\* ========================================================\n   MYSTIC NIGHT THEME.*?}\n}/s, '');

css += '\n' + updatedCss;
fs.writeFileSync('public/style.css', css);

let sw = fs.readFileSync('public/service-worker.js', 'utf8');
sw = sw.replace(/v8-mystic-perfect/, 'v9-mystic-crisp');
fs.writeFileSync('public/service-worker.js', sw);

console.log('Mobile Mystic Theme V4 (Crisp BG & Fixed Buttons) Injected');
