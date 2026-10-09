const fs = require('fs');

let css = fs.readFileSync('public/style.css', 'utf8');

const updatedCss = `
/* ========================================================
   MYSTIC NIGHT THEME (MOBILE ONLY) - V6 (PERFECT INPUT)
======================================================== */
@media (max-width: 900px) {
  /* 1. Global Background (Pseudo element for absolute crispness) */
  html[data-route="chat"],
  body[data-route="chat"] {
    background: #070e23 !important; 
    color: #fff !important;
    height: 100dvh !important;
    width: 100vw !important;
    overflow: hidden !important;
    position: fixed !important;
    top: 0; left: 0;
  }
  
  body[data-route="chat"]::before {
    content: '';
    position: fixed !important;
    top: 0; left: 0; right: 0; bottom: 0;
    /* Use the exact high-res image provided by the user */
    background: url('assets/chat-bg-highres.png') center/cover no-repeat !important;
    z-index: -1 !important;
    pointer-events: none !important;
  }
  
  /* HIDE specific elements outside of Chat */
  body[data-route="chat"] .hero-section,
  body[data-route="chat"] .feature-tabs-wrap,
  body[data-route="chat"] .voice-status,
  body[data-route="chat"] .chat-pro-sidebar,
  body[data-route="chat"] .chat-pro-head,
  body[data-route="chat"] .chat-head-actions,
  body[data-route="chat"] .chat-mobile-settings {
    display: none !important;
  }

  /* SHOW Bottom Nav explicitly */
  body[data-route="chat"] .bottom-nav {
    display: grid !important;
  }

  /* Transparent panels */
  body[data-route="chat"] .app,
  body[data-route="chat"] .chat-pro-shell,
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
  
  /* Make main container leave space for bottom nav */
  body[data-route="chat"] .chat-pro-main {
    flex: 1 !important;
    display: flex !important;
    flex-direction: column !important;
    height: 100dvh !important;
    padding-bottom: 85px !important; /* Space for bottom nav */
    background: transparent !important;
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

  /* 6. Input Bar Pill - ChatGPT Style (Short & Compact) */
  body[data-route="chat"] .pro-input {
    flex: 0 0 auto !important;
    background: rgba(30, 32, 50, 0.95) !important;
    border: 1px solid rgba(255,255,255,0.15) !important;
    border-radius: 24px !important; /* Perfect Pill */
    padding: 6px 6px 6px 12px !important;
    margin: 0 15px 15px !important; /* Spacing above bottom nav */
    backdrop-filter: blur(15px) !important;
    
    /* Strict layout to prevent scattering */
    display: flex !important;
    flex-direction: row !important;
    align-items: flex-end !important; /* Align to bottom for tall textareas */
    justify-content: flex-start !important;
    gap: 4px !important;
    position: relative !important;
  }
  
  body[data-route="chat"] .pro-input textarea {
    flex: 1 1 0% !important; /* Take remaining space */
    background: transparent !important;
    border: none !important;
    color: #fff !important;
    font-size: 15px !important;
    padding: 6px 4px !important; /* Very tight padding */
    height: 24px !important; /* Forced small initial height */
    line-height: 24px !important;
    box-shadow: none !important;
    outline: none !important;
    margin: 0 !important;
    resize: none !important;
    overflow-y: hidden !important;
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
  
  /* The Paperclip Icon (Optional decoration if missing real one) */
  body[data-route="chat"] .pro-input::before {
    content: '📎';
    font-size: 20px;
    color: #a3b8cc;
    margin-right: 4px;
    margin-bottom: 6px;
    opacity: 0.8;
  }

  /* Hide extra buttons */
  body[data-route="chat"] .pro-input .quick-voice-btn,
  body[data-route="chat"] .pro-input .quick-stop-btn {
    display: none !important; 
  }

  /* Mic Button styling */
  body[data-route="chat"] .pro-input .voice-btn {
    font-size: 0 !important; 
  }
  body[data-route="chat"] .pro-input .voice-btn::before {
    content: '🎤' !important;
    font-size: 20px !important;
  }

  /* Send Button Gold */
  body[data-route="chat"] .pro-input #chatSendBtn {
    background: linear-gradient(135deg, #fcebb6, #dca054) !important;
    color: #1a1a2e !important;
    border-radius: 50% !important;
    width: 36px !important;
    height: 36px !important;
    min-width: 36px !important;
    font-size: 0 !important;
  }
  body[data-route="chat"] .pro-input #chatSendBtn::before {
    content: '➤' !important;
    font-size: 16px !important;
  }
}
`;

// Remove the old injection block (V5)
css = css.replace(/\/\* ========================================================\n   MYSTIC NIGHT THEME.*?}\n}/s, '');

css += '\n' + updatedCss;
fs.writeFileSync('public/style.css', css);

let sw = fs.readFileSync('public/service-worker.js', 'utf8');
sw = sw.replace(/v11-mystic-chatgpt/, 'v12-mystic-v6');
fs.writeFileSync('public/service-worker.js', sw);

console.log('Mobile Mystic Theme V6 (Perfect Input) Injected');
