const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');
// First standard replace without regex logic complexity
html = html.replace('href="style.css"', 'href="style.css?v=' + Date.now() + '"');
// Or if it already has a version string like href="style.css?v=123"
html = html.replace(/href="style\.css\?v=\d+"/, 'href="style.css?v=' + Date.now() + '"');
fs.writeFileSync('public/index.html', html);
