const fs = require('fs');

let css = fs.readFileSync('public/style.css', 'utf8');

const injection = `
/* ========================================================
   RESTORED CLEAN MOBILE UI FOR UNIFIED APP
======================================================== */
@media (max-width: 900px) {
  /* 1. Remove Top Gap & Clean Banner (Zero Top Margin) */
  body {
    margin: 0 !important;
    padding: 0 !important;
  }
  .app {
    padding: 0 !important;
  }
  .hero-section {
    margin-top: 0 !important;
    border-radius: 0 0 35px 35px !important;
    min-height: auto !important;
    padding-bottom: 25px !important;
  }
  .hero-center {
    padding-top: 15px !important;
  }
  .hero-left {
    left: -15px !important;
  }
  .hero-right {
    right: -15px !important;
  }

  /* 2. Google-Style Inline Search Bar */
  .search-shell {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    background: #ffffff !important;
    border: none !important;
    border-radius: 999px !important;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4) !important;
    padding: 6px 6px 6px 20px !important;
    max-width: 90% !important;
    margin: 15px auto 5px !important;
  }
  .search-shell span {
    display: none !important; /* Hide the weird icon on mobile to save space */
  }
  .search-shell input {
    flex: 1 1 auto !important;
    background: transparent !important;
    color: #333 !important;
    font-size: 15px !important;
    padding: 10px 0 !important;
    border: none !important;
    min-height: 0 !important;
  }
  .search-shell input::placeholder {
    color: #888 !important;
  }
  .search-shell button {
    flex: 0 0 auto !important;
    width: auto !important;
    min-width: 0 !important;
    background: #f1f3f4 !important;
    color: #1a73e8 !important;
    border-radius: 999px !important;
    padding: 12px 20px !important;
    font-size: 14px !important;
    font-weight: 700 !important;
    margin-left: 8px !important;
  }

  /* 3. Clean Dashboard & Square Feature Cards */
  .dashboard-grid {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important; /* 2 columns */
    gap: 14px !important;
    padding: 14px !important;
  }
  .feature-card.wide {
    grid-column: span 1 !important; /* Force them to be 1 column each */
    aspect-ratio: 1 / 1 !important; /* Perfect square */
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
    align-items: center !important;
    text-align: center !important;
    padding: 16px !important;
    background: rgba(10,20,48,.95) !important;
    border: 1px solid rgba(255,255,255,0.15) !important; /* Clean border, no neon */
    border-radius: 20px !important;
  }
  .feature-card h2 {
    font-size: 16px !important;
    margin-bottom: 8px !important;
  }
  .feature-card h2 em {
    display: none !important; /* Hide 'PRO' tag on mobile square cards to save space */
  }
  .feature-card p {
    font-size: 12px !important;
    line-height: 1.4 !important;
    display: -webkit-box !important;
    -webkit-line-clamp: 3 !important;
    -webkit-box-orient: vertical !important;
    overflow: hidden !important;
  }
  .feature-card button {
    display: none !important; /* Hide the button inside square cards, whole card is clickable */
  }
  .feature-card .card-art {
    display: none !important; /* Hide background watermark art on square cards */
  }

  /* 4. Remove Neon Pink Borders on Feature Tabs (if any exist) */
  .feature-tabs .tab-card {
    border: 1px solid rgba(255,255,255,0.15) !important;
    background: rgba(255,255,255,0.1) !important;
    box-shadow: none !important;
    border-radius: 14px !important;
  }
}
`;

css += '\n' + injection;
fs.writeFileSync('public/style.css', css);
console.log('Mobile UI Restored');
