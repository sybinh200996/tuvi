const fs = require('fs');
let css = fs.readFileSync('public/style.css', 'utf8');

const fixCSS = `
/* --- CHAT AI MOBILE REDESIGN (BASED ON IMAGE 1) --- */
@media (max-width: 768px) {
  /* 1. Clear the background of chat containers to show the image */
  body[data-route="chat"] {
    background: url('assets/chat-bg-highres.png') center/cover no-repeat fixed !important;
  }
  body[data-route="chat"] .chat-pro-main,
  body[data-route="chat"] .chat-pro-shell,
  body[data-route="chat"] #page-chat {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    backdrop-filter: none !important;
  }
  
  /* 2. Fix the header from yesterday - make it elegant */
  .mobile-mystic-header {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    padding: 10px 15px 5px !important;
    margin-bottom: 0 !important;
  }
  .mobile-mystic-header h2 {
    color: #ffd700 !important;
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.3) !important;
    font-size: 20px !important;
  }
  .mobile-mystic-header p {
    color: #fff !important;
    opacity: 0.8 !important;
  }
  
  /* 3. The Function Tabs (Tử vi, Tình duyên, Chat AI) -> Like Image 1 */
  .mobile-mystic-tabs {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    background: rgba(255, 255, 255, 0.08) !important;
    backdrop-filter: blur(12px) !important;
    border-radius: 999px !important;
    padding: 4px !important;
    margin: 5px 15px 15px 15px !important;
    border: 1px solid rgba(255,255,255,0.15) !important;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
  }
  .mobile-mystic-tabs button {
    flex: 1 !important;
    background: transparent !important;
    color: #fff !important;
    border: none !important;
    border-radius: 999px !important;
    padding: 8px 5px !important;
    font-size: 13px !important;
    font-weight: 500 !important;
    margin: 0 !important;
    box-shadow: none !important;
    opacity: 0.8 !important;
  }
  .mobile-mystic-tabs button.active {
    background: linear-gradient(135deg, #ffd700, #ffb300) !important;
    color: #000 !important;
    opacity: 1 !important;
    font-weight: 700 !important;
    box-shadow: 0 0 15px rgba(255,215,0,0.3) !important;
  }

  /* 4. Chat Bubbles (Glassmorphism) */
  .pro-chat-log {
    background: transparent !important;
    border: none !important;
    padding: 10px 15px !important;
    height: 60vh !important;
  }
  .pro-chat-log .msg {
    backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255,255,255,0.15) !important;
    color: #fff !important;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
    font-size: 14px !important;
    line-height: 1.5 !important;
    border-radius: 18px !important;
  }
  .pro-chat-log .msg.me {
    background: rgba(255, 215, 0, 0.15) !important;
    border-color: rgba(255, 215, 0, 0.3) !important;
  }
  .pro-chat-log .msg:not(.me) {
    background: rgba(255, 255, 255, 0.08) !important;
  }
  
  /* 5. Hide settings panel & desktop header */
  .chat-mobile-settings, .chat-pro-head {
    display: none !important;
  }

  /* 6. Upload Buttons Bar (Tải ảnh, Tải file...) - Compact horizontal row */
  .chat-upload-bar.pro-upload {
    background: transparent !important;
    border: none !important;
    padding: 0 15px !important;
    margin-bottom: 5px !important;
    display: flex !important;
    gap: 8px !important;
    overflow-x: auto !important;
    box-shadow: none !important;
    scrollbar-width: none !important; /* Firefox */
  }
  .chat-upload-bar.pro-upload::-webkit-scrollbar {
    display: none !important; /* Safari and Chrome */
  }
  .chat-upload-bar.pro-upload .upload-chip, 
  .chat-upload-bar.pro-upload .clear-attachments {
    background: rgba(255,255,255,0.1) !important;
    backdrop-filter: blur(10px) !important;
    border: 1px solid rgba(255,255,255,0.2) !important;
    border-radius: 16px !important;
    padding: 6px 12px !important;
    font-size: 12px !important;
    color: #fff !important;
    white-space: nowrap !important;
    box-shadow: none !important;
    flex-shrink: 0 !important;
  }
  
  /* 7. The Chat Input Bar (Sleek Pill) */
  .chat-input.pro-input {
    background: rgba(30, 30, 40, 0.6) !important;
    backdrop-filter: blur(15px) !important;
    border-radius: 30px !important;
    border: 1px solid rgba(255,255,255,0.2) !important;
    padding: 5px 10px !important;
    margin: 5px 15px 15px 15px !important;
    display: flex !important;
    align-items: center !important;
    gap: 5px !important;
    grid-template-columns: none !important;
    box-shadow: 0 10px 25px rgba(0,0,0,0.3) !important;
    flex-wrap: nowrap !important;
  }
  .chat-input.pro-input textarea {
    background: transparent !important;
    border: none !important;
    color: #fff !important;
    box-shadow: none !important;
    flex: 1 !important;
    padding: 8px !important;
    min-height: 20px !important;
    font-size: 14px !important;
  }
  .chat-input.pro-input button {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    border-radius: 50% !important;
    width: 36px !important;
    height: 36px !important;
    padding: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    color: #ffd700 !important;
    font-size: 18px !important;
    min-height: auto !important;
  }
  .chat-input.pro-input #chatSendBtn {
    background: linear-gradient(135deg, #ffd700, #ffb300) !important;
    color: #000 !important;
    font-size: 0 !important;
    position: relative !important;
    border-radius: 50% !important;
    width: 36px !important;
    height: 36px !important;
    margin: 0 !important;
    flex-shrink: 0 !important;
  }
  .chat-input.pro-input #chatSendBtn::after {
    content: '➤' !important;
    font-size: 16px !important;
    font-weight: bold !important;
  }
}
`;

css += '\n' + fixCSS;
fs.writeFileSync('public/style.css', css);

// Force cache bust in index.html to apply the new style.css instantly
let html = fs.readFileSync('public/index.html', 'utf8');
html = html.replace(/style\.css\?v=\d+/, 'style.css?v=' + Date.now());
fs.writeFileSync('public/index.html', html);
