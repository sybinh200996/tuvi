const fs = require('fs');

let html = fs.readFileSync('public/index.html', 'utf8');

const redirectScript = `
    <script>
      // NAM45 Hybrid: Desktop dùng giao diện file 1, Mobile dùng giao diện file 2.
      (function(){
        var params = new URLSearchParams(location.search);
        var forceDesktop = params.get('desktop') === '1';
        var isMobile = window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
        if (isMobile && !forceDesktop && !location.pathname.endsWith('/mobile.html')) {
          location.replace('mobile.html');
        }
      })();
    </script>
`;

if (!html.includes('NAM45 Hybrid')) {
    html = html.replace('<title>', redirectScript + '    <title>');
    fs.writeFileSync('public/index.html', html);
    console.log('Injected mobile redirect script.');
} else {
    console.log('Mobile redirect script already present.');
}

let sw = fs.readFileSync('public/service-worker.js', 'utf8');
sw = sw.replace(/v15-mystic-bg-fix/, 'v16-revert-mobile');
fs.writeFileSync('public/service-worker.js', sw);

// Remove the CSS overrides from style.css that applied to mobile (since we don't need them anymore)
let css = fs.readFileSync('public/style.css', 'utf8');
css = css.replace(/\/\* ========================================================\n   MYSTIC NIGHT THEME.*?}\n}/s, '/* Mobile theme reverted */');
fs.writeFileSync('public/style.css', css);

console.log('Done.');
