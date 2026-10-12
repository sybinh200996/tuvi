const fs = require('fs');
const cp = require('child_process');

// 1. Get pure base
let pureBase = fs.readFileSync('pure-base.css', 'utf8');

// 2. Define the PERFECT BANNER block (150px height, no top gap, hidden status, perfect images)
const perfectBanner = `
/* ========================================================
   V35 BANNER PERFECT (150px HEIGHT)
======================================================== */
@media (max-width: 900px) {
  .hero {
    position: relative !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: flex-start !important;
    height: 150px !important;
    min-height: 150px !important;
    max-height: none !important;
    padding: 0 5px 15px !important; 
    border-radius: 0 0 20px 20px !important;
    overflow: hidden !important;
  }
  
  .hero-content {
    position: relative !important;
    z-index: 10 !important;
    width: 100% !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    margin: 0 !important;
    transform: scale(0.85) !important;
    transform-origin: top center !important;
  }

  /* ẨN HOÀN TOÀN TAB SERVER ONLINE NHƯ YÊU CẦU CỦA V35 */
  .status-row {
    display: none !important;
  }

  .hero h1 {
    font-size: 24px !important;
    margin: 5px 0 4px 0 !important;
    text-align: center !important;
  }
  .hero p {
    display: none !important;
  }

  .hero-actions.quick {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 3px !important;
    margin: 0 auto !important;
    width: 100% !important;
  }
  
  .hero-actions.quick button {
    width: 120px !important;
    padding: 3px 8px !important;
    font-size: 10px !important;
    border-radius: 99px !important;
    margin: 0 !important;
    text-align: center !important;
  }

  .hero-search {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    position: relative !important;
    width: 90% !important;
    max-width: 250px !important;
    margin: 6px auto 0 !important;
    padding: 2px !important;
    background: rgba(0,8,40,0.85) !important;
    border: 1px solid rgba(91,225,255,0.4) !important;
    border-radius: 99px !important;
  }
  
  .hero-search input {
    flex: 1 1 auto !important;
    background: transparent !important;
    border: none !important;
    margin: 0 !important;
    padding: 4px 10px !important;
    color: #dbfbff !important;
    font-size: 12px !important;
    width: 100% !important;
  }
  
  .hero-search button {
    flex: 0 0 auto !important;
    margin: 0 !important;
    padding: 4px 10px !important;
    border-radius: 99px !important;
    background: linear-gradient(135deg, rgba(16,227,255,1), rgba(18,78,214,1)) !important;
    border: none !important;
    color: #fff !important;
    font-size: 11px !important;
  }

  /* ẢNH FADE EDGES CỦA V35 GỐC */
  .hero-img.hero-left, .hero-img.hero-right {
    position: absolute !important;
    height: 100% !important;
    width: 42% !important; 
    max-width: 42% !important;
    top: 0 !important; 
    bottom: 0 !important; 
    opacity: 0.9 !important;
    z-index: 1 !important;
  }
  
  .hero-img.hero-left { 
    left: 0 !important; 
    -webkit-mask-image: linear-gradient(to right, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%) !important;
    mask-image: linear-gradient(to right, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%) !important;
  } 
  
  .hero-img.hero-right { 
    right: 0 !important; 
    -webkit-mask-image: linear-gradient(to left, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%) !important;
    mask-image: linear-gradient(to left, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%) !important;
  }

  /* KHÔI PHỤC LẠI OBJECT-POSITION TOP CENTER NHƯ V35 GỐC */
  .hero-img.hero-left img, .hero-img.hero-right img {
    object-fit: cover !important; 
    object-position: top center !important; 
    width: 100% !important;
    height: 100% !important;
  }
}
`;

// 3. Define the CHAT UI block
const chatUI = `
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

// Assemble the final CSS
let finalCSS = pureBase + '\n' + perfectBanner + '\n' + chatUI;
fs.writeFileSync('public/mobile-style.css', finalCSS);
console.log('Final CSS assembled.');

// Bust SW Cache
let sw = fs.readFileSync('public/service-worker.js', 'utf8');
sw = sw.replace(/const CACHE = "[^"]+";/, 'const CACHE = "v43-ultimate-fix-' + Date.now() + '";');
fs.writeFileSync('public/service-worker.js', sw);

// Bust HTML Cache
let html = fs.readFileSync('public/mobile.html', 'utf8');
html = html.replace(/mobile-style\.css\?v=\d+/, 'mobile-style.css?v=' + Date.now());
fs.writeFileSync('public/mobile.html', html);
console.log('Cache busted.');

