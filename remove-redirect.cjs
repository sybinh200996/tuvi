const fs = require('fs');

let html = fs.readFileSync('public/index.html', 'utf8');

const targetStr = `if (isMobile && !forceDesktop && !location.pathname.endsWith('/mobile.html')) {
        location.replace('mobile.html');
      }`;

html = html.replace(targetStr, `// Redirect removed. Return to unified index.html app!`);

fs.writeFileSync('public/index.html', html);
console.log('Redirect removed');
