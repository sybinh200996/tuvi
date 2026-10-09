const fs = require('fs');

let css = fs.readFileSync('public/mobile-style.css', 'utf8');

// We will append responsive standardizations for all devices
css += `
/* ====================================================
   PERFECT RESPONSIVE & CROSS-DEVICE COMPATIBILITY
   (iPhone, Android, Old & New screens)
==================================================== */
:root {
  --safe-bottom: env(safe-area-inset-bottom, 12px);
}

/* Ensure nothing overflows the screen */
* {
  box-sizing: border-box !important;
  max-width: 100%;
}

html, body {
  overflow-x: hidden;
  width: 100%;
  position: relative;
  touch-action: manipulation; /* Fix click delays on old mobile browsers */
}

/* Intelligent bottom nav adapting to iPhone notches and standard Androids */
@media (max-width: 768px) {
  .bottom-nav {
    /* Use env() for iOS notch support, fallback to 12px for standard phones */
    padding-bottom: calc(8px + var(--safe-bottom)) !important;
    padding-top: 8px !important;
  }
  
  /* Feature cards adaptive text to prevent cutoff on small screens */
  .feature-card {
    word-break: break-word;
    overflow: hidden;
  }
  
  .feature-card h3 {
    font-size: clamp(13px, 4vw, 15px) !important;
  }
  
  .feature-card p {
    font-size: clamp(10px, 3vw, 12px) !important;
  }
  
  .bottom-nav button small {
    font-size: clamp(9px, 2.5vw, 11px) !important;
  }
}

/* Specific fixes for very narrow phones (iPhone SE, old Androids <= 375px) */
@media (max-width: 380px) {
  .home-grid {
    gap: 8px !important;
  }
  
  .feature-card {
    padding: 12px !important;
    min-height: 120px !important;
  }
  
  .hero h1 {
    font-size: 26px !important;
  }
  
  .tab-rail button {
    min-width: 80px !important;
    font-size: 11px !important;
    padding: 6px !important;
  }
}
`;

fs.writeFileSync('public/mobile-style.css', css);
console.log("Responsive fixes applied!");
