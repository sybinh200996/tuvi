const fs = require('fs');

let css = fs.readFileSync('public/mobile-style.css', 'utf8');

const updatedBannerCss = `
/* ========================================================
   BANNER ADJUSTMENTS: VERTICAL TABS & INLINE SEARCH BUTTON
======================================================== */
@media (max-width: 900px) {
  /* 1. Vertical tabs in the middle */
  .hero-actions.quick {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    gap: 8px !important;
    margin: 10px auto !important;
    width: 100% !important;
  }
  .hero-actions.quick button {
    width: auto !important;
    min-width: 180px !important; /* Rút ngắn khung tab lại cho hợp lý */
    max-width: 250px !important;
    padding: 9px 15px !important;
    font-size: 12px !important;
  }

  /* 2. Button inside input box */
  .hero-search {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    position: relative !important;
    width: 90% !important;
    max-width: 320px !important;
    margin: 15px auto !important;
    padding: 3px !important;
    background: rgba(0,8,40,0.85) !important;
    border: 1px solid rgba(91,225,255,0.4) !important;
    border-radius: 99px !important;
    box-shadow: inset 0 2px 10px rgba(0,0,0,0.5) !important;
  }
  .hero-search input {
    flex: 1 1 auto !important;
    background: transparent !important;
    border: none !important;
    margin: 0 !important;
    padding: 10px 15px !important;
    color: #dbfbff !important;
    font-size: 13px !important;
    width: 100% !important;
  }
  .hero-search button {
    flex: 0 0 auto !important;
    margin: 0 !important;
    padding: 10px 16px !important;
    border-radius: 99px !important;
    background: linear-gradient(135deg, rgba(16,227,255,0.9), rgba(18,78,214,0.9)) !important;
    border: none !important;
    color: #fff !important;
    font-weight: bold !important;
    font-size: 12px !important;
    white-space: nowrap !important;
    width: auto !important;
    box-shadow: 0 2px 8px rgba(0,221,255,0.4) !important;
  }
}
`;

css += '\n' + updatedBannerCss;
fs.writeFileSync('public/mobile-style.css', css);

let sw = fs.readFileSync('public/service-worker.js', 'utf8');
sw = sw.replace(/v[0-9]+-[a-zA-Z0-9-]+/, 'v22-banner-vertical');
fs.writeFileSync('public/service-worker.js', sw);
console.log('Done.');
